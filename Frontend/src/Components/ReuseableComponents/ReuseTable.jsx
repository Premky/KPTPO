import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Grid2 } from "@mui/material";
// import Grid2 from "@mui/material/Unstable_Grid2"; // Use Grid2 for spacing

const ReusableTable = ({ columns, rows, height, showEdit, showDelete, onEdit, onDelete }) => {
    // Add the "Actions" column if edit or delete is enabled
    const enhancedColumns = [
        ...columns,
        (showEdit || showDelete) && {
            field: "actions",
            headerName: "Actions",
            renderCell: (params) => (
                <Grid2 container spacing={1}>
                    {showEdit && (
                        <Grid2 item>
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => onEdit(params.row)}
                            >
                                Edit
                            </Button>
                        </Grid2>
                    )}
                    {showDelete && (
                        <Grid2 item>
                            <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                onClick={() => onDelete(params.row.id)}
                            >
                                Delete
                            </Button>
                        </Grid2>
                    )}
                </Grid2>
            ),
            width: 200,
        },
    ].filter(Boolean); // Remove `false` values if neither button is enabled

    return (
        <div style={{ height: height, width: "100%" }}>
            <DataGrid rows={rows} columns={enhancedColumns}
               pageSize={5} 
               pageSizeOptions={[5, 10, 20, 50, 100]}
             />
        </div>
    );
};

export default ReusableTable;
