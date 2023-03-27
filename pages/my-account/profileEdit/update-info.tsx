import Head from "next/head";

import Navbar from "../../../component/nav/navbar";

import styles from '../../../styles/updateInfo.module.css';

export default function updateEmail () {
    return (
        <div className={styles.mainContainer}>
            <Head>
                <title>お客様情報の確認・変更</title>
            </Head>
            <Navbar/>

            <div className={styles.mainContent}>
                <div className={styles.titleWrapper}>
                    <h1 className={styles.pageTitle}>お客様情報の確認・変更</h1>
                    <p className={styles.loginDate}>
                        <span className={styles.loginText}>最終ログイン：</span>
                    </p>
                    <div className={styles.notionBox}>
                        <div className={styles.emailReceiveWrapper}>
                            <p className={styles.emailReceiveText}>メールマガジン</p>
                            <p className={styles.emailReceive}>
                                <input type='checkbox'/>
                                配信を希望する
                            </p>
                        </div>
                        <p className={styles.notionText}>
                            お得なキャンペーンや新製品情報などをお届けします。
                        </p>
                    </div>
                </div>
                <form className={styles.formContainer}>
                    <div className={styles.singleData}>
                        <label className={styles.dataTitle}>会員種別</label>
                        <p className={styles.dataNoChange}></p>
                    </div>
                    <div className={styles.singleData}>
                        <label className={styles.dataTitle}>
                            氏名
                            <span className={styles.necessaryTag}>必須</span>
                        </label>
                        <div className={styles.InputWrapper}>
                            <input className={styles.nameInput} type='text'/>
                        </div>
                    </div>
                    <div className={styles.singleData}>
                        <label className={styles.dataTitle}>
                            氏名（カナ）
                            <span className={styles.necessaryTag}>必須</span>
                        </label>
                        <div className={styles.InputWrapper}>
                            <p className={styles.inputNotion}>カタカナで入力してください。</p>
                            <input className={styles.nameKatakanaInput} type='text'/>
                        </div>
                    </div>
                    <div className={styles.singleData}>
                        <label className={styles.dataTitle}>
                            メールアドレス
                            <span className={styles.necessaryTag}>必須</span>
                        </label>
                        <p className={styles.dataNoChange}></p>
                    </div>
                    <div className={styles.singleData}>
                        <label className={styles.dataTitle}>
                            電話番号1
                            <span className={styles.necessaryTag}>必須</span>
                        </label>
                        <div className={styles.InputWrapper}>
                            <p className={styles.inputNotion}>数字で入力してください。</p>
                            <input className={styles.cellphoneInput} type='text'/>
                        </div>
                    </div>
                    <div className={styles.singleData}>
                        <label className={styles.dataTitle}>
                            電話番号2
                        </label>
                        <div className={styles.InputWrapper}>
                            <p className={styles.inputNotion}>数字で入力してください。</p>
                            <input className={styles.cellphoneInput} type='text'/>
                        </div>
                    </div>
                    <div className={styles.singleData}>
                        <label className={styles.dataTitle}>
                            性別
                            <span className={styles.necessaryTag}>必須</span>
                        </label>
                        <div className={styles.InputWrapper}>
                            <input type='radio'/>
                            <label>男</label>
                            <input type='radio'/>
                            <label>女</label>
                        </div>
                    </div>
                    <div className={styles.singleData}>
                        <label className={styles.dataTitle}>
                            生年月日
                        </label>
                        <p className={styles.dataNoChange}></p>
                    </div>
                    <div className={styles.singleData}>
                        <label className={styles.dataTitle}>
                            郵便番号
                            <span className={styles.necessaryTag}>必須</span>
                        </label>
                        <div className={styles.InputWrapper}>
                            <p className={styles.inputNotion}>
                                ハイフン不要・数字で入力してください。
                            </p>
                            <p className={styles.inputNotion}>
                                事業所の個別郵便番号はご使用いただけません。
                            </p>
                            <div className={styles.postcode}>
                                <input className={styles.postcodeInput} type='text'/>
                                <p className={styles.postcodeSearch}>
                                    <span className={styles.searchText}>
                                        郵便番号を調べる
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.singleData}>
                        <label className={styles.dataTitle}>
                            都道府県
                            <span className={styles.necessaryTag}>必須</span>
                        </label>
                        <div className={styles.InputWrapper}>
                            <p className={styles.inputNotion}>郵便番号より自動検索されます。</p>
                            <input className={styles.stateInput} type='text'/>
                        </div>
                    </div>
                    <div className={styles.singleData}>
                        <label className={styles.dataTitle}>
                            市区町村
                            <span className={styles.necessaryTag}>必須</span>
                        </label>
                        <div className={styles.InputWrapper}>
                            <p className={styles.inputNotion}>郵便番号より自動検索されます。</p>
                            <input className={styles.cityInput} type='text'/>
                        </div>
                    </div>
                    <div className={styles.singleData}>
                        <label className={styles.dataTitle}>
                            町名
                            <span className={styles.necessaryTag}>必須</span>
                        </label>
                        <div className={styles.InputWrapper}>
                            <p className={styles.inputNotion}>町名を入力してください。</p>
                            <input className={styles.townInput} type='text'/>
                        </div>
                    </div>
                    <div className={styles.singleData}>
                        <label className={styles.dataTitle}>
                            丁目番地
                            <span className={styles.necessaryTag}>必須</span>
                        </label>
                        <div className={styles.InputWrapper}>
                            <p className={styles.inputNotion}>
                                左端のみ必須です。番地がない場合は左端に1を入力してください。
                            </p>
                            <input className={styles.addressCodeInput} type='text'/>
                        </div>
                    </div>
                    <div className={styles.singleData}>
                        <label className={styles.dataTitle}>
                            建物名称（マンション・団地名など）
                        </label>
                        <div className={styles.InputWrapper}>
                            <input className={styles.buildingNameInput} type='text'/>
                        </div>
                    </div>
                    <div className={styles.singleData}>
                        <label className={styles.dataTitle}>
                            部屋番号
                        </label>
                        <div className={styles.InputWrapper}>
                            <p className={styles.inputNotion}>英数字で入力してください。</p>
                            <p className={styles.inputNotion}>
                                入力できない場合は、建物名称欄に入力してください。
                            </p>
                            <input className={styles.roomNumberInput} type='text'/>
                        </div>
                    </div>
                    <div className={styles.singleData}>
                        <label className={styles.dataTitle}>
                            建物種別
                            <span className={styles.necessaryTag}>必須</span>
                        </label>
                        <div className={styles.InputWrapper}>
                            <input type='radio'/>
                            <label>戸建て</label>
                            <input type='radio'/>
                            <label>集合住宅</label>
                        </div>
                    </div>
                    <div className={styles.singleData}>
                        <label className={styles.dataTitle}>
                            エレベータ
                            <span className={styles.necessaryTag}>必須</span>
                        </label>
                        <div className={styles.InputWrapper}>
                            <input type='radio'/>
                            <label>なし</label>
                            <input type='radio'/>
                            <label>あり</label>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}