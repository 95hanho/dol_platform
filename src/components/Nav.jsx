import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const dispatch = useDispatch();
  const pathname = useLocation().pathname;

  const windowScroll = () => {
    document.getElementById("main-menu").style.top = window.scrollY + "px";
  };

  useEffect(() => {
    windowScroll();
    window.addEventListener("scroll", windowScroll);
    return () => {
      document.getElementById("wrap").classList.remove("menu_on");
      window.removeEventListener("scroll", windowScroll);
    };
  }, []);

  return (
    <nav id="main-menu">
      <header>
        <div className="close-space">
          <button
            className="btn_menu"
            onClick={() =>
              document.getElementById("wrap").classList.remove("menu_on")
            }
          >
            <span className="bar_1"></span>
            <span className="bar_2"></span>
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
            <a href="#">#스마트사업팀</a>
            <a href="#">#스마트사업팀</a>
            <a href="#">#스마트사업팀</a>
          </div>
        </div>
      </header>
      <section>
        <aside>
          <ul>
            <li>
              <Link
                to={"/dolView"}
                className={pathname === "/dolView" ? "active" : undefined}
              >
                DoL
              </Link>
            </li>
            <li>
              <Link
                to={"/schedule"}
                className={pathname === "/schedule" ? "active" : undefined}
              >
                나의 일정
              </Link>
            </li>
            <li>
              <Link
                to={"/dolRegist"}
                className={pathname === "/dolRegist" ? "active" : undefined}
              >
                DoL만들기
              </Link>
            </li>
            <li>
              <Link
                to={"/interest"}
                className={pathname === "/interest" ? "active" : undefined}
              >
                관심DoL
              </Link>
            </li>
            <li>
              <Link
                to={"/myPage"}
                className={pathname === "/myPage" ? "active" : undefined}
              >
                마이페이지
              </Link>
            </li>
          </ul>
        </aside>
        <article>
          <h2>
            <span className="material-symbols-outlined">group</span> MyDoL
          </h2>
          <ul>
            <li>
              <a>학습커뮤니티 스터디</a>
            </li>
            <li>
              <a>인재개발 실태조사</a>
            </li>
            <li>
              <a>면접 잘하는 법</a>
            </li>
          </ul>
        </article>
        <div className="module-btn">
          <a onClick={() => dispatch({ type: "modal/on_modal_logout" })}>
            <span className="material-symbols-outlined">logout</span>
            <span className="logout">로그아웃</span>
          </a>
        </div>
      </section>
    </nav>
  );
}
