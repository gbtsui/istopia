"use client";

import {Block, BlockProps} from "@/app/types";
import Sortable from "@/app/component/editor/state/sortable";
import {useEditorStore} from "@/app/component/editor/state/zustand";
import {ChangeEvent} from "react";

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

    const updateZustand = (newProps: BlockProps) => {
        editBlock(page_number, block.id, newProps)
    }

    return (
        <Sortable id={block.id} content={block.type} key={block.id}
                  className={"p-2 m-2 bg-white rounded-lg text-black"}>
            <div></div>
            {
                block.props.content ?
                    <textarea className={"p-0.5 w-full"} placeholder={"write some text..."}
                              value={block.props.content?.toString()}  contentEditable={true}
                              onChange={updateContent}/>
                    :
                    null
            }

        </Sortable>
    )
}