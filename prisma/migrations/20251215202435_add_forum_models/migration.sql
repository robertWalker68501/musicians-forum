/*
  Warnings:

  - A unique constraint covering the columns `[forumId,slug]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `forumId` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Category_position_idx";

-- DropIndex
DROP INDEX "Category_slug_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "forumId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Forum" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Forum_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Forum_slug_key" ON "Forum"("slug");

-- CreateIndex
CREATE INDEX "Forum_position_idx" ON "Forum"("position");

-- CreateIndex
CREATE INDEX "Category_forumId_position_idx" ON "Category"("forumId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "Category_forumId_slug_key" ON "Category"("forumId", "slug");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_forumId_fkey" FOREIGN KEY ("forumId") REFERENCES "Forum"("id") ON DELETE CASCADE ON UPDATE CASCADE;
