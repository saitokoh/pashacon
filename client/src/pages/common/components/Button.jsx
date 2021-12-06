import React from 'react';

import styles from '../styles/button.scss'

export default function Button({ children, width, height, fontSize, outline,  ...attributes }) {

  const buttonStyle = {
    width, height, fontSize,
    borderRadius: height / 2
  }
  return (
    <button
      className={[styles.button, outline ? styles.outline : '' ].join(" ")}
      style={buttonStyle}
      {...attributes}
    >
      {children}
    </button>
  )
}