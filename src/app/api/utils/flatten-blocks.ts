import {Block} from "@/app/types";

export function flattenBlocks(
    //blocks: Record<string, Block>,
    blocks_map: Record<string, Block>,
    blocks: Block[],
    visited = new Set<string>()
): Block[] {
    const result: Block[] = [];

    for (const block of blocks) {
        if (visited.has(block.props.id)) continue;
        visited.add(block.props.id);
        result.push(block);
        //if (block.type !== "root") result.push(block);

        if (block.props.children_ids && !block.props.is_collapsed) {
            const children = block.props.children_ids
                .map(id => blocks_map[id])
                .filter((child): child is Block => child !== undefined);
            children.forEach(child => {console.log("child ", child);});
            const childBlocks = flattenBlocks(
                blocks_map,
                children,
                visited
            );
            result.push(...childBlocks);
        }
    }

    return result;
}
