"use server";

import Link from "next/link";
import GetUserSession from "@/app/api/data/user-management/get-user-session";

export default async function Home(){
    const user = await GetUserSession()

    return (
        <>
            <div className={"relative"}>
                <div className={"top-0 h-screen flex flex-col items-center justify-center gap-7"}>
                    <div className={"text-center items-center flex gap-8"}>
                        <h1 className={"text-6xl"}>istopia</h1>
                        <h2 className={"text-xl text-gray-300"}>write beyond your words.</h2>
                        {/*
                        SHOW ME THE SOUND DON'T LET IT FADE AWAYYYYYYYYYYYYYYYYYYYY
                        I CAN SEE YOU CAME FROM FAR AWAY
                        THE FACT THAT WE WOULD MEET IT MUST BE FATE
                        FAR ACROSS THE OCEAN'S WATERS DREAMING FOR ESCAPE
                        FAINTLY
                        A HIDDEN LIGHT
                        THAT IS LOST INSIDE YOUR EYES
                        YEARNING FOR A CHANCE TO BURN BRIGHT
                        */}
                    </div>
                    <div>
                        {
                            user?
                                <Link className={"px-5 py-3 rounded-xl bg-white text-black hover:text-white hover:bg-gray-700 transition-all"} href={"/signin"}>sign in.</Link>
                            :
                                <Link className={"px-5 py-3 rounded-xl bg-white text-black hover:text-white hover:bg-gray-700 transition-all"} href={"/dashboard"}>dashboard</Link>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}