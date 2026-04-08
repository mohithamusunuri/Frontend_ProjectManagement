import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api/sdp',
    timeout: 5000, // 5 second timeout for professional handling
});

export const fetchStudents = async () => {
    try {
        const response = await API.get('/students');
        return response.data;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error; // Handled by Frontend UI
    }
};

export const submitRubric = async (groupId, selections) => {
    return await API.post(`/evaluate/${groupId}`, selections);
};