/**
 * 
 * @authors AND (yanenfe@qq.com)
 * @date    2016-11-06 09:35:56
 * @version v1.0
 */
 /*获取元素*/
function $(sele) {
	var first = sele.substr(0,1);
	var isArr = sele.split(' ');
	if(first === '#' && isArr.length == 1){
		return document.getElementById(sele.substr(1));
	}else{
		if(first !== '#' && first !== '.' &&isArr.length == 1) {
			var arr = Array.from(document.getElementsByTagName(sele));
			return arr.length == 1 ? arr[0] : arr;
		}else {
			var arr = Array.from(document.querySelectorAll(sele));
			return arr.length == 1 ? arr[0] : arr;
		}
	}
}

/*随机函数*/
function random(arr) { // [ nub1, nub2 ]
	var max = Math.max(arr[0],arr[1]),
		min = Math.min(arr[0],arr[1]);
	return Math.round(Math.random() * (max - min) + min);
}

/*数组最大最小值*/
function maxMin(way,arr) {
	return Math[way].apply(null,arr);
}


/*滚轮事件*/
//上:true 下:false
function wheelfn(obj,callback) {
	if(window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
		obj.addEventListener('DOMMouseScroll',fn); //兼容FF
	}else {
		obj.addEventListener('mousewheel',fn); //兼容chrome IE
	}
	function fn(ev) {
		var e = ev||event;
		var agent = null;
		if(ev.detail) {
			agent = ev.detail<0?true:false;//ev.detail FF上负下正
		}else {
			agent = ev.wheelDelta>0?true:false; //ev.wheelDelta chrome IE上正下负
		}
		if(callback && typeof callback === "function") {
			callback(agent);
		}
	}
}
