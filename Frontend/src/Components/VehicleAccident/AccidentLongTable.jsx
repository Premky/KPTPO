import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import axios from "axios";
import { useBaseURL } from "../../Context/BaseURLProvider";

// Fallback for missing CustomSortLabel
const CustomSortLabel = ({ columnKey, label }) => label;

const AccidentTable = ({
    // sortedRows = [],
    order,
    orderBy,
    handleSort,
    vehicles = [],
    accidentTypes,
    accidentReasons = [],
    accReasons = [],
    totalAccidentCount = 0,
}) => {
    const BASE_URL = useBaseURL();
    const [formattedOptions, setFormattedOptions] = useState([]);

    // Fetch data with error handling
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

    const [vehicleCount, setVehicleCount] = useState(0);
    const [vehicleList, setVehicleList] = useState([]);
    const fetchVehicles = async () => {
        const url = `${BASE_URL}/public/get_vehicles`;
        const result = await fetchData(url);

        const formatted = result.map(opt => ({
            label: opt.name_np,
            value: opt.id
        }));

        setVehicleList(formatted);
        setVehicleCount(formatted.length);
        console.log("Formatted:", formatted);
    };

    const [accidentRecords, setAccidentRecords] = useState([]);
    const [reasonTypes, setReasonTypes] = useState([]); // <-- new state

    const fetchAccidentRecords = async () => {
        const url = `${BASE_URL}/accident/get_accident_records`;
        try {
            const response = await axios.get(url, {
                withCredentials: true,
            });

            console.log(response); // optional: inspect full response

            const { Status, data, reasonTypes, Error } = response.data;

            if (Status) {
                setAccidentRecords(data);        // set accident records
                setFormattedOptions(data);
                setReasonTypes(reasonTypes);     // set reason types
                console.log('Records:', data);
                console.log('Reason Types:', reasonTypes);
            } else {
                console.error(Error || 'Failed to fetch records');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('An error occurred while fetching data.');
        }
    };


    useEffect(() => {
        fetchAccidentRecords();
        fetchVehicles();
    }, []);  // Fetch accident records on component mount

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
    const sortedRows = [...formattedOptions].sort(getComparator(order, orderBy));
    return (
        <TableContainer component={Paper}>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell rowSpan={3} align="center">
                            <CustomSortLabel columnKey="sn" label="सि.नं." order={order} orderBy={orderBy} onSort={handleSort} />
                        </TableCell>
                        <TableCell rowSpan={3} align="center">
                            <CustomSortLabel columnKey="date" label="मिति" order={order} orderBy={orderBy} onSort={handleSort} />
                        </TableCell>
                        <TableCell rowSpan={3} align="center">
                            <CustomSortLabel columnKey="accident_time" label="समय" order={order} orderBy={orderBy} onSort={handleSort} />
                        </TableCell>
                        <TableCell rowSpan={3} align="center">
                            <CustomSortLabel columnKey="road_name" label="सडकको नाम" order={order} orderBy={orderBy} onSort={handleSort} />
                        </TableCell>
                        <TableCell rowSpan={3} align="center">
                            <CustomSortLabel columnKey="location" label="स्थान" order={order} orderBy={orderBy} onSort={handleSort} />
                        </TableCell>
                        <TableCell align="center" colSpan={vehicleCount + 1}>
                            सवारी दुर्घटनामा संलग्न सवारी साधनहरु
                        </TableCell>
                        <TableCell colSpan={18} align="center">
                            मानव घाइते
                        </TableCell>
                        <TableCell align="center" rowSpan={2} colSpan={2}>
                            चौपाया
                        </TableCell>
                        <TableCell align="center" colSpan={6}>
                            दुर्घटनाको समय
                        </TableCell>
                        <TableCell align="center" colSpan={totalAccidentCount + 1}>
                            सवारी दुर्घटनाको कारण
                        </TableCell>
                        <TableCell rowSpan={3} align="center">
                            सवारी साधन क्षेती
                        </TableCell>
                        <TableCell rowSpan={3} align="center">
                            अनुमानित रकम
                        </TableCell>
                        <TableCell rowSpan={3} align="center">
                            कसरी सदु भएको
                        </TableCell>
                        <TableCell rowSpan={3} align="center">
                            कैफियत
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        {vehicles.map((vehicle, index) => (
                            <TableCell key={index} align="center" rowSpan={2}>
                                {vehicle.label}
                            </TableCell>
                        ))}
                        {vehicleList.map((v, i) => (
                            <TableCell key={`vehicle-${i}`} align="center">
                                {v.label}
                            </TableCell>
                        ))}
                        <TableCell align="center" rowSpan={2}>
                            कुल
                        </TableCell>

                        {["मृ", "महि", "बा", "बालि", "अन्य", "जम"].map((label, i) => (
                            <TableCell key={`death-${i}`} align="center">
                                {label}
                            </TableCell>
                        ))}
                        {["मृ", "महि", "बा", "बालि", "अन्य", "जम"].map((label, i) => (
                            <TableCell key={`gambhir-${i}`} align="center">
                                {label}
                            </TableCell>
                        ))}
                        {["मृ", "महि", "बा", "बालि", "अन्य", "जम"].map((label, i) => (
                            <TableCell key={`general-${i}`} align="center">
                                {label}
                            </TableCell>
                        ))}
                        {["००ः०६/१२ः००", "१२ः००/१८ः००", "१८ः००/२४ः००", "२४ः००/०६ः००", "समय नखुलेको", "जम्मा"].map((label, i) => (
                            <TableCell key={`time-${i}`} align="center">
                                {label}
                            </TableCell>
                        ))}
                        {accidentReasons.map((reason, index) => (
                            <TableCell key={index} align="center">
                                {reason.name_np}
                            </TableCell>
                        ))}
                        <TableCell align="center">
                            जम्मा
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedRows.map((row, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.accident_date}</TableCell>
                            <TableCell>{row.accident_time}</TableCell>
                            <TableCell>
                                {row.municipality_np}, {row.district_np}
                            </TableCell>
                            <TableCell>{row.accident_location}</TableCell>
                            {vehicles.map((vehicle) => (
                                <TableCell key={vehicle.value} align="center">                                    
                                    {/* {row.vehicle_names?.includes(vehicle.label) ? "✓" : ""} */}
                                </TableCell>
                            ))}
                            <TableCell align="center">{row.vehicle_names?.length || 0}</TableCell>
                            {["death_male", "death_female", "death_boy", "death_girl", "death_other", "fatalities", "gambhir_male", "gambhir_female", "gambhir_boy", "gambhir_girl", "gambhir_other", "gambhir", "general_male", "general_female", "general_boy", "general_girl", "general_other", "general"].map((key) => (
                                <TableCell key={key} align="center">{row[key]}</TableCell>
                            ))}
                            <TableCell align="center">{row.animal_injured}</TableCell>
                            <TableCell align="center">{row.animal_death}</TableCell>

                            {/* Time categorization */}
                            {["00:06", "12:00", "18:00", "24:00", "06:00"].map((time, i, arr) => (
                                <TableCell key={i} align="center">
                                    {row.accident_time > arr[i - 1] && row.accident_time <= time ? 1 : ""}
                                </TableCell>
                            ))}
                            <TableCell align="center">1</TableCell>

                            {accReasons.map((reason) => (
                                <TableCell key={reason.value} align="center">
                                    {row.reason_names?.includes(reason.label) ? "✓" : ""}
                                </TableCell>
                            ))}
                            <TableCell align="center">{row.reason_names?.length || 0}</TableCell>
                            <TableCell align="center">{row.vehicle_damage}</TableCell>
                            <TableCell align="center">{row.damage_amount}</TableCell>
                            <TableCell align="center">{row.settlement}</TableCell>
                            <TableCell align="center">{row.note}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </TableContainer>
    );
};

export default AccidentTable;
