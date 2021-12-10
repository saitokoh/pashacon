import React, { useState, useEffect, useRef } from 'react'
import { useParams} from 'react-router-dom'
import { useSelector } from "react-redux"
import { axios } from "redux-token-auth"
// components
import Button from 'pages/common/components/Button'
import CVButton from 'pages/common/components/CVButton'
import Modal from 'pages/common/components/Modal'
import Loading from 'pages/common/components/Loading'
import PreBox from 'pages/common/components/PreBox'
// localModule
import ImageEditor from 'imageEditor'
// style
import styles from '../styles/contest.scss'
import commonStyles from 'pages/common/styles/common.scss'

// const
const defaultImagePath = "/images/set_picture.png"

export default function Contest() {
  const loadingRef = useRef(null)
  const postModal = useRef(null)
  const { eventId } = useParams();

  const [maxImageWidthAndHeight, setMaxImageWidthAndHeight] = useState(500)
  const [event, setEvent] = useState({})
  const [posts, setPosts] = useState([])
  const [postDescription, setPostDescription] = useState("")
  const [postDescriptionInvisible, setPostDescriptionInvisible] = useState("")
  const [postImageWidth, setPostImageWidth] = useState(maxImageWidthAndHeight)
  const [postImageHeight, setPostImageHeight] = useState(maxImageWidthAndHeight)
  const [iconUrl, setIconUrl] = useState(defaultImagePath)
  const [imageEditor, setImageEditor] = useState(new ImageEditor())
  const [postErrorMessages, setPostErrorMessages] = useState([])
  const [modalTop, setModalTop] = useState(200)

  // redux store
  const user = useSelector((state) => state.reduxTokenAuth.currentUser).attributes;

  // methods
  // 画面サイズ取得のための処理
  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions()) // 画面サイズ

  const handlePostDescription = e => {
    setPostErrorMessages([])
    setPostDescription(e.target.value)
    setPostDescriptionInvisible(e.target.value + '\u200b')
  }

  const handleComment = (e, postId) => {
    const post = posts.find(post => post.id == postId)
    post.draftComment = e.target.value
    post.draftCommentInvisible = e.target.value + '\u200b'
    setPosts([...posts])
  }

  const opencloseCommentList = (postId, to) => {
    const post = posts.find(post => post.id == postId)
    post.commentShowFlag = to
    setPosts([...posts])
  }

  const openPostModal = () => {
    setPostImageWidth(maxImageWidthAndHeight)
    setPostImageHeight(maxImageWidthAndHeight)
    setIconUrl(defaultImagePath)
    setPostDescription("")
    postModal.current.open()
  }

  const selectIcon = e => {
    setPostErrorMessages([])
    imageEditor.selectFileAndResize(
      document.getElementById('resizeContainer'),
      590,
      770,
      setPostImageWidth,
      setPostImageHeight,
      maxImageWidthAndHeight,
      setIconUrl)
  }

  // postのfetch処理
  const fetchPost = async () => {
    loadingRef.current.startLoading()
    try {
      const res = await axios.get(`/api/v1/event/${eventId}`)
      setEvent(res.data.event)
      setPosts(res.data.posts.map(post => ({ ...post, draftComment: "", draftCommentInvisible: "", commentShowFlag: false})))
    } catch(e) {
      console.log(e)
    } finally {
      loadingRef.current.stopLoading()
    }
  }

  // 写真投稿処理
  const postImage = async () => {
    setPostErrorMessages([])
    // 簡易validate
    const messages = []
    if (iconUrl == defaultImagePath) {
      messages.push("画像を選択してください")
    }
    if (postDescription == '') {
      messages.push("説明を入力してください")
    }
    if (messages.length > 0) {
      setPostErrorMessages(messages)
      return
    }

    loadingRef.current.startLoading()

    // パラメータセッティング。画像はBlobで
    const formData = new FormData()
    formData.append("image", imageEditor.getBlob())
    formData.append("description", postDescription)

    try {
      // 投稿api
      await axios.post(`/api/v1/event/${eventId}/post`, formData, { headers: { 'content-type': 'multipart/form-data' } })
      // posts取得api
      await fetchPost()
      // modal close
      postModal.current.close()
      scrollToEnd()
    } catch(e) {
      console.log(e)
      setPostErrorMessages(['予期せぬエラーが発生しました。しばらく経ってから再度試しください'])
    } finally {
      loadingRef.current.stopLoading()
    }
  }

  // コメント投稿処理
  const postComment = async postId => {
    const post = posts.find(post => post.id == postId)
    if (!post.draftComment) {
      // コメント未入力は何もしない
      return
    }

    loadingRef.current.startLoading()

    try {
      await axios.post(`/api/v1/post/${postId}/comment/register`, {
        user_id: user.id,
        post_id: postId,
        comment: post.draftComment
      })
      post.draftComment = ""
      post.draftCommentInvisible = ""
      const res = await axios.get(`/api/v1/post/${postId}/comments`)
      post.comments = res.data.comments
      setPosts([...posts])
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

  // 一番下までスクロールする
  const scrollToEnd = () => {
    document.getElementById("footer").scrollIntoView({ behavior: "smooth", block: "end" });
  }

  // effects
  useEffect(() => {
    // データ取得
    fetchPost()

    // 画面サイズ取得の為の処理
    const onResize = () => {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener('resize', onResize);
    
    return () => window.removeEventListener('resize', onResize);
  }, [])

  // 画面サイズ変更時の処理
  useEffect(() => {
    if (windowDimensions.width <= 755) {
      setModalTop(170)
      setMaxImageWidthAndHeight(windowDimensions.width >= 400 ? 400 : windowDimensions.width - 40)
    } else {
      setModalTop(200)
      setMaxImageWidthAndHeight(500)
    }
    
  }, [windowDimensions])

  return (
    <>
      <div className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.titleBox}>
            <h1>{event.name}</h1><small className={[commonStyles.badge, contestStateStyle(event.eventStatusName)].join(" ")}>{event.eventStatusDisplayName}</small>
          </div>
          <div className={styles.rowWrap}>
            <div className={styles.row}>

              {posts.length == 0 ? (
                <div className={styles.nothing}>投稿がありません</div>
              ) : posts.map((post,i) => (
                <div key={i} className={styles.box}>
                  <div className={styles.postName}>
                    <span>投稿者：{post.userName}</span>
                  </div>
                  <div className={styles.imageWrap}>
                    <img src={post.path.url} />
                  </div>
                  <div className={styles.description}>
                    <PreBox>{post.description}</PreBox>
                  </div>
                  <div className={styles.commentArea}>
                    {post.comments.length > 0 ? (
                      <>
                        {post.commentShowFlag ? (
                          <>
                            <div className={styles.commentOpen} onClick={() => opencloseCommentList(post.id, false)}>コメントを閉じる</div>
                            {post.comments.map((comment,j) => (
                              <div key={j} className={styles.commentStr}>
                                <p>{comment.userName}：</p>
                                <pre>{comment.comment}</pre>
                              </div>
                            ))}
                          </>
                        ) : (
                          <div className={styles.commentOpen} onClick={() => opencloseCommentList(post.id, true)}>コメント{post.comments.length}件を全て見る</div>
                        )}
                      </>) : null}
                  </div>
                  <div className={styles.addCommentWrap}>
                    <div className={styles.textareaWrap}>
                      <pre className={styles.dummyTextarea}>{post.draftCommentInvisible}</pre>
                      <textarea className={styles.addComment} placeholder="コメントを追加..." value={post.draftComment} onChange={e => handleComment(e, post.id)}></textarea>
                    </div>
                    <div className={styles.postCommentButton} onClick={() => postComment(post.id)}>投稿する</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.buttonArea}>
        <CVButton width={60} height={60} fontSize={30} onClick={openPostModal}>
          ＋
        </CVButton>
      </div>
      <Loading ref={loadingRef} />
      <Modal ref={postModal} needCloseButton={true} top={modalTop}>
        {postErrorMessages.length > 0 ? (
          <div className={styles.errorArea}>
            {postErrorMessages.map((msg, i) => <p key={i}>{msg}</p>)}
          </div>
        ) : null}
        <div className={styles.imageAreaWrap}>
          <div className={styles.imageArea} onClick={selectIcon}>
            <img src={iconUrl} width={postImageWidth} height={postImageHeight}/>
            <Button width={120} height={30} fontSize={14}>写真を選択</Button>
          </div>
        </div>
        <div className={styles.descriptionArea}>
          <pre>{postDescriptionInvisible}</pre>
          <textarea placeholder="説明を追加..." value={postDescription} onChange={handlePostDescription}></textarea>
        </div>
        <div className={styles.postButtonArea}>
          <CVButton width={150} height={40} fontSize={18} onClick={postImage}>投稿する</CVButton>
        </div>
      </Modal>
      <div id="resizeContainer" style={{display: 'none'}}></div>
    </>
  );
}
