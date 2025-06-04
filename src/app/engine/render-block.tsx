"use client";

import {Block} from "@/app/types";
import {BlockList} from "@/app/engine/block-list";

/*
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
 */

export default function RenderBlock({block}: {block:Block}) {
    for (const blockInfo of BlockList) {
        if (block.type === blockInfo.block_name) {
            return blockInfo.block_component(block.props)
        }
    }
    return null
}