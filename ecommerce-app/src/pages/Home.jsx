import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';

export default function Home() {

  return (
    <div className="animate-fade-in">
      <Hero />
      
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
