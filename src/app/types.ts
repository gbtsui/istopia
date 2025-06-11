import {EngineEventListener} from "@/app/engine";

export interface PublicUser {
    name?: string,
    display_name?: string,
    summary_text?: string | null,
    created_at?: Date,
    about_me: string | null,
    profile_picture_link?: string | null,
}

export interface DatabaseUser extends PublicUser {
    id: string,
    email: string,
    password: string,
    //pieces: Piece[],
    //comments: Comment[],
}

export interface PieceData {
    id: string,
    author_id: string,
    title: string,
    slug: string,
    summary: string,
    published: boolean,
    rating?: number | null,
    views: number,
    created_at: Date,
    last_updated: Date,
    content: PieceContent,
}

export interface PieceMetaData {
    id: string,
    author_id: string,
    author_name: string,
    title: string,
    slug: string,
    summary: string,
}

export interface CommentData {
    id: string, //uuid
    piece_id: string,
    author_id: string,
    author_name: string,
    content: string[],
    rating: number | null,
    upvotes: number,
    downvotes: number,
} //why thank you kind redditor

export interface BlockProps<T extends Record<string, string|boolean|number> = Record<string, string|boolean|number>> {
    id: string, //why am i having this in here twice?
    friendly_name: string, //whatever the user wants to call the block, defaults to type plus first 6 chars of id
    content?: string[]; //split a raw string by \n and reconstruct with \n
    className?: string; //maybe create a tailwind parser in the future?
    listeners: Array<EngineEventListener>

    //children?: Array<Block>
    children_ids?: string[], //makes shallow structure easier. also ordered!
    parent_id?: string, //if it's in the top level then this should be "root". root should have a nulled value
    additional_props?: T //additional props can be any {[k: string]: v} :3
}

export interface ContainerProps<T extends Record<string, string|boolean|number> = Record<string, string|boolean|number>> extends BlockProps {
    page_blocks: Record<string, Block>
    additional_props?: T
}

export interface Block {
    type: string,
    props: BlockProps
}

export interface Page {
    //blocks: Array<Block>,
    blocks: Record<string, Block> //Always initialize with an immutable "root" block so that every block has a parent and the system doesn't explode on itself!
    //page_number: number, //not sure if this can just be substituted for index tbh
    friendly_name: string, //user-friendly name!! defaults to "page" plus first 6 chars of uuid
    id: string //uuid,
    outward_connections: string[]
    is_first: boolean,

    flow_node_data: PageNode
}

//so apparently reactflow wants me to have a certain node object type
export interface PageNode {
    id: string, //copy from page.id
    position: {x: number, y: number}, //are we persisting this...?
    data: {label: string}, //should just be friendly_name
    type?: "input" | undefined //only one input needed btw! entry point or first page
}
export interface PageNodeEdge {

} //stop edging pls

export interface PieceContent {
    //pages: Array<Page>
    pages: Record<string, Page>
}

export type Result<T> = {success: true, data: T} | {success: false, error: string}