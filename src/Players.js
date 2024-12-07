import { Dropdown } from 'primereact/dropdown';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider'
import { Panel } from 'primereact/panel'
import React, { useState, useEffect } from 'react';

function PlayerCard({data}) {
    return (
        <Card className='bg-dark-indigo-500'>
        <h3 className='prose prose-lg text-white'>{data.category}</h3>
        <p className='prose text-white'>
            {data.best_title}: {data.best}<br />
            {/* Rank: {data.rank} */}
        </p>
        </Card>
    );
}

function PlayerCardContainer() {
    const [cardData, setCardData] = useState('None');
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState('Evan');
  
    useEffect(() => {
      fetch('/playerNames').then(res => res.json()).then(data => {
        setPlayers(data);
      });
    }, []);
  
    useEffect(() => {
      fetch(`/playerCard/${selectedPlayer}`).then(res => res.json()).then(data => {
        setCardData(data);
      });
    }, [selectedPlayer]);
  
    return (
      <Panel className="flex flex-col items-center">
        <h2 className="flex justify-center">
          <Dropdown value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.value)} options={players} optionLabel="name" 
            placeholder="Select a player" className="w-1/2" />
        </h2>
        <div className="flex flex-row justify-evenly">
          <PlayerCard data={cardData[0]}/>
          <Divider layout="vertical" />
          <PlayerCard data={cardData[1]}/>
          <Divider layout="vertical" />
          <PlayerCard data={cardData[2]}/>
        </div>
      </Panel>
    );
}

function Players() {
    return (
        <div>
            <PlayerCardContainer/>
        </div>
    );
}

export default Players;