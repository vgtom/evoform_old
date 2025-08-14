-- AlterTable
ALTER TABLE "fields" ADD COLUMN     "coverImageId" TEXT;

-- AddForeignKey
ALTER TABLE "fields" ADD CONSTRAINT "fields_coverImageId_fkey" FOREIGN KEY ("coverImageId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
