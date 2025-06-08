import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa';
import { useCart } from './CartContext';
import axios from 'axios';


const ProductCarousel = ({ proizvodIme }) => {
    const [validImages, setValidImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const imagePaths = Array.from({ length: 5 }, (_, i) =>
            `/proizvodi/${proizvodIme}${i === 0 ? '' : ` (${i})`}.jpg`
        );

        const checkImages = async () => {
            setLoading(true);
            const results = await Promise.all(
                imagePaths.map(
                    src =>
                        new Promise(resolve => {
                            const img = new Image();
                            img.src = src;
                            img.onload = () => resolve(src);
                            img.onerror = () => resolve(null);
                        })
                )
            );
            const filtered = results.filter(Boolean);
            setValidImages(filtered);
            setLoading(false);
            setCurrentIndex(0);
        };

        checkImages();
    }, [proizvodIme]);

    const prev = () => {
        setCurrentIndex(prev => (prev === 0 ? validImages.length - 1 : prev - 1));
    };

    const next = () => {
        setCurrentIndex(prev => (prev + 1) % validImages.length);
    };

    if (loading) {
        return <p className="text-gray-500 flex justify-center items-center h-32">Učitavanje slika...</p>;
    }

    if (validImages.length === 0) {
        return <p className="text-gray-500 flex justify-center items-center h-32">Nema dostupnih slika</p>;
    }

    return (
        <div className="relative w-full h-100 flex-items-center overflow-hidden bg-gray-200 group">
            <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{
                    width: `${validImages.length * 100}%`,
                    transform: `translateX(-${currentIndex * (100 / validImages.length)}%)`,
                }}
            >
                {validImages.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`${proizvodIme} ${index}`}
                        className="w-full h-full object-cover flex"
                        style={{ width: `${100 / validImages.length}%` }}
                    />
                ))}
            </div>
            {/* Controls */}
            <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-12 bg-white bg-opacity-50 text-gray-400 text-2xl font-bold rounded-r-full flex items-center justify-center opacity-75 hover:opacity-100 transition z-10"
                aria-label="Prethodna slika"
            >
                <FaChevronLeft />
            </button>
            <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-12 bg-white bg-opacity-50 text-gray-400 text-2xl font-bold rounded-l-full flex items-center justify-center opacity-75 hover:opacity-100 transition z-10"
                aria-label="Sljedeća slika"
            >
                <FaChevronRight />
            </button>
        </div>
    );
};

const Wishlist = () => {
    const [proizvodi, setProizvodi] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addedProductId, setAddedProductId] = useState(null);
    const [fade, setFade] = useState(false);
    const { narudzba, fetchStavke } = useCart();
    const [show, setShow] = useState(false);


    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:8081/wishlist', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                setError('Lista je prazna.');
                setProizvodi([]);  
                return; 
            }
            const data = await response.json();
            setProizvodi(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchWishlist();
    }, []);

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
            setAddedProductId(proizvod_id);
            await fetchStavke();
            setShow(true);
            setFade(false);
            setTimeout(() => setFade(true), 300);
            setTimeout(() => {
                setShow(false);
                setFade(false);
                setAddedProductId(null);
            }, 2100);
        } catch (err) {
            alert('Greška pri dodavanju stavke.',err);
            console.log(err);
        }
    }
    async function obrisiProizvod(proizvodId) {
        try {
            const token = localStorage.getItem('token');
    
            const response = await fetch(`http://localhost:8081/wishlist?proizvodId=${proizvodId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
 
            if (!response.ok) {
                throw new Error('Greška pri brisanju proizvoda');
            }
    
            await fetchWishlist(); 
        } catch (err) {
            alert('Greška pri brisanju proizvoda.');
            console.error(err);
        }
    }
    
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 justify-center text-center">Tvoja lista želja</h1>

            {isLoading ? (
                <div className="flex justify-center items-center h-64 ">
                    <p className="text-gray-500">Učitavanje...</p>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-red-500">{error}</p>
                </div>
            ) : proizvodi.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {proizvodi.map((proizvod) => (
                        <div
                            key={proizvod.id}
                            className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 relative group"
                        >   
                            <button
                                onClick={() => obrisiProizvod(proizvod.id)}
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 z-20 text-xl"
                                aria-label="Dodaj u wishlist"
                                type="button"
                                >
                                <FaTrash />
                            </button>
                            <div className="bg-gray-300 h-100 w-full flex items-center justify-center relative">
                                {/* Carousel slike */}
                                <ProductCarousel proizvodIme={proizvod.ime} />


                                <button
                                    onClick={() => dodajUKosaricu(proizvod.id)}
                                    className={`
                                    absolute 
                                    bottom-[-140px]
                                    
                                    left-1/2
                                    transform 
                                    -translate-x-1/2
                                    translate-y-2
                                    bg-black 
                                    text-white
                                    font-semibold 
                                    px-6 
                                    py-2 
                                    rounded-md 
                                    opacity-0 
                                    group-hover:opacity-100 
                                    group-hover:translate-y-0
                                    transition-all 
                                    duration-400
                                    z-10
                                  
                                 `}>
                                    Dodaj u košaricu
                                </button>

                                {addedProductId === proizvod.id && (
                                    <div className={`
                                        absolute 
                                        mb-75
                                        left-1/2 
                                        transform 
                                        -translate-x-1/2
                                        bg-green-500 
                                        text-white 
                                        text-sm 
                                        font-medium 
                                        px-4 
                                        py-2 
                                        rounded 
                                        pointer-events-none
                                        transition-opacity duration-[2000ms] ease-out
                                        ${fade ? 'opacity-0' : 'opacity-100'}
                                      `}
                                    >
                                        ✅ Dodano u košaricu!
                                    </div>
                                )}
                            </div>

                            {/* Bijeli transparentni overlay */}
                            <div className="
                                absolute 
                                top-85 
                                left-0 
                                w-full 
                                h-full 
                                bg-white 
                                bg-opacity-35 
                                opacity-0 
                                group-hover:opacity-85
                                transition-opacity 
                                duration-300
                                pointer-events-none
                                
                            "></div>
                            {/* Sadržaj kartice */}
                            <div className="p-4 relative z-0 group-hover:-translate-y-20 transition-transform duration-300 text-center">
                                <h3 className="font-semibold text-m mt-10 justify">{proizvod.ime}</h3>
                                <p className="text-gray-600 text-sm font-semibold ">{proizvod.marka}</p>
                                <p className="font-bold text-sm text-black mb-10 ">{proizvod.cijena} €</p>
                                <p className="text-gray-400 text-xs px-6 group-hover:-translate-y-8 transition-transform duration-300 font-semibold opacity-0 group-hover:opacity-85">{proizvod.opis}</p>
                            </div>
                            <div className="text-gray-400 text-xs text-center z-40 opacity-0  group-hover:-translate-y-7 group-hover:opacity-85 duration-300 font-semibold">Najbolja cijena u posljednjih 30 dana**: </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center h-64">
                    <p className="text-gray-500">Nema proizvoda u ovoj kategoriji</p>
                </div>
            )}
        </div>
    );
};

export default Wishlist;
