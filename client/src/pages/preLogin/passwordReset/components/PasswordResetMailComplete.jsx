import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { replace } from 'connected-react-router'
import { useDispatch } from "react-redux"

// component

// style
import styles from '../styles/passwordReset.scss'

export default function PasswordResetMailComplete() {
  const dispatch = useDispatch()
  const location = useLocation()

  //state
  const [email, setEmail] = useState("")

  // mounted
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state?.email)
      dispatch(replace({
        state: {}
      }))
    } else {
      window.location.href = '/404'
    }
  }, [])

  return (
    <main className={styles.main}>
      <h1 className={styles.childTitle}>パスワード再設定</h1>
      <div className={styles.childContainer}>

      </div>
      <div className={styles.childContainer}>
        <p className={styles.thanksTitle}>
          {email}宛てに<br/>
          パスワードリセットメールを送信しました。
        </p>
        <p className={styles.thanksText}>
          メール内のURLをクリックして、パスワードの変更手続きをお願いします。
        </p>
        <div className={styles.formNote}>
          <ul className={styles.noteList}>
            <li>
              メールの受信が確認できない場合は、以下のケースが考えられます。
                <ol className={styles.listNumBrackets}>
                <li>メールアドレスに誤りがある</li>
                <li>【@mieruca-connect.com】からのメールが迷惑メールフォルダに振り分けられている</li>
              </ol>
                ご確認いただき、再度メールアドレスのご入力からお手続きをお願いいたします。
              </li>
          </ul>
        </div>
      </div>
    </main>
  );
}