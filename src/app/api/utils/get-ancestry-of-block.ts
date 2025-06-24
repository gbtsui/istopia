import {Block} from "@/app/types";

export default function getAncestryOfBlock(block: Block, all_blocks: Record<string, Block>, prev_ancestry: string[] = []): string[] { //this might actually be pretty good fnuctional programming
    if (block.props.parent_id === undefined) return prev_ancestry
    const parent = all_blocks[block.props.parent_id]
    const new_ancestry = [...prev_ancestry]
    new_ancestry.push(block.props.parent_id)
    return getAncestryOfBlock(parent, all_blocks, new_ancestry)
}