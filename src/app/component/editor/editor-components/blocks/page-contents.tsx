"use client";

import {Page} from "@/app/types";
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
import BlockEdit from "@/app/component/editor/editor-components/blocks/block-edit";
import InsertBlockButton from "@/app/component/editor/editor-components/blocks/insert-block-button";

type PageContentsProps = {
    page_id: string|null;
}

export default function PageContents(props: PageContentsProps) {
    const {page_id} = props;

    const addBlock = useEditorStore((state) => state.addBlock);

    const page = useEditorStore(
        (state) => {
                if (page_id) return state.content.pages[page_id]
                return null
        }
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


        /*if (active.id !== over.id) {
            editor_store.reorderBlock(page_id, active.id as string, over.id); //TODO: fix this pls
        }*/
        console.log(active.id + " : " + over.id)
    }

    if (!page_id || !page) return null

    if (Object.keys(page.blocks).length === 0) {
        console.log("root block not found! regenerating...")
        addBlock(page_id, {
            type: "root",
            props: {
                id: "root",
                friendly_name: "root",
                listeners: []
            }
        })
        return <div>loading...</div>
    }

    return (
        <div className={"p-3 m-5 bg-gray-800 rounded-2xl w-1/2"}>
            <DndContext onDragEnd={handleDragEnd} sensors={sensors} collisionDetection={closestCenter}>
                <BlockEdit block={page.blocks["root"]} page_id={page_id}/>
                {/*<SortableContext
                    items={
                    //zustand_page?.blocks.map(block => block.props.id)
                        Object.keys(zustand_page.blocks).map((k) => zustand_page.blocks[k].props.id)}
                    strategy={verticalListSortingStrategy}>
                    <div className={"text-center text-xl"}>page contents!!</div>
                    {page.blocks.length < 1 &&
                        <div>empty! oopsies</div>}
                    {page.blocks.map(block => (
                        <BlockEdit block={block} key={block.props.id} page_number={page_id}/>
                    ))}

                </SortableContext>*/}
            </DndContext>
            <InsertBlockButton page_id={page_id}/>
        </div>
    )
}