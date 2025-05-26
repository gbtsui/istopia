"use client";

import {getSession} from "next-auth/react";
import Link from "next/link";
import {useEffect, useState} from "react";
import {Session} from "next-auth";
import Image from "next/image";

export default function Navbar() {
    const [session, setSession] = useState<Session | null>(null);
    useEffect(() => {
        const init = async () => {
            const result = await getSession()
            if (!result) {
                return
            }
            setSession(result)
        }
        init()
    }, [])
    return (
        <div className={"sticky p-5 m-3 bg-gray-800 flex flex-row justify-end gap-10 items-center rounded-xl"}>
            <Link href="/browse">browse</Link>
            {session ?
                <div className={"relative w-24 h-24"}>
                    <Image
                        src={session.user?.image ? session.user.image as string : "https://qwdqjithytndumgsklyb.supabase.co/storage/v1/object/public/pfp/default/default.png"}
                        alt={"pfp"}  fill={true} className={"rounded-3xl"}/>
                </div>
                :
                <Link className={"p-3 bg-white text-black rounded-xl"} href="/signin">sign in</Link>
            }
        </div>
    )


}