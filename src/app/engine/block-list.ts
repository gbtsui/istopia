import {JSX} from "react";
import {BlockProps} from "@/app/types";
import SimpleText from "@/app/engine/engine-components/simple-text";
import Typewriter from "@/app/engine/engine-components/typewriter";

type BlockInfo<T extends BlockProps = BlockProps> = {
    block_name: string;
    block_component: (props: T) => JSX.Element;
    block_props: T,
}

export const BlockList: BlockInfo<any>[] = [
    {
        block_name: "text",
        block_component: SimpleText,
        block_props: {
            content: [],
            className: ""
        }
    },
    {
        block_name: "typewriter",
        block_component: Typewriter,
        block_props: {
            content: [],
            className: "",
            characterDelay: 25,
            lineDelay: 1000,
            manual: false,

            triggers: []
        }
    }

]