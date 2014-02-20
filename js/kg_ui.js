(function () {
    var Class = {
        winHeight: 0
        , popZIndex: 5000
		, winWidth: 0
		, isMobile: navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i) ? true : false
		, isWide: false
		, evTouchStart: navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i) ? 'touchstart' : 'mousedown'
		, evTouchMove: navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i) ? 'touchmove' : 'mousemove'
		, evTouchEnd: navigator.userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i) ? 'touchend' : 'mouseup'
		, animEndEventName: {
		    'WebkitAnimation': 'webkitAnimationEnd',
		    'OAnimation': 'oAnimationEnd',
		    'msAnimation': 'MSAnimationEnd',
		    'animation': 'animationend'
		}[Modernizr.prefixed('animation')]
        /* debug */, debug: function debug(str) {
            var $debug = $('#debug');
            if ($debug.length < 1) {
                $debug = $('<div id="debug"></div>');
                $('body').append($debug);
            }
            $debug.append('<span>' + str + '</span>').scrollTop(1000000);
        }
        /* initBrowser */, initBrowserOnce: function initBrowserOnce() {
            if ((/Chrome/i).test(navigator.userAgent)) {
                $('html').addClass('Chrome');
            } else if ((/Android/i).test(navigator.userAgent)) {
                $('html').addClass('Android');
            } else if ((/iPad|iPhone|iPod/i).test(navigator.userAgent)) {
                $('html').addClass('iOS');
            }
        }
        /* initTreeOnce */, initTreeOnce: function initTreeOnce() {
            var $treeList = $('#treeList');

            $treeList.find('li:has("ul")').prepend('<a href="#" class="treeCtrl"><span class="btnClose"></span></a> ');
            $treeList.find('li:last-child').addClass('end');

            $('.treeCtrl').click(function () {
                var temp_el = $(this).parent().find('>ul');
                if (temp_el.css('display') == 'none') {
                    temp_el.slideDown(100);
                    $(this).find('span').attr('class', 'btnClose');
                    return false;
                } else {
                    temp_el.slideUp(100);
                    $(this).find('span').attr('class', 'btnOpen');
                    return false;
                }
            });

            function treeInit(status) {
                if (status == 'close') {
                    $treeList.find('ul').hide();
                    $('a.treeCtrl').find('span').attr('class', 'btnOpen');
                } else if (status == 'open') {
                    $treeList.find('ul').show();
                    $('a.treeCtrl').find('span').attr('class', 'btnClose');
                }
            }
            treeInit('close');
        }
        /* snbTree */, initSnbTreeOnce: function initSnbTreeOnce() {
            var lastEvent = null;
            var slide = ".menuList > li > ul";
            var alink = ".menuList > li > a";
            var aslink = ".menuList > li li a";

            function accordion() {
                if (this == lastEvent) return false;
                lastEvent = this;
                setTimeout(function () { lastEvent = null }, 200);

                if ($(this).attr('class') != 'active') {
                    $(slide).slideUp();
                    $(this).next(slide).slideDown();
                    $(alink).removeClass('active');
                    $(this).addClass('active');
                } else if ($(this).next(slide).is(':hidden')) {
                    $(slide).slideUp();
                    $(this).next(slide).slideDown();
                } else {
                    $(this).next(slide).slideUp();
                }
            }
            $(alink).click(accordion).focus(accordion);
            $(aslink).click(function () {
                $(aslink).removeClass('on');
                $(this).addClass('on');
            })
            
        }
        /* snbView */, initSnbViewOnce: function initSnbViewOnce() {
            $(document)
				.on('show', 'nav.snb', function () {
				    $('html').removeClass('snbOff');
				    $('html').addClass('snbView');
				    $('a.btnMenu').removeClass('jsNavSnb');
				    $('a.btnMenu').addClass('jsNavSnbClose');
				})
				.on('hide', 'nav.snb', function () {
				    $('html').removeClass('snbView');
				    $('html').addClass('snbOff');
				    $('a.btnMenu').removeClass('jsNavSnbClose');
				    $('a.btnMenu').addClass('jsNavSnb');
				})
				.on('click', 'a.jsNavSnb', function (e) {
				    if (!$('html').hasClass('snbView')) {
				        $('nav.snb').trigger('show');
				    }

				    e.preventDefault();
				    e.stopPropagation();
				})
				.on('click', 'a.jsNavSnbClose', function (e) {
				    $('nav.snb').trigger('hide');
				    e.preventDefault();
				})
				.on(Class.evTouchStart, '#content', function () {
				    $('nav.snb').trigger('hide');
				})

        }
        /* 레이어 팝업 버튼 세팅 */, initLayerPopupOnce: function initLayerPopupOnce() {
            $(document)
				.on('click', 'a.jsbtnLyp', function (e) {
				    var popID = $(this).attr('rel');
				    Class.layerPopupOpen(popID);
				    
				    e.preventDefault();
				    e.stopPropagation();
				})
				.on('click', '.lyPopWrap .jsPopClose', function (e) {
				    $(this).parents('.lyPopWrap').trigger('closePopup');
				    e.preventDefault();
				})
				.on('closePopup', '.lyPopWrap', function (e) {
				    $(this).hide();
				    $('#popFade').hide();
				    if ($('.popWrap').length < 1)
				        $('html').removeClass('hidden');

				    e.stopPropagation();
				});
        }

        /* Layer Popup 열기 */, layerPopupOpen: function layerPopOpen(id) {
            var $popObj = $('#' + id);
            $('body').append($popObj);

            $popObj.show().css({ 'width': 300 }); //Number(width)

            var popMargTop = ($popObj.height()) / 2;
            var popMargLeft = ($popObj.width()) / 2;

            $popObj.css({
                'margin-top': -popMargTop,
                'margin-left': -popMargLeft
            });

            var $wrap = $('body');

            if ($wrap.find('#popFade').length < 1) {
                $wrap.append('<div id="popFade"></div>')
            }
            $('#popFade').show();
            $('html').addClass('hidden');
        }
        /* 레이아웃 세팅 */, initLayoutOnce: function initLayoutOnce() {
            $(document).on('setLayout', function () {
                var $wrap = $('#wrap');
                var $wrapH = $wrap.outerHeight();
                var $header = $('header');
                var $headerH = $header.outerHeight();
                var $snb = $('nav.snb');
                var $snbH = $snb.outerHeight();
                var $content = $('#content');
                var $contWrap = $('#contWrap');
                var $contWrapH = $contWrap.outerHeight();
                
                $header.css({ minWidth: Class.winWidth });
                $content.css({ minHeight: $wrapH - $headerH, height: $contWrapH });
                //alert($snbH)
                if (!Class.isWide) {
                    $snb.css({ height: '100%' , minHeight: $wrapH - $headerH });
                    $content.css({ minWidth: Class.winWidth, width: Class.winWidth});
                } else {
                    if (!Class.isMobile) {
                        $content.css({ minWidth: Class.winWidth - 300, width: Class.winWidth - 300});
                    } else {
                        $content.css({ minWidth: Class.winWidth - 278, width: Class.winWidth - 278});
                    }
                    
                    if ($contWrapH >= $wrapH - $headerH) {
                        $snb.css({height:$contWrapH})
                    } else {
                        $snb.css({ height: $wrapH - $headerH })
                    }
                }

                //$contWrap.trigger('setLayout');
            });
        }
        // 항상 마지막에
        /* 스크린 크기 변경시 */, initResizeOnce: function initResizeOnce() {
            $(window)
				.on('resize', function () {
				    Class.winWidth = window.innerWidth;
				    Class.winHeight = window.innerHeight;

				    if (Class.winWidth >= 768) {
				        $('html').addClass('wide').removeClass('narrow');
				        Class.isWide = true;
				    } else {
				        $('html').removeClass('wide').addClass('narrow');
				        Class.isWide = false;
				    }

				    $('nav.snb').trigger('hide');
				    $(document).trigger('setLayout');
				    //$('section.preview').trigger('resizeImgBoxInner');
				})
				.trigger('resize');
        }
        /* kgUI 초기화 */, init: function () {
            for (var func in Class) {
                if (Class.hasOwnProperty(func)) {
                    if (func !== 'init' && func.indexOf('init') == 0) {
                        var $document = $(document);
                        if (func.lastIndexOf('Once') + 4 == func.length && !$document.data(func)) {
                            $document.data(func, true);
                            Class[func].call(this);
                        } else if (func.lastIndexOf('Once') + 4 != func.length) {
                            Class[func].call(this);
                        }

                    }
                }
            }
        }
		/* tab 세팅 */	,initTabOnce: function initTabOnce() {
			$(document)
				.on('click', 'ul.tabs>li', function (e) {
					var $current = $(this);
					var index = $current.index();
					var $panels = $current.parent().siblings('.panels');
					var cls = $current.attr('class').match(/tc[0-9]*/)[0];

					$current.addClass(cls + '-selected').siblings().removeClass(cls + '-selected');
					var $target = $panels.find('>.' + cls + '-panel:eq(' + index + ')');
					$target.addClass(cls + '-selected').siblings().removeClass(cls + '-selected');

					e.stopPropagation();
					e.preventDefault();
				});
		}
    };

    if (typeof this['kgUI'] !== 'undefined') {
        this['kgUI']['mobile'] = Class;
    } else {
        this['kgUI'] = { mobile: Class };
    }

})();

//select Control
$.fn.jsSelectCtrl = function () {
    var $wrapper = $(this);

	$wrapper.find('.jsTab li').click(function () {
	    $('.jsTab li').removeClass('on');
	    $(this).addClass('on');
	    $(document).trigger('setLayout');
    })

};



$.fn.kgUI = kgUI.mobile.init;
$(function () {
    $(document).kgUI();
    $(document).jsSelectCtrl();
});
