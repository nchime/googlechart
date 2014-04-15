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
        /* 조직도 트리 */, initTreeOnce: function initTreeOnce() {
            var $treeList = $('#treeList');

            $treeList.find('li:has("ul")').prepend('<a href="#" class="treeCtrl"><span class="btnClose"></span></a> ');
            $treeList.find('li:last-child').addClass('end');

            $(document)
                .on('click', '.treeCtrl', function (e) {
				    var temp_el = $(this).siblings('ul');
				    if (!temp_el.is(':visible')) {
				        temp_el.slideDown(100, function () {
				            $(document).trigger('setLayout');
				        });
				        $(this).addClass('on');
				        $(this).find('span').attr('class', 'btnClose');
				        return false;
				    } else {
				        temp_el.slideUp(100, function () {
				            $(document).trigger('setLayout');
				        });
				        $(this).removeClass('on');
				        $(this).find('span').attr('class', 'btnOpen');
				        return false;
				    }
				    
				})
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
            $('.treeCtrl:first').addClass('on').find('span').attr('class', 'btnClose');
            $('.treeCtrl:first').parent().find('>ul').slideDown(100);
            $(document).trigger('setLayout');
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
                var $footer = $('#footer');
                var $footerH = $footer.outerHeight();
                //var $mailListWrap = $wrap.find('.mailListWrap');
                //var $titWrapH = $wrap.find('.titWrap').outerHeight();
                //var $srchWrapH = $wrap.find('.srchWrap').outerHeight();
                //var $listMoreWrapH = $wrap.find('.listMoreWrap').outerHeight();

                $header.css({ minWidth: Class.winWidth, width: Class.winWidth });

                //$content height
                if ($content.hasClass('intro')) {
                    $content.css({ minHeight: $wrapH, height: $wrapH })
                    $contWrap.find('.introTitle').css({ marginTop: ($wrapH - 300) / 2});
                } else {
                    $content.css({ minHeight: $wrapH - $headerH - 62, height: $contWrapH + 39 });
                }
                
                //$snb height, $content width
                if (!Class.isWide) {
                    $snb.css({ height: '100%' , minHeight: $wrapH - $headerH });
                    $content.css({ minWidth: Class.winWidth, width: Class.winWidth});
                } else {
                    if (!Class.isMobile) {
                        if ($content.hasClass('intro')) {
                            $content.css({ minWidth: Class.winWidth, width: Class.winWidth });
                        } else {
                            $content.css({ minWidth: Class.winWidth - 300, width: Class.winWidth - 300 });
                        }

                    } else {
                        if ($content.hasClass('intro')) {
                            $content.css({ minWidth: Class.winWidth, width: Class.winWidth });
                        } else {
                            $content.css({ minWidth: Class.winWidth - 278, width: Class.winWidth - 278 });
                        }
                        
                    }
                    
                    if ($contWrapH >= $wrapH - $headerH - $footerH -39 ) {
                        $snb.css({height:$contWrapH + 39})
                    } else {
                        $snb.css({ height: $wrapH - $headerH - 62 })
                    }
                }

                //모바일 그룹웨어 버튼
                if ($('.quickLink').length > 0) {
                    var $quickLinkli = $('.quickLink li');
                    if (!Class.isWide) {
                        $quickLinkli.css({ width: ($contWrap.outerWidth() - 16) / 2 });
                    } else {
                        $quickLinkli.css({ width: ($contWrap.outerWidth() - 32) / 3 });
                    }
                }
				//모바일 그룹웨어 버튼 KW_002
				if ($('.quickLink2').length > 0) {
					var $quickLinkli2 = $('.quickLink2 li');
					if (!Class.isWide) {
						$quickLinkli2.css({ width: ($contWrap.outerWidth() - 16) / 2 });
					} else {
						$quickLinkli2.css({ width: ($contWrap.outerWidth() - 35) / 2 });
					}

				}
                //메일 리스트
				//if ($mailListWrap.length > 0) {
				//    $mailListWrap.css({ height: Class.winHeight - $footerH - $headerH - $titWrapH - $srchWrapH - $listMoreWrapH })
				//}
            });
        }
        /* tab 세팅 */, initTabOnce: function initTabOnce() {
            $(document)
				.on('click', 'ul.tabs>li', function (e) {
				    var $current = $(this);
				    var index = $current.index();
				    var $panels = $current.parent().siblings('.panels');
				    var cls = $current.attr('class').match(/tc[0-9]*/)[0];
				    var $target = $panels.find('>.' + cls + '-panel:eq(' + index + ')');
				    var $panelCon = $target.find('.panelCon');


				    $current.addClass(cls + '-selected').siblings().removeClass(cls + '-selected');
				    $target.addClass(cls + '-selected').css({ height: $panelCon.outerHeight() }).siblings().removeClass(cls + '-selected').parent('.panels').css({ height: $panelCon.outerHeight() });

				    $(document).trigger('setLayout');
				    e.stopPropagation();
				    e.preventDefault();
				})
            .on('setTabLayout', function (e) {
                var $wrap = $('#wrap');
                var $tabWrap = $wrap.find('.tabWrap');
                var $tabContH = $tabWrap.find('li.on .tabCont table').outerHeight();

                if ($tabWrap.length > 0) {
                    $tabWrap.css({ height: $tabContH + 59 });
                    $(document).trigger('setLayout');
                }
            });

        }
        /*input 세팅*/, initCheckLabelOnce: function initCheckLabelOnce() {
            $(document)
				.on('click', 'input:checkbox, input:radio', function () {
					
					var $input = $(this);

					if($input.attr('type')=='radio') {
						var name = $input.attr('name');
						$input = $('input[name="'+name+'"]');
					}

					$input.each(function() {
						var $label = $(this).parents('label');
						if($label.length<1)
							$label = $('label[for="'+$(this).attr('id')+'"]');

						if(this.checked) {
							$label.addClass('on');
						} else {
							$label.removeClass('on');
						}
					});
				})
            
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
				.trigger('resize')
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
		
    };

    if (typeof this['kgUI'] !== 'undefined') {
        this['kgUI']['mobile'] = Class;
    } else {
        this['kgUI'] = { mobile: Class };
    }

})();

//select Control
$.fn.jsSelectCtrl = function () {
    var $wrap = $('#wrap');

    $wrap.find('.jsTab li').click(function () {
        $('.jsTab li').removeClass('on');
        $(this).addClass('on');
        $(document).trigger('setLayout');
        $(document).trigger('setTabLayout');
    });
    
};



$.fn.kgUI = kgUI.mobile.init;
$(function () {
    $(document).kgUI();
    $(document).jsSelectCtrl();
    $(document).trigger('setTabLayout');
});
