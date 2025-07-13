"use client";

import {PublicUser} from "@/app/types";
import {useState} from "react";
import UpdateUserPublicData from "@/app/api/data/user-management/update-public-user-data"
import Image from "next/image";
import UploadTempPfp from "@/app/api/data/user-management/upload-temp-pfp";
import {MakePfpPermanent} from "@/app/api/data/user-management/make-pfp-permanent";

type UserInfoComponentProps = {
    user: PublicUser;
    isLoggedInAsUser: boolean;
}

export default function UserInfoComponent(props: UserInfoComponentProps) {
    const {user, isLoggedInAsUser} = props
    const [editingModeEnabled, setEditingModeEnabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

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
            if (previewImageUrl) {
                const pfp_permanence_result = await MakePfpPermanent(previewImageUrl, user.name as string)
                console.log(pfp_permanence_result)
            }
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
                <div className={"p-3 m-5 bg-charred-espresso rounded-xl flex flex-row justify-between"}>
                    <div className={"flex flex-row justify-start gap-3 items-center"}>
                        <div className={"relative w-24 h-24"}>
                            <Image
                                src={previewImageUrl ?? user.profile_picture_link ?? "https://qwdqjithytndumgsklyb.supabase.co/storage/v1/object/public/pfp/default/default.png"}
                                alt={"pfp"} fill={true} className={"rounded-3xl"}/>
                            {editingModeEnabled &&
                                <div>
                                    <input type={"file"} name={"file"} accept="image/*"
                                           className={"absolute inset-0 opacity-0 cursor-pointer"}
                                           onChange={async (e) => {
                                               setLoading(true)
                                               if (!e.target.files) {
                                                   return
                                               }
                                               const file = e.target.files[0];
                                               if (file) {
                                                   const {url} = await UploadTempPfp(file, user.name as string)
                                                   setPreviewImageUrl(url)
                                                   console.log(url)
                                               }
                                               console.log("image uploaded!")
                                               setLoading(false)
                                           }}/>
                                </div>
                            }
                        </div>
                        <div>
                            {editingModeEnabled ?
                                <>
                                    <h2>
                                        <input className={"text-xl p-0.5 my-0.5 rounded-md bg-dark-mocha text-london-fog outline-0"}
                                               name={"display_name"}
                                               type={"text"}
                                               defaultValue={user.display_name ?? user.name}
                                               placeholder={"display name"}
                                               required/>
                                    </h2>
                                    <h3>
                                        <input className={"text-md p-0.5 my-0.5 rounded-md bg-dark-mocha text-london-fog outline-0"}
                                               name={"summary_text"}
                                               type={"text"}
                                               defaultValue={user.summary_text as string}
                                               placeholder={"summary text"}/>
                                    </h3>
                                </>
                                :
                                <>
                                    <h1 className={"text-xl text-london-fog"}>{user.name}</h1>
                                    <h2 className={"text-2xl"}>{user.display_name}</h2>
                                    <h3 className={"text-lg text-london-fog"}>{user.summary_text}</h3>
                                </>
                            }
                        </div>
                    </div>
                    <div>
                        <p>User
                            since {user.created_at?.getDate()}.{user.created_at?.getMonth()}.{user.created_at?.getFullYear()}</p>
                    </div>
                </div>

                <div className={"p-3 m-5 bg-charred-espresso rounded-xl w-1/2"}>
                    {editingModeEnabled ?
                        <textarea
                            className={"text-md p-2 w-full rounded-md bg-ashen-americano min-h-screen"}
                            name={"about_me"}
                            defaultValue={user.about_me as string}
                            placeholder={"what do you want people to know about you?"}
                        ></textarea> //TODO: need to add length validation and stuff!
                        :
                        <>{user.about_me ? user.about_me.split("\n").map((line, id) => {
                                if (line === "") {
                                    return <br key={id}/>
                                }
                                return <p key={id}>{line}</p>
                            }
                        ) : <p>"This user doesn't have an about me... yet!"</p>}</>
                    }
                </div>
                {
                    editingModeEnabled ?
                        <div className={"fixed bottom-4 right-4"}>
                            <input type={"submit"}
                                   className={"p-4 bg-gray-200 text-black rounded-xl hover:bg-golden-brew transition-all"}
                                   name={"save"} value={"save"}/>
                        </div>
                        :
                        null
                }
                {isLoggedInAsUser && !editingModeEnabled ?
                    <button type="button"
                            className={"fixed bottom-4 right-4 p-4 bg-gray-200 text-black rounded-xl hover:bg-golden-brew transition-all"}
                            onClick={() => setEditingModeEnabled(!editingModeEnabled)}>
                        Edit Profile
                    </button> : null}
            </form>
        </div>
    )
}