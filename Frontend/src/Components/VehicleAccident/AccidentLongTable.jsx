import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, TableSortLabel
} from "@mui/material";
import axios from "axios";

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

const CustomSortLabel = ({ columnKey, label, order, orderBy, onSort }) => (
    <TableSortLabel
        active={orderBy === columnKey}
        direction={orderBy === columnKey ? order : "asc"}
        onClick={() => onSort(columnKey)}
    >
        {label}
    </TableSortLabel>
);

export default function AccidentLongTable() {
    const BASE_URL = localStorage.getItem('BASE_URL');

    const [accidentRecords, setAccidentRecords] = useState([]);
    const [formattedOptions, setFormattedOptions] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [vehicleCount, setVehicleCount] = useState([]);
    const [accidentTypes, setAccidentTypes] = useState([]);

    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const fetchData = async (url, params = {}) => {
        try {
            const response = await axios.get(url, {
                params,
                withCredentials: true,
            });
            const { Status, Result, Error } = response.data;
    
            if (Status) {
                return Result || [];
            } else {
                console.error(Error || 'Failed to fetch records');
                return [];
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching data.');
            return [];
        }
    };
    

    const fetchVehicles = async () => {
        const url = `${BASE_URL}/public/get_vehicles`;
        fetchData(url, {}, (Result) => {
            const formatted = Result.map(opt => ({
                label: opt.name_np,
                value: opt.id
            }));
            setVehicles(formatted);
            setVehicleCount(formatted.length);
        });
    };

    const fetchAccidentRecords = () => {
        fetchData(`${BASE_URL}/accident/get_accident_records`, {}, (result) => {
            const formatted = result.map((item, index) => ({
                ...item,
                id: item.id || index,
                sn: index + 1,
                vehicle_names: item.vehicles?.map(v => v.name_np).join(', ') || ''
            }));
            setFormattedOptions(formatted);
            setAccidentRecords(result);
        });
    };

    const [accidentReasons, setAccidentReasons] = useState([]);
    const [accidentReasonCount, setAccidentReasonCount] = useState([]);
    const fetchAccidentReasons = () => {
        fetchData(`${BASE_URL}/public/get_accident_reasons`, {}, setAccidentReasons);
        // console.log('Accident Reasons:', accidentReasons);
        accidentReasons.forEach((reason, index ) => {
            // console.log('Accident Reason:',reason.reason_type, reason.name_np);
            setAccidentReasonCount((prev) => [...prev, reason.name_np]);
            
        });
    };

    const fetchAccidentTypes = () => {
        fetchData(`${BASE_URL}/public/get_accident_types`, {}, setAccidentTypes);
        console.log('Accident Types:', accidentTypes);
    };

    useEffect(() => {
        const fetchDataAsync = async () => {
            const reasons = await fetchData(`${BASE_URL}/public/get_accident_reasons`);
            const types = await fetchData(`${BASE_URL}/public/get_accident_types`);
            const vehicles = await fetchData(`${BASE_URL}/public/get_vehicles`);
            const records = await fetchData(`${BASE_URL}/accident/get_accident_records`);
    
            setAccidentReasons(reasons);
            setAccidentTypes(types);
            setVehicles(vehicles.map(opt => ({
                label: opt.name_np,
                value: opt.id
            })));
            setVehicleCount(vehicles.length);
    
            const formatted = records.map((item, index) => ({
                ...item,
                id: item.id || index,
                sn: index + 1,
                vehicle_names: item.vehicles?.map(v => v.name_np).join(', ') || ''
            }));
            setFormattedOptions(formatted);
            setAccidentRecords(records);
    
            const reasonTypeCount = types.map((type) => {
                const count = reasons.filter(reason => reason.reason_type === type.id).length;
                return {
                    type_id: type.id,
                    type_name: type.name_np,
                    count: count
                };
            });
            setAccidentReasonCount(reasonTypeCount);
            // console.log('Accident Reason Count:', reasonTypeCount);
        };
    
        fetchDataAsync();
    }, []);
    
    const totalAccidentCount = accidentTypes.reduce((sum, type) => sum + type.count, 0);

    useEffect(() => {
        fetchVehicles();
        fetchAccidentRecords();
        fetchAccidentTypes();
        fetchAccidentReasons();
    }, []);    

    const sortedRows = [...formattedOptions].sort(getComparator(order, orderBy));

    return (
        <TableContainer component={Paper}>
            <Table size="small" border="1px solid #ccc" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell rowSpan={3}><CustomSortLabel columnKey="sn" label="सि.नं." order={order} orderBy={orderBy} onSort={handleSort} /></TableCell>
                        <TableCell rowSpan={3}><CustomSortLabel columnKey="date" label="मिति" order={order} orderBy={orderBy} onSort={handleSort} /></TableCell>
                        <TableCell rowSpan={3}><CustomSortLabel columnKey="accident_time" label="समय" order={order} orderBy={orderBy} onSort={handleSort} /></TableCell>
                        <TableCell rowSpan={3}><CustomSortLabel columnKey="road_name" label="सडकको नाम" order={order} orderBy={orderBy} onSort={handleSort} /></TableCell>
                        <TableCell rowSpan={3}><CustomSortLabel columnKey="location" label="स्थान" order={order} orderBy={orderBy} onSort={handleSort} /></TableCell>
                        <TableCell align="center" colSpan={vehicleCount + 1}>सवारी दुर्घटनामा संलग्न सवारी साधनहरु</TableCell>

                        <TableCell colSpan={18} align="center">मानव घाइते</TableCell>

                        <TableCell align="center" rowSpan={2} colSpan={2}>चौपाया</TableCell>
                        <TableCell align="center" colSpan={6}>दुर्घटनाको समय</TableCell>
                        
                        <TableCell align="center" colSpan={totalAccidentCount+1}> सवारी दुर्घटनाको कारण </TableCell>
                        <TableCell align="center" rowSpan={3}> सवारी साधन क्षेती </TableCell>
                        <TableCell align="center" rowSpan={3}> अनुमानित रकम </TableCell>
                        <TableCell align="center" rowSpan={3}> कसरी सदु भएको </TableCell>
                        <TableCell align="center" rowSpan={3}> कैफियत </TableCell>
                    </TableRow>

                    <TableRow>
                        {vehicles.map((vehicle, index) => (
                            <TableCell key={index} align="center" rowSpan={2}>{vehicle.label}</TableCell>
                        ))}
                        <TableCell align="center" rowSpan={2}>कुल</TableCell>
                        <TableCell align="center" colSpan={6}>मृत्यु</TableCell>
                        <TableCell align="center" colSpan={6}>गम्भिर घाइते</TableCell>
                        <TableCell align="center" colSpan={6}>सामान्य घाइते</TableCell>
                        <TableCell align="center" rowSpan={2}>००ः०६/१२ः००</TableCell>
                        <TableCell align="center" rowSpan={2}>००ः१२/१८ः००</TableCell>
                        <TableCell align="center" rowSpan={2}>००ः१८/००ः००</TableCell>
                        <TableCell align="center" rowSpan={2}>००ः००/०६ः००</TableCell>
                        <TableCell align="center" rowSpan={2}>समय नखुलेको</TableCell>
                        <TableCell align="center" rowSpan={2}>जम्मा</TableCell>
                        {accidentTypes.map((type, index) => (
                            <TableCell key={index} align="center" colSpan={type.count} >{type.name_np}</TableCell>
                        ))}
                        <TableCell align="center" rowSpan={2}>जम्मा</TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell align="center">पुरुष</TableCell>
                        <TableCell align="center">महिला</TableCell>
                        <TableCell align="center">बालक</TableCell>
                        <TableCell align="center">बालिका</TableCell>
                        <TableCell align="center">अन्य</TableCell>
                        <TableCell align="center">जम्मा</TableCell>
                        <TableCell align="center">पुरुष</TableCell>
                        <TableCell align="center">महिला</TableCell>
                        <TableCell align="center">बालक</TableCell>
                        <TableCell align="center">बालिका</TableCell>
                        <TableCell align="center">अन्य</TableCell>
                        <TableCell align="center">जम्मा</TableCell>
                        <TableCell align="center">पुरुष</TableCell>
                        <TableCell align="center">महिला</TableCell>
                        <TableCell align="center">बालक</TableCell>
                        <TableCell align="center">बालिका</TableCell>
                        <TableCell align="center">अन्य</TableCell>
                        <TableCell align="center">जम्मा</TableCell>
                        <TableCell align="center">घाइते</TableCell>
                        <TableCell align="center">मृत्यु</TableCell>
                        {accidentReasons.map((reason, index) => (
                            <TableCell key={index} align="center">{reason.name_np}</TableCell>
                        ))}
                    </TableRow>

                </TableHead>

                <TableBody>
                    {sortedRows.map((row, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{row.sn}</TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>{row.accident_time}</TableCell>
                            <TableCell>{row.municipality_np}, {row.district_np}</TableCell>
                            <TableCell>{row.accident_location}</TableCell>
                            {vehicles.map((vehicle) => (
                                <TableCell key={vehicle.value}>
                                    {row.vehicle_names.includes(vehicle.label) ? vehicle.label : ''}
                                </TableCell>
                            ))}
                            <TableCell>{/* Total count here */}</TableCell>
                            {/* Add more cells for human injuries, deaths, animals, etc. */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
