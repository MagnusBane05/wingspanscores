import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';

function PlayerCard({data}) {
  return (
    <div class="player-card">
      <h3>{data.category}</h3>
      <p>
        Best score: {data.best}<br />
        Rank: {data.rank}
      </p>
    </div>
  );
}

function PlayerCardContainer({name}) {
  const [cardData, setCardData] = useState('None');

  useEffect(() => {
    fetch(`/playerCard/${name}`).then(res => res.json()).then(data => {
      setCardData(data);
    });
  }, []); // <- this empty list is a list of state variables on
          // which the callback depends. Default is all variables

  return (
    <div class="player-card-outer">
      <h2>{name}</h2>
      <div class="player-card-inner">
        <PlayerCard data={cardData[0]}/>
        <PlayerCard data={cardData[1]}/>
        <PlayerCard data={cardData[2]}/>
      </div>
    </div>
  );
}

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <PlayerCardContainer name="Marlee"/>
      </header>
    </div>
  );
}

export default App;
