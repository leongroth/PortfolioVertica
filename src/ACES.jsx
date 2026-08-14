import React from 'react'
import { useBreakpoint } from './gridLayout'
import { getProjectPageStyles } from './projectPageStyles'
import ACESDesign from './assets/Icons/Pictures/ACESDesign.png'
import ACESGraph from './assets/Icons/Pictures/ACESGraph.png'


import PythonIcon from './assets/Icons/Skills/Python.svg'
import ClaudeIcon from './assets/Icons/Skills/Claude.svg'
import LinuxIcon from './assets/Icons/Skills/Linux.svg'
import ReactIcon from './assets/Icons/Skills/React.svg'
import TailwindIcon from './assets/Icons/Skills/Tailwind.svg'
import JavascriptIcon from './assets/Icons/Skills/Javascript.svg'
import GithubIcon from './assets/Icons/Skills/Github.svg'

const SKILLS = [PythonIcon, ClaudeIcon, LinuxIcon, ReactIcon, TailwindIcon, JavascriptIcon, GithubIcon]

const ACES = () => {
  const styles = getProjectPageStyles(useBreakpoint())

  return (
    <div style={styles.main}>
      <div style={styles.headings}>
        <h1 style={{margin: 0}}>ACES</h1>
        <h4 style={{margin: 0}}>Our Accessibility tool for UI Designers</h4>
      </div>

      <div style={styles.bread}>
        <img src={ACESDesign} style={styles.image}/>
        <p style={styles.text}>Our first SaaS fully developed is a tool designed to assist UI Designers in designing for accessibility. ACES provides feedback on Designs by identifying UI elements in a user uploaded screenshot using a Machine Learning model trained on our data.</p>
      </div>

      <div style={{width: '70%', display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center'}}>
        <p style={{width: '80%'}}>These identified UI elements are then analysed using OpenCV and Pytesseract, and text is evaluated using a LLM. Developing the backend and connecting it to the frontend of our SaaS has tested our development skills, and even required us to ask for help from a more experienced developer.</p>
        <img src={ACESGraph}/>
        <p style={{width: '80%'}}>Throughout the development of ACES I have learned a lot about planning and executing a development strategy, and allowed me to administrate the development of a real product.
          I have also learned a lot about server setup in Linux.</p>
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

export default ACES
