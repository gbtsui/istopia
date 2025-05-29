"use client"


import {useState} from "react";
import InsertBlockForm from "@/app/component/editor/editor-components/insert-block-form";

type InsertBlockButtonProps = {
    page_number: number,
}

export default function InsertBlockButton(props: InsertBlockButtonProps) {
    const {page_number} = props;
    const [dialogIsOpen, setDialogIsOpen] = useState(false);

    return (
        <div className={"absolute bottom-0 right-0"}>
            <button onClick={() => setDialogIsOpen(true)}>Open Dialog</button>
            <InsertBlockForm setDialogIsOpen={setDialogIsOpen} dialogIsOpen={dialogIsOpen} page_number={page_number} />
        </div>
    )
}

//glory to the father and the son and the holy spirit
//now and ever and unto ages of ages amen
//it is the day of resurrection
//let us be glorious in splendor for the festival
//and let us embrace one another
//let us also speak o brethren
//to those that hate us
//and in the resurrection forgive all things
//and so let us cry
//christ is risen from the dead
//trampling down death by death
//and upon those in the tombs restoring life