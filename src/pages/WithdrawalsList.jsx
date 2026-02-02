import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllWithdrawals } from '../api/api';

function WithdrawalsList() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const response = await getAllWithdrawals();
      if (response.data.success) {
        setWithdrawals(response.data.data);
        setGrandTotal(response.data.grandTotal);
      }
    } catch (err) {
      setError('Failed to fetch withdrawals');
    } finally {
      setLoading(false);
    }
  };

  // Filter withdrawals based on search query
  const filteredWithdrawals = withdrawals.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          <h1>💸 Fund Withdrawals</h1>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Persons</h3>
          <p className="amount">{withdrawals.length}</p>
        </div>
        <div className="summary-card">
          <h3>Total Withdrawn</h3>
          <p className="amount warning">₹{grandTotal.toLocaleString()}</p>
        </div>
      </div>

      <div className="actions">
        <Link to="/add-withdrawal" className="btn btn-primary">
          + Add Withdrawal
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
            {filteredWithdrawals.length} of {withdrawals.length} results
          </span>
        )}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>No. of Withdrawals</th>
              <th>Total Taken</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredWithdrawals.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  {searchQuery ? 'No results found for your search.' : 'No withdrawals yet.'}
                </td>
              </tr>
            ) : (
              filteredWithdrawals.map((withdrawal) => (
                <tr key={withdrawal._id}>
                  <td>{withdrawal.name}</td>
                  <td>{withdrawal.withdrawals.length}</td>
                  <td className="warning">₹{withdrawal.totalWithdrawn.toLocaleString()}</td>
                  <td>
                    <Link to={`/withdrawal/${withdrawal._id}`} className="btn btn-small">
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

export default WithdrawalsList;
