import "core-js/stable";
import "regenerator-runtime/runtime";
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
      const res = await axios.get(`/api/v1/events`)
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
                  <td colSpan="4">主催したコンテストはありません</td>
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
                      <span className={styles.description}>{event.ownerName}さん</span>
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
        </div>
      </div>
      <Loading ref={loadingRef} />
    </>
  );
}
