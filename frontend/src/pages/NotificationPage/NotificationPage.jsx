import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "../../store/notificationSlice";

export const NotificationPage = () => {
  const dispatch = useDispatch();

  const { notifications, loading, isError, errorMessage } = useSelector(
    (state) => state.notification
  );

  useEffect(() => {
    dispatch(
      fetchNotifications({
        page: 1,
      })
    );
  }, [dispatch]);

  if (loading) {
    return <div style={{ padding: "30px" }}>Loading...</div>;
  }

  if (isError) {
    return (
      <div style={{ padding: "30px", color: "red" }}>
        {errorMessage}
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>All Notifications</h1>

      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>{notification.title}</h3>

            <p>{notification.message}</p>

            <small>
              {new Date(notification.createdAt).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
};