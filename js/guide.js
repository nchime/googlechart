jQuery(function ($) {

    // Side Menu
    var guide_snb = $('div.guide_snb');
    var sItem = guide_snb.find('>ul>li');
    var fsItem = guide_snb.find('>ul>li:first');
    var ssItem = guide_snb.find('>ul>li>ul>li');
    var lastEvent = null;

    fsItem.addClass('active');
    sItem.find('>ul').css('display', 'none');
    guide_snb.find('>ul>li>ul>li[class=active]').parents('li').attr('class', 'active');
    guide_snb.find('>ul>li[class=active]').find('>ul').css('display', 'block');

    function guide_snbToggle(event) {
        var t = $(this);

        if (this == lastEvent) return false;
        lastEvent = this;
        setTimeout(function () { lastEvent = null }, 200);

        if (t.next('ul').is(':hidden')) {
            sItem.find('>ul').slideUp(100);
            t.next('ul').slideDown(100);
        } else if (!t.next('ul').length) {
            sItem.find('>ul').slideUp(100);
        } else {
            t.next('ul').slideUp(100);
        }

        if (t.parent('li').hasClass('active')) {
            t.parent('li').removeClass('active');
        } else {
            sItem.removeClass('active');
            t.parent('li').addClass('active');
        }
    }
    sItem.find('>a').click(guide_snbToggle).focus(guide_snbToggle);

    function subMenuActive() {
        ssItem.removeClass('active');
        $(this).parent(ssItem).addClass('active');
    };
    ssItem.find('>a').click(subMenuActive).focus(subMenuActive);

    //icon
    guide_snb.find('>ul>li>ul').prev('a').append('<span class="i"></span>');

    //$('table tbody tr').mouseover(function () {
    //    $('table tbody tr').removeClass("over");
    //    $(this).addClass("over");
    //});
    
 
}); 

//window pop
var win= null;
function NewWindow(mypage,myname,w,h,scroll){
  var winl = (screen.width-w)/2;
  var wint = (screen.height-h)/2;
  var settings  ='height='+h+',';
      settings +='width='+w+',';
      settings +='top='+wint+',';
      settings +='left='+winl+',';
      settings +='scrollbars='+scroll+',';
      settings +='resizable=yes';
  win=window.open(mypage,myname,settings);
  if(parseInt(navigator.appVersion) >= 4){win.window.focus();}
}
