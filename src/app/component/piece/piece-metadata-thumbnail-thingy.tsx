"use client";

import {PieceMetaData} from "@/app/types";
import Link from "next/link";
import Image from "next/image";

type PieceMetadataThumbnailThingyProps = {
    metadata: PieceMetaData;
}

export default function PieceMetadataThumbnailThingy(props: PieceMetadataThumbnailThingyProps) {
    const {metadata} = props;

    return (<div key={metadata.id}
                 className={"w-60 m-2 p-2 rounded-xl h-48 flex-shrink-0 border-1 border-gray-800 bg-black"}>
        <Link href={`/u/${metadata.author_name}/${metadata.slug}`}>
            <div className={"relative w-full p-1 rounded-xl h-2/3"}>
                <Image
                    src={typeof metadata.cover_image_link === "string" ? metadata.cover_image_link : "https://qwdqjithytndumgsklyb.supabase.co/storage/v1/object/public/cover-image//default.png"}
                    alt={metadata.title} fill={true} objectFit={"cover"} className={"pointer-events-none"}/>
            </div>
            <div className={"flex flex-row justify-between"}>
                <div className={"text-lg truncate"}>{metadata.title}</div>
                <div>{metadata.view_number} views</div>
            </div>
            <div><p className={"text-sm truncate w-full h-10"}>{metadata.summary ? metadata.summary : "this piece doesn't have a summary..."}</p>
            </div>
        </Link>
    </div>)
}