export default class FormValidator {
  /**
   * HTML5フォームバリデーション
   * @param {Object} opt
   * @param {Object} opt.originalMessage 独自メッセージ
   * @param {Elment} opt.form フォーム要素
   * @param {string} opt.targetClass バリデーションターゲットのクラス（デフォルト：validateTarget）
   */
  constructor(opt = {}) {
    this.init();
    this.form = opt.form
    this.targetClass = opt.targetClass || 'validateTarget'

    // メッセージの追加
    if (!!opt.originalMessage) {
      Object.keys(opt.originalMessage).forEach(validKey => {
        this.errorMessages[validKey] = this.errorMessages[validKey] || {}
        Object.keys(opt.originalMessage[validKey]).forEach(typeKey => {
          this.errorMessages[validKey][typeKey] = opt.originalMessage[validKey][typeKey]
        })
      })
    }
  }
  
  init() {
    this.errorMessages = {
      valueMissing: {
        email(value='メールアドレス') {return `${value}を入力してください`},
        text(value) {return `${value}を入力してください`},
        url(value='URL') {return `${value}を入力してください`},
        number(value) {return `${value}を入力してください`},
        tel(value='電話番号') {return `${value}を入力してください`},
        password(value='パスワード') {return `${value}を入力してください`},
        textarea(value) {return `${value}を入力してください`},
        radio(value) {return `${value}を選択してください`},
        checkbox(value) {return `${value}を選択してください`},
        'select-one'(value) {return `${value}を選択してください`}
      },
      tooLong: {
        email(size, value='メールアドレス') {return `${value}は${size}文字以下で入力してください`},
        text(size, value) {return `${value}は${size}文字以下で入力してください`},
        url(size, value='URL') {return `${value}は${size}文字以下で入力してください`},
        number(size, value) {return `${value}は${size}文字以下で入力してください`},
        tel(size, value='電話番号') {return `${value}は${size}文字以下で入力してください`},
        password(size, value='パスワード') {return `${value}は${size}文字以下で入力してください`},
        textarea(size, value) {return `${value}は${size}文字以下で入力してください`},
        radio(size, value) {return `${value}は${size}文字以下で入力してください`},
        checkbox(size, value) {return `${value}は${size}文字以下で入力してください`},
        'select-one'(size, value) {return `${value}は${size}文字以下で入力してください`}
      },
      tooShort: {
        email(size, value='メールアドレス') {return `${value}は${size}文字以上で入力してください`},
        text(size, value) {return `${value}は${size}文字以上で入力してください`},
        url(size, value='URL') {return `${value}は${size}文字以上で入力してください`},
        number(size, value) {return `${value}は${size}文字以上で入力してください`},
        tel(size, value='電話番号') {return `${value}は${size}文字以上で入力してください`},
        password(size, value='パスワード') {return `${value}は${size}文字以上で入力してください`},
        textarea(size, value) {return `${value}は${size}文字以上で入力してください`},
        radio(size, value) {return `${value}は${size}文字以上で入力してください`},
        checkbox(size, value) {return `${value}は${size}文字以上で入力してください`},
        'select-one'(size, value) {return `${value}は${size}文字以上で入力してください`}
      },
      typeMismatch: {
        email(value='メールアドレス') {return `${value}の形式で入力しくてください`},
        text(value) {return `${value}の形式で入力しくてください`},
        url(value='URL') {return `${value}は「http://」もしくは「https://」から始まる文字列を入力してください`},
        number(value) {return `${value}の形式で入力しくてください`},
        tel(value='電話番号')  {return `${value}の形式で入力しくてください`},
        password(value='パスワード') {return `${value}の形式で入力しくてください`},
        textarea(value) {return `${value}の形式で入力しくてください`},
        radio(value) {return `${value}の形式で入力しくてください`},
        checkbox(value) {return `${value}の形式で入力しくてください`},
        'select-one'(value) {return `${value}の形式で入力しくてください`}
      },
      rangeOverflow: {
        email(size, value='メールアドレス') {return `${value}は${size}以下で入力してください`},
        text(size, value) {return `${value}は${size}以下で入力してください`},
        url(size, value='URL') {return `${value}は${size}以下で入力してください`},
        number(size, value) {return `${value}は${size}以下で入力してください`},
        tel(size, value='電話番号') {return `${value}は${size}以下で入力してください`},
        password(size, value='パスワード') {return `${value}は${size}以下で入力してください`},
        textarea(size, value) {return `${value}は${size}以下で入力してください`},
        radio(size, value) {return `${value}は${size}以下で入力してください`},
        checkbox(size, value) {return `${value}は${size}以下で入力してください`},
        'select-one'(size, value) {return `${value}は${size}以下で入力してください`}
      },
      rangeUnderflow: {
        email(size, value='メールアドレス') {return `${value}は${size}以上で入力してください`},
        text(size, value) {return `${value}は${size}以上で入力してください`},
        url(size, value='URL') {return `${value}は${size}以上で入力してください`},
        number(size, value) {return `${value}は${size}以上で入力してください`},
        tel(size, value='電話番号') {return `${value}は${size}以上で入力してください`},
        password(size, value='パスワード') {return `${value}は${size}以上で入力してください`},
        textarea(size, value) {return `${value}は${size}以上で入力してください`},
        radio(size, value) {return `${value}は${size}以上で入力してください`},
        checkbox(size, value) {return `${value}は${size}以上で入力してください`},
        'select-one'(size, value) {return `${value}は${size}以上で入力してください`}
      },
      patternMismatch: {
        email(value='メールアドレス') {return `${value}の形式で入力しくてください`},
        text(value) {return `${value}の形式で入力しくてください`},
        url(value='URL') {return `${value}の形式で入力しくてください`},
        number(value) {return `${value}の形式で入力しくてください`},
        tel(value='電話番号')  {return `${value}の形式で入力しくてください`},
        password(value='パスワード') {return `${value}の形式で入力しくてください`},
        textarea(value) {return `${value}の形式で入力しくてください`},
        radio(value) {return `${value}の形式で入力しくてください`},
        checkbox(value) {return `${value}の形式で入力しくてください`},
        'select-one'(value) {return `${value}の形式で入力しくてください`}
      }
    };
  }

