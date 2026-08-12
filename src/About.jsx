import React from 'react'
import Leon from './assets/Icons/Pictures/Leon.png'


const About = () => {
  return (
    <div style={styles.mainContainer}>
      <img src={Leon} />
      <div style={styles.textContainer}>
        <div style={styles.headings}>
          <h1 style={{margin: 0,}}>I'm Leon Groth</h1>
          <h6 style={{margin: 0,}}>M.Sc. Interaction Design</h6>
        </div>
        <p>Over the course of the last 5 years, i have studied interaction design at Aalborg University, and subsequently achieved a bachelors degree and a masters degree in the field. In my free time, i have worked hard on expanding my skills both in UI design and web development, and have even been fortunate enough to learn from some talented developers at KMD. This page is designed to show off some of the exciting projects I have worked on over the past years.</p>
      </div>
    </div>
  )
}

const styles = {
  mainContainer: {
    display: 'Flex',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '32px',
    gap: '32px'
  },
  headings: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '48px',
    width: '50%',
    justifyContent: 'center',
    width: '100%',
    paddingRight: '32px'
  }
}

export default About
