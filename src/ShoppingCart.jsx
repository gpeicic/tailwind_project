import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext'; 
import { 
  FaCcVisa, 
  FaCcMastercard, 
  FaCcAmex, 
  FaCcPaypal, 
  FaCcDiscover, 
  FaCcStripe, 
  FaCcDinersClub 
} from 'react-icons/fa';

export default function ShoppingCart() {
  const { narudzba, stavke,fetchStavke } = useCart(); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proizvodiMap, setProizvodiMap] = useState({});
  const token = localStorage.getItem('token');
  const navigate = useNavigate();


  useEffect(() => {
    async function fetchProizvodi() {
      setLoading(true);
      const noviMap = {};
      for (const stavka of stavke) {
        if (!proizvodiMap[stavka.proizvod_id]) {
          try {
            const res = await axios.get(`http://localhost:8081/proizvodi/${stavka.proizvod_id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            noviMap[stavka.proizvod_id] = res.data;
          } catch (err) {
            console.error(`Greška pri dohvaćanju proizvoda ID ${stavka.proizvod_id}:`, err);
          }
        }
      }
      setProizvodiMap((prev) => ({ ...prev, ...noviMap }));
      setLoading(false);
    }
  
    if (stavke.length > 0) fetchProizvodi();
  }, [stavke]); // re-run when stavke change
  
  
  if (loading) return <div>Učitavanje...</div>;
  if (error) return <div>{error}</div>;

  const praznaKosarica = !stavke || stavke.length === 0;

  return (
    <div className="flex items-center justify-center p-6 ">
      <div className="flex flex-col items-center gap-6 max-w-full w-full ml-10 mb-80">
        <div className="w-full text-left">
          <h2 className="text-3xl font-bold mb-3">Košarica</h2>
  
          {!narudzba ? (
            <p>Nemate aktivnu narudžbu.</p>
          ) : praznaKosarica ? (
            <p className="text-gray-500 text-lg mb-140">Tvoja košarica je prazna!</p>
          ) : (
            <div className="flex flex-row w-full gap-6">
              {/* Lijeva kolona - Stavke */}
              <div className="mt-6 flex flex-col gap-4 border border-gray-300 rounded-sm w-[70%] ">
                {stavke.map((stavka) => {
                  const proizvod = proizvodiMap[stavka.proizvod_id];
                  return (
                    <div
                      key={stavka.id}
                      className="p-2 flex justify-between items-center p-6"
                    >
                      <div className="w-30 h-40 mr-4 flex-shrink-0">
                        {proizvod ? (
                          <img
                            src={`/proizvodi/${proizvod.ime}.jpg`}
                            alt={proizvod.ime}
                            className="w-full h-full object-cover rounded-sm"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 animate-pulse rounded-md" />
                        )}
                      </div>
  
                      <div className="flex flex-col justify-start flex-grow">
                        <p className="font-semibold text-lg">{proizvod?.ime}</p>
                        <p className="text-l text-gray-600">{proizvod?.marka}</p>
                        <p className="text-sm text-gray-600">{proizvod?.opis}</p>
                        <div className="mt-1 flex items-center space-x-2">
                          <div className="inline-flex items-center border border-gray-300 rounded-sm overflow-hidden mt-10">
                            <div
                              onClick={async () => {
                                if (stavka.kolicina > 1) {
                                  const novaKolicina = stavka.kolicina - 1;
                                  const noveStavke = stavke.map((s) =>
                                    s.id === stavka.id ? { ...s, kolicina: novaKolicina } : s
                                  );
                                
                                  await axios.put(`http://localhost:8081/listaNarudzba/${stavka.id}`, novaKolicina, {
                                    headers: {
                                      Authorization: `Bearer ${token}`,
                                      'Content-Type': 'application/json',
                                    },
                                  });
                                  await fetchStavke();
                                }
                              }}
                              className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-200 select-none text-gray-500 font-bold"
                            >
                              -
                            </div>
                            <div className="w-10 h-8 flex items-center justify-center select-none">
                              {stavka.kolicina}
                            </div>
                            <div
                              onClick={async () => {
                                const novaKolicina = stavka.kolicina + 1;
                                const noveStavke = stavke.map((s) =>
                                  s.id === stavka.id ? { ...s, kolicina: novaKolicina } : s
                                );
                             
                                await axios.put(`http://localhost:8081/listaNarudzba/${stavka.id}`, novaKolicina, {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                  },
                                });
                                await fetchStavke();
                              }}
                              className="w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-200 select-none text-gray-500 font-bold"
                            >
                              +
                            </div>
                          </div>
                        </div>
                      </div>
  
                      <div className="flex flex-col items-end justify-between h-full ml-4">
                        <button
                          onClick={async () => {
                            try {
                           
                              await axios.delete(`http://localhost:8081/listaNarudzba`, {
                                headers: { Authorization: `Bearer ${token}` },
                                data: stavka,
                              });
                              await fetchStavke();
                            } catch (err) {
                              console.error('Greška pri brisanju stavke', err);
                              await fetchStavke();
                            }
                          }}
                          className="text-gray-400 hover:text-gray-800 mb-2"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                          >
                            <path d="M3 6h18v2H3zm2 3h14l-1.5 12.5c-.1.8-.8 1.5-1.6 1.5H8.1c-.8 0-1.5-.7-1.6-1.5L5 9zm5 2v8h2v-8H10zm4 0v8h2v-8h-2z" />
                          </svg>
                        </button>
                        <p className="text-right text-sm font-semibold">
                          {proizvod?.cijena ? `${(proizvod.cijena * stavka.kolicina).toFixed(2)} $` : ''}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <hr className="border-t border-gray-300 mt-5" />
                <p className="text-sm text-gray-400 font-semibold ml-7 mb-0">PROIZVODI NISU REZERVIRANI</p>
              </div>
                
              {/* Desna kolona - Kartica plaćanja */}
              {narudzba && (
                <div className="flex flex-col justify-between w-[30%] border border-gray-300 rounded-sm p-6 mt-6 h-fit mr-10">
                  <div className="flex justify-between mb-4">
                    <span className="text-lg font-semibold">Ukupno</span>
                    <span className="text-lg font-semibold">{narudzba.ukupnaCijena?.toFixed(2)} $</span>
                  </div>
                  <div className="flex justify-between mb-3">
                    <span className="text-black font-semibold ">Datum</span>
                    <span  className="text-black font-semibold ">{new Date(narudzba.datum_narudzbe).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-6">
                  <span className="text-2xl font-bold text-black">Ti plaćaš <span className="text-gray-400 text-sm mb-6">s PDV-om</span></span>
                    
                    <span className="text-black font-bold text-lg">{narudzba.ukupnaCijena?.toFixed(2)} $</span>
                  </div>
                  
                  <button  onClick={() => navigate('/placanje')}
                   className="w-full bg-black text-white rounded-sm py-3 font-semibold mb-4">
                    Nastavi na blagajnu
                  </button>
                  <hr className="border-t border-gray-300 mb-6" />
                  <div className="flex justify-between space-x-3 text-center">
                    <FaCcVisa className="text-gray-500 text-2xl" />
                    <FaCcMastercard className="text-gray-500 text-2xl" />
                    <FaCcAmex className="text-gray-500 text-2xl" />
                    <FaCcPaypal className="text-gray-600 text-2xl" />
                    <FaCcDiscover className="text-gray-700 text-2xl" />
                    <FaCcStripe className="text-gray-800 text-2xl" />
                    <FaCcDinersClub className="text-gray-800 text-2xl" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
}  