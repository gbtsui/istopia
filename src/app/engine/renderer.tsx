"use client";

import {Page} from "@/app/types";
import {JSX} from "react";

import RenderBlock from "@/app/engine/render-block";

export function RenderPage({data}: {data:Page}) {
    const {blocks} = data;
    let children: Array<JSX.Element> = [] //zero type safety go brr i guess??

    for (const i in blocks) {
        children.push(<RenderBlock key={i} block={blocks[i]} />); //find a way to recursively render children ig
    }
    return <>{children}</>;
}