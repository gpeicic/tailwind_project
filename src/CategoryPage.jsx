import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ImageCarousel from './ImageCarousel';
import axios from 'axios';
import { useCart } from './CartContext'; 
import {FaHeart} from 'react-icons/fa';

const CategoryPage = () => {
    const { category, selectedGender, podkategorija } = useParams();
    
    // Decode URL parameters
    const decodedGender = selectedGender ? decodeURIComponent(selectedGender) : '';
    const decodedCategory = category ? decodeURIComponent(category) : '';
    const decodedPodkategorija = podkategorija ? decodeURIComponent(podkategorija) : '';

    const [sortOption, setSortOption] = useState('');
    const [proizvodi, setProizvodi] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [activeCategoryId, setActiveCategoryId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { narudzba,fetchStavke } = useCart();
    const [fade, setFade] = useState(false);
    const [show, setShow] = useState(false);
    const [addedProductId, setAddedProductId] = useState(null);





    const sortOptions = ["Najviša cijena", "Najniža cijena", "Novo dodano"];
    const allCategories = [
        { id: 1, name: "Odjeca" },
        { id: 2, name: "Obuca" },
        { id: 3, name: "Sport" },
        { id: 4, name: "Dodaci" },
        { id: 5, name: "StreetWear" },
        { id: 6, name: "Premium" },
        { id: 7, name: "Promocija" },
        { id: 8, name: "Modne marke" }
    ];

    const getGenderOffset = () => {
        switch(decodedGender) {
            case 'Muškarci': return 8;
            case 'Djeca': return 16;
            default: return 0; // Žene
        }
    };

    

    const fetchProductsBySubcategory = async (podkategorijaNaziv) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const encodedGender = encodeURIComponent(decodedGender);
            const encodedCategory = encodeURIComponent(decodedCategory);
            const encodedPodkategorija = encodeURIComponent(podkategorijaNaziv);
            
            const response = await fetch(`http://localhost:8081/proizvodi/${encodedGender}/${encodedCategory}/${encodedPodkategorija}`);
            if (!response.ok) throw new Error('Greška pri dohvaćanju proizvoda');
            const productsData = await response.json();
            
            let sortedProducts = [...productsData];
            if (sortOption === "Najviša cijena") {
                sortedProducts.sort((a, b) => b.cijena - a.cijena);
            } else if (sortOption === "Najniža cijena") {
                sortedProducts.sort((a, b) => a.cijena - b.cijena);
            } else if (sortOption === "Novo dodano") {
                sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
            
            setProizvodi(sortedProducts);
        } catch (err) {
            setError(err.message);
            setProizvodi([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryClick = async (item) => {
        setIsLoading(true);
        setError(null);

        const offset = getGenderOffset();
        const categoryIdWithOffset = item.id + offset;
        setActiveCategoryId(item.id);
        
        try {
            // Dohvati podkategorije
            const subCatResponse = await fetch(`http://localhost:8081/podkategorija/kategorija/${categoryIdWithOffset}`);
            if (!subCatResponse.ok) throw new Error('Greška pri dohvaćanju podkategorija');
            const subCatData = await subCatResponse.json();
            setSubCategories(subCatData);

            // Ako postoji podkategorija u URL-u, filtriraj proizvode
            if (decodedPodkategorija) {
                await fetchProductsBySubcategory(decodedPodkategorija);
            } else {
                // Dohvati proizvode za cijelu kategoriju
                const productsResponse = await fetch(`http://localhost:8081/proizvodi/kategorija/${categoryIdWithOffset}`);
                if (!productsResponse.ok) throw new Error('Greška pri dohvaćanju proizvoda');
                const productsData = await productsResponse.json();
                
                // Sortiranje proizvoda ako je odabrano
                let sortedProducts = [...productsData];
                if (sortOption === "Najviša cijena") {
                    sortedProducts.sort((a, b) => b.cijena - a.cijena);
                } else if (sortOption === "Najniža cijena") {
                    sortedProducts.sort((a, b) => a.cijena - b.cijena);
                } else if (sortOption === "Novo dodano") {
                    sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                }
                
                setProizvodi(sortedProducts);
            }
        } catch (err) {
            setError(err.message);
            setSubCategories([]);
            setProizvodi([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSortChange = (event) => {
        const newSortOption = event.target.value;
        setSortOption(newSortOption);
        
       
        let sortedProducts = [...proizvodi];
        if (newSortOption === "Najviša cijena") {
            sortedProducts.sort((a, b) => b.cijena - a.cijena);
        } else if (newSortOption === "Najniža cijena") {
            sortedProducts.sort((a, b) => a.cijena - b.cijena);
        } else if (newSortOption === "Novo dodano") {
            sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        
        setProizvodi(sortedProducts);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            
            const categoryMatch = allCategories.find(item => 
                item.name.toLowerCase() === decodedCategory.toLowerCase()
            );
            
            if (categoryMatch) {
                setActiveCategoryId(categoryMatch.id);
                await handleCategoryClick(categoryMatch);
            } else {
                setError("Kategorija nije pronađena");
                setProizvodi([]);
                setSubCategories([]);
            }
            
            setIsLoading(false);
        };

        fetchData();
    }, [decodedCategory, decodedGender, decodedPodkategorija]);
 
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
          alert('Greška pri dodavanju stavke.');
        } 
      }
      
      const dodajUWishlistu = async (proizvodId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8081/wishlist/add?proizvodId=${proizvodId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
        } catch (error) {
            console.error(error);
            alert('Greška pri dodavanju u wishlistu.');
        }
    };

    return (
        <div className="min-h-screen flex ">
            {/* Sidebar sa kategorijama */}
            <div className="w-64 bg-white shadow-md p-4">
                <ul className="space-y-2 py-4">
                    {allCategories.map((item) => (
                        <li key={item.name}>
                            <Link
                                to={`/kategorija/${encodeURIComponent(decodedGender)}/${item.name}`}
                                onClick={() => handleCategoryClick(item)}
                                className={`block px-4 py-2 rounded transition font-medium ${
                                    item.name === decodedCategory
                                        ? 'text-black font-semibold bg-gray-100'
                                        : 'text-gray-600 hover:text-black hover:bg-gray-50'
                                }`}
                            >
                                {item.name}
                            </Link>
                            {item.id === activeCategoryId && subCategories.length > 0 && (
                                <ul className="ml-4 mt-2 space-y-1">
                                    {subCategories.map((sub) => (
                                        <li key={sub.id}>
                                            <Link
                                                to={`/kategorija/${selectedGender}/${category}/${sub.naziv}`}
                                                className={`text-gray-600 hover:text-black hover:font-semibold text-sm font-medium block py-1 px-2 rounded hover:bg-gray-50 ${
                                                    sub.naziv === decodedPodkategorija ? 'text-black font-semibold bg-gray-100' : ''
                                                }`}
                                            >
                                                {sub.naziv}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Glavni sadržaj */}
            <main className="flex-1 px-8 py-8">
                {/* Header sa naslovom i sortiranjem */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-sm font-semibold text-gray-500">
                            {`${decodedGender} > ${decodedCategory}${decodedPodkategorija ? ` > ${decodedPodkategorija}` : ''}`}
                        </p>
                        <h1 className="text-2xl font-bold mt-1">
                            {decodedPodkategorija || decodedCategory} <span className="text-gray-500 font-normal">za {decodedGender}</span>
                        </h1>
                    </div>
                    
                    <div className="flex items-center">
                        <select
                            value={sortOption}
                            onChange={handleSortChange}
                            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                        >
                            <option value="">Sortiraj</option>
                            {sortOptions.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="border-t border-gray-200 my-4"></div>

                {/* Prikaz proizvoda */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
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
                            className="bg-white rounded-m shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 relative group"
                        >
                              <button
                                onClick={() => dodajUWishlistu(proizvod.id)}
                                className="absolute top-2 right-2 text-gray-300 hover:text-gray-700 z-20 text-xl"
                                aria-label="Dodaj u wishlist"
                                type="button"
                            >
                                <FaHeart />
                            </button>
                            
                            {/* Slika proizvoda */}
                            <div className="bg-gray-300 h-100 w-full flex items-center justify-center relative">
                           
                            <ImageCarousel spol ={decodedGender} proizvod={proizvod} category={decodedCategory} />
                             
                                {/* Dugme koje se pojavi na hover */}
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
            </main>
          
        </div>
        
    );
};

export default CategoryPage;