"use server";

import UserInfoComponent from "@/app/component/user-page/user-info";
import UnknownUserPage from "@/app/component/user-page/unknown-user";
import {PublicUser} from "@/app/types";
import GetUserSession from "@/app/api/data/user-management/get-user-session";
import GetUserPublicData from "@/app/api/data/user-management/get-user-public-data";

export default async function UserPage({params}: {params: Promise<{username: string}>}) {
    const {username} = await params;

    const publicUser: PublicUser | null = await GetUserPublicData({name: username});
    if (!publicUser) {
        return <UnknownUserPage/>;
    }
    const session_user = await GetUserSession()
    const isLoggedInAsUser: boolean = session_user? session_user.name === publicUser.name : false

    return (
        <UserInfoComponent user={publicUser} isLoggedInAsUser={isLoggedInAsUser}/>
    )
}