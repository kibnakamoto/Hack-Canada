import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import VendorCard from '../components/VendorCard';
import { vendors } from '../data/vendors';
import { ArrowLeft, ArrowRight, Store } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  return (
    <div className="animate-fade-in">
      <Hero />
      
      {/* Featured Local Shops Section */}
      <section className="container" id="shops" style={{ padding: '4rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Store size={24} className="text-primary" />
              <h2 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--color-secondary)' }}>
                Featured Local Shops
              </h2>
            </div>
            <p style={{ color: 'var(--color-text-muted-light)', fontSize: '1.1rem' }}>
              Discover the incredible artisans and businesses in your community.
            </p>
          </div>
          
          <button 
            className="btn btn-secondary"
            onClick={() => window.location.href = '/shops'}
          >
            View All Shops
          </button>
        </div>

        <div className="grid grid-cols-4">
          {vendors.map(vendor => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="container" id="discover" style={{ padding: '0 2rem 4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-secondary)' }}>
              Trending Local Goods
            </h2>
            <p style={{ color: 'var(--color-text-muted-light)', fontSize: '1.1rem' }}>
              Support local with these popular finds.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-icon" style={{ border: '1px solid var(--color-border-light)' }}>
              <ArrowLeft size={20} />
            </button>
            <button className="btn-icon" style={{ border: '1px solid var(--color-border-light)' }}>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4">
          {products.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Sell With Us Banner */}
      <section id="sell" style={{ 
        margin: '2rem 0 4rem',
        padding: '6rem 2rem',
        backgroundColor: 'var(--color-bg-dark)',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          zIndex: 0
        }} />
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'white' }}>
            Grow Your Local Business
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted-dark)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Join TrueNorth marketplace and connect with thousands of Canadians looking to support local artisans and small businesses. 
            Set up your shop in minutes.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button 
              className="btn btn-primary" 
              style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}
              onClick={() => window.location.href = '/login'}
            >
              Start Selling
            </button>
            <button className="btn glass-dark" style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
              Learn More
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer Placeholder */}
      <footer className="container" style={{ padding: '4rem 2rem 2rem', borderTop: '1px solid var(--color-border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.5px', color: 'var(--color-secondary)' }}>
            <span style={{ color: 'var(--color-primary)' }}>True</span>North Marketplace
          </div>
          <div style={{ color: 'var(--color-text-muted-light)', fontSize: '0.9rem' }}>
            © 2026 TrueNorth Local. Supporting Canadian Small Businesses.
          </div>
        </div>
      </footer>
    </div>
  );
}
