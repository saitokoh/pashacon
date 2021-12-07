import React from 'react';

import styles from '../styles/cvButton.scss'

export default function CVButton({ children, width, height, fontSize, emphasize, ...attributes }) {

  return (
    <button
      className={[styles.cvButton, emphasize && styles.emphasize ].join(" ")}
      style={{ width, height, fontSize, borderRadius: (height / 2) || null }}
      {...attributes}
    >
      {children}
    </button>
  )
}