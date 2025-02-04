import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import { InputLabel, TextField, Autocomplete } from '@mui/material';
import { Controller } from 'react-hook-form';
import { Box } from '@mui/material';

const ReuseCountry = ({ name, label, required, control, error }) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');

    const [country, setCountry] = useState([]);

    const fetchCountry = async () => {
        try {
            const url = `${BASE_URL}/public/get_countries`;
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const { Status, Result, Error } = response.data;

            if (Status) {
                if (Result.length > 0) {
                    setCountry(Result);
                } else {
                    console.log('No country records found.');
                }
            } else {
                console.log(Error || 'Failed to fetch countries.');
            }
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    };

    useEffect(() => {
        fetchCountry();
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
                        options={country.length > 0 ? country : [{ code: '', label: 'No Options Available', value: '' }]} // Use `country` state dynamically
                        autoHighlight
                        getOptionLabel={(option) => option.label}
                        value={country.find((option) => option.label === value) || null}
                        onChange={(_, newValue) => onChange(newValue ? newValue : null)}
                        sx={{ width: '100%' }}
                        renderOption={(props, option) => (
                            <Box
                                key={option.value || option.label} // Ensure unique key
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

export default ReuseCountry;
