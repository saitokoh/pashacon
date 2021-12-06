import React, { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { push, replace } from 'connected-react-router'
import { useDispatch } from "react-redux"
import { axios } from "redux-token-auth"

// components
import Loading from 'pages/common/components/Loading'
import Modal from 'pages/common/components/Modal'

// style
import styles from '../styles/profile.scss'

export default function Profile() {
  const dispatch = useDispatch()
  const location = useLocation()
  const loadingRef = useRef(null)
  const modalRef = useRef(null)

  // state
  const [profile, setProfile] = useState(null);

  // mounted
  useEffect(() => {
    (async () => {
      loadingRef.current.startLoading()
      try {
        const res = await axios.get(`/api/v1/corporation/profile`)
        setProfile(res.data.company_user)
      } catch (e) {
        console.log(e)
      }
      loadingRef.current.stopLoading()
    })()

    if (location.state?.fromAction === 'passwordChanged') {
      dispatch(replace({
        state: {}
      }))
      modalRef.current.open()
    }
  }, [])

  // methods
  const toPasswordEdit = () => {
    dispatch(push('/profile/password/edit'))
  }

  return (
    <>
      <div className={styles.main}>
        <div className={styles.inner}>
          <h2>プロフィール</h2>
          <div className={styles.box}>
            <img src="/images/company-profile.png" width="123" height="123"/>
            <ul>
              <li>
                <span className={styles.title}>企業名</span>
                <span className={styles.content}>{profile?.company.company_name}</span>
              </li>
              <li>
                <span className={styles.title}>担当者名</span>
                <span className={styles.content}>{profile?.family_name} {profile?.first_name}</span>
              </li>
              <li>
                <span className={styles.title}>メールアドレス</span>
                <span className={styles.content}>{profile?.email}</span>
              </li>
              <li>
                <span className={styles.title}>パスワード</span>
                <span className={styles.content}>********</span>
                <button onClick={toPasswordEdit}>変更</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Loading ref={loadingRef} />
      <Modal ref={modalRef} needCloseButton={false}>
        <span className={styles.modalContent}>パスワードを変更しました。</span>
      </Modal>
    </>
  );
}
