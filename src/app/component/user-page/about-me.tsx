"use client";

import { PublicUser } from "@/app/types";

export default function AboutMe({
                                    user,
                                }: {
    user: PublicUser;
}) {

    console.log(user)
    return user.about_me ? (
        <>
            {user.about_me.split("\n").map((line, id) =>
                line === "" ? <br key={id} /> : <p key={id}>{line}</p>
            )}
        </>
    ) : (
        <p>This user doesn't have an about me... yet!</p>
    );
}