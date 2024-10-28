import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Nav from "../components/Nav";
import { useEffect, useState } from "react";
import { getUserInfo } from "../compositions/user";
import { useDispatch } from "react-redux";

export default function MyPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState({});

  useEffect(() => {
    async function init() {
      await getUserInfo().then(({ data }) => {
        console.log(data);
        setUser({ ...data.data });
      });
    }
    init();
  }, []);

  return (
    <>
      <Header backUse={true} title={"마이페이지"} />
      <Nav />
      <main id="myPage-main">
        <section>
          <h2>개인정보관리</h2>
          <button
            className="btn right"
            onClick={() => navigate("/myPage/modify")}
          >
            개인정보수정
          </button>
          <hr />
          <div className="info-div">
            <span>아이디</span>
            <p>{user.loginId}</p>
          </div>
          <hr />
          <div className="info-div">
            <span>비밀번호</span>
            <button
              className="btn"
              onClick={() => navigate("/myPage/passwordChange")}
            >
              비밀번호변경
            </button>
          </div>
          <hr />
          <div className="info-div">
            <span>이름</span>
            <p>{user.name}</p>
          </div>
          <hr />
          <div className="info-div">
            <span>닉네임</span>
            <p>{user.nickName}</p>
          </div>
          <hr />
          <div className="info-div">
            <span>생년월일</span>
            <p>
              {user.birth?.substring(0, 4) +
                "-" +
                user.birth?.substring(4, 6) +
                "-" +
                user.birth?.substring(6, 8)}
            </p>
          </div>
          <hr />
          <div className="info-div">
            <span>성별</span>
            <p>{user.gender === "M" ? "남자" : "여자"}</p>
          </div>
          <hr />
          <div className="info-div">
            <span>이메일</span>
            <p>{user.email}</p>
          </div>
          <hr />
          <div className="info-div">
            <span>전화번호</span>
            <p>
              {user.phone?.substring(0, 3) +
                "-" +
                user.phone?.substring(3, 7) +
                "-" +
                user.phone?.substring(7, 11)}
            </p>
          </div>
          <hr />
          <div className="info-div">
            <span>팀명</span>
            <p>IT전략실</p>
          </div>
          <hr />
          <div className="info-div">
            <span>관심사</span>
            <button
              className="btn"
              onClick={() => dispatch({ type: "modal/on_modal_interest" })}
            >
              관심사 변경
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
