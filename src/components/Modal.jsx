import { useEffect, useRef } from "react";
import { uiModal } from "../compositions/ui";
import { useDispatch, useSelector } from "react-redux";

export default function Modal() {
  const dispatch = useDispatch();
  const modalOn = useSelector((state) => state.modal.modal_alert);
  const modalTxt = useSelector((state) => state.modal.modal_alert_txt);
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
          onClick={() => dispatch({ type: "modal/off_modal_alert" })}
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
                onClick={() => dispatch({ type: "modal/off_modal_alert" })}
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
