"use client"

import {BlockProps, ContainerBlockProps} from "@/app/types";

type BlockEditFieldsProps = {
    blockProps: BlockProps | ContainerBlockProps,
    updateProps: (newProps: Partial<BlockProps>) => void
}

export default function BlockEditFields(props: BlockEditFieldsProps) {
    const {blockProps, updateProps} = props

    return (
        <div>
            {
            }

            {blockProps.content !== undefined &&
                <textarea className={"p-0.5 w-full"} placeholder={"write some text..."}
                          value={blockProps.content.toString()} contentEditable={true}
                          onChange={(e) => updateProps({content: e.target.value.split("\n")})}/>
            }
            {
                blockProps.className !== undefined &&
                    <input type={"text"} className={"p-0.5 w-full"} placeholder={"className..."}
                           onChange={(e) => updateProps({className: e.target.value})}/>
            }
            {
                blockProps.additional_props ?
                    Object.entries(blockProps.additional_props).map(([key, value]) => {
                        switch (typeof value) {
                            case "string":
                                return (
                                    <div className={"p-2"} key={key}>
                                        <span>{key}</span>
                                        <input type={"text"} defaultValue={value} onChange={(e) => updateProps({additional_props: {[key]: e.target.value}})} name={key}/>
                                    </div>
                                )
                            case "number":
                                return (
                                    <div className={"p-2"} key={key}>
                                        <span>{key}</span>
                                        <input type={"number"} defaultValue={value} onChange={(e) => updateProps({additional_props: {[key]: e.target.value}})} name={key}/>
                                    </div>
                                )
                            case "boolean":
                                return (
                                    <div className={"p-2"} key={key}>
                                        <span>{key}</span>
                                        <input type={"checkbox"} checked={value} onChange={(e) => updateProps({additional_props: {[key]: e.target.checked}})} name={key}/>
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