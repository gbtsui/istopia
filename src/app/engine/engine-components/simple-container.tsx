"use client";

import {ContainerBlockProps} from "@/app/types";
import RenderBlock from "@/app/engine/render-block";

export default function SimpleContainer({props}: {props: ContainerBlockProps}) {
    const {children, className} = props;
    console.log(children);
    console.log(className)
    return <div className={className}>{children.map((block, id) => <RenderBlock key={id} block={block}/>)}</div>;
}