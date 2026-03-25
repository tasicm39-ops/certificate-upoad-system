📄 Certificate Manager

Full-stack web application for managing certificates with file upload and download functionality.

🚀 Features
Upload certificates with file storage
View all certificates in a table
Delete selected certificates (bulk delete)
Download individual certificates
Download all certificates as ZIP
MySQL database integration
Clean UI using Material UI
🛠️ Tech Stack
Backend
Node.js
Express
Prisma ORM
MySQL
Multer (file upload)
Archiver (ZIP export)
Frontend
React
TypeScript
Material UI
⚙️ Setup

1. Clone project
   git clone <your-repo-url>
   cd project
2. Backend setup
   cd backend
   npm install

Create .env file:

DATABASE_URL="mysql://app_user:App123%21@localhost:3306/certificate_db"

Run migrations:

npx prisma migrate dev --name init

Start backend:

npm run dev

3. Frontend setup
   cd frontend
   npm install
   npm start
   📌 Notes
   Files are stored locally in /uploads
   Database uses MySQL instead of SQLite for scalability
   Dedicated DB user is used instead of root for security

👤 Author

Milos
