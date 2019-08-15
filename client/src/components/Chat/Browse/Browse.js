import React, { useState, useRef, useContext } from 'react'
import { render } from 'react-dom'
import { useTransition, useSpring, useChain, config } from 'react-spring'
import { Container, Item } from './styles'
import data from './data'

import Context from '../../../store/context'
import '../../styles/Browse.css'
import { SELECT_CARD } from '../../../constants'

export default function App() {
  const [open, set] = useState(false)
  const { dispatch } = useContext(Context)

  const springRef = useRef()
  const { size, opacity, ...rest } = useSpring({
    ref: springRef,
    config: config.stiff,
    from: { size: '20%', background: 'rgb(248, 87, 87)' },
    to: { size: open ? '100%' : '20%', background: open ? 'white' : 'rgb(248, 87, 87)' }
  })

  const transRef = useRef()
  const transitions = useTransition(open ? data : [], item => item.name, {
    ref: transRef,
    unique: true,
    trail: 400 / data.length,
    from: { opacity: 0, transform: 'scale(0)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0)' }
  })

  // This will orchestrate the two animations above, comment the last arg and it creates a sequence
  useChain(open ? [springRef, transRef] : [transRef, springRef], [0, open ? 0.1 : 0.6])

  const onClickHandler = () => {
    dispatch({ type: SELECT_CARD, payload: true })
    set(open => !open)
  }
  return (
    <>
      <Container 
        style={{ ...rest, width: size, height: size }} 
        onClick={onClickHandler}
        >
        {transitions.map(({ item, key, props }) => (
          <Item 
            key={key} 
            style={{ ...props, background: item.css }}
          >
            <p>{item.name}</p>
          </Item>
        ))}
      </Container>
    </>
  )
}