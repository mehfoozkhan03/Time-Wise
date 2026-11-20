import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

export const adminThoughtService = {
    createAdminThought(formData) {
        return API.post("/admin/posts/thoughts", formData);
    },
};