import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { products } from '../../data/mockData';
import {
  Gem, LayoutDashboard, ShoppingCart, Package, Users, BarChart3, Settings,
  LogOut, Menu, X, DollarSign, TrendingUp, TrendingDown, Plus, Pencil,
  Trash2, Eye, Store, Bell, Globe
} from 'lucide-react';
import './AdminDashboard.css';

const MOCK_ORDERS = [
  { id: 'ORD-1001', customer: 'Priya Sharma', email: 'priya@mail.com', items: [{ name: 'Eternal Radiance Ring', qty: 1, price: 1250 }], total: 1250, status: 'Delivered', date: '2026-05-25' },
  { id: 'ORD-1002', customer: 'Rahul Verma', email: 'rahul@mail.com', items: [{ name: 'Imperial Gold Chain', qty: 1, price: 3800 }], total: 3800, status: 'Processing', date: '2026-05-26' },
  { id: 'ORD-1003', customer: 'Anita Desai', email: 'anita@mail.com', items: [{ name: 'Royal Heritage Bangle', qty: 2, price: 8500 }], total: 17000, status: 'Shipped', date: '2026-05-26' },
  { id: 'ORD-1004', customer: 'Vikram Patel', email: 'vikram@mail.com', items: [{ name: 'Diamond Drop Earrings', qty: 1, price: 2100 }], total: 2100, status: 'Delivered', date: '2026-05-24' },
  { id: 'ORD-1005', customer: 'Meera Joshi', email: 'meera@mail.com', items: [{ name: 'Cuban Link Statement', qty: 1, price: 9800 }], total: 9800, status: 'Processing', date: '2026-05-27' },
  { id: 'ORD-1006', customer: 'Arjun Nair', email: 'arjun@mail.com', items: [{ name: 'Tennis Bracelet', qty: 1, price: 5200 }], total: 5200, status: 'Cancelled', date: '2026-05-23' },
  { id: 'ORD-1007', customer: 'Sanya Kapoor', email: 'sanya@mail.com', items: [{ name: 'Temple Necklace', qty: 1, price: 11500 }], total: 11500, status: 'Shipped', date: '2026-05-27' },
  { id: 'ORD-1008', customer: 'Dev Malhotra', email: 'dev@mail.com', items: [{ name: 'Gold Sovereign Coin', qty: 3, price: 2800 }], total: 8400, status: 'Delivered', date: '2026-05-22' },
];

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const MONTHLY_REVENUE = [
  { month: 'Jan', value: 42000 }, { month: 'Feb', value: 38000 },
  { month: 'Mar', value: 55000 }, { month: 'Apr', value: 47000 },
  { month: 'May', value: 61000 }, { month: 'Jun', value: 58000 },
];

