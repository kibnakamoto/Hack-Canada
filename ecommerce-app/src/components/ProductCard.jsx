import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      className="card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative' }}
    >
      <div style={{ 
        height: '280px', 
        backgroundColor: 'var(--color-bg-light)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '2rem'
      }}>
        {(product.is_new ?? product.isNew) && (
          <div className="badge badge-primary" style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }}>
            New
          </div>
        )}
        <button 
          className="btn-icon glass" 
          style={{ 
            position: 'absolute', 
            top: '1rem', 
            right: '1rem', 
            zIndex: 10,
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.3s ease'
          }}
        >
          <Heart size={18} />
        </button>
        
        {/* Fallback image if actual URLs are not provided - just using colored boxes with text for now */}
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-muted-light)',
          fontSize: '0.9rem',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.5s ease',
          backgroundImage: `url(${product.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          {!product.image && <span>Product Image</span>}
        </div>
      </div>

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ color: 'var(--color-text-muted-light)', fontSize: '0.85rem', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {product.category}
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 500, marginBottom: '0.5rem' }}>
          By {product.company_name ?? product.vendorName}
        </div>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-secondary)' }}>
          {product.name}
        </h3>
        
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-secondary)' }}>
            ${product.price.toFixed(2)}
          </div>
          
          <button 
            className="btn btn-primary"
            style={{ 
              padding: '0.5rem', 
              borderRadius: '50%', 
              width: '40px', 
              height: '40px',
            }}
            onClick={() => addToCart(product)}
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
