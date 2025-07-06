import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MultiSelect } from 'primereact/multiselect';
import { Chart } from 'primereact/chart'
import { useNavigate } from 'react-router';


function EloGraph({players}) {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    let navigate = useNavigate();

    const { isPending, error, data: eloHistory, isFetching } = useQuery({
        queryKey: ['eloHistory'],
        queryFn: async () => {
            const response = await fetch('/api/eloHistory');
            return await response.json();
        },
        staleTime: 300000
    });

    function filterEloHistoryGames() {
        if (!eloHistory || eloHistory.length === 0) return eloHistory;
    
        let filteredByPlayers = eloHistory.filter(x => players.includes(x.player));
        if (filteredByPlayers.length === 0) return filteredByPlayers;
    
        let indices = new Set();
    
        filteredByPlayers[0].history.forEach((game, index, arr) => {
            if (index === 0 || game !== arr[index - 1] || 
                filteredByPlayers.some(({ history }) => history[index] !== history[index - 1])) {
                indices.add(index);
            }
        });
    
        return filteredByPlayers.map(playerData => ({
            ...playerData,
            history: playerData.history.filter((_, index) => indices.has(index)),
            indices: [...indices]
        }));
    }    

    useEffect(() => {
        if (eloHistory == null) {
            return;
        }
        const filteredHistory = filterEloHistoryGames();
        const data = {
            labels: filteredHistory.length > 0 ? filteredHistory[0]["indices"] : [],
            datasets: filteredHistory.map(x => ({
                label: x.player,
                data: x.history,
                tension: 0.3
            }))
        };
        setChartData(data);
    }, [players, eloHistory]);

    useEffect(() => {
        const options = {
            onClick: (e, element) => {
                if (element.length > 0) {
                    let ind = e.chart.tooltip.title[0];
                    navigate(`/games/${ind}`);
                }
            },
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
            const response = await fetch('/api/playerNames');
            return await response.json();
        },
        staleTime: 300000
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