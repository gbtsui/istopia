//DATABASE DATABASE IM LIVING IN THE DATABASE WOAH OH
//THE WALL OF PURE FICTION'S CRACKING IN MY HEAD
//AND THE ADDICTION OF MY WORLD STILL SPREADS
//IN THE DATABASE DATABASE
//IM STRUGGLING IN THE DATABASE WOAH OH
//IT DOESNT EVEN MATTER IF THERE IS NO HOPE
//AS THE MADNESS OF THE SYSTEM GROWS

import {PrismaClient} from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({});

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}