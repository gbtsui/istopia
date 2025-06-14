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
    id: number,
    piece_id: number,
    author_id: string,
}

export interface BlockProps<T extends Record<string, string|boolean|number> = Record<string, string|boolean|number>> {
    id: string, //why am i having this in here twice?
    content?: string[];
    className?: string;
    listeners: Array<EngineEventListener>

    additional_props?: T//Record<string, string | boolean | number>
} //modularize this maybe?

export interface ContainerBlockProps extends BlockProps {
    children: Array<Block>
}

export interface Block {
    type: string,
    props: BlockProps
}

export interface Page {
    blocks: Array<Block>,
    page_number: number,
}

export interface PieceContent {
    pages: Array<Page>
}

export type Result<T> = {success: true, data: T} | {success: false, error: string}