import { useRef, useState } from "react";
import { login } from "../compositions/user";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getCategorys } from "../compositions/dol";
import { getCookie } from "../cookies";

export default function Login() {
  console.log("Login");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loding = useSelector((state) => state.loding.ing);

  // 유저obj
  const [user, setUser] = useState({
    loginId: "asd1234", // asd1234
    password: "a1234", // a1234
  });
  const [loginIdAlert, setLoginIdAlert] = useState(false);
  const [pwdAlert, setPwdAlert] = useState(false);
  // ref모음
  const refObj = {
    loginId: useRef(null),
    password: useRef(null),
  };

  // 유저 state변경
  const changeUser = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  // 유저 작성 리셋
  const resetUser = (name) => {
    setUser({
      ...user,
      [name]: "",
    });
    refObj[name].current.focus();
  };
  // 로그인 전 체크
  const loginBefore = async (e) => {
    e.preventDefault();
    console.log(user);

    // 오류 사항 표시하기
    // 알람띄우기
    // 아이디 4자리 이상
    if (user.loginId.length < 4) setLoginIdAlert(true);
    // 비밀번호 4자리 이상
    if (user.password.length < 4) setPwdAlert(true);

    if (user.loginId.length >= 4 && user.password.length >= 4) {
      if (loding) return;
      dispatch({ type: "loding/lodingOn" });
      await login(user)
        .then(({ data }) => {
          console.log(data);
          const rToken = getCookie("refreshToken");
          const already = rToken ? true : false;

          dispatch({
            type: "login/setLogin",
          });
          dispatch({
            type: "login/setToken",
            payload: {
              accessToken: data.data.accessToken,
              refreshToken: data.data.refreshToken,
            },
          });
          navigate("/home");
          if (!already) {
            dispatch({
              type: "modal/on_modal_alert",
              payload: "로그인되었습니다.",
            });
          }
        })
        .catch((data) => {
          console.log(data);
          // console.log(response);
        });
    }
  };

  return (
    <main id="login-main">
      <div className="login-wrap">
        <header className="login-header">
          <h1>학습 커뮤니티 플랫폼</h1>
        </header>
        <section className="login-section">
          <form onSubmit={loginBefore}>
            <div className="inputdiv">
              <input
                type="text"
                name="loginId"
                placeholder="아이디"
                value={user.loginId}
                onChange={(e) => {
                  changeUser(e);
                  setLoginIdAlert(false);
                }}
                ref={refObj.loginId}
              />
              <button
                type="button"
                className="clear-btn"
                onClick={() => resetUser("loginId")}
              >
                <span className="material-icons"> highlight_off </span>
              </button>
            </div>
            <p className="c_red">
              {loginIdAlert ? "아이디는 4자리 이상입니다." : ""}
            </p>
            <div className="inputdiv">
              <input
                type="password"
                name="password"
                placeholder="비밀번호"
                value={user.password}
                onChange={(e) => {
                  changeUser(e);
                  setPwdAlert(false);
                }}
                ref={refObj.password}
                autoComplete="false"
              />
              <button
                className="clear-btn"
                type="button"
                onClick={() => resetUser("password")}
              >
                <span className="material-icons"> highlight_off </span>
              </button>
            </div>
            <p className="c_red">
              {pwdAlert ? "비밀번호는 4자리 이상입니다." : ""}
            </p>
            <button className="loginBtn">로그인</button>
          </form>

          <div className="differLink">
            <Link to="/join/idFind">아이디 찾기</Link>|
            <Link to={"/join/passwordFind"}>비밀번호 찾기</Link>|
            <Link to={"/join"}>회원가입</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
