import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { push } from 'connected-react-router';
import { axios } from "redux-token-auth"
// component
import Loading from 'pages/common/components/Loading'
// style
import styles from '../styles/home.scss'


export default function Home() {
  const dispatch = useDispatch()
  const loadingRef = useRef(null)

  // state
  const [joinedContestNum, setJoinedContestNum] = useState("")
  const [ownerContestNum, setOwnerContestNum] = useState("")

  // redux store
  const user = useSelector((state) => state.reduxTokenAuth.currentUser).attributes;

  // methods
  const toContestList = () => {
    dispatch(push('/contests'))
  }
  const toOwnerContestList = () => {
    dispatch(push('/ownerContests'))
  }

  const fetchHomeInfo = async () => {
    loadingRef.current.startLoading()
    try {
      const res = await axios.get(`/api/v1/home`)
      setJoinedContestNum(res.data.joinedEventCount)
      setOwnerContestNum(res.data.ownerEventCount)
    } catch (e) {
      console.log(e)
    } finally {
      loadingRef.current.stopLoading()
    }
  }

  // effects
  useEffect(() => {
    fetchHomeInfo()
  }, [])

  return (
    <>
      <div className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.titleBox}>
            <h1>{user.name}さん</h1>
          </div>
          <div className={styles.row}>
            <div className={styles.box} onClick={toContestList}>
              <h2>参加コンテスト</h2>
              <p>{joinedContestNum}件参加中</p>
            </div>
            <div className={styles.box} onClick={toOwnerContestList}>
              <h2>主催コンテスト</h2>
              <p>{ownerContestNum}件主催中</p>
            </div>
          </div>
        </div>
      </div>
      <Loading ref={loadingRef} />
    </>
  );
}
