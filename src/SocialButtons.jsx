import React, { useState } from 'react'
import CVIcon from './assets/Icons/Buttons/CVIcon.svg'
import DownloadIcon from './assets/Icons/Buttons/DownloadIcon.svg'
import MailIcon from './assets/Icons/Buttons/MailIcon.svg'
import GithubIcon from './assets/Icons/Buttons/GithubIcon.svg'
import LinkeinIcon from './assets/Icons/Buttons/LinkeinIcon.svg'
import { LINE_COLOR } from './gridConstants'

// Each entry is one button; `icons` are stacked top-to-bottom in a column,
// so the CV button's DownloadIcon (smaller, drawn first) sits above its
// CVIcon (the main icon). Entries with an `href` render as a link (styled
// identically to a button); an entry without one would fall back to an
// inert, unclickable button (styles.buttonDisabled) until it has somewhere
// to point.
const BUTTONS = [
  {
    key: 'cv',
    label: 'Download CV',
    icons: [{ src: DownloadIcon, size: 16 }, { src: CVIcon, size: 28 }],
    href: '/CV-LeonGroth.pdf',
    download: 'Leon Groth - CV.pdf',
  },
  {
    key: 'mail',
    label: 'Email',
    icons: [{ src: MailIcon, size: 28 }],
    href: 'mailto:leongroth@gmail.com',
  },
  {
    key: 'github',
    label: 'GitHub',
    icons: [{ src: GithubIcon, size: 28 }],
    href: 'https://github.com/leongroth',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    icons: [{ src: LinkeinIcon, size: 28 }],
    href: 'https://www.linkedin.com/in/leongroth/',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
]

const SocialButtons = () => {
  const [hovered, setHovered] = useState(null)

  return (
    <div style={styles.row}>
      {BUTTONS.map((btn, i) => {
        const Tag = btn.href ? 'a' : 'button'
        return (
          <Tag
            key={btn.key}
            type={btn.href ? undefined : 'button'}
            href={btn.href}
            target={btn.target}
            rel={btn.rel}
            download={btn.download}
            aria-label={btn.label}
            style={{
              ...styles.button,
              ...(i > 0 ? styles.buttonDivider : null),
              ...(btn.href ? (hovered === btn.key ? styles.buttonHover : null) : styles.buttonDisabled),
            }}
            onMouseEnter={() => setHovered(btn.key)}
            onMouseLeave={() => setHovered(null)}
          >
            {btn.icons.map(({ src, size }, iconIndex) => (
              <img key={iconIndex} src={src} alt="" style={{ width: size, height: size }} />
            ))}
          </Tag>
        )
      })}
    </div>
  )
}

const styles = {
  row: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  button: {
    flex: '1 1 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    // Resets <a>'s default link styling so it matches the plain <button>
    // entries (the CV button, until it has a file to link to).
    textDecoration: 'none',
    color: 'inherit',
  },
  buttonDivider: {
    borderLeft: `1px solid ${LINE_COLOR}`,
  },
  buttonDisabled: {
    cursor: 'default',
    opacity: 0.4,
  },
  buttonHover: {
    backgroundColor: '#F8F8F8',
  },
}

export default SocialButtons
