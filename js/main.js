var iSec=getId('section');
var iList=getId('list');
var iNav=getId('nav-right');
var listLi=getClass(iList,'cont');
var iNow=0;
var c1Bg=getId('cont1-bg');
var c1BgLi=c1Bg.getElementsByTagName('li');
var c4Bg=getId('cont4-bg');
var c4BgLi=c4Bg.getElementsByTagName('li');
var arrBg=[];
var video=getId('video_player');
var ratio=video.width/video.height;
var videobt=getId('c3-play');
arrBg.push(c1BgLi);
arrBg.push(c4BgLi);
var winPeople=getId('window-people');
var mask=getId('ucmask');
var videobox=getId('video-box');
var vMain=getId('video-main');

//设置尺寸
function setSize(){
	var ch=document.documentElement.clientHeight;
	var cw=document.documentElement.clientWidth;
	iNav.style.top=(ch-iNav.offsetHeight)/2+'px'; //右部导航位置
	iSec.style.height=iList.style.height=ch+'px'; //section 尺寸
	//section 下 每个list尺寸
	for(var i=0;i<listLi.length;i++)
	{
		listLi[i].style.height=ch+'px';
	}
	//背景图尺寸
	for(var i=0;i<arrBg.length;i++)
	{
		for(var j=0;j<arrBg[i].length;j++)
			arrBg[i][j].style.height=parseInt(ch/3)+'px';
	}
	//list 位置
	iList.style.top=-iNow*ch+'px';

	//设置 cont3 背景视频尺寸
	if(cw/ch>=ratio)
	{
		video.style.width=cw+'px';
		video.style.height=cw/ratio+'px';
		video.style.top=-(video.offsetHeight-ch)/2+'px';
		video.style.left=0;
	}
	else
	{
		video.style.width=ch*ratio+'px';
		video.style.height=ch+'px';
		video.style.left=-(video.offsetWidth-cw)/2+'px';
		video.style.top=0;
	}
	//弹出视频尺寸、位置
	mask.style.width=cw+'px';
	mask.style.height=ch+'px';
	videobox.style.left=(cw-680)/2+'px';
	videobox.style.top=(ch-500)/2+'px';
}
setSize();

window.onresize=setSize;

var oLi=iNav.getElementsByTagName('li');
/*导航*/
function navRigth(){

	for(var i=0;i<oLi.length-1;i++)//不对分享按钮添加时间
	{
		oLi[i].index=i;
		oLi[i].onclick=function(){
			toMove(this.index);
		}
	}
	/**
	 * 分享按钮*/
	var sBt=getId('share');
	sBt.onmousemove=function(){
		var cw=document.documentElement.clientWidth;
		var share1=document.getElementsByClassName('bdshare_popup_box')[0];
		share1.style.left=(cw-share1.offsetWidth-50)+'px';
	}

}
navRigth();


/*上下切换*/
var timer=null;
function toMove(i){
	if(timer||iNow==i)//timer不为null 或 移动至当前cont，return
		return;
	var key=getId("key");
	var ch=document.documentElement.clientHeight;
	var oldList=listLi[iNow].lastElementChild||listLi[iNow].lastChild;
	oldList.className='close';
	if(iNow<i)
	{
		key.className="keydown";
	}
	else
	{
		if(iNow==oLi.length-2)
			key.className="keydown";
		else
			key.className="keyup";
	}
	//http://code.ciaoca.com/jquery/easing/     easing插件
	$('#list').animate({top:-i*ch+"px"},800,'easeInOutExpo', function () {
		var newList=listLi[i].lastElementChild||listLi[i].lastChild;
		newList.className='zoom1';
		for(var j=0;j<oLi.length;j++)
		{
			oLi[j].className="";
		}
		oLi[i].className="active";
		key.className="";
	});
	timer=setTimeout(function(){
		clearTimeout(timer);
		timer=null;
	},1400);
	iNow=i;

	//滑动到cont2 播放背景视频
	if(iNow==2)
	{
		videoPlay();
	}
	else
	//停止视频
	{
		video.currentTime = 0;
		video.pause();
	}
	winPeople.style.display='none';//关闭cont3 左右切换图
	closeMask();//关闭弹窗视频
}

/*键盘事件*/
function key(){
	document.onkeydown=function(ev){
		var oEvt=ev||event;
		// console.log(oEvt.keyCode);//KeyboardEvent
		switch(oEvt.keyCode){
			case 38:
				if(iNow>0)
					toMove(iNow-1);
				break;
			case 40:
				if(iNow==oLi.length-2)
				toMove(0);
					toMove(iNow+1);
				break;
		}
	};
}
key();
/*鼠标滚轮事件*/
function scroll(){
	function scrollFunc(ev) {
		var a = ev || window.event;
		if (a.wheelDelta) {
			if (a.wheelDelta > 0 && iNow>0) { //当滑轮向上滚动时
				toMove(iNow-1);
			}
			if (a.wheelDelta < 0 && iNow<oLi.length-1) { //当滑轮向下滚动时
				if(iNow==oLi.length-2)
					toMove(0);
				toMove(iNow+1);
			}
		} else if (a.detail) {  //Firefox滑轮事件的值 / 3。
			if (a.detail> 0 && iNow<oLi.length-1) {  //当滑轮向下滚动时
				if(iNow==oLi.length-2)
					toMove(0);
				toMove(iNow+1);
			}
			if (a.detail< 0 && iNow>0) {           //当滑轮向上滚动时
				toMove(iNow-1);
			}
		}
	}
	if (document.addEventListener) {
		document.addEventListener('DOMMouseScroll', scrollFunc, false);//冒泡阶段执行
	}
	window.onmousewheel=document.onmousewheel=scrollFunc;
}
scroll();

