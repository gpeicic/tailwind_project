import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [stavke, setStavke] = useState([]);
  const [narudzba, setNarudzba] = useState(null);

  const fetchStavke = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const narudzbaRes = await axios.get('http://localhost:8081/narudzba/aktivna', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const aktivnaNarudzba = narudzbaRes.data;
      setNarudzba(aktivnaNarudzba);

      if (!aktivnaNarudzba) {
        setStavke([]);
        return;
      }

      const stavkeRes = await axios.get(`http://localhost:8081/listaNarudzba/${aktivnaNarudzba.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStavke(stavkeRes.data || []);
    } catch (err) {
      console.error("Greška pri dohvaćanju stavki:", err);
    }
  };

  useEffect(() => {
    fetchStavke();
  }, []);

  return (
    <CartContext.Provider value={{ stavke,narudzba, fetchStavke }}>
      {children}
    </CartContext.Provider>
  );
};
