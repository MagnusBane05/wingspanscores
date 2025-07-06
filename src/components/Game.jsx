import React from 'react';
import { useParams } from "react-router";
import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Link } from 'react-router-dom';
import { FaAngleUp, FaAngleDown, FaAngleDoubleUp, FaAngleDoubleDown } from "react-icons/fa";

export default function Game() {
    let params = useParams();
    const { isPending, error, data: gameData, isFetching } = useQuery({
        queryKey: ['game'],
        queryFn: async () => {
            const response = await fetch(`/api/games/${params.gid}`);
            return await response.json();
        }
    });

    if (isPending) return `Loading game ${params.gid}...`;

    if (error) return `An error has occurred while loading game ${params.gid}: ${error.message}`;

    const items = [
        { 
            label: 'Game history',
            template: () => <Link to="/games"><span className="p-menuitem-text">Game history</span></Link>
        },
        {
            label: `Game ${params.gid}`,
            template: () => <span className="p-menuitem-text cursor-auto">Game {params.gid}</span>
        }
    ]
    const home = { label: 'Home', url: 'http://localhost:3000/' };

    const header = () => {
        return (
            <span>Game {params.gid}</span>
        );
    };

    const eloChangeTemplate = (entry) => {
        const eloChange = entry.eloChange;
        if (eloChange == 0) {
            return <span>{eloChange}</span>
        } else if (eloChange > 30) {
            return (
                <div className='flex items-center'><span>{entry.eloChange}</span><FaAngleDoubleUp color='green' /></div>
            );
        } else if (eloChange > 0) {
            return (
                <div className='flex items-center'><span>{entry.eloChange}</span><FaAngleUp color='green' /></div>
            );
        } else if (eloChange < -30) {
            return (
                <div className='flex items-center'><span>{entry.eloChange}</span><FaAngleDoubleDown color='red' /></div>
            );
        } else {
            return (
                <div className='flex items-center'><span>{entry.eloChange}</span><FaAngleDown color='red' /></div>
            );
        }
        
    }

    return (
        <div className='flex flex-col items-center'>
            <BreadCrumb className='bg-transparent pt-0' model={items} home={home} />
            <div className='flex flex-wrap justify-center w-4/5'>
                <DataTable value={gameData['playerInfo']} stripedRows header={header}>
                    <Column field="playerName" header="Player name" sortable></Column>
                    <Column field="place" header="Place" sortable></Column>
                    <Column field="total" header="Total score" sortable></Column>
                    <Column field="birds" header="Birds points" sortable></Column>
                    <Column field="bonusCards" header="Bonus card points" sortable></Column>
                    <Column field="endOfRoundGoals" header="End of round goal points" sortable></Column>
                    <Column field="eggs" header="Eggs" sortable></Column>
                    <Column field="foodOnCards" header="Food on cards" sortable></Column>
                    <Column field="tuckedCards" header="Tucked cards" sortable></Column>
                    <Column field="eloBefore" header="Elo before" sortable></Column>
                    <Column field="eloAfter" header="Elo after" sortable></Column>
                    <Column field="eloChange" header="Elo won/lost" body={eloChangeTemplate} sortable></Column>
                </DataTable>
            </div>
        </div>
    );
}