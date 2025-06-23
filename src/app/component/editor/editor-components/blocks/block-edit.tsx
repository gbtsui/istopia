"use client";

import {Block, BlockProps} from "@/app/types";
import Sortable from "@/app/component/editor/state/sortable";
import {useEditorStore} from "@/app/component/editor/state/zustand";
import BlockEditFields from "@/app/component/editor/editor-components/blocks/block-edit-fields";

type BlockEditProps = {
    block: Block;
    page_id: string
}

function calculateDepth(block: Block, page_blocks: Record<string, Block>): number { //i love recursion and functional programming
    if (!block.props.parent_id) return -1; //peak design
    if (block.props.parent_id === "root") return 0;
    const parent = page_blocks[block.props.parent_id];
    return 1+calculateDepth(parent, page_blocks)
}

export default function BlockEdit(props:BlockEditProps){
    const {block, page_id} = props;
    const editBlock = useEditorStore((state) => state.editBlock)
    const deleteBlock = useEditorStore((state) => state.deleteBlock)
    const page = useEditorStore((state) => state.content.pages[page_id])

    const depth = calculateDepth(block, page.blocks)

    const updateProps = (newProps: Partial<BlockProps>) => {
        const finalProps = {
            ...block.props,
            ...newProps,
            additional_props: {
                ...block.props.additional_props,
                ...(newProps.additional_props || {}),
            }
        }
        updateZustand(finalProps)
    }

    const updateZustand = (newProps: BlockProps) => {
        editBlock(page_id, block.props.id, newProps)
    }

    return (
        <Sortable id={block.props.id} content={block.type} key={block.props.id}
                  className={"p-2 m-2 bg-white rounded-lg text-black"} left_margin={depth}>
            <BlockEditFields blockProps={block.props} page_id={page_id} page_blocks={page.blocks} updateProps={updateProps}/>

            {block.type !== "root" && <button onClick={() => deleteBlock(page_id, block.props.id)} className={"material-symbols-outlined select-none cursor-pointer rounded-xl p-2 hover:bg-red-500 transition-all"}>delete</button>} {/*TODO: make this work with a dialog*/}
        </Sortable>
    )
}

//why do you seek the living among the dead? for behold he is risen