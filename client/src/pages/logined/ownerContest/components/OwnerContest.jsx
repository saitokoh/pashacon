import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from "react-redux"
import { axios } from "redux-token-auth"
// components
import Loading from 'pages/common/components/Loading'
import Button from 'pages/common/components/Button'
import Modal from 'pages/common/components/Modal'
// style
import styles from '../styles/ownerContest.scss'
import commonStyles from 'pages/common/styles/common.scss'


export default function OwnerContest() {
  const loadingRef = useRef(null)
  const complaeteModalRef = useRef(null)
  const { eventId } = useParams();

  // state
  const [posts, setPosts] = useState([])
  const [contestName, setContestName] = useState("")
  const [contestNameError, setContestNameError] = useState("")
  const [contestDescription, setContestDescription] = useState("")
  const [contestDescriptionError, setContestDescriptionError] = useState("")
  const [contestStatusId, setContestStatusId] = useState(null)
  const [contestStatusList, setContestStatusList] = useState([])

  // bind
  const handleContestStatusName = e => {
    setContestStatusId(e.target.value)
  }

  // methods
  // 主催コンテストのfetch処理
  const fetchContest = async () => {
    loadingRef.current.startLoading()
    try {
      const res = await axios.get(`/api/v1/event/ownerEvent/${eventId}`)
      setContestName(res.data.event.name)
      setContestDescription(res.data.event.description)
      setContestStatusId(res.data.event.eventStatusId)
      setContestStatusList(res.data.eventStatusList)
      setPosts(res.data.posts)
    } catch (e) {
      console.log(e)
    } finally {
      loadingRef.current.stopLoading()
    }
  }

  const calcPostNum = user => {
    return posts.filter(post => post.userId == user.id).length
  }

  const calcVoteNum = user => {
    return posts.flatMap(post => post.votes).filter(vote => vote.voteUserId == user.id).length
  }

  // コンテスト状態スタイル決定
  const contestStateStyle = id => {
    if (id === 1) {
      return styles.posting
    } else if (id === 2) {
      return styles.voting
    } else if (id === 99) {
      return styles.end
    }
  }

  // computed
  const users = useMemo(() => {
    const userIds = Array.from(new Set(posts.map(post => post.userId)))
    return userIds.map(userId => ({name: posts.find(post => post.userId == userId).userName, id: userId}))
  }, [posts])

  

  // コンテスト状態スタイル決定
  const update = async () => {
    if (!validate()) return

    loadingRef.current.startLoading()
    try {
      const res = await axios.post(`/api/v1/event/${eventId}/update`, {
        name: contestName,
        description: contestDescription,
        event_status_id: contestStatusId
      })
      complaeteModalRef.current.open()
      fetchContest()
    } catch(e) {
      console.log(e)
    } finally {
      loadingRef.current.stopLoading()
    }
  }

  // 簡易バリデーション
  const validate = () => {
    if (contestName == '' || contestDescription == '') {
      if (contestName == '') {
        setContestNameError("コンテスト名を入力してください")
      }
      if (contestDescriptionError == '') {
        setContestDescriptionError('コンテストの説明を入力してください')
      }
      return false
    }
    setContestNameError("")
    setContestDescriptionError("")
    return true
  }

  // effects
  useEffect(() => {
    fetchContest()
  }, [])

  return (
    <>
      <div className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.titleBox}>
            <h1>主催コンテスト</h1>
          </div>
          <div className={styles.container}>
            <div className={styles.titleArea}>
              <h2>参加状況</h2>
            </div>
            <div className={styles.inputAreaWrap}>
              <div className={styles.inputArea}>
                <label className={styles.joinNum}>{users.length}人参加中 / {posts.length}件投稿</label>
              </div>
              <div className={styles.inputArea}>
                <table className={styles.contestTable}>
                  <thead>
                    <tr>
                      <th>メンバー</th>
                      <th>投稿数</th>
                      <th>投票数</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length == 0 ? (
                      <tr style={{ textAlign: 'center' }}>
                        <td colSpan="3">参加者はいません</td>
                      </tr>
                    ) : users.map((user, i) => (
                      <tr key={i}>
                        <td>{user.name}</td>
                        <td>{calcPostNum(user)}件</td>
                        <td>{calcVoteNum(user)}票</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className={styles.titleArea}>
              <h2>情報変更</h2>
            </div>
            <div className={styles.inputAreaWrap}>
              <div className={styles.inputArea}>
                <label>コンテストステータス</label>
                <div className={styles.radioField}>
                  {contestStatusList.map((contestStatus,i) => (
                    <div className={styles.contestStatusWrap} key={i}>
                      <input type="radio" name="contest_status"
                        value={contestStatus.id} id={`contestStatus${contestStatus.id}`} defaultChecked={contestStatus.id == contestStatusId}
                        onChange={handleContestStatusName}/>
                      <label htmlFor={`contestStatus${contestStatus.id}`} className={contestStateStyle(contestStatus.id)}>
                        {contestStatus.displayName}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.inputArea}>
                <label>コンテスト名<small>（30文字まで）</small></label>
                <input type="text" maxLength="30" value={contestName} onChange={e => setContestName(e.target.value)} />
                {contestNameError ? <div className={commonStyles.error}>{contestNameError}</div> : ""}
              </div>
              <div className={styles.inputArea}>
                <label>コンテストの招待メッセージ<br className={styles.forSp}/><small>（1000文字まで）</small></label>
                <textarea maxLength="1000" value={contestDescription} onChange={e => setContestDescription(e.target.value)}></textarea>
                {contestDescriptionError ? <div className={commonStyles.error}>{contestDescriptionError}</div> : ""}
              </div>
            </div>
            <div className={styles.buttonArea}>
              <Button width={230} height={40} fontSize={14} onClick={update}>
                更新する
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Loading ref={loadingRef} />
      <Modal ref={complaeteModalRef} needCloseButton={true}>
        <div className={styles.completeModal}>
          更新しました
        </div>
      </Modal>
    </>
  );
}