  valid() {
    return this.form.checkValidity()
  }

  getErrors() {
    return Array.from(this.form.querySelectorAll(`.${this.targetClass}`))
      .filter(target => !target.checkValidity())
      .map(target => {
        const rtnObj = {target: target}
        
        if (target.validity.patternMismatch) {
          const func = this.errorMessages.patternMismatch[target.dataset.type] || this.errorMessages.patternMismatch[target.type]
          rtnObj.message = func(target.dataset.elmName)
        } else if (target.validity.rangeOverflow) {
          const func = this.errorMessages.rangeOverflow[target.dataset.type] || this.errorMessages.rangeOverflow[target.type]
          rtnObj.message = func(target.max,target.dataset.elmName)
        } else if (target.validity.rangeUnderflow) {
          const func = this.errorMessages.rangeUnderflow[target.dataset.type] || this.errorMessages.rangeUnderflow[target.type]
          rtnObj.message = func(target.min,target.dataset.elmName)
        } else if (target.validity.tooLong) {
          const func = this.errorMessages.tooLong[target.dataset.type] || this.errorMessages.tooLong[target.type]
          rtnObj.message = func(target.maxLength,target.dataset.elmName)
        } else if (target.validity.tooShort) {
          const func = this.errorMessages.tooShort[target.dataset.type] || this.errorMessages.tooShort[target.type]
          rtnObj.message = func(target.minLength,target.dataset.elmName)
        } else if (target.validity.typeMismatch) {
          const func = this.errorMessages.typeMismatch[target.dataset.type] || this.errorMessages.typeMismatch[target.type]
          rtnObj.message = func(target.dataset.elmName)
        } else if (target.validity.valueMissing) {
          const func = this.errorMessages.valueMissing[target.dataset.type] || this.errorMessages.valueMissing[target.type]
          rtnObj.message = func(target.dataset.elmName)
        }
        return rtnObj
      })
  }
}
