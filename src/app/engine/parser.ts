"use server";

export interface BlockProps {
    text: string[];
}

export interface Page {
    blocks: Array<Block>
}

export interface Block {
    type: string,
    styling: string,
    children?: Array<Block>,
    props: BlockProps
}

export interface PieceContentSchema {
    pages: Array<Page>
}

/*
export default async function Parse(data: PieceContentSchema): Promise<PieceContentSchema> {

    const piece_content: PieceContentSchema = data as unknown as PieceContentSchema;
    console.log(JSON.stringify(piece_content));
    return piece_content;
    //no clue if any of this works???
}
 */
//NEVERMIND WE DONT EVEN NEED A PARSER ANYWAYS BECAUSE THE DATA WILL ALREADY BE IN PIECECONTENTSCHEMA FORM

//so ideally the parser takes the raw json data and converts it into block data? which then gets passed to the renderer which actually renders the data, which gets passed to the engine to do stuff