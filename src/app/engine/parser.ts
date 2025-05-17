"use server";

import {Piece} from "@/generated/prisma"

export interface BlockProps {
    text: string[];
}

export interface Page {
    blocks: Array<Block>
}

export interface Block {
    type: string,
    styling: string,
    children: Array<Block>,
    props: BlockProps
}

export default async function Parse(data: Piece) {

}

//so ideally the parser takes the raw json data and converts it into block data? which then gets passed to the renderer which actually renders the data, which gets passed to the engine to do stuff