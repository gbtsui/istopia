"use client";

import {PageNodeData, PageNodeEdge} from "@/app/types";

type DeletePageDialogProps = {
    handleResponse: (arg: boolean) => void, //yaaargh swab the poop deck
    deletedPages: PageNodeData[],
    deletedConnections: PageNodeEdge[],
    allPages: PageNodeData[],
}

export default function DeletePageDialog(props: DeletePageDialogProps) {
    return (
        <div className={"fixed inset-0 items-center justify-center flex z-50 w-full h-full bg-black/75 text-white backdrop-blur-md"}>
            <div className={"w-1/2 m-3 p-3 bg-gray-700 rounded-2xl"}>
                <div className={"text-center text-2xl"}>delete page?</div>
                <p>are you sure you want to delete the following? you can't undo this operation!</p>
                <ul>
                    {props.deletedPages.map((node) => (
                        <li key={node.id}>{node.data["friendly_name"] as string}</li>
                    ))}
                    {props.deletedConnections.map((edge) => (
                        <li key={edge.id}>
                            Connection
                            between {props.allPages.find((pg) => pg.id === edge.source)?.data["friendly_name"] as string ?? 'edge.source'}
                        </li>
                    ))}
                </ul>
                <div className={"flex justify-evenly"}>
                    <button onClick={() => props.handleResponse(false)} className={"p-3 bg-black text-white rounded-xl"}>cancel</button>
                    <button onClick={() => props.handleResponse(true)} className={"p-3 bg-red-500 text-white rounded-xl"}>delete</button>
                </div>
            </div>
        </div>
    )
}