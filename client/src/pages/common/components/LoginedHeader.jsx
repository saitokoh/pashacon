import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { push } from 'connected-react-router'
import { useDispatch } from "react-redux"

import styles from '../styles/loginedHeader.scss'

export default function LoginedHeader({signOut}) {
  const dispatch = useDispatch()

  // state
  const [isShowSpMenu, setShowSpMenu] = useState(false)

  // methods
  const toPath = path => {
    setShowSpMenu(false)
    dispatch(push(path))
  }

  const handleChk = e => {
    setShowSpMenu(e.target.checked)
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <div className={styles.leftInner}>
            <Link to={'/'}>
              <div className={styles.logo}>
                <img src="/images/icon.png" width="40" height="40" />
                <span className={styles.copy}>パシャコン！</span>
              </div>
            </Link>
            <div className={styles.serviceList}>
              <ul>
                <li><Link to={'/contests'}><span>参加コンテスト</span></Link></li>
                <li><Link to={'/ownerContests'}><span>主催コンテスト</span></Link></li>
                <li><Link to={'/user'}><span>ユーザー情報</span></Link></li>
              </ul>
            </div>
          </div>
          <div className={styles.logout} onClick={signOut}>
            ログアウト
          </div>
          <div className={styles.forSp}>
            <input type="checkbox" className={styles.navSwitchChk} id="navSwitchChk" checked={isShowSpMenu} onChange={handleChk} />
            <label htmlFor="navSwitchChk" className={[styles.navSwitch, isShowSpMenu ? styles.navSwitchOpen : null].join(" ")}>
              <span></span>
            </label>
          </div>
        </div>
        <div className={[styles.forSp, styles.spMenuPrelogin, isShowSpMenu ? null : styles.none].join(' ')}>
          <ul>
            <li onClick={() => toPath('/contests')}><span>参加コンテスト</span></li>
            <li onClick={() => toPath('/ownerContests')}><span>主催コンテスト</span></li>
            <li onClick={() => toPath('/user')}><span>ユーザー情報</span></li>
          </ul>
        </div>
      </header>
      <div className={styles.headerBack}></div>
    </>
  )  
}