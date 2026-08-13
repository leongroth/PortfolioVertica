import React from 'react'
import { useBreakpoint } from './gridLayout'
import { getProjectPageStyles } from './projectPageStyles'
import KMDMockup from './assets/Icons/Pictures/KMDMockup.png'


import AngularIcon from './assets/Icons/Skills/Angular.svg'
import TypescriptIcon from './assets/Icons/Skills/Typescript.svg'
import ClaudeIcon from './assets/Icons/Skills/Claude.svg'
import GithubIcon from './assets/Icons/Skills/Github.svg'

const SKILLS = [AngularIcon, TypescriptIcon, ClaudeIcon, GithubIcon]

const AngularPlatform = () => {
  const styles = getProjectPageStyles(useBreakpoint(), { imageWidth: '30%' })

  return (
    <div style={styles.main}>
      <div style={styles.headings}>
        <h1 style={{margin: 0}}>Angular Web Platform</h1>
        <h4 style={{margin: 0}}>My work as student Full Stack developer at KMD</h4>
      </div>

      <div style={styles.bread}>
        <img src={KMDMockup} style={styles.image}/>
        <p style={styles.text}>During my studies I was fortunate enough to be hired as a student Full Stack developer at KMD in Aalborg. Throughout the my first months in this position, the Tech Lead of the department mentored me through peer programming, which taught me to navigate a dense and complex codebase.<br/><br/>

          My Tasks regularly consisted of implementing features to an existing web platform, which involved following a trail of API calls from Angular frontend, through C# backend, to SQL databases.<br/><br/>

          The final 6 months of my employment introduced using Claude Code for professional work. Here creating new branches in the codebase became second nature, and more complex features became feasible to implement in the span of my short work weeks.</p>
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

export default AngularPlatform
