import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllCollections, getAllWithdrawals } from '../api/api';

function Dashboard() {
  const [collections, setCollections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [collectionsRes, withdrawalsRes] = await Promise.all([
        getAllCollections(),
        getAllWithdrawals()
      ]);
      
      if (collectionsRes.data.success) {
        setCollections(collectionsRes.data.data);
      }
      if (withdrawalsRes.data.success) {
        setTotalWithdrawn(withdrawalsRes.data.grandTotal);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  // Filter collections based on search query
  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate totals (from all collections, not filtered)
  const totalPromised = collections.reduce((sum, c) => sum + c.promisedAmount, 0);
  const totalPaid = collections.reduce((sum, c) => sum + c.totalPaid, 0);
  const totalPending = collections.reduce((sum, c) => sum + c.remainingAmount, 0);
  const balanceRemaining = totalPaid - totalWithdrawn;

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🏘️ Village Fund Collection</h1>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="summary-cards summary-cards-5">
        <div className="summary-card">
          <h3>Total Promised</h3>
          <p className="amount">₹{totalPromised.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h3>Total Collected</h3>
          <p className="amount success">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h3>Pending</h3>
          <p className="amount warning">₹{totalPending.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h3>Total Withdrawal</h3>
          <p className="amount danger">₹{totalWithdrawn.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h3>Balance</h3>
          <p className={`amount ${balanceRemaining >= 0 ? 'success' : 'danger'}`}>
            ₹{balanceRemaining.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="actions">
        <Link to="/add-person" className="btn btn-primary">
          + Add New Person
        </Link>
        <Link to="/withdrawals" className="btn btn-withdrawal">
          💸 View Withdrawals
        </Link>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <span className="search-results-count">
            {filteredCollections.length} of {collections.length} results
          </span>
        )}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Promised Amount</th>
              <th>Total Paid</th>
              <th>Remaining</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCollections.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  {searchQuery ? 'No results found for your search.' : 'No collections yet. Add a new person to get started.'}
                </td>
              </tr>
            ) : (
              filteredCollections.map((collection) => (
                <tr key={collection._id}>
                  <td>{collection.name}</td>
                  <td>₹{collection.promisedAmount.toLocaleString()}</td>
                  <td className="success">₹{collection.totalPaid.toLocaleString()}</td>
                  <td className={collection.remainingAmount > 0 ? 'warning' : 'success'}>
                    ₹{collection.remainingAmount.toLocaleString()}
                  </td>
                  <td>
                    <Link to={`/person/${collection._id}`} className="btn btn-small">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
