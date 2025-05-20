"use server";

import FetchPieceData from "@/app/engine/fetcher";
import GetUserSession from "@/app/api/data/user-management/get-user-session";
import {DatabaseUser, PieceData} from "@/app/types";
import GetUserData from "@/app/api/data/user-management/get-user-data";
import UnauthorizedPage from "@/app/component/universal/unauthorized";
import Editor from "@/app/component/editor/editor";
import UnknownPiecePage from "@/app/component/piece/unknown-piece";

export default async function EditPiecePage({params}: {params: Promise<{piece_id: string}>}) {
    const {piece_id} = await params;

    const piece_data: PieceData | null = await FetchPieceData({id: piece_id});
    const logged_in_user = await GetUserSession();
    if (!logged_in_user) {
        return <UnauthorizedPage message={"please log in!"}/>
    }
    const db_user: DatabaseUser | null = await GetUserData({name: logged_in_user?.name as string});
    if (!db_user) {
        return <UnauthorizedPage message={"you don't have edit permissions for this piece!"}/>
    }

    if (!piece_data) {
        return <UnknownPiecePage/>
    }

    console.log("ニヤ~") //TODO: reflect on what i am doing with my life
    return <Editor initialPieceData={piece_data}/>
}
