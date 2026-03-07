import React, { useState, useEffect } from 'react';
import { Store, ArrowRight, Loader2, MapPin, Star, Search } from 'lucide-react';

export default function Shops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState('All');
  const [shopSearchTerm, setShopSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/shops')
      .then(res => res.json())
      .then(data => {
        setShops(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching shops:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ padding: '4rem 2rem' }}>
      <div className="container">
        <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', color: 'var(--color-secondary)', marginBottom: '1rem' }}>
            Discover Local Shops
          </h1>
          <p style={{ color: 'var(--color-text-muted-light)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Meet the talented artisans and small business owners strengthening our Canadian communities.
          </p>

          <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {/* Shop Name Search */}
            <div style={{ position: 'relative', width: '350px' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)', opacity: 0.6 }} />
              <input 
                className="input" 
                placeholder="Search shops by name (e.g. 'Da goon')..." 
                value={shopSearchTerm}
                onChange={e => setShopSearchTerm(e.target.value)}
                style={{ paddingLeft: '3rem', width: '100%', height: '50px', backgroundColor: 'white' }}
              />
            </div>

            {/* City Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>Filter by City:</span>
              <select 
                className="input" 
                value={filterCity}
                onChange={e => setFilterCity(e.target.value)}
                style={{ width: '200px', height: '50px', backgroundColor: 'white' }}
              >
                <option value="All">All Cities</option>
                {Array.from(new Set(shops.map(s => s.city).filter(Boolean))).sort().map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {shops.length === 0 ? (
          <div className="glass" style={{ padding: '4rem', textAlign: 'center' }}>
            <Store size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted-light)' }}>
              No shops have registered yet. Be the first to start selling!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4" style={{ gap: '2rem' }}>
            {shops
              .filter(shop => {
                const matchesCity = filterCity === 'All' || shop.city === filterCity;
                const matchesSearch = shop.storeName?.toLowerCase().includes(shopSearchTerm.toLowerCase());
                return matchesCity && matchesSearch;
              })
              .map(shop => (
              <div key={shop.vendorId} className="glass shop-card" style={{ 
                padding: '2rem', 
                borderRadius: '24px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                border: '1px solid var(--color-border-light)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer'
              }}>
                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                  {shop.logoUrl ? (
                    <img 
                      src={shop.logoUrl} 
                      alt={shop.storeName} 
                      style={{ width: '100px', height: '100px', borderRadius: '24px', objectFit: 'cover', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }} 
                    />
                  ) : (
                    <div style={{ 
                      width: '100px', 
                      height: '100px', 
                      borderRadius: '24px', 
                      backgroundColor: 'var(--color-bg-light)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'var(--color-primary)',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }}>
                      {shop.storeName.charAt(0)}
                    </div>
                  )}
                </div>

                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-secondary)' }}>
                  {shop.storeName}
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted-light)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  <MapPin size={14} className="text-primary" />
                  <span style={{ color: shop.city ? 'var(--color-primary)' : 'inherit', fontWeight: shop.city ? 600 : 400 }}>
                    {shop.city || 'Canada'}
                  </span>
                  <span style={{ margin: '0 0.4rem' }}>•</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span style={{ fontWeight: 600, color: 'var(--color-secondary)' }}>4.9</span>
                  </div>
                </div>

                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/shop/${shop.vendorId}`;
                  }}
                >
                  Visit Store <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .shop-card:hover {
          transform: translateY(-10px);
          border-color: var(--color-primary);
          box-shadow: 0 12px 24px rgba(204, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
