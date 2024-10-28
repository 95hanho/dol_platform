import { Route, Routes, HashRouter } from "react-router-dom";
import Footer from "./components/Footer";
import Login from "./views/Login";
import Home from "./views/Home";
import DolRegist from "./views/DolRegist";
import DolDetail from "./views/DolDetail";
import Join from "./views/Join";
import JoinIdFind from "./views/JoInIdFind";
import JoinPwdFind from "./views/JoinPwdFind";
import Modal from "./components/Modal";
import ModalLogout from "./components/ModalLogout";
import JoinPwdChange from "./views/JoinPwdChange";
import { AxiosInterceptor } from "./util/AxiosInterceptor";
import DolView from "./views/DolView";
import Schedule from "./views/Schedule";
import MyPage from "./views/MyPage";
import DolModify from "./views/DolModify";
import ModalConfirm from "./components/ModalConfirm";
import DolMeetingReg from "./views/DolMeetingReg";
import DolMeeting from "./views/DolMeeting";
import MyPagePwdChange from "./views/MyPagePwdChnage";
import ModalInterest from "./components/ModalInterest";
import MyPageModify from "./views/MyPageModify";
import DolMeetingModify from "./views/DolMeetingModify";
import DolInterest from "./views/DolInterest";
import NotPage from "./views/NotPage";

function App() {
  console.log("App");

  return (
    <>
      <div id="wrap">
        <HashRouter>
          <AxiosInterceptor>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/join" element={<Join />} />
              <Route path="/join/idFind" element={<JoinIdFind />} />
              <Route path="/join/passwordFind" element={<JoinPwdFind />} />
              <Route path="/join/passwordChange" element={<JoinPwdChange />} />
              <Route path="/home" element={<Home />} />
              <Route path="/dolView" element={<DolView />} />
              <Route path="/dolDetail/:dolNum" element={<DolDetail />} />
              <Route path="/dolDetail/:dolNum/:meetNum" element={<DolMeeting />} />
              <Route path="/dolModify/:dolNum" element={<DolModify />} />
              <Route path="/dolModify/:dolNum/:meetNum" element={<DolMeetingModify />} />
              <Route path="/dolMeetingRegist/:dolNum" element={<DolMeetingReg />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/dolRegist" element={<DolRegist />} />
              <Route path="/interest" element={<DolInterest />} />
              <Route path="/myPage" element={<MyPage />} />
              <Route path="/myPage/modify" element={<MyPageModify />} />
              <Route path="/myPage/passwordChange" element={<MyPagePwdChange />} />
              <Route path="/*" element={<NotPage />} />
            </Routes>
          </AxiosInterceptor>
          <Modal />
          <ModalLogout />
          <ModalConfirm />
          <ModalInterest />
          <Footer />
        </HashRouter>
      </div>
    </>
  );
}

export default App;
