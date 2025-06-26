"use client";

import {Page} from "@/app/types";

import RenderBlock from "@/app/engine/render-block";

export function RenderPage({data}: {data:Page}) {
    const {blocks} = data;

    const root = blocks["root"];
    if (!root) throw new Error("root block not found! piece appears to be corrupt...")

    return <RenderBlock block={root}/>
}