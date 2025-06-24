import {Block} from "@/app/types";

export default function getAncestryOfBlock(block: Block, all_blocks: Record<string, Block>, prev_ancestry: string[] = []): string[] { //this might actually be pretty good fnuctional programming
    if (block.props.parent_id === undefined) return prev_ancestry
    const parent = all_blocks[block.props.parent_id]
    const new_ancestry = [...prev_ancestry]
    new_ancestry.push(block.props.parent_id)
    return getAncestryOfBlock(parent, all_blocks, new_ancestry)
}

export function getDescendantsOfBlock(block_id: string, blocks: Record<string, Block>): string[] {
    const result: string[] = [];

    function recurse(id: string) {
        const block = blocks[id];
        if (!block?.props.children_ids) return;

        for (const childId of block.props.children_ids) {
            result.push(childId);
            recurse(childId);
        }
    }

    recurse(block_id);
    return result;
}