import { useEffect, useRef } from "react";
import { uiModal } from "../compositions/ui";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function ModalLogout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const modalOn = useSelector((state) => state.modal.modal_logout);
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
          onClick={() => dispatch({ type: "modal/off_modal_logout" })}
        ></div>
        <div className="modal-board">
          <div className="modal-content">
            <div className="modal-title">알림창</div>
            <div className="modal-con">
              <p>로그아웃하시겠습니까??</p>
            </div>
            <div className="modal-btn_wrap">
              <button
                type="button"
                className="modal_close"
                onClick={() => {
                  dispatch({ type: "modal/off_modal_logout" });
                }}
              >
                닫기
              </button>
            </div>
            <div className="modal-confirm">
              <button
                className="on"
                onClick={() => {
                  dispatch({ type: "modal/off_modal_logout" });
                  dispatch({ type: "login/logout" });
                  dispatch({ type: "user/resetUserInfo" });
                  navigate("/");
                }}
              >
                확인
              </button>
              <span></span>
              <button
                className="off"
                onClick={() => dispatch({ type: "modal/off_modal_logout" })}
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
