import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { useNavigate } from 'react-router';

function Leaderboard() {
    const [selectedCategory, setSelectedCategory] = useState('Total');
    
    let navigate = useNavigate();

    const onSelectionChange = (e) => {
        navigate(`/games/${e.value.game_id}`)
    };

    const { isPending: isLeaderBoardsPending, error: leaderboardsError, data: leaderboards, isFetching: isLeaderboardsFetching } = useQuery({
        queryKey: ['leaderboards'],
        queryFn: async () => {
            const response = await fetch('/leaderboards');
            return await response.json();
        }
    });

    const { isPending: isCategoriesPending, error: categoriesError, data: categories, isFetching: isCategoriesFetching } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await fetch('/categories');
            return await response.json();
        }
    });

    const error = [leaderboardsError, categoriesError]

    if (isLeaderBoardsPending || isCategoriesFetching) return 'Loading...';

    if (leaderboardsError || categoriesError) {
        return (
          <span>
            {error.forEach((e) => (e ? console.log(e) : null))}
            Error: see console!
          </span>
        );
    }

    const dropdownCategories = Object.keys(categories['best_titles']).map((x) => {
        return {"name": x, "title": categories['best_titles'][x]}
    });
    
    const renderHeader = () => {
        return (
            <Dropdown value={selectedCategory} onChange={(e) => setSelectedCategory(e.value)} options={dropdownCategories} optionLabel="title" optionValue="name"
                        placeholder="Select a category" />
        );
    };

    const header = renderHeader();

    return (
        <div className='flex justify-center'>
            <DataTable value={leaderboards[selectedCategory]} stripedRows
            header={header} size='small' rows={5}
            sortField='rank' sortOrder={1}
            paginator paginatorTemplate={
                {
                    layout: 'PrevPageLink CurrentPageReport NextPageLink'
                }}
            selectionMode='single' onSelectionChange={onSelectionChange}
            className='w-1/2'>
                <Column field="rank" header="Place" sortable></Column>
                <Column field="player" header="Player name" sortable></Column>
                <Column field="score" header="Score" sortable></Column>
            </DataTable>
        </div>
    );
}

export default Leaderboard;