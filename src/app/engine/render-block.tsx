"use client";

import {Block, BlockProps, ContainerProps} from "@/app/types";
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
            if ('page_blocks' in blockInfo.block_props) {
                return blockInfo.block_component(block.props as ContainerProps);
            } else {
                // @ts-expect-error I KNOW THAT THIS WILL WORK. but i guess i should put in more type safety in the future ig
                return blockInfo.block_component(block.props as BlockProps);
            }
        }
    }
    return null
}