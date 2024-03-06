import React from 'react'
import { Form } from 'react-bootstrap';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { WeirPackageForm } from '../../types/public-types';

const PackageForm: React.FC<WeirPackageForm> = ({ tableParsedData, selectedWeirs, handleCheckboxChange }) => {
    return(
        <Form>
            <Table>
                <TableHead>
                    <TableRow>
                    <TableCell>Select</TableCell>
                    <TableCell>Weir Name</TableCell>
                    <TableCell>Cat 1 Score</TableCell>
                    <TableCell>Step 1 Score</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tableParsedData.map(data => (
                    <TableRow key={data['Weir']}>
                        <TableCell>
                        <Form.Check
                            type="checkbox"
                            checked={selectedWeirs.includes(data['Weir'])}
                            onChange={() => handleCheckboxChange(data['Weir'])}
                        />
                        </TableCell>
                        <TableCell>{data['Weir']}</TableCell>
                        <TableCell>{data['Category (I) Score']}</TableCell>
                        <TableCell>{data['Step (I) Score']}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Form>
    )
}

export default PackageForm;