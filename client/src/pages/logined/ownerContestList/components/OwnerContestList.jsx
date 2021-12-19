import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { push } from 'connected-react-router'
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { axios } from "redux-token-auth"
// components
import Button from 'pages/common/components/Button'
import CVButton from 'pages/common/components/CVButton'
import Modal from 'pages/common/components/Modal'
import Loading from 'pages/common/components/Loading'
// style
import styles from '../styles/ownerContestList.scss'
import commonStyles from 'pages/common/styles/common.scss'


export default function OwnerContestList() {
  const dispatch = useDispatch()
  const loadingRef = useRef(null)
  const contestRegisterModalRef = useRef(null)
  const contestRegisteredModalRef = useRef(null)

  // state
  const [events, setEvents] = useState([])
  const [newContestName, setNewContestName] = useState("")
  const [newContestNameError, setNewContestNameError] = useState("")
  const [newContestDescription, setNewContestDescription] = useState("")
  const [newContestDescriptionError, setNewContestDescriptionError] = useState("")
  const [newContestInvitationUrl, setNewContestInvitationUrl] = useState("")
  const [registerModalState, setRegisterModalState] = useState('input')
  const [isSubmitting, setIsSubmitting] = useState(false);

  // redux store
  const user = useSelector((state) => state.reduxTokenAuth.currentUser).attributes;

  // methods
  // 主催コンテストのfetch処理
  const fetchOwnerContests = async () => {
    loadingRef.current.startLoading()
    setIsSubmitting(true);
    try {
      const res = await axios.get(`/api/v1/event/ownerEvents`)
      setEvents(res.data.events)
    } catch (e) {
      console.log(e)
    } finally {
      loadingRef.current.stopLoading()
      setIsSubmitting(false);
    }
  }

  // イベント新規登録用モーダルオープン
  const openContestRegisterModal = () => {
    setRegisterModalState('input')
    contestRegisterModalRef.current.open()
  }

  // イベント新規登録処理、確認画面遷移
  const toNewContestConfirm = () => {
    // 簡易バリデーション
    if (newContestName == '' || newContestDescription == '') {
      if (newContestName == '') {
        setNewContestNameError("コンテスト名を入力してください")
      }
      if (newContestDescriptionError == '') {
        setNewContestDescriptionError('コンテストの説明を入力してください')
      }
      return
    }
    setNewContestNameError("")
    setNewContestDescriptionError("")
    setRegisterModalState('confirm')
  }

  const toNewContestInput = () => {
    setRegisterModalState('input')
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

  // 新規コンテスト登録処理
  const registerNewContest = async () => {
    loadingRef.current.startLoading()
    setIsSubmitting(true);
    try {
      const res = await axios.post(`/api/v1/event/register`, {
        name: newContestName,
        description: newContestDescription
      })
      setNewContestInvitationUrl(res.data.invitationUrl)
      setNewContestName("")
      setNewContestDescription("")
      contestRegisterModalRef.current.close()
      contestRegisteredModalRef.current.open()
      fetchOwnerContests()
    } catch (e) {
      console.log(e)
    } finally {
      loadingRef.current.stopLoading()
      setIsSubmitting(false);
    }
  }

  // 主催コンテスト詳細画面へ
  const toOwnerContest = eventId => {
    dispatch(push(`/ownerContest/${eventId}`))
  }

  // effects
  useEffect(() => {
    fetchOwnerContests()
  }, [])

  return (
    <>
      <div className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.titleBox}>
            <h1>主催コンテスト</h1>
          </div>
          <div className={styles.buttonArea}>
            <CVButton width={280} height={45} fontSize={15} onClick={openContestRegisterModal}>
              新しくフォトコンテストを作成する
            </CVButton>
          </div>
          <table className={styles.contestTable}>
            <thead>
              <tr>
                <th>コンテスト概要</th>
                <th className={styles.contestState}>コンテスト状態</th>
                <th className={styles.postNum}>合計投稿数</th>
                <th className={styles.editSpace}></th>
              </tr>
            </thead>
            <tbody>
              {events.length == 0 ? (
                <tr style={{textAlign: 'center'}}>
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
                    <div className={[styles.tdBottom, styles.descriptionWrap].join(" ")}>
                      <span className={styles.description}>招待URL：</span>
                      <input type="text" defaultValue={event.invitationUrl} />
                    </div>
                  </td>
                  <td>
                    <label className={[commonStyles.badge, contestStateStyle(event.eventStatusName)].join(" ")}>
                      {event.eventStatusDisplayName}
                    </label>
                  </td>
                  <td><label>{event.postNum}件</label></td>
                  <td><button className={commonStyles.normalButton} onClick={() => toOwnerContest(event.id)}>詳細</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={[styles.forSp, styles.spWrap].join(" ")}>
            <ul>
              {events.length == 0 ? (
                <li>
                  <div className={styles.listSp}>
                    主催したコンテストはありません
                  </div>
                </li>
              ) : events.map((event, i) => (
                <li key={i}>
                  <div className={styles.listSp}>
                    <div className={styles.listSpTop}>
                      <label className={[commonStyles.badge, contestStateStyle(event.eventStatusName)].join(" ")}>
                        {event.eventStatusDisplayName}
                      </label>
                      <button className={commonStyles.normalButton} onClick={() => toOwnerContest(event.id)}>詳細</button>
                    </div>

                    <div className={styles.listSpTitle}>
                      <Link to={`/contest/${event.id}`} className={[styles.link, styles.contestTitle].join(" ")}>
                        {event.name}
                      </Link>
                    </div>
                    <div className={[styles.listSpBottom, styles.descriptionWrap].join(" ")}>
                      <span className={styles.description}>招待URL：</span>
                      <input type="text" defaultValue={event.invitationUrl} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Loading ref={loadingRef} />
      <Modal ref={contestRegisterModalRef} needCloseButton={true}>
        {registerModalState === 'input' ? (
          <div className={styles.ContestRegisterModal}>
            <div className={styles.titleArea}>
              <h2>フォトコンテストの作成</h2>
            </div>
            <div className={styles.inputAreaWrap}>
              <div className={styles.inputArea}>
                <label>コンテスト名<small>（30文字まで）</small></label>
                <input type="text" maxLength="30" value={newContestName} onChange={e => setNewContestName(e.target.value)} />
                {newContestNameError ? <div className={commonStyles.error}>{newContestNameError}</div> : ""}
              </div>
              <div className={styles.inputArea}>
                <label>コンテストの招待メッセージ<small>（1000文字まで）</small></label>
                <textarea maxLength="1000" value={newContestDescription} onChange={e => setNewContestDescription(e.target.value)}></textarea>
                {newContestDescriptionError ? <div className={commonStyles.error}>{newContestDescriptionError}</div> : ""}
              </div>
            </div>
            <div className={styles.modalButtonArea}>
              <Button width={210} height={40} fontSize={14} onClick={toNewContestConfirm}>確認画面へ</Button>
            </div>
          </div>
        ) : (
          <div className={styles.ContestRegisterModal}>
            <div className={styles.titleArea}>
              <h2>確認</h2>
            </div>
            <div className={styles.inputAreaWrap}>
              <div className={styles.inputArea}>
                <label>コンテスト名</label>
                <label className={styles.contestTitle}>{newContestName}</label>
              </div>
              <div className={styles.inputArea}>
                <label>コンテストの説明</label>
                <pre>{newContestDescription}</pre>
              </div>
            </div>
            <div className={styles.modalButtonArea}>
              <Button width={230} height={40} fontSize={14} outline={true} onClick={toNewContestInput} disabled={isSubmitting}>
                戻る
              </Button>
              <Button width={230} height={40} fontSize={14} onClick={registerNewContest} disabled={isSubmitting}>
                フォトコンテストを作成する
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <Modal ref={contestRegisteredModalRef} needCloseButton={true}>
        <div className={styles.ContestRegisteredModal}>
          <h2>フォトコンテストが作成されました！</h2>
          <p>
            招待URLを発行しましたので、<br />コンテストに参加予定の方に共有しましょう。<br/>
            招待URLからアカウントの登録、またはログインを行うと、<br />コンテストに参加することが出来ます。
          </p>
          <div className={styles.urlBox}>
            <label>招待URL</label>
            <input type="text" defaultValue={newContestInvitationUrl}/>
          </div>
        </div>
      </Modal>
    </>
  );
}
