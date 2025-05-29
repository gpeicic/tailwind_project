// LoginForm.jsx
import React, { useState } from 'react';
import { FaGoogle, FaFacebookF, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext';

const LoginForm = ({ isModalOpen, setIsModalOpen, setIsLoggedIn, setUserEmail }) => {
    const [authTab, setAuthTab] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [registrationMessage, setRegistrationMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');
    const [loginMessageColor, setLoginMessageColor] = useState('');
    const navigate = useNavigate();
    
    const { fetchStavke } = useCart();

    const isFormValid = email && password && acceptTerms;

    const handleRegistrationSubmit = async (event) => {
        event.preventDefault();

        if (!acceptTerms) {
            setRegistrationMessage('Morate prihvatiti uvjete korištenja.');
            setIsSuccess(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/korisnik', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                setRegistrationMessage('Uspješno registrirani.');
                setIsSuccess(true);
            } else {
                setRegistrationMessage('Došlo je do pogreške pri registraciji.');
                setIsSuccess(false);
            }
        } catch (error) {
            setRegistrationMessage('Greška prilikom slanja zahtjeva.');
            setIsSuccess(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8081/korisnik/prijava", {
                email,
                password,
            }, {
                headers: { "Content-Type": "application/json" }
            });

            const token = response.data.token;
            localStorage.setItem("token", token);
            localStorage.setItem("email", email);
            setIsLoggedIn(true);
            setUserEmail(email);
            setLoginMessage("Uspješna prijava!");
            setLoginMessageColor("green");
            await fetchStavke();
            setTimeout(() => {
                navigate('/');
                setIsModalOpen(false);
            }, 1000);
        } catch (err) {
            console.error("Greška pri prijavi:", err);
            setLoginMessage("Neispravan email ili lozinka");
            setLoginMessageColor("red");
        }
    };

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50 flex justify-center items-center" onClick={() => setIsModalOpen(false)}>
            <div className="bg-white p-8 rounded-lg w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
                <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setIsModalOpen(false)}>
                    <FaTimes className="text-xl" />
                </div>

                <h2 className="text-xl font-semibold text-center mb-6">Prijavi se</h2>
                <hr className="mb-8 border-gray-300" />

                <div className="flex justify-center space-x-4 mb-8">
                    <button
                        onClick={() => setAuthTab('register')}
                        className={`px-8 py-2 border rounded ${authTab === 'register' ? 'border-black text-black bg-white font-semibold' : 'border-gray-400 text-gray-500'}`}
                    >
                        Registracija
                    </button>
                    <button
                        onClick={() => setAuthTab('login')}
                        className={`px-12 py-2 border rounded ${authTab === 'login' ? 'border-black text-black bg-white' : 'border-gray-400 text-gray-500'}`}
                    >
                        Prijavi se
                    </button>
                </div>

                {authTab === 'register' ? (
                    <>
                        <button
                            className="w-full border flex font-semibold items-center gap-2 px-4 py-2 rounded mb-2"
                            onClick={() => {
                                window.location.href = 'http://localhost:8081/oauth2/authorization/google';
                            }}
                        >
                            <FaGoogle className="text-red-500" />
                            Prijavi se s Google
                        </button>

                        <button className="w-full border flex items-center font-semibold gap-2 px-4 py-2 rounded mb-4">
                            <FaFacebookF className="text-blue-600" />
                            Prijavi se s Facebook
                        </button>

                        <div className="w-full border-b border-gray-400 my-2 text-center">ILI</div>

                        <input
                            type="email"
                            className="w-full border rounded px-4 py-2 mb-4 focus:outline-none focus:border-black focus:border-2"
                            placeholder="Unesi svoj email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            className="w-full border rounded px-4 py-2 mb-4 focus:outline-none focus:border-black focus:border-2"
                            placeholder="Unesi lozinku"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div className="flex justify-between text-xs text-gray-500">
                            <label className="flex items-center">
                                <input type="checkbox" onChange={() => setAcceptTerms(!acceptTerms)} />
                                <span className="ml-2">Prihvaćam uvjete korištenja</span>
                            </label>
                        </div>

                        <button
                            className={`w-full text-white py-2 rounded mt-4 ${isFormValid ? 'bg-black' : 'bg-gray-400'}`}
                            type="submit"
                            onClick={handleRegistrationSubmit}
                            disabled={!isFormValid}
                        >
                            Registracija
                        </button>

                        {registrationMessage && (
                            <p className={`mt-2 text-sm ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                                {registrationMessage}
                            </p>
                        )}
                    </>
                ) : (
                    <>
                        <form onSubmit={handleLogin}>
                            <input
                                type="email"
                                className="w-full border rounded px-4 py-2 mb-4 focus:outline-none focus:border-black focus:border-2"
                                placeholder="Unesi svoj email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                className="w-full border rounded px-4 py-2 mb-4 focus:outline-none focus:border-black focus:border-2"
                                placeholder="Unesi lozinku"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                                <a href="/" className="cursor-pointer">Zaboravljena lozinka?</a>
                            </div>
                            <button type="submit" className="w-full text-white bg-black py-2 rounded mt-4">
                                Prijava
                            </button>
                        </form>
                        {loginMessage && (
                            <div style={{ color: loginMessageColor, marginTop: "10px" }}>
                                {loginMessage}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default LoginForm;
