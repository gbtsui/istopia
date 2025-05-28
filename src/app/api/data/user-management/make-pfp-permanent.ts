"use server";

import GetUserSession from "@/app/api/data/user-management/get-user-session";
import {createSupabaseServerClient, prisma} from "@/app/api/data/db";

export async function MakePfpPermanent(temp_file_url: string | null, username: string) {
    console.log("triggered")
    if (!temp_file_url) {
        return "";
    }

    const temp_file_path = temp_file_url.split("/").pop() as string;

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

    console.log("downloading: " + temp_file_path)
    const {data, error: downloadError} = await supabase.storage
        .from("pfp")
        .download(`temp/${temp_file_path}`);

    console.log(downloadError)
    if (downloadError) return downloadError;

    const file_extension = temp_file_path.split(".").pop()?.toLowerCase().replace(/[^a-z]/g, "");
    const final_path = `${db_user.name}.${file_extension}`
    console.log("uploading")
    const {error: uploadError} = await supabase.storage
        .from("pfp")
        .upload(
            final_path,
            data,
            {upsert: true}
        )
    if (uploadError) return uploadError;

    const {data: {publicUrl}} = supabase.storage.from("pfp").getPublicUrl(final_path);
    await prisma.user.update({
        where: {id: db_user.id},
        data: {profile_picture_link: publicUrl}
    })

    console.log(publicUrl)

    return publicUrl
}