import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'
import { useDispatch } from "react-redux";
import { push } from 'connected-react-router';
import { axios } from "redux-token-auth"
import FormValidator from 'formValidator';
// component
import Loading from 'pages/common/components/Loading'
import Button from 'pages/common/components/Button'

// style
import styles from '../styles/passwordReset.scss'

export default function PasswordResetInput() {
  const params = useParams()
  const dispatch = useDispatch();
  const loadingRef = useRef(null)

  // state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // mounted
  useEffect(() => {
    (async () => {
      loadingRef.current.startLoading()
      setIsSubmitting(true);
      try {
        const res = await axios.get(`/api/v1/corporation/auth/password/edit`, {
          params: {
            reset_password_token: params.token,
            redirect_url: ''
          }
        })
        setEmail(res.data.email)
      } catch (e) {
        window.location.href = '/404'
      }
      loadingRef.current.stopLoading()
      setIsSubmitting(false);
    })()
  }, [])

  // methods
  const changePassword = () => {
    loadingRef.current.startLoading()
    setIsSubmitting(true);
    axios.put('/api/v1/corporation/auth/password', {
      password: password,
      password_confirmation: confirmPassword,
      reset_password_token: params.token,
    }).then(response => {
      loadingRef.current.stopLoading()
      setIsSubmitting(false);
      dispatch(push("/pre/passwordReset/complete"))
      window.scrollTo(0, 0);
    }).catch(error => {
      loadingRef.current.stopLoading()
      setIsSubmitting(false);
      const response = error.response;
      if (response.status === 400) {
        const messages = response.data.message
        setErrors(Object.keys(messages).reduce((obj, key) => Object.assign(obj, { [key]: messages[key][0] }), {}));
      } else {
        console.log("500 error");
        window.location.href = '/500'
      }
    });
  }

  const validate = e => {
    setErrors({})
    e.preventDefault();
    const form = document.getElementById('passwordChangeForm');
    const comfirmPassMessage = {
      patternMismatch: {
        comfirm_password(value) { return '確認用パスワードがパスワードと一致しません' }
      }
    }
    const validator = new FormValidator({ form: form, originalMessage: comfirmPassMessage });
    if (validator.valid()) {
      changePassword()
      setErrors({});
    } else {
      const errors = validator.getErrors();
      setErrors(errors.reduce((obj, error) => Object.assign(obj, { [error.target.name]: error.message }), {}));
    }
  }

  return (
  <>
    <main className={styles.main}>
      <h1 className={styles.childTitle}>パスワード再設定</h1>
      <div className={styles.childContainer}>
      </div>
      {Object.keys(errors).length > 0 && <div className={[styles.formError, styles.childContainer].join(" ")}>
        <p>ご入力および操作に間違いがございます。下記をご確認ください。</p>
      </div>}
      <div className={styles.childContainer}>
          <form className={styles.form} id="passwordChangeForm" noValidate>
          <div className={styles.form__inner}>
            <dl className={styles.form__element}>
              <div className={[styles.form__parts, styles.form__partsMust].join(" ")}>
                <dt className={[styles.form__title, styles.isError].join(" ")}>
                  <label htmlFor="email">
                    <span>メールアドレス</span>
                  </label>
                </dt>
                <dd className={styles.form__input}>
                  <span className={styles.form__preInput}>{email}</span>
                </dd>
              </div>
              <div className={[styles.form__parts, styles.form__partsMust].join(" ")}>
                <dt className={[styles.form__title, styles.isError].join(" ")}>
                  <label htmlFor="password">
                    <span>新しいパスワード</span>
                  </label>
                </dt>
                {showPassword ?
                  <dd className={styles.form__input}>
                    <input
                      type="text"
                      className={[styles.validateTarget, "validateTarget"].join(" ")}
                      id="password"
                      name="password"
                      required
                      maxLength="128"
                      minLength="8"
                      autoComplete="current-password"
                      value={password}
                      data-elm-name='新しいパスワード'
                      onChange={e => setPassword(e.target.value)}
                    />
                    <img
                      className={styles.passwordEyeSlash}
                      src="/images/eye-slash-icon.svg"
                      onClick={() => setShowPassword(false)}
                    />
                    <small className={styles.entryNotice}>8文字以上、[A-Z][a-z][0-9]から1文字ずつ</small>
                    {errors?.password && <span className={styles.isError}>{errors.password}</span>}
                  </dd>
                  :
                  <dd className={styles.form__input}>
                    <input
                      type="password"
                      className={[styles.validateTarget, "validateTarget"].join(" ")}
                      id="password"
                      name="password"
                      required
                      maxLength="128"
                      minLength="8"
                      autoComplete="current-password"
                      value={password}
                      data-elm-name='新しいパスワード'
                      onChange={e => setPassword(e.target.value)}
                    />
                    <img
                      className={styles.passwordEye}
                      src="/images/eye-icon.svg"
                      onClick={() => setShowPassword(true)}
                    />
                    <small className={styles.entryNotice}>8文字以上、[A-Z][a-z][0-9]から1文字ずつ</small>
                    {errors?.password && <span className={styles.isError}>{errors.password}</span>}
                  </dd>
                }
              </div>
              <div className={[styles.form__parts, styles.form__partsMust].join(" ")}>
                <dt className={[styles.form__title, styles.isError].join(" ")}>
                  <label htmlFor="password">
                    <span>新しいパスワード<br /><small>（確認用）</small></span>
                  </label>
                </dt>

                {showConfirmPassword ?
                  <dd className={styles.form__input}>
                    <input
                      type="text"
                      className={[styles.validateTarget, "validateTarget"].join(" ")}
                      id="password_confirmation"
                      name="password_confirmation"
                      required
                      maxLength="128"
                      minLength="8"
                      pattern={password}
                      autoComplete="current-password"
                      value={confirmPassword}
                      data-elm-name='パスワード（確認用）'
                      data-type='comfirm_password'
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <img
                      className={styles.passwordEyeSlash}
                      src="/images/eye-slash-icon.svg"
                      onClick={() => setShowConfirmPassword(false)}
                    />
                      <small className={styles.entryNotice}>確認のためもう一度入力してください</small>
                    {errors?.password_confirmation && <span className={styles.isError}>{errors.password_confirmation}</span>}
                  </dd>
                  :
                  <dd className={styles.form__input}>
                    <input
                      type="password"
                      className={[styles.validateTarget, "validateTarget"].join(" ")}
                      id="password_confirmation"
                      name="password_confirmation"
                      required
                      maxLength="128"
                      minLength="8"
                      pattern={password}
                      autoComplete="current-password"
                      value={confirmPassword}
                      data-elm-name='パスワード（確認用）'
                      data-type='comfirm_password'
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <img
                      className={styles.passwordEye}
                      src="/images/eye-icon.svg"
                      onClick={() => setShowConfirmPassword(true)}
                    />
                    <small className={styles.entryNotice}>確認のためもう一度入力してください</small>
                    {errors?.password_confirmation && <span className={styles.isError}>{errors.password_confirmation}</span>}
                  </dd>
                }

              </div>
            </dl>
            <p className={styles.buttonArea} style={{marginTop: "40px"}}>
              <Button type="button"
                width={400}
                height={57}
                fontSize={18}
                onClick={validate}
                disabled={isSubmitting}
              >
                <span className={styles.arrow}>パスワードを決定する</span>
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
