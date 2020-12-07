/************************************
 * nicePage - review.js
 *************************************/

/**
 * 포토리뷰 등록하기 모달 초기화
 */
function clearRegisterFormAction() {

    $("#eval1Chk").removeClass("active");
    $("#eval2Chk").removeClass("active");
    $("#eval3Chk").removeClass("active");
    $("#eval4Chk").removeClass("active");
    $("#eval5Chk").removeClass("active");

    $("#photoReviewUploadForm #eval1").val(0);
    $("#photoReviewUploadForm #eval2").val(0);
    $("#photoReviewUploadForm #eval3").val(0);
    $("#photoReviewUploadForm #eval4").val(0);
    $("#photoReviewUploadForm #eval5").val(0);
    $("#photoReviewUploadForm #newPhoto").val('');

    $(".photo-management-image-upload").show();
    $("#preview_photo_area").empty();
    $(".photo-management-upload-text").html('직접 찍은 사진도 함께 올려보세요!(최대3장까지 가능)<br>안드로이드폰은 사진을 길게 눌러야 복수 선택이 가능합니다');

    window.location.hash = "openModal"; 

}


function makePhotoHtml(imgSrc) {

    var htmlStr = "<li>" + 
              "<img src=\"" + imgSrc + "\" onerror=\"this.src='http://placehold.it/400x400'\" alt=\"\">" + 
             " </li>";
 
     return htmlStr;
 }


/**
 * 포토리뷰 조회 모달 호출 
 */
function viewReviewPhotoAction(prIdx, eval1, eval2, eval3, eval4, eval5) {

    if (eval1 == "1") $("#viewEval1").addClass('active');
    else $("#viewEval1").removeClass('active');
    if (eval2 == "1") $("#viewEval2").addClass('active');
    else $("#viewEval2").removeClass('active');
    if (eval3 == "1") $("#viewEval3").addClass('active');
    else $("#viewEval3").removeClass('active');
    if (eval4 == "1") $("#viewEval4").addClass('active');
    else $("#viewEval4").removeClass('active');
    if (eval5 == "1") $("#viewEval5").addClass('active');
    else $("#viewEval5").removeClass('active');

    // var imgEle = $("#reviewPhoto" + prIdx).children('img').clone();
    // $('.photo-management-image-area ul li').empty().append(imgEle);

    var selectedPhotoJsonList = selPhotoJsonList(prIdx);
    $('#photoListArea').empty();
    for (var i = 0; i < selectedPhotoJsonList.length; i++) {
        $('#photoListArea').append(makePhotoHtml(IMG_PATH + selectedPhotoJsonList[i].SRC_IMG_NM));
    }

    $.fancybox.open([{

        src: '#lp-photo-view',
        type: 'inline',
        opts: {
            toolbar : false,
            slideShow  : false,
            fullScreen : false,
            thumbs     : false,
            closeClickOutside : false,
            smallBtn : true,
            autoFocus : false,
            focus : false
        }
    }]);

    window.location.hash = "openModal"; 
}

/**
 * 포인트 체크 
 * @param {*} chkForm 
 */
function setPoint(chkForm) {

    if ($("#photoReviewUploadForm #" + chkForm + "Chk").hasClass("active") === true) {
        $("#photoReviewUploadForm #" + chkForm).val("0");
    } else {
        $("#photoReviewUploadForm #" + chkForm).val("1");
    }
}


/**
 * 업로드 이미지 클릭
 */
function selPhotoAddAction() {
    document.photoReviewUploadForm.newPhoto.click();
}



// 선택한 포토리뷰에 포함된 포토 리스트 
function selPhotoJsonList(prIdx) {
    var selectedPhotoJsonList = [];

    for (var i = 0; i < photoJsonList.length; i++) {
        if (photoJsonList[i].PR_IDX == prIdx) {
            selectedPhotoJsonList.push(photoJsonList[i]);
        }
    }
    return selectedPhotoJsonList;
}


$(document).ready(function () {
    $("#newPhoto").on("change", handleImgsFileSelect);
});


// var sel_files = [];

function handleImgsFileSelect(e) {

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);

    filesArr.forEach(function (f) {
        if (!f.type.match("image.*")) {
            alert("이미지만 업로드 가능합니다");
            return;
        }
//      sel_files.push(f);

        var reader = new FileReader();
        reader.onload = function (e) {
            var img_html = "<li><img src=\"" + e.target.result + "\"></li>";
            $("#preview_photo_area").append(img_html);
        }
        reader.readAsDataURL(f);

        $(".photo-management-image-upload").hide();
        $(".photo-management-upload-text").html('선택한 사진을 확인하시고 등록하기 버튼을 눌러주세요')

    });

}




