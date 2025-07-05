"use client";

import {PieceData} from "@/app/types";
import {useEditorMetaDataStore, useEditorStateStore, useEditorStore} from "@/app/component/editor/state/zustand";
import {useEffect, useState} from "react";
import PageContents from "@/app/component/editor/editor-components/blocks/page-contents";
import EditorTopBar from "@/app/component/editor/editor-components/editor-topbar";
import PagesGraph from "@/app/component/editor/editor-components/pages-graph/pages-graph";
import {ReactFlowProvider} from "@xyflow/react";
import BlockEditSidebar from "@/app/component/editor/editor-components/blocks/sidebar/block-edit-sidebar";
import {PagesGraphProvider} from "@/app/component/editor/editor-components/pages-graph/pages-graph-context";

type EditorProps = {
    initialPieceData: PieceData;
    username: string;
}

export default function Editor(props: EditorProps) {
    const {initialPieceData, username} = props;
    //const [currentPage, setCurrentPage] = useState<string|null>(null);

    //const pages = useEditorStore((state) => state.content.pages)
    const currentPage = useEditorStateStore((state) => state.current_page);
    const setCurrentPage = useEditorStateStore((state) => state.setPage)
    //const saveContent = useEditorStore((state) => state.saveContent);
    const editor_store = useEditorStore()
    //const setContent = useEditorStore((state) => state.setContent);
    const editorMetaDataStore = useEditorMetaDataStore()
    //const setData = useEditorMetaDataStore((state) => state.setData)

    const [lastSaved, setLastSaved] = useState(initialPieceData.last_updated);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        editor_store.setContent(initialPieceData.content)
        editorMetaDataStore.setData({
            author_name: username,
            author_id: initialPieceData.author_id,
            piece_id: initialPieceData.id,
            title: initialPieceData.title,
            slug: initialPieceData.slug,
            summary: initialPieceData.summary,
            published: initialPieceData.published,
        })
        setCurrentPage(null)
    }, [setCurrentPage, editor_store.setContent, initialPieceData, username, editorMetaDataStore.setData])

    return (
        <div>
            <div className={"flex flex-col h-dvh w-full"}>
                <div className={"flex h-[10dvh]"}>
                    <EditorTopBar currentPage={currentPage} lastSaved={lastSaved}
                                  saveThisWrld={() => {
                                      console.log("saving...")
                                      setSaving(true);
                                      editor_store.saveContent(username, initialPieceData.id).then((result) => {
                                          if (result.success) {
                                              console.log("saved successfully!")
                                              setLastSaved(result.data);
                                              setSaving(false);
                                          }
                                      });
                                  }}
                                  saving={saving}
                                  friendly_name={currentPage && editor_store.content.pages[currentPage].friendly_name}
                                  setCurrentPage={setCurrentPage}/>
                </div>
                {
                    currentPage === null || currentPage === undefined ?
                        <ReactFlowProvider><PagesGraphProvider><PagesGraph/></PagesGraphProvider></ReactFlowProvider>
                        :
                        <div className={"flex flex-row h-[90dvh]"}>
                            <PageContents page_id={currentPage}/>
                            <BlockEditSidebar/>
                        </div>
                }
            </div>

            {
                /*Object.keys(editor_store.content.pages).length === 0 ?
                    <div className={"text-center justify-center m-4 text-xl"}>
                        looks like you don't have any pages so far... let's change that!<br/>
                        <button onClick={() => {editor_store.addPage(); setCurrentPage(null)}}>add a blank page
                        </button>
                    </div>
                    :
                    <PageContents page_id={currentPage}/>*/
            }
            {/**/}
        </div>
    )
}