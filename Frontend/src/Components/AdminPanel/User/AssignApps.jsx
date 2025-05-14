import React, { useEffect, useState } from 'react'
import { Autocomplete, Box, Button, Divider, Grid2, IconButton, InputLabel, TextField, Typography } from '@mui/material'
import { useBaseURL } from '../../../Context/BaseURLProvider';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import ReuseSelect from '../../ReuseableComponents/ReuseSelect';
import { Table } from 'react-bootstrap-icons';


const AssignApps = () => {
    const BASE_URL = useBaseURL();
    const { register, handleSubmit, reset, watch, formState: { errors }, control } = useForm();
    const [editing, setEditing] = useState(false);

    // API fetch function
    const fetchData = async (url, params, setStateFunction) => {
        try {
            const response = await axios.get(url, {
                // headers: { Authorization: `Bearer ${token}` },
                params,
                withCredentials: true,
            });
            const { Status, Result, Error } = response.data;

            if (Status) {
                if (Result?.length > 0) {
                    setStateFunction(Result);
                } else {
                    console.log('No records found');
                }
            } else {
                console.error(Error || 'Failed to fetch records');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching data.');
        }
    };

    const onFormSubmit = async (data) => {
        // console.log('Form Data:', data);
        try {
            const url = editing ? `${BASE_URL}/admin/update_app/${currentData.id}` :
                `${BASE_URL}/admin/add_app`;
            const method = editing ? 'PUT' : 'POST';
            const response = await axios({
                method,
                url,
                data,
                // headers: {Authorization: `Bearer ${token}`,"Content-Type": "multipart/form-data",},
                withCredentials: true
            });
            const { Status, Result, Error } = response.data;
            if (Status) {
                alert('Data submitted successfully!');

                reset(); // Reset the form after successful submission
                setEditing(false); // Reset editing state
                fetchAccidentRecords(); // Fetch updated records
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while submitting the form.');
        }
    }

    const [users, setUsers] = useState([]);
    const fetchUsers = async () => {
        const params = {};
        fetchData(`${BASE_URL}/auth/get_users`, params, (result) => {
            // console.log(result);
            setUsers(result);
        });
    }

    const [apps, setApps] = useState([]);
    const fetchApps = async () => {
        const params = {};
        fetchData(`${BASE_URL}/public/get_apps`, params, (result) => {
            console.log(result);
            setApps(result);
        });
    }

    const [assignedapps, setAssignedApps] = useState([]);
    const fetchAssignedApps = async () => {
        const params = {};
        fetchData(`${BASE_URL}/admin/get_assigned_apps`, params, (result) => {
            console.log(result);
            setAssignedApps(result);
        });
    }

    useEffect(() => {
        fetchUsers();
        fetchApps();
        fetchAssignedApps();
    }, [])
    return (
        <>
            <Box sx={{ flexGrow: 1, margin: 2 }}>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <Grid2>
                        <h4>Assign Applications:</h4>
                    </Grid2>
                    <Grid2 container spacing={1}>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <InputLabel>Username:</InputLabel>
                            <Controller
                                name="user"  // Fix 1: Give proper name
                                control={control}
                                render={({ field: { onChange, value, ref } }) => (
                                    <Autocomplete
                                        options={Array.isArray(users) ? users : []}
                                        autoHighlight
                                        getOptionLabel={(option) => `${option.name} (${option.username})`}
                                        value={users.find((user) => user.id === value) || null}
                                        onChange={(_, newValue) => {
                                            onChange(newValue ? newValue.id : ''); // Fix 2: Use id not value
                                        }}
                                        sx={{ width: '100%' }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                inputRef={ref}
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                margin="normal"
                                                required
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid2>

                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <InputLabel>Apps:</InputLabel>
                            <Controller
                                name="app"  // Fix 1: Give proper name
                                control={control}
                                render={({ field: { onChange, value, ref } }) => (
                                    <Autocomplete
                                        options={Array.isArray(apps) ? apps : []}
                                        autoHighlight
                                        getOptionLabel={(option) => `${option.name_np} (${option.short_name})`}
                                        value={apps.find((app) => app.id === value) || null}
                                        onChange={(_, newValue) => {
                                            onChange(newValue ? newValue.id : ''); // Fix 2: Use id not value
                                        }}
                                        sx={{ width: '100%' }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                inputRef={ref}
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                margin="normal"
                                                required
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid2>
                        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
                            <Button variant="contained" type="submit" color="primary">
                                {editing ? 'Update' : 'Assign'}
                            </Button>
                        </Grid2>

                    </Grid2>
                </form>
            </Box>

            <Divider />
            <Box sx={{ flexGrow: 1, margin: 2 }}>
                <Grid2>
                    <h4>Assigned Applications:</h4>
                </Grid2>
                <Grid2 container spacing={1}>
                    <Table className='table table-striped table-bordered'>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Apps</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignedapps.map((app) => (
                                <tr key={app.id}>
                                    <td>{app.user_name}</td>
                                    <td>{app.app_name}</td>
                                    <td>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                setEditing(true);
                                                reset({
                                                    user: app.user_id,
                                                    app: app.app_id,
                                                });
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Grid2>
            </Box>

        </>
    )
}

export default AssignApps
