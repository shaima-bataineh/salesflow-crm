import axios from "axios";

import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const loginUser = (data) => {
  return axios.post(`${API}/api/auth/login`, data);
};

export const getCustomers = () => axios.get(`${API}/customers`);
export const getDeals = () => axios.get(`${API}/deals`);
export const getLeads = () => axios.get(`${API}/leads`);
export const getUsers = () => axios.get(`${API}/users`);