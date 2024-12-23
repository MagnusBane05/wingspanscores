import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MultiSelect } from 'primereact/multiselect';
import { Chart } from 'primereact/chart'


function EloGraph({players}) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    const { isPending, error, data: eloHistory, isFetching } = useQuery({
        queryKey: ['eloHistory'],
        queryFn: async () => {
            const response = await fetch('/eloHistory');
            return await response.json();
        }
    });

    useEffect(() => {
        if (eloHistory == null) {
            return;
        }
        const data = {
            labels: eloHistory.length > 0 ? Array.from(eloHistory[0]["history"].keys()) : [],
            datasets: eloHistory.filter((x) => players.includes(x.player)).map(x => ({
                label: x.player,
                data: x.history,
                tension: 0.3
            }))
        };
        setChartData(data);
    }, [players, eloHistory]);

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

    if (isPending) return 'Loading elo history...';

    if (error) return 'An error has occurred while loading elo history: ' + error.message;

    return (
        <div className='flex justify-center'>
            <Chart type="line" data={chartData} options={chartOptions} className='w-4/5'/>
        </div>
    )
  }

function Elo() {
    const [selectedPlayers, setSelectedPlayers] = useState([]);

    const { isPending, error, data: players, isFetching } = useQuery({
        queryKey: ['players'],
        queryFn: async () => {
            const response = await fetch('/playerNames');
            return await response.json();
        }
    });

    if (isPending) return 'Loading players...';

    if (error) return 'An error has occurred while loading players: ' + error.message;

    return (
        <div>
            <MultiSelect value={selectedPlayers} onChange={(e) => {setSelectedPlayers(e.value)}} options={players} 
                placeholder="Select players to display in graph" display='chip' filter className="w-full"/>
            <EloGraph players={selectedPlayers}/>
        </div>
    );
}

export default Elo;