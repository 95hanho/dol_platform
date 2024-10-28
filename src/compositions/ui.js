import $ from "jquery";

export const uiDol = {
  // dol상세조회 메인이미지 공간 정사각형만들기
  dolMainImageInit() {
    $("#dolMainImg").css({
      width: "auto",
      height: "auto",
    });
    $("section.preview .dolImg").height($("section.preview .dolImg").width());
    $(window).on("resize", function () {
      $("section.preview .dolImg").height($("section.preview .dolImg").width());
    });
  },
  // dol상세조회 메인이미지 크기맞추기
  dolMainImageInit2() {
    let frameWidth = $("section.preview .dolImg").width();
    let imageWidth = $("#dolMainImg").width();
    let imageHeight = $("#dolMainImg").height();
    if (frameWidth > imageWidth && frameWidth > imageHeight) {
      $("#dolMainImg").css({
        width: imageWidth,
        height: imageHeight,
      });
    } else if (imageWidth > imageHeight) {
      $("#dolMainImg").css({
        width: "100%",
        height: `${(imageHeight / imageWidth) * 100}%`,
      });
    } else {
      $("#dolMainImg").css({
        width: `${(imageWidth / imageHeight) * 100}%`,
        height: "100%",
      });
    }
    setTimeout(() => {
      $("#dolMainImg").show();
    }, 200);
  },
  // dol등록 및 수정 메인이미지 공간 정사각형 만들기
  registInit() {
    $("#mainImage").hide();
    $("#mainImage").css({
      width: "auto",
      height: "auto",
    });
    $(".file-space .preview").height($(".file-space .preview").width());
    $(window).on("resize", function () {
      $(".file-space .preview").height($(".file-space .preview").width());
    });
  },
  // dol등록 및 수정 메인이미지 크기맞추기
  registInit2() {
    let frameWidth = $(".file-space .preview").width();
    let imageWidth = $("#mainImage").width();
    let imageHeight = $("#mainImage").height();
    if (frameWidth > imageWidth && frameWidth > imageHeight) {
      $("#mainImage").css({
        width: imageWidth,
        height: imageHeight,
      });
    } else if (imageWidth > imageHeight) {
      $("#mainImage").css({
        width: "100%",
        height: `${(imageHeight / imageWidth) * 100}%`,
      });
    } else {
      $("#mainImage").css({
        width: `${(imageWidth / imageHeight) * 100}%`,
        height: "100%",
      });
    }
    setTimeout(() => {
      $("#mainImage").show();
    }, 200);
  },
  // dol&meeting 모바일에서 스와이프로 넘기기
  dolMoveSlide(navigate, dolNum, meetNum, maxLength) {
    $("#dolDetail a, #dolDetail img").on("dragstart", function (e) {
      e.preventDefault();
    });

    let touchStart = false;
    let startX = 0;
    let endX = 0;

    $("#dolDetail").on({
      touchstart(e) {
        touchStart = true;
        startX = e.originalEvent.touches[0].pageX;
      },
      touchend(e) {
        if (!touchStart) return;
        touchStart = false;
        endX = e.originalEvent.changedTouches[0].pageX;
        if (startX - endX > 80) goRoute(true);
        else if (startX - endX < -80) goRoute(false);
      },
      touchcancel(e) {
        if (!touchStart) return;
        touchStart = false;
        endX = e.originalEvent.changedTouches[0].pageX;
        if (startX - endX > 80) goRoute(true);
        else if (startX - endX < -80) goRoute(false);
      },
    });

    function goRoute(onBack) {
      const dNum = Number(dolNum);
      const mNum = Number(meetNum);

      if (onBack) {
        navigate(
          `/dolDetail/${dNum}${!mNum || mNum <= 1 ? "" : "/" + (mNum - 1)}`
        );
      } else {
        if (!mNum) {
          navigate(`/dolDetail/${dNum}/1`);
        } else if (maxLength > mNum) {
          navigate(`/dolDetail/${dNum}/${mNum + 1}}`);
        }
      }
    }
  },
  // 해당 좌표 클릭
  clickAtPosition(x, y) {
    console.log(x, y);
    // 이벤트 객체 생성
    var event = $.Event("click");

    // 클릭 위치 설정
    event.pageX = x;
    event.pageY = y;

    // 특정 위치에서 클릭 이벤트 트리거
    $(document.elementFromPoint(x, y)).trigger(event);
    console.log($(document.elementFromPoint(x, y)));
  },
};

export const uiModal = {
  // 모달창 오픈
  open(target) {
    $(target).removeClass("delay").show().addClass("active");
  },
  // 모달창 닫기
  close(target) {
    if (!$(target).hasClass("active")) $(target).hide();
    else {
      $(target).removeClass("active").addClass("delay");
      setTimeout(() => {
        $(target).hide();
      }, 300);
    }
  },
  // 관심모달창 크기 맞추기
  interestInit() {
    let wrapWidth = $(".interest-wrap").width() - 65;
    let rate = Math.floor(wrapWidth / $(".modal-interest .category").width());
    $(".modal-interest").width(
      $(".modal-interest .category").width() * rate + 80
    );
    $(".interest-wrap").css("visibility", "visible");
    $(window).on("resize", function () {
      wrapWidth = $(".interest-wrap").width() - 65;
      rate = Math.floor(wrapWidth / $(".modal-interest .category").width());
      $(".modal-interest").width(
        $(".modal-interest .category").width() * rate + 80
      );
    });
  },
};
