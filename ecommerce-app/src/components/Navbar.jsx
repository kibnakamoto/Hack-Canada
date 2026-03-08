import React, { useEffect, useState } from 'react';
import { ShoppingBag, Menu, Search, User, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar({ setIsCartOpen }) {
  const { cartCount } = useCart();
  const [user, setUser] = useState(null);
  const [companyName, setCompanyName] = useState(null);

  useEffect(() => {
    fetch('/profile')
      .then(res => {
        if (!res.ok) throw new Error('Not logged in');
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => setUser(null));

    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.company_name) setCompanyName(data.company_name);
        }
      })
      .catch(() => { });
  }, []);

  const handleLogin = () => {
    window.location.href = import.meta.env.DEV ? 'http://127.0.0.1:5000/login' : '/login';
  };

  const handleLogout = () => {
    window.location.href = import.meta.env.DEV ? 'http://127.0.0.1:5000/logout' : '/logout';
  };

  return (
    <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, padding: '1rem 0' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        {/* Mobile Menu & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn-icon" style={{ display: 'none' /* hidden on desktop, placeholder */ }}>
            <Menu size={24} />
          </button>

          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'var(--color-primary)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.2rem'
            }}>
              CL
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--color-secondary)' }}>
              CanaLocal
            </span>
          </a>
        </div>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: '2rem', fontWeight: 500, alignItems: 'center' }} className="desktop-nav">
          <a href="/shops">Discover Shops</a>
          <a href="#sell" className="badge" style={{
            backgroundColor: 'var(--color-bg-light)',
            color: 'var(--color-secondary)',
            padding: '0.5rem 1rem',
            border: '1px solid var(--color-border-light)',
            textTransform: 'none',
            fontSize: '0.9rem'
          }}>
            Sell with us
          </a>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button className="btn-icon" onClick={() => window.location.href = '/shops'}>
            <Search size={20} />
          </button>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                onClick={() => window.location.href = '/storefront'}
              >
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-secondary)' }}>
                  {companyName || (user ? (user.name || user.email || 'Profile') : 'Profile')}
                </span>
              </div>
              <button className="btn-icon" onClick={handleLogout} title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button className="btn-icon" onClick={handleLogin} title="Login">
              <User size={20} />
            </button>
          )}
          <button className="btn-icon" onClick={() => setIsCartOpen(true)} style={{ position: 'relative' }}>
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white'
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </nav>
  );
}
