
// 예약신청 
function reqBookingAction() {

  var npIdx = document.bookingForm.npIdx.value;
  var bkDate = document.bookingForm.resDate.value;
  var bkTime = document.bookingForm.resTime.value;  
  var userNm = document.bookingForm.resName.value;
  userNm = imoticonConvert(userNm);    
  var peopleNum = document.bookingForm.resUser.value;
  var phone = document.bookingForm.resMobile.value;
  var bkInfo = document.bookingForm.resMemo.value;
  hpNo = document.bookingForm.hpNo.value;
  
  bkInfo = imoticonConvert(bkInfo);    


  var bkDate = bkDate + ' ' +  bkTime; 

  var npUrl = document.bookingForm.npUrl.value;  

  console.log(bkDate);  

  if (isEmpty(bkDate)) {
    alertErrMessage("예약일을 입력해 주세요");

  } else if (isEmpty(bkTime)) {
    alertErrMessage("예약시간을 입력해 주세요");

  } else if (!dateCheckToday(bkDate)) {
    alertErrMessage("오늘 이후 날짜를 입력해 주세요");

  } else if (isEmpty($.trim(userNm))) {
    alertErrMessage("예약신청자 이름을 정확히 입력해 주세요");

  } else if (isEmpty(peopleNum)) {
    alertErrMessage("인원수를 입력해 주세요");

  } else if (isNaN(peopleNum)) {
    alertErrMessage("인원수를 숫자로 입력해 주세요");
    document.bookingForm.resUser.value = ""; 

  } else if (isEmpty(phone)) {
    alertErrMessage("연락처를 입력해 주세요");

  } else if (isNaN(phone)) {
    alertErrMessage("연락처를 숫자로 입력해 주세요");
    document.bookingForm.resMobile.value = ""; 


  // } else if (isNaN(phone.split('-').join(''))) {
  //   alertErrMessage("연락처를 숫자로 입력해 주세요");

  // } else if (phone.length < 11) {
  //   alertErrMessage("연락처 자릿수가 맞지 않습니다");

  } else if (isEmpty(bkInfo)) {
    alertErrMessage("예약내용을 입력해 주세요");
    

  } else if (!$("#bookingForm #chkAgree").prop("checked")) {
    alertErrMessage("개인정보 이용 및 제공동의를 체크해 주세요");    

  } else {

    userNm = XSSFilter(userNm); 
    phone = XSSFilter(phone); 
    hpNo = XSSFilter(hpNo); 
    bkInfo = XSSFilter(bkInfo); 

    $.ajax({
      type: 'post',
      url: '/niceplus/reqUserBooking',
      data: {
        'npIdx': npIdx,
        'bkDate': bkDate,
        'userNm': userNm,
        'peopleNum': peopleNum,
        'phone': phone,
        'hpNo': hpNo,
        'bkInfo': bkInfo
      },
      dataType: 'json',
      beforeSend: function () {
         $('.loading').fadeIn();
      },
      complete: function () {
         $('.loading').fadeOut();
      },
      success: function (json) {
        console.log(json);
        var retMsg = JSON.parse(JSON.stringify(json));

        if (retMsg.CODE == "500") {

          alertErrMessage(retMsg.MESSAGE); 

        } else if (retMsg.CODE == "200") {

/*          
          $('#mainMenu').attr('Class', '');

          // 기존 입력값 초기화 
          document.bookingForm.resName.value = ""; 
          document.bookingForm.resUser.value  = ""; 
          document.bookingForm.resMobile.value = ""; 
          document.bookingForm.resMemo.value = ""; 
          document.consultingForm.privacy_check.checked = false;           
*/ 
//          common_alert(retMsg.MESSAGE);
          alert(retMsg.MESSAGE); 
//          $.fancybox.close();
          location.href="/" + npUrl; 
          
        }
      },
      error: function (xhr, status, error) {
        console.log(JSON.stringify(error));
        alertErrMessage('시스템 오류가 발생했습니다. 잠시 후 다시 시도해 주세요');
        // location.href = "/";
      },
      timeout: 100000
    });
  }
}


