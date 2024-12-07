import './App.css';
import React, { useState, useEffect } from 'react';
import "primereact/resources/themes/lara-dark-indigo/theme.css"
import Header from './Header'
import { Outlet } from 'react-router-dom';

function App() {

  return (
    <div>
      <header >
        <Header/>
        <Outlet />
      </header>
    </div>
  );
}

export default App;
