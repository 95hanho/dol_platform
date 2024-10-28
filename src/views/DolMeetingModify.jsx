// DolMeetingModify
import { useEffect, useRef, useState } from "react";
import { getCategorys, getDol, learningCreate } from "../compositions/dol";
import { getCookie } from "../cookies";
import Header from "../components/Header";
import Nav from "../components/Nav";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.min.css";
import { getUserInfo } from "../compositions/user";
import { uiDol } from "../compositions/ui";
import TimePicker from "react-time-picker";
import macview_detail_01 from "~/assets/images/macview_detail_01.png";

export default function DolMeetingModify() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loding = useSelector((state) => state.loding.ing);
  const { dolNum } = useParams();

  const [dol, setDol] = useState({
    content: "",
    category: "IT",
    imgFile: null,
    learningId: 8,
    learningMembers: [],
    learningName: "",
    memberName: "",
    startTime: "2023-08-01T14:00:00",
    startTimeHours: "",
    startTimeMinutes: "",
    startTimeMonth: "",
    startTimeSeconds: "",
    startTimeYear: "",
  });

  // meeting등록 obj
  const [meeting, setMeeting] = useState({
    learningName: "DOL이름입니다.", // DoL이름,
    content: "내용내용", // 내용
    imageFile: null, // 강의 이미지 1개
    referFile: [], // 학습자료 여러파일
    learningDate: "", // 일시(년월일)
    start_time: "12:00", // 시간 시간
    end_time: "12:00", // 끝 시간
    start_minutes: "02", // 시작 시간
    start_seconds: "13", // 시작 시간
    end_minutes: "04", // 끝 시간
    end_seconds: "15", // 끝 시간
    place: "장소장소", // 장소
    url: "https://www.naver.com", // 접속 URL
    invite: [],
  });
  // meeting Ele
  const meetingRef = {
    learningName: useRef(null),
    content: useRef(null),
    imageFile: useRef(null),
    referFile: useRef(null),
    learningDate: useRef(null),
    endTime: useRef(null),
    place: useRef(null),
    url: useRef(null),
  };
  // 대표이미지 프리뷰 src
  const [imageFile, setImageFile] = useState("");
  // 소개자료 리스트
  const [introFileList, setIntroFileList] = useState([]);
  // 카테고리 리스트

  // meeting state 변경
  const changeMeeting = (e) => {
    setMeeting({
      ...meeting,
      [e.target.name]: e.target.value,
    });
  };
  // 파일 변경
  const imageFileChange = () => {
    const files = meetingRef.imageFile.current.files;
    setMeeting({
      ...meeting,
      imageFile: files[0],
    });
    if (files && files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        setImageFile(e.target.result);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setImageFile("");
    }
  };
  // 참고자료 변경
  const referFileChange = () => {
    const files = meetingRef.referFile.current.files;
    setMeeting({
      ...meeting,
      referFile: files,
    });
    let result = [];
    if (files && files[0]) {
      for (let file of files) {
        result.push(
          <li key={file.name}>
            <a>{file.name}</a>
          </li>
        );
      }
      setIntroFileList(result);
    } else {
      setIntroFileList([]);
    }
  };
  // meeting등록 Before
  const meettingCreateBefore = (e) => {
    console.log("meettingCreateBefore");
    console.log(meeting);
    e.preventDefault();

    if (meeting.learningName.length < 2) {
      dispatch({
        type: "modal/on_modal_alert",
        payload: "회의주제를 입력해주세요.",
      });
      meetingRef.learningName.current.focus();
    } else if (!meeting.content.length) {
      dispatch({
        type: "modal/on_modal_alert",
        payload: "회의내용을 입력해주세요.",
      });
      meetingRef.content.current.focus();
    } else if (meeting.referFile.length > 5) {
      dispatch({
        type: "modal/on_modal_alert",
        payload: "최대 파일 수는 5개로 제한됩니다.",
      });
    } else {
      if (loding) return;
      dispatch({ type: "loding/lodingOn" });
      meettingCreate({
        learningName: meeting.learningName,
        content: meeting.content,
        imageFile: meeting.imageFile, // 대표이미지 1개
        referFile: meeting.referFile, // 학습자료 여러파일
        categoryId: meeting.categoryId, // 카테고리아이디
        private: meeting.private, // 공개비공개 여부
      }).then(({ data }) => {
        console.log(data);
        dispatch({
          type: "modal/on_modal_alert",
          payload: "meeting등록에 성공하였습니다.",
        });
        navigate("/home");
      });
    }
  };
  // meeting객체 초기화
  const resetMeeting = () => {
    setMeeting({
      learningName: "", // DoL이름,
      content: "", // 내용
      imageFile: null, // 대표이미지 1개
      referFile: null, // 학습자료 여러파일
      categoryId: 0, // 카테고리아이디
      learningDate: "", // 일시(년월일)
      start_minutes: "", // 시작 시간
      start_seconds: "", // 시작 시간
      end_minutes: "", // 끝 시간
      end_seconds: "", // 끝 시간
      place: "", // 장소
      url: "", // 접속 URL
    });
  };

  useEffect(() => {
    uiDol.registInit();
    if (imageFile) setTimeout(() => uiDol.registInit2(), 200);
  }, [imageFile]);
  useEffect(() => {
    async function init() {
      await getUserInfo();
      await getDol(dolNum).then(({ data }) => {
        // --------- TEST -------------
        data.data.learningMembers = [
          { name: "슈가", loginId: "shuga", dept: "네이버", join: true },
          {
            name: "옥민지",
            loginId: "minji",
            dept: "엑스퍼트지롱",
            join: false,
          },
          {
            name: "한호성",
            loginId: "hanho",
            dept: "엑스퍼트",
            join: false,
          },
          {
            name: "진영웅",
            loginId: "yeongyung",
            dept: "엑스퍼트",
            join: false,
          },
        ];
        // --------- TEST -------------
        console.log(data);
        setDol({
          ...dol,
          ...data.data,
        });
      });
    }
    init();
  }, [location.pathname]);

  return (
    <>
      <Header backUse={true} title={"DoL 회의 생성"} />
      <Nav />
      <main id="dolRegist">
        <form onSubmit={meettingCreateBefore}>
          <section className="title-space">
            <input
              type="text"
              placeholder="회의주제를 입력해주세요."
              name="learningName"
              value={meeting.learningName}
              onChange={changeMeeting}
              ref={meetingRef.learningName}
            />
            <textarea
              cols="30"
              rows="8"
              placeholder="회의소개를 입력하세요."
              name="content"
              value={meeting.content}
              onChange={changeMeeting}
              ref={meetingRef.content}
            ></textarea>
          </section>
          <section className="file-space">
            <div>
              <label htmlFor="mainImg">
                <span className="material-symbols-outlined">
                  {" "}
                  photo_library{" "}
                </span>
                회의이미지
              </label>
              <input
                type="file"
                id="mainImg"
                accept="image/*"
                className="inFile"
                ref={meetingRef.imageFile}
                onChange={imageFileChange}
              />
            </div>
            <div>
              <label htmlFor="introFile">
                <span className="material-symbols-outlined"> download </span>
                참고자료
              </label>
              <input
                type="file"
                className="inFile"
                id="introFile"
                ref={meetingRef.referFile}
                multiple
                onChange={referFileChange}
              />
            </div>
            <div>
              {imageFile ? (
                <div className="preview">
                  <img id="mainImage" src={imageFile} alt="" />
                </div>
              ) : undefined}
            </div>
            <div>
              {introFileList.length > 0 ? (
                <div className="intro-file">
                  <ul>{introFileList}</ul>
                  <p className="c_red align_right">* 최대 파일 수 5개</p>
                </div>
              ) : undefined}
            </div>
          </section>
          <p className="c_red">
            * 회의이미지 등록안할 시 DoL대표이미지가 적용됩니다.
          </p>
          <section className="detail-space">
            <div>
              <span className="data-span">일시</span>
              <DatePicker
                id="learningDate"
                name="learningDate"
                className="datepicker date-mark"
                placeholderText="YYYY-MM-DD"
                value={meeting.learningDate}
                onSelect={(date) => {
                  const year = date.getFullYear();
                  const m = date.getMonth() + 1;
                  const month = m < 10 ? "0" + m : m;
                  const d = date.getDate();
                  const day = d < 10 ? "0" + d : d;
                  setMeeting({
                    ...meeting,
                    learningDate: `${year}-${month}-${day}`,
                  });
                }}
              />
              <label className="date-pickBtn" htmlFor="learningDate">
                <span className="material-symbols-outlined">
                  calendar_month
                </span>
              </label>
            </div>
            <div className="date-detail">
              <TimePicker
                onChange={(value) =>
                  setMeeting({
                    ...meeting,
                    start_time: value,
                  })
                }
                value={meeting.start_time}
                disableClock
                amPmAriaLabel={"Select AM/PM"}
              />
              <span>~</span>
              <TimePicker
                onChange={(value) =>
                  setMeeting({
                    ...meeting,
                    end_time: value,
                  })
                }
                value={meeting.end_time}
                disableClock
              />
            </div>
            <div className="spot">
              <span>장소</span>
              <input
                type="text"
                placeholder="장소를 입력해주세요."
                name="place"
                value={meeting.place}
                onChange={changeMeeting}
                ref={meetingRef.place}
              />
            </div>
            <div className="connect">
              <span>접속 URL</span>
              <input
                type="text"
                placeholder="접속 URL을 입력해주세요."
                name="url"
                value={meeting.url}
                onChange={changeMeeting}
                ref={meetingRef.url}
              />
            </div>
          </section>
          <section className="submit-space">
            <input type="submit" value="저장" />
          </section>
          <section className="dol-remove">
            <button
              type="button"
              onClick={() =>
                dispatch({
                  type: "modal/on_modal_confirm",
                  payload: {
                    txt: "정말 나가시겠습니까??<br />나가게 되면 DoL리더 재수락 전까지 참여가 불가하며, 기록들은 유지됩니다.",
                    set: "dolDelete",
                  },
                })
              }
            >
              회의삭제하기
            </button>
          </section>
        </form>
      </main>
    </>
  );
}
