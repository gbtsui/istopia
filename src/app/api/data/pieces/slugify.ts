"use server";

export default async function Slugify(title: string) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
        .replace(/\s+/g, "-")        // collapse whitespace
        .replace(/-+/g, "-");        // collapse dashes
    //chatgpt writes better regex than me ;3
}