import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux"
import { axios } from "redux-token-auth"
// components
import Loading from 'pages/common/components/Loading'
// style
import styles from '../styles/contestList.scss'
import commonStyles from 'pages/common/styles/common.scss'


export default function ContestList() {
  const loadingRef = useRef(null)

  // state
  const [events, setEvents] = useState([])

  // redux store
  const user = useSelector((state) => state.reduxTokenAuth.currentUser).attributes;

  // methods
  // 主催コンテストのfetch処理
  const fetchContests = async () => {
    loadingRef.current.startLoading()
    try {
      const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/v1/events`)
      setEvents(res.data.events)
    } catch (e) {
      console.log(e)
    } finally {
      loadingRef.current.stopLoading()
    }
  }

  // コンテスト状態スタイル決定
  const contestStateStyle = status => {
    if (status === 'post_accepting') {
      return commonStyles.posting
    } else if (status === 'voting_period') {
      return commonStyles.voting
    } else if (status === 'end') {
      return commonStyles.end
    }
  }

  // effects
  useEffect(() => {
    fetchContests()
  }, [])

  return (
    <>
      <div className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.titleBox}>
            <h1>参加コンテスト</h1>
          </div>
          <table className={styles.contestTable}>
            <thead>
              <tr>
                <th>コンテスト概要</th>
                <th className={styles.contestState}>コンテスト状態</th>
                <th>総投稿数</th>
                <th>{user.name}さんの投稿数</th>
              </tr>
            </thead>
            <tbody>
              {events.length == 0 ? (
                <tr style={{ textAlign: 'center' }}>
                  <td colSpan="4">参加したコンテストはありません</td>
                </tr>
              ) : events.map((event, i) => (
                <tr key={i}>
                  <td>
                    <div className={styles.tdTop}>
                      <Link to={`/contest/${event.id}`} className={[styles.link, styles.contestTitle].join(" ")}>
                        {event.name}
                      </Link>
                    </div>
                    <div className={[styles.tdMiddle, styles.descriptionWrap].join(" ")}>
                      <span className={styles.description}>主催者：</span>
                      <span className={styles.description}>{event.ownerName}</span>
                    </div>
                  </td>

                  <td>
                    <label className={[commonStyles.badge, contestStateStyle(event.eventStatusName)].join(" ")}>
                      {event.eventStatusDisplayName}
                    </label>
                  </td>
                  <td><label>{event.postNum}件</label></td>
                  <td><label>{event.myPostNum}件</label></td>
                </tr>
              ))}              
            </tbody>
          </table>
          <div className={[styles.forSp, styles.spWrap].join(" ")}>
            <ul>
              {events.length == 0 ? (
                <li>
                  <div className={styles.listSp}>
                    参加したコンテストはありません
                  </div>
                </li>
              ) : events.map((event, i) => (
                <li key={i}>
                  <div className={styles.listSp}>
                    <div className={styles.listSpTop}>
                      <label className={[commonStyles.badge, contestStateStyle(event.eventStatusName)].join(" ")}>
                        {event.eventStatusDisplayName}
                      </label>
                      <span className={styles.description}>主催者：{event.ownerName}</span>
                    </div>

                    <div className={styles.listSpTitle}>
                      <Link to={`/contest/${event.id}`} className={[styles.link, styles.contestTitle].join(" ")}>
                        {event.name}
                      </Link>
                    </div>
                    <div className={[styles.listSpBottom].join(" ")}>
                      <span className={styles.description}>投稿数：{event.postNum}件</span>
                      <span className={styles.description}>/</span>
                      <span className={styles.description}>{user.name}さんの投稿数：{event.myPostNum}件</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Loading ref={loadingRef} />
    </>
  );
}
