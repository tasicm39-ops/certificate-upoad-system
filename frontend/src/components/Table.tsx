import {
    Checkbox,
    Link as MuiLink,
    Table as MuiTable,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material'
import { Certificate } from '../types'

type TableProps = {
    certificates: Certificate[]
    selectedIds: number[]
    onCheckboxChange: (id: number) => void
}

function Table({ certificates, selectedIds, onCheckboxChange }: TableProps) {
    return (
        <TableContainer component={Paper} elevation={1}>
            <MuiTable>
                <TableHead>
                    <TableRow>
                        <TableCell>Select</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Provider</TableCell>
                        <TableCell>Issued At</TableCell>
                        <TableCell>Expires At</TableCell>
                        <TableCell>File</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {certificates.map((certificate) => (
                        <TableRow key={certificate.id}>
                            <TableCell>
                                <Checkbox
                                    checked={selectedIds.includes(certificate.id)}
                                    onChange={() => onCheckboxChange(certificate.id)}
                                />
                            </TableCell>

                            <TableCell>{certificate.name}</TableCell>
                            <TableCell>{certificate.provider}</TableCell>
                            <TableCell>
                                {new Date(certificate.issued_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                {certificate.expires_at
                                    ? new Date(certificate.expires_at).toLocaleDateString()
                                    : '-'}
                            </TableCell>
                            <TableCell>
                                <MuiLink
                                    href={`http://localhost:8080/api/v1/certificates/download/${certificate.filename}`}
                                    underline="hover"
                                >
                                    Download
                                </MuiLink>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </MuiTable>
        </TableContainer>
    )
}

export default Table
