-- CreateTable
CREATE TABLE "Config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "globalId" INTEGER NOT NULL,
    CONSTRAINT "Config_globalId_fkey" FOREIGN KEY ("globalId") REFERENCES "Global" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Global" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "darkMode" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "Config_name_key" ON "Config"("name");
