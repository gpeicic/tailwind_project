import React, { useState } from 'react';
import { HomeIcon, PackageIcon } from 'lucide-react';
import { CreditCardIcon, WalletIcon } from 'lucide-react';


export default function PaymentDetails() {
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
                <div
                    className={`border rounded-xl p-4 cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'card' ? 'border-black bg-white' : 'border-transparent bg-gray-200'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                >
                    <div className="flex items-center space-x-3">
                    <CreditCardIcon size={28} />
                    <span className="text-md font-medium">Kartično plaćanje</span>
                    </div>
                    <span className="text-sm text-gray-600">Visa, Mastercard, Maestro</span>
                </div>

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

                <div
                    className={`border rounded-xl p-4 cursor-pointer flex items-center justify-between ${
                    paymentMethod === 'paypal' ? 'border-black bg-white' : 'border-transparent bg-gray-200'
                    }`}
                    onClick={() => setPaymentMethod('paypal')}
                >
                    <div className="flex items-center space-x-3">
                    <img src="/paypal-logo.png" alt="PayPal" className="h-6" />
                    <span className="text-md font-medium">PayPal</span>
                    </div>
                    <span className="text-sm text-gray-600">Preusmjeravanje na PayPal</span>
                </div>
                </div>
            </>
        )}
      </div>

      {/* Right panel - trenutno prazno i pomaknuto 25% od lijeve strane */}
      <div className="w-1/2 bg-gray-200  p-6 min-h-full">
        {/* Ostavi prazno za sada */}
      </div>
    </div>
  );
}
