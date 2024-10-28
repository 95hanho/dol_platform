import { useEffect, useRef, useState } from "react";
import { uiModal } from "../compositions/ui";
import { useDispatch, useSelector } from "react-redux";
import { getCategorys } from "../compositions/dol";
import { storeInterest } from "../compositions/user";

export default function ModalInterest() {
  const dispatch = useDispatch();
  const modalOn = useSelector((state) => state.modal.modal_interest);
  const joinOn = useSelector((state) => state.modal.modal_interest_join);
  const categoryIdList = useSelector((state) => state.user.categoryIdList);

  const modalEle = useRef(null);
  const [categoryList, setCategoryList] = useState([]);
  let [allCategoryIds, setAllCategoryIds] = useState([]);

  const [checkedList, setCheckedList] = useState([]);

  useEffect(() => {
    if (modalOn) {
      uiModal.open(modalEle.current);
      getCategorys().then(({ data }) => {
        setCategoryList(data.data);
        const allCateIds = data.data.map((v) => v.categoryId);
        const list = new Array(data.data.length).fill(false);
        categoryIdList.map((v) => {
          const index = allCateIds.indexOf(v);
          list[index] = true;
        });
        setCheckedList([...list]);
        setAllCategoryIds([...allCateIds]);
      });
    } else uiModal.close(modalEle.current);
  }, [modalOn]);
  useEffect(() => {
    uiModal.interestInit();
  }, [allCategoryIds]);

  return (
    <>
      <div className="modal" ref={modalEle}>
        <div
          className="modal-background"
          onClick={() => dispatch({ type: "modal/off_modal_interest" })}
        ></div>
        <div className="modal-board">
          <div className="modal-content">
            <div className="modal-title">
              <p>
                {joinOn
                  ? "회원가입이 완료되었습니다."
                  : "관심있는 카테고리를 선택하여주세요."}
              </p>
            </div>
            <div className="modal-con">
              {joinOn ? "관심있는 카테고리를 선택하여주세요." : ""}
            </div>
            <div className="interest-wrap">
              <div className="modal-interest">
                {categoryList.map((category, i) => (
                  <div className="category" key={category.categoryId}>
                    <label htmlFor={"cate" + i} className="txt">
                      {category.categoryName}
                    </label>
                    <input
                      type="checkbox"
                      id={"cate" + i}
                      defaultChecked={checkedList[i]}
                      className={checkedList[i] ? "checked" : ""}
                      onClick={(e) => {
                        checkedList[i] = !checkedList[i];
                        setCheckedList([...checkedList]);
                      }}
                    />
                    <label htmlFor={"cate" + i}></label>
                  </div>
                ))}
              </div>
            </div>
            <div className="store-btn">
              <button
                onClick={() => {
                  let result = checkedList.reduce((acc, cur, i) => {
                    if (cur) acc.push(allCategoryIds[i]);
                    return acc;
                  }, []);
                  storeInterest(result).then((res) => {});
                  dispatch({ type: "modal/off_modal_interest" });
                }}
              >
                저장
              </button>
            </div>
            <div className="modal-btn_wrap">
              <button
                type="button"
                className="modal_close"
                onClick={() => dispatch({ type: "modal/off_modal_interest" })}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
