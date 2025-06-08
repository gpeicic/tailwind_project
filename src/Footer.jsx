import React from "react";
import { FaShoppingCart, FaRecycle, FaGlobe, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal, FaCcDiscover, FaCcStripe, FaCcDinersClub } from "react-icons/fa";

const Footer = () => {
  return (
    <div>
      {/* Prvi Navbar */}
      <nav className="shadow-md bg-[rgb(254,232,152)] text-black px-[200px] py-4 flex items-center justify-between ">
        <div className="flex items-center font-semibold text-black">
          <FaShoppingCart className="mr-2" />
          <span className="text-sm">Besplatna dostava | povrat</span>
        </div>
        <div className="flex items-center font-semibold text-black">
          <FaRecycle className="mr-2" />
          <span className="text-sm">100 dana pravo na povrat</span>
        </div>
        <div className="flex items-center font-semibold text-black">
          <FaGlobe className="mr-2" />
          <span className="text-sm">Plačanje pouzećem</span>
        </div>
      </nav>

      {/* Drugi Navbar s ikonama kreditnih kartica */}
      <nav className="bg-gray-200 py-4 flex justify-around">
        <FaCcVisa className="text-gray-500 text-2xl" />
        <FaCcMastercard className="text-gray-500  text-2xl" />
        <FaCcAmex className="text-gray-500 text-2xl" />
        <FaCcPaypal className="text-gray-600 text-2xl" />
        <FaCcDiscover className="text-gray-700 text-2xl" />
        <FaCcStripe className="text-gray-800 text-2xl" />
        <FaCcDinersClub className="text-gray-800 text-2xl" />
        <FaCcVisa className="text-gray-500 text-2xl" />
      </nav>

      {/* Footer */}
      <footer className="bg-white text-black py-10">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ne propusti nista!</h2>
          <p className="text-l font-semibold mb-6">Prijavi se za e-letak i primaj ekskluzivne ponude</p>
          
          {/* Točke (Checkbox-like circles) */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-black"></div>
              <span className="text-sm font-semibold">Za žene</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-black"></div>
              <span className="text-sm font-semibold">Za muškarce</span>
            </div>
          </div>

          {/* Email input field */}
          <div className="mb-6">
            <input
              type="email"
              placeholder="Tvoja e-mail adresa"
              className="w-140 py-2 px-4 bg-gray-100 rounded-sm"
            />
          </div>

          {/* Submit button */}
          <div className="mb-6">
            <button className="w-30 py-2 bg-black text-white font-semibold rounded-md">Prijavi se</button>
          </div>

          {/* Privacy text */}
          <p className="text-sm text-gray-400 mb-6 w-140 mx-auto text-center">
             Želim primati ABOUT ME e-letke o aktualnim trendovima, ponudama i kupon kodovima u skladu sa Pravila o zaštiti privatnosti. Na kraju svakog newslettera postoji opcija za povući svoj pristanak i otkazati daljnje e-letke ili možeš to učiniti sa slanjem poruke na sluzbazakorisnike@aboutme.hr.
        </p>


          {/* Divider */}
          <hr className="border-gray-300 mb-6" />

          {/* 4 Columns Section */}
          <div className="grid grid-cols-4 gap-6 text-sm max-w-[900px] mx-auto">
            <div>
              <h3 className="font-semibold mb-2">O nama</h3>
              <ul>
                <li><a href="#" className="text-gray-400">Naša povijest</a></li>
                <li><a href="#" className="text-gray-400">Naša misija</a></li>
                <li><a href="#" className="text-gray-400">Kontaktirajte nas</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Pomoć</h3>
              <ul>
                <li><a href="#" className="text-gray-400">Dostava</a></li>
                <li><a href="#" className="text-gray-400">Vrati proizvod</a></li>
                <li><a href="#" className="text-gray-400">Česta pitanja</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Pratite nas</h3>
              <ul>
                <li><a href="#" className="text-gray-400">Facebook</a></li>
                <li><a href="#" className="text-gray-400">Instagram</a></li>
                <li><a href="#" className="text-gray-400">Twitter</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Podrška</h3>
              <ul>
                <li><a href="#" className="text-gray-400">Uvjeti korištenja</a></li>
                <li><a href="#" className="text-gray-400">Politika privatnosti</a></li>
                <li><a href="#" className="text-gray-400">O nama</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
