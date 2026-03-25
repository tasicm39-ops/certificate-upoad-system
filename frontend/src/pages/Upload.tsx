import { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material'

function Upload() {
    const [name, setName] = useState('')
    const [provider, setProvider] = useState('')
    const [issuedAt, setIssuedAt] = useState('')
    const [expiresAt, setExpiresAt] = useState('')
    const [file, setFile] = useState<File | null>(null)

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name || !provider || !issuedAt || !file) {
            alert('Fill all required fields and choose a file')
            return
        }
        if (expiresAt && new Date(expiresAt) < new Date(issuedAt)) {
            alert('Expiry date cannot be before issued date')
            return
        }

        const formData = new FormData()
        formData.append('name', name)
        formData.append('provider', provider)
        formData.append('issued_at', issuedAt)

        if (expiresAt) {
            formData.append('expires_at', expiresAt)
        }

        formData.append('file', file)

        try {
            await axios.post('http://localhost:8080/api/v1/certificates/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            setName('')
            setProvider('')
            setIssuedAt('')
            setExpiresAt('')
            setFile(null)

            alert('Certificate uploaded successfully')
        } catch (error: any) {
            console.error('Upload error:', error.response?.data || error.message || error)
            alert('Upload failed')
        }
    }

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Upload Certificate
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleUpload}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <TextField
                        label="Certificate Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Provider"
                        value={provider}
                        onChange={(e) => setProvider(e.target.value)}
                        fullWidth
                    />

                    <TextField
                        label="Issued Date"
                        type="date"
                        value={issuedAt}
                        onChange={(e) => setIssuedAt(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                            min: '1900-01-01',
                            max: '2100-12-31',
                        }}
                        fullWidth
                    />

                    <TextField
                        label="Expiry Date"
                        type="date"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                            min: issuedAt || '1900-01-01',
                            max: '2100-12-31',
                        }}
                        fullWidth
                    />

                    <Button variant="outlined" component="label">
                        {file ? file.name : 'Choose File'}
                        <input
                            type="file"
                            hidden
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                    </Button>

                    <Button type="submit" variant="contained" size="large">
                        Upload Certificate
                    </Button>

                    <Button component={Link} to="/list" variant="text">
                        Go to List
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}

export default Upload
