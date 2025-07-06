import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { useNavigate } from 'react-router';

function Games() {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });

    const { isPending, error, data: games, isFetching } = useQuery({
        queryKey: ['gamesList'],
        queryFn: async () => {
            const response = await fetch('/api/gamesList');
            return await response.json();
        },
        staleTime: 300000
    });

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className='flex justify-between'>
                <span className="text-xl text-900 font-bold">Game history</span>
                <IconField iconPosition="left">
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Winner search" />
                </IconField>
            </div>
        );
    };

    const header = renderHeader();
    
    let navigate = useNavigate();

    const onSelectionChange = (e) => {
        navigate(`./${e.value.id}`)
    };

    return (
        <div className='flex justify-center'>
            <DataTable value={games} stripedRows size='small'
            paginator rows={10} rowsPerPageOptions={[10, 25, 50, 100]} 
            removableSort 
            header={header}
            filters={filters} globalFilterFields={['winner']}
            selectionMode="single" onSelectionChange={onSelectionChange}
            className='w-4/5'>
                <Column field="id" header="Game number" sortable filterField="id"></Column>
                <Column field="numPlayers" header="Number of players" sortable filterField="numPlayers"></Column>
                <Column field="winner" header="Winner" sortable filterField="winner"></Column>
                <Column field="topScore" header="Winning Score" sortable filterField="topScore"></Column>
            </DataTable>
        </div>
    );
}

export default Games;