"use client";

import {Page} from "@/app/types";

import RenderBlock from "@/app/engine/render-block";

export function RenderPage({data}: {data:Page}) {
    const {blocks} = data;

    return <>{blocks.map((block, i) => {return <RenderBlock block={block} key={i}/>})}</>;
}