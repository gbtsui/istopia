"use server";

import {Block, Page} from "@/app/types";
import SimpleText from "@/app/engine/engine-components/simple-text";
import {JSX} from "react";

export async function RenderPage(data: Page) {
    const {blocks} = data;
    let children: Array<JSX.Element> = [] //zero type safety go brr i guess??

    for (const block of blocks) {
        children.push(<RenderBlock block={block} />); //find a way to recursively render children ig
    }
    return <>{children}</>;
}

export async function RenderBlock({block}: {block:Block}): Promise<JSX.Element | null> {
    switch (block.type) {
        case "text":
            return <SimpleText props={block.props}/>
        default:
            return null
    }
}