// 상담신청 
function reqConsultingAction() {

  var npIdx = document.consultingForm.npIdx.value;
  var userNm = document.consultingForm.conName.value;
  userNm = imoticonConvert(userNm);  
  var phone = document.consultingForm.conMobile.value;
  var qtBody = document.consultingForm.conMemo.value;
  qtBody = imoticonConvert(qtBody);  

  var hpNo = document.consultingForm.hpNo.value;  
  var npUrl = document.consultingForm.npUrl.value;


  if (isEmpty($.trim(userNm))) {
    alertErrMessage("상담신청자 이름을 정확히 입력해 주세요");

  } else if (phone == "") {
    alertErrMessage("연락처를 입력해 주세요");

   } else if (isNaN(phone)) {
     alertErrMessage("연락처를 숫자로 입력해 주세요");
     document.consultingForm.conMobile.value = ""; 

  // } else if (isNaN(phone.split('-').join(''))) {
  //   alertErrMessage("연락처를 숫자로 입력해 주세요");

  // } else if (phone.length < 11) {
  //   alertErrMessage("연락처 자릿수가 맞지 않습니다");

  } else if (isEmpty($.trim(qtBody))) {
    alertErrMessage("상담내용을 입력해 주세요");

  } else if (!$("#consultingForm #chkAgree").prop("checked")) {
    alertErrMessage("개인정보 이용 및 제공동의를 체크해 주세요");

  } else {

    phone = phone.split('-').join('');


    userNm = XSSFilter(userNm); 
    phone = XSSFilter(phone); 
    hpNo = XSSFilter(hpNo); 
    qtBody = XSSFilter(qtBody); 


    $.ajax({
      type: 'post',
      url: '/niceplus/reqUserConsulting',
      data: {
        'npIdx': npIdx,
        'userNm': userNm,
        'phone': phone,
        'hpNo': hpNo,                
        'qtBody': qtBody
      },
      dataType: 'json',
      beforeSend: function () {
         $('.loading').fadeIn();
      },
      complete: function () {
        $('.loading').fadeOut();
      },
      success: function (json) {
        console.log(json);
        var retMsg = JSON.parse(JSON.stringify(json));

        if (retMsg.CODE == "500") {

          alertErrMessage(retMsg.MESSAGE); 

        } else if (retMsg.CODE == "200") {

/*          
          $('#mainMenu').attr('Class', '');

          // 기존 입력값 초기화 
          document.consultingForm.conName.value = ""; 
          document.consultingForm.conMobile.value = ""; 
          document.consultingForm.conMemo.value = ""; 
          document.consultingForm.privacy_check.checked = false; 
*/ 
          // common_alert(retMsg.MESSAGE);
          alert(retMsg.MESSAGE); 
          // $.fancybox.close();
          location.href="/" + npUrl; 
          
        }
      },
      error: function (xhr, status, error) {
        console.log(JSON.stringify(error));
        alertErrMessage('시스템 오류가 발생했습니다. 잠시 후 다시 시도해 주세요');
        // location.href = "/";
      },
      timeout: 100000
    });

  }
}



// null 체크 
function isEmpty(value) {
  if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" &&
      !
      Object.keys(value).length)) {
    return true
  } else {
    return false
  }
};

function imoticonConvert(str) { 

  var ranges = [
    '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
    '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
    '\ud83d[\ude80-\udeff]'  // U+1F680 to U+1F6FF
  ];

  str = str.replace(new RegExp(ranges.join('|'), 'g'), '');
  return str;
}



// 입력날짜가 오늘날짜 이후인지 체크 
function dateCheckToday(inputDate) {

// 2017-12-06 00:12

  var inputDateStr = inputDate.substring(0, 10);  
  var inputTimeStr = inputDate.substring(11, 16);  

  var dateArr1 = inputDateStr.split('-');
  var timeArr1 = inputTimeStr.split(':');  
  var dateVal1 = new Date(dateArr1[0], dateArr1[1]-1, dateArr1[2], timeArr1[0], timeArr1[1]);
//  var dateVal1 = new Date(dateArr1[0], dateArr1[1]-1, dateArr1[2], '23', '59');  

  var dateVal2 = new Date();
  
  if (dateVal1 >= dateVal2) return true
  else { 

      var timeArr1 = inputTimeStr.split(':');
      var timeVal1 = new Date(timeArr1[0], timeArr1[1]);
  }   
    return false;

}



// alert message 
function alertErrMessage(message) {
  alert(message);  
};


function strNowTime() {

  var today = new Date();
  var yyyy = today.getFullYear();  
  var mm = today.getMonth() + 1; //January is 0!
  var dd = today.getDate();
  var hh = today.getHours();

  //현재 시간보다 1시간 뒤  
  if(hh != 23 ) hh = hh+1; 
  else hh = 00; 

  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }

  return yyyy + '-' + mm + '-' + dd + "T" + hh + ":00";
}


