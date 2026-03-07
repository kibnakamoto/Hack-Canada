import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import Home from './pages/Home';
import Storefront from './pages/Storefront';
import Shops from './pages/Shops';
import ShopView from './pages/ShopView';
import './index.css';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Router>
      <CartProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar setIsCartOpen={setIsCartOpen} />
          
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/storefront" element={<Storefront />} />
              <Route path="/shops" element={<Shops />} />
              <Route path="/shop/:vendorId" element={<ShopView />} />
            </Routes>
          </main>
          
          <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
