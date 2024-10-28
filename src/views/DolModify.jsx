import { useEffect, useRef, useState } from "react";
import {
  getCategorys,
  getDol,
  learningCreate,
  learningModify,
} from "../compositions/dol";
import macview_detail_01 from "~/assets/images/macview_detail_01.png";
import ico_page_top from "~/assets/images/ico_page_top.png";
import Header from "../components/Header";
import Nav from "../components/Nav";
import { uiDol } from "../compositions/ui";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "../compositions/user";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function DolModify() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loding = useSelector((state) => state.loding.ing);
  const modal_result = useSelector((state) => state.modal.modal_confirm_result);
  const curLoginId = useSelector((state) => state.user.loginId);
  const { dolNum } = useParams();

  // dol등록 obj
  const [dol, setDol] = useState({
    mainLearningName: "", // DoL이름,
    content: "", // 내용
    keyword: "", // 태그내용
    imageFile: "", // 대표이미지 1개
    learningFile: [], // 학습자료 여러파일
    categoryId: "", // 카테고리아이디
    private: true,
    loginId: "",
    mainLearningId: "",
  });
  // dol Ele
  const dolRef = {
    mainLearningName: useRef(null),
    content: useRef(null),
    keyword: useRef(null),
    imageFile: useRef(null),
    learningFile: useRef(null),
  };
  // 키워드 textarea on off
  const [keywordOn, setKeywordOn] = useState(false);
  // 키워드 리스트
  const [keywordList, setKeywordList] = useState([]);
  // 저장된 키워드
  const [storedKeyword, setStoredKeyword] = useState([]);
  // 키워드 설명문
  const [keywordExplain, setKeywordExplain] = useState(false);
  // 저장된 대표이미지
  const [storedImage, setStoredImage] = useState(null);
  // 대표이미지 프리뷰 src
  const [imageFile, setImageFile] = useState(null);
  // 소개자료 리스트
  const [introFileList, setIntroFileList] = useState([]);
  // 저장돼있던 파일 리스트
  const [storedFiles, setStoredFiles] = useState([]);
  // 삭제할 파일 리스트
  const [deleteFiles, setDeleteFiles] = useState([]);
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
          acc.push(txt);
        }
        return acc;
      }, []);
      setKeywordList(list);
    }
  };
  // tag클릭시
  const keywordView = () => {
    setKeywordOn(true);
    setTimeout(() => {
      const length = dol.keyword.length;
      dolRef.keyword.current.focus();
      dolRef.keyword.current.setSelectionRange(length, length);
    }, 50);
  };
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
    console.log("imageFileChange");
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
  // 저장 자료 삭제할껀지 말껀지
  const deleteHTML = (fId) => {
    if (deleteFiles.includes(fId)) {
      return (
        <a className="cancel" onClick={() => changedeleteFiles(false, fId)}>
          취소
        </a>
      );
    } else {
      return (
        <a className="delete" onClick={() => changedeleteFiles(true, fId)}>
          <span className="material-symbols-outlined"> close </span>
        </a>
      );
    }
  };
  // 삭제파일 리스트 추가/삭제
  const changedeleteFiles = (state, fileId) => {
    if (state) deleteFiles.push(fileId);
    else deleteFiles.splice(deleteFiles.indexOf(), 1);
    setDeleteFiles([...deleteFiles]);
  };
  // dol등록 Before
  const learningCreateBefore = (e) => {
    console.log("learningCreateBefore");
    e.preventDefault();

    if (dol.mainLearningName.length < 2) {
      dispatch({
        type: "modal/on_modal_alert",
        payload: "Dol이름을 입력해주세요.",
      });
      dolRef.mainLearningName.current.focus();
    } else if (!dol.content.length) {
      dispatch({
        type: "modal/on_modal_alert",
        payload: "Dol내용을 입력해주세요.",
      });
      dolRef.content.current.focus();
    } else if (
      dol.learningFile.length + storedFiles.length - deleteFiles.length >
      5
    ) {
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

      const deleteKeyword = [];
      const storeKeyNames = storedKeyword.map((v) => {
        if (!keywordList.includes(v.keyword)) deleteKeyword.push(v.keywordId);
        return v.keyword;
      });
      const inputKeywords = keywordList.filter((v) => {
        if (storeKeyNames.includes(v)) return false;
        return true;
      });
      learningModify({
        mainLearningId: dol.mainLearningId,
        mainLearningName: dol.mainLearningName,
        content: dol.content,
        keyword: inputKeywords,
        deleteKeyword,
        imageFile: dol.imageFile,
        learningFile: dol.learningFile,
        deleteFiles,
        categoryId: dol.categoryId,
        status: dol.private ? "PRIVATE" : "PUBLIC",
      }).then(({ data }) => {
        console.log(data);
        dispatch({
          type: "modal/on_modal_alert",
          payload: "dol 수정성공!!!",
        });
        navigate(`/dolDetail/${dolNum}`);
      });
    }
  };

  // 이미지파일 변경 시 UI
  useEffect(() => {
    uiDol.registInit();
    if (imageFile || storedImage) setTimeout(() => uiDol.registInit2(), 200);
  }, [imageFile, storedImage]);
  // dol삭제 버튼 수락 시
  useEffect(() => {
    if (modal_result === "dolDelete") {
      console.log("dolDelete");
    }
  }, [modal_result]);
  // 페이지 유저인증
  useEffect(() => {
    if (curLoginId && dol.loginId) {
      if (curLoginId !== dol.loginId) {
        dispatch({
          type: "modal/on_modal_alert",
          payload: "잘못된 접근입니다.",
        });
        navigate(`/dolDetail/${dolNum}`);
      }
    }
  }, [curLoginId, dol.loginId]);

  // 기본실행 시
  useEffect(() => {
    async function init() {
      await getUserInfo();
      await getCategorys().then(({ data }) => {
        setCateList(data.data);
      });
      await getDol(dolNum).then(({ data }) => {
        console.log("getDol", data.data);
        let str = "";
        setStoredKeyword(data.data.keyword);
        const list = [];
        data.data.keyword.map((v) => {
          str += "#" + v.keyword + " ";
          list.push(v.keyword);
        });
        data.data.keyword = str;
        setKeywordList(list);
        setDol({
          ...dol,
          mainLearningName: data.data.mainLearningName,
          content: data.data.content,
          keyword: data.data.keyword,
          categoryId: data.data.category.categoryId,
          loginId: data.data.loginId,
          private: data.data.status === "PRIVATE" ? true : false,
          mainLearningId: data.data.mainLearningId,
        });
        // setStoredImage(data.data.imgFile.tempFileName);
        /* TEST */
        setStoredImage(ico_page_top);
        /* TEST */

        setStoredFiles(data.data.learningFiles);
      });
    }
    init();
  }, [location.pathname]);

  return (
    <>
      <Header backUse={true} title={"DoL 관리&수정"} />
      <Nav />
      <main id="dolRegist">
        <form onSubmit={learningCreateBefore}>
          <section className="title-space">
            <input
              type="text"
              placeholder="DoL이름"
              name="mainLearningName"
              value={dol.mainLearningName}
              onChange={changeDol}
              ref={dolRef.mainLearningName}
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
                onChange={(e) => {
                  changeDol(e);
                }}
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
              >
                {tagResult()}
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
              {imageFile ? (
                <a
                  className="c_red"
                  onClick={() => {
                    setImageFile(null);
                    setDol({
                      ...dol,
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
                ref={dolRef.imageFile}
                onChange={imageFileChange}
              />
            </div>
            <div>
              <label htmlFor="introFile">
                <span className="material-symbols-outlined"> download </span>
                소개자료추가
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
              <div className="preview">
                <img
                  id="mainImage"
                  // style={{
                  //   width: imageFile ? undefined : "auto",
                  //   height: imageFile ? undefined : "auto",
                  // }}
                  src={imageFile ? imageFile : storedImage}
                  alt=""
                />
              </div>
            </div>
            <div>
              {introFileList.length > 0 || storedFiles.length > 0 ? (
                <div className="intro-file">
                  <ul>
                    {storedFiles.map((v) => (
                      <li key={"storedFiles" + v.fileId}>
                        <a className="fileview">{v.fileName}</a>
                        {deleteHTML(v.fileId)}
                      </li>
                    ))}
                    {introFileList}
                  </ul>
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
                <option value="">카테고리를 선택해주세요.</option>
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
                    checked={!dol.private}
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
          <section className="dol-remove">
            <button
              type="button"
              onClick={() =>
                dispatch({
                  type: "modal/on_modal_confirm",
                  payload: {
                    txt: "정말 삭제하시겠습니까??<br />삭제 시 텍스트와 자료들은 사라집니다.",
                    set: "dolDelete",
                  },
                })
              }
            >
              DoL삭제하기
            </button>
          </section>
        </form>
      </main>
    </>
  );
}
