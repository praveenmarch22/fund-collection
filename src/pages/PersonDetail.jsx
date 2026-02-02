import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCollectionById, addInstallment } from '../api/api';

function PersonDetail() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchPerson();
  }, [id]);

  const fetchPerson = async () => {
    try {
      const response = await getCollectionById(id);
      if (response.data.success) {
        setPerson(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch person details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstallment = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const amount = parseFloat(installmentAmount);

    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (amount > person.remainingAmount) {
      setError(`Amount cannot exceed remaining amount of ₹${person.remainingAmount}`);
      return;
    }

    setSubmitting(true);

    try {
      const response = await addInstallment(id, amount);
      if (response.data.success) {
        setPerson(response.data.data);
        setInstallmentAmount('');
        setSuccessMessage('Installment added successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add installment');
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

  if (!person) {
    return (
      <div className="error-container">
        <h2>Person not found</h2>
        <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <div className="detail-header">
        <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
        <h2>{person.name}</h2>
      </div>

      <div className="detail-cards">
        <div className="detail-card">
          <h4>Promised Amount</h4>
          <p className="amount">₹{person.promisedAmount.toLocaleString()}</p>
        </div>
        <div className="detail-card">
          <h4>Total Paid</h4>
          <p className="amount success">₹{person.totalPaid.toLocaleString()}</p>
        </div>
        <div className="detail-card">
          <h4>Remaining</h4>
          <p className={`amount ${person.remainingAmount > 0 ? 'warning' : 'success'}`}>
            ₹{person.remainingAmount.toLocaleString()}
          </p>
        </div>
      </div>

      {person.remainingAmount > 0 && (
        <div className="add-installment-section">
          <h3>Add New Installment</h3>
          
          {error && <div className="error-message">{error}</div>}
          {successMessage && <div className="success-message">{successMessage}</div>}
          
          <form onSubmit={handleAddInstallment} className="installment-form">
            <div className="form-group">
              <label htmlFor="amount">Amount (₹)</label>
              <input
                type="number"
                id="amount"
                value={installmentAmount}
                onChange={(e) => setInstallmentAmount(e.target.value)}
                placeholder={`Max: ₹${person.remainingAmount}`}
                max={person.remainingAmount}
                min="1"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Installment'}
            </button>
          </form>
        </div>
      )}

      {person.remainingAmount === 0 && (
        <div className="fully-paid-badge">
          ✅ Fully Paid
        </div>
      )}

      <div className="installments-section">
        <h3>Payment History</h3>
        {person.installments.length === 0 ? (
          <p className="no-data">No payments yet</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {person.installments.map((installment, index) => (
                <tr key={installment._id || index}>
                  <td>{index + 1}</td>
                  <td className="success">₹{installment.amount.toLocaleString()}</td>
                  <td>{formatDate(installment.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PersonDetail;
