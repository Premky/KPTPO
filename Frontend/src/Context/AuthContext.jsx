import { createContext, useContext, useReducer, useEffect, useState } from "react";
import axios from "axios";

// Get the BASE_URL from localStorage or use a default value
const BASE_URL = localStorage.getItem('BASE_URL') || 'http://localhost:3001'; // Fallback URL

const AuthContext = createContext();

const initialState = {
    token: null,
    user: null,
    role: null,
    office_np: null,
    branch_np: null,
    office_id: null,
    main_office_id: null,
    valid: false,
};

// Reducer function to handle login/logout actions
const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,
                role: action.payload.role,
                office_np: action.payload.office_np,
                branch_np: action.payload.branch_np,
                office_id: action.payload.office_id,
                main_office_id: action.payload.main_office_id,
                valid: action.payload.valid,
            };
        case "LOGOUT":
            sessionStorage.removeItem("authData"); // Remove auth data from session storage
            localStorage.removeItem("BASE_URL"); // Remove BASE_URL from local storage
            localStorage.removeItem("branch"); // Remove branch from local storage
            localStorage.removeItem("main_office_id"); // Remove main_office_id from local storage
            localStorage.removeItem("office_id"); // Remove office_id from local storage
            localStorage.removeItem("office_np"); // Remove office_np from local storage
            localStorage.removeItem("token"); // Remove token from local storage
            localStorage.removeItem("type"); // Remove user from local storage            
            localStorage.removeItem("valid"); // Remove valid from local storage            
            return {initialState
            } // Clears all state
        default:
            return state;
    }
};

// Context Provider Component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [loading, setLoading] = useState(true); // For managing loading state while fetching session

    useEffect(() => {
        const savedAuthData = sessionStorage.getItem("authData");
        
        if (savedAuthData) {
            // If there is saved auth data, log in the user
            const parsedData = JSON.parse(savedAuthData);
            if (parsedData.valid) {
                dispatch({ type: "LOGIN", payload: parsedData });
                setLoading(false); // Stop loading
            }
        } else {
            fetchSession(); // Fetch session from server if no saved session data
        }
    }, []); // Empty dependency array means this effect runs once when component mounts

    const fetchSession = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/auth/session`, {
                withCredentials: true, // Ensure token is sent in cookies
            });

            if (response.data.token) {
                const authData = {
                    token: response.data.token,
                    user: response.data.user,
                    role: response.data.role,
                    office_np: response.data.office_np,
                    branch_np: response.data.branch_np,
                    office_id: response.data.office_id,
                    main_office_id: response.data.main_office_id,
                    valid: response.data.success,
                };

                sessionStorage.setItem("authData", JSON.stringify(authData));
                dispatch({ type: "LOGIN", payload: authData });
            }
        } catch (error) {
            console.error("Session fetch failed:", error);
        } finally {
            setLoading(false); // Set loading to false after session fetch attempt
        }
    };

    return (
        <AuthContext.Provider value={{ state, dispatch, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use Auth Context
export const useAuth = () => useContext(AuthContext);
