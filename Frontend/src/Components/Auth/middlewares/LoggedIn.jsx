import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const LoggedIn = () => {
    const isValidUser = localStorage.getItem('valid') === "true"; // Ensure boolean check

    return isValidUser ? <Navigate to="/" replace /> : <Outlet />; // Only redirect if logged in
};

export default LoggedIn;
