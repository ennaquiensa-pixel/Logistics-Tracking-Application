import { Route, Routes, useLocation } from "react-router-dom";
import "./index.css";

import NotFound from "./components/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import Layout from "./components/dashboard/Layout";
import ProtectedRoute from "./security/ProtectedRoute";

import DashboardHome from "./pages/admin/DashboardHome";
import Users from "./pages/admin/Users";
import Clients from "./pages/admin/Clients";
import ManagerDashboardOverview from "./pages/manager/ManagerDashboardOverview";
import DeliveriesPage from "./pages/manager/DeliveriesPage";

import NotificationsPage from "./pages/manager/NotificationPage";
import MapView from "./pages/manager/MapView";
import LivreurDashboardOverview from "./pages/livreur/LivreurDashboardOverview";
import LivreurDeliveriesPage from "./pages/livreur/LivreurDeliveriesPage";
import LivreursPageLivreur from "./pages/livreur/LivreursPageLivreur";
import LivreurWarehousePage from "./pages/livreur/LivreurWarehousePage";
import LivreurAnalyticsPage from "./pages/livreur/LivreurAnalyticsPage";
import LivreurNotificationsPage from "./pages/livreur/LivreurNotificationsPage";
import LivreurMapView from "./pages/livreur/LivreurMapView";
import MyOrdersPage from "./pages/client/MyOrdersPage";
import ClientNotificationsPage from "./pages/client/ClientNotificationsPage";
import ProductsPage from "./pages/orders/ProductsPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import ProductDetails from "./pages/orders/ProductDetailsPage";
import LivreursPage from "./pages/manager/LivreursPage";
import WarehousePage from "./pages/manager/WarehousePage";
import Paiement from "./pages/orders/Paiement";
import Footer from "./components/Footer";
import { useAuth } from "./context/AuthContext";
import ListProducts from "./pages/manager/ListProducts";

function App() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  return (
    <main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Show header only on public routes */}
      {["/", "/login", "/register", "/products", "/about"].includes(
        location.pathname
      ) && <Header />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole={["ADMIN"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="users" element={<Users />} />
          <Route path="clients" element={<Clients />} />
          <Route path="products" element={<ListProducts />} />
          <Route path="map" element={<MapView />} />
        </Route>

        {/* MANAGER DASHBOARD */}
        <Route
          path="/dashboard/manager"
          element={
            <ProtectedRoute requiredRole={["MANAGER"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ManagerDashboardOverview />} />
          <Route path="deliveries" element={<DeliveriesPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="livreurs" element={<LivreursPage />} />
          <Route path="warehouse" element={<WarehousePage />} />
          <Route path="products" element={<ListProducts />} />
          <Route path="map" element={<MapView />} />
        </Route>

        {/* LIVREUR */}
        <Route
          path="/dashboard/livreur"
          element={
            <ProtectedRoute requiredRole={["LIVREUR"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<LivreurDashboardOverview />} />
          <Route path="deliveries" element={<LivreurDeliveriesPage />} />
          <Route path="livreurs" element={<LivreursPageLivreur />} />
          {/* <Route path="warehouse" element={<LivreurWarehousePage />} />         */}
          {/* <Route path="analytics" element={<LivreurAnalyticsPage />} />          */}
          <Route path="notifications" element={<LivreurNotificationsPage />} />
          {/* <Route path="map" element={<LivreurMapView />} />                       */}
        </Route>

        {/* CLIENT */}
        <Route
          path="/dashboard/client"
          element={
            <ProtectedRoute requiredRole={["CLIENT"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MyOrdersPage />} />
          <Route path="notifications" element={<ClientNotificationsPage />} />
        </Route>

        {/* Order page route  */}
        <Route path="/products" element={<ProductsPage />} />
        {/**<Route path='/products/:id' element={<ProductDetails />} /> */}
        <Route path="/orders/:id" element={<OrderDetailsPage />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        {isAuthenticated && (
          <Route path="/product/order/" element={<Paiement />} />
        )}

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {["/", "/login", "/register", "/about", "/products"].includes(
        location.pathname
      ) || /^\/products\/.*/.test(location.pathname) ? (
        <Footer />
      ) : null}
    </main>
  );
}

export default App;
