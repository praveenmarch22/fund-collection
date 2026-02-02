import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getWithdrawalById, addMoreWithdrawal } from '../api/api';

function WithdrawalDetail() {
  const { id } = useParams();
  const [withdrawal, setWithdrawal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchWithdrawal();
  }, [id]);

  const fetchWithdrawal = async () => {
    try {
      const response = await getWithdrawalById(id);
      if (response.data.success) {
        setWithdrawal(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch withdrawal details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddWithdrawal = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const amountVal = parseFloat(amount);

    if (!amountVal || amountVal <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setSubmitting(true);

    try {
      const response = await addMoreWithdrawal(id, amountVal, purpose);
      if (response.data.success) {
        setWithdrawal(response.data.data);
        setAmount('');
        setPurpose('');
        setSuccessMessage('Withdrawal added successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add withdrawal');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!withdrawal) {
    return (
      <div className="error-container">
        <h2>Withdrawal record not found</h2>
        <Link to="/withdrawals" className="btn btn-primary">Back to Withdrawals</Link>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <Link to="/withdrawals" className="back-link">← Back to Withdrawals</Link>
        <h2>{withdrawal.name}</h2>
      </div>

      <div className="detail-cards">
        <div className="detail-card">
          <h4>No. of Withdrawals</h4>
          <p className="amount">{withdrawal.withdrawals.length}</p>
        </div>
        <div className="detail-card">
          <h4>Total Withdrawn</h4>
          <p className="amount warning">₹{withdrawal.totalWithdrawn.toLocaleString()}</p>
        </div>
      </div>

      <div className="add-installment-section">
        <h3>Add More Withdrawal</h3>
        
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        
        <form onSubmit={handleAddWithdrawal} className="withdrawal-form">
          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
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
              placeholder="What is it for?"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Withdrawal'}
          </button>
        </form>
      </div>

      <div className="installments-section">
        <h3>Withdrawal History</h3>
        {withdrawal.withdrawals.length === 0 ? (
          <p className="no-data">No withdrawals yet</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Amount</th>
                <th>Purpose</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {withdrawal.withdrawals.map((entry, index) => (
                <tr key={entry._id || index}>
                  <td>{index + 1}</td>
                  <td className="warning">₹{entry.amount.toLocaleString()}</td>
                  <td>{entry.purpose || '-'}</td>
                  <td>{formatDate(entry.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default WithdrawalDetail;
