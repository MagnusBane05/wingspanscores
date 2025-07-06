import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Link } from 'react-router-dom';

function MenuItemTemplate({item, options, path}) {
  return (
    <Link to={path} role="menuitem" className={options.className} target={item.target} onClick={options.onClick}>
             {/* <span className={classNames(options.iconClassName, 'pi pi-home')}></span>; */}
             <span className="p-menuitem-text">{item.label}</span>
    </Link>
  );
}

function createMenuItemTemplate(path) {
  return (item, options) => <MenuItemTemplate item={item} options={options} path={path} />;
}

function Header() {
    const menuItems = [
      { 
        label: 'Elo graph',
        template: createMenuItemTemplate('/elo')
      },
      // { label: 'Player stats', url: '/players' },
      { 
        label: 'Game history',
        template: createMenuItemTemplate('/games')  
      },
      { 
        label: 'Leaderboards',
        template: createMenuItemTemplate('/leaderboards')
      }
    ];
    return (
        <Menubar className="flex justify-evenly mb-4" model={menuItems} />
    );
}

export default Header;