"use server";

import {RenderPage} from "@/app/engine/renderer";
import Parse from "@/app/engine/parser";

const test_data = {
    "pages": [
        {
            "blocks": [
                {
                    "type": "text",
                    "props": {
                        "content": [
                            "text content split by \n!!"
                        ],
                        "className": "string using tailwind styling for now ig",
                    }
                },
                {
                    "type": "typewriter",
                    "props": {
                        "content": [
                            "more text content split by \n!!!"
                        ],
                        "className": "",
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

export default async function RenderingTestPage() {
    const validated_data = await Parse(test_data)

    return <>{validated_data.pages.map((page, id) => <RenderPage key={id} data={page} />)}</>
}