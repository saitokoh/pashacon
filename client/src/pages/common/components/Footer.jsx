import React from 'react';

import styles from '../styles/fotter.scss'

export default function Footer() {

  return (
    <footer className={styles.footer} id="footer">
      <div className={styles.inner}>
        <span className={styles.copyright}>©2021 saikoh</span>
      </div>
    </footer>
  )
}