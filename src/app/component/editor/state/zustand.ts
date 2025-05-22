import {create} from "zustand"
import {PieceContent, Page, Block} from "@/app/types";
import FetchPieceData from "@/app/engine/fetcher";

interface EditorProps {
    content: PieceContent,
}

export interface EditorStore extends EditorProps {
    setContent: (content: PieceContent) => void,
    addPage: (newPage: Page) => void,
    addBlock: (page_number: number, newBlock: Block) => void,
    reorderBlock: (page_number: number, block_id: string, new_position: number) => void,
    reorderPage: (page_number: number, new_position: number) => void,

    fetchContent: (id: string) => void,
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
                    const blockIndex = page.blocks.findIndex((b) => b.id === block_id);
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

    //will probably never have to use this actually
    fetchContent: async (id) => {
        const result = await FetchPieceData({id})
        return set(() => {
            return {...result}
        })
    }


}))