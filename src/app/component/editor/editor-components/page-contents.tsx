"use client";

import {Block, Page} from "@/app/types";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {useEditorStore} from "@/app/component/editor/state/zustand";
import BlockEdit from "@/app/component/editor/editor-components/block-edit";

type PageContentsProps = {
    page_number: number;
}

export default function PageContents(props: PageContentsProps) {
    const {page_number} = props;
    const editor_store = useEditorStore();
    const page = useEditorStore(
        (state) => state.content.pages.find(p => p.page_number === page_number) as Page
    )
    //const [blocks, setBlocks] = useState<Block[]>(page_content);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    function handleDragEnd(e: DragEndEvent) {
        const {active, over} = e

        if (!over) return;

        if (active.id !== over.id) {
            editor_store.reorderBlock(page_number, active.id as string, page.blocks.findIndex(block => block.props.id === over.id));
        }
    }

    const newBlock: Block = {
        type: "text",
        props: {
            id: crypto.randomUUID(),
            content: [],
            listeners: []
        }
    }

    return (
        <div className={"p-3 m-5 bg-gray-800 rounded-2xl w-1/2"}>
            <DndContext onDragEnd={handleDragEnd} sensors={sensors} collisionDetection={closestCenter}>
                <SortableContext
                    items={editor_store.content.pages[editor_store.content.pages.findIndex(page => page.page_number === page_number)].blocks.map(block => block.props.id)}
                    strategy={verticalListSortingStrategy}>
                    <div className={"text-center text-xl"}>page contents!!</div>
                    {page.blocks.length < 1 &&
                        <div>empty! oopsies</div>}
                    {page.blocks.map(block => (
                        <BlockEdit block={block} key={block.props.id} page_number={page_number}/>
                    ))}

                    <button onClick={() => editor_store.addBlock(page_number, {...newBlock, props: {...newBlock.props, id: crypto.randomUUID()}})}>
                        add a
                        block
                    </button>
                </SortableContext>
            </DndContext>
        </div>
    )
}