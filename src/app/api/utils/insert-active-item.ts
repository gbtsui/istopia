import {Block} from "@/app/types";

export default function insertActiveItem(
    items: Array<Block>,
    active_id: string,
    active_index: number,
    active_item: Block,
    over_id: string,
    over_index: number,
    insertFirst: boolean
): Array<Block> {
    console.log("insert active item called")
    let has_over_id = false;
    const new_items = items.map((block): Block & {isActive?: boolean} => {
        if (block.props.id === active_id) {
            return {...block, isActive: true} // 标记 active 以便后面 filter
        }
        if (block.props.id === over_id) {
            has_over_id = true;
        }

        return {
            ...block,
        }
    })

    if (has_over_id && active_item) {
        const over_item_index = new_items.findIndex((block) => block.props.id === over_id)
        if (over_item_index === 0 && insertFirst) new_items.unshift(active_item)
        else if (over_item_index > -1) {
            const start_index = active_index < over_index ? over_item_index + 1 : over_item_index
            new_items.splice(start_index, 0, active_item)
        }
    }

    return new_items.filter((block) => !block.isActive)
}

export function insertActiveItemWithNesting(
    blocks: Record<string, Block>,
    active_id: string,
    over_id: string,
    insertFirst: boolean
): Record<string, Block> {
    const clonedBlocks: Record<string, Block> = structuredClone(blocks);
    const active = clonedBlocks[active_id];
    const over = clonedBlocks[over_id];

    if (!active || !over || active_id === "root") return blocks;

    const canNestIntoOver = over.props.children_ids !== undefined;
    const new_parent_id = canNestIntoOver ? over_id : over.props.parent_id ?? "root";

    // Remove active from old parent
    const old_parent_id = active.props.parent_id;
    if (old_parent_id && clonedBlocks[old_parent_id]) {
        clonedBlocks[old_parent_id].props.children_ids = clonedBlocks[old_parent_id].props.children_ids?.filter(id => id !== active_id);
    }

    // Determine sibling insert point
    const siblings = clonedBlocks[new_parent_id]?.props.children_ids || [];
    const reference_id = canNestIntoOver ? undefined : over_id;
    const over_index = reference_id ? siblings.indexOf(reference_id) : siblings.length;
    //const insert_index = insertFirst ? 0 : over_index + 1 //over_index : over_index + 1;
    let insert_index: number;
    console.log(insertFirst)
    if (insertFirst) {
        insert_index = over_index;
        console.log("inserting first...")
    } else {
        insert_index = over_index + 1;
        console.log("inserting after...")
    }


    // Insert active
    const new_siblings = [...siblings];
    new_siblings.splice(insert_index, 0, active_id);
    clonedBlocks[new_parent_id].props.children_ids = new_siblings;

    // Update parent_id
    active.props.parent_id = new_parent_id;

    return clonedBlocks;
}