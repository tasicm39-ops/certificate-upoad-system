import React, { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

type Certificate = {
    id: number
    name: string
    provider: string
    issued_at: string
    expires_at?: string | null
    filename: string
    filePath: string
}

function App() {
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [name, setName] = useState('')
    const [provider, setProvider] = useState('')
    const [issuedAt, setIssuedAt] = useState('')
    const [expiresAt, setExpiresAt] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const handleDownloadAll = () => {
        window.open('http://localhost:8080/api/v1/certificates/download-all', '_blank')
    }
    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) {
            alert('Izaberi bar jedan sertifikat')
            return
        }

        try {
            console.log('selectedIds:', selectedIds)

            const response = await fetch(
                'http://localhost:8080/api/v1/certificates/delete-selected',
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ids: selectedIds,
                    }),
                },
            )

            const data = await response.json()
            console.log('delete response:', data)

            if (!response.ok) {
                alert(data.error || 'Greška pri brisanju')
                return
            }

            await getCertificates()
            setSelectedIds([])
            alert('Uspešno obrisano')
        } catch (error) {
            console.error('delete error:', error)
            alert('Delete request failed')
        }
    }
    const getCertificates = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/v1/certificates/getall')
            setCertificates(res.data || [])
        } catch (error) {
            console.error('Fetch certificates error:', error)
        }
    }

    useEffect(() => {
        getCertificates()
    }, [])

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name || !provider || !issuedAt || !file) {
            alert('Popuni obavezna polja i izaberi fajl')
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
            await axios.post('http://localhost:8080/api/v1/certificates/create', formData)

            setName('')
            setProvider('')
            setIssuedAt('')
            setExpiresAt('')
            setFile(null)

            await getCertificates()
            alert('Sertifikat uspešno dodat')
        } catch (error) {
            console.error('Upload error:', error)
            alert('Greška pri upload-u')
        }
    }
    const handleCheckboxChange = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
        )
    }

    return (
        <div className="app-container">
            <div className="app-header">
                <h1>Certificate Upload System</h1>
                <div className="logo-box">CERT APP</div>
            </div>

            <form onSubmit={handleUpload} className="form-card">
                <div className="form-grid">
                    <div className="form-group full-width">
                        <label>Certificate Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter certificate name"
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Provider</label>
                        <input
                            type="text"
                            value={provider}
                            onChange={(e) => setProvider(e.target.value)}
                            placeholder="Enter provider"
                        />
                    </div>

                    <div className="form-group">
                        <label>Issued Date</label>
                        <input
                            type="date"
                            value={issuedAt}
                            onChange={(e) => setIssuedAt(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Expiry Date</label>
                        <input
                            type="date"
                            value={expiresAt}
                            onChange={(e) => setExpiresAt(e.target.value)}
                        />
                    </div>

                    <div className="form-group full-width">
                        <label>Certificate File</label>
                        <input
                            type="file"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                        />
                    </div>
                </div>

                <div className="actions">
                    <button type="submit" className="upload-btn">
                        Upload Certificate
                    </button>

                    <button type="button" className="upload-btn" onClick={handleDownloadAll}>
                        Download All
                    </button>

                    <button type="button" className="delete-btn" onClick={handleDeleteSelected}>
                        Delete Selected
                    </button>
                </div>
            </form>

            <h2 className="section-title">Certificates ({certificates.length})</h2>
            <div className="table-wrapper"></div>
            <table>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Name</th>
                        <th>Provider</th>
                        <th>Issued At</th>
                        <th>Expires At</th>
                        <th>File</th>
                    </tr>
                </thead>
                <tbody>
                    {certificates.length > 0 ? (
                        certificates.map((certificate) => (
                            <tr key={certificate.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(certificate.id)}
                                        onChange={() => handleCheckboxChange(certificate.id)}
                                    />
                                </td>
                                <td>{certificate.name}</td>
                                <td>{certificate.provider}</td>
                                <td>{new Date(certificate.issued_at).toLocaleDateString()}</td>
                                <td>
                                    {certificate.expires_at
                                        ? new Date(certificate.expires_at).toLocaleDateString()
                                        : '-'}
                                </td>
                                <td>
                                    <a
                                        href={`http://localhost:8080/uploads/${certificate.filename}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Download
                                    </a>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6}>
                                <div className="empty-state">No certificates uploaded yet.</div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default App
