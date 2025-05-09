"use client"

import {SessionProvider, useSession} from "next-auth/react";
import LoggedInChecker from "@/app/component/testing/logged-in-checker";

export default function Page() {
    return (
        <SessionProvider>
            <LoggedInChecker />
        </SessionProvider>
    )
}