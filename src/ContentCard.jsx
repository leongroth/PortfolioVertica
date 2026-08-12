import React from 'react'
import { RADIUS } from './gridConstants'

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
    margin: 0,
    fontFamily: 'sans-serif',
    fontSize: 20,
    color: '#111111',
  },
  cardText: {
    margin: 0,
    fontFamily: 'sans-serif',
    fontSize: 13,
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
