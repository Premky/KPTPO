import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const SuperAdmin = () => {
    const isValidUser = localStorage.getItem("valid") === "true"; // Convert to boolean
    const userRole = localStorage.getItem("role"); // Get user role

    if (!isValidUser) {
        return <Navigate to="/login" replace />;
    }

    if (userRole !== "superadmin") {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default SuperAdmin;
