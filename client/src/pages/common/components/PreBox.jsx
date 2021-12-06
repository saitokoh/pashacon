import React, { useState, useEffect, useRef } from 'react';

import styles from '../styles/preBox.scss'

export default function PreBox({ children }) {
  // ref
  const prRef = useRef(null)

  // state
  const [isOpen, setOpen] = useState(false)
  const [isOverflow, setOverflow] = useState(false)

  // mounted
  useEffect(() => {
    setOverflow(prRef.current.clientHeight > 75)
  }, [children])

  // methods
  const open = e => {
    setOpen(true)
    e.stopPropagation()
  }
  const close = e => {
    setOpen(false)
    e.stopPropagation()
  }

  return (
    <div className={[styles.main, isOpen && styles.openPr].join(" ")}>
      <pre ref={prRef} className={styles.innerPr}>{children}</pre>
      {isOverflow && (<>
        {isOpen ?
          <div className={[styles.expandButton, styles.close].join(" ")}>
            <button onClick={close}>閉じる</button>
          </div>
          :
          <div className={styles.expandButton}>
            <button onClick={open}>...もっと読む</button>
          </div>
        }
      </>)}
    </div>
  )
}