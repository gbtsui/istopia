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
    const {dialogIsOpen, setDialogIsOpen} = props;
    const addBlock = useEditorStore((state) => state.addBlock);
    const [selectedBlock, setSelectedBlock] = useState<Block | null>(null)

    if (!dialogIsOpen) {return null}
    return (
        <div className={"absolute w-full h-full bg-black backdrop-opacity-50"}>
            <div className={"w-1/2 m-3 p-3"}>
                <button onClick={() => setDialogIsOpen(false)}>Close</button>
                <div>
                    content :3
                </div>
            </div>
        </div>
    )
}

//i just lost my dawg
//and my brother taught me how to chase the bag