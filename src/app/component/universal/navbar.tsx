"use client";

import {getSession} from "next-auth/react";
import Link from "next/link";
import {useEffect, useState} from "react";
import {Session} from "next-auth";

export default function Navbar() {
    const [user, setUser] = useState<Session | null>(null);
    useEffect(() => {
        const init = async () => {
            const result = await getSession()
            if (!result) {
                return
            }
            setUser(result)
        }
        init()
    }, [])
    return (
        <div className={"sticky p-5 m-3 bg-gray-800 flex flex-row justify-end gap-10 items-center rounded-xl"}>
            <Link href="/browse">browse</Link>
            {user ?
                <div>signed in!</div>
                :
                <Link className={"p-3 bg-white text-black rounded-xl"} href="/signin">sign in</Link>
            }
        </div>
    )


}