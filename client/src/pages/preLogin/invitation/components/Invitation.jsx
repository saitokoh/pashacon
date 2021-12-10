import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'
import { connect, useDispatch } from "react-redux";
import { push } from 'connected-react-router';
import { axios } from "redux-token-auth"
// component
import Button from 'pages/common/components/Button'
import Loading from 'pages/common/components/Loading'

// style
import styles from '../styles/invitation.scss'

export default function Invitation() {
  const dispatch = useDispatch();
  const loadingRef = useRef(null)
  const { token } = useParams();

  // state
  const [ownerName, setOwnerName] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  // methods
  const toLogin = () => {
    dispatch(push(`/login/${token}`))
  }

  const toRegister = () => {
    dispatch(push(`/pre/register/${token}`))
  }

  const fetchInvitation = async () => {
    loadingRef.current.startLoading()
    try {
      const res = await axios.get(`/api/v1/prelogin/event/${token}`)
      setOwnerName(res.data.event.ownerUserName)
      setTitle(res.data.event.name)
      setDescription(res.data.event.description)
    } catch(e) {
      console.log(e)
    } finally {
      loadingRef.current.stopLoading()
    }
  }

  useEffect(() => {
    scrollTo(0, 0);
    fetchInvitation()
  }, [])

  return (
  <>
    <main className={styles.main}>
      <div className={styles.childContainer}>
        <div className={styles.innerContainer} id="contact">
          <h1 className={styles.childTitle}>{ownerName}さんからフォトコンテストの招待が届いています</h1>
          <h2 className={styles.title}>{title}</h2>
          <pre className={styles.description}>{description}</pre>
          <div className={styles.inner}>
            <p>アカウントをお持ちの方は</p>
            <Button width={200} height={40} fontSize={16} onClick={toLogin}>ログインページへ</Button>
            <p>アカウントをお持ちでない方は</p>
            <Button width={200} height={40} fontSize={16} onClick={toRegister}>新規会員登録ページへ</Button>
          </div>
        </div>
      </div>
      </main>
      <Loading ref={loadingRef} />
  </>
  );
}