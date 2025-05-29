import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import CategoryPage from './CategoryPage';
import HomePage from './HomePage';
import ProizvodPage from './ProizvodPage';
import Footer from './Footer';
import AccountDetails from './AccountDetails';
import ShoppingCart from './ShoppingCart';
import PaymentDetails from './PaymentDetails';
import { CartProvider } from './CartContext';
import LoginForm from './LoginForm';
import UserDetails from './UserDetails';

function App() {
  return (
    <Router>
      <CartProvider>
        <Navbar />
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/proizvod/:spol/:kategorija/:marka/:id" element={<ProizvodPage />} />
              <Route path="/kategorija/:selectedGender/:category" element={<CategoryPage />} />
              <Route path="/kategorija/:selectedGender/:category/:podkategorija" element={<CategoryPage />} />
              <Route path="/orders" element={<AccountDetails/>}/>
              <Route path="/kosarica" element={<ShoppingCart />} />
              <Route path="/placanje" element={<PaymentDetails/>}/>
              <Route path="/prijava" element={<LoginForm/>}/>
              <Route path="/osobniPodaci" element={<UserDetails/>}/>
          </Routes>
            <Footer/>
      </CartProvider>      
    </Router>
      
  );
}

export default App;
