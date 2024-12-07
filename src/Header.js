
import React, { useState, useEffect } from 'react';
import { TabMenu } from 'primereact/tabmenu'

function Header() {
    const [activeIndex, setActiveIndex] = useState(0);
    const menuItems = [
      { label: 'Elo graph', url: '/elo' },
      { label: 'Player stats', url: '/players' },
      { label: 'Game history', url: '/games' },
      { label: 'Leaderboards', url: '/leaderboards' }
    ];
    return (
        <TabMenu className="flex flex-col items-center justify-center" model={menuItems} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
    );
}

export default Header;