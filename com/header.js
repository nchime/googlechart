

//상위로
function goListTop()
{
	var opts = {scrollTop:0};
	$("#wrap").animate(opts);
}

/* <a href="#" class="listTop"  onclick="javascript:goListTop();"> */



document.write(" <body> ");
document.write("     <div id='wrap'> ");
document.write(" <header> ");
document.write("     <div class='top'> ");
document.write("         <a href='#' class='btnMenu jsNavSnb'>목록</a> ");
document.write("         <h1><a href='./SWMO_EB_002.html'><span class='spr headerEB'></span>전자게시판</a></h1> ");
document.write("         <a href='./SWMO_EB_002.html' class='btnHome'>홈</a> ");
document.write("     </div> ");
document.write(" </header> ");