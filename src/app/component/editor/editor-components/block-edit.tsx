"use client";

import {Block, BlockProps} from "@/app/types";
import Sortable from "@/app/component/editor/state/sortable";
import {useEditorStore} from "@/app/component/editor/state/zustand";
import BlockEditFields from "@/app/component/editor/editor-components/block-edit-fields";

type BlockEditProps = {
    block: Block;
    page_number: number
}

export default function BlockEdit(props:BlockEditProps){
    const {block, page_number} = props;
    const editBlock = useEditorStore((state) => state.editBlock)
    const deleteBlock = useEditorStore((state) => state.deleteBlock)

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
        editBlock(page_number, block.props.id, newProps)
    }

    return (
        <Sortable id={block.props.id} content={block.type} key={block.props.id}
                  className={"p-2 m-2 bg-white rounded-lg text-black"}>
            <BlockEditFields blockProps={block.props} updateProps={updateProps}/>

            <button onClick={() => deleteBlock(page_number, block.props.id)} className={"material-symbols-outlined select-none cursor-pointer rounded-xl p-2 hover:bg-red-500 transition-all"}>delete</button> {/*TODO: make this work with a dialog*/}
        </Sortable>
    )
}

//why do you seek the living among the dead? for behold he is risen