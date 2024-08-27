import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchUsers = async (query) => {
    const response = await axios.get(`${API_URL}/users`, {
        params: { query }
    });
    return response.data;
};

export const fetchChannels = async () => {
    const response = await axios.get(`${API_URL}/channels`);
    return response.data;
};

export const createChannel = async (name, creator) => {
    const response = await axios.post(`${API_URL}/channels`, { name, creator });
    return response.data;
};
