import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Box, Button, Container, Paper, Stack, Typography } from '@mui/material'
import Table from '../components/Table'
import { Certificate } from '../types'

function List() {
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [search, setSearch] = useState('')

    const getCertificates = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/v1/certificates/getall')
            setCertificates(res.data || [])
        } catch (error) {
            console.error('Fetch certificates error:', error)
        }
    }

    const handleCheckboxChange = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
        )
    }

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) {
            alert('Select at least one certificate')
            return
        }

        try {
            await axios.delete('http://localhost:8080/api/v1/certificates/delete-selected', {
                data: { ids: selectedIds },
            })

            alert('Selected certificates deleted successfully')
            setSelectedIds([])
            getCertificates()
        } catch (error) {
            console.error('Delete error:', error)
            alert('Delete failed')
        }
    }

    const handleDownloadAll = () => {
        window.open('http://localhost:8080/api/v1/certificates/download-all', '_blank')
    }

    useEffect(() => {
        getCertificates()
    }, [])
    const filteredCertificates = certificates.filter(
        (cert: any) =>
            cert.name.toLowerCase().includes(search.toLowerCase()) ||
            cert.provider.toLowerCase().includes(search.toLowerCase()),
    )

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Certificate List
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                    <Button component={Link} to="/upload" variant="outlined">
                        Go to Upload
                    </Button>

                    <Button variant="contained" color="error" onClick={handleDeleteSelected}>
                        Delete Selected
                    </Button>

                    <Button variant="contained" onClick={handleDownloadAll}>
                        Download All
                    </Button>
                </Stack>

                <Box sx={{ overflowX: 'auto' }}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ marginBottom: '10px', padding: '5px' }}
                    />
                    <Table
                        certificates={filteredCertificates}
                        selectedIds={selectedIds}
                        onCheckboxChange={handleCheckboxChange}
                    />
                </Box>
            </Paper>
        </Container>
    )
}

export default List
