import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import LoginForm from './LoginForm';
import UserDetails from './UserDetails';
import axios from 'axios';
import {
    FaUser,
    FaSearch,
    FaChevronLeft,
    FaChevronRight,
    FaShoppingCart,
    FaRecycle,
    FaGlobe,
    FaBell, FaHeart,
} from 'react-icons/fa';

export default function Navbar() {
    const [selectedGender, setSelectedGender] = useState('Žene');
    const [showMenuItem, setShowMenuItem] = useState('');
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const scrollRef = useRef(null);
    const hoverTimeout = useRef(null);
    const [categories, setCategories] = useState([]);
    const {stavke} = useCart();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [userEmail, setUserEmail] = useState(localStorage.getItem("email") || "");
    const [showUserDetails, setShowUserDetails] = useState(false);
    const { fetchStavke } = useCart();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = React.useState(false);
    const [hoveringDropdown, setHoveringDropdown] = React.useState(false);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.trim().length > 0) {
                setLoading(true);
                axios.get(`http://localhost:8081/proizvodi/search?query=${query}`)
                    .then(res => {
                        setResults(res.data);
                        setLoading(false);
                    })
                    .catch(() => {
                        setResults([]);
                        setLoading(false);
                    });
            } else {
                setResults([]);
            }
        }, 300); // debounce 300ms

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const handleLogout = async () => {
        await fetchStavke();
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        setIsLoggedIn(false);
        setUserEmail('');
        setShowUserDetails(false);
        navigate('/');
        window.location.reload();
    };

    useEffect(() => {
        if (selectedGender === 'Žene') {
            document.title = 'Ženska moda | Kupi online na ABOUT ME';
        } else if (selectedGender === 'Muškarci') {
            document.title = 'Muška moda | Kupi online na ABOUT ME';
        } else if (selectedGender === 'Djeca') {
            document.title = 'Moda za djecu | Kupi online na ABOUT ME';
        } else {
            document.title = 'Tvoja Web Shop Raketa 🚀';
        }
    }, [selectedGender]);
    
   

    const menuItems = [
        { id: 1, naziv: "Odjeca" },
        { id: 2, naziv: "Obuca" },
        { id: 3, naziv: "Sport" },
        { id: 4, naziv: "Dodaci" },
        { id: 5, naziv: "StreetWear" },
        { id: 6, naziv: "Premium" },
        { id: 7, naziv: "Promocija" },
        { id: 8, naziv: "Modne marke" }
    ];

    const featuredCategories = ['Najnovije', 'Sniženje', 'Popusti', 'Ekskluzivno'];
    const featuredBrands = ['Adidas', 'Nike', 'Puma', 'Reebok', 'Converse', 'Vans'];

    const scroll = (direction) => {
        const scrollAmount = 200;
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        if (!selectedGender || !showMenuItem?.id) return;

        let offset = 0;
        if (selectedGender === 'Muškarci') {
            offset = 8;
        } else if (selectedGender === 'Djeca') {
            offset = 16;
        }
    
        // Koristimo offsetirani ID za fetch
        const offsetId = showMenuItem.id + offset;

        fetch(`http://localhost:8081/podkategorija/${selectedGender}/${offsetId}`)
            .then(res => {
                if (!res.ok) throw new Error('Neuspješan fetch');
                return res.json();
            })
            .then(data => {
                setCategories(data);
            })
            .catch(err => console.error('Greška kod dohvata podkategorija:', err));
    }, [selectedGender, showMenuItem]);

    useEffect(() => {
        const checkOverflow = () => {
            if (scrollRef.current) {
                const isOver = scrollRef.current.scrollWidth > scrollRef.current.clientWidth;
                setIsOverflowing(isOver);
            }
        };
        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, []);

    const handleMouseEnter = (item) => {
        if (hoverTimeout.current) {
            clearTimeout(hoverTimeout.current);
        }
        setShowMenuItem(item);
    };
   
    const handleMouseLeave = () => {
        hoverTimeout.current = setTimeout(() => setShowMenuItem(''), 200);
    };


    return (
        <div className="relative">
            {/* First Navbar */}
            <nav className="shadow-md bg-white text-gray-800 px-[50px] py-4 flex items-center justify-between">
            <ul className="flex gap-6 text-sm font-semibold">
                {['Žene', 'Muškarci', 'Djeca'].map((item) => (
                <li
                    key={item}
                    onClick={() => setSelectedGender(item)}
                    className={`cursor-pointer relative group ${selectedGender === item ? 'text-black' : 'text-gray-500'}`}
                >
                    {item}
                    <span
                    className={`absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-black transition-all duration-300 ease-in-out ${selectedGender === item ? 'opacity-100 w-full' : 'opacity-0 w-0'}`}
                    ></span>
                </li>
                ))}
            </ul>

            <Link to="/">
                <img src="/logo.jpg" alt="Logo" className="h-8 object-contain cursor-pointer" />
            </Link>

            <div className="flex items-center gap-6">
                {/* User Icon */}
                <div
                className="text-xl cursor-pointer hover:text-black"
                onClick={() => {
                    if (isLoggedIn) {
                      setShowUserDetails(true);
                    } else {
                      setIsModalOpen(true);
                    }
                  }}
                >
                <FaUser className="text-xl cursor-pointer hover:text-black"/>
                </div>

                {/* Notifications Icon */}
                <div className="text-xl cursor-pointer hover:text-black">
                <FaBell />
                </div>

                {/* Heart (Favorites) Icon */}
                <div className="text-xl cursor-pointer hover:text-black">
                <FaHeart />
                </div>

                
                <div className="relative">
                    <Link to="/kosarica" className="text-2xl cursor-pointer hover:text-black">
                        <FaShoppingCart />
                    </Link>
                   
                    {stavke.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {stavke.length}
                        </span>
                    )}
                </div>
            </div>
            </nav>

            <div className="w-full border-t border-gray-100"></div>

           

            <div className="w-full border-t border-gray-100"></div>

            
            <nav className="bg-white text-gray-800 px-[40px] py-4 flex items-center justify-between relative z-40">
                {isOverflowing && (
                    <button className="mr-2 text-gray-600 hover:text-black" onClick={() => scroll('left')}>
                        <FaChevronLeft />
                    </button>
                )}

                <div
                    ref={scrollRef}
                    className="flex gap-6 text-sm font-semibold overflow-x-auto whitespace-nowrap scroll-smooth hide-scrollbar relative"
                    style={{ flex: 1 }}
                >
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            className="relative "
                            onMouseEnter={() => handleMouseEnter(item)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link
                                to={`/kategorija/${selectedGender}/${item.naziv}`}
                                className="cursor-pointer text-black-500 font-bold hover:text-black hover:bg-gray-100 px-2 py-1 rounded transition"
                            >
                                {item.naziv}
                            </Link>
                        </div>
                    ))}
                </div>

                {isOverflowing && (
                    <button className="ml-2 text-gray-600 hover:text-black" onClick={() => scroll('right')}>
                        <FaChevronRight />
                    </button>
                )}

                <div className="relative w-full max-w-md mx-auto">
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer hover:text-black" />
                    <input
                    type="text"
                    placeholder="Pretraži..."
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-black pr-10"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => {
                        if (!hoveringDropdown) setShowDropdown(false);
                    }}
                    />

                    {loading && <div className="absolute left-0 mt-2 text-sm text-gray-400">Pretražujem...</div>}

                    {showDropdown && results.length > 0 && (
                    <ul
                        className="absolute z-10 w-full bg-white border mt-2 rounded-md max-h-60 overflow-y-auto shadow-lg text-black"
                        onMouseEnter={() => setHoveringDropdown(true)}
                        onMouseLeave={() => {
                        setHoveringDropdown(false);
                        setShowDropdown(false);
                        }}
                    >
                        {results.map((proizvod) => (
                        <li
                            key={proizvod.id}
                            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                            navigate(`/proizvod/${encodeURIComponent(proizvod.podkategorija.kategorija.spol)}/${encodeURIComponent(proizvod.podkategorija.kategorija.naziv)}/${encodeURIComponent(proizvod.marka)}/${proizvod.id}`);
                            setQuery('');    
                            setShowDropdown(false);
                            }}
                        >
                            <img
                            src={`/proizvodi/${encodeURIComponent(proizvod.ime)}.jpg`}
                            alt={proizvod.ime}
                            className="w-10 h-10 object-cover rounded mr-3"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                            <span>{proizvod.ime}</span>
                        </li>
                        ))}
                    </ul>
                    )}
                </div>
            </nav>
    
             <nav className="shadow-md bg-black text-gray-800 px-[200px] py-4 flex items-center justify-between">
                <div className="flex items-center text-white">
                    <FaShoppingCart className="mr-2" />
                    <span className="text-sm">Besplatna dostava | povrat</span>
                </div>
                <div className="flex items-center text-white">
                    <FaRecycle className="mr-2" />
                    <span className=" text-sm">100 dana pravo na povrat</span>
                </div>
                <div className="flex items-center text-white">
                    <FaGlobe className="mr-2" />
                    <span className=" text-sm">Plačanje pouzećem</span>
                </div>
            </nav>

            {showMenuItem && (
                <div
                    className="absolute bg-white shadow-xl w-full px-[50px] py-6 z-30"
                    style={{ top: '110px' }}
                    onMouseEnter={() => {
                        clearTimeout(hoverTimeout.current);
                        setShowMenuItem(showMenuItem);
                    }}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="flex justify-between max-w-7xl mx-auto">
                        <div className="w-1/3">
                            <h3 className="text-lg font-semibold mb-2">Kupuj po kategorijama</h3>
                            <ul>
                                {categories.map((category) => (
                                    <li key={category.id} className="py-1 hover:font-bold cursor-pointer">
                                        {category.naziv}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-1/3">
                            <h3 className="text-lg font-semibold mb-2">Istaknute kategorije</h3>
                            <ul>
                                {featuredCategories.map((category) => (
                                    <li key={category} className="py-1 hover:font-bold cursor-pointer">{category}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="w-1/3">
                            <h3 className="text-lg font-semibold mb-2">Naše najbolje modne marke</h3>
                            <ul>
                                {featuredBrands.map((brand) => (
                                    <li key={brand} className="py-1 hover:font-bold cursor-pointer">{brand}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            {isModalOpen && (
                <LoginForm
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                setIsLoggedIn={setIsLoggedIn}
                setUserEmail={setUserEmail}
              />
            
            )}

            {showUserDetails && (
            <div
                className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex justify-center items-center"
                onClick={() => setShowUserDetails(false)}
            >
                <div onClick={(e) => e.stopPropagation()}>
                <UserDetails email={userEmail} onLogout={handleLogout} />
                </div>
            </div>
            )}
        </div>
    );
}
