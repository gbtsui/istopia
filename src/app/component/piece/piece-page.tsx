"use client";

import {PieceData} from "@/app/types";
import Link from "next/link";
import DeletePieceButton from "@/app/component/piece/delete-piece-button";
import addPieceView from "@/app/api/data/pieces/add-piece-view";

type PiecePageProps = {
    piece_data: PieceData,
    username: string,
    isLoggedInAsUser: boolean,
}

export default function PiecePageComponent({props}: { props: PiecePageProps }) {
    const {piece_data, username, isLoggedInAsUser} = props;

    const viewPiece = () => {
        addPieceView({piece_id: piece_data.id, username});
        window.open(`/u/${username}/${piece_data.slug}/read`, `_blank`);
    }

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
                        <button className={"p-3 bg-black text-2xl rounded-xl cursor-pointer"} onClick={viewPiece}>
                            read
                        </button>
                        {
                            isLoggedInAsUser &&
                            <div className={"w-1/3"}>
                                <Link href={`/editor/${piece_data.id}`}
                                      className={"material-symbols-outlined p-4 rounded-xl bg-gray-400"}>
                                    edit
                                </Link>
                                <div>
                                    {!piece_data.published &&
                                        <p>this piece is unpublished!! no one else can see it.</p>}
                                    <DeletePieceButton piece_id={piece_data.id} username={username} slug={piece_data.slug}/>
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