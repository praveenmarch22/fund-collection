import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createWithdrawal } from '../api/api';

function AddWithdrawal() {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const response = await createWithdrawal(
        name,
        parseFloat(amount),
        purpose
      );
      if (response.data.success) {
        navigate('/withdrawals');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add withdrawal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <div className="form-header">
          <Link to="/withdrawals" className="back-link">← Back to Withdrawals</Link>
          <h2>Add Withdrawal</h2>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Person's Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter person's name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount Taken (₹)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="purpose">Purpose <span style={{color: '#9ca3af', fontWeight: 'normal'}}>(Optional)</span></label>
            <input
              type="text"
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="What is the money for?"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Withdrawal'}
            </button>
            <Link to="/withdrawals" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddWithdrawal;