/*cont2*/
function cont2(){
	var video=getId('cont2-video');
	var title= getClass(video,'video-title')[0];
	var list= getClass(video,'video-list')[0];
	var tLi=title.getElementsByTagName('li');
	var vLi=list.getElementsByTagName('li');
	var arr=[{title:'懂我所爱',src:'video/ucproduct1.mp4'},{title:'懂我所爱',src:'video/video.mp4'}];
	for( var i=0;i<tLi.length;i++)//视频标签
	{
		tLi[i].index=i;
		tLi[i].onclick=function(){
			title.style.backgroundPosition='0 '+(-30*this.index)+'px';
			list.style.marginLeft=(-350*this.index)+'px';
		}
	}
	for(var i=0;i<vLi.length;i++)
	{
		vLi[i].index=i;
		vLi[i].onclick=function(){
			maskvideo(arr[this.index].title,arr[this.index].src);//弹窗视频播放
		}
	}
	var iTri=getId('triangle');
	var iMob=getId('mobile');
	shine(iMob,iTri,10);//跟随鼠标闪动
}
cont2();
/*cont3*/
function cont3(){
	var video1=getId('cont3-video');
	var title= getClass(video1,'video-title')[0];
	var list= getClass(video1,'video-list')[0];
	var tLi=title.getElementsByTagName('li');
	var vLi=list.getElementsByTagName('li');
	var arr=[{title:'亲情篇',src:'video/video.mp4'},{title:'爱情篇',src:'video/video.mp4'},{title:'梦想篇',src:'video/video.mp4'}]
	for( var i=0;i<tLi.length;i++)
	{
		tLi[i].index=i;
		tLi[i].onclick=function(){
			title.style.backgroundPosition='0 '+(-30*this.index)+'px';
			list.style.marginLeft=(-510*this.index)+'px';
		}
	}
	for(var i=0;i<vLi.length;i++)
	{
		vLi[i].index=i;
		vLi[i].onclick=function(){
			maskvideo(arr[this.index].title,arr[this.index].src);
		}
	}
	//监听事件  视频播放结束触发
	video.addEventListener("ended",function(){
		video.nextElementSibling.style.opacity='1';//显示背景图
		videobt.style.display='block';
	});
	videobt.onclick=videoPlay;
}
cont3();

/*cont3 背景视频播放*/
function videoPlay(){
	video.nextElementSibling.style.opacity='0';//隐藏背景图
	videobt.style.display='none';
	video.play();
}
/*cont4*/
function cont4(){
	var c4=getId('cont4');
	var tatter=getId('tatter');
	shine(c4,tatter,10);
	var now=0;
	var c4People=getId('c4-people');
	var pLi=c4People.getElementsByTagName('li');

	var btLeft=getId('btleft');
	var btRight=getId('btright');
	var btClose=getId('btclose');
	var list=getId('imglist');
	var num=638;
//	console.log(num);


	btClose.onclick=function(){
		winPeople.style.display='none';
	}
	btLeft.onclick=function(){
		if(now==0)
			return false;
		else
			move(--now);
	}
	btRight.onclick=function(){
		if(now==list.children.length-1)
			return false;
		else
			move(++now);
	}
	for(var i=0;i<pLi.length;i++)
	{
		pLi[i].index=i;
		pLi[i].onclick=function(){
			winPeople.style.display='block';
			now=this.index;
			move(now);
			//	console.log(this.index);
		}
	}
	function move(){
		$('#imglist').animate({left:-num*now+"px"},300,'linear');
		if(now==0)
			btLeft.style.opacity='0.5';
		else if(now==list.children.length-1)
			btRight.style.opacity='0.5';
		else
			btLeft.style.opacity=btRight.style.opacity='1';
	}
}
cont4();
/*cont5*/
function cont5(){
	var cV=getId('c5-video');
	console.log(cV);
	cV.children[0].onclick=function(){
		maskvideo('给的再多，不如懂我','video/dong_mv.mp4');
	}
}
cont5();


function shine(obj1,obj2,step){
	obj1.onmousemove=function(ev){
		var oEvt=ev||event;
		var mX=oEvt.clientX;
		var mY=oEvt.clientY;
		var cH=document.documentElement.clientHeight;
		var cW=document.documentElement.clientWidth;
		var o={x:parseInt(cW/2),y:parseInt(cH/2)};//设置参考点
		var x=-step*((mX- o.x)/ o.x);//相对参考点坐标  右为正  下为正
		var y=-step*((mY- o.y)/ o.y);
	//	console.log(x+','+y);
		obj2.style.transition='none';
		obj2.style.transform='translate3d('+x+'px,'+y+'px,'+'0px)';
	}
}

function maskvideo(title,src){
	var btclose=getId('video-close');
	var oT=getId('video-title');
	oT.innerHTML=title;
	mask.style.display=videobox.style.display='block';
	vMain.innerHTML='<video width="640" height="360" src="'+src+'" autoplay controls></video>';
	btclose.onclick=function(){
		mask.style.display=videobox.style.display='none';
	}
}
function closeMask(){
	mask.style.display=videobox.style.display='none';
	vMain.innerHTML='';
}
closeMask();
/*获取ID*/
function getId(id){
	return document.getElementById(id);
}

/*通过祖辈（外层）获取子元素 class（内层）*/
function getClass(par,className){
	var aElem=par.getElementsByTagName('*');
	var arr=[];
	for(var i=0;i<aElem.length;i++)
		if(aElem[i].className==className)
			arr.push(aElem[i]);
	return arr;
}

