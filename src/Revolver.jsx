import React, { useState, useEffect } from 'react';
import {  FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const images = [
  '/picture1.png',
  '/picture2.jpg',
  '/picture3.jpg',
  '/picture4.jpg',
];

const titles = [
  'Majice i topovi',
  'Vodič za haljine',
  'Svečane haljine',
  'Svijet denima',
];

export default function Revolver() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrent(index);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full mx-auto overflow-hidden shadow-lg">
     
    

      {/* Slike s naslovima i gumbom */}
      <div className="relative w-full h-[700px]">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-1000 ${
              index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img src={img} alt={`Slide ${index}`} className="w-full h-full object-cover" />

            {/* Naslov preko slike */}
            <div className="absolute top-120 left-1/2 transform -translate-x-1/2 text-white text-4xl font-bold drop-shadow-lg text-center text-outline">
              {titles[index]}
            </div>

            {/* Gumb "Otkrij sada" */}
            <div className="absolute top-135 left-1/2 transform -translate-x-1/2 mt-4">
              <button className="bg-white text-black px-6 py-3 text-sm  font-bold tracking-wider rounded hover:bg-white hover:text-black transition">
                Otkrij sada
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Točkice */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {images.map((_, index) => (
          <div
            key={index}
            className={`relative w-6 transition-all duration-300 cursor-pointer ${
              index === current ? 'w-12 bg-black' : 'w-6 bg-gray-300'
            } h-1 rounded-full`}
            onClick={() => goToSlide(index)}
          >
            {index === current && (
              <div
                className="absolute bottom-0 left-0 w-full h-1 bg-black transition-all duration-1000"
              />
            )}
          </div>
        ))}
      </div>

      {/* Strelice */}
      <div className="absolute bottom-4 right-4 flex gap-4 z-20">
        <button
          onClick={prevSlide}
          className="p-3 bg-black bg-opacity-60 text-white rounded-full hover:bg-opacity-90 transition"
          aria-label="Previous slide"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={nextSlide}
          className="p-3 bg-black bg-opacity-60 text-white rounded-full hover:bg-opacity-90 transition"
          aria-label="Next slide"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
