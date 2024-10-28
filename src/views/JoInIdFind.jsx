import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { emailAuth, emailAuthConfirm, idFind } from "../compositions/user";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";

export default function JoinIdFind() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loding = useSelector((state) => state.loding.ing);

  // 인증정보들
  const [authInfo, setAuthInfo] = useState({
    name: "",
    email: "",
    auth: "",
  });
  // 인증정보 element
  const authInfoEle = {
    name: useRef(null),
    email: useRef(null),
    auth: useRef(null),
  };
  // 알림 텍스트
  const [nameAlert, setNameAlert] = useState(false);
  const [emailAlert, setEmailAlert] = useState(false);
  const [authAlert, setAuthAlert] = useState(0);

  // 인증확인을 기다리는 상태
  const [authIng, setAuthIng] = useState(false);
  const [authReadOnly, setAuthReadOnly] = useState(true);
  // 인증번호 타이머
  const [authTimer, setAuthTimer] = useState("0:00");
  const [timerOn, setTimerOn] = useState("");
  const [timerIndex, setTimerIndex] = useState(null);

  // 인증정보 반응bind
  const changeAuthInfo = (e) => {
    setAuthInfo({
      ...authInfo,
      [e.target.name]: e.target.value,
      auth: "",
    });
  };
  // 인증정보 비우기
  const emptyAuthInfo = (e, name) => {
    e.preventDefault();
    setAuthInfo({
      ...authInfo,
      [name]: "",
    });
    authInfoEle[name].current.focus();
  };
  // 인증번호 확인 결과
  const authResultTxt = () => {
    if (authAlert === 1) return "인증완료 되었습니다.";
    else if (authAlert === 2) return "이메일 인증을 완료해주세요.";
    else if (authAlert === 3) return "인증번호가 틀렸습니다.";
    else if (authAlert === 4) return "제한시간초과";
    else if (authAlert === 5) return "인증번호 6자리를 입력해주세요.";
    else if (authAlert === 6) return "인증요청 해주세요.";
  };
  // 인증번호요청
  const authSendBefore = (e) => {
    e.preventDefault();

    setAuthAlert(0);
    setAuthInfo({
      ...authInfo,
      auth: "",
    });

    const emailRegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (authInfo.name.length < 2) setNameAlert(true);
    if (!emailRegExp.test(authInfo.email)) setEmailAlert(true);

    if (authInfo.name.length < 2) {
      authInfoEle.name.current.focus();
    } else if (!emailRegExp.test(authInfo.email)) {
      authInfoEle.email.current.focus();
    } else {
      if (loding) return;
      dispatch({ type: "loding/lodingOn" });
      setTimerOn("on");
      emailAuth({ email: authInfo.email, type: "FIND" })
        .then(({ data }) => {
          console.log(data);
        })
        .catch(({ data }) => {
          if (data.res_code === 400) {
            setTimerOn("off");
            dispatch({
              type: "modal/on_modal_alert",
              payload: "이메일과 일치하는 회원이 없습니다.",
            });
          }
        });
    }
  };
  // 인증번호확인
  const authCheckBefore = (e) => {
    e.preventDefault();

    const authRegExp = /^\d{6}$/;

    if (!authIng) setAuthAlert(6);
    else if (!authRegExp.test(authInfo.auth)) setAuthAlert(5);
    else if (authIng && authReadOnly) {
      setAuthAlert(4);
    } else if (authIng && !authReadOnly) {
      if (loding) return;
      dispatch({ type: "loding/lodingOn" });
      emailAuthConfirm({
        name: authInfo.name,
        email: authInfo.email,
        certifyNum: authInfo.auth,
      })
        .then(({ data }) => {
          console.log(data);
          setAuthAlert(1);
          setTimerOn("off");
        })
        .catch(({ data }) => {
          console.log(data);
          setAuthAlert(3); // 번호틀
        });
    }
  };
  // 최종 제출
  const idFindBefore = (e) => {
    e.preventDefault();
    console.log(authAlert);
    if (authAlert !== 1)
      dispatch({
        type: "modal/on_modal_alert",
        payload: "이메일 인증을 완료해주세요.",
      });
    else {
      if (loding) return;
      dispatch({ type: "loding/lodingOn" });
      idFind({
        name: authInfo.name,
        email: authInfo.email,
      })
        .then(({ data }) => {
          console.log(data);
          navigate("/");
          dispatch({
            type: "modal/on_modal_alert",
            payload: `아이디는 ${data.data}입니다.`,
          });
        })
        .catch((data) => {
          console.log(data);
          // dispatch({
          //   type: "modal/on_modal_alert",
          //   payload: "존재하지 않는 이름과 이메일 입니다.",
          // });
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
      console.log("clear", timerIndex);
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
    } else if (timerOn === "timeOut") {
      setAuthReadOnly(true);
      clearInterval(timerIndex);
    }
    setTimerOn("");
  }, [timerOn]);

  return (
    <>
      <Header noLogin={true} backUse={true} title={""} />
      <main id="login-main">
        <div className="login-wrap">
          <header className="login-header">
            <h1>아이디 찾기</h1>
          </header>
          <section className="login-section">
            <form onSubmit={idFindBefore}>
              <p>이름</p>
              <div className="inputdiv">
                <input
                  type="text"
                  name="name"
                  placeholder="이름을 입력해주세요."
                  value={authInfo.name}
                  onChange={(e) => {
                    changeAuthInfo(e);
                    setNameAlert(false);
                    setAuthAlert(0);
                    setTimerOn("off");
                    setAuthIng(false);
                  }}
                  ref={authInfoEle.name}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="clear-btn"
                  onClick={(e) => emptyAuthInfo(e, "name")}
                >
                  <span className="material-icons"> highlight_off </span>
                </button>
              </div>
              <p className="c_red">
                {nameAlert ? "* 이름을 정확히 입력해주세요." : ""}
              </p>
              <p>이메일</p>
              <div className="inputdiv">
                <div className="btn-exist-left">
                  <input
                    type="text"
                    name="email"
                    placeholder="이메일을 입력해주세요."
                    value={authInfo.email}
                    onChange={(e) => {
                      changeAuthInfo(e);
                      setEmailAlert(false);
                      setAuthAlert(0);
                      setTimerOn("off");
                      setAuthIng(false);
                    }}
                    ref={authInfoEle.email}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="clear-btn"
                    onClick={(e) => emptyAuthInfo(e, "email")}
                  >
                    <span className="material-icons"> highlight_off </span>
                  </button>
                </div>
                <div className="btn-exist-right">
                  <button type="button" tabIndex={-1} onClick={authSendBefore}>
                    인증요청
                  </button>
                </div>
              </div>
              <p className="c_red">
                {emailAlert ? "* 이메일을 형식에 맞게 입력해주세요." : ""}
              </p>
              <p>인증번호</p>
              <div className="inputdiv">
                <div className="btn-exist-left">
                  <input
                    type="text"
                    className={authReadOnly ? "read-only" : ""}
                    name="auth"
                    placeholder="인증번호를 입력해주세요."
                    readOnly={authReadOnly}
                    value={authInfo.auth}
                    ref={authInfoEle.auth}
                    maxLength={6}
                    onChange={(e) => {
                      setAuthAlert(0);
                      setAuthInfo({
                        ...authInfo,
                        auth: e.target.value.replace(/\D/g, ""),
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
                  <button type="button" tabIndex={-1} onClick={authCheckBefore}>
                    확인
                  </button>
                </div>
              </div>
              <p
                className={authAlert === 1 ? "c_green" : "c_red"}
                style={{ display: authAlert > 0 ? "block" : "none" }}
              >
                {authResultTxt()}
              </p>
              <button className="loginBtn">입력완료</button>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}
