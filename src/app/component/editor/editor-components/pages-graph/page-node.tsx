"use client";

import {Page} from "@/app/types";
import {ChangeEventHandler, useCallback, useState} from "react";
import {Node, NodeProps, Handle, Position} from "@xyflow/react";

type PageFlowNode = Node<{page: Page}, "page">

export default function PageFlowNode({data}: NodeProps<PageFlowNode>) {
    const {page} = data;
    const [friendlyName, setFriendlyName] = useState<string>(page.friendly_name);
    const onChange: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
        setFriendlyName(event.target.value);
        //also handle updating to zustand here btw :)
    }, [setFriendlyName]);

    return (
        <div>
            {
                !page.is_first && <Handle type={"target"} position={Position.Left}/>
            }
            <div>
                <input value={friendlyName} placeholder={"page name"} onChange={onChange} type="text" className={"nodrag"}/>
            </div>
            <Handle type={"source"} position={Position.Right}/>
        </div>
    )
}