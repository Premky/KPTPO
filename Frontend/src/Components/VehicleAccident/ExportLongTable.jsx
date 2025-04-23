import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const exportLongTable = async (data, vehicles, groupedReasons) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Accidents");

    const mergedCells = new Set();

    const mergeSafe = (startRow, startCol, endRow, endCol) => {
        const key = `${startRow}:${startCol}-${endRow}:${endCol}`;
        if (!mergedCells.has(key)) {
            worksheet.mergeCells(startRow, startCol, endRow, endCol);
            mergedCells.add(key);
        }
    };

    // --- HEADER ROWS ---
    const firstRow = [];
    const secondRow = [];

    // Static fields
    const staticFields = [
        "सि.नं.", "मिति", "समय", "स्थान", "सडक", "ठाउँको नाम"
    ];
    firstRow.push(...staticFields);
    secondRow.push(...staticFields);

    // Vehicles
    firstRow.push("सवारी साधन");
    secondRow.push(...vehicles);
    let currentCol = staticFields.length + 1;
    mergeSafe(1, currentCol, 1, currentCol + vehicles.length - 1);
    currentCol += vehicles.length;

    // Total Vehicles
    firstRow.push("जम्मा");
    secondRow.push("जम्मा");
    mergeSafe(1, currentCol, 2, currentCol);
    currentCol++;

    const accidentTypes = ["मृत्यु", "गम्भिर", "साधारण"];
    for (let type of accidentTypes) {
        firstRow.push(type);
        secondRow.push("पुरुष", "महिला", "बालक", "बालिका", "जम्मा");
        mergeSafe(1, currentCol, 1, currentCol + 4);
        currentCol += 5;
    }

    // चौपाया
    firstRow.push("चौपाया मृत्यु", "चौपाया घाइते");
    secondRow.push("मृत्यु", "घाइते");
    mergeSafe(1, currentCol, 2, currentCol);
    mergeSafe(1, currentCol + 1, 2, currentCol + 1);
    currentCol += 2;

    // समय
    firstRow.push("समय");
    secondRow.push("00:06-12:00", "12:00-18:00", "18:00-00:00", "00:00-06:00", "समय नखुलेको", "जम्मा");
    mergeSafe(1, currentCol, 1, currentCol + 5);
    currentCol += 6;

    // Reasons
    Object.entries(groupedReasons).forEach(([type, reasons]) => {
        if (reasons.length > 1) {
            firstRow.push(type);
            secondRow.push(...reasons);
            mergeSafe(1, currentCol, 1, currentCol + reasons.length - 1);
            currentCol += reasons.length;
        } else {
            firstRow.push(type);
            secondRow.push(reasons[0]);
            mergeSafe(1, currentCol, 2, currentCol);
            currentCol++;
        }
    });

    // worksheet.addRow(firstRow);
    // worksheet.addRow(secondRow);

    // Add header rows to worksheet explicitly
    worksheet.insertRow(1, firstRow);
    worksheet.insertRow(2, secondRow);

    // --- DATA ROWS ---
    data.forEach((row, index) => {
        const time = row.accident_time || "";
        const timeSlots = [
            time > "00:06" && time < "12:00" ? 1 : 0,
            time > "12:00" && time < "18:00" ? 1 : 0,
            time > "18:00" && time < "23:59" ? 1 : 0,
            time > "00:00" && time < "00:06" ? 1 : 0,
            !time ? 1 : 0,
            1,
        ];

        const rowData = [
            index + 1,
            row.date,
            row.accident_time,
            row.accident_location,
            row.road_name,
            row.location,
            ...vehicles.map(v => row.vehicles?.[v] || 0),
            Object.values(row.vehicles || {}).reduce((a, b) => a + b, 0),
            row.death_male, row.death_female, row.death_boy, row.death_girl, row.death_total,
            row.gambhir_male, row.gambhir_female, row.gambhir_boy, row.gambhir_girl, row.gambhir_total,
            row.general_male, row.general_female, row.general_boy, row.general_girl, row.general_total,
            row.animal_death, row.animal_injured,
            ...timeSlots,
            ...Object.values(groupedReasons).flat().map(reason => row.reasons?.[reason] || 0)
        ];

        worksheet.addRow(rowData);
    });

    // --- EXPORT ---
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Accident_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
};

export default exportLongTable;
