import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const contactService = {
  createContact: async (contactData) => {
    const response = await axios.post(
      `${API_URL}/contact`,
      contactData,
      {
        withCredentials: true,
      }
    );

    return response.data;
  },
};