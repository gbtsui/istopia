import {JSX} from "react";
import {BlockProps, ContainerProps} from "@/app/types";
import SimpleText from "@/app/engine/engine-components/simple-text";
import Typewriter from "@/app/engine/engine-components/typewriter";
import Root from "@/app/engine/engine-components/root";

type BlockInfo<T extends BlockProps> = {
    block_name: string;
    block_component: (props: T) => JSX.Element;
    block_description: string;
    block_props: T,
    visible: boolean;
}

//in every usage of BlockList PLEASE PLEASE PLEASE INITIALIZE ID
export const BlockList: Array<BlockInfo<BlockProps> | BlockInfo<ContainerProps>> = [
    {
        block_name: "root",
        block_component: Root,
        block_description: "the root of a page.",
        block_props: {
            id: "",
            friendly_name: "root",
            content: [],
            className: "",
            listeners: [],
            page_blocks: {} //ALWAYS INITIALIZE!!!!!!!!
        },
        visible: false
    },
    {
        block_name: "text",
        block_component: SimpleText,
        block_description: "a simple chunk of text. surprisingly powerful",
        block_props: {
            id: "",
            friendly_name: "text",
            content: [],
            className: "",
            listeners: [],
            additional_props: {}
        },
        visible: true
    },
    {
        block_name: "typewriter",
        block_component: Typewriter,
        block_description: "text written using a typewriter effect. letters appear in sequence.",
        block_props: {
            id: "",
            friendly_name: "typewriter",
            content: [],
            className: "",
            listeners: [],

            additional_props: {
                characterDelay: 25,
                lineDelay: 1000,
                manual: false,
            },
        },
        visible: true
    }
] //ALWAYS INITIALIZE IDS