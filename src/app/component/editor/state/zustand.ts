import {create} from "zustand"
import {PieceContent, Page, Block} from "@/app/types";

interface EditorProps {
    content: PieceContent,
}

interface EditorStore extends EditorProps {
    setContent: (content: PieceContent) => void,
    addPage: (newPage: Page) => void,
    addBlock: (page_number: number, newBlock: Block) => void,
    reorderBlock: (page_number: number, block_id: string, new_position: number) => void,
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
                    const block = page.blocks.find((b) => b.block_id == block_id);
                    if (!block) return page;
                    const idx = page.blocks.indexOf(block);
                    page.blocks.splice(idx, 1);
                    page.blocks.splice(new_position, 0, block);
                }
                return page;
            })

            return {
                content: {
                    pages: updatedPages
                }
            }
        })
    }
}))