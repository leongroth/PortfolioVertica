import React from 'react'
import { TYPE } from './typography'
import AXONDesign from './assets/Icons/Pictures/AXONDesign.png'


import ReactIcon from './assets/Icons/Skills/React.svg'
import TailwindIcon from './assets/Icons/Skills/Tailwind.svg'
import JavascriptIcon from './assets/Icons/Skills/Javascript.svg'
import PythonIcon from './assets/Icons/Skills/Python.svg'
import GithubIcon from './assets/Icons/Skills/Github.svg'

const AXON = () => (
  <div style={styles.main}>
    <div style={styles.headings}>
      <h1 style={{margin: 0}}>AXON</h1>
      <h4 style={{margin: 0}}>Our prototype of an Accessibility Chatbot</h4>
    </div>

    <div style={styles.bread}>
      <img src={AXONDesign} style={styles.image}/>
      <p style={styles.text}>In the early stages of our product conceptualisation, we developed AXON, a chatbot prototype designed to answer questions about WCAG guidelines. This prototype was used to verify the need for Accessibility guidance, and was shown to UI designers, Developers, and Quality Assurance workers.<br/><br/>

        The backend of AXON consisted of python scripts implementing OpenAI API, and Facebook AI Similarity Search, vectorising WCAG guidelines and comparing users questions to them. This allowed us to create a RAG system for our chatbot, aiming to ensure validity of answers.<br/><br/>

        While the prototype was well received, certain implementation errors made AXON slightly wonky. Additionally, in order to keep costs down, the free web app hosting service Render was used, which meant that the first response from the AI could take up to 15 minutes to be generated.</p>
    </div>

    <div style={styles.tech}>
      <h4>Tech used in development</h4>
      <div style={styles.skills}>
        <img src={ReactIcon} />
        <img src={TailwindIcon} />
        <img src={JavascriptIcon} />
        <img src={PythonIcon} />
        <img src={GithubIcon} />
      </div>
    </div>

  </div>
)

const styles = {
  main: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '64px'
  },
  headings: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

  },
  bread: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '64px'
  },
  image: {
    width: '40%'
  },
  text: {
    width: '40%'
  },
  tech: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skills: {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
  }
}

export default AXON
