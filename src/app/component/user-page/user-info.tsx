"use client";

import {PublicUser} from "@/app/types";

type UserInfoComponentProps = {
    user: PublicUser;
    isLoggedInAsUser: boolean;
}

export default function UserInfoComponent(props: UserInfoComponentProps) {
    const {user, isLoggedInAsUser} = props

    return (
        <div>
            <div className={"p-3 m-5 bg-gray-800 rounded-xl flex flex-row justify-between"}>
                <div>
                    <h1 className={"text-xl text-gray-400"}>{user.name}</h1>
                    <h2 className={"text-2xl"}>{user.display_name}</h2>
                    <h3 className={"text-lg text-gray-400"}>{user.summary_text}</h3>
                </div>
                <div>
                    <p>User
                        since {user.created_at.getDate()}.{user.created_at.getMonth()}.{user.created_at.getFullYear()}</p>
                </div>
            </div>
            <div className={"p-3 m-5 bg-gray-800 rounded-xl w-1/2"}>
                <p>{user.about_me ? user.about_me : "This user doesn't have an about me... yet!"}</p>
            </div>
            {isLoggedInAsUser ?? <p>is logged in as this user (add other stuff here later) (validate edits too)</p>}
        </div>
    )
}