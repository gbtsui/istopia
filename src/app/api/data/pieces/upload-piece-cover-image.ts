"use server";

import GetUserSession from "@/app/api/data/user-management/get-user-session";
import { Result } from "@/app/types";
import {createSupabaseServerClient} from "@/app/api/data/db";

export default async function UploadPieceCoverImage(file: File, username: string, piece_id: string): Promise<Result<string>> { //returns the url of the cover image
    const user = await GetUserSession()
    if (!user || user.name !== username) {
        return {success: false, error: "unauthorized"}
    }

    const file_name = `${piece_id}.${file.name.split(".").pop()}`;

    const supabase = await createSupabaseServerClient()

    const {error} = await supabase.storage
        .from("cover-image")
        .upload(`/${username}/${file_name}`, file, {
            cacheControl: "3600",
            upsert: true
        })
    if (error) {
        console.error(error)
        return {success: false, error: error.message}
    }

    const public_url = supabase.storage
        .from("cover-image")
        .getPublicUrl(`/${username}/${file_name}`).data.publicUrl

    return {success: true, data: public_url}
}