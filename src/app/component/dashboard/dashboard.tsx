"use server"

import {DatabaseUser, PublicUser} from "@/app/types";
import Link from "next/link";
import {Suspense} from "react";
import UserPiecesList from "@/app/component/dashboard/user-pieces-list";
import {redirect} from "next/navigation";
import GetUserData from "@/app/api/data/user-management/get-user-data";
import UserHistoryList from "@/app/component/dashboard/user-history-list";

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
        <div className={"bg-dark-mocha flex w-full gap-3 justify-evenly items-center"}>
            <div className={"text-center p-5 w-1/4 bg-charred-espresso rounded-xl flex flex-col gap-6"}>
                {/*header and stuff goes here :)*/}
                <div>
                    <h1 className={"text-3xl"}>dashboard</h1>
                    <h1>Welcome back, {user.display_name}.</h1>
                </div>
                <div>
                    <Link href={`/u/${username}`} className={"p-3 rounded-xl bg-golden-brew text-ashen-americano hover:bg-dark-mocha hover:text-creamed-latte transition-all"}>view your profile</Link>
                </div>
            </div>
            <div className={"text-center p-3 w-1/3 bg-charred-espresso self-start rounded-xl flex flex-col gap-6"}>
                <h1 className={"text-xl font-bold mb-3 text-center"}>your pieces</h1>
                <Suspense fallback={<div>loading pieces...</div>}>
                    <UserPiecesList user={user as PublicUser} is_user={true}/>
                </Suspense>
                <Link href={"/editor/create"} className={"p-2 hover:bg-golden-brew bg-dark-mocha hover:text-ashen-americano transition-all rounded-xl"}>+ create new</Link>
            </div>

            <div className={"p-3 w-1/3 bg-charred-espresso text-center self-start rounded-xl flex flex-col gap-6"}>
                <h1 className={"text-xl font-bold mb-3"}>keep reading</h1>
                <Suspense fallback={<div>loading history...</div>}>
                    <UserHistoryList user={user as PublicUser} is_user={true}/>
                </Suspense>
            </div>
        </div>
    )
}