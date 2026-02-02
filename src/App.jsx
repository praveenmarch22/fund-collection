import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddPerson from './pages/AddPerson';
import PersonDetail from './pages/PersonDetail';
import WithdrawalsList from './pages/WithdrawalsList';
import AddWithdrawal from './pages/AddWithdrawal';
import WithdrawalDetail from './pages/WithdrawalDetail';
import './App.css';

// Protected Route component
function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-person"
            element={
              <ProtectedRoute>
                <AddPerson />
              </ProtectedRoute>
            }
          />
          <Route
            path="/person/:id"
            element={
              <ProtectedRoute>
                <PersonDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/withdrawals"
            element={
              <ProtectedRoute>
                <WithdrawalsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-withdrawal"
            element={
              <ProtectedRoute>
                <AddWithdrawal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/withdrawal/:id"
            element={
              <ProtectedRoute>
                <WithdrawalDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
