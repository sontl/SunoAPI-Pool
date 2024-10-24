-- CreateTable
CREATE TABLE "Cookie" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'VALID',
    "dateUpdated" TIMESTAMP(3) NOT NULL,
    "creditsLeft" INTEGER NOT NULL DEFAULT 0,
    "monthlyUsage" INTEGER NOT NULL DEFAULT 0,
    "monthlyLimit" INTEGER NOT NULL DEFAULT 0,
    "account" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Cookie_pkey" PRIMARY KEY ("id")
);
