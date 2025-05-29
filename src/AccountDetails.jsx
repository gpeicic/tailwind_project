import React, { useState } from 'react';
import {
  FaBoxOpen,
  FaUniversity,
  FaUserShield,
  FaCog,
  FaQuestionCircle,
} from 'react-icons/fa';

const menuItems = [
  { id: 'orders', label: 'Tvoje narudžbe', icon: <FaBoxOpen /> },
  { id: 'bank', label: 'Bankovni podaci', icon: <FaUniversity /> },
  { id: 'profile', label: 'Profil i sigurnost', icon: <FaUserShield /> },
  { id: 'settings', label: 'Postavke', icon: <FaCog /> },
  { id: 'help', label: 'Pomoć', icon: <FaQuestionCircle /> },
];

const AccountDetails = () => {
  const [selected, setSelected] = useState('orders');

  return (
    <div className="flex w-full min-h-screen mt-10">
      {/* Left menu */}
      <div className="w-1/2 max-w-xs p-6 border-gray-200 ml-45 ">
        <ul className="space-y-4 ">
          {menuItems.map((item) => (
            <li
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`flex items-center gap-3 p-3 cursor-pointer rounded-sm transition-all duration-150
                ${selected === item.id ? 'border border-black font-bold' : 'font-semibold text-black '}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

    
      <div className="flex-1 p-6 ">
        <h2 className="text-3xl font-bold mb-4">{menuItems.find(i => i.id === selected).label}</h2>
      
      </div>
    </div>
  );
};

export default AccountDetails;
