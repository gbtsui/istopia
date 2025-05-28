//DATABASE DATABASE IM LIVING IN THE DATABASE WOAH OH
//THE WALL OF PURE FICTION'S CRACKING IN MY HEAD
//AND THE ADDICTION OF MY WORLD STILL SPREADS
//IN THE DATABASE DATABASE
//IM STRUGGLING IN THE DATABASE WOAH OH
//IT DOESNT EVEN MATTER IF THERE IS NO HOPE
//AS THE MADNESS OF THE SYSTEM GROWS

import {PrismaClient} from "@/generated/prisma";
import {createServerClient} from "@supabase/ssr";
import {cookies} from "next/headers";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({});

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export const createSupabaseServerClient = async () => {
    const cookie_store = await cookies()
    return createServerClient(
        process.env.SUPABASE_URL as string,
        process.env.SUPABASE_ANON_KEY as string,
        {
            cookies: {
                getAll() {
                    return cookie_store.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({name, value, options}) =>
                            cookie_store.set(name, value, options)
                        )
                    } catch (err) {
                        console.error(err)
                    }
                }
            }
        }
    )
}

//USSE USSE USSEEWA
