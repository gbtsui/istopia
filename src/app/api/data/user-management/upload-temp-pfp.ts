"use server";

import GetUserSession from "@/app/api/data/user-management/get-user-session";
import {createSupabaseServerClient} from "@/app/api/data/db";

export default async function UploadTempPfp(file: File, username: string) {
    const user = await GetUserSession()
    if (!user || user.name !== username) {
        throw new Error("Unauthorized");
    }

    const temp_file_name = `${crypto.randomUUID()}.${username}.${Date.now()}`;

    const supabase = await createSupabaseServerClient()

    await supabase.storage
        .from("pfp")
        .upload(`temp/${temp_file_name}`, file, {
            cacheControl: "3600",
            upsert: true
        })

    const public_url = supabase.storage
        .from("pfp")
        .getPublicUrl(`temp/${temp_file_name}`).data.publicUrl

    return { path: `temp/${temp_file_name}`, url: public_url }
}