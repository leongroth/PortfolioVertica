import React from 'react'
import { useBreakpoint } from './gridLayout'
import { getProjectPageStyles } from './projectPageStyles'
import AppMockup from './assets/Icons/Pictures/AppMockup.png'
import Imports from './assets/Icons/Pictures/Imports.png'

import ReactIcon from './assets/Icons/Skills/React.svg'
import LottieIcon from './assets/Icons/Skills/Lottie.svg'
import JavascriptIcon from './assets/Icons/Skills/Javascript.svg'
import ClaudeIcon from './assets/Icons/Skills/Claude.svg'
import GithubIcon from './assets/Icons/Skills/Github.svg'

const SKILLS = [ReactIcon, LottieIcon, JavascriptIcon, ClaudeIcon, GithubIcon]

const FreelanceWork = () => {
  // A tall, narrow phone mockup - it gets a smaller share of the row than
  // the other pages' wide screenshots do.
  const styles = getProjectPageStyles(useBreakpoint(), { imageWidth: '20%' })

  return (
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

      <div style={{width: '70%', display: 'flex', flexDirection: 'column', gap: '32px'}}>
        <p>Even though most of the motion design work consisted of creating Lottie files, and sharing them with the development team, some motion was component dependant. For example, when a users images became part of animations, we decided that the animation should be created using React-natives Animated library.</p>
        <img src={Imports}/>
      </div>

      <div style={{width: '70%'}}>
        <p>Creating app pages for an application in development required working with a development team external to our company. This taught me a lot about how to explore requirements with stakeholders and developers.
        A confident understanding of the domain is important, but may not undermine the clients wishes or requests.</p>
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

export default FreelanceWork
