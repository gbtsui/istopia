"use client";

import {PieceData} from "@/app/types";

type PiecePageProps = {
    piece_data: PieceData,
    username: string,
    isLoggedInAsUser: boolean,
}

export default function PiecePageComponent({props}: {props: PiecePageProps}) {
    const {piece_data, username, isLoggedInAsUser} = props;

    return (
        <div className={"relative"}>
            <div className={"flex flex-row"}>
                <div className={"p-3 m-5 bg-gray-800 rounded-xl w-full"}>
                    <h1 className={"text-3xl"}>{piece_data.title}</h1>
                    <h2 className={"text-lg"}>by {username}</h2>
                    <p className={"text-sm text-gray-400"}>last updated {piece_data.last_updated.toString()}</p>
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