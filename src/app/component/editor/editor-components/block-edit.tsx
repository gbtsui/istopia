"use client";

import {Block, BlockProps} from "@/app/types";
import Sortable from "@/app/component/editor/state/sortable";
import {useEditorStore} from "@/app/component/editor/state/zustand";
import {ChangeEvent} from "react";
import BlockEditFields from "@/app/component/editor/editor-components/block-edit-fields";

type BlockEditProps = {
    block: Block;
    page_number: number
}

export default function BlockEdit(props:BlockEditProps){
    const {block, page_number} = props;
    const editBlock = useEditorStore((state) => state.editBlock)

    const updateContent = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newProps = {
            ...block.props,
            content: e.target.value.toString().split("\n")
        }
        updateZustand(newProps)
    }

    const updateClassName = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const newProps = {
            ...block.props,
            className: e.target.value.toString()
        }
        updateZustand(newProps)
    }

    const updateZustand = (newProps: BlockProps) => {
        editBlock(page_number, block.id, newProps)
    }

    return (
        <Sortable id={block.id} content={block.type} key={block.id}
                  className={"p-2 m-2 bg-white rounded-lg text-black"}>
            <BlockEditFields blockProps={block.props} updateContent={updateContent} updateClassName={updateClassName}/>
        </Sortable>
    )
}