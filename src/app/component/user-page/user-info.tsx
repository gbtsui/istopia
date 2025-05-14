"use client";

import {User} from "@/generated/prisma";

type UserInfoComponentProps = {
    user: User;
}

export default function UserInfoComponent(props: UserInfoComponentProps) {
    const {user} = props
    return (
        <div>
            <h1>{user.name}</h1>
            <h2>{user.display_name}</h2>
        </div>
    )
}