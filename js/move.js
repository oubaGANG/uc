window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function getStyle(obj,name){
	return obj.currentStyle?obj.currentStyle[name]:getComputedStyle(obj,false)[name];
}
function move(obj,json,optional){
	optional=optional||{};
	optional.time=optional.time||300;
	optional.fn=optional.fn||null;
	optional.type=optional.type||"ease-in";

	var start={};
	var dis={};
	for(var key in json){
		start[key]=parseFloat(getStyle(obj,key));
		dis[key]=json[key]-start[key];
	}
	var count=Math.round(optional.time/20);
	var n=0;
//	clearInterval(obj.timer);
	function run(){
		n++;
		for(var key in json){
			switch(optional.type){
				case "linear":
					var a=n/count;
					var cur=start[key]+dis[key]*a;
				break;
				case "ease-in":
					var a=n/count;
					var cur=start[key]+dis[key]*a*a*a;
				break;
				case "ease-out":
					var a=1-n/count;
					var cur=start[key]+dis[key]*(1-a*a*a);
				break;
			}
				if(key=="opacity"){
					obj.style.opacity=cur;
					obj.style.filter="alpha(opacity"+cur*100+")";
				}else{
					obj.style[key]=cur+"px";
				}
				if(n==count){
			//		clearInterval(obj.timer);
					optional.fn&&optional.fn();
				}
				else
				{
					requestAnimationFrame(run);
				}
		}
		
	}

	requestAnimationFrame(run);
}