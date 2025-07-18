"use client";

import {ContainerProps} from "@/app/types";
import RenderBlock from "@/app/engine/render-block";
import {useEngineContext} from "@/app/engine/engine-context";
import {useCallback, useEffect} from "react";

export const RootActions = ["switchPage"]
export default function Root(props: ContainerProps) {
    const {children_ids} = props;
    const engine = useEngineContext()
    const page_blocks = engine.pages[engine.currentPage].blocks;

    const switchPage = (page_id: string) => {
        engine.setCurrentPage(page_id);
    }

    const handler = useCallback((action: string, value: string | number | boolean | undefined | null) => {
        switch (action) {
            case "switchPage":
                if (typeof value === "string") {
                    return switchPage(value);
                }
                return console.warn("Invalid argument of type " + (typeof value) + "(" + value + ") was passed to Root.")
            default:
                console.warn("A nonexistent action was passed to root: ", action)
        }
    }, [switchPage]);

    useEffect(() => {
        engine.registerBlock(props.id, handler)

        for (const listener of props.listeners) {
            engine.listen(listener)
        }

        return () => {
            engine.unregisterBlock(props.id);
        }
    })

    return (
        <div>{
            (children_ids || []).map(id => {
                const block = page_blocks[id];
                return <RenderBlock block={block} key={id}/>
            })
        }</div>
    )
}