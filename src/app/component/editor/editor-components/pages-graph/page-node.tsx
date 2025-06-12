"use client";

import {Page} from "@/app/types";
import {ChangeEventHandler, useCallback, useState} from "react";
import {Handle, Position} from "@xyflow/react";

type PageFlowNodeProps = {
    page:Page
}

export default function PageFlowNode(props: PageFlowNodeProps) {
    const {page} = props;
    const [friendlyName, setFriendlyName] = useState<string>(page.friendly_name);
    const onChange: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
        setFriendlyName(event.target.value);
    }, [])

    return (
        <div>
            <Handle type={"target"} position={Position.Left}/>
            <div>
                <input value={friendlyName} placeholder={"page name"} onChange={onChange} type="text" className={"nodrag"}/>
            </div>
            <Handle type={"source"} position={Position.Right}/>
        </div>
    )
}