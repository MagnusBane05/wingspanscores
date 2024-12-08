
import React from 'react';
import { Menubar } from 'primereact/menubar'

function Header() {
    const menuItems = [
      { label: 'Elo graph', url: '/elo' },
      // { label: 'Player stats', url: '/players' },
      { label: 'Game history', url: '/games' },
      { label: 'Leaderboards', url: '/leaderboards' }
    ];
    return (
        <Menubar className="flex justify-evenly mb-4" model={menuItems} />
    );
}

export default Header;