import {Block} from "@/app/types";

export function flattenBlocks(blocks: Record<string, Block>): Block[] { //this does actually sort and flatten the block record :D
    return Object.values(blocks).reduce<Block[]>((acc, block) => {
        if (acc.find((b) => b === block)) return acc;
        if (block.type !== "root") acc.push(block);
        if (block.props.children_ids) {
            const children = block.props.children_ids.map(id => blocks[id]);
            acc.push(...flattenBlocks(
                Object.fromEntries(children.map(child => [child.props.id, child]))
            ));
        }
        return acc;
    }, []);
}

export function deflattenBlocks(blocks: Array<Block>): Record<string, Block> {
    const result: Record<string, Block> = {};
    for (const block of blocks) {
        result[block.props.id] = block;
    }
    return result;
}