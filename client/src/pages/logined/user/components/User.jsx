import React, { useState, useRef} from 'react'
import { useSelector } from "react-redux"
import { axios } from "redux-token-auth"
// components
import Loading from 'pages/common/components/Loading'
import Button from 'pages/common/components/Button'
import Modal from 'pages/common/components/Modal'
// style
import styles from '../styles/user.scss'
import commonStyles from 'pages/common/styles/common.scss'


export default function User() {
  const loadingRef = useRef(null)
  const complaeteModalRef = useRef(null)
  const complaetePasswordModalRef = useRef(null)

  // redux store
  const user = useSelector((state) => state.reduxTokenAuth.currentUser).attributes;

  // state
  const [email, setEmail] = useState(user.email)
  const [emailError, setEmailError] = useState("")
  const [nickName, setNickName] = useState(user.name)
  const [nickNameError, setNickNameError] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordError, setNewPasswordError] = useState("")

  const [showPassword, setShowPassword] = useState(false);

  // コンテスト状態スタイル決定
  const updateBaseInfo = async () => {
    if (!validateBaseInfo()) return

    loadingRef.current.startLoading()
    try {
      await axios.post(`/api/v1/user/update`, {
        email: email,
        name: nickName
      })
      complaeteModalRef.current.open()
    } catch(e) {
      console.log(e)
    } finally {
      loadingRef.current.stopLoading()
    }
  }

  // 簡易バリデーション
  const validateBaseInfo = () => {
    if (nickName == '' || email == '') {
      if (nickName == '') {
        setNickNameError("ニックネームを入力してください")
      }
      if (email = '') {
        setEmailError("メールアドレスを入力してください")
      }
      return false
    }
    setNickNameError("")
    setEmailError("")
    return true
  }

  const updatePassword = async () => {
    if (!validatePassword()) return

    loadingRef.current.startLoading()
    try {
      await axios.post(`/api/v1/user/updatePassword`, {
        password: newPassword
      })
      setNewPassword("")
      complaetePasswordModalRef.current.open()
    } catch (e) {
      console.log(e)
    } finally {
      loadingRef.current.stopLoading()
    }
  }

  const validatePassword = () => {
    if (newPassword == '') {
      setNewPasswordError("パスワードを入力してください")
      return false
    }
    if (newPassword?.length < 6) {
      setNewPasswordError("パスワードは6文字以上で入力してください")
      return false
    }

    setNewPasswordError('')
    return true
  }

  return (
    <>
      <div className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.titleBox}>
            <h1>ユーザー情報</h1>
          </div>
          <div className={styles.container}>
            <div className={styles.titleArea}>
              <h2>基本情報変更</h2>
            </div>
            <div className={styles.inputAreaWrap}>
              <div className={styles.inputArea}>
                <label>メールアドレス<small>（ログインID）</small></label>
                <input type="email" maxLength="255" value={email} onChange={e => setEmail(e.target.value)} />
                {emailError ? <div className={commonStyles.error}>{emailError}</div> : ""}
              </div>
              <div className={styles.inputArea}>
                <label>ニックネーム<small>（30文字まで）</small></label>
                <input type="text" maxLength="30" value={nickName} onChange={e => setNickName(e.target.value)} />
                {nickNameError ? <div className={commonStyles.error}>{nickNameError}</div> : ""}
              </div>
            </div>
            <div className={styles.buttonArea}>
              <Button width={230} height={40} fontSize={14} onClick={updateBaseInfo}>
                更新する
              </Button>
            </div>
            <div className={styles.titleArea}>
              <h2>パスワード変更</h2>
            </div>
            <div className={styles.inputAreaWrap}>
              <div className={styles.inputArea}>
                <label>新しいパスワード<small>（6文字以上）</small></label>
                {showPassword ? (
                  <>
                    <input type="text" maxLength="255" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    <img
                      className={styles.passwordEyeSlash}
                      src="/images/eye-slash-icon.svg"
                      onClick={() => setShowPassword(false)}
                    />
                  </>
                ) : (
                  <>
                    <input type="password" maxLength="255" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    <img
                      className={styles.passwordEye}
                      src="/images/eye-icon.svg"
                      onClick={() => setShowPassword(true)}
                    />
                  </>
                )}
                
                {newPasswordError ? <div className={commonStyles.error}>{newPasswordError}</div> : ""}
              </div>
            </div>
            <div className={styles.buttonArea}>
              <Button width={230} height={40} fontSize={14} onClick={updatePassword}>
                パスワードを変更する
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Loading ref={loadingRef} />
      <Modal ref={complaeteModalRef} needCloseButton={true}>
        <div className={styles.completeModal}>
          更新しました
        </div>
      </Modal>
      <Modal ref={complaetePasswordModalRef} needCloseButton={true}>
        <div className={styles.completeModal}>
          パスワードを変更しました
        </div>
      </Modal>
    </>
  );
}
