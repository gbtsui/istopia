"use server";

import CreatePiece from "@/app/api/data/pieces/create-piece";
import GetUserSession from "@/app/api/data/user-management/get-user-session";
import UnauthorizedPage from "@/app/component/universal/unauthorized";
import {PieceData} from "@/app/types";
import {SummarySchema, TitleSchema} from "@/app/api/data/validation/validation-schemas";
import {redirect} from "next/navigation";
import CreatePieceForm from "@/app/component/editor/editor-components/create-piece-form";

export default async function CreatePiecePage() {
    const user = await GetUserSession()
    if (!user || !user.name) {
        return <UnauthorizedPage message={"please sign in!"}/>
    }

    async function create(form_data: FormData) {
        "use server";

        const data: Partial<PieceData> = {
            title: await TitleSchema.parseAsync(form_data.get("title") as string),
            summary: await SummarySchema.parseAsync(form_data.get("summary") as string),
        } //piece data
        const result = await CreatePiece(user?.name as string, data)
        if (result instanceof Error) {
            return {error: result.message}
        }
        redirect(`/editor/${result.id}`)
    }

    return (
        <div>
            <div className={"p-4 bg-gray-800 m-5 rounded-xl"}>
                <h1 className={"text-3xl"}>Create Piece</h1>
            </div>
            <CreatePieceForm createAction={create}/>
        </div>
    )
}