import React from 'react';
// component
import Button from 'pages/common/components/Button'

// style
import styles from '../styles/passwordInitSet.scss'

export default function PasswordInitSetInput() {

  // methods
  const toLogined = () => {
    window.location.href = '/'
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.childTitle}>パスワード初期設定</h1>
      <div className={styles.childContainer}>
      </div>
      <div className={styles.childContainer}>
        <p className={styles.thanksTitle}>
          パスワードの設定が完了しました。
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
            <span className={[styles.arrow, styles.arrowGreen].join(" ")}>ログイン画面へ</span>
          </Button>
        </p>
      </div>
    </main>
  );
}
