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
    const [loading, setLoading] = useState(false);

    const updateUser = (data: FormData) => {
        const update = async () => {
            setLoading(true);
            const newUserData: PublicUser = {
                name: user.name,
                display_name: data.get("display_name") as string,
                summary_text: data.get("summary_text") as string,
                about_me: data.get("about_me") as string,
            }

            await UpdateUserPublicData(newUserData);
            setLoading(false);
            setEditingModeEnabled(false);
        }
        update()
    }

    if (loading) {
        //add loading behavior here
    }

    return (
        <div className={"relative"}>
            <form action={updateUser}>
                <div className={"p-3 m-5 bg-gray-800 rounded-xl flex flex-row justify-between"}>
                    <div>
                        <h1 className={"text-xl text-gray-400 w-sm"}>{user.name}</h1>
                        {editingModeEnabled ?
                            <>
                                <h2>
                                    <input className={"text-xl p-0.5 my-0.5 rounded-md bg-gray-600 outline-0"}
                                           name={"display_name"}
                                           type={"text"}
                                           defaultValue={user.display_name}
                                           placeholder={"what do you want people to call you?"}
                                           required/>
                                </h2>
                                <h3>
                                    <input className={"text-md p-0.5 my-0.5 rounded-md bg-gray-600 outline-0"}
                                           name={"summary_text"}
                                           type={"text"}
                                           defaultValue={user.summary_text as string}
                                           placeholder={"who are you?"}/>
                                </h3>
                            </>
                            :
                            <>
                                <h2 className={"text-2xl"}>{user.display_name}</h2>
                                <h3 className={"text-lg text-gray-400"}>{user.summary_text}</h3>
                            </>
                        }
                    </div>
                    <div>
                        <p>User
                            since {user.created_at?.getDate()}.{user.created_at?.getMonth()}.{user.created_at?.getFullYear()}</p>
                    </div>
                </div>

                <div className={"p-3 m-5 bg-gray-800 rounded-xl w-1/2"}>
                    {editingModeEnabled ?
                        <textarea
                            className={"text-md p-2 w-full rounded-md bg-gray-600 min-h-screen"}
                            name={"about_me"}
                            defaultValue={user.about_me as string}
                            placeholder={"what do you want people to know about you?"}
                        ></textarea> //TODO: need to add length validation and stuff!
                        :
                        <>{user.about_me ? user.about_me.split("\n").map((line, id) => {
                            if (line === "") {
                                return <br key={id}/>
                            }
                            return <p key={id}>{line}</p>}
                        ) : <p>"This user doesn't have an about me... yet!"</p>}</>
                    }
                </div>
                {
                    editingModeEnabled ?
                        <div className={"absolute bottom-0 right-0"}>
                            <input type={"submit"}
                                   className={"p-4 mx-5 bg-gray-200 text-black rounded-xl hover:bg-gray-500 transition-all"}
                                   name={"save"} value={"save"}/>
                        </div>
                        :
                        null
                }
                {isLoggedInAsUser && !editingModeEnabled ?
                    <button type="button" className={"absolute bottom-0 right-0 p-4 mx-5 bg-gray-200 text-black rounded-xl hover:bg-gray-500 transition-all"} onClick={() => setEditingModeEnabled(!editingModeEnabled)}>
                        Edit Profile
                    </button> : null}
            </form>
        </div>
    )
}