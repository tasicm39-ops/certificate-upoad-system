export type Certificate = {
    id: number
    name: string
    provider: string
    issued_at: string
    expires_at?: string | null
    filename: string
}
