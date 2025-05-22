"use server";

import CreatePiece from "@/app/api/data/pieces/create-piece";
import GetUserSession from "@/app/api/data/user-management/get-user-session";
import UnauthorizedPage from "@/app/component/universal/unauthorized";
import {PieceData} from "@/app/types";

export default async function CreatePiecePage() {
    const user = await GetUserSession()
    if (!user || !user.name) {
        return <UnauthorizedPage message={"please sign in!"}/>
    }

    async function create(form_data: FormData) {
        const data: Partial<PieceData> = {
            title: form_data.get("title") as string,
            summary: form_data.get("summary") as string,
        } //piece data
        const result = await CreatePiece(user?.name as string, data)
        if (result instanceof Error) {
            //handle error message (there aren't that many possible ones)
            return
        }


    }

    return (
        <div>
            <div>
                <h1>Create Piece</h1>
            </div>
            <div>
                <form>

                </form>
            </div>
        </div>
    )
}