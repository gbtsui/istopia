"use client";

import {getSession} from "next-auth/react";
import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import {Session} from "next-auth";
import Image from "next/image";

export default function Navbar() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const result = await getSession()
            if (!result) {
                return
            }
            setSession(result)
            setLoading(false)
        }
        init().then(() => {})
    }, [])
    return (
        <div className={"sticky p-5 m-3 bg-charred-espresso flex flex-row justify-end gap-10 items-center rounded-xl"}>
            <Link href="/browse">browse</Link>
            {
                !loading ? (
                    session ?
                        <ProfilePictureDropdown image_url={session.user?.image as string}
                                                username={session.user?.name as string}/>
                        :
                        <Link className={"p-3 bg-dark-mocha text-creamed-latte rounded-xl"} href="/signin">
                            sign in
                        </Link>
                ) : (
                    <div className={"p-3 bg-dark-mocha text-creamed-latte rounded-xl"}>loading...</div>
                )
            }

        </div>
    )


}

type ProfilePictureDropdownProps = {
    image_url: string,
    username: string,
}

export function ProfilePictureDropdown(props: ProfilePictureDropdownProps) {
    const [open, setIsOpen] = useState<boolean>(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            console.log("click detected")
            console.log(dropdownRef.current)
            //console.log(dropdownRef.current.contains(event.target as Node))
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        console.log("event listener added")
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    return (
        <>
            <button onClick={() => setIsOpen(!open)}>
                <div className={"relative w-20 h-20 cursor-pointer"}>
                    <Image
                        src={props.image_url ? props.image_url : "https://qwdqjithytndumgsklyb.supabase.co/storage/v1/object/public/pfp/default/default.png"}
                        alt={"pfp"} fill={true} className={"rounded-full object-cover"}/>
                </div>
            </button>
            {open && (
                <div className="absolute mt-24 min-w-[200px] bg-white border rounded-md shadow-lg z-50">
                    <div className={"p-1 text-black"}>
                        <Link href={`/u/${props.username}`}>profile</Link>
                    </div>
                    <div className={"p-1 text-black"}>
                        <Link href={`/dashboard`}>dashboard</Link>
                    </div>
                </div>
            )}
        </>
    )

}

// profile
// dashboard
// settings