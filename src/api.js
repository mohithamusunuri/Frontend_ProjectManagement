import axios from 'axios';

const API = axios.create({
    baseURL: 'https://backend-production-fce1.up.railway.app/api/sdp',
    timeout: 5000,
});

export const fetchStudents = async () => {
    try {
        const response = await API.get('/students');
        return response.data;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};

export const submitRubric = async (groupId, selections) => {
    return await API.post(`/evaluate/${groupId}`, selections);
};