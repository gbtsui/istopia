"use server"

import { PublicUser } from "@/app/types";
import UserPiecesListWrapper from "@/app/component/user-page/user-pieces-list-wrapper";
import UserInfoForm from "@/app/component/user-page/user-info-form";
import AboutMe from "@/app/component/user-page/about-me";

export default async function UserInfoComponent({
                                              user,
                                              isLoggedInAsUser,
                                          }: {
    user: PublicUser;
    isLoggedInAsUser: boolean;
}) {
    return (
        <div className="relative">
            <div className="p-3 m-5 bg-charred-espresso rounded-xl">
                <UserInfoForm user={user} isLoggedInAsUser={isLoggedInAsUser} />
            </div>

            <div className="flex flex-row gap-6 justify-evenly w-full p-3">
                <div className="p-3 bg-charred-espresso rounded-xl w-1/2">
                    <AboutMe user={user} />
                </div>

                <div className="p-3 bg-charred-espresso rounded-xl w-1/2">
                    <UserPiecesListWrapper user={user} is_user={false} />
                </div>
            </div>
        </div>
    );
}

