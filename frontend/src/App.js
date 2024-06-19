// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// AUTH
import Login from './Auth/Login';
import Register from './Auth/Register';
import Logout from './Auth/Logout';
import AdminRoute from './Auth/AdminRoute';

// PAGES
import Home from './Pages/User/Home';
import AboutUs from './Pages/User/AboutUs';
import Contact from './Pages/User/Contact';
import Category from './Pages/User/Category';
import DetailProduct from './Pages/User/DetailProduct';
import Product from './Pages/User/Product';
import ProductsByCategory from "./Pages/User/ProductsByCategory";
import NotFoundPage from './Pages/User/NotFoundPage';
import Checkout from './Pages/User/Checkout';
import MyOrder from './Pages/User/MyOrder';
import OrderSuccess from './Pages/User/OrderSuccess'; // Import OrderSuccess component
import FloatingCart from './Components/User/FloatingCart';
import { CartProvider } from './contexts/CartContext';

// DASHBOARD
import DashboardPage from './Pages/Admin/DashboardPage';
import MyProfilePage from './Pages/Admin/MyProfilePage';
import ProductList from './Pages/Admin/ProductList';
import OrderListPage from './Pages/Admin/OrderList';
import UserListPage from './Pages/Admin/UserListPage';
import CategoryListPage from './Pages/Admin/Category';

const App = () => {
  return (
    <CartProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/category" element={<Category />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/products" element={<Product />} />
            <Route path="/products/:id_category" element={<ProductsByCategory />} />
            <Route path="/products/detail-product/:id" element={<DetailProduct />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-order" element={<MyOrder />} />
            <Route path="/order-success" element={<OrderSuccess />} /> {/* Add OrderSuccess route */}
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />

            {/* DASHBOARD */}
            <Route path="/dashboard" element={<AdminRoute element={<DashboardPage />} />} />
            <Route path="/dashboard/my-profile" element={<AdminRoute element={<MyProfilePage />} />} />
            <Route path="/dashboard/product-list" element={<AdminRoute element={<ProductList />} />} />
            <Route path="/dashboard/user-list" element={<AdminRoute element={<UserListPage />} />} />
            <Route path="/dashboard/category-list" element={<AdminRoute element={<CategoryListPage />} />} />
            <Route path="/dashboard/order-list" element={<AdminRoute element={<OrderListPage />} />} />
          </Routes>
          <FloatingCart />
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
