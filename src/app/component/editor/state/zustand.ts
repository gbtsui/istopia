import {create} from "zustand"
import {PieceContent, Block, BlockProps, Result, Page} from "@/app/types";
import FetchPieceData from "@/app/engine/fetcher";
import UpdatePieceContent from "@/app/api/data/pieces/update-piece-content";

interface EditorProps {
    content: PieceContent,
}

export interface EditorStore extends EditorProps {
    setContent: (content: PieceContent) => void,

    addPage: (is_first: boolean, coordinates: {x: number, y: number}) => void,

    addRootBlock: (page_id: string) => void,
    addBlock: (page_id: string, newBlock: Block) => void,

    reorderBlock: (page_id: string, block_id: string, new_parent_id: string, new_position: number) => void,

    deleteBlock: (page_id: string, block_id: string) => void,
    deletePage: (page_id: string) => void,

    editBlock: (page_id: string, block_id: string, new_props: BlockProps) => void,
    editPage: (page_id: string, new_data: Partial<Page>) => void,
    setPageCoordinates: (page_id: string, coordinates: {x: number, y: number}) => void,

    publishContent: (username: string, piece_id: string) => Promise<Result<null>>

    fetchContent: (id: string) => Promise<void>,
    saveContent: (username: string, piece_id: string) => Promise<Result<Date>>
}

