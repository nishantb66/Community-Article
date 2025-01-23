"use client";

import { useState, useEffect } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://community-article-backend.onrender.com/api/notifications/all",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setNotifications(data.notifications);
      } else {
        console.error(data.error || "Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

return (
  <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-orange-600 flex items-center justify-center gap-2">
        Notifications
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 border-l-4 border-orange-500"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {notification.title}
                    </h3>
                    <span className="text-sm text-orange-400 bg-orange-50 px-3 py-1 rounded-full">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">{notification.message}</p>
                  <div className="mt-3 text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleTimeString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  </div>
);
}