// SNS 공유 
function sendSns(sns, url, txt)
{
    var o;
    var _url = encodeURIComponent(url);
    var _txt = encodeURIComponent(txt);
    var _br  = encodeURIComponent('\r\n');

    switch(sns)
    {
        case 'facebook':
            o = {
                method:'popup',
                url:'http://www.facebook.com/sharer/sharer.php?u=' + _url
            };
            break;

        case 'twitter':
            o = {
                method:'popup',
                url:'http://twitter.com/intent/tweet?text=' + _txt + '&url=' + _url
            };
            break;


        case 'band':
            o = {
                method:'web2app',
                param:'create/post?text=' + _txt + _br + _url,
                a_store:'itms-apps://itunes.apple.com/app/id542613198?mt=8',
                g_store:'market://details?id=com.nhn.android.band',
                a_proto:'bandapp://',
                g_proto:'scheme=bandapp;package=com.nhn.android.band'
            };
            break;

        default:
            alert('지원하지 않는 SNS입니다.');
            return false;
    }

    switch(o.method)
    {
        case 'popup':
            window.open(o.url);
            break;

        case 'web2app':
            if(navigator.userAgent.match(/android/i))
            {
                // Android
                setTimeout(function(){ location.href = 'intent://' + o.param + '#Intent;' + o.g_proto + ';end'}, 100);
            }
            else if(navigator.userAgent.match(/(iphone)|(ipod)|(ipad)/i))
            {
                // Apple
                setTimeout(function(){ location.href = o.a_store; }, 200);
                setTimeout(function(){ location.href = o.a_proto + o.param }, 100);
            }
            else
            {
                alert('이 기능은 모바일에서만 사용할 수 있습니다.');
            }
            break;
    }
}



    // NICEDATA 카카오링크 API 키 
    Kakao.init('228ef708ebbc52c1a71df730bd3b43b4'); 

    function sendKakaoTalk(_url, _msg, _imgUrl)
    {
    Kakao.Link.sendTalkLink({
      label: _msg,
      image: {
        // src: 'https://rgo.to/chime/1/images/th_1483339656591-167.jpg',
        src: _imgUrl,
        width: '400',
        height: '400'
      },
      webButton: {
        text: _msg,
        url: _url
      }
    });
    }



    function phoneFomatter(num,type){
      
      var formatNum = '';
      if(type==0){
        formatNum = num.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-****-$3");
      } else {
          formatNum = num.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3");
      }

      /*
      if(num.length==11){
          if(type==0){
              formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
          }else{
              formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
          }
      }else if(num.length==8){
          formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
      }else{
          if(num.indexOf('02')==0){
           if(num.length==9){
                if(type==0){
                  formatNum = num.replace(/(\d{2})(\d{3})(\d{4})/, '$1)***-$3');
                }else{
                  formatNum = num.replace(/(\d{2})(\d{3})(\d{4})/, '$1)$2-$3');
                }

               } else if(num.length==10){
              if(type==0){
                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1)***-$3');
              }else{
                formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1)$2-$3');
              }
                  
              
            } else {  
              if(type==0){
                  formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1)****-$3');
              }else{
                  formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1)$2-$3');
              }
            } 
          }else{
              if(type==0){
                  formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1)***-$3');
              }else{
                  formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1)$2-$3');
              }
          }
      }
      */
      return formatNum;
      
  }


/**
 * 폰번호 하이픈 처리 
 * @param {*} str 
 */
function autoHypenPhone(str){
  str = str.replace(/[^0-9]/g, '');
  var tmp = '';
  if( str.length < 4){
    return str;
  }else if(str.length < 7){
    tmp += str.substr(0, 3);
    tmp += '-';
    tmp += str.substr(3);
    return tmp;
  }else if(str.length < 11){
    tmp += str.substr(0, 3);
    tmp += '-';
    tmp += str.substr(3, 3);
    tmp += '-';
    tmp += str.substr(6);
    return tmp;
  }else{        
    tmp += str.substr(0, 3);
    tmp += '-';
    tmp += str.substr(3, 4);
    tmp += '-';
    tmp += str.substr(7);
    return tmp;
  }
  return str;
}




// common_alert();
// common_alert_close();
function common_alert_close(){
  $(".common-alert-layer").animate({bottom: "-5.5rem"}, 500);
}
function common_alert(alertMessage){
  $(".common-alert-layer").animate({bottom: "0"}, 500).delay(3000).animate({bottom: "-5.5rem"}, 500);
  $("#alertMessage").text(alertMessage); 
}





  /**
   * 이모티콘 문자 변경 
   * @param {*} str 
   */
  function imoticonConvert(str) { 

    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
      return str.replace(regex, '');
  }

  function chkImoticon(str) { 

    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

    if(str.match(regex)) { 
        return true;
    } else { 
        return false;
    }
 
}




/**
 * textarea 길이 체크 
 * @param {*} frm 
 */
function textareaLenChk(frm){  

  // 이모티콘 코드 치환 및 안내 문구 표시 
  if(chkImoticon(frm.value)) { 
      alert("이모티콘은 입력할 수 없습니다. ") 
      frm.value = imoticonConvert(frm.value);         
  } 


   if(frm.value.length > 60){  
     alert("글자수는 60자로 제한됩니다");  
     frm.value = frm.value.substring(0,60);  
     frm.focus();  
   }


} 

/**
* 줄바꿈 체크 
* @param {*} elmId 
*/
function textAreaLineLimit(elmId) {

  var maxRows = 5;     
  var tempText = $("#" + elmId).val();
  var lineSplit = tempText.split("\n");                
  
  // 최대라인수 제어
  if(lineSplit.length >= maxRows && event.keyCode == 13) {
      alert('5줄 까지만 줄바꿈이 가능합니다');
      event.returnValue = false;
  }
}

function inputValidateChk(frm){  

    // 이모티콘 코드 치환 및 안내 문구 표시 
    if(chkImoticon(frm.value)) { 
        alert("이모티콘은 입력할 수 없습니다. ") 
        frm.value = imoticonConvert(frm.value);         
    } 

} 

/**
 * XSS 처리 
 * @param {*} content 
 */
function XSSFilter(content) {
  // return content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  content = content.replace(/<br\/>/ig, "\n"); 
  return content.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, "");
}