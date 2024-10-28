import { useNavigate } from "react-router-dom";

export default function NotPage() {
  const navigate = useNavigate();
  return (
    <>
      <header id="header">
        <div className="title">
          <span>학습 커뮤니티 플랫폼</span>
        </div>
        <div className="headLeft">
          <a
            onClick={() =>
              navigate(-1, {
                replace: true,
              })
            }
          >
            <span className="material-symbols-outlined">
              arrow_back_ios_new
            </span>
          </a>
        </div>
      </header>
      <main id="notPage">
        <h2>해당 url의 페이지가 없습니다.</h2>
      </main>
    </>
  );
}
