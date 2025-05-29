import React from 'react';

export default function LayoutSlika() {
  return (
    <div className="w-full">
      {/* Gornja slika */}
      <div className="w-full mt-[100px]">
        <img
          src="/doleSlike5.jpg"
          alt="Donja slika"
          className="mx-auto w-[1400px] h-auto object-cover"
        />
      </div>

      {/* Sivi box sa tekstom i slikom */}
      <div className="w-full mt-[100px] flex justify-center">
        <div className="w-[1400px] flex bg-[rgb(51,50,55)]">
        
          {/* Lijevi tekst s marginama */}
          <div className="w-1/2 p-10 flex items-center">
            <div className="ml-25 mr-10">
              <p className="text-1xl text-gray-100 font-semibold">Laura</p>
              <p className="text-4xl font-bold text-gray-100 leading-[1.35]">
                Beige and White Look by Ralph Lauren Fashion
              </p>
              {/* Gumb ispod teksta */}
              <button className="mt-8 py-3 px-15 bg-white text-black font-semibold">
                Na Outfit
              </button>
            </div>
          </div>

          {/* Desna slika */}
          <div className="w-1/2 h-[70vh]">
            <img
              src="/doleSlike3.jpg"
              alt="Desna slika"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Brand Focus i slike */}
      <div className="w-full mt-[100px] flex flex-col items-center">
        {/* Naslov "Brand Focus" */}
        <p className="text-2xl font-semibold text-gray-800 mb-2 w-[1400px]">Brand Focus</p>
        {/* Podnaslov "Ne smiješ propustiti ove modne marke" */}
        <p className="text-l text-black mb-15 w-[1400px]">
          Ne smiješ propustiti ove modne marke
        </p>

        {/* Slike */}
        <div className="flex justify-between w-[1400px] space-x-4">
          {/* Slika 1 */}
          <div className="w-1/3">
            <img
              src="/doleSlike1.png"
              alt="Slika 1"
              className="w-full h-[620px] object-cover"
            />
            <p className="text-center mt-2 text-sm text-gray-600 text-left">Prošeći ulicom</p>
            <p className="text-center text-lg  font-semibold text-gray-800 text-left">Dolce Gabana</p>
          </div>

          {/* Slika 2 */}
          <div className="w-1/3">
            <img
              src="/picture4.jpg"
              alt="Slika 2"
              className="w-full h-[620px] object-cover"
            />
            <p className="text-center mt-2 text-sm text-gray-600 text-left">The Classic</p>
            <p className="text-center text-lg font-semibold text-gray-800 text-left">Levi's</p>
          </div>

          {/* Slika 3 */}
          <div className="w-1/3">
            <img
              src="/doleSlike4.jpg"
              alt="Slika 3"
              className="w-full h-[620px] object-cover"
            />
            <p className="text-center mt-2 text-sm text-gray-600 text-left">India's Fashion Week</p>
            <p className="text-center text-lg font-semibold text-gray-800 text-left">Balenciaga</p>
            
          </div>
        </div>
      </div>
    </div>
  );
}
