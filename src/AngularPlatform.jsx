import React from 'react'
import { TYPE } from './typography'
import KMDMockup from './assets/Icons/Pictures/KMDMockup.png'


import AngularIcon from './assets/Icons/Skills/Angular.svg'
import TypescriptIcon from './assets/Icons/Skills/Typescript.svg'
import ClaudeIcon from './assets/Icons/Skills/Claude.svg'
import GithubIcon from './assets/Icons/Skills/Github.svg'

const AngularPlatform = () => (
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
        <img src={AngularIcon} />
        <img src={TypescriptIcon} />
        <img src={ClaudeIcon} />
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
    width: '30%'
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

export default AngularPlatform
