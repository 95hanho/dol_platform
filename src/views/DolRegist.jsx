import { useEffect, useRef, useState } from "react";
import { getCategorys, learningCreate } from "../compositions/dol";
import Header from "../components/Header";
import Nav from "../components/Nav";
import { uiDol } from "../compositions/ui";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "../compositions/user";
import { useNavigate } from "react-router-dom";

export default function DolRegist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loding = useSelector((state) => state.loding.ing);

  // dol등록 obj
  const [dol, setDol] = useState({
    learningName: "", // DoL이름
    content: "", // 내용
    keyword: "", // 태그내용
    imageFile: null, // 대표이미지 1개
    learningFile: [], // 학습자료 여러파일
    categoryId: "", // 카테고리아이디
    private: true,
  });
  // dol Ele
  const dolRef = {
    learningName: useRef(null),
    content: useRef(null),
    keyword: useRef(null),
    imageFile: useRef(null),
    learningFile: useRef(null),
  };
  // 키워드 textarea on off
  const [keywordOn, setKeywordOn] = useState(false);
  // 키워드 리스트
  const [keywordList, setKeywordList] = useState([]);
  // 키워드 설명문
  const [keywordExplain, setKeywordExplain] = useState(false);
  // 대표이미지 프리뷰 src
  const [imageFile, setImageFile] = useState("");
  // 소개자료 리스트
  const [introFileList, setIntroFileList] = useState([]);
  // 카테고리 리스트
  const [cateList, setCateList] = useState([]);

  // dol state 변경
  const changeDol = (e) => {
    setDol({
      ...dol,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "keyword") {
      const list = e.target.value.split("#").reduce((acc, cur) => {
        const emptyIndex = cur.indexOf(" ");
        const regex =
          /^[^!@#$%^&*+<>?\\|]*([가-힣]{2,}|[a-zA-Z]{3,})[^!@#$%^&*+<>?\\|]*$/;
        let txt = cur;
        if (emptyIndex !== -1) {
          txt = cur.substring(0, emptyIndex);
        }
        if (regex.test(txt)) {
          if (!acc.includes(txt)) acc.push(txt);
        }
        return acc;
      }, []);
      setKeywordList(list);
    }
  };
  // 태그 클릭 시
  const keywordView = (e) => {
    setKeywordOn(true);

    setTimeout(() => {
      dolRef.keyword.current.focus();
      // const length = dol.keyword.length;
      // dolRef.keyword.current.setSelectionRange(length, length);
    }, 500);
    setTimeout(() => {
      uiDol.clickAtPosition(e.pageX, e.pageY);
    }, 1000);
  };
  // 태그 input결과 html
  const tagResult = () => {
    let result = keywordList.map((v, i) => {
      if (i === 0) {
        return <font key={v + i}>#{v}</font>;
      } else {
        return (
          <font key={v + i + "b"}>
            <span></span>#{v}
          </font>
        );
      }
    });
    return result;
  };
  // 대표이미지 변경
  const imageFileChange = () => {
    const files = dolRef.imageFile.current.files;
    setDol({
      ...dol,
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
  // 소개자료 추가
  const learningFileChange = () => {
    const files = dolRef.learningFile.current.files;
    setDol({
      ...dol,
      learningFile: files,
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
  // dol등록 Before
  const learningCreateBefore = (e) => {
    e.preventDefault();
    console.log(dol);
    console.log("learningCreateBefore");

    if (dol.learningName.length < 2) {
      dispatch({
        type: "modal/on_modal_alert",
        payload: "Dol이름을 입력해주세요.",
      });
      dolRef.learningName.current.focus();
    } else if (!dol.content.length) {
      dispatch({
        type: "modal/on_modal_alert",
        payload: "Dol내용을 입력해주세요.",
      });
      dolRef.content.current.focus();
    } else if (!dol.imageFile) {
      dispatch({
        type: "modal/on_modal_alert",
        payload: "대표이미지를 올려주세요.",
      });
    } else if (dol.learningFile.length > 5) {
      dispatch({
        type: "modal/on_modal_alert",
        payload: "최대 파일 수는 5개로 제한됩니다.",
      });
    } else if (!dol.categoryId) {
      dispatch({
        type: "modal/on_modal_alert",
        payload: "카테고리를 선택해주세요.",
      });
    } else {
      if (loding) return;
      dispatch({ type: "loding/lodingOn" });
      learningCreate({
        mainLearningName: dol.learningName,
        content: dol.content,
        keyword: keywordList, // 키워드 리스트
        imageFile: dol.imageFile, // 대표이미지 1개
        mainLearningFile: dol.learningFile, // 학습자료 여러파일
        categoryId: dol.categoryId, // 카테고리아이디
        status: dol.private ? "PRIVATE" : "PUBLIC", // 공개비공개 여부
      }).then(({ data }) => {
        console.log(data);
        dispatch({
          type: "modal/on_modal_alert",
          payload: "dol등록에 성공하였습니다.",
        });
        navigate(`/dolDetail/${data.data.mainLearningId}`);
      });
    }
  };

  useEffect(() => {
    uiDol.registInit();
    if (imageFile) setTimeout(() => uiDol.registInit2(), 200);
  }, [imageFile]);
  useEffect(() => {
    async function init() {
      await getUserInfo();
      await getCategorys().then(({ data }) => {
        setCateList(data.data);
      });
    }
    init();
  }, []);

  return (
    <>
      <Header backUse={true} title={"DoL등록"} notMainBtn={true} />
      <Nav />
      <main id="dolRegist">
        <form onSubmit={learningCreateBefore}>
          <section className="title-space">
            <input
              type="text"
              placeholder="DoL이름"
              name="learningName"
              value={dol.learningName}
              onChange={changeDol}
              ref={dolRef.learningName}
            />
            <textarea
              cols="30"
              rows="8"
              placeholder="내용을 입력하세요."
              name="content"
              value={dol.content}
              onChange={changeDol}
              ref={dolRef.content}
            ></textarea>
            {keywordOn ? (
              <textarea
                cols="10"
                placeholder="#키워드 작성 후 Space bar를 눌러주세요."
                name="keyword"
                value={dol.keyword}
                onChange={(e) => changeDol(e)}
                ref={dolRef.keyword}
                onFocus={() => setKeywordExplain(true)}
                onBlur={() => {
                  setKeywordExplain(false);
                  setKeywordOn(false);
                }}
              ></textarea>
            ) : (
              <button
                type="button"
                className="tag-result"
                onClick={keywordView}
                style={{ color: !keywordList.length ? "#cacaca" : undefined }}
              >
                {!keywordList.length
                  ? "해시태그 키워드를 입력해주세요."
                  : tagResult()}
                {/* <font>#신입</font>
                <span></span>
                <font>#exc</font> */}
              </button>
            )}
            {keywordExplain ? (
              <p className="c_red">
                ※ '#키워드'로 적고 공백으로 나눠주세요. <br />
                한글은 2글자, 영문은 3글자이상 가능
              </p>
            ) : undefined}
          </section>
          <section className="file-space">
            <div>
              <label htmlFor="mainImg">
                <span className="material-symbols-outlined">
                  {" "}
                  photo_library{" "}
                </span>
                대표이미지
              </label>
              <input
                type="file"
                id="mainImg"
                accept="image/*"
                className="inFile"
                ref={dolRef.imageFile}
                onChange={imageFileChange}
              />
            </div>
            <div>
              <label htmlFor="introFile">
                <span className="material-symbols-outlined"> download </span>
                소개자료
              </label>
              <input
                type="file"
                className="inFile"
                id="introFile"
                ref={dolRef.learningFile}
                multiple
                onChange={learningFileChange}
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
          <section className="detail-space">
            <div>
              <span className="cate-span">카테고리</span>
              <select
                className="cate-select"
                name="categoryId"
                value={dol.categoryId}
                onChange={changeDol}
              >
                <option value={""}>카테고리를 선택해주세요.</option>
                {cateList.map((v) => (
                  <option key={v.categoryId} value={v.categoryId}>
                    {v.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div className="private">
              <span>공개여부</span>
              <div className="wrapper">
                <div className="onoffBtnDiv">
                  <input
                    type="checkbox"
                    id="switch"
                    name="private"
                    className="onf_checkbox"
                    value={dol.private}
                    onChange={(e) => {
                      setDol({
                        ...dol,
                        private: !dol.private,
                      });
                    }}
                  />
                  <label htmlFor="switch" className="switch_label">
                    <span className="onf_btn"></span>
                    <span
                      className={`onf_txt ${dol.private ? "c_red" : "c_green"}`}
                    >
                      {dol.private ? "비공개" : "공개"}
                    </span>
                  </label>
                </div>
              </div>
            </div>
            <p className="c_red">
              {!dol.private
                ? ""
                : "* 비공개 시 참여자를 제외하고 DoL소개만 볼 수 있으며, 소개자료를 제외한 자료의 다운로드가 제한됩니다."}
            </p>
          </section>
          <section className="submit-space">
            <input type="submit" value="저장" />
          </section>
        </form>
      </main>
    </>
  );
}
