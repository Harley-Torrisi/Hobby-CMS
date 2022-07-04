import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

export interface TableViewDataRow
{
    data: string[],
    event?: {
        selector: string
        onSelectEvent: (selector: string) => void
    }
}

interface TableViewProps
{
    headers?: string[]
    data: TableViewDataRow[]
}

export const TableView = ({ headers, data }: TableViewProps) =>
{
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    return (
        <TableContainer component={Paper}>
            <Table>
                {headers &&
                    <TableHead>
                        <TableRow>
                            {headers.map((header, i) =>
                                <StyledTableCell key={i}>{header}</StyledTableCell>
                            )}
                        </TableRow>
                    </TableHead>
                }
                <TableBody>
                    {data.map((rowSet, i) =>
                        <StyledTableRow
                            hover key={i}
                            onClick={() => rowSet.event?.onSelectEvent(rowSet.event.selector)}
                            sx={{
                                '&:hover': {
                                    cursor: 'pointer'
                                }
                            }}
                        >
                            {rowSet.data.map((rowItem, i) =>
                                <StyledTableCell key={i}>{rowItem}</StyledTableCell>
                            )}
                        </StyledTableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer >
    )
}