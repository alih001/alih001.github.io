import React, { useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import XLSX from 'xlsx';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

export default function GroupOrientation() {
  const [tableData, setTableData] = useState([]);

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xls,.xlsx';
    input.onchange = handleFileChange;
    input.click();
  };

  const buttons = [
    <Button key="one" onClick={handleUploadClick}>Upload Data</Button>,
    <Button key="two">Save Data</Button>,
  ];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Update the state with the sheet data
      setTableData(sheetData);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          '& > *': {
            m: 1,
          },
        }}
      >
        <ButtonGroup
          orientation="vertical"
          aria-label="vertical contained button group"
          variant="contained"
        >
          {buttons}
        </ButtonGroup>
      </Box>

      <Box>
        <Table>
          <TableHead>
            <TableRow>
              {tableData.length > 0 &&
                Object.keys(tableData[0]).map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              row.hiddenColumn !== true && (
                <TableRow key={index}>
                  {Object.values(row).map((cellValue, cellIndex) => (
                    <TableCell key={cellIndex}>{cellValue}</TableCell>
                  ))}
                </TableRow>
              )
            ))}
          </TableBody>
        </Table>
      </Box>
    </div>
  );
}
