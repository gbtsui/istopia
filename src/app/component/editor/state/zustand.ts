import {create} from "zustand"
import {PieceContent, Page, Block, BlockProps} from "@/app/types";
import FetchPieceData from "@/app/engine/fetcher";
import UpdatePieceContent from "@/app/api/data/pieces/update-piece-content";

interface EditorProps {
    content: PieceContent,
}

export interface EditorStore extends EditorProps {
    setContent: (content: PieceContent) => void,
    addPage: (newPage: Page) => void,
    addBlock: (page_number: number, newBlock: Block) => void,
    reorderBlock: (page_number: number, block_id: string, new_position: number) => void,
    reorderPage: (page_number: number, new_position: number) => void,
    deleteBlock: (block_id: string) => void,
    deletePage: (page_number: number) => void,

    editBlock: (page_number: number, block_id: string, new_props: BlockProps) => void,

    fetchContent: (id: string) => Promise<void>,
    saveContent: (username: string, piece_id: string) => void
}

export const useEditorStore = create<EditorStore>((set) => ({
    content: {pages: []},
    setContent: (content) => {
        return set({content})
    },

    addPage: (newPage) => {
        return set((state) => ({
            content: {
                pages: [...state.content.pages, newPage]
            }
        }))
    },

    addBlock: (page_number, newBlock) => {
        return set((state) => {
            const updatedPages = state.content.pages.map((page, index) => {
                if (index === page_number) {
                    return {
                        ...page,
                        blocks: [...page.blocks, newBlock],
                    };
                }
                return page;
            });

            return {
                content: {
                    pages: updatedPages
                }
            }
        })
    },

    reorderBlock: (page_number, block_id, new_position) => {
        return set((state) => {
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
        })
    },

    reorderPage: (page_number, new_position) => {
        return set((state) => {
            const pageIndex = state.content.pages.findIndex((p) => p.page_number === page_number);
            if (pageIndex === -1) return {...state};
            const updatedPages = [...state.content.pages];
            const [page] = updatedPages.splice(pageIndex, 1);
            updatedPages.splice(new_position, 0, page);
            return {
                content: {
                    pages: updatedPages
                }
            }
        })
    },


    deleteBlock: (block_id: string) => {
       return set((state) => {
           return {...state} //TODO: finish this pls :3
       })
    },

    deletePage: (page_number: number) => {
        return set((state) => {
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
        })
    },

    saveContent: (username: string, piece_id: string) => {
        return set((state) => {
            UpdatePieceContent({username, piece_id, piece_content: state.content});

            return {...state}
            })
    },

    editBlock: (page_number, block_id, new_props) => {
        return set((state) => {
            const updatedPages = state.content.pages.map((page) => {
                if (page.page_number === page_number) {
                    const blockIndex: number = page.blocks.findIndex((block) => block.props.id === block_id);
                    if (blockIndex === -1) {
                        return {...page}
                    }
                    const updatedBlocks: Block[] = [...page.blocks];
                    const [block] = updatedBlocks.splice(blockIndex, 1)
                    block.props = new_props
                    updatedBlocks.splice(blockIndex, 0, block)
                    return {
                        ...page,
                        blocks: updatedBlocks
                    }
                }
                return page
            })

            return {
                content: {
                    pages: updatedPages
                }
            }
        })
    },
    //will probably never have to use this actually
    fetchContent: async (id) => {
        const result = await FetchPieceData({id})
        return set(() => {
            return {...result}
        })
    },


}))