import React, { useEffect, useState } from "react";
import { useBaseURL } from "../../Context/BaseURLProvider";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, TableSortLabel
} from "@mui/material";
import axios from "axios";

const AccidentLongTable = () => {
    const BASE_URL = useBaseURL();
    const [data, setData] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [typesAndReasons, setTypesAndReasons] = useState([]);

    const fetchData = async (url, params = {}) => {
        try {
            const response = await axios.get(url, {
                params,
                withCredentials: true,
            });
            const { Status, Result, Error } = response.data;
            console.log('Response:', response.data);
            if (Status) {
                return response.data || [];
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
        const url = `${BASE_URL}/accident/get_accident_records`;
        const result = await fetchData(url);
        // console.log(result.vehicles);
        setData(result.records);
        setVehicles(result.vehicles);
        setTypesAndReasons(result.typesAndReasons);
    };

    const groupedReasons = typesAndReasons.reduce((acc, item) => {
        if (!item?.accident_type || !item?.accident_reason) return acc;
        if (!acc[item.accident_type]) acc[item.accident_type] = [];
        if (!acc[item.accident_type].includes(item.accident_reason)) {
            acc[item.accident_type].push(item.accident_reason);
        }
        return acc;
    }, {});



    useEffect(() => {
        fetchVehicles();
    }, []);


    const renderTableHeader = () => (
        <TableHead>
            <TableRow >
                <TableCell rowSpan="3">सि.नं.</TableCell>
                <TableCell rowSpan="3">मिति</TableCell>
                <TableCell rowSpan="3">समय</TableCell>
                <TableCell rowSpan="3">स्थान</TableCell>
                <TableCell rowSpan="3">सडक</TableCell>
                <TableCell rowSpan="3">ठाउको नाम</TableCell>

                <TableCell colSpan={vehicles.length + 1} >सवारी साधन</TableCell>
                <TableCell colSpan={Object.keys(groupedReasons).reduce((acc, type) =>
                    acc + groupedReasons[type].length, 0)}>दुर्घटनाको कारण
                </TableCell>
            </TableRow>

            <TableRow>
                {vehicles.map(v => <TableCell key={v} rowSpan={2}>{v}</TableCell>)}
                <TableCell rowSpan={2}>जम्मा</TableCell>
                {Object.keys(groupedReasons).map((type, i) => (
                    <TableCell key={`${type}-${i}`} colSpan={groupedReasons[type].length}>{type}</TableCell>
                ))}
            </TableRow>

            <TableRow>

                {/* {Object.keys(groupedReasons).flatMap(type =>
                    groupedReasons[type].map(reason => <th key={reason}>{reason}</th>)
                    )} */}
                {Object.entries(groupedReasons).map(([type, reasons], i) => (
                    <React.Fragment key={`${type}-${i}`}>
                        {reasons.map((reason, j) => (
                            <TableCell key={`${type}-${reason}-${j}`}>{reason}</TableCell>
                        ))}
                    </React.Fragment>
                ))}


            </TableRow>
        </TableHead>
    );

    const renderTableRows = () => {
        const grouped = {};

        data.forEach(item => {
            const key = `${item.date}-${item.accident_time}-${item.location}`;
            if (!grouped[key]) {
                grouped[key] = {
                    date: item.date,
                    state: item.state,
                    district: item.district,
                    municipality: item.municipality,
                    ward: item.ward,
                    road_name: item.road_name,
                    accident_location: item.accident_location,
                    accident_time: item.accident_time,
                    death_male: item.death_male,
                    death_female: item.death_female,
                    death_boy: item.death_boy,
                    death_girl: item.death_girl,
                    death_total: item.death_total,

                    gambhir_male: item.gambhir_male,
                    gambhir_female: item.gambhir_female,
                    gambhir_boy: item.gambhir_boy,
                    gambhir_girl: item.gambhir_girl,
                    gambhir_total: item.gambhir_total,

                    general_male: item.general_male,
                    general_female: item.general_female,
                    general_boy: item.general_boy,
                    general_girl: item.general_girl,
                    general_total: item.general_total,

                    animal_death: item.animal_death,
                    animal_injured: item.animal_injured,
                    remarks: item.remarks,
                    office_id: item.office_id,
                    created_by: item.created_by,
                    updated_by: item.updated_by,

                    location: item.location,
                    vehicles: {},

                    reasons: {}
                };
            }

            grouped[key].vehicles[item.vehicle_name] = item.count;
            grouped[key].reasons[item.accident_reason] = item.count;
        });
        // const total_vehicle = Object.values(row.vehicles || {}).reduce((sum, count) => sum + count, 0)      

        return Object.values(grouped).map((row, index) => (
            <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.accident_time}</TableCell>
                <TableCell>{row.accident_location}</TableCell>
                <TableCell>{row.road_name}</TableCell>
                <TableCell>{row.location}</TableCell>
                {vehicles.map(v => (
                    <TableCell key={v}>{row.vehicles[v] || 0}</TableCell>
                ))}
                <TableCell>{Object.values(row.vehicles || {}).reduce((sum, count) => sum + count, 0)}</TableCell>

                {Object.entries(groupedReasons).map(([type, reasons], i) => (
                    <React.Fragment key={`${type}-${i}`}>
                        {reasons.map((reason, j) => (
                            <TableCell key={`${type}-${reason}-${j}`}>{row.reasons[reason] || 0}</TableCell>
                        ))}
                    </React.Fragment>
                ))}
                {/* <TableCell>{Object.values(row.reasons || {}).reduce((sum, count) => sum + count, 0)}</TableCell> */}
            </TableRow>
        ));
    };

    return (
        <>
            <TableContainer component={Paper} >
                <Table border={1} textAlign="center" size="small" stickyHeader>
                    {renderTableHeader()}
                    <TableBody>
                        {renderTableRows()}
                    </TableBody>
                </Table>
            </TableContainer>


        </>
    )
}

export default AccidentLongTable
