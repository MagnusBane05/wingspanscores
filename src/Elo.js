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

    useEffect(() => {
        const options = {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Game number',
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Elo',
                    }
                }
            }
        }
        setChartOptions(options);
    }, []);


    return (
        <div className='flex justify-center'>
            <Chart type="line" data={chartData} options={chartOptions} className='w-4/5'/>
        </div>
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
                placeholder="Select players to display in graph" display='chip' filter className="w-full"/>
            <EloGraph players={selectedPlayers}/>
        </div>
    );
}

export default Elo;