import React, { useState, useEffect } from 'react';
import { Package, Plus, Trash2, ArrowLeft, Loader2, Search, Check, X } from 'lucide-react';

export default function Storefront() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [city, setCity] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Default');
  const [editingProductId, setEditingProductId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Outerwear',
    image: ''
  });

  useEffect(() => {
    fetchUserProducts();
    fetchUserProfile();
  }, []);

  const handleUpdatePrice = (id) => {
    fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: editPrice })
    })
    .then(res => res.json())
    .then(() => {
      setEditingProductId(null);
      fetchUserProducts();
    });
  };

  const fetchUserProfile = () => {
    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        if (data.storeName) setStoreName(data.storeName);
        if (data.logoUrl) setLogoUrl(data.logoUrl);
        if (data.city) setCity(data.city);
      });
  };

  const handleUpdateStoreName = (e) => {
    e.preventDefault();
    fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeName, logoUrl, city })
    })
    .then(res => res.json())
    .then(() => setIsEditingName(false));
  };

  const fetchUserProducts = () => {
    setLoading(true);
    fetch('/api/user/products')
      .then(res => {
        if (!res.ok) throw new Error('Not logged in');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    })
    .then(res => {
      if (res.status === 401) {
        alert('Your session has expired. Please log in again.');
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }
      return res.json();
    })
    .then(() => {
      setIsAdding(false);
      setNewProduct({ name: '', price: '', category: 'Outerwear', image: '' });
      fetchUserProducts();
    })
    .catch(err => console.error('Error adding product:', err));
  };
  const handleDeleteProduct = (id) => {
    if (confirm('Are you sure you want to remove this listing?')) {
      fetch(`/api/products/${id}`, { method: 'DELETE' })
        .then(() => fetchUserProducts());
    }
  };

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
        <header style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <button 
                onClick={() => window.location.href = '/'}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--color-text-muted-light)', cursor: 'pointer', marginBottom: '1rem', padding: 0 }}
              >
                <ArrowLeft size={16} /> Back to Shop
              </button>
              
              {isEditingName ? (
                <form onSubmit={handleUpdateStoreName} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--color-border-light)', maxWidth: '400px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 500 }}>Store Name</label>
                    <input 
                      className="input" 
                      value={storeName}
                      onChange={e => setStoreName(e.target.value)}
                      placeholder="Enter Store Name"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 500 }}>City</label>
                    <input 
                      className="input" 
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g. Toronto, ON"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditingName(false)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  {logoUrl && (
                    <img 
                      src={logoUrl} 
                      alt="Store Logo" 
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        borderRadius: '16px', 
                        objectFit: 'cover', 
                        border: '2px solid white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                      }} 
                    />
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <h1 style={{ fontSize: '2.5rem', color: 'var(--color-secondary)', margin: 0 }}>{storeName || 'My Storefront'}</h1>
                      <button 
                        onClick={() => setIsEditingName(true)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}
                      >
                        Edit Profile
                      </button>
                    </div>
                    {city && (
                      <p style={{ color: 'var(--color-primary)', fontSize: '1rem', fontWeight: 600, margin: '0.25rem 0 0 0' }}>
                        📍 {city}
                      </p>
                    )}
                    <p style={{ color: 'var(--color-text-muted-light)', fontSize: '1.1rem', marginTop: '0.5rem', marginBottom: 0 }}>Manage your local listings and grow your business.</p>
                  </div>
                </div>
              )}
            </div>
            <button className="btn btn-primary" onClick={() => setIsAdding(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={20} /> Add New Listing
            </button>
          </div>

          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', backgroundColor: 'var(--color-bg-light)', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid var(--color-border-light)' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--color-text-muted-light)' }} />
              <input 
                className="input" 
                placeholder="Search your listings..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ padding: '0.8rem 1rem 0.8rem 2.5rem', width: '100%', backgroundColor: 'white', fontSize: '1rem' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted-light)', fontWeight: 500 }}>Category:</span>
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="input"
                  style={{ width: '150px', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                >
                  {['All', 'Outerwear', 'Accessories', 'Furniture', 'Food', 'Art'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted-light)', fontWeight: 500 }}>Sort By:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="input"
                  style={{ width: '160px', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                >
                  <option value="Default">Default</option>
                  <option value="PriceLowToHigh">Price: Low to High</option>
                  <option value="PriceHighToLow">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {isAdding && (
          <div className="glass" style={{ padding: '2rem', marginBottom: '3rem', borderRadius: '16px', border: '1px solid var(--color-primary)' }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-secondary)' }}>New Listing Details</h2>
            <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Product Name</label>
                <input 
                  className="input" 
                  required 
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="e.g. Heritage Leather Bag" 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Price (CAD)</label>
                <input 
                  className="input" 
                  required 
                  type="number" 
                  step="0.01" 
                  value={newProduct.price}
                  onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                  placeholder="0.00" 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Category</label>
                <select 
                  className="input" 
                  value={newProduct.category}
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                >
                  <option>Outerwear</option>
                  <option>Accessories</option>
                  <option>Furniture</option>
                  <option>Food</option>
                  <option>Art</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Image URL (Optional)</label>
                <input 
                  className="input" 
                  value={newProduct.image}
                  onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                  placeholder="https://..." 
                />
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">Publish Listing</button>
                <button type="button" className="btn btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {products.length === 0 ? (
            <div className="glass" style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted-light)' }}>
              <Package size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ fontSize: '1.2rem' }}>You don't have any listings yet. Start selling today!</p>
            </div>
          ) : (
            products
              .filter(p => {
                const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                     p.category.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
                return matchesSearch && matchesCategory;
              })
              .sort((a, b) => {
                if (sortBy === 'PriceLowToHigh') return a.price - b.price;
                if (sortBy === 'PriceHighToLow') return b.price - a.price;
                return 0; // Default order
              })
              .map(product => (
              <div key={product.id} className="glass" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '1.5rem', 
                gap: '2rem',
                borderRadius: '16px',
                transition: 'transform 0.2s ease',
              }}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px' }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span className="badge" style={{ fontSize: '0.75rem' }}>{product.category}</span>
                    {product.isNew && <span className="badge" style={{ backgroundColor: 'var(--color-success)', color: 'white', border: 'none' }}>Active</span>}
                  </div>
                  <h3 style={{ fontSize: '1.4rem', color: 'var(--color-secondary)', marginBottom: '0.25rem' }}>{product.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {editingProductId === product.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          className="input" 
                          value={editPrice}
                          onChange={e => setEditPrice(e.target.value)}
                          style={{ width: '100px', padding: '0.25rem 0.5rem' }}
                          autoFocus
                        />
                        <button 
                          onClick={() => handleUpdatePrice(product.id)}
                          style={{ background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer' }}
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={() => setEditingProductId(null)}
                          style={{ background: 'var(--color-bg-dark)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer' }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
                          ${product.price.toFixed(2)}
                        </p>
                        <button 
                          onClick={() => { setEditingProductId(product.id); setEditPrice(product.price); }}
                          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.85rem', textDecoration: 'underline', padding: 0 }}
                        >
                          Edit Price
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="btn-icon" 
                    title="Remove Listing"
                    style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