const AdminDashboard = () => {
  const { isAdmin, isLoading, adminLogout } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orderFilter, setOrderFilter] = useState('all');
  const [productList, setProductList] = useState(products);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('luxegold_admin_settings');
    return saved ? JSON.parse(saved) : { storeName: 'LuxeGold', currency: 'USD', taxRate: '8', emailNotif: true, orderNotif: true };
  });

  useEffect(() => {
    localStorage.setItem('luxegold_admin_settings', JSON.stringify(settings));
  }, [settings]);

  if (isLoading) return null;
  if (!isAdmin) { navigate('/admin/login'); return null; }

  const handleLogout = () => { adminLogout(); navigate('/admin/login'); };

  const totalRevenue = MOCK_ORDERS.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + o.total, 0);
  const customers = JSON.parse(localStorage.getItem('luxegold_users') || '[]');
  const categoryCount = {};
  productList.forEach(p => { categoryCount[p.category] = (categoryCount[p.category] || 0) + 1; });
  const maxRevenue = Math.max(...MONTHLY_REVENUE.map(m => m.value));

  const filteredOrders = orderFilter === 'all' ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.status.toLowerCase() === orderFilter);

  // Product modal
  const [formData, setFormData] = useState({ name: '', category: 'Rings', karat: '18k', weight: '', price: '', description: '' });

  const openAddModal = () => { setEditProduct(null); setFormData({ name: '', category: 'Rings', karat: '18k', weight: '', price: '', description: '' }); setShowModal(true); };
  const openEditModal = (p) => { setEditProduct(p); setFormData({ name: p.name, category: p.category, karat: p.karat, weight: p.weight, price: p.price, description: p.description }); setShowModal(true); };

  const handleSaveProduct = () => {
    if (!formData.name || !formData.price) return;
    if (editProduct) {
      setProductList(prev => prev.map(p => p.id === editProduct.id ? { ...p, ...formData, price: Number(formData.price) } : p));
    } else {
      const newP = { ...formData, id: 'p' + Date.now(), price: Number(formData.price), image: 'https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&q=80', tags: [] };
      setProductList(prev => [...prev, newP]);
    }
    setShowModal(false);
  };

  const handleDeleteProduct = (id) => { setProductList(prev => prev.filter(p => p.id !== id)); };

  const tabTitles = { overview: 'Dashboard Overview', orders: 'Order Management', products: 'Product Inventory', customers: 'Customer Directory', analytics: 'Analytics & Reports', settings: 'Store Settings' };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <Gem size={22} className="brand-icon" />
          <h2><span className="gold-text">LUXEGOLD</span><small>Admin Panel</small></h2>
        </div>
        <nav className="sidebar-nav">
          {TABS.map(tab => (
            <button key={tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}>
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button onClick={handleLogout}><LogOut size={18} /> Sign Out</button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>{sidebarOpen ? <X size={22} /> : <Menu size={22} />}</button>
            <h1>{tabTitles[activeTab]}</h1>
            <p>Welcome back, Admin</p>
          </div>
          <div className="topbar-right">
            <Link to="/" style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>View Store →</Link>
            <div className="admin-avatar">A</div>
          </div>
        </header>

        <div className="admin-content">
          {/* ─── OVERVIEW ─── */}
          {activeTab === 'overview' && (
            <>
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-header"><span>Total Revenue</span><div className="kpi-icon revenue"><DollarSign size={20} /></div></div>
                  <div className="kpi-value gold-text">${totalRevenue.toLocaleString()}</div>
                  <div className="kpi-change up"><TrendingUp size={14} /> +12.5% from last month</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-header"><span>Orders</span><div className="kpi-icon orders"><ShoppingCart size={20} /></div></div>
                  <div className="kpi-value">{MOCK_ORDERS.length}</div>
                  <div className="kpi-change up"><TrendingUp size={14} /> +8.2% from last month</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-header"><span>Customers</span><div className="kpi-icon customers"><Users size={20} /></div></div>
                  <div className="kpi-value">{customers.length || 24}</div>
                  <div className="kpi-change up"><TrendingUp size={14} /> +5 new this week</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-header"><span>Products</span><div className="kpi-icon products"><Package size={20} /></div></div>
                  <div className="kpi-value">{productList.length}</div>
                  <div className="kpi-change down"><TrendingDown size={14} /> 3 low stock</div>
                </div>
              </div>

              <div className="charts-grid">
                <div className="chart-card">
                  <h3>Revenue Trend</h3>
                  <div className="bar-chart">
                    {MONTHLY_REVENUE.map(m => (
                      <div className="bar-col" key={m.month}>
                        <div className="bar-value">${(m.value / 1000).toFixed(0)}k</div>
                        <div className="bar" style={{ height: `${(m.value / maxRevenue) * 100}%` }} />
                        <div className="bar-label">{m.month}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="chart-card">
                  <h3>Categories</h3>
                  <div className="donut-chart">
                    <div className="donut-visual" style={{ background: `conic-gradient(#D4AF37 0% 30%, #3b82f6 30% 55%, #8b5cf6 55% 75%, #10b981 75% 85%, #f59e0b 85% 100%)` }}>
                      <div className="donut-center"><span>{productList.length}</span><span>Total</span></div>
                    </div>
                    <div className="donut-legend">
                      {Object.entries(categoryCount).map(([cat, count]) => (
                        <div className="legend-item" key={cat}>
                          <div className="legend-dot" style={{ background: cat === 'Rings' ? '#D4AF37' : cat === 'Necklaces' ? '#3b82f6' : cat === 'Bracelets' ? '#8b5cf6' : cat === 'Earrings' ? '#10b981' : '#f59e0b' }} />
                          {cat} ({count})
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-table-wrap">
                <div className="table-header"><h2>Recent Orders</h2></div>
                <table className="admin-table">
                  <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                  <tbody>
                    {MOCK_ORDERS.slice(0, 5).map(o => (
                      <tr key={o.id}>
                        <td><strong>{o.id}</strong></td>
                        <td>{o.customer}</td>
                        <td>${o.total.toLocaleString()}</td>
                        <td><span className={`status-badge ${o.status.toLowerCase()}`}>{o.status}</span></td>
                        <td style={{ color: 'var(--text-muted)' }}>{o.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ─── ORDERS ─── */}
          {activeTab === 'orders' && (
            <div className="admin-table-wrap">
              <div className="table-header">
                <h2>All Orders</h2>
                <div className="table-actions">
                  <select className="filter-select" value={orderFilter} onChange={e => setOrderFilter(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <table className="admin-table">
                <thead><tr><th>Order ID</th><th>Customer</th><th>Email</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredOrders.map(o => (
                    <tr key={o.id}>
                      <td><strong>{o.id}</strong></td>
                      <td>{o.customer}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{o.email}</td>
                      <td>{o.items.length} item(s)</td>
                      <td>${o.total.toLocaleString()}</td>
                      <td><span className={`status-badge ${o.status.toLowerCase()}`}>{o.status}</span></td>
                      <td style={{ color: 'var(--text-muted)' }}>{o.date}</td>
                      <td><div className="action-btns"><button title="View"><Eye size={14} /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrders.length === 0 && <div className="empty-state"><Package size={40} /><p>No orders found</p></div>}
            </div>
          )}

          {/* ─── PRODUCTS ─── */}
          {activeTab === 'products' && (
            <>
              <div className="admin-table-wrap">
                <div className="table-header">
                  <h2>All Products ({productList.length})</h2>
                  <div className="table-actions">
                    <button className="btn-add" onClick={openAddModal}><Plus size={16} /> Add Product</button>
                  </div>
                </div>
                <table className="admin-table">
                  <thead><tr><th>Product</th><th>Category</th><th>Karat</th><th>Weight</th><th>Price</th><th>Actions</th></tr></thead>
                  <tbody>
                    {productList.map(p => (
                      <tr key={p.id}>
                        <td><div className="product-cell"><img src={p.image} alt={p.name} /><span>{p.name}</span></div></td>
                        <td>{p.category}</td>
                        <td>{p.karat}</td>
                        <td>{p.weight}</td>
                        <td>${p.price.toLocaleString()}</td>
                        <td>
                          <div className="action-btns">
                            <button title="Edit" onClick={() => openEditModal(p)}><Pencil size={14} /></button>
                            <button title="Delete" className="delete" onClick={() => handleDeleteProduct(p.id)}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                  <div className="modal-card" onClick={e => e.stopPropagation()}>
                    <h2>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
                    <div className="modal-form">
                      <div><label>Product Name</label><input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Gold Ring" /></div>
                      <div className="form-row">
                        <div><label>Category</label>
                          <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                            <option>Rings</option><option>Necklaces</option><option>Bracelets</option><option>Earrings</option><option>Coins</option>
                          </select>
                        </div>
                        <div><label>Karat</label>
                          <select value={formData.karat} onChange={e => setFormData({...formData, karat: e.target.value})}>
                            <option>18k</option><option>22k</option><option>24k</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-row">
                        <div><label>Weight</label><input value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} placeholder="e.g. 5.0g" /></div>
                        <div><label>Price ($)</label><input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. 2500" /></div>
                      </div>
                      <div><label>Description</label><textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Product description..." /></div>
                      <div className="modal-actions">
                        <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                        <button className="btn-save" onClick={handleSaveProduct}>Save Product</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ─── CUSTOMERS ─── */}
          {activeTab === 'customers' && (
            <div className="admin-table-wrap">
              <div className="table-header"><h2>Registered Customers</h2></div>
              {customers.length > 0 ? (
                <table className="admin-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th></tr></thead>
                  <tbody>
                    {customers.map(c => (
                      <tr key={c.id}>
                        <td><strong>{c.name}</strong></td>
                        <td style={{ color: 'var(--text-muted)' }}>{c.email}</td>
                        <td>{c.phone || '—'}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{new Date(Number(c.id)).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state"><Users size={40} /><p>No registered customers yet</p></div>
              )}
            </div>
          )}

          {/* ─── ANALYTICS ─── */}
          {activeTab === 'analytics' && (
            <>
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-header"><span>Avg Order Value</span><div className="kpi-icon revenue"><DollarSign size={20} /></div></div>
                  <div className="kpi-value gold-text">${Math.round(totalRevenue / MOCK_ORDERS.filter(o => o.status !== 'Cancelled').length).toLocaleString()}</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-header"><span>Conversion Rate</span><div className="kpi-icon orders"><BarChart3 size={20} /></div></div>
                  <div className="kpi-value">3.8%</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-header"><span>Return Rate</span><div className="kpi-icon customers"><TrendingDown size={20} /></div></div>
                  <div className="kpi-value">1.2%</div>
                </div>
              </div>
              <div className="charts-grid">
                <div className="chart-card">
                  <h3>Monthly Revenue</h3>
                  <div className="bar-chart">
                    {MONTHLY_REVENUE.map(m => (
                      <div className="bar-col" key={m.month}>
                        <div className="bar-value">${(m.value / 1000).toFixed(0)}k</div>
                        <div className="bar" style={{ height: `${(m.value / maxRevenue) * 100}%` }} />
                        <div className="bar-label">{m.month}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="chart-card">
                  <h3>Top Products</h3>
                  <div className="donut-legend" style={{ gap: '1rem' }}>
                    {productList.sort((a, b) => b.price - a.price).slice(0, 5).map((p, i) => (
                      <div className="legend-item" key={p.id}>
                        <div className="legend-dot" style={{ background: ['#D4AF37', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][i] }} />
                        <span style={{ flex: 1 }}>{p.name}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>${p.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ─── SETTINGS ─── */}
          {activeTab === 'settings' && (
            <div className="settings-grid">
              <div className="settings-card">
                <h3><Store size={18} /> Store Details</h3>
                <div className="form-group">
                  <label>Store Name</label>
                  <input value={settings.storeName} onChange={e => setSettings({...settings, storeName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <select value={settings.currency} onChange={e => setSettings({...settings, currency: e.target.value})}>
                    <option value="USD">USD ($)</option><option value="EUR">EUR (€)</option><option value="INR">INR (₹)</option><option value="GBP">GBP (£)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tax Rate (%)</label>
                  <input type="number" value={settings.taxRate} onChange={e => setSettings({...settings, taxRate: e.target.value})} />
                </div>
              </div>
              <div className="settings-card">
                <h3><Bell size={18} /> Notifications</h3>
                <div className="toggle-row">
                  <span>Email Notifications</span>
                  <button className={`toggle ${settings.emailNotif ? 'on' : ''}`} onClick={() => setSettings({...settings, emailNotif: !settings.emailNotif})} />
                </div>
                <div className="toggle-row">
                  <span>Order Alerts</span>
                  <button className={`toggle ${settings.orderNotif ? 'on' : ''}`} onClick={() => setSettings({...settings, orderNotif: !settings.orderNotif})} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
