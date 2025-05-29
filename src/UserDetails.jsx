import React from 'react';
import { FaSignOutAlt } from "react-icons/fa";



const UserDetails = ({ email, onLogout }) => {
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-72">
            <h2 className="text-lg font-semibold mb-4">Detalji korisnika</h2>
            <p><strong>Email:</strong> {email}</p>
                <button 
                    onClick={onLogout}
                    className="mt-4 flex items-center gap-2 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                >
                    <FaSignOutAlt />
                    Odjava
                </button>
        </div>
    );
};

export default UserDetails;
