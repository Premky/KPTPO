import React, { useEffect, useState } from 'react'
import { Autocomplete, Box, Button, Divider, Grid2, IconButton, InputLabel, Paper, TextField, Typography } from '@mui/material'
import { useBaseURL } from '../../../Context/BaseURLProvider';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import ReuseSelect from '../../ReuseableComponents/ReuseSelect';
import { Table } from 'react-bootstrap-icons';
import { DataGrid } from "@mui/x-data-grid";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";


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

    const columns = [
        { field: "id", headerName: "सि.नं." },
        { field: "name", headerName: "नाम" },
        { field: "username", headerName: "प्रयोगकर्ता नाम" },
        { field: "usertype", headerName: "प्रकार" },
        { field: "office_id", headerName: "कार्यालय" },
        { field: "branch_id", headerName: "शाखा" },
        { field: "is_active", headerName: "सक्रय" },
    ];

    const [assignedapps, setAssignedApps] = useState([]);
    const [formattedOptions, setFormattedOptions] = useState([]);
    const fetchAssignedApps = async () => {
        const params = {};
        fetchData(`${BASE_URL}/admin/get_assigned_apps`, params, (result) => {
            console.log(result);
            setAssignedApps(result);

            if (Array.isArray(result) && result.length > 0) {
                const formatted = result.map((opt, index) => ({
                    sn: `${opt.id ?? `app-${index}`}`,  // Unique key generation
                    id: index + 1,
                    name: opt.name,
                    username: opt.username,
                    usertype: opt.en_usertype,
                    office_id: opt.office,
                    branch_id: opt.branch,
                    is_active: opt.is_active ? 'छ' : 'छैन',
                }));

                setFormattedOptions(formatted);
            } else {
                console.log('No records found.');
            }

        });
    }

    // 🔹 Export to Excel
    const handleExportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Data");

        // Add headers
        worksheet.addRow(columns.map(col => col.headerName));

        // Add rows
        rows.forEach(row => {
            worksheet.addRow(columns.map(col => row[col.field]));
        });

        // Save file
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), "table_data.xlsx");
    };

    useEffect(() => {
        fetchUsers();
        fetchApps();
        fetchAssignedApps();
    }, [])

    const updatedColumns = [
        // Add "sn" column only if it does not already exist
        ...(!columns.some(col => col.field === "sn")
            ? [{
                field: "id",
                headerName: "S.No",
                width: 70,
                renderCell: (params) => params.rowIndex + 1, // Dynamic row number
            }]
            : []),

        ...columns.map(col => ({
            ...col,
            flex: 1,
            sortable: true,
            hideable: true,
            hide: col.hide || false,
            renderCell: col.field === "driverphoto" ? (params) => (
                params.value ? (
                    <img
                        src={params.value}
                        alt="Driver"
                        style={{ width: 50, height: 50, borderRadius: "5px", objectFit: "cover" }}
                        onClick={() => previewImage(params.value)}
                    />
                ) : (
                    "No Image"
                )
            ) : undefined,
        })),
    ];
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
                    <Paper sx={{ height: 400, width: '100%' }} style={{ overflowX: 'auto' }}>
                        <DataGrid
                            sx={{ border: 0 }}
                            columns={[
                                ...updatedColumns,
                                {
                                    field: "actions",
                                    headerName: "Actions",
                                    renderCell: (params) => (
                                        <div>
                                            {/* {showEdit && (
                                                <Button variant="contained" color="primary" size="small" onClick={() => onEdit(params.row)}>
                                                    Edit
                                                </Button>
                                            )}
                                            {showDelete && (
                                                <Button variant="contained" color="secondary" size="small" onClick={() => onDelete(params.row.id)}>
                                                    Delete
                                                </Button>
                                            )} */}
                                        </div>
                                    ),
                                    width: 150,
                                },
                            ]}
                            rows={formattedOptions}
                            pageSize={10}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: Object.fromEntries(
                                        columns.map((column) => [
                                            column.field,
                                            !column.hide // Ensure columns with `hide` false are visible
                                        ])
                                    ),
                                },
                            }}
                        />
                    </Paper>
                </Grid2>
            </Box>

        </>
    )
}

export default AssignApps
