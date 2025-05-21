import {ReactNode} from 'react';
import {useDroppable} from '@dnd-kit/core';

export type DroppableProps = {
    children: ReactNode;
    id: string;
}

export default function Droppable(props: DroppableProps) {
    const {isOver, setNodeRef} = useDroppable({
        id: props.id,
    });
    const style = {
        color: isOver ? 'green' : undefined,
        backgroundColor: isOver ? 'red' : undefined,
    };


    return (
        <div ref={setNodeRef} style={style} className={"p-5 bg-gray-800"}>
            {props.children}
        </div>
    );
}