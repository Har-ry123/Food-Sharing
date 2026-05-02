import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AddFood from './components/AddFood';
import Profile from './components/Profile';
import { AuthContext } from './context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

function App() {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }

    // Initialize socket connection
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('newFoodItem', (foodItem) => {
      setFoodItems(prev => [foodItem, ...prev]);
    });

    newSocket.on('foodItemRequested', (data) => {
      setFoodItems(prev => 
        prev.map(item => 
          item.id === data.foodItem.id ? data.foodItem : item
        )
      );
    });

    newSocket.on('foodItemResponse', (foodItem) => {
      setFoodItems(prev => 
        prev.map(item => 
          item.id === foodItem.id ? foodItem : item
        )
      );
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    // Fetch initial data
    fetchFoodItems();
    fetchStats();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await fetch(`${API_BASE}/food-items`);
      const data = await response.json();
      setFoodItems(data);
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const url = `${API_BASE}/login`;
      console.log('[Auth] login url', url);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        let errMsg = 'Login failed';
        try {
          const errData = await response.json();
          errMsg = errData?.error || errMsg;
        } catch {};
        throw new Error(errMsg);
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (error) {
      console.error('[Auth] login error', error);
      const isNetworkIssue = error.message.includes('Failed to fetch') || error.message.includes('network');
      const message = isNetworkIssue ? 'Server unreachable; please start the backend server on port 3001.' : error.message;
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const url = `${API_BASE}/register`;
      console.log('[Auth] register url', url);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        let errMsg = 'Registration failed';
        try {
          const errData = await response.json();
          errMsg = errData?.error || errMsg;
        } catch {};
        throw new Error(errMsg);
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (error) {
      console.error('[Auth] register error', error);
      const isNetworkIssue = error.message.includes('Failed to fetch') || error.message.includes('network');
      const message = isNetworkIssue ? 'Server unreachable; please start the backend server on port 3001.' : error.message;
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const authValue = {
    user,
    login,
    register,
    logout,
    socket,
    foodItems,
    setFoodItems,
    stats,
    fetchStats
  };

  return (
    <AuthContext.Provider value={authValue}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/add-food" element={user ? <AddFood /> : <Navigate to="/login" />} />
              <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
