import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, TableSortLabel, Button
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { format } from 'date-fns';

// Define the structure of the FileData interface
interface FileData {
    idFile: string;
    idSeries: string;
    filePath: string;
    series: {
        idStudy: string;
        idModality: string;
        name: string;
        date: string;
        study: {
            name: string;
            date: string;
            patient: {
                name: string;
                birthdate: string;
            };
        };
        modality: {
            name: string;
        };
    };
}

// Define styles for the table
const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    tableHeader: {
        backgroundColor: '#f5f5f5',
    },
    tableCell: {
        fontWeight: 'bold',
    },
});

// Define the props for the DataDisplay component
interface DataDisplayProps {
    updateTrigger: boolean;
    onViewImage: (imageId: string) => void;
}

const DataDisplay: React.FC<DataDisplayProps> = ({ updateTrigger, onViewImage }) => {
    const classes = useStyles();
    const [files, setFiles] = useState<FileData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');
    const [orderBy, setOrderBy] = useState<keyof FileData>('idFile');

    // Fetch data from the server when the component mounts or updateTrigger changes
    useEffect(() => {
        setLoading(true);
        axios.post("/graphql/", {
            query: `
                query Query {
                    getAllFiles {
                        idFile
                        idSeries
                        filePath
                        series {
                            idStudy
                            idModality
                            name
                            date
                            study {
                                name
                                date
                                patient {
                                    name
                                    birthdate
                                }
                            }
                            modality {
                                name
                            }
                        }
                    }
                }
            `
        }, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8'   // Ensures Apollo allows the request
            }
        })
            .then(response => {
                setFiles(response.data.data.getAllFiles);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });

    }, [updateTrigger]);

    // Handle sorting of the table columns
    const handleRequestSort = (property: keyof FileData) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Handle page change in the table pagination
    const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    // Handle rows per page change in the table pagination
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
    };

    // Sort the files based on the selected column and order
    const sortedFiles = files.sort((a, b) => {
        if (orderBy === 'idFile') {
            return (parseInt(a.idFile) < parseInt(b.idFile) ? -1 : 1) * (order === 'asc' ? 1 : -1);
        }
        return 0;
    });

    // Paginate the sorted files
    const paginatedFiles = sortedFiles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // Display loading message while data is being fetched
    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    // Display error message if there was an error fetching data
    if (error) {
        return <Typography>Error: {error}</Typography>;
    }

    return (
        <Paper>
            <TableContainer>
                <Table className={classes.table}>
                    <TableHead className={classes.tableHeader}>
                        <TableRow>
                            <TableCell sortDirection={orderBy === 'idFile' ? order : false}>
                                <TableSortLabel
                                    active={orderBy === 'idFile'}
                                    direction={orderBy === 'idFile' ? order : 'asc'}
                                    onClick={() => handleRequestSort('idFile')}
                                >
                                    ID File
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Series Name</TableCell>
                            <TableCell>Series Date</TableCell>
                            <TableCell>Study Name</TableCell>
                            <TableCell>Study Date</TableCell>
                            <TableCell>Patient Name</TableCell>
                            <TableCell>Patient Birthdate</TableCell>
                            <TableCell>Modality Name</TableCell>
                            <TableCell>File Path</TableCell>
                            <TableCell>View</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedFiles.map((file) => (
                            <TableRow key={file.idFile}>
                                <TableCell>{file.idFile}</TableCell>
                                <TableCell>{file.series.name}</TableCell>
                                <TableCell>{format(new Date(parseInt(file.series.date)), 'MM/dd/yyyy')}</TableCell>
                                <TableCell>{file.series.study.name}</TableCell>
                                <TableCell>{format(new Date(parseInt(file.series.study.date)), 'MM/dd/yyyy')}</TableCell>
                                <TableCell>{file.series.study.patient.name}</TableCell>
                                <TableCell>{file.series.study.patient.birthdate}</TableCell>
                                <TableCell>{file.series.modality.name}</TableCell>
                                <TableCell>
                                    <a href={`/files/download/${file.filePath}`} download>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                        >
                                            Download
                                        </Button>
                                    </a>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => onViewImage(`wadouri:/files/download/${file.filePath}`)}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={files.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};

export default DataDisplay;