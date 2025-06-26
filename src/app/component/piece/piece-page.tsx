"use client";

import {PieceData} from "@/app/types";
import Link from "next/link";

type PiecePageProps = {
    piece_data: PieceData,
    username: string,
    isLoggedInAsUser: boolean,
}

export default function PiecePageComponent({props}: { props: PiecePageProps }) {
    const {piece_data, username, isLoggedInAsUser} = props;

    return (
        <div className={"relative"}>
            <div className={"flex flex-row"}>
                <div className={"p-3 m-5 bg-gray-800 rounded-xl w-full flex flex-row justify-between"}>
                    <div>
                        <h1 className={"text-3xl"}>{piece_data.title}</h1>
                        <h2 className={"text-lg"}>by {username}</h2>
                        <p className={"text-sm text-gray-400"}>last updated {piece_data.last_updated.toString()}</p>
                    </div>
                    <div className={"flex flex-row justify-between items-center"}>
                        <div className={"p-3 bg-black text-2xl rounded-xl"}>
                            <a target={"_blank"} href={`/u/${username}/${piece_data.slug}/read`}>read!</a>
                        </div>
                        {
                            isLoggedInAsUser &&
                            <div>
                                <Link href={`/editor/${piece_data.id}`}
                                      className={"material-symbols-outlined p-4 rounded-xl bg-gray-400"}>
                                    edit
                                </Link>
                                <div>
                                    {!piece_data.published &&
                                        <p>this piece is unpublished!! no one else can see it.</p>}
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className={"p-3 m-5 bg-gray-800 rounded-xl w-1/4"}>
                    <p>{piece_data.view_number} views</p>
                </div>
            </div>
            <div className={"p-3 m-5 bg-gray-800 rounded-xl"}>
                <p>{piece_data.summary ? piece_data.summary : "This piece doesn't have a summary yet!"}</p>
            </div>
        </div>
    )
}