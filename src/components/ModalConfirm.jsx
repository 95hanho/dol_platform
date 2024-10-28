import { useEffect, useRef } from "react";
import { uiModal } from "../compositions/ui";
import { useDispatch, useSelector } from "react-redux";

export default function ModalConfirm() {
  const dispatch = useDispatch();
  const modalOn = useSelector((state) => state.modal.modal_confirm);
  const modalTxt = useSelector((state) => state.modal.modal_confirm_txt);
  const modalSet = useSelector((state) => state.modal.modal_confirm_set);
  const modalEle = useRef(null);

  useEffect(() => {
    if (modalOn) uiModal.open(modalEle.current);
    else uiModal.close(modalEle.current);
  }, [modalOn]);
  return (
    <>
      <div className="modal" ref={modalEle}>
        <div
          className="modal-background"
          onClick={() => dispatch({ type: "modal/off_modal_confirm" })}
        ></div>
        <div className="modal-board">
          <div className="modal-content">
            <div className="modal-title">알림창</div>
            <div className="modal-con">
              <p dangerouslySetInnerHTML={{ __html: modalTxt }}></p>
            </div>
            <div className="modal-btn_wrap">
              <button
                type="button"
                className="modal_close"
                onClick={() => {
                  dispatch({ type: "modal/off_modal_confirm" });
                }}
              >
                닫기
              </button>
            </div>
            <div className="modal-confirm">
              <button
                className="on"
                onClick={() => {
                  dispatch({
                    type: "modal/check_modal_confirm",
                    payload: modalSet,
                  });
                }}
              >
                확인
              </button>
              <span></span>
              <button
                className="off"
                onClick={() => dispatch({ type: "modal/off_modal_confirm" })}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