function photoUpload(input) {



    // 추가로 이미지 등록하는 상태인지 체크     
    var prIdx = $("#photoReviewUploadForm #prIdx").val();
    var selPhotoCnt = $("#photoReviewUploadForm #selPhotoCnt").val();
    var npIdx = $("#photoReviewUploadForm #npIdx").val();
    var nsMbrIdx = $("#photoReviewUploadForm #nsMbrIdx").val();

    var eval1 = $("#photoReviewUploadForm #eval1").val();
    var eval2 = $("#photoReviewUploadForm #eval2").val();
    var eval3 = $("#photoReviewUploadForm #eval3").val();
    var eval4 = $("#photoReviewUploadForm #eval4").val();
    var eval5 = $("#photoReviewUploadForm #eval5").val();

    var fileInput = $('#newPhoto');

    var filesizeInBytes = [];
    var filesizeInMB = [];
    var filename = [];
    var ext = [];
    for (var i = 0; i < input.files.length; i++) {
        filesizeInBytes[i] = input.files[i].size;
        filesizeInMB[i] = (filesizeInBytes / (1024 * 1024)).toFixed(2);
        filename[i] = input.files[i].name;
        ext[i] = filename[i].split(".").pop().toLowerCase();

        console.log("File name is : " + filename[i] + " || size : " + filesizeInMB[i] + " MB || size : " + filesizeInBytes[i] + " Bytes || ext : " + ext[i] + " || " + input.files[i].type);
    }

    var maxSize = fileInput.data('max-size');


    if (input.files.length == 0) {
        alertErrMessage('사진을 선택해 주세요');

    } else if (input.files.length > 3) {
        alertErrMessage('한번에 3개 이상 사진을 업로드할 수 없습니다');

    } else if ((input.files.length + Number(selPhotoCnt)) > 3) {
        alertErrMessage('3개 이상 사진을 포토리뷰로 등록할 수 없습니다');

    } else if (!imgFileType(input.files)) {
        alertErrMessage('이미지 파일만 업로드할 수 있습니다.');

    } else if (!imgSizeCheck(filesizeInBytes, maxSize)) {
        alertErrMessage('지정된 용량 이하의 파일만 업로드할 수 있습니다.');
    } else {

        for (var i = 0; i < input.files.length; i++) {
            var file = input.files[i];

            var picReader = new FileReader();
            //Read the image
            picReader.readAsDataURL(file);
        }

        var form = $('photoReviewUploadForm')[0];
        var formData = new FormData(form);
        for (var i = 0; i < input.files.length; i++) {
            formData.append("photo", input.files[i]);
        }
        formData.append("photo", input.files);
        formData.append("nsMbrIdx", nsMbrIdx);
        formData.append("npIdx", npIdx);
        formData.append("eval1", eval1);
        formData.append("eval2", eval2);
        formData.append("eval3", eval3);
        formData.append("eval4", eval4);
        formData.append("eval5", eval5);
        formData.append("prIdx", prIdx);

        $.ajax({
            type: 'post',
            url: '/uploadReviewPhoto',
            data: formData,
            dataType: 'json',
            processData: false,
            contentType: false,
            beforeSend: function () {
                // $('#upload').modal('hide');
                // $('.loading').fadeIn();
                $.fancybox.close();
                $('#reviewPhoto-loading').removeClass('display-none');

            },
            complete: function () {
                // $('.loading').fadeOut();
                $('#reviewPhoto-loading').addClass('display-none');                
            },
            success: function (json) {
                console.log(json);
                var retMsg = JSON.parse(JSON.stringify(json));
                //                $('#upload').modal('show');

                if (retMsg.CODE == "500") {

                    alert(retMsg.message);

                } else if (retMsg.CODE == "200") {

                    var prIdx = retMsg.PR_IDX;
                    var imgPath = retMsg.IMG_PATH;
                    var photoList = retMsg.PHOTO_LIST;
                    var pointTotVal = Number($("#pointTot").text()) + (Number(eval1) + Number(eval2) + Number(eval3) + Number(eval4) + Number(eval5));
                    $("#pointTot").text(pointTotVal);

                    common_alert(retMsg.MESSAGE);                    

                    location.reload();

                    /*

                                        // 3장 이상 업로드 된 경우 
                                        if(photoList.length > 2) { 

                                            var pointTotVal = Number($("#pointTot").text()) + (Number(eval1) + Number(eval2) + Number(eval3) + Number(eval4) + Number(eval5));
                                            $("#pointTot").text(pointTotVal);
                        
                                            // 포토리스트 목록에 추가 
                                            $("li:first").after(newhtmlListItem(prIdx, eval1, eval2, eval3, eval4, eval5, photoList, imgPath));
                                        

                                            //$('#upload').modal('hide');
                                            $('#prIdx').val(''); 
                                            $('#selPhotoCnt').val('0');     
                                        
                                            // 선택한 포인트 초기화
                                            // $(".list1 div").removeClass('ez-checked');
                                            // $(".list2 div").removeClass('ez-checked');
                                            // $(".list3 div").removeClass('ez-checked');
                                            // $(".list4 div").removeClass('ez-checked');
                                            // $(".list5 div").removeClass('ez-checked');
                     
                                            // 등록하기 버튼 숨김   
                                            $("#registReviewArea").hide(); 

                                            // 추가한 사진 목록 초기화  
                                            $("#preview_photo_area").html(''); 
                                                                
                                            alert(retMsg.MESSAGE);  

                                        } else { 
                                            $("#registReviewArea").show(); 
                                            $('#prIdx').val(prIdx); 
                                            $('#selPhotoCnt').val(photoList.length); 
                                            $("#preview_photo_area").html(addPhotoItem(photoList, imgPath)); 

                                            $("#registReview").attr("onClick", "registReviewAction(" + prIdx + ", " + eval1 + " ," +  eval2 + " ," + eval3 + " ," + eval4 + " ," + eval5 + " ,'" + JSON.stringify(photoList) + "' ,'" + imgPath + "')"); 

                                        }
                    */

                }
            },
            error: function (xhr, status, error) {
                console.log(JSON.stringify(error));
                alertErrMessage('시스템 오류가 발생했습니다. 잠시 후 다시 시도해 주세요');
            },
            timeout: 100000
        });

    }

}

