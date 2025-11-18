import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { SidebarProvider } from "./contexts/SidebarContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { BadgeProvider } from "./contexts/BadgeContext";
import AuthWrapper from "./components/auth/AuthWrapper";
import './utils/fixIncomeBadge';
import Login from "./pages/auth/Login";
import Register from "./pages/auth/register";
import Home from "./pages/Home"
import About from "./pages/About"
import Dashboard from "./pages/Dashboard"
import Settings from "./pages/settings"
import Transaction from "./pages/TransactionsPage"
import Budget from "./pages/Budget"
import Accounts from "./pages/accounts"
import Archive from "./pages/Archive"
import Rewards from "./pages/Rewards"

function AppContent() {
  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/budget" element={<Budget/>} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/rewards" element={<Rewards />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <CurrencyProvider>
      <SidebarProvider>
        <BadgeProvider>
          <Router>
            <AuthWrapper>
              <AppContent />
            </AuthWrapper>
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#363636',
                fontSize: '14px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                maxWidth: '400px',
              },
            }}
          />
        </Router>
        </BadgeProvider>
      </SidebarProvider>
    </CurrencyProvider>
  );
}

export default App;
