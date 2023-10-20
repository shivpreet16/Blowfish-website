import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Encrypt from './components/Encrypt';
import Decrypt from './components/Decrypt';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='encrypt' element={<Encrypt />}/>
          <Route path='decrypt' element={<Decrypt />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
