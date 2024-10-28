import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import macview_detail_01 from "~/assets/images/macview_detail_01.png";
import Nav from "../components/Nav";
import Header from "../components/Header";
import { getUserInfo } from "../compositions/user";
import {  getDol, getMeeting } from "../compositions/dol";
import { useDispatch, useSelector } from "react-redux";
import "moment/locale/ko";
import moment from "moment/moment";
import { uiDol } from "../compositions/ui";

export default function DolMeeting() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { dolNum, meetNum } = useParams();
  const modal_result = useSelector((state) => state.modal.modal_confirm_result);
  const curLoginId = useSelector((state) => state.user.loginId);
  let meetId = null;

  const [dol, setDol] = useState({});
  const [meeting, setMeeting] = useState({});
  const [opinionPrivate, setOpPrivate] = useState(false);

  useEffect(() => {
    if (modal_result === "meetingExit") {
      console.log("meetingExit");
    }
    if (modal_result.startsWith("meetingReject")) {
      let index = modal_result.replace("meetingReject", "");
      meeting.learningMembers.splice(index, 1);
      setMeeting({ ...meeting });
      console.log("meetingReject");
    }
  }, [modal_result]);

  useEffect(() => {
    async function init() {
      await getUserInfo();
      await getDol(dolNum).then(({ data }) => {
        console.log("getDol", data.data);
        setDol({
          ...data.data,
        });
        meetId = data.data.learningIdList[meetNum - 1];
      });
      await getMeeting(dolNum, meetId).then(({ data }) => {
        console.log("getMeeting", data.data);
        setMeeting({
          ...data.data,
        });
      });
      uiDol.dolMoveSlide(navigate, dolNum, meetNum, 1);
    }
    init();
  }, [location.pathname]);

  return (
    <>
      <Header backUse={true} />
      <Nav />
      <main id="dolDetail">
        <section className="preview">
          <hr />
          <div>
            <div className="dolImg">
              <img src={macview_detail_01} alt="" />
            </div>
            <div className="dolComment">
              <h2>{meeting.learningName}</h2>
              <h3>주최자: {meeting.memberName}</h3>
              <p>{meeting.content}</p>
              {/* <p>2023.11.01 13:15-14:00</p> */}
              <p>{moment(meeting.startTime).format("YYYY.MM.DD HH:mm-")}</p>
              <p>엑스퍼트룸</p>
            </div>
          </div>
        </section>
        <section className="paging">
          <div className="page_wrap">
            <Link className="arrow pprev" href="#"></Link>
            <Link className="arrow prev" href="#"></Link>
            <Link to={`/dolDetail/${dolNum}`}>M</Link>
            <Link className={meetNum == 1 ? "active" : undefined} to={"1"}>
              1
            </Link>
            {/* <a href="#">3</a> */}
            {/* <a href="#">4</a> */}
            {/* <a href="#">5</a> */}
            <a className="arrow next" href="#"></a>
            <a className="arrow nnext" href="#"></a>
          </div>
          <p className="c_red">
            * 모바일에선 슬라이드하면 회차별 회의 이동이 가능합니다.
          </p>
        </section>
        <hr />
        <section className="storeBtn">
          <button
            className="apply"
            onClick={() => navigate(`/dolModify/${dolNum}/${meetNum}`)}
          >
            회의 관리&수정
          </button>
        </section>
        <section className="storeBtn">
          <button className="apply">회의 참가하기</button>
        </section>
        <section className="placeUrl">
          <h2>접속 URL</h2>
          <hr />
          <h3>www.naver.com</h3>
        </section>
        <section className="team">
          <h2>참여자 (총 00명)</h2>
          <hr />
          <div className="teamFlex">
            {meeting.learningMembers?.map((member, i) => (
              <div key={member.loginId}>
                <span className="material-symbols-outlined"> person </span>
                <label>
                  {member.name}({member.dept})
                </label>
              </div>
            ))}
          </div>
        </section>
        <section className="fileSec">
          <h2>참고자료</h2>
          <hr />
          <div className="fileFlex">
            <div>
              <a href="#">정말유익한자료.pdf</a>
            </div>
            <div>
              <a href="#">중요한학습자료.xlsx</a>
            </div>
          </div>
        </section>
        <section className="fileSec">
          <h2>과제제출</h2>
          <hr />
          <div className="fileFlex">
            <div>
              <a href="#">과제1.pdf</a>
            </div>
            <div>
              <a href="#">과제2.xlsx</a>
            </div>
          </div>
          <div className="uploadBtn">
            <label htmlFor="task">파일업로드</label>
            <input type="file" id="task" />
          </div>
        </section>
        <section className="opinion-div">
          <h2>공지 및 의견</h2>
          <hr />
          <div className="opinion-view">
            <div className="opinion-wrap">
              <div className="my">
                <p className="align_right">한호성 2023.10.19 10:30</p>
                <p className="align_right">Main</p>
                <p>안녕하세요.</p>
              </div>
            </div>
            <div className="opinion-wrap">
              <div className="other">
                <p>진영웅 2023-10-19 10:35</p>
                <p>1 Week</p>
                <p>
                  Lorem ipsum meetingor sit, amet consectetur adipisicing elit.
                  Ipsum possimus aut magni ducimus quo nostrum animi minus ullam
                  totam. Ea voluptas enim maiores illum! Iure expedita nemo
                  voluptatum distinctio aperiam.
                </p>
              </div>
            </div>
            <div className="opinion-wrap">
              <div className="other">
                <p>오정택 2023-10-19 10:38</p>
                <p>Main</p>
                <p>Lorem </p>
              </div>
            </div>
            <div className="opinion-wrap">
              <div className="other">
                <p>오정택 2023-10-19 10:38</p>
                <p>Main</p>
                <p>Lorem </p>
              </div>
            </div>
            <div className="opinion-wrap">
              <div className="other">
                <p>오정택 2023-10-19 10:38</p>
                <p>Main</p>
                <p>Lorem </p>
              </div>
            </div>
          </div>
          <div className="opinion-regist regist-form">
            <textarea
              name=""
              id=""
              cols="30"
              rows="2"
              placeholder="소통할 내용을 입력해주세요."
            ></textarea>
            <div className="regist-btn">
              <div className="onoffBtnDiv">
                <input
                  type="checkbox"
                  id="opinionPrivate"
                  className="onf_checkbox"
                  name="private"
                  value={opinionPrivate}
                  onChange={(e) => {
                    setOpPrivate(!opinionPrivate);
                  }}
                />
                <label htmlFor="opinionPrivate" className="switch_label">
                  <span className="onf_btn"></span>
                  <span
                    className={`onf_txt ${
                      opinionPrivate ? "c_green" : "c_red"
                    }`}
                  >
                    {opinionPrivate ? "공개" : "비공개"}
                  </span>
                </label>
              </div>
              <button>등록</button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
