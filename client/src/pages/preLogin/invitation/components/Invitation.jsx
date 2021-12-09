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
//   const [description, setDescription] = useState(`基本的には去年と同じスタイル。見る専無しの参加型です😁👍

// ★新システム導入⁉️★
// 今年はLINEノートではなく、新しいシステムを開発導入予定！（ガチ感。笑）

// →去年のアンケートに最初に投稿した人、若干不利な説とコメント書きたいというリクエストにお応えして、さいこーと一緒に、この企画のみのためのソフト開発中です（一緒にと言いつつ、ほぼ全てさいこーに丸投げ。笑）

// ☆なぜやるのか？★
// 去年楽しかったから、今年もやりたいわけさ(^^)
// 久々に去年の投稿みて、やっぱり面白い🤣

// みんなそれぞれの『日常のクスッと』を共有して、クスクスしようぜ😁
// 今年一年どんなことがあったかなと振り返りながら参加してくれたら楽しいこと間違いない！`)

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
            <p>参加する方は</p>
            <Button width={200} height={40} fontSize={16} onClick={toLogin}>ログインページへ</Button>
            <p>または</p>
            <Button width={200} height={40} fontSize={16} onClick={toRegister}>新規会員登録ページへ</Button>
          </div>
        </div>
      </div>
      </main>
      <Loading ref={loadingRef} />
  </>
  );
}