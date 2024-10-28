import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getUserInfo, pwdChange } from "../compositions/user";
import Header from "../components/Header";
import Nav from "../components/Nav";

export default function MyPagePwdChange() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loding = useSelector((state) => state.loding.ing);
  const changingId = useSelector((state) => state.user.loginId);

  // 바꿀 비번, 비번확인
  const [curPwd, setCurPwd] = useState();
  const [pwd, setPwd] = useState("");
  const [pwdCheck, setPwdCheck] = useState("");
  // input Ele
  const curPwdEle = useRef(null);
  const pwdEle = useRef(null);
  const pwdCheckEle = useRef(null);
  // 알람 표시
  const [curPwdAlert, setCurPwdAlert] = useState(false);
  const [pwdAlert, setPwdAlert] = useState(false);
  const [pwdCheckAlert, setPwdCheckAlert] = useState(0);

  // 비밀번호 같은지 확인
  const pwdSameCheck = (e) => {
    console.log(pwd, e.target.value);
    if (e.target.value && pwd === e.target.value) setPwdCheckAlert(1);
    else setPwdCheckAlert(2);
  };
  // 비밀번호변경
  const pwdChangeCheck = (e) => {
    e.preventDefault();

    const pwdRegExp = /^[a-zA-Z0-9!@#$%^&*()-_=+[\]{};:'",.<>?\\/]{8,16}$/;

    // 오류 사항 표시하기
    // 알람띄우기
    if (!pwdRegExp.test(pwd)) setPwdAlert(true);
    if (pwd !== pwdCheck) setPwdCheckAlert(2);

    // 포커스하기
    if (!pwdRegExp.test(pwd)) pwdEle.current.focus();
    else if (pwd !== pwdCheck) pwdCheckEle.current.focus();
    else {
      if (loding) return;
      dispatch({ type: "loding/lodingOn" });
      pwdChange({
        loginId: changingId,
        password: pwd,
        successCode: successCode,
      }).then(({ data }) => {
        console.log(data);
        dispatch({
          type: "modal/on_modal_alert",
          payload: "비밀번호가 변경되었습니다.",
        });
        navigate("/");
      });
    }
  };

  useEffect(() => {
    async function init() {
      await getUserInfo();
    }
    init();
  }, []);

  return (
    <>
      <Header backUse={true} title={"비밀번호변경"} />
      <Nav />
      <main id="login-main" className="myPage-change">
        <div className="login-wrap myPage-wrap">
          <section className="login-section">
            <form onSubmit={pwdChangeCheck}>
              <p>기존 비밀번호</p>
              <div className="inputdiv">
                <input
                  type="password"
                  name="curPwd"
                  placeholder="기존 비밀번호를 입력해주세요."
                  value={curPwd}
                  onChange={(e) => {
                    setCurPwd(e.target.value);
                    setCurPwdAlert(false);
                  }}
                  ref={curPwdEle}
                  autoComplete="false"
                />
                <button
                  type="button"
                  tabIndex="-1"
                  className="clear-btn"
                  onClick={(e) => setCurPwd("")}
                >
                  <span className="material-icons"> highlight_off </span>
                </button>
              </div>
              <p className="c_red">
                {curPwdAlert ? "* 비밀번호가 일치하지 않습니다." : ""}
              </p>
              <p>새 비밀번호</p>
              <div className="inputdiv">
                <input
                  type="password"
                  name="password"
                  placeholder="새 비밀번호를 입력해주세요."
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  ref={pwdEle}
                  autoComplete="false"
                  onFocus={() => setPwdAlert(true)}
                  onBlur={() => setPwdAlert(false)}
                />
                <button
                  type="button"
                  tabIndex="-1"
                  className="clear-btn"
                  onClick={(e) => setPwd("")}
                >
                  <span className="material-icons"> highlight_off </span>
                </button>
              </div>
              <p className="c_red">
                {pwdAlert ? "* 8~16자 영문숫자특수문자 조합." : ""}
              </p>
              <p>비밀번호확인</p>
              <div className="inputdiv">
                <input
                  type="password"
                  placeholder="비밀번호를 다시 입력해주세요."
                  name="pwdCheck"
                  value={pwdCheck}
                  onChange={(e) => {
                    setPwdCheck(e.target.value);
                    pwdSameCheck(e);
                  }}
                  ref={pwdCheckEle}
                  autoComplete="false"
                  onFocus={(e) => {
                    pwdSameCheck(e);
                  }}
                  onBlur={() => {
                    if (pwdCheckAlert !== 1) setPwdCheckAlert(0);
                  }}
                />
                <button
                  type="button"
                  tabIndex="-1"
                  className="clear-btn"
                  onClick={(e) => setPwdCheck("")}
                >
                  <span className="material-icons"> highlight_off </span>
                </button>
              </div>

              <p
                className={pwdCheckAlert === 1 ? "c_green" : "c_red"}
                style={{ display: pwdCheckAlert > 0 ? "block" : "none" }}
              >
                *{" "}
                {pwdCheckAlert === 1
                  ? "비밀번호가 일치합니다."
                  : "비밀번호가 일치하지 않습니다."}
              </p>
              <button className="loginBtn">입력완료</button>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}
