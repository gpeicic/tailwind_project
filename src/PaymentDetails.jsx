import React, { useState,useEffect } from 'react';
import { HomeIcon, PackageIcon } from 'lucide-react';
import { CreditCardIcon, WalletIcon } from 'lucide-react';
import { useCart } from './CartContext';
import axios from 'axios';


export default function PaymentDetails() {
  const { stavke,fetchStavke } = useCart();
  const [proizvodiMap, setProizvodiMap] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const [step, setStep] = useState(2);
  const [deliveryMethod, setDeliveryMethod] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [formData, setFormData] = useState({
    salutation: '',
    country: '',
    name: '',
    street: '',
    additional: '',
    zip: '',
    city: '',
    dob: '',
    phone: '',
    coupon: ''
  });

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    async function fetchProizvodi() {
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

    if (stavke.length > 0) {
      fetchProizvodi();
    } else {
      setLoading(false);
    }
  }, [stavke]);

  if (loading) return <div>Učitavanje...</div>;
  return (
    <div className="flex h-full w-full min-h-screen">
      {/* Left panel */}
      <div className="w-1/2 bg-white p-6 space-y-6 pl-[15%] pr-[4%]">
        {/* Koraci 1,2,3 u horizontalnom rasporedu */}
        <div className="flex space-x-4 justify-left mb-6 ">
        {[1, 2, 3].map((num) => (
            <div
                key={num}
                className="flex items-center space-x-4 cursor-pointer"
                onClick={() => setStep(num)}
            >
                <div
                className={`w-8 h-8 rounded-md flex items-center justify-center border ${
                    step === num ? 'bg-black text-white' : 'bg-gray-200 text-black'
                }`}
                >
                {num}
                </div>
                <span className="text-lg font-semibold">
                {num === 1 && 'Kontakt'}
                {num === 2 && 'Dostava'}
                {num === 3 && 'Nacin placanja'}
                </span>
            </div>
            ))}
        </div>

        {/* Sadržaj lijeve strane (korak 2 - Dostava) */}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-semibold text-left mb-4 ">Detalji o dostavi</h2>
            <p className="text-lg font-medium mb-4 text-left font-semibold">Kamo da dostavimo pošiljku</p>
            <div className="flex space-x-4 mb-6">
              <div
                className={`flex-1 border rounded-xl p-4 cursor-pointer flex flex-col items-center space-y-2
                  ${deliveryMethod === 'home' ? 'border-black bg-white' : 'border-transparent bg-gray-200'} `}
                onClick={() => setDeliveryMethod('home')}
              >
                <div className="flex items-center space-x-2">
                    <span>Dostava na kućni prag</span>
                    <HomeIcon size={32} />
                </div>
                <div className="bg-gray-200 pl-7 pr-7 pt-1 pb-1 rounded-md"> <p className="text-sm mt-1 font-semibold text-gray-700">Standardna dostava</p></div>
              </div>
              <div
                className={`flex-1 border rounded-xl p-4 cursor-pointer flex flex-col items-center space-y-2
                  ${deliveryMethod === 'pickup' ? 'border-black bg-white' : 'border-transparent bg-gray-200'} `}
                onClick={() => setDeliveryMethod('pickup')}
              >
                 <div className="flex items-center space-x-2">
                    <p>Paketomat ili poštanski ured</p>   <PackageIcon className="mb-2" size={32} />
                   
                 </div>
                 <p className="text-green-600 text-sm mt-1 bg-green-100 pl-14 pr-14 pt-1 pb-1 rounded-md">manje emisije CO2</p>    
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Adresa za dostavu</h3>
            <form className="space-y-4">
            <div className="flex space-x-4">
                <select
                name="salutation"
                onChange={handleFormChange}
                className="w-1/2 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                value={formData.salutation}
                >
                <option value="">Vrsta obraćanja</option>
                <option value="gospodin">Gospodin</option>
                <option value="gospodja">Gospođa</option>
                </select>
                <select
                name="country"
                onChange={handleFormChange}
                className="w-1/2 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                value={formData.country}
                >
                <option value="">Zemlja</option>
                <option value="hrvatska">Hrvatska</option>
                </select>
            </div>

            <div className="flex space-x-4">
                <input
                type="text"
                name="firstName"
                placeholder="Ime"
                onChange={handleFormChange}
                className="w-1/2 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                value={formData.firstName}
                />
                <input
                type="text"
                name="lastName"
                placeholder="Prezime"
                onChange={handleFormChange}
                className="w-1/2 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                value={formData.lastName}
                />
            </div>

            <input
                type="text"
                name="street"
                placeholder="Adresa ulice"
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                value={formData.street}
            />
            <input
                type="text"
                name="additional"
                placeholder="Dodatne informacije"
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                value={formData.additional}
            />

            <div className="flex space-x-4">
                <input
                type="text"
                name="zip"
                placeholder="Poštanski broj"
                onChange={handleFormChange}
                className="w-1/2 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                value={formData.zip}
                />
                <input
                type="text"
                name="city"
                placeholder="Grad"
                onChange={handleFormChange}
                className="w-1/2 p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                value={formData.city}
                />
            </div>

            <input
                type="date"
                name="dob"
                placeholder="Datum rođenja"
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                value={formData.dob}
            />
            </form>
          </>
        )}
        {step === 3 && (
        <>
          <h2 className="text-2xl font-semibold text-left mb-4">Način plaćanja</h2>
          <p className="text-lg font-medium mb-4 text-left font-semibold">Odaberite način plaćanja</p>

          <div className="flex flex-col space-y-4">
            {/* Kartično plaćanje */}
            <div
              className={`border rounded-xl p-4 cursor-pointer flex flex-col space-y-2 transition-all duration-300 ${
                paymentMethod === 'card' ? 'border-black bg-white' : 'border-transparent bg-gray-200'
              }`}
              onClick={() => setPaymentMethod('card')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCardIcon size={28} />
                  <span className="text-md font-medium">Kartično plaćanje</span>
                </div>
                <span className="text-sm text-gray-600">Visa, Mastercard, Maestro</span>
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-4 space-y-3">
                  <input
                    type="text"
                    placeholder="Broj kartice"
                    className="w-full border p-2 rounded-md"
                  />
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="Datum isteka (MM/YY)"
                      className="w-1/2 border p-2 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="w-1/2 border p-2 rounded-md"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Ime i prezime"
                    className="w-full border p-2 rounded-md"
                  />
                </div>
              )}
            </div>

            {/* Plaćanje pouzećem */}
            <div
              className={`border rounded-xl p-4 cursor-pointer flex items-center justify-between ${
                paymentMethod === 'cash' ? 'border-black bg-white' : 'border-transparent bg-gray-200'
              }`}
              onClick={() => setPaymentMethod('cash')}
            >
              <div className="flex items-center space-x-3">
                <WalletIcon size={28} />
                <span className="text-md font-medium">Plaćanje pouzećem</span>
              </div>
              <span className="text-sm text-gray-600">Gotovinom pri preuzimanju</span>
            </div>

            {/* PayPal */}
            <div
              className={`border rounded-xl p-4 cursor-pointer flex flex-col space-y-2 transition-all duration-300 ${
                paymentMethod === 'paypal' ? 'border-black bg-white' : 'border-transparent bg-gray-200'
              }`}
              onClick={() => setPaymentMethod('paypal')}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src="/paypal-logo.png" alt="PayPal" className="h-6" />
                  <span className="text-md font-medium">PayPal</span>
                </div>
                <span className="text-sm text-gray-600">Preusmjeravanje na PayPal</span>
              </div>

              {paymentMethod === 'paypal' && (
                <div className="mt-4 space-y-3">
                  <input
                    type="email"
                    placeholder="PayPal email"
                    className="w-full border p-2 rounded-md"
                  />
                  <input
                    type="password"
                    placeholder="PayPal lozinka"
                    className="w-full border p-2 rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
      </div>

      {/* Right panel - trenutno prazno i pomaknuto 25% od lijeve strane */}
      <div className="w-1/2 bg-gray-200  p-6 min-h-full">
        <h2 className="text-xl font-semibold mb-4">Proizvodi u tvojoj košarici</h2>
        <div className="flex flex-col gap-4">
          {stavke.map((stavka) => {
            const proizvod = proizvodiMap[stavka.proizvod_id];
            if (!proizvod) return null;

            return (
              <div key={stavka.id} className="flex items-center justify-between bg-white shadow-sm rounded p-3">
              <div className="flex items-center">
                <div className="w-20 h-24 mr-4">
                  <img
                    src={`/proizvodi/${proizvod.ime}.jpg`}
                    alt={proizvod.ime}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div>
                  <p className="font-semibold">{proizvod.ime}</p>
                  <p className="text-sm text-gray-600">{proizvod.marka}</p>
                  <p className="text-sm text-gray-600">{proizvod.opis}</p>
                  <p className="mt-1 font-semibold">
                    {stavka.kolicina} kom × {proizvod.cijena.toFixed(2)} $ = {(stavka.kolicina * proizvod.cijena).toFixed(2)} $
                  </p>
                </div>
              </div>
          
              <button
                onClick={async () => {
                  try {
                    await axios.delete("http://localhost:8081/listaNarudzba", {
                      headers: { Authorization: `Bearer ${token}` },
                      data: stavka,
                    });
                    await fetchStavke();
                  } catch (err) {
                    console.error("Greška pri brisanju stavke", err);
                    await fetchStavke(); // fallback
                  }
                }}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Obriši stavku"
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
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
