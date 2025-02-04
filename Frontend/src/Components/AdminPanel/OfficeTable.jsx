import React, { useEffect, useState } from "react";
import axios from "axios";
import ReusableTable from "../ReuseableComponents/ReuseTable";

const OfficeTable = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');

    const columns = [
        { field: "id", headerName: "ID" },
        { field: "label", headerName: "First Name" },
        { field: "value", headerName: "Last Name" },
    ];

    const [formattedOptions, setFormattedOptions] = useState([]);

    const fetchCountry = async () => {
        try {
            const url = `${BASE_URL}/public/get_countries`;
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const { Status, Result, Error } = response.data;

            if (Status) {
                if (Array.isArray(Result) && Result.length > 0) {
                    const formatted = Result.map((opt, index) => ({
                        id: index + 1,
                        label: opt.name_np, // Use Nepali name
                        value: opt.id, // Use ID as value
                    }));
                    setFormattedOptions(formatted);
                } else {
                    console.log("No country records found.");
                }
            } else {
                console.log(Error || "Failed to fetch countries.");
            }
        } catch (error) {
            console.error("Error fetching records:", error);
        }
    };

    useEffect(() => {
        fetchCountry();
    }, []);

    // Functions for edit and delete
    const handleEdit = (row) => {
        console.log("Editing row:", row);
        // Add edit logic here
    };

    const handleDelete = (id) => {
        console.log("Deleting row with id:", id);
        // Add delete logic here
    };

    return (
        <ReusableTable
            columns={columns}
            rows={formattedOptions}
            height="800"
            showEdit={true}
            showDelete={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
        />
    );
};

export default OfficeTable;
