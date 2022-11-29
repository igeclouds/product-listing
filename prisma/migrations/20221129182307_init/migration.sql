/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "globalsId" INTEGER NOT NULL,
    CONSTRAINT "Config_globalsId_fkey" FOREIGN KEY ("globalsId") REFERENCES "Globals" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Globals" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "darkMode" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "Config_name_key" ON "Config"("name");
