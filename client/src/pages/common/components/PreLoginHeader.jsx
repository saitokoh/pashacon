import React from 'react';
import { useDispatch } from "react-redux";
import { push } from 'connected-react-router';

import styles from '../styles/preLoginHeader.scss'

export default function PreLoginHeader() {
  const dispatch = useDispatch();

  // methods
  const toLogin = () => {
    dispatch(push('/login'))
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo} onClick={toLogin}>
            <div className={styles.logoTop}>
              <img src="/images/icon.png" width="40" height="40"/>
              <span className={styles.copy}>パシャコン！</span>
            </div>
            <div className={styles.logoBottom}>
              フォトコンテストを開催できるサービス
            </div>
          </div>
        </div>
      </header>
      <div className={styles.headerBack}></div>
    </>
  )
}