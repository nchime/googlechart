/************************************
 * nicepage - mobile page JS
 *************************************/

/*
 1> 전체적인 기능의 옵션화
  - 사용 방식도 통일
  - 오류 발생에 대한 일관성 있는 정리
  - 글로벌에 위치하지 않도록 모듈화
  - 미 사용 기능의 정리(향후 사용할 수 있도록)

 2> 전체적인 프로세스의 재 정리
  - 실질적인 최종버전
  - 기능 추가 여부 및 기타 의견 접수
  -

*/

$(window).load(function () {
  
    var scrollTime = 700,
      slickOpts = {
        infinite: false,
        arrows: false,
        dots: true,
        infinite: false,
        scrollingSpeed: scrollTime,
        responsiveHeight: $(window).height()
      },
      urlCopy = new Clipboard('.btn_url');
  
    // text animation
    var textAni = {
      init: function (target){
        var target = $(target).find('.content'),
          delayTime = ( $(target).parent('li').attr('effect-type') === 'kenBurn' ) ? 2000 : 0;
  
        setTimeout(function(){
          $(target).addClass('animate');
        }, delayTime)
      },
      clear: function(){
        $('.section .content').removeClass('animate');
      }
    };
  
    // func css transform
    function matrixToArray(str) {
      return str.split('(')[1].split(')')[0].split(',');
    }
  
    // css3 effect addClass
    function effectInit(idx) {
      var alImg = $('.section img').not('.thumb'),
        targetList = $('.fp-section.active li').eq(idx),
        targetImg = $(targetList).find('img'),
        targetAttr = $(targetList).attr('effect-type');
  
      if ( targetAttr != 'undefined' ) {
        $(alImg).removeClass();
        $(targetImg).addClass(targetAttr);
      }
    }
  
    // toggle .btn_ring
    function toggleBtnRing(target){
      if ( $(target).attr('media-type') == 'video' ) {
        $('#header .btn_ring').hide();
      }else{
        $('#header .btn_ring').show();
      }
    }
  
    // toggle Audio
    function toggleAudio(type){
      var targetAudio = $("#header #losAudio")[0];
  
      if ( targetAudio !== undefined ) {
        var isPaused = targetAudio.paused,
        btnAudio = $('#header .btn_ring');
  
        if (type == 'stop'){
          targetAudio.pause();
          $(btnAudio).removeClass('active');
        }else{
          ( isPaused ) ? targetAudio.play() : targetAudio.pause();
          $(btnAudio).toggleClass('active');
        }
      }
    }
  
    // toggle Video
    function toggleVideo(type, target){
      $('.section img.thumb').removeClass('hide');
      $('.section button.btn_play').removeClass('hide');
      $('.section video').each(function(idx){
        $('.section video')[idx].pause();
        $('.section video')[idx].currentTime = 0;
      });
      if (type == 'play'){
        $(target).siblings('img.thumb').addClass('hide');
        $(target).siblings('button.btn_play').addClass('hide');
        $(target)[0].play();
        toggleAudio('stop');
      }else if (type == 'pause'){
        return false
      }
    }
  
    // openAd
    function openAd(){
      var adStatus = $('.ad').attr('data-status'),
        pageStatus = $('#fWrap').attr('data-status') == 'ready';
  
      if ( adStatus.length == 0 && pageStatus){
        $('.ad').attr('data-status', 'open');
        setTimeout(function(){
          $('.ad').attr('data-status', 'close');
        }, 5000)
      }
    }
  
    // func imgAni
    function imgAni(data) {
      $(data.targetParent).each(function (i, targetParent) {
        var targetImg = $(targetParent).children('img'),
          strength = data.strength,
          posRatio = parseInt( (data.gamma + strength) * (50 / strength) ) / 100,
          parentWidth = $(targetImg).width(),
          imgWidth = $(targetParent).width(),
          aniType = ( $('body').hasClass('type_js') ) ? 'js' : 'css',
          isDisabled = $(targetImg).hasClass('disabled'),
          imgVal,
          imgStep,
          imgPos;
  
        if ( !isDisabled ) {
          if (posRatio < 0) {
            posRatio = 0
          } else if (posRatio > 1) {
            posRatio = 1
          }
          imgVal = parseInt(matrixToArray($(targetImg).css('transform'))[4]);
          imgPos = parseInt( (parentWidth - imgWidth) * posRatio );
          imgStep = Math.abs(imgPos - imgVal);
  
          if (imgStep >= data.step) {
            if ( $(targetParent).hasClass('slick-active') ) {
              if ( aniType == 'css' ){
                $(targetImg).css({
                  'transform': 'translateX(' + imgPos + 'px)'
                })
              }else if ( aniType == 'js') {
                $(targetImg).css({
                  'right': -imgPos
                })
              }
            }
          }
        }
      })
    }
  
  
    // loading element hide
    if ($('.loading').length) $('.loading').fadeOut();
  
  
    // browserDetect
    if ( navigator.userAgent.match(/SamsungBrowser/i) ) $('body').addClass('type_js');
  
    // cursor check
    if ($('#fWrap .section').length == 1) $('#fWrap .cursor span').hide();
  
    // firstList textAni
    // textAni.init($('.section:eq(0) li:eq(0)'));
  
    // closed ad
    $('.ad .btn_close').on('click', function(){
      $('.ad').attr('data-status', 'close');
      return false
    });
  
    // firstList isVideo
    toggleBtnRing( $('.section:eq(0) li') );
  
    // webkit browser address bar alwayon
    $(window).scroll(function(){
      document.webkitExitFullscreen();
      document.exitFullscreen();
    });
  
    // init slick.js
    $('.section .wrap_images').slick(slickOpts);
  
    // init fullpage
    $('#fWrap #container').fullpage({
      touchSensitivity: 15,
      lazyLoading: true,
      onLeave: function (index, nextIndex, direction) { // vertical scroll 이후
        // cursor visible
        if (nextIndex == 1) {
          $('#fWrap .cursor .top').hide();
          $('#fWrap .cursor .bottom').show();
        } else if (nextIndex == $('.section').length) {
          $('#fWrap .cursor .top').show();
          $('#fWrap .cursor .bottom').hide();
        } else {
          $('#fWrap .cursor .top').show();
          $('#fWrap .cursor .bottom').show();
        }
        // openAd
        //openAd();
        /* 1020일수정 세로스크롤시 애니메이션 주석처리 복구 */
        textAni.clear();
        
        setTimeout(function () {
          $('.section .wrap_images').slick('slickGoTo', 0, true);
          
          effectInit(0);
          // videoStop
          toggleVideo('stop');
          // textAni
          textAni.init( $('.section').eq(nextIndex - 1).find('li:eq(0)') );
          
        }, scrollTime);
  
        /*
        // firstSection video check
        toggleBtnRing( $('.section').eq(nextIndex-1).find('li:eq(0)') );
        */
      },
      afterRender: function(){    // 초기 로딩 후
        var startIdx = $('#fWrap').attr('data-startpos'),
          pageStatus = $('#fWrap').attr('data-status') == 'loading';
  
        if (pageStatus && startIdx !== undefined) {
          $.fn.fullpage.silentMoveTo(startIdx);
          $('#fWrap').attr('data-status','ready');
          textAni.init( $('.section').eq(startIdx - 1).find('li:eq(0)') );
        }else{
          textAni.init( $('.section').eq(0).find('li:eq(0)') );
        }
      }
    });
  
  
    // tilt toggle(미사용)
    /*
     $('.section .info').on('click', function (){
     var targetImg = $(this).siblings('img'),
     isDisabled = $(targetImg).hasClass('disabled');
  
     if ( isDisabled ) {
     $(targetImg).removeClass('disabled');
     }else{
     $(targetImg).addClass('disabled');
     }
     });
     */
  
    /*
    // init photoSwipe
    (function(){
      $('.section li').not('[media-type=video]').find('.btn_zoom').on('click', function(){
        var $pswp = $('.pswp')[0],
          imgOrigin = $(this).attr('href'),
          imgThumb = $(this).parent('li').find('img'),
          imgWidth = $(imgThumb).width(),
          imgHeight = $(imgThumb).height(),
          items = [{
            src : imgOrigin,
            w   : imgWidth,
            h   : imgHeight
          }],
          options = {
            index: 0,
            bgOpacity: 0.9,
            showHideOpacity: true,
            pinchToClose: false,
            closeOnScroll: false,
            maxSpreadZoom: 5
          };
  
        // Initialize PhotoSwipe
        var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
        lightBox.init();
        $.fn.fullpage.setAllowScrolling(false);
  
        lightBox.listen('close', function() {
          $.fn.fullpage.setAllowScrolling(true);
        });
        event.preventDefault();
      });
    })();
    */
  
    // img, video align
    function imgAlign() {
      $('#fWrap .section').each(function (i, ele) {
        var sectionList = $(ele).find('li'),
          winWidth = $(window).width(),
          winHeight = $(window).height(),
          headerHeight = $('#header').height();
  
        // images align
        $(sectionList).each(function (j, list) {
          var listImg = $(list).children('img'),
            listVideo = $(list).find('video'),
            isWide = $(list).hasClass('type-wide'),
            isNormal = $(list).hasClass('type-normal'),
            isTilt = $(list).attr('effect-type') == 'tilt',
            imgWidth = $(listImg).width(),
            imgHeight = $(listImg).height(),
            hCenter = (winHeight + headerHeight - imgHeight) / 2,
            vCenter = -( imgWidth ) / 2;
  
          if ( isNormal ) {
            /*$(listImg).css( 'margin-top', hCenter);*/
            $(listImg).css( {
              'margin-left': vCenter
            });
            $(listVideo).css({
              'width': imgWidth,
              'height': imgHeight,
              'margin-top': hCenter
            });
          }else if ( isWide && !isTilt) {
            $(listImg).css( {
              'margin-top': hCenter,
              'margin-left': vCenter
            });
            $(listVideo).css({
              'width': imgWidth,
              'height': imgHeight,
              'margin-top': hCenter,
              'margin-left': vCenter
            });
          }
        });
      });
  
      // effect
      effectInit(0);
      $('.section .wrap_images').on('beforeChange', function(event, slick, currentSlide, nextSlide){
        var nextTarget = $('.section.active li').eq(nextSlide);
  
        if (currentSlide != nextSlide){
          textAni.clear();
          textAni.init(nextTarget);
          effectInit(nextSlide);
          toggleBtnRing(nextTarget);
          toggleVideo('stop');
          //if ( nextSlide == 1 ) openAd()
        }
      });
    }
    imgAlign();
    $(window).resize(function(){
      imgAlign();
      $.fn.fullpage.reBuild();
    });
  
    // #header .btn_location
    $('#header .btn_location').on('click', function () {
      var targetIdx = $('.content .map').closest('.fp-section').index() + 1;
  
      $.fn.fullpage.silentMoveTo(targetIdx);
      return false
    });
  
    // mainMenuToggle
    $('#mainMenu .btn_toggle').on('click', function () {
      var isOpen = $('#mainMenu').hasClass('open');
      if ( isOpen ) {
        $('#mainMenu').attr('Class', 'close');
        $('#mainMenu li').removeClass('on');
      }else{
        $('#mainMenu').attr('Class', 'open');
      }
    });
    $('#fWrap').on('click', '#mainMenu.open li:not(.toggle) > button', function () {
      var isOn = $(this).parent('li').hasClass('on');
  
      if ( isOn ) {
        $(this).parent('li').removeClass('on');
      }else{
        $('#mainMenu.open li.on').removeClass('on');
        $(this).parent('li').addClass('on');
      }
    });
  
    // mainMenu bind layer
    $('#mainMenu li button[data-layer]').on('click', function () {
  
    // 모달 폼 입력값 초기화 
  
      $("#bookingForm #resDate").val(strNowTime());   
      $("#bookingForm #resName").val('');  
      $("#bookingForm #resUser").val('');          
      $("#bookingForm #resMobile").val('');
      $("#bookingForm #resMemo").val('');
      $("#bookingForm #chkAgree").prop('checked', false);
  
      $("#consultingForm #conName").val('');   
      $("#consultingForm #conMobile").val('');
      $("#consultingForm #conMemo").val('');
      $("#consultingForm #chkAgree").prop('checked', false);
  
  
  
  
  
  
  
      var targetLayer = $(this).attr('data-layer');
      $('#modalLayer, #modalLayer #'+targetLayer).show();
      //$('#mainMenu').attr('Class', '');
      return false
    });
  
    // shareToggle
    $('#fWrap .share .btn_toggle').on('click', function(){
      var targetEle = $('#fWrap .share');
      $(targetEle).toggleClass('active');
    });
  
    // shareUrl
    $('#fWrap .share .btn_url').on('click', function(){
      var alertMsg = $(this).attr('data-clipboard-msg');
  
      urlCopy.on('success', function(e){
        alert(alertMsg);
      });
      urlCopy.on('error', function(e) {
        alert('복사에 실패하였습니다.')
      });
    });
  
    // moveToTop
    $('#header h1').on('click', function(){
      $.fn.fullpage.moveTo(1);
    });
  
    // video
    $('#fWrap .section li[media-type=video] .btn_play').on('click', function(){
      var targetVideo = $(this).siblings('video'),
        isPaused = targetVideo.get(0).paused;
  
      if ( isPaused ){
        toggleVideo('play', targetVideo)
      }else{
        toggleVideo('stop')
      }
    });
  
    // audio
    $('#header .btn_ring').on('click', function(){
      toggleAudio();
    });
  
    // audioSteop minimize browser
    document.addEventListener("visibilitychange", function(){
      toggleAudio('stop');
    }, false);
  
    // motionSensor ev
    window.addEventListener('deviceorientation', function (event) {
      var isAd = $('.ad').attr('data-status') === 'open';
  
      if ( !isAd ) {
        imgAni({
          targetImg: $('.section .wrap_images li[effect-type=tilt] img'),
          targetParent: $('.section .wrap_images li[effect-type=tilt]'),
          strength: 20,
          step: 20,
          gamma: event.gamma
        })
      }
    });
  
    // modalLayer
    $('#modalLayer div .btn_close').on('click', function () {
      $('#modalLayer > div:visible').hide();
      $('#modalLayer .bg_layer').hide();
      $('#mainMenu').attr('Class', '');
      $('#mainMenu li').removeClass('on');
    });
  
  
  });
  