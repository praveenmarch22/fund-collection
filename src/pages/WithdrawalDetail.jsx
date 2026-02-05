import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getWithdrawalById, addMoreWithdrawal, addUsage } from '../api/api';

// Predefined usage categories for Jathara/Festival expenses
const USAGE_CATEGORIES = [
  { value: '', label: 'Select category...' },
  { value: 'Flowers', label: '🌸 Flowers (పూలు)' },
  { value: 'Decorations', label: '🎊 Decorations (అలంకరణలు)' },
  { value: 'Construction', label: '🏗️ Construction (నిర్మాణం)' },
  { value: 'Tent/Pandal', label: '⛺ Tent/Pandal (పందిరి)' },
  { value: 'Sound System', label: '🔊 Sound System (సౌండ్)' },
  { value: 'Lighting', label: '💡 Lighting (లైట్లు)' },
  { value: 'Pooja Items', label: '🪔 Pooja Items (పూజ సామాగ్రి)' },
  { value: 'Prasadam/Food', label: '🍚 Prasadam/Food (ప్రసాదం)' },
  { value: 'Fruits', label: '🍌 Fruits (పండ్లు)' },
  { value: 'Coconuts', label: '🥥 Coconuts (కొబ్బరికాయలు)' },
  { value: 'Camphor/Oil', label: '🕯️ Camphor/Oil (కర్పూరం/నూనె)' },
  { value: 'Priest/Pandit', label: '🙏 Priest/Pandit (పూజారి)' },
  { value: 'Musicians/Band', label: '🎺 Musicians/Band (బ్యాండ్)' },
  { value: 'Transport', label: '🚗 Transport (రవాణా)' },
  { value: 'Labour/Workers', label: '👷 Labour/Workers (కూలీలు)' },
  { value: 'Printing/Banners', label: '🖨️ Printing/Banners (ప్రింటింగ్)' },
  { value: 'Vessel Rent', label: '🍳 Vessel Rent (గిన్నెల అద్దె)' },
  { value: 'Chair/Table Rent', label: '🪑 Chair/Table Rent (కుర్చీల అద్దె)' },
  { value: 'Fireworks', label: '🎆 Fireworks (టపాసులు)' },
  { value: 'Generator', label: '⚡ Generator (జనరేటర్)' },
  { value: 'Water/Drinks', label: '💧 Water/Drinks (నీళ్ళు)' },
  { value: 'Miscellaneous', label: '📦 Miscellaneous (ఇతరాలు)' }
];

