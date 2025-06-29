-- CreateTable
CREATE TABLE "Save" (
    "id" TEXT NOT NULL,
    "bucket_id" TEXT NOT NULL,
    "piece_id" TEXT NOT NULL,

    CONSTRAINT "Save_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaveBucket" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "SaveBucket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Save" ADD CONSTRAINT "Save_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "SaveBucket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Save" ADD CONSTRAINT "Save_piece_id_fkey" FOREIGN KEY ("piece_id") REFERENCES "Piece"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaveBucket" ADD CONSTRAINT "SaveBucket_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
