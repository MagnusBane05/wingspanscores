import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css';
import App from './App';
import Players from './components/Players';
import Games from './components/Games';
import Elo from './components/Elo';
import Game from './components/Game';
import Leaderboard from './components/Leaderboard';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route path='players' element={<Players />} />
        <Route path='games' element={<Games />} />
        <Route path='elo' element={<Elo />} />
        <Route path='leaderboards' element={<Leaderboard />} />
        <Route path='games/:gid' element={<Game />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
