"use client";

import {BlockProps} from "@/app/types"

export default function SimpleText(props: BlockProps) {
    const {content, className} = props;

    return <div className={className}>{content?.map((line, id) => <p key={id}>{line}</p>)}</div>
}