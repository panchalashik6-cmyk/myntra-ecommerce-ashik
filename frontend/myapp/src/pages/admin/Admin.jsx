import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaUsers,
  FaShoppingBag,
  FaRupeeSign,
  FaPlus,
  FaTrash,
  FaEdit,
  FaTags
} from "react-icons/fa";
import API from "../../services/api";

const emptyForm = {
  name: "", brand: "", description: "", category: "men", image: "",
  price: "", oldPrice: "", discount: "", rating: "4.2", ratingCount: "0",
  sizes: "S,M,L,XL", colors: "Black,White", stock: "20"
};

function Admin() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");
  const [message, setMessage] = useState("");
  const isAdmin = user?.role === "admin";

  const loadData = async () => {
    try {
      const [statsResponse, productsResponse, ordersResponse, categoriesResponse] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/products", { params: { limit: 100 } }),
        API.get("/admin/orders"),
        API.get("/categories")
      ]);
      const cats = categoriesResponse.data.categories || [];
      setStats(statsResponse.data.stats || {});
      setProducts(productsResponse.data.products || []);
      setOrders(ordersResponse.data.orders || []);
      setCategories(cats);
      if (!form.category && cats[0]) setForm((old) => ({ ...old, category: cats[0].slug }));
    } catch (error) {
      setMessage(error.response?.data?.message || "Admin data load failed");
    }
  };

  useEffect(() => { if (isAdmin) loadData(); }, [isAdmin]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      ...form,
      price: Number(form.price), oldPrice: Number(form.oldPrice), discount: Number(form.discount),
      rating: Number(form.rating), ratingCount: Number(form.ratingCount), stock: Number(form.stock),
      sizes: form.sizes.split(",").map((x) => x.trim()).filter(Boolean),
      colors: form.colors.split(",").map((x) => x.trim()).filter(Boolean),
      images: [form.image]
    };
    try {
      if (editing) {
        await API.put(`/products/${editing}`, productData);
        setMessage("Product updated successfully");
      } else {
        await API.post("/products", productData);
        setMessage("Product added to MongoDB Atlas successfully");
      }
      setForm({ ...emptyForm, category: categories[0]?.slug || "men" });
      setEditing(null);
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Save failed");
    }
  };

  const editProduct = (product) => {
    setEditing(product._id);
    setForm({
      name: product.name || "", brand: product.brand || "", description: product.description || "",
      category: product.category || categories[0]?.slug || "men", image: product.image || "",
      price: product.price || "", oldPrice: product.oldPrice || "", discount: product.discount || "",
      rating: product.rating || 4.2, ratingCount: product.ratingCount || 0,
      sizes: (product.sizes || []).join(","), colors: (product.colors || []).join(","), stock: product.stock ?? 20
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => { setEditing(null); setForm({ ...emptyForm, category: categories[0]?.slug || "men" }); };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    try { await API.delete(`/products/${id}`); setMessage("Product deleted"); loadData(); }
    catch (error) { setMessage(error.response?.data?.message || "Delete failed"); }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/categories", { name: categoryName, image: categoryImage });
      setMessage(response.data.message || "Category created");
      setCategoryName(""); setCategoryImage(""); loadData();
    } catch (error) { setMessage(error.response?.data?.message || "Category creation failed"); }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try { await API.delete(`/categories/${id}`); setMessage("Category deleted"); loadData(); }
    catch (error) { setMessage(error.response?.data?.message || "Category delete failed"); }
  };

  const changeStatus = async (id, status) => {
    try { await API.patch(`/admin/orders/${id}/status`, { status }); loadData(); }
    catch (error) { setMessage(error.response?.data?.message || "Status update failed"); }
  };

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="container admin-page">
      <div className="admin-head">
        <div><span>CONTROL CENTRE</span><h1>Admin Dashboard</h1></div>
        <span className="admin-badge">ADMIN</span>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      <div className="stats-grid">
        <div><FaUsers /><span>Users</span><b>{stats.users || 0}</b></div>
        <div><FaBoxOpen /><span>Products</span><b>{stats.products || 0}</b></div>
        <div><FaShoppingBag /><span>Orders</span><b>{stats.orders || 0}</b></div>
        <div><FaRupeeSign /><span>Revenue</span><b>₹{(stats.revenue || 0).toLocaleString()}</b></div>
      </div>

      <div className="admin-card">
        <div className="admin-card-head"><h3><FaTags /> Categories</h3><span>{categories.length}</span></div>
        <form className="admin-form" onSubmit={addCategory}>
          <input placeholder="Category name e.g. Accessories" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
          <input placeholder="Category image URL (optional)" value={categoryImage} onChange={(e) => setCategoryImage(e.target.value)} />
          <button className="primary-btn"><FaPlus /> ADD CATEGORY</button>
        </form>
        <div className="admin-category-list">
          {categories.map((cat) => (
            <div className="admin-category-item" key={cat._id}>
              <span>{cat.name}</span><small>{cat.slug}</small>
              <button className="danger-icon" onClick={() => deleteCategory(cat._id)}><FaTrash /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-head"><h3>{editing ? "Edit product" : "Add product"}</h3>{editing && <button onClick={cancelEdit}>Cancel</button>}</div>
        <form className="admin-form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} required />
          <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} required />
          <select name="category" value={form.category} onChange={handleChange} required>
            {categories.map((cat) => <option key={cat._id} value={cat.slug}>{cat.name}</option>)}
          </select>
          <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} required />
          <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} required />
          <input name="oldPrice" placeholder="Old price" type="number" value={form.oldPrice} onChange={handleChange} required />
          <input name="discount" placeholder="Discount %" type="number" value={form.discount} onChange={handleChange} />
          <input name="stock" placeholder="Stock" type="number" value={form.stock} onChange={handleChange} />
          <input name="sizes" placeholder="Sizes: S,M,L" value={form.sizes} onChange={handleChange} />
          <input name="colors" placeholder="Colors: Black,White" value={form.colors} onChange={handleChange} />
          <textarea name="description" className="wide" placeholder="Description" value={form.description} onChange={handleChange} required />
          <button className="primary-btn wide">{editing ? <FaEdit /> : <FaPlus />}{editing ? " UPDATE PRODUCT" : " ADD PRODUCT"}</button>
        </form>
      </div>

      <div className="admin-card">
        <div className="admin-card-head"><h3>Products</h3><span>{products.length}</span></div>
        <div className="admin-table">
          {products.map((product) => (
            <div className="admin-row" key={product._id}>
              <img src={product.image} alt={product.name} />
              <div><b>{product.brand}</b><p>{product.name}</p></div>
              <span>₹{product.price}</span><span>{product.category}</span>
              <button onClick={() => editProduct(product)}><FaEdit /></button>
              <button className="danger-icon" onClick={() => deleteProduct(product._id)}><FaTrash /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-head"><h3>Recent orders</h3><span>{orders.length}</span></div>
        {orders.slice(0, 20).map((order) => (
          <div className="admin-order" key={order._id}>
            <div><b>#{String(order._id).slice(-8).toUpperCase()}</b><span>₹{order.total}</span><small>{order.paymentMethod} · {order.paymentStatus}</small></div>
            <select value={order.status} onChange={(e) => changeStatus(order._id, e.target.value)}>
              <option>Payment Pending</option><option>Placed</option><option>Confirmed</option><option>Packed</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
