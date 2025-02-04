import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import { InputLabel, TextField, Autocomplete } from '@mui/material';
import { Controller } from 'react-hook-form';
import { Box } from '@mui/material';


const ReuseDistrict = ({ name, label, required, control, error, options }) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');

    const states = [
        { code: '', label: 'No Options Available', phone: '', value: '' }
    ];
    options = options && options.length ? options : states;
    const [district, setDistrict] = useState([]);
    
    const fetchDistrict = async () => {
        try {
            const url = `${BASE_URL}/public/get_province`;
            const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` }, });
            const { Status, Result, Error } = response.data;

            if (Status) {
                if (Result.length > 0) {
                    console.log("ldksaf")
                    setDistrict(Result);
                    options = options && options.length ? options : district;
                } else {
                    console.log('Record for Province Not Found');
                }
            } else {
                console.log(Error || 'Failed to fetch Countries.')
            }
        } catch (error) {
            console.error('Error Fetching records:', error);
        }
    };

    useEffect(() => {
        fetchDistrict();
    }, []);
    return (
        <>
            <InputLabel id={name}>
                {label}
                {required && <span style={{ color: 'red' }}>*</span>}
            </InputLabel>

            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                    <Autocomplete
                        id={name}
                        options={options}
                        autoHighlight
                        getOptionLabel={(option) => option.label}
                        value={options.find((option) => option.label === value) || null}
                        onChange={(_, newValue) => onChange(newValue ? newValue : null)}  // Passing full object
                        sx={{ width: '100%' }}
                        renderOption={(props, option) => (
                            <Box
                                key={option.value || option.label}  // Ensure unique key
                                component="li"
                                sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                                {...props}
                            >
                                {option.label}
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                inputRef={ref}
                                variant="outlined"
                                size="small"
                                fullWidth
                                margin="normal"
                                error={!!error}
                                helperText={error?.message || ""}
                                required={required}
                            />
                        )}
                    />
                )}
            />
        </>
    );
};

export default ReuseDistrict;