"use client";

import {ContainerBlockProps} from "@/app/types";
import {RenderBlock} from "@/app/engine/renderer";

export default function SimpleContainer(props: ContainerBlockProps) {
    const {children, className} = props;

    return <div className={className}>{children.map((block) => <RenderBlock block={block}/>)}</div>;
}