import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('G', 356, 16.0, 49, 3.9),
  createData('i', 356, 16.0, 49, 3.9),
  createData('n', 356, 16.0, 49, 3.9),
  createData('erbread', 356, 16.0, 49, 3.9),
  createData('  rbread', 356, 16.0, 49, 3.9),
];

const DashboardTable = ({tableData}) => {

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Weir Name</TableCell>
            <TableCell align="right">Step 1 Score</TableCell>
            <TableCell align="right">Step 2 Score</TableCell>
            <TableCell align="right">Stage 1 Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row) => (
            <TableRow
              key={row[2]}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row[2]}
              </TableCell>
              <TableCell align="right">{row[15]}</TableCell>
              <TableCell align="right">{row[16]}</TableCell>
              <TableCell align="right">{row[17]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DashboardTable;