// import axios from "axios";

// const API = import.meta.env.VITE_API_URL;

// export const notificationService = {
//   getNotifications() {
//     return axios.get(`${API}/notifications`, {
//       withCredentials: true,
//     });
//   },
// };

import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getNotifications = async () => {
    return axios.get(`${API}/notifications`, {
        withCredentials: true,
    });
};

export const markNotificationAsRead = async (id) => {
    return axios.patch(
        `${API}/notifications/${id}/read`,
        {},
        {
            withCredentials: true,
        }
    );
};

export const deleteNotification = async (id) => {
    return axios.delete(
        `${API}/notifications/${id}`,
        {
            withCredentials: true,
        }
    );
};