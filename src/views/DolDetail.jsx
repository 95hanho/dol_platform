import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import board_view_img_01 from "~/assets/images/board_view_img_01.png";
import macview_detail_01 from "~/assets/images/macview_detail_01.png";
import ico_page_top from "~/assets/images/ico_page_top.png";
import Nav from "../components/Nav";
import Header from "../components/Header";
import { getUserInfo } from "../compositions/user";
import {
    dolInterest,
    dolJoin,
    getComments,
    getDol,
    getNotices,
    setNoticeComment,
} from "../compositions/dol";
import { useDispatch, useSelector } from "react-redux";
import "moment/locale/ko";
import { uiDol } from "../compositions/ui";
import moment from "moment/moment";

export default function DolDetail() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { dolNum } = useParams();
    const modal_result = useSelector(
        (state) => state.modal.modal_confirm_result
    );
    const curLoginId = useSelector((state) => state.user.loginId);

    const [dol, setDol] = useState({});
    const isLeader = useMemo(
        () => curLoginId === dol.loginId,
        [curLoginId, dol.loginId]
    );

    // 공지&의견 리스트
    const [noticeList, setNoticeList] = useState([]);
    // 댓글 리스트
    const [commentList, setCommentList] = useState([]);
    // 공지&의견
    const [notice, setNotice] = useState("");
    // 공지&의견 공개/비공개
    const [opinionPrivate, setOpPrivate] = useState(true);
    // 댓글
    const [comment, setComment] = useState("");

    // 공지&의견 등록
    const addNotice = (e) => {
        e.preventDefault();
        console.log("addNotice");
        console.log({
            state: opinionPrivate,
            comment: notice,
            type: "NOTICE",
        });
        if (notice.trim().length) {
            setNoticeComment(dolNum, 0, {
                state: opinionPrivate,
                comment: notice,
                type: "NOTICE",
            }).then(({ data }) => {
                setNotice("");
                console.log(data);
            });
        }
    };
    // 댓글 등록
    const addComment = (e) => {
        e.preventDefault();
        console.log("addComment");
        console.log({
            comment: comment,
            type: "COMMENT",
        });
        if (comment.trim().length) {
            setNoticeComment(dolNum, 0, {
                comment,
                type: "COMMENT",
            }).then(({ data }) => {
                console.log(data);
                setComment("");
            });
        }
    };

    useEffect(() => {
        if (modal_result === "dolExit") {
            console.log("dolExit");
        }
        if (modal_result.startsWith("memberReject")) {
            let index = modal_result.replace("memberReject", "");
            dol.learningMembers.splice(index, 1);
            setDol({ ...dol });
            console.log("memberReject");
        }
        if (modal_result.startsWith("memberRemove")) {
            let index = modal_result.replace("memberRemove", "");
        }
        //
    }, [modal_result]);

    useEffect(() => {
        if (dol.imgFile) {
            uiDol.dolMainImageInit();
            setTimeout(() => uiDol.dolMainImageInit2(), 200);
        }
    }, [dol.imgFile]);

    useEffect(() => {
        async function init() {
            await getUserInfo();
            await getDol(dolNum)
                .then(({ data }) => {
                    // const test = { ...data.data };
                    // console.log(test);
                    console.log("getDol", data.data);
                    // --------- TEST -------------
                    const testList = [];
                    for (let i = 2; i <= 40; i += 2) {
                        testList.push(i);
                    }
                    // console.log(testList);
                    // --------- TEST -------------
                    console.log(data);
                    setDol({
                        ...dol,
                        ...data.data,
                        // --------- TEST -------------
                        imgFile: {
                            tempFileName: board_view_img_01,
                            fileName: "12312",
                        },
                        learningIdList: testList,
                        // --------- TEST -------------
                    });
                })
                .catch(({ data }) => {
                    console.log(data);
                    if (data.res_code === 400)
                        navigate("/NotPage", { replace: true });
                });
            uiDol.dolMoveSlide(navigate, dolNum, undefined, 1);
            await getNotices(dolNum, 0).then(({ data }) => {
                // console.log("Notices", data.data);
                // setNoticeList(data.data);
            });
            await getComments(dolNum, 0).then(({ data }) => {
                // console.log("Comments", data.data);
                // setCommentList(data.data);
            });
        }
        init();
    }, [location.pathname]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Header backUse={true} />
            <Nav />
            <main id="dolDetail">
                <section className="preview">
                    <hr />
                    <div>
                        <div className="dolImg">
                            <img
                                id="dolMainImg"
                                src={dol.imgFile?.tempFileName}
                                alt={dol.imgFile?.fileName}
                            />
                        </div>
                        <div className="dolComment">
                            <h3>{dol.category?.categoryName}</h3>
                            <h2>{dol.mainLearningName}</h2>
                            <h3>리더: {dol.memberName}</h3>
                            <h4>
                                생성일 : {dol.createdDate?.substring(0, 10)}
                            </h4>
                            <p>{dol.content}</p>
                        </div>
                    </div>
                    <button
                        className="bookmark"
                        id="bookmark"
                        onClick={() => {
                            dolInterest(dolNum).then(({ data }) => {
                                if (data.data === "REGISTER") {
                                    setDol({
                                        ...dol,
                                        registerInterest: "OK",
                                        interestCount: dol.interestCount + 1,
                                    });
                                } else if (data.data === "CANCLE") {
                                    setDol({
                                        ...dol,
                                        registerInterest: null,
                                        interestCount: dol.interestCount - 1,
                                    });
                                }
                            });
                        }}
                    >
                        <label htmlFor="bookmark">{dol.interestCount}</label>
                        <span
                            className={`material-symbols-outlined ${
                                dol.registerInterest === "OK"
                                    ? "fill"
                                    : undefined
                            }`}
                        >
                            favorite
                        </span>
                    </button>
                </section>
                <section className="paging">
                    <div className="page_wrap">
                        {/* <a className="arrow pprev" href="#"></a> */}
                        {/* <a className="arrow prev" href="#"></a> */}
                        <Link className="active">M</Link>
                        {dol.learningIdList?.map((v, index) => {
                            if (index < 4) {
                                return (
                                    <Link
                                        to={`${index + 1}`}
                                        key={"learningPage" + index}
                                    >
                                        {index + 1}
                                    </Link>
                                );
                            }
                        })}
                        {/* <a href="#">3</a> */}
                        {/* <a href="#">4</a> */}
                        {/* <a href="#">5</a> */}
                        {dol.learningIdList?.length > 0 ? (
                            <>
                                <Link to={"1"} className="arrow next"></Link>
                                <Link
                                    to={"" + dol.learningIdList.length}
                                    className="arrow nnext"
                                ></Link>
                            </>
                        ) : undefined}
                    </div>
                    <p className="c_red">
                        * 모바일에선 슬라이드하면 회차별 회의 이동이 가능합니다.
                    </p>
                </section>
                <hr />
                <section className="storeBtn">
                    <button
                        className="apply"
                        onClick={() =>
                            dolJoin(dolNum).then((res) => {
                                console.log(res);
                            })
                        }
                    >
                        참여 신청 하기
                    </button>
                </section>
                <section className="storeBtn">
                    <button
                        onClick={() => navigate(`/dolMeetingRegist/${dolNum}`)}
                    >
                        <span className="material-symbols-outlined">
                            groups
                        </span>
                        회의 생성
                    </button>
                    <Link to={"/dolModify/" + dolNum}>관리&수정</Link>
                </section>
                <section className="storeBtn">
                    <button
                        onClick={() => navigate(`/dolMeetingRegist/${dolNum}`)}
                    >
                        <span className="material-symbols-outlined">
                            groups
                        </span>
                        회의 생성
                    </button>
                    <button
                        onClick={() => {
                            dispatch({
                                type: "modal/on_modal_confirm",
                                payload: {
                                    txt: "정말 나가시겠습니까??<br />나가게 되면 DoL리더 재수락 전까지 참여가 불가하며, 기록들은 유지됩니다.",
                                    set: "dolExit",
                                },
                            });
                        }}
                    >
                        DoL 나가기
                    </button>
                </section>
                <section className="keyword">
                    <h2>DoL 키워드</h2>
                    <hr />
                    <div className="btns">
                        {dol.keywordList?.map((keyword) => (
                            <button key={"keyword" + keyword.keywordId}>
                                #{keyword.keyword}
                            </button>
                        ))}
                    </div>
                </section>
                <section className="team">
                    <h2>멤버 (총 {dol.learningMembers?.length + 1}명)</h2>
                    <hr />
                    <div className="teamFlex">
                        {/* 리더먼저 */}
                        <div>
                            <span className="leader"></span>
                            <label>{dol.memberName}</label>
                        </div>
                        {/* 리더제외 */}
                        {dol.learningMembers?.map((member, i) => {
                            if (member.loginId !== dol.loginId) {
                                return (
                                    <div key={member.loginId}>
                                        <span className="material-symbols-outlined">
                                            {" "}
                                            person{" "}
                                        </span>
                                        <label className="join">
                                            {member.name}(
                                            {member.dept.dept1Name})
                                        </label>
                                        {isLeader ? (
                                            <a
                                                onClick={() =>
                                                    dispatch({
                                                        type: "modal/on_modal_confirm",
                                                        payload: {
                                                            txt: "이 멤버를 추방하시겠습니까??",
                                                            set:
                                                                "memberRemove" +
                                                                i,
                                                        },
                                                    })
                                                }
                                            >
                                                <span className="material-symbols-outlined c_red">
                                                    person_remove
                                                </span>
                                            </a>
                                        ) : undefined}
                                    </div>
                                );
                            }
                        })}

                        {/* {dol.learningMembers?.map((member, i) => (
                            <div key={member.loginId}>
                                <span className="material-symbols-outlined">
                                    {" "}
                                    person{" "}
                                </span>
                                <label className={member.join ? "join" : ""}>
                                    {member.name}({member.dept})
                                </label>
                                {isLeader ? (
                                    member.join ? (
                                        <a
                                            onClick={() =>
                                                dispatch({
                                                    type: "modal/on_modal_confirm",
                                                    payload: {
                                                        txt: "이 멤버를 추방하시겠습니까??",
                                                        set: "memberRemove" + i,
                                                    },
                                                })
                                            }
                                        >
                                            <span className="material-symbols-outlined c_red">
                                                person_remove
                                            </span>
                                        </a>
                                    ) : (
                                        <>
                                            <a
                                                onClick={() => {
                                                    dol.learningMembers[
                                                        i
                                                    ].join = true;
                                                    setDol({ ...dol });
                                                }}
                                            >
                                                <span className="material-symbols-outlined c_green">
                                                    check_circle
                                                </span>
                                            </a>
                                            <a
                                                onClick={() =>
                                                    dispatch({
                                                        type: "modal/on_modal_confirm",
                                                        payload: {
                                                            txt: "신청을 거부하시겠습니까??",
                                                            set:
                                                                "memberReject" +
                                                                i,
                                                        },
                                                    })
                                                }
                                            >
                                                <span className="material-symbols-outlined c_red">
                                                    cancel
                                                </span>
                                            </a>
                                        </>
                                    )
                                ) : undefined}
                            </div>
                        ))} */}
                    </div>
                </section>
                <section className="fileSec">
                    <h2>소개자료</h2>
                    <hr />
                    <div className="fileFlex">
                        {dol.learningFiles?.map((file, index) => (
                            <div key={"learningFile" + index}>
                                <a href="#">{file.fileName}</a>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="opinion-div">
                    <h2>공지 및 의견</h2>
                    <hr />
                    <div className="opinion-view">
                        {noticeList.map((notice) => (
                            <div
                                key={"notice" + notice.mainOpinionId}
                                className="opinion-wrap"
                            >
                                <div>
                                    <p>
                                        {notice.memberName}{" "}
                                        {moment(notice.createdDate).format(
                                            "YYYY.MM.DD hh:mm"
                                        )}
                                    </p>
                                    <p>Main</p>
                                    <p>{notice.comment}</p>
                                </div>
                            </div>
                        ))}
                        <div className="opinion-wrap">
                            <div className="my">
                                <p>한호성 2023.10.19 10:30</p>
                                <p>Main</p>
                                <p>안녕하세요.</p>
                            </div>
                        </div>
                        <div className="opinion-wrap">
                            <div className="other">
                                <p>진영웅 2023-10-19 10:35</p>
                                <p>1 Week</p>
                                <p>
                                    Lorem ipsum dolor sit, amet consectetur
                                    adipisicing elit. Ipsum possimus aut magni
                                    ducimus quo nostrum animi minus ullam totam.
                                    Ea voluptas enim maiores illum! Iure
                                    expedita nemo voluptatum distinctio aperiam.
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
                        <form onSubmit={addNotice}>
                            <textarea
                                name=""
                                id=""
                                cols="30"
                                rows="2"
                                placeholder="소통할 내용을 입력해주세요."
                                value={notice}
                                onChange={(e) => setNotice(e.target.value)}
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
                                    <label
                                        htmlFor="opinionPrivate"
                                        className="switch_label"
                                    >
                                        <span className="onf_btn"></span>
                                        <span
                                            className={`onf_txt ${
                                                opinionPrivate
                                                    ? "c_red"
                                                    : "c_green"
                                            }`}
                                        >
                                            {opinionPrivate ? "비공개" : "공개"}
                                        </span>
                                    </label>
                                </div>
                                <button>등록</button>
                            </div>
                            <p className="c_red">
                                {opinionPrivate
                                    ? ""
                                    : "* 공개 시 dol멤버가 아닌 회원도 볼 수 있습니다."}
                            </p>
                        </form>
                    </div>
                </section>
                <section className="comment">
                    <h2>댓글</h2>
                    <hr />
                    <div className="comment-view">
                        {commentList.map((comment) => (
                            <div key={"comment" + comment.mainOpinionId}>
                                <div className="my">
                                    <p>
                                        {comment.memberName}{" "}
                                        {moment(comment.createdDate).format(
                                            "YYYY.MM.DD hh:mm"
                                        )}
                                    </p>
                                    <p>{comment.comment}</p>
                                </div>
                            </div>
                        ))}
                        <div>
                            <div className="my">
                                <p>한호성 2022-12-31 09:38</p>
                                <p>
                                    Lorem ipsum, dolor sit amet consectetur
                                    adipisicing elit. Tempora, eligendi, sit nam
                                    nesciunt natus officiis esse ea deserunt
                                    facere error iste at obcaecati velit soluta
                                    dicta beatae quis, consequatur recusandae.
                                </p>
                            </div>
                        </div>
                        <div>
                            <div className="other">
                                <p>정진환 2023-09-19 09:38</p>
                                <p>ㅁㄴㅁㄴㅇㄹ</p>
                            </div>
                        </div>
                        {/* {dol.reviewList.map((review) => (
              <div key={"review" + review.reviewId}>
                <div>
                  <p>
                    {review.memberName} {review.createdDate.substring(0, 10)}
                  </p>
                  <p>{review.content}</p>
                </div>
              </div>
            ))} */}
                    </div>
                    <div className="comment-regist regist-form">
                        <form onSubmit={addComment}>
                            <textarea
                                name=""
                                id=""
                                cols="30"
                                rows="2"
                                placeholder="내용을 입력해주세요."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                            <div className="regist-btn">
                                <button>완료</button>
                            </div>
                        </form>
                    </div>
                </section>
                <section></section>
            </main>
        </>
    );
}
