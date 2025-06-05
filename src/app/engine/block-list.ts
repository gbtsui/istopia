import {JSX} from "react";
import {BlockProps} from "@/app/types";
import SimpleText from "@/app/engine/engine-components/simple-text";
import Typewriter from "@/app/engine/engine-components/typewriter";

type BlockInfo<T extends BlockProps = BlockProps> = {
    block_name: string;
    block_component: (props: T) => JSX.Element;
    block_description: string;
    block_props: T,
}

//in every usage of BlockList PLEASE PLEASE PLEASE INITIALIZE ID
export const BlockList: BlockInfo[] = [
    {
        block_name: "text",
        block_component: SimpleText,
        block_description: "a simple chunk of text. surprisingly powerful",
        block_props: {
            id: "",
            content: [],
            className: "",
            listeners: [],
            additional_props: {}
        }
    },
    {
        block_name: "typewriter",
        block_component: Typewriter,
        block_description: "text written using a typewriter effect. letters appear in sequence.",
        block_props: {
            id: "",
            content: [],
            className: "",
            listeners: [],

            additional_props: {
                characterDelay: 25,
                lineDelay: 1000,
                manual: false,
            }

        }
    }

] //ALWAYS INITIALIZE IDS