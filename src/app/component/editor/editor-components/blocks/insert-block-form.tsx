"use client"

import {useEditorStore} from "@/app/component/editor/state/zustand";
import {BlockList} from "@/app/engine/block-list";
import {Block} from "@/app/types";
import {useState} from "react";

type InsertBlockFormProps = {
    dialogIsOpen: boolean;
    setDialogIsOpen: (value: boolean) => void;
    page_id: string
}

export default function InsertBlockForm(props: InsertBlockFormProps) {
    const {dialogIsOpen, setDialogIsOpen, page_id} = props;
    const addBlock: (page_id: string, newBlock: Block) => void = useEditorStore((state) => state.addBlock);
    const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)

    if (!dialogIsOpen) {
        return null
    }
    return (
        <div
            className={"fixed inset-0 items-center justify-center flex z-50 w-full h-full bg-black/50 backdrop-blur-md"}>
            <div className={"w-1/2 m-3 p-3 bg-gray-700 rounded-2xl"}>
                <button onClick={() => setDialogIsOpen(false)} className={"p-4 bg-black rounded-2xl"}>x</button>
                <div className={"overflow-auto h-60 flex flex-wrap"}>
                    {BlockList.map((block) => {
                        if (!block.visible) return null
                        return (

                        <button onClick={() => setSelectedBlock({
                            type: block.block_name,
                            props: block.block_props
                        })}
                                key={block.block_name} className={"w-full"}>
                            <div className={"p-2 m-2 bg-gray-600 rounded-xl"}>
                                <span className={"text-xl justify-self-start"}>{block.block_name}</span>
                                <p className={"text-sm"}>{block.block_description}</p>
                            </div>
                        </button>
                    )})}
                </div>
                <div>
                    <p>{selectedBlock ? selectedBlock.type : "select a block"}</p>
                    <button disabled={selectedBlock === null}
                            onClick={() => {
                                if (selectedBlock) {
                                    const id = crypto.randomUUID()
                                    addBlock(page_id, {...selectedBlock, props: {...selectedBlock.props, id, friendly_name: `${selectedBlock.type} ${id.slice(0, 6)}`}});
                                    setDialogIsOpen(false);
                                    setSelectedBlock(null);
                                }
                            }}
                            className={"p-2 mx-2 text-center bg-black rounded-xl"}>
                        add block
                    </button>
                </div>
            </div>
        </div>
    )
}

//i just lost my dawg
//and my brother taught me how to chase the bag