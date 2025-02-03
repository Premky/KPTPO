import React from 'react';
import { InputLabel, TextField, Autocomplete } from '@mui/material';
import { Controller } from 'react-hook-form';
import { Box } from '@mui/material';

const ReuseSelect = ({ name, label, required, control, error, options }) => {
    const countries = [
        { code: '', label: 'No Options Available', phone: '', value: '' }
    ];
    options = options && options.length ? options : countries;

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

export default ReuseSelect;