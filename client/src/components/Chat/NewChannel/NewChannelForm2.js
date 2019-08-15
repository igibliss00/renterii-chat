import 'antd/dist/antd.css'
import React, { Fragment } from 'react'
import { Keyframes, animated } from 'react-spring/renderprops'
import { Avatar, Form, Icon, Input, Button, Checkbox } from 'antd'
import delay from 'delay'

import '../../styles/NewChannelForm.css'

// Creates a spring with predefined animation slots
const Sidebar = Keyframes.Spring({
  // Slots can take arrays/chains,
  peek: [{ x: 0, from: { x: 100 }, delay: 500 }, { x: 0, delay: 800 }],
  // single items,
  open: { delay: 0, x: 0 },
  // or async functions with side-effects
  close: async call => {
    await delay(400)
    await call({ delay: 0, x: 100 })
  },
})

// Creates a keyframed trail
const Content = Keyframes.Trail({
  peek: [
    { x: 100, opacity: 0, from: { x: 0, opacity: 0 }, delay: 600 },
    { x: 0, opacity: 1, delay: 0 },
  ],
  open: { x: 100, opacity: 0, delay: 100 },
  close: { x: 0, opacity: 1, delay: 0 },
})

const items = [
  <Avatar src="https://semantic-ui.com/images/avatar2/large/elyse.png" />,
  <h3 className="new-channel-form-title">Create Your Own Channel</h3>,
  <Input
    size="small"
    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
    type="text"
    placeholder="Channel Name"
  />,
  <Input
    size="small"
    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
    type="text"
    placeholder="Description"
  />,
  <Fragment>
    <Checkbox size="small">Private</Checkbox>
    <a className="login-form-forgot" href="#" children="Forgot password" />
    <Button
      size="small"
      type="danger"
      htmlType="submit"
      className="login-form-button"
      children="Create"
    />
  </Fragment>,
]

export default class App extends React.Component {
  state = { open: undefined }
  toggle = () => this.setState(state => ({ open: !state.open }))
  render() {
    const state =
      this.state.open === undefined
        ? 'peek'
        : this.state.open
        ? 'open'
        : 'close'
    const icon = this.state.open ? 'fold' : 'unfold'
    return (
      <div style={{ width: '100%' }}>
        {/* <Icon
          type={`menu-${icon}`}
          className="sidebar-toggle"
          onClick={this.toggle}
        /> */}
        <Sidebar native state={state}>
          {({ x }) => (
            <animated.div
              className="sidebar"
              style={{
                transform: x.interpolate(x => `translate3d(${x}%,0,0)`),
              }}>
              <Content
                native
                items={items}
                keys={items.map((_, i) => i)}
                reverse={!this.state.open}
                state={state}>
                {(item, i) => ({ x, ...props }) => (
                  <animated.div
                    style={{
                      transform: x.interpolate(x => `translate3d(${x}%,0,0)`),
                      ...props,
                    }}>
                    <Form.Item className={i === 0 ? 'middle' : ''}>
                      {item}
                    </Form.Item>
                  </animated.div>
                )}
              </Content>
            </animated.div>
          )}
        </Sidebar>
      </div>
    )
  }
}