import { Link, useNavigate } from "react-router-dom";
import macview_detail_01 from "~/assets/images/macview_detail_01.png";
import { getCategorys, getRecommend } from "../compositions/dol";
import { useEffect, useState } from "react";
import { getCookie } from "../cookies";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Nav from "../components/Nav";
import { Swiper, SwiperSlide } from "swiper/react";

import { Pagination, Autoplay } from "swiper/modules";
import { getUserInfo, idDuplCheck } from "../compositions/user";
import moment from "moment/moment";

export default function Home() {
    console.log("Home");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [timeLineList, setTimeLine] = useState([]);
    const [recommendList, setRecommendList] = useState([]);
    const [recSlidePerView, setRecSPV] = useState(1);

    const windowResize = () => {
        if (window.innerWidth < 768) {
            setRecSPV(1);
        } else if (768 <= window.innerWidth < 1024) {
            setRecSPV(3);
        } else {
        }
    };

    useEffect(() => {
        // console.log("home open");
        async function init() {
            await getUserInfo().then((res) => {
                console.log(res);
            });
            await getRecommend().then(({ data }) => {
                console.log(data);
                setRecommendList(data.data.slice(0, 5));
            });
            windowResize();
            window.addEventListener("resize", windowResize);
        }
        init();
        return () => {
            window.removeEventListener("resize", windowResize);
        };
    }, []);

    return (
        <>
            <Header backUse={false} />
            <Nav />
            <main id="mainPage">
                <header className="mainHead">
                    <h3>Day of Learning</h3>
                    <h2>DoL</h2>
                    <p>
                        DoL은 개인과 조직 모두의 역량 향상을 위해 자발적으로
                        진행되는 사내 학습공동체 입니다.
                    </p>
                </header>
                <section className="tight-schedule">
                    <h2>임박한 회의목록</h2>
                    <ul>
                        <li className="dday1">
                            <a>
                                <div className="meetInfo">
                                    <h3>
                                        Hrm의 기초Lorem ipsum dolor sit amet
                                        consectetur adipisicing elit.
                                        Consequatur, quasi ullam? Quam minus
                                        esse illo error accusantium nihil
                                        explicabo similique, quae quod, soluta
                                        dolor odit tempora eligendi excepturi ad
                                        iure.
                                    </h3>
                                    <p>
                                        hrm의 역사알아오기Lorem ipsum dolor sit
                                        amet consectetur adipisicing elit.
                                        Dignissimos repudiandae pariatur,
                                        delectus debitis labore modi quisquam
                                        est numquam distinctio, facere iure
                                        explicabo. Repudiandae repellendus,
                                        necessitatibus voluptatum quis suscipit
                                        recusandae neque?
                                    </p>
                                </div>
                                <div className="dday">D-4</div>
                            </a>
                        </li>
                        <li className="dday2">
                            <a>
                                <div className="meetInfo">
                                    <h3>Hrm의 기초</h3>
                                    <p>hrm의 역사알아오기</p>
                                </div>
                                <div className="dday">24h 00m</div>
                            </a>
                        </li>
                        <li className="dday3">
                            <a>
                                <div className="meetInfo">
                                    <h3>Hrm의 기초</h3>
                                    <p>hrm의 역사알아오기</p>
                                </div>
                                <div className="dday">24h 00m</div>
                            </a>
                        </li>
                    </ul>
                    <button className="add-btn">
                        <span className="material-symbols-outlined">add</span>
                    </button>
                </section>
                <section className="timeLine-dol">
                    <h2>타임라인</h2>
                    <ul>
                        <li>
                            <a>
                                <div className="timeLine-img">
                                    {/* <img src={concern.imgFile} alt={timeLine.learningId} /> */}
                                    <img src={macview_detail_01} alt={12321} />
                                </div>
                                <div className="timeLine-cont">
                                    <h3>doL제목-1week</h3>
                                    <p>회의가 등록되었습니다.</p>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a>
                                <div className="timeLine-img">
                                    {/* <img src={concern.imgFile} alt={timeLine.learningId} /> */}
                                    <img src={macview_detail_01} alt={12321} />
                                </div>
                                <div className="timeLine-cont">
                                    <h3>doL제목</h3>
                                    <p>DoL에 참가 되었습니다.</p>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a>
                                <div className="timeLine-img">
                                    {/* <img src={concern.imgFile} alt={timeLine.learningId} /> */}
                                    <img src={macview_detail_01} alt={12321} />
                                </div>
                                <div className="timeLine-cont">
                                    <h3>doL제목</h3>
                                    <p>공지가 </p>
                                </div>
                            </a>
                        </li>
                    </ul>
                    <button className="add-btn">
                        <span className="material-symbols-outlined">add</span>
                    </button>
                </section>
                <section className="recomd">
                    <h2>추천 DoL</h2>
                    <div className="slide-setting" id="mainRecommend">
                        <ul className="dol-list">
                            <Swiper
                                modules={[Pagination, Autoplay]}
                                spaceBetween={20}
                                slidesPerView={recSlidePerView}
                                loop
                                // autoplay={{
                                // delay: 500,
                                // disableOnInteraction: false,
                                // }}
                                speed={1500}
                                pagination={
                                    recSlidePerView === 1
                                        ? { clickable: true }
                                        : false
                                }
                                // onSwiper={(swiper) => console.log(swiper)}
                                // onSlideChange={() => console.log("slide change")}
                            >
                                {recommendList.map((recommend, index) => {
                                    const date = new Date(recommend.createDate);
                                    const dateStr =
                                        moment(date).format("YYYY년MM월DD일");
                                    return (
                                        <SwiperSlide
                                            key={"recommondSlide-" + index}
                                        >
                                            <li>
                                                <a
                                                    onClick={() => {
                                                        navigate(
                                                            `/dolDetail/${recommend.mainLearaningId}`
                                                        );
                                                        window.scrollTo(0, 0);
                                                    }}
                                                >
                                                    <div className="dol-img">
                                                        {/* <img src={recommend.imgFile} alt={recommend.learningId} /> */}
                                                        <img
                                                            src={
                                                                macview_detail_01
                                                            }
                                                            alt={
                                                                recommend.mainLearaningId
                                                            }
                                                        />
                                                    </div>
                                                    <div className="dol-cont">
                                                        <h3>
                                                            {
                                                                recommend.mainLearningName
                                                            }
                                                        </h3>
                                                        <h4>
                                                            {recommend.content}{" "}
                                                            Lorem ipsum dolor
                                                            sit, amet
                                                            consectetur
                                                            adipisicing elit.
                                                            Facilis non iusto,
                                                            distinctio suscipit,
                                                            error necessitatibus
                                                            voluptas magni quasi
                                                            odit, quia
                                                            voluptatibus rem.
                                                            Quia doloremque illo
                                                            animi nemo natus.
                                                            Cupiditate,
                                                            voluptate?
                                                        </h4>
                                                        <p>
                                                            <strong>
                                                                {
                                                                    recommend.memberName
                                                                }
                                                            </strong>{" "}
                                                            |
                                                            <span>
                                                                {dateStr}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </a>
                                            </li>
                                        </SwiperSlide>
                                    );
                                })}
                            </Swiper>
                        </ul>
                    </div>
                </section>
            </main>
        </>
    );
}
