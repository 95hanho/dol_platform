import axios from "axios";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCookie } from "../cookies";
import { useDispatch, useSelector } from "react-redux";
import { tokenReissue } from "../compositions/user";

const instance = axios.create({
    baseURL: "http://localhost:9238",
});

const AxiosInterceptor = ({ children }) => {
    // console.log("AxiosInterceptor");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const loginId = useSelector((state) => state.user.loginId);

    const notLoginPath = [
        "/",
        "/join",
        "/join/idFind",
        "/join/passwordFind",
        "/join/passwordChange",
    ];

    const notTokenCheckUrl = [
        // 유저정보조회
        // "/api/members/memberByToken",
        // 토큰재발급
        "/api/members/token post",
    ];

    // 요청 성공
    const requestFulfill = async (res) => {
        // console.log(res);
        // console.log(location.pathname, "->", res.url);
        // console.log(res.url, res.data ? res.data : "");

        // 로그인필요한 페이지에서
        if (
            !notLoginPath.includes(location.pathname) &&
            !notTokenCheckUrl.includes(res.url + " " + res.method)
        ) {
            const aToken = getCookie("accessToken");
            const rToken = getCookie("refreshToken");
            if (!rToken) {
                navigate("/");
                dispatch({ type: "login/logout" });
                dispatch({
                    type: "modal/on_modal_alert",
                    payload: "로그아웃되었습니다.",
                });
                return;
            } else if (!aToken && rToken) {
                await tokenReissue({ refreshToken: "Bearer " + rToken }).then(
                    ({ data }) => {
                        dispatch({
                            type: "login/setToken",
                            payload: {
                                accessToken: data.data.accessToken,
                                refreshToken: data.data.refreshToken,
                            },
                        });
                    }
                );
            }
            res.headers.Authorization = "Bearer " + getCookie("accessToken");
        }

        return res;
    };
    // 요청 에러
    const requestReject = (err) => {
        console.log(err.message + "--->>>" + err.config.url);
        dispatch({
            type: "modal/on_modal_alert",
            payload: "잘못된 요청입니다.",
        });
        return Promise.reject(err);
    };
    // 응답 성공
    const responseFulfill = (res) => {
        dispatch({ type: "loding/lodingOff" });
        // console.log(res.config.method);

        // 유저정보저장
        if (
            res.config.method === "get" &&
            res.config.url === "/api/members/token" &&
            !loginId
        ) {
            dispatch({
                type: "user/setUserInfo",
                payload: res.data.data,
            });
        }
        return res;
    };
    // 응답 에러
    const responseReject = (err) => {
        console.log(err);
        dispatch({ type: "loding/lodingOff" });
        console.log(err.message + "--->>>" + err.config.url);
        if (500 <= err.response.status && err.response.status < 600) {
            dispatch({
                type: "modal/on_modal_alert",
                payload: "서버 에러 발생 새로고침 후 이용해 주세요.",
            });
        }
        // 토큰이 유효하지 않은경우 -> 로그아웃시키기
        if (err.response.data.res_code === 401) {
            navigate("/");
            dispatch({ type: "login/logout" });
            dispatch({
                type: "modal/on_modal_alert",
                payload: "로그아웃되었습니다.",
            });
            return;
        }
        return Promise.reject(err);
    };

    const requestInterceptors = instance.interceptors.request.use(
        requestFulfill,
        requestReject
    );
    const responseInterceptors = instance.interceptors.response.use(
        responseFulfill,
        responseReject
    );

    useEffect(() => {
        return () => {
            instance.interceptors.request.eject(requestInterceptors);
            instance.interceptors.response.eject(responseInterceptors);
        };
    }, [location.pathname, loginId]);

    return children;
};

export default instance;
export { AxiosInterceptor };
