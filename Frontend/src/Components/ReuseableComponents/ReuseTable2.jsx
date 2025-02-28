import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Button, Paper } from "@mui/material";

const ReusableTable = ({ columns, rows, height, showEdit, showDelete, onEdit, onDelete, export: enableExport }) => {

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

  // 🔹 Export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const tableHeaders = columns.map(col => col.headerName);
    const tableRows = rows.map(row => columns.map(col => row[col.field]));

    doc.autoTable({
      head: [tableHeaders],
      body: tableRows,
    });

    doc.save("table_data.pdf");
  };

  return (
    <div style={{ height, width: "100%" }}>
      {enableExport && (
        <div style={{ marginBottom: 10 }}>
          <Button variant="contained" color="primary" onClick={handleExportExcel} style={{ marginRight: 10 }}>
            Export to Excel
          </Button>
          <Button variant="contained" color="secondary" onClick={handleExportPDF}>
            Export to PDF
          </Button>
        </div>
      )}

      {/* Data Table */}
      <Paper sx={{ height: 400, width: '100%' }} style={{ overflowX: 'auto' }}>
  <DataGrid
    sx={{ border: 0 }}
    columns={[
      ...columns,
      {
        field: "actions",
        headerName: "Actions",
        renderCell: (params) => (
          <div>
            {showEdit && (
              <Button variant="contained" color="primary" size="small" onClick={() => onEdit(params.row)}>
                Edit
              </Button>
            )}
            {showDelete && (
              <Button variant="contained" color="secondary" size="small" onClick={() => onDelete(params.row.id)}>
                Delete
              </Button>
            )}
          </div>
        ),
        width: 150,
      },
    ]}
    rows={rows}
    pageSize={10}
  />
</Paper>

    </div>
  );
};

export default ReusableTable;
