import React from 'react'
import { TYPE } from './typography'
import AppMockup from './assets/Icons/Pictures/AppMockup.png'

import ReactIcon from './assets/Icons/Skills/React.svg'
import LottieIcon from './assets/Icons/Skills/Lottie.svg'
import JavascriptIcon from './assets/Icons/Skills/Javascript.svg'
import ClaudeIcon from './assets/Icons/Skills/Claude.svg'
import GithubIcon from './assets/Icons/Skills/Github.svg'

const FreelanceWork = () => (
  <div style={styles.main}>
    <div style={styles.headings}>
      <h1 style={{margin: 0}}>Freelance work</h1>
      <h4 style={{margin: 0}}>Developing React native app with motion</h4>
    </div>

    <div style={styles.bread}>
      <img src={AppMockup} style={styles.image}/>
      <p style={styles.text}>Over the course of the last 9 months, our startup company has acted as a Design and Development consultancy. Here we designed hundreds of UI frames, and developed animations in React Native for an upcomming application created by a company based in Copenhagen.<br/><br/>

        This work allowed me to get familiar with React Native animations as well as Lottie files, which is the same animation format used by Duolingo.<br/><br/>

        A non disclosure agreement restricts me from sharing specifics from the development work, which is also why i am unable to show the animations i created.</p>
    </div>

    <div style={styles.tech}>
      <h4>Tech used in development</h4>
      <div style={styles.skills}>
        <img src={ReactIcon} />
        <img src={LottieIcon} />
        <img src={JavascriptIcon} />
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
    width: '20%'
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

export default FreelanceWork
