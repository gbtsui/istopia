"use client"

import {BlockProps} from "@/app/types";

type BlockEditFieldsProps = {
    blockProps: BlockProps,
    updateProps: (newProps: Partial<BlockProps>) => void
}

export default function BlockEditFields(props: BlockEditFieldsProps) {
    const {blockProps, updateProps} = props


    return (
        <div className={"flex flex-col gap-2"}>
            <div>
                <label>Label: </label>
                <input
                    value={blockProps.friendly_name}
                    placeholder={"write an identifier here..."}
                    onChange={(e) => updateProps({friendly_name: e.target.value})}
                    className={"p-0.5 text-xl bg-gray-200 rounded-xl"}/>
            </div>
            <div className={"flex flex-row"}>
                <div className={`${blockProps.additional_props ? "w-1/2" : "w-full"}`}>
                    {blockProps.content !== undefined &&
                        <div className={"flex flex-col"}>
                            <label>Content:</label>
                            <textarea className={"p-1 bg-gray-200 rounded-xl outline-0 w-full resize-none"}
                                      placeholder={"write some text..."}
                                      value={blockProps.content.join("\n")} contentEditable={true}
                                      onChange={(e) => updateProps({content: e.target.value.split("\n")})}/>
                        </div>
                    }
                    {
                        blockProps.className !== undefined &&
                        <div className={"flex flex-col"}>
                            <label>Styling (Tailwind):</label>
                            <input type={"text"} className={"p-0.5 w-full"} placeholder={"className..."}
                                   onChange={(e) => updateProps({className: e.target.value})}/>
                        </div>
                    }
                </div>
                <div>
                    {
                        blockProps.additional_props ?
                            Object.entries(blockProps.additional_props).map(([key, value]) => {
                                switch (typeof value) {
                                    case "string":
                                        return (
                                            <div className={"flex flex-col p-2 gap-0.5"} key={key}>
                                                <span>{key}</span>
                                                <input type={"text"} defaultValue={value}
                                                       onChange={(e) => updateProps({additional_props: {[key]: e.target.value}})}
                                                       name={key} className={"p-1 bg-gray-200 rounded-xl"}/>
                                            </div>
                                        )
                                    case "number":
                                        return (
                                            <div className={"flex flex-col p-2 gap-0.5"} key={key}>
                                                <span>{key}</span>
                                                <input type={"number"} defaultValue={value}
                                                       onChange={(e) => updateProps({additional_props: {[key]: e.target.value}})}
                                                       name={key}
                                                       className={"p-1 bg-gray-200 rounded-xl"}/>
                                            </div>
                                        )
                                    case "boolean":
                                        return (
                                            <div className={"flex flex-row p-2 gap-0.5"} key={key}>
                                                <span>{key}</span>
                                                <input type={"checkbox"} checked={value}
                                                       onChange={(e) => updateProps({additional_props: {[key]: e.target.checked}})}
                                                       name={key}
                                                       className={"p-1 bg-gray-200 rounded-xl"}/>
                                            </div>
                                        )
                                    default:
                                        console.log("data type unsupported! (value of):" + value)
                                }
                            })

                            : null
                    }
                </div>
            </div>
            <div className={"w-full"}>
                {/*
                    blockProps.children_ids &&
                    <div className={"p-4 bg-gray-200 rounded-xl"}>
                        {
                            <SortableContext items={blockProps.children_ids} strategy={verticalListSortingStrategy}>
                                {blockProps.children_ids.length > 0 ?
                                    blockProps.children_ids.map((id) => {
                                        const block = page_blocks[id]
                                        return <BlockEdit block={block} page_id={page_id} key={block.props.id}/>
                                    })
                                    :
                                    "empty" //TODO: finish multiple contexts and nested sortables
                                }
                                {
                                    //blockProps.children_ids.map((id) => <div key={id}>{id}</div>)
                                }
                            </SortableContext>
                        }
                    </div>
                    */
                }
            </div>
        </div>
    )
}
