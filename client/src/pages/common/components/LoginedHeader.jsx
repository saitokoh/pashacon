import React from 'react';
import { push } from 'connected-react-router'
import { useDispatch } from "react-redux"

import styles from '../styles/loginedHeader.scss'

export default function LoginedHeader({signOut}) {
  const dispatch = useDispatch()

  // methods
  const toMain = () => {
    dispatch(push('/'))
  }

  const toLink = (target) => {
    dispatch(push(target))
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <div className={styles.leftInner}>
            <div className={styles.logo} onClick={toMain}>
              <img src="/images/icon.png" width="40" height="40" />
              <span className={styles.copy}>パシャコン！</span>
            </div>
            <div className={styles.serviceList}>
              <ul>
                <li onClick={() => toLink('/contests')}><span>参加コンテスト</span></li>
                <li onClick={() => toLink('/ownerContests')}><span>主催コンテスト</span></li>
                <li><span>ユーザー情報</span></li>
              </ul>
            </div>
          </div>
          <div className={styles.logout} onClick={signOut}>
            ログアウト
          </div>
        </div>
      </header>
      <div className={styles.headerBack}></div>
    </>
  )  
}