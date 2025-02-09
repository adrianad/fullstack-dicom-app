import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, TableSortLabel, Button
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { format } from 'date-fns';

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
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<keyof FileData>('idFile');

    useEffect(() => {
        setLoading(true);
        axios.post('http://localhost:4000/graphql', {
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

    const handleRequestSort = (property: keyof FileData) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const sortedFiles = files.sort((a, b) => {
        if (orderBy === 'idFile') {
            return (a.idFile < b.idFile ? -1 : 1) * (order === 'asc' ? 1 : -1);
        }
        return 0;
    });

    const paginatedFiles = sortedFiles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

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
                                    <a href={`http://localhost:5000/download/${file.filePath}`} download>
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
                                        onClick={() => onViewImage(`wadouri:http://localhost:5000/download/${file.filePath}`)}
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