import React, { useState, useEffect } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { useNavigate } from 'react-router';

function Games() {
    const [games, setGames] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [selectedGame, setSelectedGame] = useState(null);

    useEffect(() => {
        fetch("/gamesList").then(res => res.json()).then(data => {
            setGames(data);
        });
    }, []);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex justify-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Winner search" />
                </IconField>
            </div>
        );
    };

    const header = renderHeader();
    
    let navigate = useNavigate();

    const onSelectionChange = (e) => {
        setSelectedGame(e.value)
        navigate(`./${e.value.id}`)
    };

    return (
        <div className='flex justify-center'>
            <DataTable value={games} stripedRows 
            paginator rows={10} rowsPerPageOptions={[10, 25, 50, 100]} 
            removableSort 
            header={header}
            filters={filters} globalFilterFields={['winner']}
            selectionMode="single" selection={selectedGame} onSelectionChange={onSelectionChange}
            className='w-4/5'>
                <Column field="id" header="Game number" sortable filterField="id"></Column>
                <Column field="numPlayers" header="Number of players" sortable filterField="numPlayers"></Column>
                <Column field="winner" header="Winner" sortable filterField="winner"></Column>
                <Column field="topScore" header="Top Score"  filterField="topScore"></Column>
            </DataTable>
        </div>
    );
}

export default Games;