"use client";

import { useState, useEffect } from "react";

const AdminAccessPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);

  const handleAuthentication = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://community-article-backend.onrender.com/api/admin/authenticate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        }
      );

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("adminToken", result.token);
        setIsAuthenticated(true);
      } else {
        const result = await response.json();
        setError(result.message || "Authentication failed.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    setFetchingData(true);
    try {
      const response = await fetch("https://community-article-backend.onrender.com/api/admin/all-data", {
        headers: { Authorization: token },
      });

      if (response.ok) {
        const result = await response.json();
        setData(result.data);
      } else {
        setIsAuthenticated(false);
        setError("Session expired. Please log in again.");
        localStorage.removeItem("adminToken");
      }
    } catch (err) {
      setError("An error occurred while fetching data.");
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-300 to-orange-600 px-4">
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Admin Login
          </h2>
          <p className="text-1xl font-bold text-red-500 text-center mb-6">This page is restricted to Admin only</p>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <input
            type="text"
            placeholder="Admin Username"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
            className="w-full mb-4 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="password"
            placeholder="Admin Password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            className="w-full mb-6 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            onClick={handleAuthentication}
            disabled={loading}
            className={`w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Logging in..." : "Authenticate"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Admin Dashboard
      </h1>
      {fetchingData ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-solid"></div>
        </div>
      ) : data ? (
        Object.entries(data).map(([key, items]) => (
          <div key={key} className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {key.toUpperCase()}
            </h2>
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-orange-50">
                    {items.length > 0 &&
                      Object.keys(items[0]).map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-sm font-medium text-orange-600 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <tr key={index} className="hover:bg-orange-50">
                      {Object.values(item).map((value, i) => (
                        <td
                          key={i}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                        >
                          {typeof value === "object"
                            ? JSON.stringify(value)
                            : value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">No data available</p>
      )}
    </div>
  );
};

export default AdminAccessPage;

