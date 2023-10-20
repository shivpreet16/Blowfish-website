from flask import Flask, request, jsonify, send_from_directory,send_file, Response
from blowfish import Blowfish
from PIL import Image
import numpy as np
import os
from flask_cors import CORS
import io
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId
import pickle

app = Flask(__name__)
CORS(app)

mongoURI = os.environ.get('MONGO_URI')
client = MongoClient(mongoURI, server_api=ServerApi('1'))
def getDatabase():
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)
    return client.BlowfishImages


@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory('static', filename)

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    image = request.files['image']

    if image.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    img = Image.open(image)
    img_array = np.array(img)
    print(img_array)

    return jsonify({'no error': 'ok'}), 200

@app.route('/encrypt', methods=['POST'])
def encrypt_data():
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    image = request.files['image']

    if image.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    img = Image.open(image)
    img_array = np.array(img)
    blowfish = Blowfish(request.form.get('key'))

    
    encrypted_array = np.zeros_like(img_array, dtype=np.uint64)
    for i in range(img_array.shape[0]):
        for j in range(img_array.shape[1]):
            for k in range(img_array.shape[2]):
                encrypted_array[i][j][k]=(blowfish.blowFish_encrypt(int(img_array[i][j][k])))
    client=getDatabase()
    serialized_array = pickle.dumps(encrypted_array)

    dic = {"encryptedArray": serialized_array}
    collection = client["encryptedArrays"]
    x = collection.insert_one(dic)
    print(x.inserted_id)

    return jsonify({'data': str(x.inserted_id)}), 200


@app.route('/decrypt', methods=['POST'])
def decrypt_data():
    data = request.form.get('data')
    blowfish = Blowfish(request.form.get('key'))
    client = getDatabase()
    collection = client["encryptedArrays"]
    retrieved_doc = collection.find_one({"_id": ObjectId(data)})
    retrieved_data = retrieved_doc['encryptedArray']
    img_array = pickle.loads(retrieved_data)
    decrypted_array = np.zeros_like(img_array, dtype=np.uint8)
    for i in range(img_array.shape[0]):
        for j in range(img_array.shape[1]):
            for k in range(img_array.shape[2]):
                decrypted_array[i][j][k]=(blowfish.blowFish_decrypt(int(img_array[i][j][k])))
    print(decrypted_array)


    img=Image.fromarray(decrypted_array)
    output_dir=os.path.dirname(__file__)
    image_filename="decrypted.png"
    img_path=os.path.join(output_dir,image_filename)
    img.save(img_path,format='PNG')
    img.save('A:/blowfish/server/temp.png')
    image_data = io.BytesIO()
    img.save(image_data, format='PNG')
    return Response(image_data.getvalue(), content_type='image/png')

if __name__ == '__main__':
    app.run(debug=True)