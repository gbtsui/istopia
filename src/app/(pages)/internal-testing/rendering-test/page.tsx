"use client"

import {useEffect, useState} from "react";
import {RenderPage} from "@/app/engine/renderer";
import Parse from "@/app/engine/parser";
import {PieceContent} from "@/app/types";
import {EngineProvider} from "@/app/engine/engine-context";

const test_data = {
    "pages": [
        {
            "page_number": 0,
            "blocks": [
                {
                    "type": "text",
                    "id":"1",
                    "props": {
                        "content": [
                            "text content split by \n!!"
                        ],
                        "className": "string using tailwind styling for now ig",
                    }
                },
                {
                    "type": "typewriter",
                    "id":"2",
                    "props": {
                        "content": [
                            "more text content split by \n!!!"
                        ],
                        "className": "",
                    }
                },
                {
                    "type":"simple-container",
                    "id":"3",
                    "props": {
                        "children": [
                            {
                                "type": "text",
                                "id":"1",
                                "props": {
                                    "content": [
                                        "this some text in a container!"
                                    ],
                                    "className": "",
                                }
                            }
                        ],
                        "className":"p-3 bg-white text-black",
                    }
                }
            ]
        }
    ]
}

export default function RenderingTestPage() {
    const [validatedData, setValidatedData] = useState<PieceContent|null>(null);
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const init = async () => {
            setValidatedData(await Parse(test_data))
            setLoading(false)
        }
        init()
    })
    if (loading) return <div>loading...</div>
    if (!validatedData) return <div>data isn't validated!</div>
    return <EngineProvider>{validatedData.pages.map((page, id) => <RenderPage key={id} data={page} />)}</EngineProvider>
}