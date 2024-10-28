import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCookie } from "../cookies";

export default function Header({ title: headerTitle, backUse, noLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  let [rToken, setRToken] = useState(undefined);

  useEffect(() => {
    const rt = getCookie("refreshToken");
    setRToken(rt);
  }, [location.pathname]);

  return (
    <header id="header" className={rToken && !noLogin ? "login-on" : ""}>
      <div className="title">
        <span
          dangerouslySetInnerHTML={{
            __html:
              headerTitle !== undefined ? headerTitle : "학습 커뮤니티 플랫폼",
          }}
        ></span>
      </div>
      {backUse ? (
        <div className="headLeft">
          <a onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined">
              arrow_back_ios_new
            </span>
          </a>
        </div>
      ) : undefined}
      {noLogin ? undefined : (
        <>
          <div className="headRight">
            <button
              className="btn_menu home-btn"
              onClick={() => navigate("/home")}
            >
              <span className="material-symbols-outlined home">home</span>
            </button>
            <button
              className="btn_menu menu-btn"
              onClick={() =>
                document.getElementById("wrap").classList.add("menu_on")
              }
            >
              <span className="sr_only"></span>
              <span className="bar_1"></span>
              <span className="bar_2"></span>
              <span className="bar_3"></span>
            </button>
          </div>
          <div className="searchspace">
            <div className="searchDiv">
              <input type="search" placeholder="Search" />
              <button>검색</button>
              <span className="material-symbols-outlined"> search </span>
            </div>
            <div className="hashTag">
              <a href="#">#hrd</a>
              <a href="#">#자발적 학습</a>
              <a href="#">#스마트사업팀</a>
              <a href="#">#스마트사업팀</a>
              <a href="#">#스마트사업팀</a>
              <a href="#">#스마트사업팀</a>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
