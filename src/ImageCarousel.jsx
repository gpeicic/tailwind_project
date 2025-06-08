import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {  FaChevronLeft, FaChevronRight,FaTrash } from 'react-icons/fa';


function ImageCarousel({ spol, proizvod, category }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [validImages, setValidImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const imagePaths = Array.from({ length: 5 }, (_, i) =>
        `/proizvodi/${proizvod.ime}${i === 0 ? '' : ` (${i})`}.jpg`
    );

    useEffect(() => {
        const checkImages = async () => {
            setLoading(true);
            const results = await Promise.all(
                imagePaths.map(src =>
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
        };

        checkImages();
    }, [proizvod.ime]);

    const prev = () => {
        setCurrentIndex(prevIndex =>
            prevIndex === 0 ? validImages.length - 1 : prevIndex - 1
        );
    };

    const next = () => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % validImages.length);
    };

    return (
        <div className="relative w-full h-100 flex-items-center overflow-hidden bg-gray-200 group">
            {loading ? (
                <p className="text-gray-500 flex justify-center items-center h-full">Učitavanje slika...</p>
            ) : validImages.length === 0 ? (
                <p className="text-gray-500 flex justify-center items-center h-full">Nema dostupnih slika</p>
            ) : (
                <>  
                  <Link to={`/proizvod/${encodeURIComponent(spol)}/${encodeURIComponent(category)}/${encodeURIComponent(proizvod.marka)}/${proizvod.id}`}> 
                    {/* Carousel wrapper */}
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
                                    alt={`${proizvod.ime} ${index}`}
                                    className="w-full h-full object-cover flex"
                                    style={{ width: `${100 / validImages.length}%` }}
                                />
                            ))}
                           
                    
                    </div>
                    </Link>
                    {/* Controls */}
                    <button
                        onClick={prev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-12 bg-white bg-opacity-50 text-gray-400 text-2xl font-bold rounded-r-full flex items-center justify-center opacity-0 group-hover:opacity-75 transition z-10"
                    >
                         <FaChevronLeft />
                    </button>

                    <button
                        onClick={next}
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-12 bg-white bg-opacity-50 text-gray-400 text-2xl font-bold rounded-l-full flex items-center justify-center opacity-0 group-hover:opacity-75 transition z-10"
                    >
                         <FaChevronRight />
                    </button>
                </>
            )}
        </div>
    );
};

export default ImageCarousel;