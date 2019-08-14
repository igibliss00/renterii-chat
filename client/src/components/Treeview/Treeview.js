import React from 'react'

import Tree from './Tree'

const Treeview = () => {
    return (
        <Tree name="Chat" defaultOpen>
            <Tree name="Browse" />
            <Tree name="Create" />
        </Tree>
    )
}

export default React.memo(Treeview)