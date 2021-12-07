export default class ImageEditor {
  /**
   * Canvas操作
   * @param {Object} opt 
   * @param {string} opt.imageSrc イメージのURL
   * @param {string} opt.canvasId canvasタグのid（デフォルト: image-for-edit)
   * @param {Number} opt.canvasWidthSize canvasのwidthサイズ(デフォルト: 128px)
   * @param {Number} opt.canvasHeightSize canvasのheightサイズ(デフォルト: 128px)
   * @param {Number} opt.scaleStep 拡大縮小の倍率(デフォルト: 0.25)
   * @param {string} opt.fileId input[type="file"]タグのid（デフォルト: image-for-file)
   */
  constructor(opt = {}) {
    this.src = opt.imageSrc || ''
    this.id = opt.canvasId || 'image-for-edit'
    this.widthSize = opt.canvasWidthSize || 128
    this.heightSize = opt.canvasHeightSize || 128
    this.scaleStep = opt.scaleStep || 0.25
    this.fileId = opt.fileId || 'image-for-file'

    // イベントの設定
    try {
      this.onDrawImage = new Event('drawImage')
      this.onLoadImageValidError = new Event('loadImageValidError')
      this.onNotImageValidError = new Event('notImageValidError')
    } catch (e) { // IE11対策
      this.onDrawImage = document.createEvent('CustomEvent')
      this.onDrawImage.initCustomEvent('drawImage', false, false, null)
      this.onLoadImageValidError = document.createEvent('CustomEvent')
      this.onLoadImageValidError.initCustomEvent('loadImageValidError', false, false, null)
      this.onNotImageValidError = document.createEvent('CustomEvent')
      this.onNotImageValidError.initCustomEvent('notImageValidError', false, false, null)
    }

    this.scale = 1
    this.dragInfo = {
      isDragging: false,
      startX: 0,
      startY: 0,
      diffX: 0,
      diffY: 0,
      canvasX: 0,
      canvasY: 0
    }
  }

  /**
   * リサイズ用のcanvasを挿入する
   * @param {*} el canvasやfileを作成するようのコンテナ（display: none推奨）
   */
  selectFileAndResize(el, maxWidth, maxHeight, previewWidthSetter, previewHeightSetter, maxImageWidthAndHeight, srcSetter) {
    this.img = new Image()
    this.img.crossOrigin = 'anonymous' // 「Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.」というエラーになるため
    
    // ファイル読み込み
    this.inputFile = document.createElement('input')
    this.inputFile.type = 'file'
    this.inputFile.id = this.fileId
    this.inputFile.style.display = 'none'
    this.inputFile.addEventListener('change', event => {
      const imageData = event.target.files[0]
      // 画像ファイル以外は処理を止める
      if (!imageData.type.match('image.*')) {
        this.canvas.dispatchEvent(this.onNotImageValidError)
        return
      }
      const reader = new FileReader()
      reader.readAsDataURL(imageData)
      // ファイル読み込みに成功したときの処理
      reader.onload = e => {
        this.img.src = reader.result
        this.img.onload = () => {
          let width = this.img.width
          let height = this.img.height
          if (maxWidth < width) {
            height = Math.round(height * maxWidth / width)
            width = maxWidth
          }
          if (maxHeight < height) {
            width = Math.round(width * maxHeight / height)
            height = maxHeight
          }

          // canvas設定
          this.canvas = document.createElement('canvas')
          this.ctx = this.canvas.getContext('2d')
          this.canvas.width = width
          this.canvas.height = height

          // resize
          this.ctx.drawImage(this.img, 0, 0, width, height)
          // base64でsrcに出力
          srcSetter(this.canvas.toDataURL('image/jpg'))

          console.log(width, height)
          if (width > maxImageWidthAndHeight) {
            height = Math.round(height * maxImageWidthAndHeight / width)
            width = maxImageWidthAndHeight
          }

          console.log(width, height)
          if (height > maxImageWidthAndHeight) {
            width = Math.round(width * maxImageWidthAndHeight / height)
            height = maxImageWidthAndHeight
          }
          console.log(width, height)
          previewWidthSetter(width)
          previewHeightSetter(height)
        }
      }
    })
    this.inputFile.click()
  }


  /**
   * canvasを挿入する
   * @param {HTMLElement} el canvasを挿入する親要素
   * @return {void}
   */
  insertTo(el) {
    // canvas
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')

    this.canvas.id = this.id
    this.canvas.width = this.widthSize
    this.canvas.height = this.heightSize

    this.img = new Image()
    this.img.crossOrigin = 'anonymous' // 「Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.」というエラーになるため
    this.setImage(this.src)

    // mouse event
    this.canvas.addEventListener('mousedown', this.dragStart.bind(this))
    this.canvas.addEventListener('mousemove', this.drag.bind(this))
    this.canvas.addEventListener('mouseup', this.dragEnd.bind(this))
    this.canvas.addEventListener('mouseleave', this.dragEnd.bind(this))
    // touch event
    this.canvas.addEventListener('touchstart', this.touchStart.bind(this))
    this.canvas.addEventListener('touchmove', this.move.bind(this))
    this.canvas.addEventListener('touchend', this.dragEnd.bind(this))
    
    el.appendChild(this.canvas)

    const container = document.createElement('div')
    el.appendChild(container)

    // slider
    this.zoomSlider = document.createElement('input')
    this.zoomSlider.type = 'range'
    this.zoomSlider.min = 0.01
    this.zoomSlider.max = 2
    this.zoomSlider.value = 1
    this.zoomSlider.step = 'any'
    this.zoomSlider.addEventListener('change', this.zoom.bind(this)) // IE対策
    this.zoomSlider.addEventListener('input', this.zoom.bind(this))
    container.appendChild(this.zoomSlider)

    // file
    this.inputFile = document.createElement('input')
    this.inputFile.type = 'file'
    this.inputFile.id = this.fileId
    this.inputFile.style.display = 'none'
    this.inputFile.addEventListener('change', this.imageChange.bind(this))
    container.appendChild(this.inputFile)
  }

  /**
   * 画像をファイルから読み込む
   * @param {Event} event イベント
   * @return {void}
   */
  imageChange(event) {
    const imageData = event.target.files[0]

    // 画像ファイル以外は処理を止める
    if(!imageData.type.match('image.*')) {
      this.canvas.dispatchEvent(this.onNotImageValidError)
      return
    }

    const reader = new FileReader()
    // ファイル読み込みに成功したときの処理
    reader.onload = () => {
      this.zoomSlider.value = 1
      this.setImage(reader.result)
    }
    reader.readAsDataURL(imageData)
  }

  /**
   * 画像をcanvasにセットする
   */
  setImage(src) {
    this.img.src = src
    this.img.onload = () => {
      this.ctx.beginPath()
      this.ctx.arc((this.canvas.width/2), (this.canvas.height/2), (this.canvas.width/2), 0 * Math.PI / 180, 360 * Math.PI / 180)
      this.ctx.clip()
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.fillStyle = 'white'
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
      this.ctx.drawImage(this.img, 0, 0)
      this.inputFile.value = '' // chageイベント発火対策
      this.canvas.dispatchEvent(this.onDrawImage)
    }
    this.img.onerror = e => {
      [...el.children].forEach(a => a.remove())
      this.canvas.dispatchEvent(this.onLoadImageValidError)
    }
  }

  /**
   * 再描画する
   * @private
   * @return {void}
   */
  _redraw() {
    // canvasをクリア
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fillStyle = 'white'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    // リサイズ
    this.ctx.scale(this.scale, this.scale)
    // 再描画
    this.ctx.drawImage(this.img, this.dragInfo.diffX, this.dragInfo.diffY)
    // 変形マトリクスを元に戻す
    this.ctx.scale(1 / this.scale, 1 / this.scale)
  }

  /**
   * 拡大/縮小する
   * @param {Event} event イベント
   * @return {void}
   */
  zoom(event) {
    this.scale = event.target.value
    this._redraw()
  }

  /**
   * 拡大（ズームイン）する
   * @return {void}
   */
  zoomIn() {
    this.scale += this.scaleStep
    this._redraw()
  }
  /**
   * 縮小（ズームアウト）する
   * @return {void}
   */
  zoomOut() {
    this.scale -= this.scaleStep
    this._redraw()
  }

  /**
   * ドラッグ開始
   * @param {MouseEvent} event マウスイベント
   * @return {void}
   */
  dragStart(event) {
    this.dragInfo.isDragging = true
    this.dragInfo.startX = event.clientX
    this.dragInfo.startY = event.clientY
  }
  /**
   * タッチ開始
   * @param {TouchEvent} event タッチイベント
   * @return {void}
   */
  touchStart(event) {
    const touchObj = event.changedTouches[0]
    this.dragInfo.isDragging = true
    this.dragInfo.startX = touchObj.clientX
    this.dragInfo.startY = touchObj.clientY
  }
  /**
   * ドラッグで画像を移動する
   * @param {MouseEvent} event マウスイベント
   * @return {void}
   */
  drag(event) {
    if (this.dragInfo.isDragging) {
      // 開始位置 + 差分 / スケール （画像の大きさによる移動距離の補正のためスケールで割る）
      this.dragInfo.diffX = this.dragInfo.canvasX + (event.clientX - this.dragInfo.startX) / this.scale
      this.dragInfo.diffY = this.dragInfo.canvasY + (event.clientY - this.dragInfo.startY) / this.scale

      this._redraw()
      event.preventDefault()
    }
  }
  /**
   * スワイプで画像を移動する
   * @param {TouchEvent} event タッチイベント
   * @return {void}
   */
  move(event) {
    if (this.dragInfo.isDragging) {
      const touchObj = event.changedTouches[0]
      // 開始位置 + 差分 / スケール （画像の大きさによる移動距離の補正のためスケールで割る）
      this.dragInfo.diffX = this.dragInfo.canvasX + (touchObj.clientX - this.dragInfo.startX) / this.scale
      this.dragInfo.diffY = this.dragInfo.canvasY + (touchObj.clientY - this.dragInfo.startY) / this.scale

      this._redraw()
      event.preventDefault()
    }
  }
  /**
   * ドラッグ終了
   * @param {MouseEvent} event マウスイベント
   * @return {void}
   */
  dragEnd(event) {
    this.dragInfo.isDragging = false
    // mousedown時のカクつきをなくすため
    this.dragInfo.canvasX = this.dragInfo.diffX
    this.dragInfo.canvasY = this.dragInfo.diffY
  }

  /**
   * canvasを出力する
   * @return {Canvas}
   */
  getCanvas() {
    return this.canvas
  }

  /**
   * base64を出力する
   * @return {Image}
   */
  getBase64() {
    return this.canvas.toDataURL('image/jpg')
  }

  /**
   * バイナリイメージを出力する
   * @return {Image}
   */
  getBinary() {
    const bin = atob(this.getBase64().replace(/^.*,/, ''))
    const buffer = new Uint8Array(bin.length)
    for (var i = 0; i < bin.length; i++) {
      buffer[i] = bin.charCodeAt(i)
    }
    return buffer
  }

  /**
   * Blobを出力する
   * @return {Image}
   */
  getBlob() {
    const blob = new Blob([this.getBinary().buffer], {
      type: 'image/jpg'
    })
    return blob
  }
}
