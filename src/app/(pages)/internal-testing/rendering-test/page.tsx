/*
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
                    "props": {
                        "content": [
                            "text content split by \n!!"
                        ],
                        "className": "string using tailwind styling for now ig",
                        "listeners": [],
                        "id":"1",
                    }
                },
                {
                    "type": "typewriter",
                    "props": {
                        "content": [
                            "more text content split by \n!!!"
                        ],
                        "className": "",
                        "listeners": [
                            {
                                "self_block_id": "2",
                                "target_block_id": "2",
                                "target_event":"typewriter:typingComplete",
                                "action":"reset",
                                "logical_conditions": []
                            }
                        ],
                        "id":"2",
                    }
                },
                {
                    "type":"simple-container",
                    "props": {
                        "children": [
                            {
                                "type": "text",
                                "props": {
                                    "content": [
                                        "this some text in a container!"
                                    ],
                                    "className": "",
                                    "listeners": [],
                                    "id":"1",
                                }
                            }
                        ],
                        "className":"p-3 bg-white text-black",
                        "listeners": [],
                        "id":"3",
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
    }, [])
    if (loading) return <div>loading...</div>
    if (!validatedData) return <div>data isn't validated!</div>
    return <EngineProvider>{validatedData.pages.map((page, id) => <RenderPage key={id} data={page} />)}</EngineProvider>
}
*/

export default function RenderingTestPage() {
    return <div>rendering test mostly complete</div>
}