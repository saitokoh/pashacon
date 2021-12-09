import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { push } from 'connected-react-router';
import { signInUser } from 'conf/redux-token-auth-config'
// component
import Header from 'pages/common/components/PreLoginHeader'
import Footer from 'pages/common/components/Footer'
import Button from 'pages/common/components/Button'
import Loading from 'pages/common/components/Loading'

// style
import styles from '../styles/login.scss'

function Login({ signInUser }) {
  const loadingRef = useRef(null)
  const dispatch = useDispatch();
  const { token } = useParams();

  // state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // methods
  const login = e => {
    e.preventDefault();
    if (validate()) {
      return
    }
    setIsSubmitting(true);
    loadingRef.current.startLoading()
    let params = { email, password }
    if (token) {
      params = {...params, token}
    }
    signInUser(params).then(res => {
      setIsSubmitting(false);
      loadingRef.current.stopLoading()
      dispatch(push('/'));
    }).catch(error => {
      setIsSubmitting(false);
      loadingRef.current.stopLoading()
      setErrorMessage({password: error.response.data.errors[0]})
    })
  }

  // 簡易バリデーション
  const validate = () => {
    const errorMessageObj = {}
    let invalidFlag = false
    
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

  useEffect(() => {
    scrollTo(0, 0);
  }, [])

  return (
  <>
    <Header/>
    <main className={styles.main}>
      <div className={styles.childContainer}>
        <form className={styles.form} id="contact" noValidate onSubmit={login}>
          <h1 className={styles.childTitle}>ログイン</h1>
          <div className={styles.inner}>
            <div className={styles.element}>
              <div className={styles.parts}>
                <div className={[styles.title, styles.isError].join(" ")}>
                  <label className={styles.label}>
                    <span>メールアドレス</span>
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
                    <input type="text" className={styles.validateTarget}
                      maxLength="50" autoComplete="current-password"
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
                    <input type="password" className={styles.validateTarget}
                      maxLength="50" autoComplete="current-password"
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
                <span className={styles.arrow}>ログイン</span>
              </Button>
            </p>
            <p className={styles.forgotPassword}>
              <Link className={styles.arrow} to={'/pre/passwordReset/mail'}>パスワードを忘れた方はこちら</Link>
            </p>
          </div>
        </form>
      </div>
    </main>
    <Footer />
    <Loading ref={loadingRef} />
  </>
  );
}

export default connect(
  null,
  { signInUser },
)(Login)