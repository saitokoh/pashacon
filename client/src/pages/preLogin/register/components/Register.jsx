import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { push } from 'connected-react-router';
import { axios } from "redux-token-auth"
import { registerUser } from 'conf/redux-token-auth-config'
// component
import Button from 'pages/common/components/Button'
import Loading from 'pages/common/components/Loading'

// style
import styles from '../styles/register.scss'

function Register({ registerUser }) {
  const dispatch = useDispatch();
  const loadingRef = useRef(null)
  const { token } = useParams();

  // state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // methods
  const register = e => {
    e.preventDefault();
    if (validate()) {
      return
    }
    setIsSubmitting(true);
    let params = { name, email, password, passwordConfirmation: password, token }
    
    registerUser(params).then(res => {
      setIsSubmitting(false);
      dispatch(push('/'));
    }).catch(error => {
      setIsSubmitting(false);
      console.log(error)
      setErrorMessage({password: error.response.data.errors[0]})
    });
  }

  // 簡易バリデーション
  const validate = () => {
    const errorMessageObj = {}
    let invalidFlag = false
    if (!name) {
      errorMessageObj.name = 'ニックネームを入力してください'
      invalidFlag = true
    }
    if (!email) {
      errorMessageObj.email = 'メールアドレスを入力してください'
      invalidFlag = true
    }
    if (!password) {
      errorMessageObj.password = 'パスワードを入力してください'
      invalidFlag = true
    }
    setErrorMessage(errorMessageObj)
    return invalidFlag
  }

  const fetchInvitation = async () => {
    loadingRef.current.startLoading()
    try {
      await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/v1/prelogin/event/${token}`)
    } catch (e) {
      console.log(e)
    } finally {
      loadingRef.current.stopLoading()
    }
  }

  useEffect(() => {
    scrollTo(0, 0);
    console.log("a")
    fetchInvitation()
  }, [])

  return (
  <>
    <main className={styles.main}>
      <div className={styles.childContainer}>
        <form className={styles.form} id="contact" noValidate onSubmit={register}>
          <h1 className={styles.childTitle}>新規会員登録</h1>
          <div className={styles.inner}>
            <div className={styles.element}>
              <div className={styles.parts}>
                  <div className={[styles.title, styles.isError].join(" ")}>
                  <label className={styles.label}>
                    <span>ニックネーム</span>
                  </label>
                </div>
                <div className={styles.input}>
                  <input type="text" maxLength="50" value={name} onChange={e => setName(e.target.value)}
                  />
                  {errorMessage.name && <span className={styles.isError}>{errorMessage.name}</span>}
                </div>
              </div>
              <div className={styles.parts}>
                <div className={[styles.title, styles.isError].join(" ")}>
                  <label className={styles.label}>
                    <span>メールアドレス<small>（ログインIDになります）</small></span>
                  </label>
                </div>
                <div className={styles.input}>
                  <input type="email" autoComplete="email" placeholder="example@example.co.jp"
                    maxLength="50" value={email} onChange={e => setEmail(e.target.value)}
                  />
                  {errorMessage.email && <span className={styles.isError}>{errorMessage.email}</span>}
                </div>
              </div>
              <div className={styles.parts}>
                <div className={[styles.title, styles.isError].join(" ")}>
                  <label className={styles.label}>
                    <span>パスワード</span>
                  </label>
                </div>
                {showPassword ?
                  <div className={styles.input}>
                    <input type="text" maxLength="50" autoComplete="current-password"
                      value={password} onChange={e => setPassword(e.target.value)}
                    />
                    <img
                      className={styles.passwordEyeSlash}
                      src="/images/eye-slash-icon.svg"
                      onClick={() => setShowPassword(false)}
                    />
                    {errorMessage.password && <span className={styles.isError}>{errorMessage.password}</span>}
                  </div>
                  :
                  <div className={styles.input}>
                    <input type="password" maxLength="50" autoComplete="current-password"
                      value={password} onChange={e => setPassword(e.target.value)}
                    />
                    <img
                      className={styles.passwordEye}
                      src="/images/eye-icon.svg"
                      onClick={() => setShowPassword(true)}
                    />
                    {errorMessage.password && <span className={styles.isError}>{errorMessage.password}</span>}
                  </div>
                }
              </div>
            </div>
            <p className={styles.buttonArea}>
              <Button type="submit"
                width={270}
                height={57}
                fontSize={18}
                disabled={isSubmitting}
              >
                <span className={styles.arrow}>会員登録する</span>
              </Button>
            </p>
          </div>
        </form>
      </div>
      </main>
      <Loading ref={loadingRef} />
  </>
  );
}

export default connect(
  null,
  { registerUser },
)(Register)