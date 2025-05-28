"use server";

import GetUserSession from "@/app/api/data/user-management/get-user-session";
import {createServerClient} from "@supabase/ssr";
import {createSupabaseServerClient, prisma} from "@/app/api/data/db";
import {cookies} from "next/headers";
import {ReadonlyRequestCookies} from "next/dist/server/web/spec-extension/adapters/request-cookies";

export default async function UploadPFP(formData: FormData) {
    const user = await GetUserSession()
    if (!user) {
        return new Error("Unauthorized");
    }

    const db_user = await prisma.user.findUnique({
        where: {name: user.name as string}
    })

    if (!db_user) {
        return new Error("User doesn't exist in the database...?");
    }
    const cookie_store: ReadonlyRequestCookies = await cookies()
    const supabase = createServerClient(
        process.env.SUPABASE_URL as string,
        process.env.SUPABASE_ANON_KEY as string,
        {
            cookies: {
                getAll() {
                    return cookie_store.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({name, value, options}) =>
                            cookie_store.set(name, value, options)
                        )
                    } catch (err) {
                        //no idea??? documentation just stops here :broken_heart:
                    }
                }
            }
        }
    )

    const file = formData.get("file") as File;
    if (!file) {
        return new Error("no file provided");
    }

    const file_extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z]/g, "");
    if (!file_extension || !["jpg", "jpeg", "png"].includes(file_extension)) {
        return new Error("unsupported filetype")
    }

    if (db_user.profile_picture_link) {
        const path = db_user.profile_picture_link.split("/objects/public")[1];
        await supabase.storage.from("pfp").remove([path])
    }

    const filename = `${db_user.name}.${file_extension}`;

    const {error: uploadError} = await supabase.storage
        .from("pfp")
        .upload(filename, file, {
            cacheControl: "3600",
            upsert: true
        })

    if (uploadError) {
        return new Error(uploadError.message)
    }

    const {data: {publicUrl}} = supabase.storage.from("pfp").getPublicUrl(filename)

    await prisma.user.update({
        where: {id: db_user.id},
        data: {profile_picture_link: publicUrl}
    })

    return publicUrl
}

export async function MakePfpPermanent(temp_file_path: string, username: string) {
    const user = await GetUserSession()
    if (!user || user.name !== username) {
        throw new Error("Unauthorized");
    }

    const db_user = await prisma.user.findUnique({
        where: {name: user.name as string}
    })
    if (!db_user) {
        throw new Error("User doesn't exist in database.")
    }

    const supabase = await createSupabaseServerClient()

    const {data, error: downloadError} = await supabase.storage
        .from("pfp")
        .download(temp_file_path);

    if (downloadError) throw downloadError;

    const file_extension = temp_file_path.split(".").pop()?.toLowerCase().replace(/[^a-z]/g, "");
    const final_path = `${db_user.name}.${file_extension}`
    const {error: uploadError} = await supabase.storage
        .from("pfp")
        .upload(
            final_path,
            data,
            {upsert: true}
        )
    if (uploadError) throw uploadError;

    return supabase.storage.from("pfp").getPublicUrl(final_path).data.publicUrl;
}