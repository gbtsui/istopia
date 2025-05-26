"use client";

import UploadPFP from "@/app/api/data/user-management/upload-pfp";

export default function StefanIconsPage() {
    return (
        <form action={async (formData) => console.log(await UploadPFP(formData))}>
            <input type={"file"} accept={"image/*"} name={"file"}/>
            <button type="submit">Save</button>
        </form>
    )
}