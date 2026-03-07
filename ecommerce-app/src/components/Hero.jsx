import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <div style={{
      position: 'relative',
      padding: '6rem 2rem',
      overflow: 'hidden',
      backgroundColor: 'var(--color-secondary)',
      color: 'white',
      borderRadius: '24px',
      margin: '2rem auto',
      maxWidth: 'calc(var(--max-width) - 4rem)',
      display: 'flex',
      alignItems: 'center',
      minHeight: '500px'
    }} className="animate-fade-in shadow-xl">
      
      {/* Decorative Gradients */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(255,0,0,0.4) 0%, rgba(204,0,0,0) 70%)',
        filter: 'blur(60px)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255,77,77,0.3) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(50px)',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', paddingLeft: '2rem' }}>
        <div className="badge badge-primary" style={{ marginBottom: '1.5rem' }}>
          Support Local
        </div>
        <h1 style={{ 
          fontSize: '4rem', 
          lineHeight: 1.1, 
          marginBottom: '1.5rem',
          color: 'white'
        }}>
          Discover the <br />
          <span style={{ color: 'var(--color-primary-light)' }}>True North</span>.
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'var(--color-text-muted-dark)', 
          marginBottom: '2.5rem',
          maxWidth: '480px'
        }}>
          Shop unique, handcrafted goods directly from Canadian local businesses and artisans. Quality you can trust, from your community.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Shop Local <ArrowRight size={20} />
          </button>
          <button className="btn glass-dark" style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}>
            Sell with Us
          </button>
        </div>
      </div>
      
    </div>
  );
}
