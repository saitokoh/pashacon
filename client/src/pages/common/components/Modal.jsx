import React, { useState, forwardRef, useImperativeHandle } from 'react';

import styles from '../styles/modal.scss'

const Modal = ({children, needCloseButton, top}, ref) => {

  // state
  const [isOpen, setOpen] = useState(false)

  // 親から実行できる関数を定義
  useImperativeHandle(ref, () => {
    return {
      close,
      open
    }
  })

  // methods
  const close = () => {
    setOpen(false)
  }

  const open = () => {
    setOpen(true)
  }

  return (
    <>
      <div className={[styles.mainWrap, isOpen ? styles.isOpen : ''].join(" ")} onClick={close}></div>
      <div className={[styles.main, isOpen ? styles.isOpen : ''].join(" ")} style={{top: top}}>
        <span
          className={styles.closeButton}
          style={{ display: needCloseButton ? 'block' : 'none' }}
          onClick={close}
        >
        ×
        </span>
        {children}
      </div>
    </>
  )
}

export default forwardRef(Modal)