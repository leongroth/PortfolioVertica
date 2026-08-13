import React from 'react'
import { RADIUS } from './gridConstants'
import { TYPE } from './typography'

const styles = {
  // TestGrid's cardShell already provides background/border/radius/shadow
  // and grid placement - this just fills that shell and lays out content.
  card: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: 16,
    boxSizing: 'border-box',
  },
  cardImage: {
    flex: '1 1 auto',
    minHeight: 0,
    backgroundColor: '#EEEEEE',
    borderRadius: RADIUS - 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    fontSize: 12,
    color: '#999999',
    overflow: 'hidden',
  },
  cardImagePhoto: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  cardTitle: {
    ...TYPE.h2,
    margin: 0,
    fontSize: 20, // kept compact for the card's small footprint
    color: '#111111',
  },
  cardText: {
    ...TYPE.bodySm,
    margin: 0,
    lineHeight: 1.5,
    color: '#666666',
  },
}

const ContentCard = ({ title, text, image }) => (
  <div style={styles.card}>
    <div style={styles.cardImage}>
      {image ? <img src={image} alt="" style={styles.cardImagePhoto} /> : 'Image placeholder'}
    </div>
    <h2 style={styles.cardTitle}>{title}</h2>
    <p style={styles.cardText}>{text}</p>
  </div>
)

export default ContentCard
