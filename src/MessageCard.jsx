import React from 'react'
import { TYPE } from './typography'

const MessageCard = () => (
  <div style={styles.container}>
    <p style={styles.text}>Let's work together, message me!</p>
  </div>
)

const styles = {
  container: {
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  text: {
    ...TYPE.h4,
    margin: 0,
  },
}

export default MessageCard
