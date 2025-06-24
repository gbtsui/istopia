import {Block} from "@/app/types";

export default function findActiveItem(flattened_blocks: Block[], active_id: string) { //did this really necessitate an entire util function?
    flattened_blocks.forEach((block) => {
        if (block.props.id === active_id) {
            return block //returns the active item :)
        }
    })
}