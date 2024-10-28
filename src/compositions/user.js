import { get_normal, post_urlFormData } from "./apiDoc";

// 로그인
export const login = (user) => post_urlFormData("/api/members", user);
// 회원가입
export const join = (user) => post_urlFormData("/api/members/join", user);
// 회원정보 수정
export const membModify = (user) => {};
// 아이디중복확인
export const idDuplCheck = (id) => get_normal("/api/members/idCheck", id);
// 팀 조회
export const getDepts = () => get_normal("/api/dept/parentDept/EXPT");
// 팀 상세조회
export const getDeptsDetail = (deptId) => get_normal(`/api/dept/${deptId}`);
// 이메일 인증요청
export const emailAuth = (email) =>
  post_urlFormData("/api/certify/makeCertifyNum", email);
// 이메일 인증확인
export const emailAuthConfirm = (authObj) =>
  post_urlFormData("/api/certify/matchingCertifyNum", authObj);
// 아이디찾기
export const idFind = (authObj) => get_normal("/api/members/loginId", authObj);
// 비밀번호찾기
export const pwdFind = (authObj) =>
  get_normal("/api/members/password", authObj);
// 비밀번호변경완료
export const pwdChange = (pwdObj) =>
  post_urlFormData("/api/members/password", pwdObj);
// 토큰재발급
export const tokenReissue = (rToken) =>
  post_urlFormData("/api/members/token", undefined, rToken);
// 유저정보 가져오기
export const getUserInfo = (aToken) => get_normal("/api/members/token", aToken);
/* 마이페이지 내용들 */
// 비밀번호 변경
// 희망관심사 등록 및 변경
export const storeInterest = (categoryIdList) =>
  post_urlFormData("/api/memberInfo/interest", { categoryIdList });
