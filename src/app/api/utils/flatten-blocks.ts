import {Block} from "@/app/types";

export function flattenBlocks(
    blocks: Record<string, Block>,
    visited = new Set<string>()
): Block[] {
    const result: Block[] = [];

    for (const block of Object.values(blocks)) {
        if (visited.has(block.props.id)) continue;
        visited.add(block.props.id);
        result.push(block);
        //if (block.type !== "root") result.push(block);

        if (block.props.children_ids) {
            const children = block.props.children_ids
                .map(id => blocks[id])
                .filter((child): child is Block => child !== undefined);
            children.forEach(child => {console.log(JSON.stringify(child));});
            const childBlocks = flattenBlocks(
                Object.fromEntries(children.map(child => [child.props.id, child])),
                visited
            );
            result.push(...childBlocks);
        }
    }

    return result;
}

export function deflattenBlocks(blocks: Array<Block>): Record<string, Block> {
    const result: Record<string, Block> = {};
    for (const block of blocks) {
        result[block.props.id] = block;
    }
    return result;
}