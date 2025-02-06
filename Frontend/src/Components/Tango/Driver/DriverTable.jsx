import React, { useEffect, useState } from "react";
import axios from "axios";
import ReusableTable from "../../ReuseableComponents/ReuseTable";


const DriverTable = () => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('token');
    const [formattedOptions, setFormattedOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const columns = [
        { field: "sn", headerName: "सि.नं." },
        { field: "vehicledistrict", headerName: "जिल्ला" },
        { field: "vehicle_name", headerName: "सवारी साधन", hide: true },
        { field: "vehicle_no", headerName: "गाडी नं." },
        { field: "start_route", headerName: "देखी" },
        { field: "end_route", headerName: "सम्म" },
        { field: "drivername", headerName: "चालक" },
        { field: "driverdob", headerName: "जन्म मिति" },
        { field: "country", headerName: "देश" },
        { field: "state", headerName: "प्रदेश" },
        { field: "district", headerName: "जिल्ला" },
        { field: "municipality", headerName: "स्थानिय तह" },
        { field: "driverward", headerName: "वडा नं." },
        { field: "driverfather", headerName: "चालकको बाबुको नाम" },
        { field: "lisence_no", headerName: "स.चा. अनुमती पत्र नं." },
        { field: "lisencecategory", headerName: "वर्ग" },
        { field: "driverctz_no", headerName: "नागरिकता नं." },
        { field: "ctz_iss", headerName: "जारी जिल्ला" },
        { field: "mentalhealth", headerName: "मानसिक स्वास्थ्य" },
        { field: "drivereye", headerName: "आँखा" },
        { field: "driverear", headerName: "कान" },
        { field: "drivermedicine", headerName: "औषधी सेवन कर्ता" },
        { field: "driverphoto", headerName: "फोटो" },
        { field: "remarks", headerName: "कैफियत" },
    ];

    const fetchDrivers = async () => {
        try {
            const url = `${BASE_URL}/driver/get_drivers`;
            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const { Status, Result, Error } = response.data;

            if (Status) {
                
                if (Array.isArray(Result) && Result.length > 0) {
                    const formatted = Result.map((opt, index) => ({
                        id: index + 1, // Adding a unique id property
                        sn: index + 1,
                        country: opt.country,
                        name_en: opt.name_en,

                        state_id: opt.state_id,
                        district_id: opt.district_id,
                        municipality_id: opt.municipality_id,
                        ward: opt.ward,
                        email: opt.email,
                        contact: opt.contact,
                        headoffice: opt.headoffice,
                    }));

                    setFormattedOptions(Result);
                } else {
                    console.log('No records found.');
                }
            } else {
                console.log(Error || 'Failed to fetch.');
            }
        } catch (error) {
            console.error('Error fetching records:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDrivers();
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

export default DriverTable;
