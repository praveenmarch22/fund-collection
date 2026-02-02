import axios from 'axios';

const API_URL = 'http://13.201.133.172:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth API
export const login = (username, password) => {
  return api.post('/login', { username, password });
};

// Collections API
export const getAllCollections = () => {
  return api.get('/collections');
};

export const getCollectionById = (id) => {
  return api.get(`/collections/${id}`);
};

export const createCollection = (name, promisedAmount, initialPayment = null) => {
  const data = { name, promisedAmount };
  if (initialPayment !== null && initialPayment > 0) {
    data.initialPayment = initialPayment;
  }
  return api.post('/collections', data);
};

export const addInstallment = (id, amount) => {
  return api.post(`/collections/${id}/installment`, { amount });
};

// Withdrawals API
export const getAllWithdrawals = () => {
  return api.get('/withdrawals');
};

export const getWithdrawalById = (id) => {
  return api.get(`/withdrawals/${id}`);
};

export const createWithdrawal = (name, amount, purpose = '') => {
  return api.post('/withdrawals', { name, amount, purpose });
};

export const addMoreWithdrawal = (id, amount, purpose = '') => {
  return api.post(`/withdrawals/${id}/add`, { amount, purpose });
};

export default api;

