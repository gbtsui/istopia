"use client"

import {BlockProps, ContainerBlockProps} from "@/app/types";
import {ChangeEvent} from "react";

type BlockEditFieldsProps = {
    blockProps: BlockProps | ContainerBlockProps,
    updateContent: (e: ChangeEvent<HTMLTextAreaElement>) => void,
    updateClassName: (e: ChangeEvent<HTMLInputElement>) => void,
}

export default function BlockEditFields(props: BlockEditFieldsProps) {
    const {blockProps, updateContent, updateClassName} = props

    let additional_props: Array<{ [key: string]: boolean | string | number }> = []
    for (const key in blockProps.additional_props) {
        additional_props.push(blockProps.additional_props[key])
    }

    return (
        <div>
            {
            }

            {blockProps.content ?
                <textarea className={"p-0.5 w-full"} placeholder={"write some text..."}
                          value={blockProps.content?.toString()} contentEditable={true}
                          onChange={updateContent}/>
                : null
            }
            {
                blockProps.className ?
                    <input type={"text"} className={"p-0.5 w-full"} placeholder={"className..."}
                           onChange={updateClassName}/>
                    : null
            }
            {
                blockProps.additional_props ?
                    Object.entries(blockProps.additional_props).map(([key, value]) => {
                        switch (typeof value) {
                            case "string":
                                return (
                                    <div className={"p-2"}>
                                        <span>{key}</span>
                                        <input type={"text"} defaultValue={value} name={key}/>
                                    </div>
                                )
                            case "number":
                                return (
                                    <div className={"p-2"}>
                                        <span>{key}</span>
                                        <input type={"number"} defaultValue={value} name={key}/>
                                    </div>
                                )
                            case "boolean":
                                return (
                                    <div className={"p-2"}>
                                        <span>{key}</span>
                                        <input type={"checkbox"} checked={value} name={key}/>
                                    </div>
                                )
                            default:
                                console.log("data type unsupported (value of):" + value)
                        }
                    })

                    : null
            }
        </div>
    )
}