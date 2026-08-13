import React from 'react'
import { useBreakpoint } from './gridLayout'
import { getProjectPageStyles } from './projectPageStyles'
import ACESMockup from './assets/Icons/Pictures/ACESMockup.png'

import ReactIcon from './assets/Icons/Skills/React.svg'
import TailwindIcon from './assets/Icons/Skills/Tailwind.svg'
import JavascriptIcon from './assets/Icons/Skills/Javascript.svg'
import ClaudeIcon from './assets/Icons/Skills/Claude.svg'
import GithubIcon from './assets/Icons/Skills/Github.svg'

const SKILLS = [ReactIcon, TailwindIcon, JavascriptIcon, ClaudeIcon, GithubIcon]

const ReactPage = () => {
  const styles = getProjectPageStyles(useBreakpoint())

  return (
    <div style={styles.main}>
      <div style={styles.headings}>
        <h1 style={{margin: 0}}>ACES</h1>
        <h4 style={{margin: 0}}>Our Accessibility tool for UI Designers</h4>
      </div>

      <div style={styles.bread}>
        <img src={ACESMockup} style={styles.image}/>
        <p style={styles.text}>ACES is our accessibility tool for UI designers. As web accessibility becomes a requirement, we aim to make designing for accessibility easier. W3C’s guidelines state clear rules, such as for example the rules for contrast between text and background. Here our tool will make it much harder to overlook design issues, that introduce bad accessibility.<br/><br/>

        The frontend of our Accessibility tool is created in ReactJS with TailwindCSS for styling. In order to make our development process quicker, we used Preline UI’s design system and React components. As these components by default are created with TailwindCSS styling, making changes to the look was made easy.<br/><br/>

        Developing a website using components from a design system has been easy and quick, but can also limit the creative flow of the process. In this case however, the design system worked perfectly with our vision.</p>
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

export default ReactPage
