"use server";

import GetUserSession from "@/app/api/data/user-management/get-user-session";
import {createSupabaseServerClient, prisma} from "@/app/api/data/db";

export async function MakePfpPermanent(temp_file_path: string, username: string) {
    const user = await GetUserSession()
    if (!user || user.name !== username) {
        return new Error("Unauthorized");
    }

    const db_user = await prisma.user.findUnique({
        where: {name: user.name as string}
    })
    if (!db_user) {
        return new Error("User doesn't exist in database.")
    }

    const supabase = await createSupabaseServerClient()

    const {data, error: downloadError} = await supabase.storage
        .from("pfp")
        .download(temp_file_path);

    if (downloadError) return downloadError;

    const file_extension = temp_file_path.split(".").pop()?.toLowerCase().replace(/[^a-z]/g, "");
    const final_path = `${db_user.name}.${file_extension}`
    const {error: uploadError} = await supabase.storage
        .from("pfp")
        .upload(
            final_path,
            data,
            {upsert: true}
        )
    if (uploadError) return uploadError;

    const public_url = supabase.storage.from("pfp").getPublicUrl(final_path).data.publicUrl;

    await prisma.user.update({
        where: {id: db_user.id},
        data: {profile_picture_link: public_url}
    })

    return public_url
}