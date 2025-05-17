"use client";

import {BlockProps} from "@/app/types"

export default function SimpleText({props}: {props: BlockProps}) {
    const {text, className} = props;

    return <div className={className}>{text.map((line, id) => <p key={id}>{line}</p>)}</div>
}