"use client";

import {Block, ContainerBlockProps} from "@/app/types";
import {JSX} from "react";
import SimpleText from "@/app/engine/engine-components/simple-text";
import Typewriter from "@/app/engine/engine-components/typewriter";
import SimpleContainer from "@/app/engine/engine-components/simple-container";

export default function RenderBlock({block}: {block:Block}): JSX.Element | null {
    switch (block.type) {
        case "text":
            return <SimpleText {...block.props}/>
        case "typewriter":
            return <Typewriter {...block.props}/>
        case "simple-container":
            return <SimpleContainer {...block.props as ContainerBlockProps}/>
        default:
            return null
    }
}