"use client"
import {SessionProvider, useSession} from "next-auth/react";

export default function LoggedInChecker() {
    const {data: session, status} = useSession({
        required: true,
        onUnauthenticated: () => {
            console.log("Session is unauthenticated!");
        }
    });
    if (!session) {
        return <div>not logged in</div>
    }
    return (
        <div>logged in as {session?.user?.name}</div>
    )
}