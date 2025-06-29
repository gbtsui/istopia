"use server"

import {DatabaseUser, PublicUser} from "@/app/types";
import Link from "next/link";
import {Suspense} from "react";
import UserPiecesList from "@/app/component/dashboard/user-pieces-list";
import {redirect} from "next/navigation";
import GetUserData from "@/app/api/data/user-management/get-user-data";

type DashboardProps = {
    username: string;
}

export default async function Dashboard(props: DashboardProps) {
    const {username} = props;

    const user: DatabaseUser | null = await GetUserData({name: username});
    if (!user) {
        redirect("/signin");
    }

    return (
        <div>
            <div className={"text-center p-3 bg-gray-800 rounded"}>
                {/*header and stuff goes here :)*/}
                <h1 className={"text-3xl"}>dashboard</h1>
                <h1>Welcome back, {user.display_name}.</h1>
            </div>
            <div className={"w-full flex flex-row justify-evenly items-start gap-3 mt-5"}>
                <div className={"p-3 w-1/3 bg-gray-800 rounded-lg"}>
                    <h1 className={"text-xl font-bold mb-3"}>my pieces</h1>
                    <Suspense fallback={<div>loading pieces...</div>}>
                        <UserPiecesList user={user as PublicUser} is_user={true} />
                    </Suspense>
                    <Link href={"/editor/create"} className={"p-2 bg-gray-700 rounded-xl"}>+ create new</Link>
                </div>
                <div className={"p-3 w-1/3 bg-gray-800 rounded-lg grow"}>
                    <h1>keep reading</h1>
                    <p className={"text-gray-400 bg-gray-700 w-full h-full rounded-xl"}>coming soon</p>
                </div>
                <div className={"p-3 w-1/3 bg-gray-800 rounded-lg grow"}>
                    documentation
                    <p className={"text-gray-400 bg-gray-700 w-full h-full rounded-xl"}>coming soon</p>
                </div>
            </div>
        </div>
    )
}