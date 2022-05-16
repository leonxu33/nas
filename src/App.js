import React, { useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";
import Header from './components/Header'
import FileBrowser from './pages/FileBrowser';
import Home from './pages/Home';
import Notification from './components/Notification';

export default function App(props) {
  return (
    <div className="app">
      <HashRouter>
        <Header />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/dir" element={<FileBrowser />} />
        </Routes>
        <Notification />
      </HashRouter>
    </div>
  );
}