import axios from 'axios';

const BASE_URL = 'http://localhost:5001'; // Backend pour les prédictions
const ROBOT_API_URL = 'http://localhost:3001/api/robot'; // Backend pour les logs du robot

export const predictTrash = (file) => {
  const form = new FormData();
  form.append('file', file);
  return axios.post(`${BASE_URL}/predict`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const fetchRobotLogs = () => {
  return axios.get(`${ROBOT_API_URL}/logs`);
};

export const saveRobotLog = (log) => {
  return axios.post(`${ROBOT_API_URL}/data`, log, {
    headers: { 'Content-Type': 'application/json' },
  });
};