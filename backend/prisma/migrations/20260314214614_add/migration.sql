/*
  Warnings:

  - Added the required column `filePath` to the `Certificate` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Certificate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "issued_at" DATETIME NOT NULL,
    "expires_at" DATETIME,
    "filename" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Certificate" ("createdAt", "expires_at", "filename", "id", "issued_at", "name", "provider", "updatedAt") SELECT "createdAt", "expires_at", "filename", "id", "issued_at", "name", "provider", "updatedAt" FROM "Certificate";
DROP TABLE "Certificate";
ALTER TABLE "new_Certificate" RENAME TO "Certificate";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
