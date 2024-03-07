import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const DashboardTable = ({ tableData, sortRow }) => {
  // Skip the first row, sort by row[17], and limit to the top 10 items
  const sortedAndFilteredData = tableData.slice(1).sort((a, b) => b[sortRow] - a[sortRow]).slice(0, 10);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Weir Name</StyledTableCell>
            <StyledTableCell align="right">Step 1 Score</StyledTableCell>
            <StyledTableCell align="right">Step 2 Score</StyledTableCell>
            <StyledTableCell align="right">Stage 1 Score</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {sortedAndFilteredData.map((row, index) => (
            <StyledTableRow
              key={index} // Changed to index due to potential non-unique row[2]
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <StyledTableCell component="th" scope="row">
                {row[2]}
              </StyledTableCell>
              <StyledTableCell align="right">{row[15]}</StyledTableCell>
              <StyledTableCell align="right">{row[16]}</StyledTableCell>
              <StyledTableCell align="right">{row[17]}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DashboardTable;
