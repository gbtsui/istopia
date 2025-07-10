"use client";

import {Handle, Node, NodeProps, Position} from "@xyflow/react";
import {BlockActionDescription, BlockActionsList, BlockEventsList} from "@/app/engine/block-list";

type BlockFlowNodeProps = Node<{
    friendly_name: string,
    type: string
    //events: string[], //right side - emitted events
    //actions: Record<string, BlockActionDescription>[] //left side - actions to take
}>

export default function BlockFlowNode(props: NodeProps<BlockFlowNodeProps>) {
    const actions_record = BlockActionsList[props.type]
    //const events_record = BlockEventsList[props.type]

    const actions_list = Object.keys(actions_record)

    return (
        <div style={{
            background: "#eee",
            position: "relative"
        }} className={"min-w-36 min-h-48 flex flex-row items-center rounded-2xl"}>
            <div style={{
                display: "flex",
                height: "100%",
                left: 0,
                flexDirection: "column",
                top: 0,
                justifyContent: "space-evenly"
            }} className={"w-full h-full items-start"}>
                {
                    actions_list.map((action) => {
                        //const action_data = BlockActionsList[action];
                        return (
                            <div key={action} className={"text-black text-center flex items-center"}>
                                <Handle type={"target"} position={Position.Left} id={action}
                                        style={{
                                            position: "absolute",
                                            transform: "none",
                                            top: "auto",
                                            padding: 3,
                                            left: -5,
                                        }}/>
                                <p className={"m-1.5"}>{action}</p>
                            </div>
                        )
                    })
                }
                {/*props.data.actions.map((actionObject) => {
                    return Object.keys(actionObject).map((actionName) => {
                        return (
                            <div key={actionName} className={"text-black text-center flex items-center"}>
                                <Handle type={"target"} position={Position.Left} id={actionName}
                                        style={{
                                            position: "absolute",
                                            transform: "none",
                                            top: "auto",
                                            padding: 3,
                                            left: -5,
                                        }}/>
                                <p className={"m-1.5"}>{actionName}</p>
                            </div>
                        )
                    })
                })*/}
            </div>

            <div className={"p-3 bg-gray-200 flex text-black text-center grow rounded-lg"}>
                <div>{props.data.friendly_name}</div>
            </div>

            <div style={{
                display: "flex",
                //position: "absolute",
                height: "100%",
                right: 0,
                flexDirection: "column",
                top: 0,
                justifyContent: "space-evenly"
            }} className={"w-full items-end"}>
                {/*props.data.events.map((event) => (
                    <div key={event} className={"text-black text-center flex items-center"}>
                        <p className={"m-1.5"}>{event}</p>
                        <Handle type={"source"} position={Position.Right} id={event}
                                style={{
                                    position: "absolute",
                                    transform: "none",
                                    top: "auto",
                                    padding: 3,
                                    right: -5,
                                }}/>
                    </div>
                ))*/}
            </div>
        </div>
    )
}