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