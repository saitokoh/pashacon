import React from 'react';
// component
import Button from 'pages/common/components/Button'

// style
import styles from '../styles/passwordReset.scss'

export default function PasswordResetInput() {

  // methods
  const toLogined = () => {
    console.log(location)
    window.location.href = '/'
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.childTitle}>パスワード再設定</h1>
      <div className={styles.childContainer}>

      </div>
      <div className={styles.childContainer}>
        <p className={styles.thanksTitle}>
          パスワードの再設定が完了しました。
        </p>
        <p className={styles.thanksText}>
          管理画面にログインしてください。
        </p>
        <p className={styles.buttonArea} style={{ marginTop: "40px" }}>
          <Button type="button"
            width={250}
            height={60}
            fontSize={18}
            outline={true}
            onClick={toLogined}
          >
            <span className={[styles.arrow, styles.arrowGreen].join(" ")}>管理画面へ</span>
          </Button>
        </p>
      </div>
    </main>
  );
}
