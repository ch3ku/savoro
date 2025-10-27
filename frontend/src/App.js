import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateMenu from './pages/CreateMenu';
import MenuView from './pages/MenuView';
import { Toaster } from 'sonner';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-menu" element={<CreateMenu />} />
          <Route path="/menu/:menuId" element={<MenuView />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;