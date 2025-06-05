"use client"

import {useEditorStore} from "@/app/component/editor/state/zustand";
import {BlockList} from "@/app/engine/block-list";
import {Block} from "@/app/types";
import {useState} from "react";

type InsertBlockFormProps = {
    dialogIsOpen: boolean;
    setDialogIsOpen: (value: boolean) => void;
    page_number: number;
}

export default function InsertBlockForm(props: InsertBlockFormProps) {
    const {dialogIsOpen, setDialogIsOpen, page_number} = props;
    const addBlock: (page_number: number, newBlock: Block) => void = useEditorStore((state) => state.addBlock);
    const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)

    if (!dialogIsOpen) {
        return null
    }
    return (
        <div className={"absolute w-full h-full bg-black backdrop-opacity-50"}>
            <div className={"w-1/2 m-3 p-3"}>
                <button onClick={() => setDialogIsOpen(false)}>Close</button>
                <div className={"overflow-scroll h-60 flex flex-wrap"}>
                    {BlockList.map((block) => (
                        <div className={"p-2 m-2 bg-black rounded-xl w-full"}>
                            <button onClick={() => setSelectedBlock({
                                type: block.block_name,
                                props: {...block.block_props, id: crypto.randomUUID()}
                            })}>{block.block_name}</button>
                        </div>
                    ))}
                </div>
                <div>
                    <p>{selectedBlock ? selectedBlock.type : "select a block"}</p>
                    <button disabled={selectedBlock === null}
                            onClick={() => {
                                if (selectedBlock) {
                                    addBlock(page_number, selectedBlock);
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