import React, { useState, useRef } from 'react'
import { push } from 'connected-react-router'
import { useDispatch } from "react-redux"
import { axios } from "redux-token-auth"
import FormValidator from 'formValidator';

// components
import Loading from 'pages/common/components/Loading'
import Button from 'pages/common/components/Button'

// style
import styles from '../styles/passwordEdit.scss'

export default function PasswordEdit() {
  const dispatch = useDispatch()
  const loadingRef = useRef(null)

  // state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // methods
  const toProfile = () => {
    dispatch(push('/profile'))
  }

  const changePassword = () => {
    loadingRef.current.startLoading()
    setIsSubmitting(true);
    axios.patch(`/api/v1/corporation/profile/password`, { password: password, password_confirmation: confirmPassword}).then(response => {
      loadingRef.current.stopLoading()
      setIsSubmitting(false);
      dispatch(push({
        pathname: '/profile',
        state: { fromAction: 'passwordChanged' }
      }))
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
  
  const topicPath = [
    {
      label: 'プロフィール',
      path: '/profile'
    },
    {
      label: 'パスワード変更',
      path: null
    }
  ]

  return (
    <>
      <div className={styles.main}>
        <div className={styles.inner}>
          <h2>パスワード変更</h2>
          <div className={styles.box}>
            <form id="passwordChangeForm" noValidate>
              <ul>
                <li>
                  <label>新しいパスワード</label>
                  {showPassword ?
                    <div className={styles.inputWrap}>
                      <input
                        type="text"
                        className={[styles.validateTarget, "validateTarget"].join(" ")}
                        id="password"
                        name="password"
                        required
                        autoComplete="current-password"
                        value={password}
                        data-elm-name='新しいパスワード'
                        maxLength="128"
                        minLength="8"
                        onChange={e => setPassword(e.target.value)}
                      />
                      <img
                        className={styles.passwordEyeSlash}
                        src="/images/eye-slash-icon.svg"
                        onClick={() => setShowPassword(false)}
                      />
                      <small className={styles.entryNotice}>8文字以上、[A-Z][a-z][0-9]から1文字ずつ</small>
                      {!!errors.password && <span className={styles.isError}>{errors.password}</span>}
                    </div>
                    :
                    <div className={styles.inputWrap}>
                      <input
                        type="password"
                        className={[styles.validateTarget, "validateTarget"].join(" ")}
                        id="password"
                        name="password"
                        required
                        autoComplete="current-password"
                        value={password}
                        data-elm-name='新しいパスワード'
                        maxLength="128"
                        minLength="8"
                        onChange={e => setPassword(e.target.value)}
                      />
                      <img
                        className={styles.passwordEye}
                        src="/images/eye-icon.svg"
                        onClick={() => setShowPassword(true)}
                      />
                      <small className={styles.entryNotice}>8文字以上、[A-Z][a-z][0-9]から1文字ずつ</small>
                      {!!errors.password && <span className={styles.isError}>{errors.password}</span>}
                    </div>
                  }
                </li>
                <li>
                  <label>新しいパスワード<br /><small>（確認用）</small></label>
                  {showConfirmPassword ?
                    <div className={styles.inputWrap}>
                      <input
                        type="text"
                        className={[styles.validateTarget, "validateTarget"].join(" ")}
                        id="password_confirmation"
                        name="password_confirmation"
                        required
                        autoComplete="current-password"
                        value={confirmPassword}
                        data-elm-name='新しいパスワード（確認用）'
                        data-type='comfirm_password'
                        maxLength="128"
                        minLength="8"
                        pattern={password}
                        onChange={e => setConfirmPassword(e.target.value)}
                      />
                      <img
                        className={styles.passwordEyeSlash}
                        src="/images/eye-slash-icon.svg"
                        onClick={() => setShowConfirmPassword(false)}
                      />
                      <small className={styles.entryNotice}>確認のためもう一度入力してください</small>
                      {!!errors.password_confirmation && <span className={styles.isError}>{errors.password_confirmation}</span>}
                    </div>
                    :
                    <div className={styles.inputWrap}>
                      <input
                        type="password"
                        className={[styles.validateTarget, "validateTarget"].join(" ")}
                        id="password_confirmation"
                        name="password_confirmation"
                        required
                        autoComplete="current-password"
                        value={confirmPassword}
                        data-elm-name='パスワード（確認用）'
                        data-type='comfirm_password'
                        maxLength="128"
                        minLength="8"
                        pattern={password}
                        onChange={e => setConfirmPassword(e.target.value)}
                      />
                      <img
                        className={styles.passwordEye}
                        src="/images/eye-icon.svg"
                        onClick={() => setShowConfirmPassword(true)}
                      />
                      <small className={styles.entryNotice}>確認のためもう一度入力してください</small>
                      {!!errors.password_confirmation && <span className={styles.isError}>{errors.password_confirmation}</span>}
                    </div>
                  }
                </li>
              </ul>
            </form>
          </div>
          <div className={styles.buttonArea}>
            <Button type="button"
              width={300}
              height={61}
              fontSize={18}
              outline={true}
              onClick={toProfile}
            >
              戻る
            </Button>
            <Button type="button"
              width={300}
              height={61}
              fontSize={18}
              onClick={validate} 
              disabled={isSubmitting}
            >
              上記内容で変更する
            </Button>
          </div>
        </div>
      </div>
      <Loading ref={loadingRef} />
    </>
  );
}
