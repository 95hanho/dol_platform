import Header from "../components/Header";
import Nav from "../components/Nav";
import { useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { getUserInfo } from "../compositions/user";
import moment from "moment/moment";
import macview_detail_01 from "~/assets/images/macview_detail_01.png";
import { scheduleMonth } from "../compositions/dol";

export default function Schedule() {
  const test = (a, b, c) => {
    console.log(a, b, c);
  };

  const [clickDay, setClickDay] = useState(new Date());
  const [meetings, setMeetings] = useState([]);

  const [viewMeetings, setViewMeetings] = useState([]);

  const now = new Date();
  now.setHours(0);
  now.setMinutes(0);
  now.setSeconds(0);
  const fiveBeforeDate = new Date(now.getTime());
  const fiveAfterDate = new Date(now.getTime());
  fiveBeforeDate.setDate(now.getDate() - 5);
  fiveAfterDate.setDate(now.getDate() + 6);
  let meetingIndex = 0;

  const sDateList = useMemo(() => {
    return meetings.map(({ startTime }) =>
      moment(startTime).format("YYYYMMDD")
    );
  }, [meetings]);

  // 회의레벨 나누기 1 : 빨강, 2:엹은 빨강, 3 : 주황, 4 : 엹은 주황
  // 주황 #EDA900 237 169 0  5일 초과
  // 빨강 #FF7E7E 255 126 126 5일 이내
  const meetingRank = (date) => {
    meetings[meetingIndex].startTime;
  };

  // const test1 = new Date("2023-10-27T16:23:57.108Z");
  // const test2 = new Date("2023-10-20T04:23:57.108Z");
  // console.log(test1, test2);
  // console.log((test1 - test2) / 1000 / 3600 / 24); // 일 수 차이 공식

  // console.log(new Date().toISOString()); // 2023-10-31T04:23:57.108Z
  // console.log(new Date().toUTCString()); // Tue, 31 Oct 2023 04:23:57 GMT
  // console.log(new Date().toJSON()); // 2023-10-31T04:23:57.108Z
  // console.log(new Date().toDateString()); // Tue Oct 31 2023
  // console.log(new Date().toLocaleDateString()); // 2023. 10. 31.
  // console.log(new Date().toLocaleTimeString()); // 오후 1:23:57
  // console.log(new Date().toLocaleString()); // 2023. 10. 31. 오후 1:23:57

  // 숫자로만 일 표시
  const dayformatChange = (a, date) => date.getDate();

  // 회의 날에 표시해줄 span추가
  const tileContent = ({ date, view }) => {
    const dateStr = moment(date).format("YYYYMMDD");
    if (sDateList.includes(dateStr) && view === "month")
      return <span>회의있는 날 표시</span>;
  };
  // 회의 날에 css적용
  const dayStyle = ({ date, view, activeStartDate }) => {
    const dateStr = moment(date).format("YYYYMMDD");
    if (sDateList.includes(dateStr) && view === "month") {
      if (fiveBeforeDate <= date && date < fiveAfterDate) {
        if (activeStartDate.getMonth() !== date.getMonth())
          return "meetingDay bc-3";
        else return "meetingDay bc-2";
      } else {
        if (activeStartDate.getMonth() !== date.getMonth())
          return "meetingDay bc-1";
        else return "meetingDay";
      }
    } else return null;
  };
  // 월 클릭 시
  const viewChange = ({ view, activeStartDate }) => {
    console.log("clickMonth");
    if (view === "month") {
      scheduleMonth(
        activeStartDate.getFullYear(),
        activeStartDate.getMonth() + 1
      ).then(({ data }) => setMeetings([...data.data]));
    }
  };
  // 날짜 클릭 시
  useEffect(() => {
    if (meetings.length) {
      const dateStr = moment(clickDay).format("YYYYMMDD");
      setViewMeetings(
        meetings.filter(({ startTime }) => {
          const meetDateStr = moment(startTime).format("YYYYMMDD");
          if (dateStr === meetDateStr) return true;
          return false;
        })
      );
      console.log(viewMeetings);
    }
  }, [clickDay]);
  // 일반
  useEffect(() => {
    async function init() {
      await getUserInfo();
      // 처음 달의 스케줄 가져오기
      await scheduleMonth(now.getFullYear(), now.getMonth() + 1).then(
        ({ data }) => {
          console.log(data);
          setMeetings([...data.data]);
        }
      );
    }
    init();
  }, []);

  /* 테스트 start */
  useEffect(() => {
    console.log(meetings);
  }, [meetings]);
  /* 테스트 end */

  return (
    <>
      <Header backUse={true} title={"DoL 일정"} />
      <Nav />
      <main id="dol-schedule">
        <section className="calendar">
          <Calendar
            onChange={setClickDay}
            value={clickDay}
            formatDay={dayformatChange}
            tileClassName={dayStyle}
            tileContent={tileContent}
            // onClickMonth={test}
            // onViewChange={test}
            onActiveStartDateChange={viewChange}
          />
        </section>
        <hr />
        <section className="plan-info">
          {/* <h2>
            {viewMeetings.map((meeting) => (
              <p key={meeting.startTime}>{meeting.startTime}</p>
            ))}
          </h2> */}
          <div className="title">
            <h2>회의일정</h2>
            <p>{moment(clickDay).format("YYYY-MM-DD")}</p>
          </div>
          <div className="meetinglist">
            {viewMeetings.length === 0 ? (
              <p className="align_center">현재 날짜에 일정이 없습니다</p>
            ) : (
              <div className="meet">
                {viewMeetings.map((meeting, index) => {
                  moment.locale("en");
                  return (
                    <a key={"meeting" + index}>
                      <div className="meetImage">
                        <img src={macview_detail_01} alt="" />
                      </div>
                      <div className="content">
                        {/* 제목, 내용, 일시, 시작시간, 끝시간 */}
                        <h3>hrm의 이해토론하기</h3>
                        <p>{meeting.content}</p>
                        <p>
                          <strong>{meeting.memberName}</strong> |{" "}
                          <span>
                            {moment(meeting.startTime).format("YYYY.MM.DD")}
                          </span>{" "}
                          <span>
                            {moment(meeting.startTime).format("LT")} ~{" "}
                            {moment(meeting.startTime).format("LT")}
                          </span>
                        </p>
                        <p>비전룸</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
