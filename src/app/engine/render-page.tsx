"use client";

import {Page} from "@/app/types";

import RenderBlock from "@/app/engine/render-block";
import EngineErrorComponent from "@/app/engine/engine-error";

export function RenderPage({data}: {data:Page}) {
    const {blocks} = data;

    const root = blocks["root"];
    if (!root) return <EngineErrorComponent err={"root block not found! piece appears to be corrupt..."}/>;

    return <RenderBlock block={root}/>
}