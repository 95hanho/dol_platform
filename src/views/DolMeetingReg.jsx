import { useEffect, useRef, useState } from "react";
import { getDol, meetingCreate } from "../compositions/dol";
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

export default function DolMeetingReg() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const loding = useSelector((state) => state.loding.ing);
    const { dolNum } = useParams();
    const curLoginId = useSelector((state) => state.user.loginId);

    const [dol, setDol] = useState({});

    // meeting등록 obj
    const [meeting, setMeeting] = useState({
        meetingName: "DOL이름입니다.", // DoL이름,
        content: "내용내용", // 내용
        imageFile: null, // 강의 이미지 1개
        referFile: [], // 학습자료 여러파일
        meetingDate: "", // 일시(년월일)
        start_time: "12:00", // 시간 시간
        end_time: "12:00", // 끝 시간
        place: "장소장12소", // 장소
        url: "https://www.naver.com", // 접속 URL
        inviteIdList: [],
    });
    // meeting Ele
    const meetingRef = {
        meetingName: useRef(null),
        content: useRef(null),
        imageFile: useRef(null),
        referFile: useRef(null),
        meetingDate: useRef(null),
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
        // console.log(meeting);
        e.preventDefault();

        if (meeting.meetingName.length < 2) {
            dispatch({
                type: "modal/on_modal_alert",
                payload: "회의주제를 입력해주세요.",
            });
            meetingRef.meetingName.current.focus();
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
        } else if (
            !meeting.meetingDate ||
            !meeting.start_time ||
            !meeting.end_time
        ) {
            dispatch({
                type: "modal/on_modal_alert",
                payload: "회의 시간을 입력해주세요.",
            });
        } else {
            console.log(dol);
            console.log(meeting);
            console.log({
                mainLearningId: dol.mainLearningId,
                meetingName: meeting.meetingName,
                content: meeting.content,
                imageFile: meeting.imageFile, // 대표이미지 1개
                referFile: meeting.referFile, // 학습자료 여러파일
                meetingDate: meeting.meetingDate,
                startTime: meeting.start_time,
                endTime: meeting.end_time,
                place: meeting.place,
                url: meeting.url,
                inviteIdList: meeting.inviteIdList,
            });
            return;

            if (loding) return;
            dispatch({ type: "loding/lodingOn" });
            meetingCreate({
                meetingName: meeting.meetingName,
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
            meetingName: "", // DoL이름,
            content: "", // 내용
            imageFile: null, // 대표이미지 1개
            referFile: null, // 학습자료 여러파일
            categoryId: 0, // 카테고리아이디
            meetingDate: "", // 일시(년월일)
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
                            name="meetingName"
                            value={meeting.meetingName}
                            onChange={changeMeeting}
                            ref={meetingRef.meetingName}
                        />
                        <textarea
                            cols="30"
                            rows="8"
                            placeholder="회의내용을 입력하세요."
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
                            {imageFile ? (
                                <a
                                    className="c_red"
                                    onClick={() => {
                                        setImageFile(null);
                                        setMeeting({
                                            ...meeting,
                                            imageFile: null,
                                        });
                                    }}
                                >
                                    (취소)
                                </a>
                            ) : undefined}
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
                                <span className="material-symbols-outlined">
                                    {" "}
                                    download{" "}
                                </span>
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
                                    <img
                                        id="mainImage"
                                        src={imageFile}
                                        alt=""
                                    />
                                </div>
                            ) : undefined}
                        </div>
                        <div>
                            {introFileList.length > 0 ? (
                                <div className="intro-file">
                                    <ul>{introFileList}</ul>
                                    <p className="c_red align_right">
                                        * 최대 파일 수 5개
                                    </p>
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
                                id="meetingDate"
                                name="meetingDate"
                                className="datepicker date-mark"
                                placeholderText="YYYY-MM-DD"
                                value={meeting.meetingDate}
                                onSelect={(date) => {
                                    const year = date.getFullYear();
                                    const m = date.getMonth() + 1;
                                    const month = m < 10 ? "0" + m : m;
                                    const d = date.getDate();
                                    const day = d < 10 ? "0" + d : d;
                                    setMeeting({
                                        ...meeting,
                                        meetingDate: `${year}-${month}-${day}`,
                                    });
                                }}
                            />
                            <label
                                className="date-pickBtn"
                                htmlFor="meetingDate"
                            >
                                <span className="material-symbols-outlined">
                                    calendar_month
                                </span>
                            </label>
                        </div>
                        <div className="date-detail">
                            <TimePicker
                                onChange={(value) => {
                                    if (!value) value = "00:00";
                                    setMeeting({
                                        ...meeting,
                                        start_time: value,
                                    });
                                }}
                                value={meeting.start_time}
                                disableClock
                                amPmAriaLabel={"Select AM/PM"}
                            />
                            <span>~</span>
                            <TimePicker
                                onChange={(value) => {
                                    if (!value) value = "00:00";
                                    setMeeting({
                                        ...meeting,
                                        end_time: value,
                                    });
                                }}
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
                        <div className="participant">
                            <span>
                                참가자 목록({meeting.inviteIdList.length})
                            </span>
                            <div>
                                {dol.learningMembers?.map((member) => {
                                    if (member.loginId !== curLoginId) {
                                        const inviteOn =
                                            meeting.inviteIdList.includes(
                                                member.loginId
                                            );
                                        const index =
                                            meeting.inviteIdList.indexOf(
                                                member.loginId
                                            );
                                        return (
                                            <div
                                                key={"person" + member.loginId}
                                            >
                                                <a
                                                    onClick={() => {
                                                        if (inviteOn)
                                                            meeting.inviteIdList.splice(
                                                                index,
                                                                1
                                                            );
                                                        else
                                                            meeting.inviteIdList.push(
                                                                member.loginId
                                                            );
                                                        setMeeting({
                                                            ...meeting,
                                                        });
                                                    }}
                                                >
                                                    {member.name}
                                                    {inviteOn ? (
                                                        <span className="c_red">
                                                            취소
                                                        </span>
                                                    ) : (
                                                        <span className="c_green">
                                                            초대
                                                        </span>
                                                    )}
                                                </a>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    </section>
                    <section className="submit-space">
                        <input type="submit" value="저장" />
                    </section>
                </form>
            </main>
        </>
    );
}
