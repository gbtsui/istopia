"use server"

import Link from "next/link";
import GetUserSession from "@/app/api/data/user-management/get-user-session";
import {redirect} from "next/navigation";
import Dashboard from "@/app/component/dashboard/dashboard";
import {Suspense} from "react";

export default async function DashboardPage() {
    const user = await GetUserSession()
    if (!user) {
        redirect("/signin");
    }

    return (
        <Suspense fallback={<div>"loading..."</div>}>
            <Dashboard username={user.name as string}/>
        </Suspense>
    )
}

//centuries fly but the flame is still alive