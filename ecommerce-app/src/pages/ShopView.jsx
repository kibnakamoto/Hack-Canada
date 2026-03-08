import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Store, MapPin, ArrowLeft, Loader2, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { QRCodeCanvas } from 'qrcode.react';

export default function ShopView() {
  const { auth0_user_id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        // Fetch public profile
        const profileRes = await fetch(`/api/shops/${auth0_user_id}`);
        if (!profileRes.ok) throw new Error('Shop not found');
        const profileData = await profileRes.json();
        setVendor(profileData);

        // Fetch vendor products
        const productsRes = await fetch(`/api/products?auth0_user_id=${auth0_user_id}`);
        const productsData = await productsRes.json();
        setProducts(productsData);
      } catch (err) {
        console.error('Error fetching shop data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [auth0_user_id]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--color-secondary)' }}>Shop not found</h2>
        <button
          onClick={() => window.location.href = '/shops'}
          className="btn btn-secondary"
          style={{ marginTop: '1rem' }}
        >
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Branded Header */}
      <header style={{
        backgroundColor: 'var(--color-bg-light)',
        borderBottom: '1px solid var(--color-border-light)',
        padding: '6rem 2rem 4rem'
      }}>
        <div className="container">
          <button
            onClick={() => window.location.href = '/shops'}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--color-text-muted-light)', cursor: 'pointer', marginBottom: '2rem', padding: 0 }}
          >
            <ArrowLeft size={16} /> Back to Directory
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
            <div style={{
              padding: '10px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
            }}>
              <QRCodeCanvas
                value="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                size={120}
              />
            </div>
          </div>

          <div>
            <h1 style={{ fontSize: '3.5rem', color: 'var(--color-secondary)', margin: 0, lineHeight: 1 }}>
              {vendor.company_name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                <MapPin size={18} />
                {vendor.registered_address || 'Canada'}
              </span>
              <span style={{ color: 'var(--color-text-muted-light)' }}>•</span>
              <span style={{ color: 'var(--color-text-muted-light)' }}>
                {products.length} Products
              </span>
            </div>
          </div>
        </div>
      </header >

      {/* Product Catalog */}
      < section className="container" style={{ padding: '4rem 2rem' }
      }>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <ShoppingBag size={24} className="text-primary" />
          <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-secondary)' }}>
            Store Catalog
          </h2>
        </div>

        {
          products.length === 0 ? (
            <div className="glass" style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted-light)' }}>
              <p style={{ fontSize: '1.2rem' }}>This shop hasn't listed any products yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )
        }
      </section >
    </div >
  );
}
