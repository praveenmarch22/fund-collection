import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createCollection } from '../api/api';

function AddPerson() {
  const [name, setName] = useState('');
  const [promisedAmount, setPromisedAmount] = useState('');
  const [initialPayment, setInitialPayment] = useState('');
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

    if (!promisedAmount || parseFloat(promisedAmount) <= 0) {
      setError('Please enter a valid promised amount');
      return;
    }

    const payment = initialPayment ? parseFloat(initialPayment) : 0;
    if (payment < 0) {
      setError('Initial payment cannot be negative');
      return;
    }

    if (payment > parseFloat(promisedAmount)) {
      setError('Initial payment cannot exceed promised amount');
      return;
    }

    setLoading(true);

    try {
      const response = await createCollection(
        name,
        parseFloat(promisedAmount),
        payment > 0 ? payment : null
      );
      if (response.data.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add person');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <div className="form-header">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          <h2>Add New Person</h2>
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
            <label htmlFor="promisedAmount">Promised Amount (₹)</label>
            <input
              type="number"
              id="promisedAmount"
              value={promisedAmount}
              onChange={(e) => setPromisedAmount(e.target.value)}
              placeholder="Enter promised amount"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="initialPayment">Initial Payment (₹) <span style={{color: '#9ca3af', fontWeight: 'normal'}}>(Optional)</span></label>
            <input
              type="number"
              id="initialPayment"
              value={initialPayment}
              onChange={(e) => setInitialPayment(e.target.value)}
              placeholder="Enter initial payment (if any)"
              min="0"
              max={promisedAmount || undefined}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Person'}
            </button>
            <Link to="/dashboard" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPerson;
