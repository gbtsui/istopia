"use server";

import {User} from "../../../../../../../../../mnt/shared-data/Documents/istopia/src/generated/prisma";
import GetUserData from "@/app/api/data/user-management/get-user-data";
import UserInfoComponent from "@/app/component/user-page/user-info";
import UnknownUserPage from "@/app/component/user-page/unknown-user";
import {PublicUser} from "@/app/types";
import GetUserSession from "@/app/api/data/user-management/get-user-session";

export default async function UserPage({params}: {params: Promise<{username: string}>}) {
    const {username} = await params;

    const user: User | null = await GetUserData(username);
    if (!user) {
        return <UnknownUserPage/>;
    }
    const publicUser: PublicUser = {
        name: username,
        display_name: user.display_name,
        summary_text: user.summary_text,
        created_at: user.created_at,
        about_me: user.about_me
    }

    const session_user = await GetUserSession()
    const isLoggedInAsUser: boolean = session_user? session_user.name === user.name : false

    return (
        <UserInfoComponent user={publicUser} isLoggedInAsUser={isLoggedInAsUser}/>
    )
}