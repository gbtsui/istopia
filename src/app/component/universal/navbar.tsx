"use client";

import {getSession} from "next-auth/react";
import Link from "next/link";

export default function Navbar() {

    return (
        <div className={"sticky p-5 m-3 bg-gray-800 flex flex-row justify-end gap-10 items-center rounded-xl"}>
            <Link href="/browse">browse</Link>
            <Link className={"p-3 bg-white text-black rounded-xl"} href="/signin">sign in</Link>
        </div>
    )


}