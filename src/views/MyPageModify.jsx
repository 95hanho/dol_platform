import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  emailAuth,
  emailAuthConfirm,
  getDepts,
  getDeptsDetail,
  getUserInfo,
  join,
  membModify,
} from "../compositions/user";
import Header from "../components/Header";
import Nav from "../components/Nav";

export default function MyPageModify() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loding = useSelector((state) => state.loding.ing);
  const store_loginId = useSelector((state) => state.user.loginId);
  const store_name = useSelector((state) => state.user.name);
  const store_nickName = useSelector((state) => state.user.nickName);
  const store_birth = useSelector((state) => state.user.birth);
  const store_gender = useSelector((state) => state.user.gender);
  const store_emailId = useSelector((state) => state.user.email.split("@")[0]);
  const store_emailAddress = useSelector(
    (state) => state.user.email.split("@")[1]
  );
  const store_phone = useSelector((state) => state.user.phone);

  // 유저obj
  const [user, setUser] = useState({
    membName: "",
    nickName: "",
    year: "",
    month: "",
    day: "",
    gender: "",
    emailId: "",
    emailAddress: "",
    emailAuth: "",
    phone1: "",
    phone2: "",
    phone3: "",
    dept: "",
    deptDetail: "",
  });
  // ref모음
  const refObj = {
    membName: useRef(null),
    nickName: useRef(null),
    year: useRef(null),
    month: useRef(null),
    day: useRef(null),
    gender: useRef(null),
    emailId: useRef(null),
    emailAddress: useRef(null),
    emailAuth: useRef(null),
    phone1: useRef(null),
    phone2: useRef(null),
    phone3: useRef(null),
  };
  // 텍스트 상태 표시줄
  const [membNameAlert, setMembNameAlert] = useState(false);
  const [nickNameAlert, setNickNameAlert] = useState(false);
  const [ymdAlert, setYmdAlert] = useState(false);
  const [genderAlert, setGenderAlert] = useState(false);
  const [emailAlert, setEmailAlert] = useState(false);
  const [authAlert, setAuthAlert] = useState(1);
  const [phoneAlert, setPhoneAlert] = useState("");
  const [deptAlert, setDeptAlert] = useState(false);

  // 이메일주소 종류
  const [emailKinds, setEmailKinds] = useState("");
  // 이메일 인증
  const [authReadOnly, setAuthReadOnly] = useState(true);
  // 인증확인을 기다리는 상태
  const [authIng, setAuthIng] = useState(false);
  // 인증번호 타이머
  const [authTimer, setAuthTimer] = useState("0:00");
  const [timerOn, setTimerOn] = useState("");
  const [timerIndex, setTimerIndex] = useState(null);
  // 이메일 직접입력인지
  const [emailAddressReadOnly, setEmailAddressReadOnly] = useState(true);

  // 연월일 리스트
  const curDate = new Date();
  const curYear = curDate.getFullYear();
  const years = [];
  for (let i = 99; i >= 0; i--) years.push(curYear - i);
  const months = [];
  for (let i = 1; i <= 12; i++) months.push(i < 10 ? "0" + i : i);
  const days = [];
  for (let i = 1; i <= 31; i++) days.push(i < 10 ? "0" + i : i);

  // 주소선택목록
  const domainList = [{ url: "naver.com", name: "네이버" }];

  // 팀이름 리스트
  const [deptList, setDeptList] = useState([]);
  // 팀이름 상세 리스트
  const [deptDetailList, setDeptDetailList] = useState([]);

  // 유저 state변경
  const changeUser = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  // 인증번호 알람text
  const authAlertText = () => {
    if (authAlert === 1) return "인증완료 되었습니다.";
    else if (authAlert === 2) return "이메일 인증을 완료해주세요.";
    else if (authAlert === 3) return "인증번호가 틀렸습니다.";
    else if (authAlert === 4) return "제한시간초과";
    else if (authAlert === 5) return "인증번호 6자리를 입력해주세요.";
  };
  // 유저 작성 리셋
  const resetUser = (e, name) => {
    e.preventDefault();
    setUser({
      ...user,
      [name]: "",
    });
    refObj[name].current.focus();
  };
  // 성별 값 변화
  const genderChange = (gender) => {
    if (user.gender === gender) {
      setUser({
        ...user,
        gender: "",
      });
    } else {
      setUser({
        ...user,
        gender,
      });
    }
  };
  // 인증번호요청
  const authSendBefore = async (e) => {
    console.log("authSendBefore");
    e.preventDefault();

    setAuthAlert(0);
    setUser({
      ...user,
      emailAuth: "",
    });

    const emailUrlRegExp = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!user.emailId || !emailUrlRegExp.test(user.emailAddress)) {
      setEmailAlert(true);
    } else {
      if (loding) return;
      dispatch({ type: "loding/lodingOn" });
      setTimerOn("on");
      emailAuth({
        email: user.emailId + "@" + user.emailAddress,
        type: "JOIN",
      }).then(({ data }) => {
        console.log(data);
      });
    }
  };
  // 인증번호 확인
  const authCheckBefore = (e) => {
    e.preventDefault();

    const authRegExp = /^\d{6}$/;

    if (!authRegExp.test(user.emailAuth)) setAuthAlert(5);
    else if (authIng && authReadOnly) setAuthAlert(4);
    else if (authIng && !authReadOnly) {
      if (loding) return;
      dispatch({ type: "loding/lodingOn" });
      emailAuthConfirm({
        certifyNum: user.emailAuth,
        email: user.emailId + "@" + user.emailAddress,
      }).then(({ data }) => {
        console.log(data);
        if (data.res_code === 200) {
          setAuthAlert(1);
          setTimerOn("off");
        } else {
          setAuthAlert(3); // 번호틀
          // setAuthAlert(4); // 시간만료
        }
      });
    }
  };
  // 회원수정 전 체크
  const membModifyBefore = async (e) => {
    console.log("membModifyBefore");
    e.preventDefault();
    console.log(user);

    const emailUrlRegExp = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phone1RegExp = /^(010|011|016|017|018|019)$/;
    const phone2RegExp = /^\d{3,4}$/;
    const phone3RegExp = /^\d{4}$/;

    // 오류 사항 표시하기
    // 알람띄우기
    if (!pwdRegExp.test(user.password)) setPasswordAlert(true);
    if (user.password !== user.pwdCheck) setPwdCheckAlert(2);
    if (user.membName.length <= 1) setMembNameAlert(true);
    if (!user.year || !user.month || !user.day) setYmdAlert(true);
    if (!user.gender) setGenderAlert(true);
    if (!user.emailId || !emailUrlRegExp.test(user.emailAddress))
      setEmailAlert(true);
    if (authAlert !== 1) setAuthAlert(2);
    if (
      !phone1RegExp.test(user.phone1) ||
      !phone2RegExp.test(user.phone2) ||
      !phone3RegExp.test(user.phone3)
    )
      setPhoneAlert(true);
    if (!user.dept) setDeptAlert(true);
    else if (user.dept && deptDetailList.length && !user.deptDetail)
      setDeptAlert(true);

    if (user.membName.length <= 1) refObj.membName.current.focus();
    else if (!user.year) refObj.year.current.focus();
    else if (!user.month) refObj.month.current.focus();
    else if (!user.day) refObj.day.current.focus();
    else if (!user.gender) refObj.gender.current.focus();
    else if (!user.emailId) refObj.emailId.current.focus();
    else if (!emailUrlRegExp.test(user.emailAddress))
      refObj.emailAddress.current.focus();
    else if (!phone1RegExp.test(user.phone1)) refObj.phone1.current.focus();
    else if (!phone2RegExp.test(user.phone2)) refObj.phone2.current.focus();
    else if (!phone3RegExp.test(user.phone3)) refObj.phone3.current.focus();
    else if (!user.dept) {
    } else if (user.dept && deptDetailList.length && !user.deptDetail) {
    }
    // 확인완료
    else {
      if (loding) return;
      dispatch({ type: "loding/lodingOn" });
      membModify({
        loginId: user.loginId,
        password: user.password,
        name: user.membName,
        nickName: user.nickName,
        birth: user.year + user.month + user.day,
        gender: user.gender,
        email: user.emailId + "@" + user.emailAddress,
        phone: user.phone1 + user.phone2 + user.phone3,
        dept_id: user.dept,
        dept_id2: user.deptDetail,
        role: "ROLE_USER",
      })
        .then(({ data }) => {
          console.log(data);
          navigate("/myPage");
          dispatch({
            type: "modal/on_modal_alert",
            payload: "회원정보가 수정되었습니다.",
          });
        })
        .catch(({ data }) => {
          console.log(data);
          console.log("회원가입 실패");
        });
    }
  };

  useEffect(() => {
    // let timerIndex = null;
    if (timerOn === "on") {
      setAuthTimer("3:00");
      setAuthIng(true);
      setAuthReadOnly(false);
      let minute = 3;
      let second = 0;
      clearInterval(timerIndex);
      setTimerIndex(
        setInterval(() => {
          second--;
          if (second < 0) {
            minute--;
            second = 59;
          }
          if (second === 0 && minute === 0) {
            setTimerOn("timeOut");
          }
          setAuthTimer(`${minute}:${second < 10 ? "0" + second : second}`);
        }, 1000)
      );
    } else if (timerOn === "off") {
      setAuthIng(false);
      setAuthReadOnly(true);
      clearInterval(timerIndex);
      setUser({
        ...user,
        emailAuth: "",
      });
    } else if (timerOn === "timeOut") {
      setAuthReadOnly(true);
      clearInterval(timerIndex);
    }
    setTimerOn("");
  }, [timerOn]);

  useEffect(() => {
    console.log(emailKinds);
    if (emailKinds === "직접입력") {
      console.log(user.emailAddress);
      if (domainList.map((v) => v.url).includes(user.emailAddress)) {
        setUser({
          ...user,
          emailAddress: "",
        });
      }
      setEmailAddressReadOnly(false);
    } else {
      setUser({
        ...user,
        emailAddress: emailKinds,
      });
      if (emailKinds && !domainList.map((v) => v.url).includes(emailKinds)) {
        setEmailKinds("직접입력");
        setEmailAddressReadOnly(false);
      } else setEmailAddressReadOnly(true);
    }
  }, [emailKinds]);
  // 기존데이터 채우기
  useEffect(() => {
    if (store_loginId) {
      console.log(store_loginId);
      console.log(store_emailAddress);
      console.log(store_phone);
      let phone1, phone2, phone3;
      if (store_phone.length === 10) {
        phone1 = store_phone.slice(0, 2);
        phone2 = store_phone.slice(2, 6);
        phone3 = store_phone.slice(6, 10);
      } else if (store_phone.length === 11) {
        phone1 = store_phone.slice(0, 3);
        phone2 = store_phone.slice(3, 7);
        phone3 = store_phone.slice(7, 11);
      }
      setUser({
        ...user,
        membName: store_name,
        year: store_birth.substring(0, 4),
        month: store_birth.substring(4, 6),
        day: store_birth.substring(6, 8),
        gender: store_gender,
        emailId: store_emailId,
        phone1,
        phone2,
        phone3,
      });
      setEmailKinds(store_emailAddress);
    }
  }, [store_loginId]);
  // 컴포넌트 실행 시
  useEffect(() => {
    async function init() {
      await getUserInfo();
      await getDepts().then(({ data }) => {
        setDeptList([...data.data]);
      });
    }
    init();
  }, []);

  return (
    <>
      <Header backUse={true} title={"회원정보수정"} />
      <Nav />
      <main id="login-main" className="myPage-change">
        <div className="login-wrap myPage-wrap">
          <section className="login-section">
            <form onSubmit={membModifyBefore}>
              <p>아이디{store_gender}</p>
              <div className="inputdiv">
                <p className="info-id">{store_loginId}</p>
              </div>
              <p>이름</p>
              <div className="inputdiv">
                <input
                  type="text"
                  name="membName"
                  placeholder="이름을 입력해주세요."
                  value={user.membName}
                  onChange={(e) => {
                    changeUser(e);
                    setMembNameAlert(false);
                  }}
                  ref={refObj.membName}
                />
                <button
                  type="button"
                  tabIndex="-1"
                  className="clear-btn"
                  onClick={(e) => resetUser(e, "membName")}
                >
                  <span className="material-icons"> highlight_off </span>
                </button>
              </div>
              <p className="c_red">
                {membNameAlert ? "* 이름을 2자 이상으로 입력해주세요." : ""}
              </p>
              <p>닉네임</p>
              <div className="inputdiv">
                <input
                  type="text"
                  name="nickName"
                  placeholder="닉네임을 입력해주세요."
                  value={user.nickName}
                  onChange={(e) => {
                    changeUser(e);
                    setNickNameAlert(false);
                  }}
                  ref={refObj.nickName}
                />
                <button
                  type="button"
                  tabIndex="-1"
                  className="clear-btn"
                  onClick={(e) => resetUser(e, "nickName")}
                >
                  <span className="material-icons"> highlight_off </span>
                </button>
              </div>
              <p className="c_red">
                {nickNameAlert ? "* 이름을 2자 이상으로 입력해주세요." : ""}
              </p>
              <p>생년월일</p>
              <div className="inputdiv">
                <select
                  className="birthYear"
                  name="year"
                  value={user.year}
                  onChange={(e) => {
                    changeUser(e);
                    setYmdAlert(false);
                  }}
                  ref={refObj.year}
                >
                  <option value>----</option>
                  {years.map((year) => (
                    <option key={"year" + year} value={year}>
                      {year}년
                    </option>
                  ))}
                </select>
                <select
                  name="month"
                  className="birthMD"
                  value={user.month}
                  onChange={(e) => {
                    changeUser(e);
                    setYmdAlert(false);
                  }}
                  ref={refObj.month}
                >
                  <option value>----</option>
                  {months.map((month) => (
                    <option key={"month" + month} value={month}>
                      {month}월
                    </option>
                  ))}
                </select>
                <select
                  className="birthMD"
                  name="day"
                  value={user.day}
                  onChange={(e) => {
                    changeUser(e);
                    setYmdAlert(false);
                  }}
                  ref={refObj.day}
                >
                  <option value>--</option>
                  {days.map((day) => (
                    <option key={"day" + day} value={day}>
                      {day}일
                    </option>
                  ))}
                </select>
              </div>
              <p className="c_red">
                {ymdAlert ? "* 생년월일을 선택해주세요." : ""}
              </p>
              <p>성별</p>
              <div className="inputdiv gender-div">
                <button
                  type="button"
                  className={
                    "gender-btn" + (user.gender === "M" ? " active" : "")
                  }
                  onClick={(e) => {
                    genderChange("M");
                    setGenderAlert(false);
                  }}
                  ref={refObj.gender}
                >
                  남
                </button>
                <button
                  type="button"
                  className={
                    "gender-btn" + (user.gender === "F" ? " active" : "")
                  }
                  onClick={(e) => {
                    genderChange("F");
                    setGenderAlert(false);
                  }}
                >
                  여
                </button>
              </div>
              <p className="c_red">
                {genderAlert ? "* 성별을 체크해주세요." : ""}
              </p>
              <p>이메일</p>
              <div className="inputdiv">
                <input
                  type="text"
                  className="email-id"
                  placeholder="이메일아이디"
                  name="emailId"
                  value={user.emailId}
                  onChange={(e) => {
                    changeUser(e);
                    setEmailAlert(false);
                    setAuthAlert(0);
                    setTimerOn("off");
                  }}
                  ref={refObj.emailId}
                />
                <span>@</span>
                {/* className="email-id read-only" */}
                <input
                  type="text"
                  id="emailAddress"
                  className={[
                    "email-id",
                    emailAddressReadOnly ? "read-only" : "",
                  ].join(" ")}
                  placeholder=""
                  name="emailAddress"
                  value={user.emailAddress}
                  onChange={(e) => {
                    console.log(123);
                    changeUser(e);
                    setEmailAlert(false);
                    setAuthAlert(0);
                    setTimerOn("off");
                  }}
                  ref={refObj.emailAddress}
                  readOnly={emailAddressReadOnly}
                />
                <div className="btn-exist-right">
                  <button onClick={authSendBefore}>인증요청</button>
                </div>
              </div>
              <div className="inputdiv email-domain">
                <select
                  className="domain-pick"
                  name="emailKinds"
                  value={emailKinds}
                  onChange={(e) => {
                    setEmailKinds(e.target.value);
                    setEmailAlert(false);
                    setAuthAlert(0);
                  }}
                >
                  <option value="">---</option>
                  {domainList.map((v) => (
                    <option key={v.name} value={v.url}>
                      {v.name}
                    </option>
                  ))}
                  <option value="직접입력">직접입력</option>
                </select>
              </div>
              <p className="c_red">
                {emailAlert ? "* 이메일을 형식에 맞게 입력해주세요." : ""}
              </p>
              <p>이메일 인증</p>
              <div className="inputdiv">
                <div className="btn-exist-left">
                  <input
                    type="text"
                    name="emailAuth"
                    className={authReadOnly ? "read-only" : ""}
                    placeholder="인증번호를 입력해주세요."
                    readOnly={authReadOnly}
                    maxLength={6}
                    value={user.emailAuth}
                    onChange={(e) => {
                      setUser({
                        ...user,
                        emailAuth: e.target.value.replace(/\D/g, ""),
                      });
                    }}
                  />
                  <span
                    className="timer"
                    style={{ display: authIng ? "block" : "none" }}
                  >
                    {authTimer}
                  </span>
                </div>
                <div className="btn-exist-right">
                  <button onClick={authCheckBefore}>확인</button>
                </div>
              </div>
              <p
                className={authAlert === 1 ? "c_green" : "c_red"}
                style={{ display: authAlert > 0 ? "block" : "none" }}
              >
                * {authAlertText()}
              </p>
              <p>전화번호</p>
              <div className="inputdiv">
                <input
                  type="text"
                  className="phone-txt"
                  placeholder="XXX"
                  name="phone1"
                  value={user.phone1}
                  onChange={(e) => {
                    changeUser(e);
                    setPhoneAlert("");
                  }}
                  ref={refObj.phone1}
                />
                <span>-</span>
                <input
                  type="text"
                  className="phone-txt"
                  placeholder="XXXX"
                  name="phone2"
                  value={user.phone2}
                  onChange={(e) => {
                    changeUser(e);
                    setPhoneAlert(false);
                  }}
                  ref={refObj.phone2}
                />
                <span>-</span>
                <input
                  type="text"
                  className="phone-txt"
                  placeholder="XXXX"
                  name="phone3"
                  value={user.phone3}
                  onChange={(e) => {
                    changeUser(e);
                    setPhoneAlert(false);
                  }}
                  ref={refObj.phone3}
                />
              </div>
              <p className="c_red">
                {phoneAlert ? "* 휴대전화 번호를 입력해주세요." : ""}
              </p>
              <p>팀이름</p>
              <div className="inputdiv">
                <select
                  name="dept"
                  className="dept"
                  value={user.dept}
                  onChange={(e) => {
                    setUser({
                      ...user,
                      dept: e.target.value,
                      deptDetail: "",
                    });
                    if (e.target.value) {
                      getDeptsDetail(e.target.value).then(({ data }) =>
                        setDeptDetailList([...data.data])
                      );
                    }
                  }}
                >
                  <option value="">----</option>
                  {deptList.map((dept) => (
                    <option value={dept.deptId} key={"dept" + dept.deptId}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {deptDetailList.length === 0 ? undefined : (
                  <select
                    name="deptDetail"
                    className="dept"
                    value={user.deptDetail}
                    onChange={changeUser}
                  >
                    <option value="">----</option>
                    {deptDetailList.map((deptDetail) => (
                      <option
                        value={deptDetail.deptId}
                        key={"dept" + deptDetail.deptId}
                      >
                        {deptDetail.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <p className="c_red">
                {deptAlert ? "* 팀이름을 선택해주세요." : ""}
              </p>
              <button className="loginBtn" onClick={membModifyBefore}>
                입력완료
              </button>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}
