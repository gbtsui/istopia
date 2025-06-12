"use client"

import {Block, BlockProps} from "@/app/types";
import {SortableContext} from "@dnd-kit/sortable";
import BlockEdit from "@/app/component/editor/editor-components/blocks/block-edit";

type BlockEditFieldsProps = {
    blockProps: BlockProps,
    page_id: string,
    page_blocks: Record<string, Block>,
    updateProps: (newProps: Partial<BlockProps>) => void
}

export default function BlockEditFields(props: BlockEditFieldsProps) {
    const {blockProps, page_blocks, page_id, updateProps} = props

    return (
        <div className={"flex flex-row "}>
            {
            }
            <div className={`${blockProps.additional_props ? "w-1/2" : "w-full"}`}>
                {blockProps.content !== undefined &&
                    <textarea className={"p-1 bg-gray-200 rounded-xl outline-0 w-full resize-none"} placeholder={"write some text..."}
                              value={blockProps.content.join("\n")} contentEditable={true}
                              onChange={(e) => updateProps({content: e.target.value.split("\n")})}/>
                }
                {
                    blockProps.className !== undefined &&
                    <input type={"text"} className={"p-0.5 w-full"} placeholder={"className..."}
                           onChange={(e) => updateProps({className: e.target.value})}/>
                }
            </div>
            <div>
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
                                    console.log("data type unsupported! (value of):" + value)
                            }
                        })

                        : null
                }
            </div>
            <div>
                {blockProps.children_ids !== undefined &&
                    <SortableContext items={blockProps.children_ids}>
                        {blockProps.children_ids.length > 0 ?
                            blockProps.children_ids.map((id) => {
                                const block = page_blocks[id]
                                return <BlockEdit block={block} page_id={page_id}/>
                            })
                        :
                            "no blocks found here!" //TODO: finish multiple contexts and nested sortables
                        }
                    </SortableContext>
                }
                {/*blockProps.children !== undefined && blockProps.children.map(block => (
                    <BlockEdit block={block} key={block.props.id} page_number={page_number}/>
                )) */}
            </div>
        </div>
    )
}