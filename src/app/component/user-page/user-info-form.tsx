"use client";

import { PublicUser } from "@/app/types";
import { useState } from "react";
import Image from "next/image";
import UploadTempPfp from "@/app/api/data/user-management/upload-temp-pfp";
import { MakePfpPermanent } from "@/app/api/data/user-management/make-pfp-permanent";
import UpdateUserPublicData from "@/app/api/data/user-management/update-public-user-data";

type Props = {
    user: PublicUser;
    isLoggedInAsUser: boolean;
};

export default function UserInfoForm({
                                         user,
                                         isLoggedInAsUser,
                                     }: Props) {
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
            };

            await UpdateUserPublicData(newUserData);
            if (previewImageUrl) {
                await MakePfpPermanent(previewImageUrl, user.name as string);
            }
            setLoading(false);
            setEditingModeEnabled(false);
        };

        update();
    };

    return (
        <form action={updateUser} className="flex flex-col">
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row gap-3 items-center">
                    <div className="relative w-24 h-24">
                        <Image
                            src={
                                previewImageUrl ??
                                user.profile_picture_link ??
                                "https://qwdqjithytndumgsklyb.supabase.co/storage/v1/object/public/pfp/default/default.png"
                            }
                            alt="pfp"
                            fill
                            className="rounded-3xl"
                        />
                        {editingModeEnabled && (
                            <input
                                type="file"
                                name="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={async (e) => {
                                    setLoading(true);
                                    if (!e.target.files) return;
                                    const file = e.target.files[0];
                                    if (file) {
                                        const { url } = await UploadTempPfp(
                                            file,
                                            user.name as string
                                        );
                                        setPreviewImageUrl(url);
                                    }
                                    setLoading(false);
                                }}
                            />
                        )}
                    </div>

                    <div>
                        {editingModeEnabled ? (
                            <>
                                <h2>
                                    <input
                                        className="text-xl p-0.5 my-0.5 rounded-md bg-dark-mocha text-london-fog outline-0"
                                        name="display_name"
                                        type="text"
                                        defaultValue={user.display_name ?? user.name}
                                        placeholder="display name"
                                        required
                                    />
                                </h2>
                                <h3>
                                    <input
                                        className="text-md p-0.5 my-0.5 rounded-md bg-dark-mocha text-london-fog outline-0"
                                        name="summary_text"
                                        type="text"
                                        defaultValue={user.summary_text as string}
                                        placeholder="summary text"
                                    />
                                </h3>
                            </>
                        ) : (
                            <>
                                <h1 className="text-xl text-london-fog">{user.name}</h1>
                                <h2 className="text-2xl">{user.display_name}</h2>
                                <h3 className="text-lg text-london-fog">{user.summary_text}</h3>
                            </>
                        )}
                    </div>
                </div>

                <div>
                    <p>
                        User since{" "}
                        {user.created_at?.getDate()}.
                        {user.created_at?.getMonth()}.
                        {user.created_at?.getFullYear()}
                    </p>
                </div>
            </div>

            {/* About Me Editing */}
            {editingModeEnabled && (
                <div className="p-3 mt-4 bg-charred-espresso rounded-xl w-full">
          <textarea
              className="text-md p-2 w-full rounded-md bg-ashen-americano min-h-[10rem]"
              name="about_me"
              defaultValue={user.about_me as string}
              placeholder="What do you want people to know about you?"
          ></textarea>
                </div>
            )}

            {editingModeEnabled && (
                <div className="fixed bottom-4 right-4">
                    <input
                        type="submit"
                        className="p-4 bg-gray-200 text-black rounded-xl hover:bg-golden-brew transition-all"
                        name="save"
                        value="save"
                    />
                </div>
            )}

            {isLoggedInAsUser && !editingModeEnabled && (
                <button
                    type="button"
                    className="fixed bottom-4 right-4 p-4 bg-gray-200 text-black rounded-xl hover:bg-golden-brew transition-all"
                    onClick={() => setEditingModeEnabled(!editingModeEnabled)}
                >
                    Edit Profile
                </button>
            )}
        </form>
    );
}