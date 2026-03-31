import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

const SessionTimeout = () => {
  const navigate = useNavigate();
  const timeoutId = useRef(null);

  // 30 minutes in milliseconds
  const TIMEOUT_DURATION = 30 * 60 * 1000;

  const handleLogout = useCallback(async () => {
    // Check if user is logged in before attempting logout
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await api.post("/logout", {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Logout error on timeout:", error);
      } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("Session expired due to 30 minutes of inactivity. Please log in again.");
        navigate("/");

        window.location.reload();
      }
    }
  }, [navigate]);

  const resetTimer = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    // Only run timer if a token exists
    const token = localStorage.getItem('token');
    if (token) {
      timeoutId.current = setTimeout(handleLogout, TIMEOUT_DURATION);
    }
  }, [handleLogout]);

  useEffect(() => {
    // Events that indicate user activity
    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];

    // Initialize timer
    resetTimer();

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      // Cleanup on unmount
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [resetTimer]);

  // Optionally listen to local storage changes to reset timer across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        resetTimer();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [resetTimer]);

  return null;
};

export default SessionTimeout;
