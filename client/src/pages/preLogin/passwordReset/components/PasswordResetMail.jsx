import React, { useState, useRef } from 'react';
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { axios } from "redux-token-auth"
import { push } from 'connected-react-router';
// component
import Loading from 'pages/common/components/Loading'
import Button from 'pages/common/components/Button'

// style
import styles from '../styles/passwordReset.scss'

export default function PasswordResetMail() {
  const dispatch = useDispatch();
  const loadingRef = useRef(null)

  // state
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // methods
  const toComplete = () => {
    validate()
  }

  // 簡易バリデーション
  const validate = () => {
    if (!email) {
      setErrorMessage('メールアドレスを入力して下さい。')
      return true
    } else {
      loadingRef.current.startLoading()
      setIsSubmitting(true);
      axios.post('/api/v1/corporation/auth/password', { email: email, redirect_url: "/" }).then(response => {
        loadingRef.current.stopLoading()
        setIsSubmitting(false);
        dispatch(push({
          pathname: "/pre/passwordReset/mail/complete",
          state: { email: email }
        }))
        window.scrollTo(0, 0);
      }).catch(error => {
        loadingRef.current.stopLoading()
        setIsSubmitting(false);
        const response = error.response;
        if (!response.data.success) {
          const errors = response.data.errors
          setErrorMessage(errors[0])
        } else {
          console.log("500 error");
        }
      });
      return false
    }
  }

  return (
  <>
    <main className={styles.main}>
      <h1 className={styles.childTitle}>パスワード再設定</h1>
      <div className={styles.childContainer}>
      </div>
      {errorMessage !== '' && <div className={[styles.formError, styles.childContainer].join(" ")}>
        <p>ご入力および操作に間違いがございます。下記をご確認ください。</p>
      </div>}
      <div className={styles.childContainer}>
        <form className={styles.form} action="/marketer/entry/mail/register" id="contact" method="post" noValidate>
          <div className={styles.form__inner}>
            <dl className={styles.form__element}>
              <div className={[styles.form__parts, styles.form__partsMust].join(" ")}>
                <dt className={[styles.form__title, styles.isError].join(" ")}>
                  <label htmlFor="email">
                    <span>ご登録のメールアドレス</span>
                  </label>
                </dt>
                <dd className={styles.form__input}>
                  <input
                    type="email"
                    className={styles.validateTarget}
                    id="email"
                    name="email"
                    autoComplete="email"
                    placeholder="example@fabercompany.co.jp"
                    required
                    maxLength="50"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  {errorMessage && <span className={styles.isError}>{errorMessage}</span>}
                </dd>
              </div>
            </dl>
            <p className={styles.description}>
              ご登録されているメールアドレスにパスワード再設定URLを送信します。<br/>
              メールアドレスをお忘れの場合は、お手数ですがヘルプデスクにお問い合わせください。
            </p>
            <p className={styles.buttonArea}>
              <Button type="button"
                width={400}
                height={57}
                fontSize={18}
                onClick={toComplete}
                disabled={isSubmitting}
              >
                <span className={styles.arrow}>メールを送信して次へ</span>
              </Button>
            </p>
          </div>
        </form>
        <div className={styles.backLoginWap}>
          <Link className={[styles.backLogin, styles.arrow].join(" ")} to={'/login'}>ログイン画面へ戻る</Link>
        </div>
      </div>
    </main>
    <Loading ref={loadingRef} />
  </>
  );
}
