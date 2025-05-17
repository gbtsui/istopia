export interface PublicUser {
    name?: string,
    display_name: string,
    summary_text: string | null,
    created_at?: Date,
    about_me: string | null
}

export interface DatabaseUser extends PublicUser {
    id: string,
    email: string,
    password: string,
    //pieces: Piece[],
    //comments: Comment[],
}

export interface PieceData {
    id: number,
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

export interface CommentData {
    id: number,
    piece_id: number,
    author_id: string,
}

export interface BlockProps {
    content: string[];
    className?: string;
    //children?: Array<Block>
}

export interface ContainerBlockProps extends BlockProps {
    children: Array<Block>
} // for if a block is a ParentBlock?? i guess?? parentblocks dont exist yet tho...

export interface Block {
    type: string,
    //styling: string,
    //children?: Array<Block>,
    props: BlockProps
}

export interface Page {
    blocks: Array<Block>
}

export interface PieceContent {
    pages: Array<Page>
}