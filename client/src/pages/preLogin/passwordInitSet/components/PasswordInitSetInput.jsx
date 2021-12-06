import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom'
import { useDispatch } from "react-redux";
import { push } from 'connected-react-router';
import { axios } from "redux-token-auth"
import FormValidator from 'formValidator';
// component
import Loading from 'pages/common/components/Loading'
import Button from 'pages/common/components/Button'

// style
import styles from '../styles/passwordInitSet.scss'

export default function PasswordInitSetInput() {
  const params = useParams()
  const dispatch = useDispatch();
  const loadingRef = useRef(null)

  // state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [entryCompanyUser, setEntryComapanyUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // mounted
  useEffect(() => {
    (async () => {
      loadingRef.current.startLoading()
      setIsSubmitting(true);
      try {
        const res = await axios.get(`/api/v1/corporation/entry_company_user`, {
          params: {
            token: params.token
          }
        })
        setIsSubmitting(false);
        setEntryComapanyUser(res.data.entry_company_user)
      } catch (e) {
        setIsSubmitting(false);
        window.location.href = '/404'
      }
      loadingRef.current.stopLoading()
    })()
  }, [])

  // methods
  const changePassword = () => {
    loadingRef.current.startLoading()
    setIsSubmitting(true);
    axios.put('/api/v1/corporation/company_user/register', {
      password: password,
      password_confirmation: confirmPassword,
      token: params.token,
    }).then(response => {
      loadingRef.current.stopLoading()
      setIsSubmitting(false);
      dispatch(push("/pre/passwordInitSet/complete"))
      window.scrollTo(0, 0);
    }).catch(error => {
      loadingRef.current.stopLoading()
      setIsSubmitting(false);
      const response = error.response;
      if (response.status === 400) {
        const messages = response.data.message
        setErrors(Object.keys(messages).reduce((obj, key) => Object.assign(obj, { [key]: messages[key][0] }), {}));
      } else {
        console.log("500 error");
        window.location.href = '/500'
      }
    });
  }

  const validate = e => {
    setErrors({})
    e.preventDefault();
    const form = document.getElementById('passwordChangeForm');
    const comfirmPassMessage = {
      patternMismatch: {
        comfirm_password(value) { return '確認用パスワードがパスワードと一致しません' }
      }
    }
    const validator = new FormValidator({ form: form, originalMessage: comfirmPassMessage });
    if (validator.valid()) {
      changePassword()
      setErrors({});
    } else {
      const errors = validator.getErrors();
      console.log(errors.reduce((obj, error) => Object.assign(obj, { [error.target.name]: error.message }), {}))
      setErrors(errors.reduce((obj, error) => Object.assign(obj, { [error.target.name]: error.message }), {}));
    }
  }

  return (
  <>
    <main className={styles.main}>
      <h1 className={styles.childTitle}>パスワード初期設定</h1>
      <div className={styles.childContainer}>
      </div>
      {Object.keys(errors).length > 0 && <div className={[styles.formError, styles.childContainer].join(" ")}>
        <p>ご入力および操作に間違いがございます。下記をご確認ください。</p>
      </div>}
      <div className={styles.childContainer}>
        <form className={styles.form} id="passwordChangeForm" noValidate>
          <div className={styles.form__inner}>
            <dl className={styles.form__element}>
              <div className={[styles.form__parts, styles.form__partsMust].join(" ")}>
                <dt className={[styles.form__title, styles.isError].join(" ")}>
                  <label htmlFor="company">
                    <span>会社名</span>
                  </label>
                </dt>
                <dd className={styles.form__input}>
                  <span className={styles.form__preInput}>{entryCompanyUser?.company?.company_name}</span>
                </dd>
              </div>
              <div className={[styles.form__parts, styles.form__partsMust].join(" ")}>
                <dt className={[styles.form__title, styles.isError].join(" ")}>
                  <label htmlFor="contact_user">
                    <span>担当者氏名</span>
                  </label>
                </dt>
                <dd className={styles.form__input}>
                  <span className={styles.form__preInput}>{entryCompanyUser?.family_name} {entryCompanyUser?.first_name}</span>
                </dd>
              </div>
              <div className={[styles.form__parts, styles.form__partsMust].join(" ")}>
                <dt className={[styles.form__title, styles.isError].join(" ")}>
                  <label htmlFor="email">
                    <span>メールアドレス</span>
                  </label>
                </dt>
                <dd className={styles.form__input}>
                  <span className={styles.form__preInput}>{entryCompanyUser?.email}</span>
                </dd>
              </div>
              <div className={[styles.form__parts, styles.form__partsMust].join(" ")}>
                <dt className={[styles.form__title, styles.isError].join(" ")}>
                  <label htmlFor="password">
                    <span>パスワード</span>
                  </label>
                </dt>
                {showPassword ?
                  <dd className={styles.form__input}>
                    <input
                      type="text"
                      className={[styles.validateTarget, "validateTarget"].join(" ")}
                      id="password"
                      name="password"
                      required
                      maxLength="50"
                      autoComplete="current-password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <img
                      className={styles.passwordEyeSlash}
                      src="/images/eye-slash-icon.svg"
                      onClick={() => setShowPassword(false)}
                    />
                    <small className={styles.entryNotice}>8文字以上、[A-Z][a-z][0-9]から1文字ずつ</small>
                    {errors?.password && <span className={styles.isError}>{errors.password}</span>}
                  </dd>
                  :
                  <dd className={styles.form__input}>
                    <input
                      type="password"
                      className={[styles.validateTarget, "validateTarget"].join(" ")}
                      id="password"
                      name="password"
                      required
                      maxLength="128"
                      minLength="8"
                      autoComplete="current-password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <img
                      className={styles.passwordEye}
                      src="/images/eye-icon.svg"
                      onClick={() => setShowPassword(true)}
                    />
                    <small className={styles.entryNotice}>8文字以上、[A-Z][a-z][0-9]から1文字ずつ</small>
                    {errors?.password && <span className={styles.isError}>{errors.password}</span>}
                  </dd>
                }
              </div>
              <div className={[styles.form__parts, styles.form__partsMust].join(" ")}>
                <dt className={[styles.form__title, styles.isError].join(" ")}>
                  <label htmlFor="password">
                    <span>パスワード<br /><small>（確認用）</small></span>
                  </label>
                </dt>

                {showConfirmPassword ?
                  <dd className={styles.form__input}>
                    <input
                      type="text"
                      className={[styles.validateTarget, "validateTarget"].join(" ")}
                      id="password_confirmation"
                      name="password_confirmation"
                      required
                      maxLength="128"
                      minLength="8"
                      pattern={password}
                      autoComplete="current-password"
                      value={confirmPassword}
                      data-elm-name='パスワード（確認用）'
                      data-type='comfirm_password'
                    onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <img
                      className={styles.passwordEyeSlash}
                      src="/images/eye-slash-icon.svg"
                      onClick={() => setShowConfirmPassword(false)}
                    />
                      <small className={styles.entryNotice}>確認のためもう一度入力してください</small>
                    {errors?.password_confirmation && <span className={styles.isError}>{errors.password_confirmation}</span>}
                  </dd>
                  :
                  <dd className={styles.form__input}>
                    <input
                      type="password"
                      className={[styles.validateTarget, "validateTarget"].join(" ")}
                      id="password_confirmation"
                      name="password_confirmation"
                      required
                      maxLength="128"
                      minLength="8"
                      pattern={password}
                      autoComplete="current-password"
                      value={confirmPassword}
                      data-elm-name='パスワード（確認用）'
                      data-type='comfirm_password'
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <img
                      className={styles.passwordEye}
                      src="/images/eye-icon.svg"
                      onClick={() => setShowConfirmPassword(true)}
                    />
                    <small className={styles.entryNotice}>確認のためもう一度入力してください</small>
                    {errors?.password_confirmation && <span className={styles.isError}>{errors.password_confirmation}</span>}
                  </dd>
                }

              </div>
            </dl>
              <div className={[styles.form__parts, styles.form__partsMust, styles.agreement].join(" ")}>
                <div>利用規約</div>
                <pre>{`この利用規約（以下、「本規約」といいます）は、株式会社Faber Company（以下、「当社」といいます）がこのウェブサイト上で提供するサービス（以下、「本サービス」といいます）の利用条件を定めるものです。登録ユーザーの皆さま（以下、「ユーザー」といいます）には、本規約に従って、本サービスをご利用いただきます。

第1条（適用）
1. 本規約は、本サービスの提供条件及び本サービス利用に関する当社とユーザーとの間の権利義務関係を定めることを目的とし、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。
2. 本規約の内容と、本規約外における本サービスに関する当社の説明等が異なる場合には、本規約の規定が優先して適用されるものとします。

第2条（利用登録）
1. 本サービスの利用を希望する者(以下、「利用希望者」といいます)が、本規約を遵守することに同意した上で当社の定める方法によって利用登録を申請し、当社がこれを承認することによって、利用登録が完了するものとします。
2. 当社は、利用希望者に以下の事由があると判断した場合、利用登録の申請を承認しないことがあり、その理由については一切の開示義務を負わないものとします。
  (1)利用登録の申請に際して登録内容の全部又は一部につき虚偽、誤記又は記載漏れがあった場合
  (2)本規約に違反したことがある者からの申請である場合
  (3)申請者が未成年者、成年被後見人、被保佐人又は被補助人のいずれかであり、法定代理人、後見人、保佐人又は補助人の同意等を得ていなかった場合
  (4)反社会的勢力等(暴力団、暴力団員、右翼団体、反社会的勢力、その他これに準ずる者を意味します)である、又は資金提供その他を通じて反社会的勢力等の維持、運営若しくは経営に協力若しくは関与する等反社会的勢力等との何らかの交流若しくは関与を行っていると当社が判断した場合
  (5)利用希望者が過去に当社との契約に違反した者またはその関係者であると当社が判断した場合
  (6)本規約7条に定める措置を受けたことがある場合
  (7)本サービスと競合する事業を行う者その他の第三者に、本サービスのアカウントやパスワードを使用させていた場合
  (8)その他、当社が利用登録を相当でないと判断した場合
3. ユーザーは、登録事項に変更があった場合、当社の定める方法により当該事項を遅滞なく当社に通知するものとします。

第3条(ユーザーIDおよびパスワードの管理)
1. ユーザーは、自己の責任において、本サービスのユーザーIDおよびパスワードを管理するものとします。
2. ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを第三者に利用させ、または譲渡、貸与、名義変更、売買等をすることはできません。
3. 当社は、ユーザーIDとパスワードの組み合わせが登録情報と一致してログインされた場合には、そのユーザーIDを登録しているユーザー自身による利用とみなします。
4. ユーザーID又はパスワードの管理不十分、使用上の過誤、第三者の使用等によって生じた損害に関する責任は登録ユーザーが負うものとし、当社は一切の責任を負いません。

第4条（利用料金および支払方法）
1. ユーザーは、本サービスを利用するにあたっての利用料金は、当社が有料サービスを別途定めた場合や当社とユーザーで別途合意した場合を除き、発生しません。
2. ユーザーは、前項に定める本サービスの有料部分の対価として、当社が別途定め、本ウェブサイトに表示する利用料金又は当社とユーザーで別途合意した利用料金を、当社が指定する方法により支払うものとします。
3. ユーザーが利用料金の支払を遅滞した場合には、ユーザーは年14．6％の割合による遅延損害金を支払うものとします。

第5条(本サービスの提供)
1. 当社は、ユーザーに対し、本サービスを善良なる管理者の注意をもって誠実に提供するものとします。
2. ユーザーは、本サービスの利用において、ユーザー同士の連絡を当社の定める以下の各号に従い当社のシステムを介して行うものとします。
  (1)ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
    法令または公序良俗に違反する行為
  (2)犯罪行為に関連する行為
  (3)当社、本サービスの利用者又はその他の第三者の特許権・著作権・商標権・実用新案権・意匠権などの知的財産権、肖像権、プライバシー権、名誉権その他の権利を侵害する行為(知的財産権を侵害する行為にはリバースエンジニアリングが含まれます。)
  (4)当社、ほかのユーザー、またはその他第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
  (5)本サービスによって得られた情報を商業的に利用する行為
  (6)当社のサービスの運営を妨害するおそれのある行為
  (7)不正アクセスをし、またはこれを試みる行為
  (8)他のユーザーに関する個人情報等を収集または蓄積する行為
  (9)不正な目的を持って本サービスを利用する行為
  (10)当社、本サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為
  (11)他のユーザーに成りすます行為
  (12)当社が許諾しない本サービス上での宣伝、広告、勧誘、または営業行為
  (13)当社の承諾なくユーザーが本サービスを当該ユーザー以外の第三者に直接または間接を問わず利用させる行為
  (14)面識のない異性との出会いを目的とした行為
  (15)宗教の勧誘を目的とした行為
  (16)当社のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為
  (17)当社の承諾なく、ユーザー同士の直接連絡、直接雇用や業務委託等を行い、またはこれらを試みる行為
  (18)当社の承諾なく、当社のサービスと競合する第三者によるユーザー情報の転載や複製等、ユーザーの引抜き、またはこれらを試みる行為
  (19)ユーザーが以下の情報提供等を行う行為
    [1]ユーザーが所属する企業等の内部規則に違反するおそれがある情報提供
    [2]ユーザーが現在特定の企業の従業員又は取締役である場合、当該企業の直接競合他社であるユーザーへの情報提供
    [3]ユーザーが監査人又は元監査人である場合、ユーザー自身もしくはユーザーの雇用主が現在監査を行っている会社、又は過去5年間に監査を行った組織に関する情報提供
    [4]ユーザーが、弁護士、司法書士、行政書士または弁理士等である場合に、法令その他で第三者から事件や案件の紹介を禁止される場合に該当する業務
  (20)その他、当社が不適切と判断する行為
3. 本サービスの利用は、ユーザーの自己責任で為されるものであり、当社は、本サービスの利用によって発生した如何なる損害(パソコンやネットワークに生じた損害を含み、直接損害・間接損害の別を問わないものとします)について一切の責任を負わないものとします。
4. 当社は、ユーザーから提供を受けた情報、データ、資料等については、善良なる管理者の注意をもって取り扱い、本サービス提供に必要な範囲で使用し正当な理由なくして第三者に開示、漏洩しないものとします。

第6条（本サービスの提供の停止等）
1. 当社は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
  (1)本サービスにかかるコンピュータシステムの保守点検または更新を行う場合
  (2)地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合
  (3)コンピュータまたは通信回線等が事故により停止した場合
  (4)その他、当社が本サービスの提供が困難と判断した場合
2. 当社は、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。

第7条（利用制限および登録抹消）
1. 当社は、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、ユーザーに対して、本サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができるものとします。
  (1)本規約のいずれかの条項に違反した場合
  (2)登録事項に虚偽の事実があることが判明した場合
  (3)料金等の支払債務の不履行があった場合
  (4)当社からの連絡に対し、一定期間返答がない場合
  (5)本サービスについて、最終の利用から一定期間利用がない場合
  (6)その他、当社が本サービスの利用を適当でないと判断した場合
2. 当社は、本条に基づき当社が行った行為によりユーザーに生じた損害について、一切の責任を負いません。

第8条（退会）
ユーザーは、当社の定める退会手続により、本サービスから退会できるものとします。なお、当社は、ユーザーが本サービスから退会した後も、ユーザーの再度の本サービス利用の際に利用履歴情報を表示するため、ユーザーの登録情報等を保持するものとします。

第9条（保証の否認および免責事項）
1. 当社は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます）がないことを明示的にも黙示的にも保証しておりません。
2. 本サービスにおいて提供される情報（利用者から提供された情報、その他第三者により提供される情報を含みます）は当該情報を提供する者の責任で提供されるものであり、ユーザーは、提供情報の真実性、合法性、安全性、適切性、有用性について当社が何ら保証しないことを了承のうえ、自己の責任において利用するものとします。ユーザーは、当社が次の各号いずれについても保証するものではないことを了承のうえ、自己の責任において利用するものとします。
  (1) 本サービスの提供に不具合やエラーや障害が生じないこと (2) 本サービスから得られる情報等が正確なものであること (3) 本サービスの機能がユーザーの期待を満たすものであること (4) ユーザーの資質・能力および適合性がユーザーの期待を満たすものであること (5) 本サービスの利用において不適切な内容が含まれないこと3. 当社は、本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。ただし、本サービスに関する当社とユーザーとの間の契約（本規約を含みます）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。
3. 当社は、本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。ただし、本サービスに関する当社とユーザーとの間の契約（本規約を含みます）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。前項ただし書に定める場合であっても、当社は、当社の過失（重過失を除きます）による債務不履行または不法行為によりユーザーに生じた損害のうち特別な事情から生じた損害（当社またはユーザーが損害発生につき予見し、または予見し得た場合を含みます）について一切の責任を負いません。また、当社の過失（重過失を除きます）による債務不履行または不法行為によりユーザーに生じた損害の賠償は、ユーザーから当該損害が発生した月に受領した利用料の額を上限とします。
4. 当社は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について免責され、一切関与しないものとします。

第10条（サービス内容の変更等）
当社は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。

第11条（利用規約の変更）
当社は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。

第12条（個人情報の取扱い）
当社は、本サービスの利用によって取得する個人情報については、当社「プライバシーポリシー」に従い適切に取り扱うものとします。なお、当社は、特定の個人を識別できない形式による統計データ等を作成し、当該統計データ等につき何らの制限なく利用することができるものとします。また、ユーザーは、何らかの事由により情報が当社のサーバーから一旦削除された場合、その情報を復旧することはできないことを了承します。

第13条（通知または連絡）
ユーザーと当社との間の通知または連絡は、当社の定める方法によって行うものとします。当社は,ユーザーから,当社が別途定める方式に従った変更届け出がない限り,現在登録されている連絡先が有効なものとみなして当該連絡先へ通知または連絡を行い,これらは,発信時にユーザーへ到達したものとみなします。

第14条(権利義務の譲渡等)
ユーザーは、当社の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡、移転し、または担保設定その他の処分をすることはできません。

当社は本サービスにかかる事業を他社に譲渡した場合(通常の事業譲渡のみならず会社法上の会社分割その他事業が移転するあらゆる場合を含みます。)には、当該事業譲渡に伴い利用契約上の地位、本規約に基づく権利及び義務並びにユーザーの登録事項その他の顧客情報を当該事業譲渡の譲受人に譲渡することができるものとし、ユーザーは、かかる譲渡につき本項において予め同意したものとします。

第15条（準拠法・裁判管轄）
1. 本規約の解釈にあたっては、日本法を準拠法とします。
2. 本サービス利用契約又は本規約に起因し、又は関連する一切の紛争については、東京地方裁判所を専属的合意管轄裁判所とします。

第16条(権利帰属)
当社ウェブサイト及び本サービスに関する知的財産権は、全て当社又は当社にライセンスを許諾している者に帰属しており、本規約に基づく本サービスの利用許諾は、当社ウェブサイト又は本サービスに関する当社又は当社にライセンスを許諾している者の知的財産権の使用許諾を意味するものではありません。

第17条(秘密保持)
ユーザー及び当社は、本サービスを利用又は提供する上で知り得た、相手方の営業上の秘密、本サービスの技術、ノウハウ、その他本サービスに関連する一切の情報を、本サービス提供中はもちろん本サービス提供終了後においても、相手方の書面による事前の承諾なくして、第三者に開示・漏洩しないものとします。

第18条(分離可能性)
本規約のいずれかの条項又はその一部が、消費者契約法その他の法令等により無効となった場合であっても、本規約のその余の規定は継続して効力を有するものとします。

第19条（反社会的勢力との絶縁の保証）
1. ユーザー及び当社は、相手方に対し、自己が次の各号のいずれにも該当しないことを表明し、かつ将来にわたっても該当しないことを確約するものとします。
  (1)反社会的勢力が経営を支配していると認められる関係を有すること
  (2)反社会的勢力が経営に実質的に関与していると認められる関係を有すること
  (3)自己もしくは第三者の不正の利益を図る目的又は第三者に損害を加える目的をもってするなど、不当に反社会的勢力を利用していると認められる関係を有すること
  (4)反社会的勢力に対して資金等を提供し、又は便宜を供与するなどの関与をしていると認められる関係を有すること
  (5)役員又は経営に実質的に関与している者が反社会的勢力と社会的に非難されるべき関係を有すること
2. 本条の規定への違反の適用については、テレビ局、日刊新聞社その他の報道機関から反社会的勢力である旨の報道がなされた場合には、反社会的勢力と推定するものとします。
3. 前項の場合、その相手方は、反社会的勢力と推定された当事者に対し、相当な期間を定めて反社会的勢力に該当しないことを証する資料の提出を請求することができるものとします。
4. 前項の期間内に反社会的勢力に該当しないことを証する資料の提出がなされない場合は、その相手方は、当該当事者を反社会的勢力とみなすことができるものとします。
5. ユーザー及び当社は、相手方に対し、前項の確約に反すると合理的に判断した時には、本契約を即時解除することができるものとする。

以上

2021年2月15日 改訂

              `}</pre>
              <div className={styles.agreementCheck}>
                <input type="checkbox" id="term"/>
                <label htmlFor="term">同意する</label>
              </div>
            </div>
            <div className={[styles.form__parts, styles.form__partsMust, styles.agreement].join(" ")}>
              <div className={styles.agreementCheck}>
                プライバシーポリシー
              </div>
              <pre>{`株式会社Faber Company（以下、「当社」といいます。）は、当社で提供するサービス（以下,「本サービス」といいます。）におけるプライバシー情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。

1. プライバシー情報
  (1)プライバシー情報のうち「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報を指します。
  (2)プライバシー情報のうち「履歴情報および特性情報」とは、上記に定める「個人情報」以外のものをいい、ご利用いただいたサービスやご購入いただいた商品、ご覧になったページや広告の履歴、ユーザーが検索された検索キーワード、ご利用日時、ご利用の方法、ご利用環境、郵便番号や性別、職業、年齢、ユーザーのIPアドレス、クッキー情報、位置情報、端末の個体識別情報などを指します。

2.   プライバシー情報の収集方法
  (1)当社は、ユーザーが利用登録をする際に氏名、生年月日、住所、電話番号、メールアドレス、銀行口座番号、クレジットカード番号、運転免許証番号などの個人情報をお尋ねすることがあります。また、ユーザーと提携先などとの間でなされたユーザーの個人情報を含む取引記録や、決済に関する情報を当社の提携先（情報提供元、広告主、広告配信先などを含みます。以下、｢提携先｣といいます。）などから収集することがあります。
  (2)当社は、ユーザーについて、利用したサービスやソフトウエア、購入した商品、閲覧したページや広告の履歴、検索した検索キーワード、利用日時、利用方法、利用環境（携帯端末を通じてご利用の場合の当該端末の通信状態、利用に際しての各種設定情報なども含みます）、IPアドレス、クッキー情報、位置情報、端末の個体識別情報などの履歴情報および特性情報を、ユーザーが当社や提携先のサービスを利用しまたはページを閲覧する際に収集します。

3.   個人情報を収集・利用する目的。当社が個人情報を収集・利用する目的は、以下のとおりです。
  (1)本サービスに関する登録の受付、利用料金の計算等本サービスの提供、維持、保護及び改善の目的。
  (2)ユーザーに自分の登録情報の閲覧や修正、利用状況の閲覧を行っていただくために、氏名、住所、連絡先、支払方法などの登録情報、利用されたサービスや購入された商品、およびそれらの代金などに関する情報を表示する目的。
  (3)ユーザーにお知らせや連絡をするためにメールアドレスを利用する場合やユーザーに商品を送付したり必要に応じて連絡したりするため、氏名や住所などの連絡先情報を利用する目的。
  (4)ユーザーの本人確認を行うために、氏名、生年月日、住所、電話番号、銀行口座番号、クレジットカード番号、運転免許証番号、配達証明付き郵便の到達結果などの情報を利用する目的。
  (5)ユーザーに代金を請求するために、購入された商品名や数量、利用されたサービスの種類や期間、回数、請求金額、氏名、住所、銀行口座番号やクレジットカード番号などの支払に関する情報などを利用する目的。
  (6)ユーザーが簡便にデータを入力できるようにするために、当社に登録されている情報を入力画面に表示させたり、ユーザーのご指示に基づいて他のサービスなど（提携先が提供するものも含みます）に転送したりする目的。
  (7)代金の支払を遅滞したり第三者に損害を発生させたりするなど、本サービスの利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの利用をお断りするために、利用態様、氏名や住所など個人を特定するための情報を利用する目的。
  (8)ユーザーからのお問い合わせに対応するために、お問い合わせ内容や代金の請求に関する情報など当社がユーザーに対してサービスを提供するにあたって必要となる情報や、ユーザーのサービス利用状況、連絡先情報などを利用する目的。
  (9)上記の利用目的に付随する目的。

4. 個人情報の第三者提供
  (1)当社は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。
    ・個人情報保護法その他の法令に基づき開示が認められる場合。
    ・人の生命、身体または財産の保護のために必要がある場合であって、ユーザー本人の同意を得ることが困難であるとき。
    ・公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、ユーザー本人の同意を得ることが困難であるとき。
    ・国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、ユーザー本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき。
    ・予め次の事項を告知あるいは公表をしている場合。
      ◆ 利用目的に第三者への提供を含むこと。
      ◆ 第三者に提供されるデータの項目。
      ◆ 第三者への提供の手段または方法。
      ◆ 本人の求めに応じて個人情報の第三者への提供を停止すること。
  (2)前項の定めにかかわらず、次に掲げる場合は第三者には該当しないものとします。
    ・当社が利用目的の達成に必要な範囲内において個人情報の取扱いの全部または一部を委託する場合。
    ・合併その他の事由による事業の承継に伴って個人情報が提供される場合。
    ・個人情報を特定の者との間で共同して利用する場合であって、その旨並びに共同して利用される個人情報の項目、共同して利用する者の範囲、利用する者の利用目的および当該個人情報の管理について責任を有する者の氏名または名称について、あらかじめ本人に通知し、または本人が容易に知り得る状態に置いているとき。

5. 個人情報の開示
  (1)当社は、ユーザーから個人情報保護法の定めに基づき個人情報の開示を求められたときは、ユーザーご本人からのご請求であることを確認の上で、ユーザーご本人に対し、遅滞なくこれを開示します（当該個人情報が存在しないときにはその旨通知致します。）。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。
    ・個人情報保護法その他の法令により当社が開示義務を負わない場合。
    ・本人または第三者の生命、身体、財産その他の権利利益を害するおそれがある場合。
    ・当社の業務の適正な実施に著しい支障を及ぼすおそれがある場合。
    ・その他法令に違反することとなる場合。
  (2)前項の定めにかかわらず、履歴情報および特性情報などの個人情報以外の情報については、開示いたしません。

6. 個人情報の訂正および削除
  (1)ユーザーは、当社の保有する自己の個人情報が誤った情報である場合には、当社が定める手続きにより、当社に対して個人情報の訂正または削除を請求することができます。
  (2)当社は、ユーザーから前項の請求を受けた場合、ユーザーご本人からの請求であることを確認の上で遅滞なく必要な調査を行い、その請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の訂正または削除を行い、これをユーザーに通知します。

7. 個人情報の利用停止等
  (1)当社は、本人から、個人情報が、利用目的の範囲を超えて取り扱われているという理由、または不正の手段により取得されたものであるという理由により、その利用の停止または消去（以下、「利用停止等」といいます。）を求められた場合には、ユーザーご本人からの請求であることを確認の上で遅滞なく必要な調査を行い、その結果に基づき、個人情報の利用停止等を行い、その旨をユーザー本人に通知します。ただし、個人情報の利用停止等に多額の費用を有する場合その他利用停止等を行うことが困難な場合であって、本人の権利利益を保護するために必要なこれに代わるべき措置をとれる場合は、この代替策を講じます。

8. プライバシーポリシーの変更
  (1)当社は、本ポリシーの取扱いに関する運用状況を適宜見直し、継続的な改善に努めるものとし、本ポリシーの内容を、ユーザーに通知することなく、必要に応じて変更することができるものとします。
  (2)当社が別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載する方法でユーザーに通知し、本ウェブサイトに掲載したときから変更の効力が生じるものとします。

9. お問い合わせ窓口
  (1)本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。

10. 個人を特定しない属性情報・行動履歴の取得及び利用について
  当ウェブサイトでは、広告配信事業者等の第三者が提供するプログラムを利用し、特定のサイトにおいて行動ターゲティング広告（サイト閲覧情報などをもとにユーザーの興味・関心にあわせて広告を配信する広告手法）や、サイト管理、アクセス状況の計測を行っています。

  その際、ユーザーのサイト訪問履歴情報を採取するためCookieを利用しています。（ただし、個人を特定・識別できるような情報は一切含まれておりません）。
  広告配信事業者等の第三者は当該Cookieを使用して当ウェブサイトへの過去のアクセス情報に基づいて広告配信や、サイト管理、アクセス状況の計測を行っています。
  この広告や計測の無効化を希望されるユーザーは広告配信事業者等の第三者のオプトアウトページにアクセスして、Cookie の使用を無効にできます。
  ブラウザの変更、Cookieの削除及び新しいPCへ変更等の場合には再度設定が必要となります。
  オプトアウトを行っていない場合、Google他、第三者配信事業者、または広告ネットワークのCookieも使用される可能性があります。

  Network Advertising Initiativeのオプトアウトウェブサイトでは、一部のCookie（すべてではありません）をまとめて無効にできます。
オプトアウトページのURLは下記になります。

    ・利用中のプライバシーポリシー
      Google:http://www.google.co.jp/intl/ja/policies/privacy/
      yahoo:http://marketing.yahoo.co.jp/service/ad_privacy.html
      facebohok:https://www.facebook.com/about/privacy/
      satori:https://satori.marketing/privacypolicy/
    ・オプトアウト先
      Google:http://www.google.co.jp/policies/technologies/ads/
      yahoo:http://btoptout.yahoo.co.jp/optout/preferences.html
      facebook (※Network Advertising Initiativeのオプトアウトページ)http://www.networkadvertising.org/choices/#completed
      satori:https://satori.marketing/optout/

              `}</pre>
              <div>
                <input type="checkbox" id="privacyPolicy" />
                <label htmlFor="privacyPolicy">同意する</label>
              </div>
            </div>
            <p className={styles.buttonArea} style={{marginTop: "40px"}}>
              <Button type="button"
                width={400}
                height={57}
                fontSize={18}
                onClick={validate}
                disabled={isSubmitting}
              >
                <span className={styles.arrow}>パスワードを決定する</span>
              </Button>
            </p>
          </div>
        </form>
      </div>
    </main>
    <Loading ref={loadingRef} />
  </>
  );
}
