import axios from 'axios';
import React, { useEffect, useState } from 'react'

import { useForm, Controller } from 'react-hook-form';
import ReusableTable from '../ReuseableComponents/ReuseTable';

const AccidentShortTable = () => {
    const BASE_URL = localStorage.getItem('BASE_URL');
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

    const [accidentRecords, setAccidentRecords] = useState([]); // State to manage accident records
    const [formattedOptions, setFormattedOptions] = useState([]);
    const fetchAccidentRecords = (data) => {
        const params = data || {};
        fetchData(`${BASE_URL}/accident/get_accident_records`, params, (result) => {
            const formatted = result.map((item, index) => ({
                ...item,
                id: item.id || index,
                sn: index + 1,
                vehicle_names: item.vehicles?.map(v => v.name_np).join(', ') || ''
            }));
            // console.log("Formatted Data:", formatted);
            setFormattedOptions(formatted);
            setAccidentRecords(result);
        });
    };

    const [vehiclesMap, setVehiclesMap] = useState({});



    useEffect(() => {        
        fetchAccidentRecords();
    }, []); // Fetch accident records on component mount

    //Table Columns
    const columns = [
        { field: "sn", headerName: "सि.नं." },
        { field: "date", headerName: "दुर्घटना मिति" },
        { field: "accident_time", headerName: "दुर्घटना समय" },
        { field: "district_np", headerName: "जिल्ला" },
        { field: "accident_location", headerName: "दुर्घटना स्थान" },
        { field: "road_name", headerName: "सडकको नाम" },
        { field: "casualties", headerName: "घाइतेको संख्या" },
        { field: "fatalities", headerName: "मृतकको संख्या" },
        { field: "vehicle_names", headerName: "सवारी साधन संलग्न" },
        { field: "remark", headerName: "कैफियत" },
    ]
    return (
        <>
            <ReusableTable
                columns={columns}
                rows={formattedOptions}
                height="800"
                // showEdit={true}
                // showDelete={true}
                // onEdit={handleEdit}
                // onDelete={handleDelete}
                enableExport={true}
            />
        </>
    )
}

export default AccidentShortTable
