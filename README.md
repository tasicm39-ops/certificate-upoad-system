# Certificate Upload System

A full-stack web application that allows users to upload, manage, download, and delete certificates.

---

## Features

- Upload certificates (PDF, PNG, JPEG)
- Display all certificates in a table
- Download individual certificates
- Download all certificates as a ZIP file
- Delete selected certificates (bulk delete)

---

## Tech Stack

- Frontend: React + TypeScript
- Backend: Node.js + Express + TypeScript
- Database: Prisma + SQLite
- File Upload: Multer
- ZIP Export: Archiver

---

## Getting Started

### Prerequisites

- Node.js >= v20
- npm

---

### 1. Backend Setup

cd backend
npm install

# Run database migrations

npm run db:migrate
npm run db:push

# Generate Prisma client

npx prisma generate

# Start backend server

npm start

# Frontend setup

cd frontend
npm install

# Start fontend

npm start

Project Structure
backend/
├── controllers/
├── routes/
├── middleware/
├── uploads/
├── prisma/

frontend/
├── src/
├── components/

# Notes

Backend runs on: http://localhost:8080⁠
Frontend runs on: http://localhost:3000⁠
