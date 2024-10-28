import { getCookie } from "../cookies";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Footer({}) {
  const location = useLocation();
  const [rToken, setRToken] = useState(undefined);
  const noLoginList = [
    "/",
    "/join",
    "/join/idFind",
    "/join/passwordFind",
    "/join/passwordChange",
  ];

  useEffect(() => {
    const rt = getCookie("refreshToken");
    setRToken(rt);
  }, [location.pathname]);

  return (
    <footer
      id="footer"
      className={
        rToken && !noLoginList.includes(location.pathname)
          ? "login-on"
          : "noLogin"
      }
    >
      <div className="f-space"></div>
      <hr />
      <div className="f-link">
        <a href="#">이용약관</a>
        <span>|</span>
        <a href="#">개인정보처리방침</a>
        <span>|</span>
        <a href="#">PC버전</a>
      </div>
      <h2>학습 커뮤니티 플랫폼</h2>
      <div className="copyright">
        Icon made by Freepik from www.flaticon.com
      </div>
    </footer>
  );
}
