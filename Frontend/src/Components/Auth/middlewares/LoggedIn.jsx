import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from '../../../Context/AuthContext';
const LoggedIn = () => {
    const { state } = useAuth();
    // console.log(state);
    const isValidUser = state.valid; // Ensure boolean check    
    return isValidUser ? <Navigate to="/" replace /> : <Outlet />; // Only redirect if logged in
};

export default LoggedIn;
