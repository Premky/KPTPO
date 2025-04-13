import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Context/AuthContext';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';
import { getAvailableBaseUrl } from './middlewares/getBaseUrl';

//Items from Material UI
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Button } from '@mui/material';
import { useBaseURL } from '../../Context/BaseURLProvider'; // Import the custom hook for base URL

//Close Item from MaterialUI


// const useApiBaseUrl = () => {
//     const [baseUrl, setBaseUrl] = useState(null);

//     useEffect(() => {
//         const fetchBaseUrl = async () => {
//             const url = await getAvailableBaseUrl();
//             setBaseUrl(url);
//             console.log("Base URL:", url);
//         };
//         fetchBaseUrl();
//     }, []);

//     return baseUrl;
// };

// import './LoginStyle.css'
// if (!BASE_URL) return;
// const Login = ({onLogin}) => {
const Login = () => {
    // const {token, setToken} = useAuth();
    // const BASE_URL = import.meta.env.VITE_API_BASE_URL
    // const BASE_URL = useApiBaseUrl();
    const BASE_URL = useBaseURL();
    const navigate = useNavigate();
    const { state, dispatch } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [values, setValues] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState();


    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        if (!BASE_URL) {
            console.error("🚨 No backend available!");
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, values, { withCredentials: true });
            // Swal.showLoading(Swal.getDenyButton());
            Swal.fire({
                title: "Logging in...",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            if (response.data.loginStatus) {
                // Save necessary data in localStorage
                // setToken(response.data.token);

                dispatch({
                    type: "LOGIN",
                    payload: {
                        user: response.data.username,
                        token: response.data.token,
                        role: response.data.usertype,
                        office_np: response.data.office_np,
                        branch_np: response.data.branch,
                        office_id: response.data.office_id,
                        main_office_id: response.data.main_office_id,
                        valid: response.data.loginStatus,
                        app_np: response.data.app_np,
                        app_en: response.data.app_en
                    },
                });
                // Redirect to home page
                Swal.fire({
                    title: "Login Success",
                    text: "Redirecting to Home Page",
                    icon: "success",
                    timer: 1000,
                    showConfirmButton: false
                });
                navigate('/');
            } else {
                Swal.fire({ title: "Login Failed", text: response.data.error, icon: "error" });
            }
        } catch (err) {
            console.error("Login Error:", err);

            const errorMessage =
                err.response?.data?.Error || "An unexpected error occurred.";
            setError(errorMessage);
            Swal.fire({
                title: "Login Error",
                text: errorMessage,
                icon: "error"
            });
        }
    };

    const [notification, setNotification] = useState('');
    const notify = (message) => toast(message);
    return (
        <>
            <Box
                sx={{
                    marginTop: "5%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <img src='/np_police_logo.png' alt='Nepal Police Logo' height={'150px'} />
            </Box>
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
                className="loginPage">

                <div className='p-3 rounded w-40 border loginForm'>
                    <form onSubmit={handleLogin} >
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" >
                            <TextField id="username" label="Username"
                                onChange={(e) => setValues({ ...values, username: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                        </FormControl>
                        <br />
                        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined" >
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={(e) => setValues({ ...values, password: e.target.value })}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword ? 'hide the password' : 'display the password'
                                            }
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            onMouseUp={handleMouseUpPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                            {/* <div style={{ color: 'red' }}>
                                {error}
                            </div> */}
                            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                                <Button
                                    variant="contained"
                                    disabled={!BASE_URL}
                                    onClick={() => notify('Logging in...')}
                                    type='submit'
                                >
                                    Login
                                </Button>
                            </FormControl>
                        </FormControl>
                    </form>
                </div>
            </Box>
        </>
    )
}

export default Login
