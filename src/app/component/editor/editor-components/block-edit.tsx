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
            <span className={"material-symbols-outlined select-none cursor-pointer"}>delete</span> {/*TODO: make this work with a dialog*/}
        </Sortable>
    )
}