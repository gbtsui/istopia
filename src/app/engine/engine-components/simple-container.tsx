"use client";

import {ContainerProps} from "@/app/types";
import RenderBlock from "@/app/engine/render-block";

export default function SimpleContainer(props: ContainerProps) {
    const {children_ids, page_blocks, className} = props;
    return <div className={className}>
        {
            (children_ids || []).map(id => {
                const block = page_blocks[id];
                return <RenderBlock block={block} key={id}/>
            })
        }
    </div>;
}