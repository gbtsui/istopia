import {Block} from "@/app/types";

export default function findActiveItem(flattened_blocks: Block[], active_id: string) { //did this really necessitate an entire util function?
    for (const block of flattened_blocks) {
        if (block.props.id === active_id) {
            return block //returns the active item :)
        }
    }
    return null
}