function WithdrawalDetail() {
  const { id } = useParams();
  const [withdrawal, setWithdrawal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedWithdrawalIndex, setSelectedWithdrawalIndex] = useState(null);
  const [usageAmount, setUsageAmount] = useState('');
  const [usageCategory, setUsageCategory] = useState('');
  const [usageCustomPurpose, setUsageCustomPurpose] = useState('');
  const [usageError, setUsageError] = useState('');
  const [usageSubmitting, setUsageSubmitting] = useState(false);
  const [usageSuccessMessage, setUsageSuccessMessage] = useState('');

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

  const openModal = (index) => {
    setSelectedWithdrawalIndex(index);
    setShowModal(true);
    setUsageAmount('');
    setUsageCategory('');
    setUsageCustomPurpose('');
    setUsageError('');
    setUsageSuccessMessage('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedWithdrawalIndex(null);
    setUsageAmount('');
    setUsageCategory('');
    setUsageCustomPurpose('');
    setUsageError('');
    setUsageSuccessMessage('');
  };

  const handleAddUsage = async (e) => {
    e.preventDefault();
    setUsageError('');
    setUsageSuccessMessage('');

    const amountVal = parseFloat(usageAmount);

    if (!amountVal || amountVal <= 0) {
      setUsageError('Please enter a valid amount');
      return;
    }

    // Build the final purpose: category + description
    let finalPurpose = '';
    
    if (usageCategory && usageCategory !== 'custom') {
      finalPurpose = usageCategory;
      if (usageCustomPurpose.trim()) {
        finalPurpose += ' - ' + usageCustomPurpose.trim();
      }
    } else if (usageCustomPurpose.trim()) {
      finalPurpose = usageCustomPurpose.trim();
    } else {
      setUsageError('Please select a category or enter a description');
      return;
    }

    const selectedWithdrawal = getSelectedWithdrawal();
    if (!selectedWithdrawal) {
      setUsageError('No withdrawal selected');
      return;
    }

    setUsageSubmitting(true);

    try {
      const response = await addUsage(id, amountVal, finalPurpose, selectedWithdrawal._id);
      if (response.data.success) {
        setWithdrawal(response.data.data);
        setUsageAmount('');
        setUsageCategory('');
        setUsageCustomPurpose('');
        setUsageSuccessMessage('Usage added successfully!');
        setTimeout(() => setUsageSuccessMessage(''), 3000);
      }
    } catch (err) {
      setUsageError(err.response?.data?.message || 'Failed to add usage');
    } finally {
      setUsageSubmitting(false);
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

  const getSelectedWithdrawal = () => {
    if (selectedWithdrawalIndex !== null && withdrawal?.withdrawals[selectedWithdrawalIndex]) {
      return withdrawal.withdrawals[selectedWithdrawalIndex];
    }
    return null;
  };

  const getUsagesForWithdrawal = (withdrawalId) => {
    if (!withdrawal?.usages) return [];
    return withdrawal.usages.filter(u => u.withdrawalEntryId === withdrawalId);
  };

  const getTotalUsedForWithdrawal = (withdrawalId) => {
    const usages = getUsagesForWithdrawal(withdrawalId);
    return usages.reduce((sum, u) => sum + u.amount, 0);
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

  const selectedWithdrawal = getSelectedWithdrawal();

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
        <div className="detail-card">
          <h4>Total Used</h4>
          <p className="amount success">₹{(withdrawal.totalUsed || 0).toLocaleString()}</p>
        </div>
        <div className="detail-card">
          <h4>Remaining</h4>
          <p className="amount">{(() => {
            const remaining = withdrawal.totalWithdrawn - (withdrawal.totalUsed || 0);
            return `₹${remaining.toLocaleString()}`;
          })()}</p>
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
        <p style={{color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1rem'}}>Click on a row to add usage details</p>
        {withdrawal.withdrawals.length === 0 ? (
          <p className="no-data">No withdrawals yet</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Amount</th>
                <th>Purpose</th>
                <th>Used</th>
                <th>Remaining</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {withdrawal.withdrawals.map((entry, index) => {
                const usedAmount = getTotalUsedForWithdrawal(entry._id);
                const remainingAmount = entry.amount - usedAmount;
                return (
                  <tr 
                    key={entry._id || index} 
                    onClick={() => openModal(index)}
                    style={{cursor: 'pointer'}}
                    className="clickable-row"
                  >
                    <td>{index + 1}</td>
                    <td className="warning">₹{entry.amount.toLocaleString()}</td>
                    <td>{entry.purpose || '-'}</td>
                    <td className="success">₹{usedAmount.toLocaleString()}</td>
                    <td className={remainingAmount > 0 ? 'warning' : 'success'}>₹{remainingAmount.toLocaleString()}</td>
                    <td>{formatDate(entry.date)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for adding usage */}
      {showModal && selectedWithdrawal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Usage Details</h3>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            
            <div className="modal-body">
              <div className="modal-info">
                <p><strong>Withdrawal Amount:</strong> ₹{selectedWithdrawal.amount.toLocaleString()}</p>
                <p><strong>Purpose:</strong> {selectedWithdrawal.purpose || '-'}</p>
                <p><strong>Date:</strong> {formatDate(selectedWithdrawal.date)}</p>
                <p><strong>Used:</strong> <span className="success">₹{getTotalUsedForWithdrawal(selectedWithdrawal._id).toLocaleString()}</span></p>
                <p><strong>Remaining:</strong> <span className="warning">₹{(selectedWithdrawal.amount - getTotalUsedForWithdrawal(selectedWithdrawal._id)).toLocaleString()}</span></p>
              </div>

              <div className="modal-form-section">
                <h4>Add Usage</h4>
                
                {usageError && <div className="error-message">{usageError}</div>}
                {usageSuccessMessage && <div className="success-message">{usageSuccessMessage}</div>}
                
                <form onSubmit={handleAddUsage} className="withdrawal-form">
                  <div className="form-group">
                    <label htmlFor="usageAmount">Amount (₹)</label>
                    <input
                      type="number"
                      id="usageAmount"
                      value={usageAmount}
                      onChange={(e) => setUsageAmount(e.target.value)}
                      placeholder="Enter amount spent"
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="usageCategory">Category</label>
                    <select
                      id="usageCategory"
                      value={usageCategory}
                      onChange={(e) => setUsageCategory(e.target.value)}
                    >
                      {USAGE_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="usageCustomPurpose">Description / Details <span style={{color: '#9ca3af', fontWeight: 'normal'}}>(Optional)</span></label>
                    <input
                      type="text"
                      id="usageCustomPurpose"
                      value={usageCustomPurpose}
                      onChange={(e) => setUsageCustomPurpose(e.target.value)}
                      placeholder="Add more details..."
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={usageSubmitting}>
                    {usageSubmitting ? 'Adding...' : 'Add Usage'}
                  </button>
                </form>
              </div>

              <div className="modal-history">
                <h4>Usage History</h4>
                {getUsagesForWithdrawal(selectedWithdrawal._id).length === 0 ? (
                  <p className="no-data">No usage records yet</p>
                ) : (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Amount</th>
                        <th>Used For</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getUsagesForWithdrawal(selectedWithdrawal._id).map((usage, index) => (
                        <tr key={usage._id || index}>
                          <td>{index + 1}</td>
                          <td className="success">₹{usage.amount.toLocaleString()}</td>
                          <td>{usage.purpose}</td>
                          <td>{formatDate(usage.date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WithdrawalDetail;
