import React, { memo, useState, useContext } from 'react'
import { useSpring, a } from 'react-spring'
import { useMeasure, usePrevious } from './helpers'
import { Frame, Title, Content, toggle } from './styles'
import * as Icons from './icons'

import { SELECT_MENU } from '../../constants'
import Context from '../../store/context'

const Tree = memo(({ children, name, style, defaultOpen = false }) => {
    const { dispatch } = useContext(Context)
    const [isOpen, setOpen] = useState(defaultOpen)
    const previous = usePrevious(isOpen)
    const [bind, { height: viewHeight }] = useMeasure()
    const { height, opacity, transform } = useSpring({
        from: { height: 0, opacity: 0, transform: 'translate3d(20px,0,0)' },
        to: { height: isOpen ? viewHeight : 0, opacity: isOpen ? 1 : 0, transform: `translate3d(${isOpen ? 0 : 20}px,0,0)` }
    })
    const Icon = Icons[`${children ? (isOpen ? 'Minus' : 'Plus') : 'Close'}SquareO`]

    const onClickHandler = (e, name) => {
        e.stopPropagation()
        setOpen(!isOpen)
        dispatch({ type: SELECT_MENU, payload: name })
    }
    return (
        <Frame>
        <Icon style={{ ...toggle, fill: "rgba(128, 128, 128, 0.753)", opacity: children ? 1 : 0.3 }} onClick={() => setOpen(!isOpen)} />
        <Title 
            style={style} 
            onClick={e => onClickHandler(e, name)}
        >{name}</Title>
        <Content style={{ opacity, height: isOpen && previous === isOpen ? 'auto' : height }}>
            <a.div style={{ transform }} {...bind} children={children} />
        </Content>
        </Frame>
    )
})

export default React.memo(Tree)