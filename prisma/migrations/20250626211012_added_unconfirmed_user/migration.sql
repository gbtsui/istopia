-- CreateTable
CREATE TABLE "UnconfirmedUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "confirmationCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UnconfirmedUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnconfirmedUser_email_key" ON "UnconfirmedUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UnconfirmedUser_confirmationCode_key" ON "UnconfirmedUser"("confirmationCode");
