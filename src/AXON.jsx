import React from 'react'
import { useBreakpoint } from './gridLayout'
import { getProjectPageStyles } from './projectPageStyles'
import AXONDesign from './assets/Icons/Pictures/AXONDesign.png'


import ReactIcon from './assets/Icons/Skills/React.svg'
import TailwindIcon from './assets/Icons/Skills/Tailwind.svg'
import JavascriptIcon from './assets/Icons/Skills/Javascript.svg'
import PythonIcon from './assets/Icons/Skills/Python.svg'
import GithubIcon from './assets/Icons/Skills/Github.svg'

const SKILLS = [ReactIcon, TailwindIcon, JavascriptIcon, PythonIcon, GithubIcon]

const AXON = () => {
  const styles = getProjectPageStyles(useBreakpoint())

  return (
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
          {SKILLS.map((icon, i) => (
            <img key={i} src={icon} alt="" style={styles.skillIcon} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default AXON
