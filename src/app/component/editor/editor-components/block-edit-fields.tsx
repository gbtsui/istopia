"use client"

import {BlockProps, ContainerBlockProps} from "@/app/types";
import {ChangeEvent} from "react";

type BlockEditFieldsProps = {
    blockProps: BlockProps | ContainerBlockProps,
    updateContent: (e: ChangeEvent<HTMLTextAreaElement>) => void,
    updateClassName: (e: ChangeEvent<HTMLTextAreaElement>) => void,
}

export default function BlockEditFields(props: BlockEditFieldsProps) {
    const {blockProps, updateContent, updateClassName} = props

    return (
        <div>
            {blockProps.content ?
                <textarea className={"p-0.5 w-full"} placeholder={"write some text..."}
                          value={blockProps.content?.toString()} contentEditable={true}
                          onChange={updateContent}/>
                : null
            }
            {
                blockProps.className ?
                    <textarea className={"p-0.5 w-full"} placeholder={"className..."}
                    onChange={updateClassName}/>
                    : null
            }
        </div>
    )
}