"use client";

import {Block} from "@/app/types";
import Sortable from "@/app/component/editor/state/sortable";

type BlockEditProps = {
    block: Block;
}

export default function BlockEdit(props:BlockEditProps){
    const {block} = props;

    

    return (
        <Sortable id={block.id} content={block.type} key={block.id}
                  className={"p-2 m-2 bg-white rounded-lg text-black"}>
            <div></div>
            <textarea className={"p-0.5 w-full"} placeholder={"write some text..."}
                      defaultValue={block.props.content?.toString()} contentEditable={true}/>
        </Sortable>
    )
}