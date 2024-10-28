/*  */
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../compositions/user";
import { getCategorys } from "../compositions/dol";
import Header from "../components/Header";
import Nav from "../components/Nav";

import macview_detail_01 from "~/assets/images/macview_detail_01.png";

export default function DolInterest() {
    console.log("DolInterest");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        // console.log("home open");
        async function init() {
            await getUserInfo();
            await getCategorys().then(({ data }) => {
                console.log(data);
                setCategoryList(data.data);
            });
        }
        init();
    }, []);

    return (
        <>
            <Header
                backUse={true}
                title={"<font style='font-size:30px;'>관심 DoL</font>"}
            />
            <Nav />
            <main id="dolView">
                <section className="cate">
                    <h2>DoL 카테고리</h2>
                    <ul className="dol-list">
                        <li>
                            <a href="#">
                                <div className="dol-img">
                                    <img src={macview_detail_01} alt="" />
                                </div>
                                <div className="dol-cont">
                                    <h3>HRD의 이해</h3>
                                    <h4>
                                        HR에 대한 이해를 바탕으로 조직에서의
                                        HRD의 의미와 여러 방법들을 소개하는
                                        DoL입니다.
                                    </h4>
                                    <p>
                                        <strong>김이름</strong> |{" "}
                                        <span>2023년06월01일</span>
                                    </p>
                                </div>
                            </a>
                        </li>
                    </ul>
                    <div className="dol-seeMore">
                        <a href="#">
                            <hr />
                            <p>+더보기</p>
                        </a>
                    </div>
                </section>
            </main>
        </>
    );
}
