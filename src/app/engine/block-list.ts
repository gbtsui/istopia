import {JSX} from "react";
import {Block, BlockProps} from "@/app/types";
import SimpleText from "@/app/engine/engine-components/simple-text";

type BlockInfo = {
    block_name: string;
    block_component: (props: BlockProps) => JSX.Element;
    block_props: BlockProps
}

export const BlockList: BlockInfo[] = [
    {
        block_name: "text",
        block_component: SimpleText,
        block_props: {
            content: [],
            className: ""
        }
    }

]