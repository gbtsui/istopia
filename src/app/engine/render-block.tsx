"use client";

import {Block, ContainerBlockProps} from "@/app/types";
import {JSX} from "react";
import SimpleText from "@/app/engine/engine-components/simple-text";
import Typewriter from "@/app/engine/engine-components/typewriter";
import SimpleContainer from "@/app/engine/engine-components/simple-container";
import {BlockList} from "@/app/engine/block-list";

export default function RenderBlock({block}: {block:Block}): JSX.Element | null {
    switch (block.type) {
        case "text":
            return <SimpleText {...block.props}/>
        case "typewriter":
            return <Typewriter {...block.props}/>
        case "simple-container":
            return <SimpleContainer {...block.props as ContainerBlockProps}/>
        default:
            return null
    }
}

export function RenderBlockFromList({block}: {block:Block}) {
    for (const blockInfo of BlockList) {
        if (block.type === blockInfo.block_name) {
            return blockInfo.block_component(block.props)
        }
    }
    return null
}