import { useState,useEffect } from 'react';
import { FaRegHeart, FaClock } from 'react-icons/fa';
import { useParams, Link } from 'react-router-dom';
import {  FaChevronLeft } from 'react-icons/fa';
import axios from 'axios';
import { useCart } from './CartContext'; 

const ProizvodPage = () => {
  const {spol, kategorija, marka, id } = useParams();
  const [proizvod, setProizvod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [kliknut, setKliknut] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  
  const { narudzba, fetchStavke } = useCart(); // izvući narudzbu i fetch funkciju iz konteksta

  useEffect(() => {
    const fetchProizvod = async () => {
      try {
        const response = await fetch(`http://localhost:8081/proizvodi/${id}`);
        if (!response.ok) throw new Error('Proizvod nije pronađen');
        const data = await response.json();
        setProizvod(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProizvod();
  }, [id]);

  async function dodajUKosaricu(proizvod_id) {
    if (!narudzba) {
      alert('Nemate aktivnu narudžbu.');
      return;
    }
   
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8081/listaNarudzba', {
        narudzba_id: narudzba.id,  
        proizvod_id: proizvod_id,
        kolicina: 1 // default količina
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setKliknut(true);
      setTimeout(() => setKliknut(false), 600);

      await fetchStavke(); // Osvježi stanje košarice u kontekstu

    } catch (err) {
      alert('Greška pri dodavanju stavke.');
    } 
  }

if (loading) return <div>Loading...</div>;
if (!proizvod) return <div>Proizvod nije pronađen</div>;
const imagePaths = Array.from({ length: 5 }, (_, i) =>
    `/proizvodi/${proizvod.ime}${i === 0 ? '' : ` (${i})`}.jpg`
  );
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-full mx-20 grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* LEFT SIDE - Images (2/3 width) */}
        <div className="xl:col-span-2">
          {/* Top two large images */}
          {/* Strelica nazad */}
    
          <div className="grid grid-cols-2 gap-2 mb-2 relative">
            <Link 
                to={`/kategorija/${encodeURIComponent(spol)}/${encodeURIComponent(kategorija)}`}
                className="absolute top-2 left-2 z-10 inline-flex items-center text-gray-800 hover:text-black transition bg-transparentni p-1 rounded-full"
            >
                <FaChevronLeft className="w-5 h-5" />
            </Link>

            {imagePaths.slice(0, 2).map((src, index) => (
                <img
                key={index}
                src={src}
                alt={`Slika ${index + 1}`}
                className="w-full h-full object-cover border border-gray-200"
                />
            ))}
            </div>
          
          {/* Bottom three smaller images */}
          <div className="grid grid-cols-3 gap-2">
            {imagePaths.slice(2, 5).map((src, index) => (
              <img
                key={index + 2}
                src={src}
                alt={`Slika ${index + 3}`}
                className="w-full h-[500px] object-fill border border-gray-200"
              />
            ))}
          </div>
        </div>
  
        {/* RIGHT SIDE - Info (1/3 width) */}
        <div className="flex flex-col gap-4 xl:col-span-1 p-4">
          {/* Your existing info content remains the same */}
          <div className="text-sm text-gray-500">
            {proizvod.podkategorija.kategorija.spol} &gt; {proizvod.podkategorija.kategorija.naziv} &gt; {proizvod.podkategorija.naziv} &gt; {proizvod.marka}
          </div>
          
          {/* Brand */}
          <h2 className="text-lg font-semibold">{proizvod.marka}</h2>

          {/* Name */}
          <h1 className="text-2xl font-bold">{proizvod.ime}</h1>

          {/* Price */}
          <div className="text-xl font-bold">
            {proizvod.cijena.toFixed(2)} €
            <span className="ml-2 text-sm text-gray-500 font-normal">uklj. PDV</span>
          </div>

          {/* Last 30 Days Price */}
          <p className="text-sm text-gray-500">
            Najbolja cijena u posljednjih 30 dana: <span className="text-xs">**</span>
          </p>

          {/* Size Selector */}
          <div>
            <h3 className="font-semibold mb-1">Veličina</h3>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="border border-gray-300 bg-white rounded  px-3 py-2 w-full"
            >
              <option value="">Odaberi veličinu</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>

          {/* Add to Cart & Heart */}
          <div className="flex items-center gap-3">
            <button  onClick={() => dodajUKosaricu(proizvod.id)}
           className={`px-44 py-3 rounded font-semibold transition-colors duration-500 ease-in-out
            ${kliknut ? 'bg-green-500 text-white' : 'bg-black text-white'}`}
            >
              Dodaj u košaricu
            </button>
            <button className="w-10 h-10 border border-gray-300 rounded flex items-center justify-center">
              <FaRegHeart className="text-gray-500" />
            </button>
          </div>

          {/* Line and Popular Text */}
          <hr className="border-gray-300" />
          <p className="text-sm text-center text-gray-500">🔥 Popularni proizvod 🔥</p>

          {/* Delivery Info Card */}
          <div className="border border-gray-300 rounded p-4 space-y-3 bg-white">
            <p className="font-semibold">Besplatna dostava iznad 17,90€</p>
            <hr className="border-gray-300" />
            <p className="flex items-center gap-2 text-sm text-gray-600">
              <FaClock /> 2 do 4 radnih dana
            </p>
            <hr className="border-gray-300" />
            <p className="text-sm text-gray-600">100 dana pravo na povrat</p>
          </div>

        
          <div className="divide-y divide-gray-200 mt-4 font-semibold">
            {[
              'Dizajn i dodaci',
              'Veličina i kroj',
              'Materijal i njega',
              'Informacije o proizvođaču',
            ].map((title, idx) => (
              <details key={idx} className="py-3 cursor-pointer group ">
                <summary className="font-medium font-semibold text-xl text-gray-800 group-open:pb-2">{title}</summary>
                <p className="text-sm text-gray-600 pt-1">Ovdje ide sadržaj za {title.toLowerCase()}.</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProizvodPage;
