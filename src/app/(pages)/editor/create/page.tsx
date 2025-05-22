"use server";

import CreatePiece from "@/app/api/data/pieces/create-piece";
import GetUserSession from "@/app/api/data/user-management/get-user-session";
import UnauthorizedPage from "@/app/component/universal/unauthorized";
import {PieceData} from "@/app/types";
import {SummarySchema, TitleSchema} from "@/app/api/data/validation/validation-schemas";
import {redirect} from "next/navigation";

export default async function CreatePiecePage() {
    const user = await GetUserSession()
    if (!user || !user.name) {
        return <UnauthorizedPage message={"please sign in!"}/>
    }

    async function create(form_data: FormData) {
        "use server";
        try {
            const data: Partial<PieceData> = {
                title: await TitleSchema.parseAsync(form_data.get("title") as string),
                summary: await SummarySchema.parseAsync(form_data.get("summary") as string),
            } //piece data
            const result = await CreatePiece(user?.name as string, data)
            if (result instanceof Error) {
                throw result
            } else {
                redirect("/editor/"+result.slug)
                //wait i need to set a loading system :(
            }
        } catch (error) {
            //handle error here!!
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