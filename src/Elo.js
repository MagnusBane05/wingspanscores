import React, { useState, useEffect } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { Chart } from 'primereact/chart'


function EloGraph({players}) {
    const [eloHistory, setEloHistory] = useState([]);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        fetch('/eloHistory').then(res => res.json()).then(data => {
            setEloHistory(data);
        });
    }, []);

    useEffect(() => {
        const data = {
            labels: eloHistory.length > 0 ? Array.from(eloHistory[0]["history"].keys()) : [],
            datasets: eloHistory.filter((x) => players.includes(x.player)).map(x => ({
                label: x.player,
                data: x.history,
                tension: 0.3
            }))
        };
        setChartData(data);
    }, [players]);


    return (
        <Chart type="line" data={chartData} class="w-full md:w-20rem"/>
    )
  }

function Elo() {
    const [players, setPlayers] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState([]);
  
    useEffect(() => {
      fetch('/playerNames').then(res => res.json()).then(data => {
        setPlayers(data);
      });
    }, []);

    return (
        <div>
            <MultiSelect value={selectedPlayers} onChange={(e) => {setSelectedPlayers(e.value)}} options={players} 
                placeholder="Select players to display in graph" display='chip' filter  className="w-full md:w-20rem"/>
            <EloGraph players={selectedPlayers}/>
        </div>
    );
}

export default Elo;