"use client";

import {ChangeEventHandler, useCallback, useState} from "react";
import {Node, NodeProps, Handle, Position} from "@xyflow/react";
import {useEditorStateStore, useEditorStore} from "@/app/component/editor/state/zustand";

type PageFlowNode = Node<{friendly_name: string, is_first: boolean, page_id: string}, "page">


export default function PageFlowNode({data}: NodeProps<PageFlowNode>) {
    const [friendlyName, setFriendlyName] = useState<string>(data.friendly_name);
    const editPage = useEditorStore((state) => state.editPage);
    const setCurrentPage = useEditorStateStore((state) => state.setPage)
    const onChange: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
        setFriendlyName(event.target.value);
        editPage(data.page_id, {friendly_name: event.target.value});
        //also handle updating to zustand here btw :)
    }, [setFriendlyName, editPage, data.page_id]);

    const onClick = () => {
        console.log("onClick running, args:", data.page_id)
        setCurrentPage(data.page_id)
    }

    return (
        <div>
            {
                !data.is_first && <Handle type={"target"} position={Position.Left}/>
            }
            <div className={"p-3 bg-gray-200 w-48 h-36 flex text-black text-center rounded-lg "}>
                <div>
                    <input value={friendlyName} placeholder={"page name"} onChange={onChange} type="text"
                           className={"nodrag w-full text-center bg-white outline-none p-2 border-1 border-gray-300 rounded-sm"} />
                </div>
                <button className={"material-symbols-outlined nodrag"} onClick={onClick}>edit</button>
            </div>
            <Handle type={"source"} position={Position.Right}/>
        </div>
    )
}