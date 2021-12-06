import React, { useState, forwardRef, useImperativeHandle } from 'react';

import styles from '../styles/loading.scss'

const Loading = (props, ref) => {

  // state
  const [isLoading, setIsLoading] = useState(false)

  // 親から実行できる関数を定義
  useImperativeHandle(ref, () => {
    return {
      startLoading() {
        setIsLoading(true)
      },
      stopLoading() {
        setIsLoading(false)
      }
    }
  })

  return (
    <div className={styles.loadingWrap} style={{ display: isLoading ? 'block' : 'none' }}>
      <div className={styles.loading}></div>
    </div>
  )
}

export default forwardRef(Loading)