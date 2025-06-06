"use server"

import Link from "next/link";
import GetUserSession from "@/app/api/data/user-management/get-user-session";
import {redirect} from "next/navigation";

export default async function DashboardPage() {
    const user = await GetUserSession()
    if (!user) {
        redirect("/signin");
    }

    return (
        <div className={"text-center"}>
            <h1>welcome to the dashboard!</h1>
            <h2>currently sorting everything out right now since i have to ship this quickly haha</h2>
            <Link href={"/src/app/(pages)/(without-navbar)/editor/create"} className={"p-2 bg-gray-700 rounded-xl"}>create a piece here!</Link>
        </div>
    )
}