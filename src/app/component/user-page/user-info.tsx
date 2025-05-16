"use client";

import {PublicUser} from "@/app/types";
import {useState} from "react";
import UpdateUserPublicData from "@/app/api/data/user-management/update-public-user-data"

type UserInfoComponentProps = {
    user: PublicUser;
    isLoggedInAsUser: boolean;
}

export default function UserInfoComponent(props: UserInfoComponentProps) {
    const {user, isLoggedInAsUser} = props
    const [editingModeEnabled, setEditingModeEnabled] = useState(false);

    const updateUser = (data: FormData)=> {
        //do something here wait
    }

    return (
        <div>
            <form>
                <div className={"p-3 m-5 bg-gray-800 rounded-xl flex flex-row justify-between"}>
                    <div>
                        <h1 className={"text-xl text-gray-400 w-sm"}>{user.name}</h1>
                        {editingModeEnabled ?
                            <form>
                                <h2>
                                    <input className={"text-xl p-0.5 my-0.5 rounded-md bg-gray-600"}
                                           type={"text"}
                                           defaultValue={user.display_name}
                                           placeholder={"what do you want people to call you?"}/>
                                </h2>
                                <h3>
                                    <input className={"text-md p-0.5 my-0.5 rounded-md bg-gray-600"}
                                           type={"text"}
                                           defaultValue={user.summary_text as string}
                                           placeholder={"who are you?"}/>
                                </h3>
                            </form>
                            :
                            <>
                                <h2 className={"text-2xl"}>{user.display_name}</h2>
                                <h3 className={"text-lg text-gray-400"}>{user.summary_text}</h3>
                            </>
                        }
                    </div>
                    {isLoggedInAsUser ?
                        <button onClick={() => setEditingModeEnabled(!editingModeEnabled)}>Edit
                            Mode</button> : null}
                    <div>
                        <p>User
                            since {user.created_at.getDate()}.{user.created_at.getMonth()}.{user.created_at.getFullYear()}</p>
                    </div>
                </div>

                <div className={"p-3 m-5 bg-gray-800 rounded-xl w-1/2"}>
                    <p>{user.about_me ? user.about_me : "This user doesn't have an about me... yet!"}</p>
                </div>
            </form>
        </div>
    )
}