import React from 'react';
import { Star, MapPin } from 'lucide-react';

export default function VendorCard({ vendor }) {
  return (
    <div className="card animate-fade-in" style={{ height: '100%' }}>
      <div style={{
        height: '160px',
        backgroundImage: `url(${vendor.avatar})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        {/* Subtle gradient overlay to make text readable anywhere */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1.5rem',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <MapPin size={16} />
          <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{vendor.registered_address ?? vendor.location}</span>
        </div>
      </div>
      
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--color-secondary)', margin: 0 }}>
            {vendor.company_name ?? vendor.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-primary)' }}>
            <Star size={16} fill="currentColor" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-secondary)' }}>
              {vendor.rating}
            </span>
          </div>
        </div>
        
        <p style={{ color: 'var(--color-text-muted-light)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {vendor.description}
        </p>
        
        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {vendor.categories.map(cat => (
              <span key={cat} style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.75rem',
                backgroundColor: 'var(--color-bg-light)',
                borderRadius: '9999px',
                color: 'var(--color-text-light)'
              }}>
                {cat}
              </span>
            ))}
          </div>
          
          <button className="btn btn-secondary" style={{ width: '100%' }}>
            Visit Shop
          </button>
        </div>
      </div>
    </div>
  );
}
