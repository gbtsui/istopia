"use client";

import {ContainerProps} from "@/app/types";
import RenderBlock from "@/app/engine/render-block";
import {useEngineContext} from "@/app/engine/engine-context";

export default function SimpleContainer(props: ContainerProps) {
    const {children_ids, className} = props;
    const engine = useEngineContext()
    const page_blocks = engine.pages[engine.currentPage].blocks;
    return <div className={className}>
        {
            (children_ids || []).map(id => {
                const block = page_blocks[id];
                return <RenderBlock block={block} key={id}/>
            })
        }
    </div>;
}