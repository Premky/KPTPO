import { createContext, useContext, useReducer, useEffect, useState } from "react";
import axios, { all } from "axios";
import { useBaseURL } from "./BaseURLProvider";
// const BASE_URL = localStorage.getItem('BASE_URL') || 'http://192.168.165.250:3003';
// const BASE_URL = localStorage.getItem('BASE_URL');
const BASE_URL = useBaseURL();
const AuthContext = createContext();

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

const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            // console.log(action);            
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
            }; // Save the auth data and sends to CombinedNavBar
        case "LOGOUT":

            return initialState;
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedAuthData = sessionStorage.getItem("authData");

        if (savedAuthData) {
            const parsedData = JSON.parse(savedAuthData);
            if (parsedData.valid) {
                dispatch({ type: "LOGIN", payload: parsedData });
                setLoading(false);
            }
        } else {
            fetchSession();
        }
    }, []);

    const fetchSession = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/auth/session`, {
                withCredentials: true,
            });

            if (response.data.success) {
                // console.log(response.data);
                const authData = {
                    branch_np: response.data.branch_np,
                    office_id: response.data.office_id,
                    office_np: response.data.office_np,
                    role: response.data.role,
                    user: response.data.user,
                    valid: response.data.success,
                    main_office_id: response.data.main_office_id,
                    allowed_apps: response.data.allowed_apps,
                    // app_name_np: response.data.app_name_en,
                };
                // console.log(authData)
                // sessionStorage.setItem("authData", JSON.stringify(authData));
                dispatch({ type: "LOGIN", payload: authData });
            }
        } catch (error) {
            console.error("Session fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ state, dispatch, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
