import { createContext, useContext, useReducer, useEffect, useState } from "react";
import axios from "axios";
import { useBaseURL } from "./BaseURLProvider";

// AuthContext for managing authentication state globally
const AuthContext = createContext();

// Initial state for authentication context
const initialState = {
    user: null,
    role: null,
    office_np: null,
    branch_np: null,
    office_id: null,
    main_office_id: null,
    allowed_apps: null,
    valid: false,
};

// Reducer function to handle authentication actions
const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                allowed_apps: action.payload.allowed_apps,
                branch_np: action.payload.branch_np,
                main_office_id: action.payload.main_office_id,
                office_id: action.payload.office_id,
                office_np: action.payload.office_np,
                role: action.payload.role,
                user: action.payload.user,
                valid: action.payload.valid,
            };
        case "LOGOUT":
            return initialState;
        default:
            return state;
    }
};

// AuthProvider component that provides authentication context to the app
export const AuthProvider = ({ children }) => {
    const BASE_URL = useBaseURL();
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [loading, setLoading] = useState(true);

    // Function to fetch session data from the backend
    const fetchSession = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/auth/session`, { withCredentials: true });
            console.log('Session fetch response:', response.data); // Add logging here
    
            // Check if loggedIn is true in the response data
            if (response.data.loggedIn) {
                // Session is valid, update context state with the response data
                const authData = {
                    branch_np: response.data.user.branch_name,
                    office_id: response.data.user.office_id,
                    office_np: response.data.user.office_np,
                    role: response.data.user.role_np,
                    user: response.data.user.username,
                    valid: response.data.loggedIn,
                    main_office_id: response.data.user.branch_id, // Assuming main_office_id is branch_id
                    allowed_apps: response.data.user.allowed_apps,
                };
    
                dispatch({ type: "LOGIN", payload: authData });
            } else {
                // If not logged in, log out
                console.log("Session invalid or expired, logging out...");
                dispatch({ type: "LOGOUT" });
            }
        } catch (error) {
            console.error("Session fetch failed:", error);
            // If session fetch fails, log out
            dispatch({ type: "LOGOUT" });
        } finally {
            setLoading(false);
        }
    };
    

    // UseEffect hook to fetch session data when the component mounts
    useEffect(() => {
        fetchSession(); // Always fetch from backend to ensure fresh session data
    }, []); // Empty dependency array ensures this runs once on mount

    // Inside AuthProvider, providing context to the children components
    return (
        <AuthContext.Provider value={{ state, dispatch, loading, fetchSession }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to access authentication context in other components
export const useAuth = () => useContext(AuthContext);