export const useEditorStore = create<EditorStore>((set, get) => ({
    content: {pages: {}},
    setContent: (content) => {
        return set({content})
    },

    addPage: (is_first: boolean = false, coordinates: {x: number, y: number}) => {
        const id = crypto.randomUUID()
        const {content} = {...get()}
        const pages = {...content.pages}
        pages[id] = {
            blocks: {},
            id,
            friendly_name: `Page ${id.split("").slice(0, 4).join("")}`,
            outward_connections: [],
            is_first: is_first,

            flow_node_data: {
                id,
                position: coordinates, //TODO: make this dynamic
                data: {
                    friendly_name: `Page ${id.split("").slice(0, 4).join("")}`,
                    page_id: id,
                    is_first: is_first,
                },
                type: "pageNode"
            }
        }
        console.log("zustand pages:", pages)
        return set({content: {pages}})

        /*return set((state) => ({
            content: {
                pages: [...state.content.pages, newPage]
            }
        }))*/
    },

    editPage: (page_id: string, new_data: Partial<Page>)=> {
        const {pages} = {...get().content}
        const friendly_name = new_data.friendly_name ?? pages[page_id].friendly_name
        const is_first = new_data.is_first as boolean ?? pages[page_id].is_first
        const new_flow_node_data = {friendly_name, is_first, id: pages[page_id].id}
        pages[page_id] = {...new_data, ...pages[page_id], friendly_name, is_first, flow_node_data: {...pages[page_id].flow_node_data, data: new_flow_node_data}};
        return set({content: {pages}})
    }, //this is some of the worst code i've ever written; Lord Jesus Christ Son of God have mercy upon me a sinner

    setPageCoordinates: (page_id: string, coordinates: {x: number, y: number})=> {
        const {pages} = {...get().content}
        pages[page_id].flow_node_data.position = coordinates;
        return set({content: {pages}})
    },

    addRootBlock: (page_id: string) => {
        const {pages} = {...get().content}
        const current_page = pages[page_id]
        current_page.blocks["root"] = {
            type: "root",
            props: {
                id: "root",
                friendly_name: "root",
                listeners: [],
                children_ids: []
            }
        }

        pages[current_page.id] = current_page
        return set({content: {pages}})
    },

    addBlock: (page_id, newBlock) => {
        const {pages} = {...get().content}
        const current_page = pages[page_id]
        current_page.blocks[newBlock.props.id] = newBlock
        const root = current_page.blocks["root"]
        root.props.children_ids?.push(newBlock.props.id)
        current_page.blocks["root"] = root
        pages[current_page.id] = current_page
        return set({content: {pages}})
        /*return set((state) => {
            const updatedPages = state.content.pages.map((page) => {
                if (page.page_number === page_number) {
                    const blocks = page.blocks
                    blocks[newBlock.props.id] = newBlock
                    return {
                        ...page,
                        blocks: blocks
                    };
                }
                return page;
            });

            return {
                content: {
                    pages: updatedPages
                }
            }
        })*/
    },

    editBlock: (page_id, block_id, new_props) => {
        const {pages} = {...get().content}
        const block = pages[page_id].blocks[block_id]
        if (!block) throw new Error("block not found?")
        block.props = new_props
        pages[page_id].blocks[block_id] = block
        return set({content: {pages}})


        /*return set((state) => {
            const updatedPages = state.content.pages.map((page) => {
                if (page.page_number === page_number) {
                    const block = page.blocks[block_id];
                    if (!block) return page
                    block.props = new_props
                    const updatedPage = page
                    updatedPage.blocks[block_id] = block
                    return updatedPage
                }
                return page
            })

            return {
                content: {
                    pages: updatedPages
                }
            }
        })
        */
    },

    reorderBlock: (page_id, block_id, new_parent_id, new_position) => {
        const {pages} = {...get().content};
        const current_page = pages[page_id];
        const current_block = current_page.blocks[block_id]

        if (!current_block) throw new Error("block not found?")
        if (current_block.props.id === "root") return set({content: {pages}})

        const block_parent_id = current_block.props.parent_id as string
        const block_parent = current_page.blocks[block_parent_id];
        const children_ids = block_parent.props.children_ids || []
        const index = children_ids.findIndex((b) => b === block_id)
        children_ids.splice(index, 1)

        const new_parent = current_page.blocks[new_parent_id]
        if (!new_parent) throw new Error("new parent block not found?")

        if (new_parent_id === block_parent_id) {
            children_ids.splice(new_position, 0, block_id)
        } else {
            (new_parent.props.children_ids || []).splice(new_position, 0, block_id)
        }


        block_parent.props.children_ids = children_ids
        current_page.blocks[block_parent_id] = block_parent
        current_page.blocks[new_parent_id] = new_parent
        pages[page_id] = current_page
        return set({content: {pages}})

        /*return set((state) => {
            const updatedPages = state.content.pages.map((page) => {
                if (page.page_number === page_number) {
                    const blockIndex = page.blocks.findIndex((b) => b.props.id === block_id);
                    if (blockIndex === -1) return page;

                    const updatedBlocks = [...page.blocks];
                    const [block] = updatedBlocks.splice(blockIndex, 1);
                    updatedBlocks.splice(new_position, 0, block);
                    return {
                        ...page,
                        blocks: updatedBlocks
                    }
                }
                return page;
            })

            return {
                content: {
                    pages: updatedPages
                }
            }
        })*/
    },

    deleteBlock: (page_id: string, block_id: string) => {
        const {pages} = {...get().content};
        const page = pages[page_id];
        delete page.blocks[block_id];
        //pages[page_id] = {...page, [block_id]: undefined};
        pages[page_id] = page
        return set({content: {pages}})
        /*return set((state) => {
            const updatedPages = state.content.pages.map((page) => {
                if (page.page_number !== page_number) return page;

                const updatedBlocks = page.blocks.filter((b) => b.props.id !== block_id);
                return {...page, blocks: updatedBlocks}
            })
            return {
                content: {
                    pages: updatedPages
                }
            }
        })*/
    },

    deletePage: (page_id: string) => {
        const {pages} = {...get().content};
        delete pages[page_id];
        return set({content: {pages}})

        /*return set((state) => {
            const pageIndex = state.content.pages.findIndex((p) => p.page_number === page_number);
            if (pageIndex === -1) return {};
            const updatedPages: Array<Page> = [...state.content.pages];
            const removed_pages: Array<Page> = updatedPages.splice(pageIndex);
            removed_pages.shift()
            const updatedRemovedPages: Array<Page> = removed_pages.map((p: Page) => {
                return {
                    ...p,
                    page_number: p.page_number - 1
                }
            })
            const final = updatedPages.concat(updatedRemovedPages)
            return {
                content: {
                    pages: final
                }
            }
        })*/
    },

    publishContent: async (username: string, piece_id: string): Promise<Result<null>> => {
        const {content} = {...get()}
        try {
            await UpdatePieceContent({username, piece_id, piece_content: content, published: true})
            return {success: true, data: null}
        } catch (error) {
            if (error instanceof Error) return {success: false, error: error.message}
            return {success: false, error: "unknown error occurred"}
        }
    },

    saveContent: async (username: string, piece_id: string) => {
        console.log("zustand save content called")
        const {content} = get()
        const result = await UpdatePieceContent({username, piece_id, piece_content: content});
        console.log(result)
        return result
    },

    //will probably never have to use this actually
    fetchContent: async (id) => {
        const result = await FetchPieceData({id})
        return set(() => {
            return {...result}
        })
    },


}))

export interface EditorMetaDataProps {
    piece_id: string,
    author_id: string,
    author_name: string,
    title: string,
    slug: string,
    summary: string,
    published: boolean,
}

export interface EditorMetaDataMethods {
    setData: (data: EditorMetaDataProps) => void
}

export type EditorMetaDataStore = EditorMetaDataProps & EditorMetaDataMethods

export const useEditorMetaDataStore = create<EditorMetaDataStore>((set, get) => ({
    piece_id: "",
    author_id: "",
    author_name: "",
    title: "",
    slug: "",
    summary: "",
    published: false,

    setData: (data: Partial<EditorMetaDataProps>) => {
        return set({...data})
    }
}))

export type EditorStateStore = {
    current_page?: string | null,
    setPage: (page: string|null) => void,
}

export const useEditorStateStore = create<EditorStateStore>((set, get) => ({
    current_page: null,
    setPage: (page: string|null) => {
        set({current_page: page})
    }
}))