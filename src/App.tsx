import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PlaceOrder from './pages/PlaceOrder';
import GenerateReceipt from './pages/GenerateReceipt';
import InvoicePreview from './pages/InvoicePreview';
import ReceiptFilter from './pages/ReceiptFilter';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="place-order" element={<PlaceOrder />} />
            <Route path="generate-receipt" element={<GenerateReceipt />} />
            <Route path="invoice-preview" element={<InvoicePreview />} />
            <Route path="receipt-filter" element={<ReceiptFilter />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;