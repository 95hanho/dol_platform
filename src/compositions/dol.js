import { get_normal, post_formData, post_urlFormData } from "./apiDoc";

// 카테고리 조회
export const getCategorys = () => get_normal("/api/category/EXPT");
// dol등록
export const learningCreate = (dol) => post_formData("/api/learning/main", dol);
// dol수정
export const learningModify = (dol) => post_formData(`/api/learning`, dol);
// 추천 dol조회
export const getRecommend = (headers) =>
    get_normal("/api/learning/recommend", undefined, headers);
// dol참여신청
export const dolJoin = (dolNum) => post_urlFormData(`/api/learning/${dolNum}`);
// dol상세조회
export const getDol = (dolNum) => get_normal(`/api/learning/${dolNum}`);
// dol관심추가/취소
export const dolInterest = (dolNum) =>
    post_urlFormData(`/api/learning/${dolNum}/interest`);
// dol 공지 조회
export const getNotices = (dolNum, meetNum) =>
    get_normal(`/api/learning/${dolNum}/${meetNum}/opinion`, {
        type: "NOTICE",
    });
// dol 댓글 조회
export const getComments = (dolNum, meetNum) =>
    get_normal(`/api/learning/${dolNum}/${meetNum}/opinion`, {
        type: "COMMENT",
    });
// dol 공지/댓글 등록
export const setNoticeComment = (dolNum, meetNum, obj) =>
    post_urlFormData(`/api/learning/${dolNum}/${meetNum}/opinion`, obj);
// meeting상세조회
export const getMeeting = (dolNum, meetId) => {
    console.log(dolNum, meetId);
    return get_normal(`/api/learning/${dolNum}/${meetId}`);
};
// meeting등록
export const meetingCreate = (json) =>
    post_formData("/api/learning/meeting", json);
// dol월스케줄 조회
export const scheduleMonth = (year, month) =>
    get_normal(`/api/learning/schedule?year=${year}&month=${month}`);