// 이미지 확장자 체크 
function imgExtCheck(ext) {
    var returnVal = true;
    for (var i = 0; i < ext.length; i++) {

        console.log(ext[i]);
        // if (file.type.match('image')) continue;

        if ($.inArray(ext[i], ["gif", "png", "jpg", "jpeg"]) == -1) {

            returnVal = false;
            continue;
        }
        if ((i + 1) == ext.length) {
            return returnVal;
        }
    }
}


// 파일 이미지 타입 체크 
function imgFileType(files) {
    var returnVal = true;
    for (var i = 0; i < files.length; i++) {
        if (!(files[i].type.match('image'))) {
            returnVal = false;
            continue;
        }
        if ((i + 1) == files.length) {
            return returnVal;
        }
    }
}


// 파일 용량 체크 체크 
function imgSizeCheck(filesizeInBytes, maxSize) {
    var returnVal = true;
    for (var i = 0; i <= filesizeInBytes.length; i++) {
        if (filesizeInBytes[i] > maxSize) {
            returnVal = false;
            continue;
        }
        if ((i + 1) == filesizeInBytes.length) return returnVal;
    }
}

// alert message 
function alertErrMessage(message) {

    alert(message);
};


/**
 * 추가 포토리뷰 생성
 */
function newhtmlListItem(prIdx, eval1, eval2, eval3, eval4, eval5, photoList, imgPath) {

    var subHtml = "";
    var html = "<li id=\"thumbnailItem" + prIdx + "\"> " +
        "               <a href=\"javascript:;\"  onClick=\"viewReviewPhotoAction(" + prIdx + ", " + eval1 + ", " + eval2 + ", " + eval3 + ", " + eval4 + ", " + eval5 + ");\"> " +
        "                 <div  class=\"ias\"> " +
        "                  <img name=\"thumbnailImg" + prIdx + "\" id=\"thumbnailImg" + prIdx + "\" class=\"thumb\" src=\"" + imgPath + photoList[0].THUMB_IMG_NM + "\" alt=\"썸네일\"> " +
        "                   <div id=\"reviewPhoto" + prIdx + ">";

    for (var i = 0; i < photoList.length; i++) {
        subHtml += "<img src=\"" + imgPath + photoList[i].SRC_IMG_NM + "\" alt=\"\">";
    }
    html += subHtml;
    html += "</div></a></li>";

    return html;
}


// 선택한 사진 추가 
function addPhotoItem(photoList, imgPath) {

    var html = "";

    html = "<ul>";

    for (var i = 0; i < photoList.length; i++) {

        html += "<li>" +
            "         <img src=\"" + imgPath + photoList[i].THUMB_IMG_NM + "\">" +
            "        </li>";
    }

    html = "</ul>";

    return html;
}




// 사진 목록 선택
function selPhotoAction() {
    document.photoReviewUploadForm.newPhoto.click();
}


// 사진 목록 선택
function registReviewAction(prIdx, eval1, eval2, eval3, eval4, eval5, photoList, imgPath) {

    var pointTotVal = Number($("#pointTot").text()) + (Number(eval1) + Number(eval2) + Number(eval3) + Number(eval4) + Number(eval5));
    $("#pointTot").text(pointTotVal);

    photoList = JSON.parse(photoList);

    // 포토리스트 목록에 추가 
    $("li:first").after(newhtmlListItem(prIdx, eval1, eval2, eval3, eval4, eval5, photoList, imgPath));

    $('#upload').modal('hide');
    $('#prIdx').val('');
    $('#selPhotoCnt').val('0');

    // 선택한 포인트 초기화
    $(".list1 div").removeClass('ez-checked');
    $(".list2 div").removeClass('ez-checked');
    $(".list3 div").removeClass('ez-checked');
    $(".list4 div").removeClass('ez-checked');
    $(".list5 div").removeClass('ez-checked');

    // 추가한 사진 목록 초기화  
    $("#preview_photo_area").html('');

    alert("포토리뷰를 등록하였습니다");


}


// 모달 팝업 백버튼 닫기 처리 
$(window).on('hashchange', function (event) {
    if(window.location.hash != "#openModal") {
        $.fancybox.close();                
    }    
});
