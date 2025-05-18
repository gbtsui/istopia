"use server";

import FetchPieceData from "@/app/engine/fetcher";
import UnknownPiecePage from "@/app/component/piece/unknown-piece";
import GetUserData from "@/app/api/data/user-management/get-user-data";
import GetUserSession from "@/app/api/data/user-management/get-user-session";
import PiecePageComponent from "@/app/component/piece/piece-page";

export default async function PiecePage({params}: {params: Promise<{username: string, piece_slug: string}>}){
    const {username, piece_slug} = await params;

    const piece_data = await FetchPieceData(username, piece_slug);

    const user = await GetUserData(username);
    if (!piece_data) {
        return <UnknownPiecePage/>
    }

    const session_user = await GetUserSession()
    const isLoggedInAsUser: boolean = session_user? session_user.name === user?.name : false

    return (
        <PiecePageComponent props={{piece_data, username, isLoggedInAsUser}}/>
    )
}