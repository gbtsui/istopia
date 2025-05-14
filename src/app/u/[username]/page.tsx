"use server";

//import {use, useEffect, useState} from "react";
import {User} from "@/generated/prisma";
import GetUserData from "@/app/api/data/user-management/get-user-data";
import UserInfoComponent from "@/app/component/user-page/user-info";
import UnknownUserPage from "@/app/component/user-page/unknown-user";

export default async function UserPage({params}: {params: Promise<{username: string}>}) {
    const {username} = await params;
    //const [loading, setLoading] = useState(true);

    let user: User | null = await GetUserData(username);
    if (!user) {
        return <UnknownUserPage/>;
    }
    /*
    useEffect(() => {
        const initialize = async () => {
            user = await GetUserData(username)
            if (!user) {
                return notFound()
            }
            setLoading(false);
        }
        initialize();
    }, []);
     */


    //if (loading) {
    //    return <div>Loading...</div>;
    //}

    return (
        <div>
            <UserInfoComponent user={user} />
        </div>
    )
}