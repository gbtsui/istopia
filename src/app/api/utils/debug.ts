import {useStoreApi} from "@xyflow/react";

export const createDebugCommands = () => ({
    deleteAllPages: async () => {
        const graphStore = useStoreApi()
        const nodes = graphStore.getState().nodes

        if (nodes.length === 0) return console.log('No nodes found.')

        const nodesToDelete = nodes.map(node => ({id: node.id, type: "delete"}));

        //await graphStore.setState()
    } //FOR USE IN PAGES GRAPH ONLY!!!!!!!!!!
})

// this might not actually be needed because i just checked the docs for deleting nodes :skull: