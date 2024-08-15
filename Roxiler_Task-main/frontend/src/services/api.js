import axios from 'axios';

const API_BASE_URL = 'http://localhost:5050/api';

export const getTransactions = (month, search, page, perPage) => {
  return axios.get(`${API_BASE_URL}/transactions`, {
    params: { month, search, page, perPage }
  });
};

export const getStatistics = (month) => {
  return axios.get(`${API_BASE_URL}/statistics`, { params: { month } });
};

export const getBarChartData = (month) => {
  return axios.get(`${API_BASE_URL}/barchart`, { params: { month } });
};

export const getPieChartData = (month) => {
  return axios.get(`${API_BASE_URL}/piechart`, { params: { month } });
};

export const getCombinedData = (month) => {
  return axios.get(`${API_BASE_URL}/combined`, { params: { month } });
};
