/*Tween对象*/
var Tween = {
	linear: function (t, b, c, d){ //匀速
		return c*t/d + b;
	},
	easeIn: function(t, b, c, d){ //加速
		return c*(t/=d)*t + b;
	},
	easeOut: function(t, b, c, d){ //减速
		return -c *(t/=d)*(t-2) + b;
	},
	easeBoth: function(t, b, c, d){ //先加速后减速
		if ((t/=d/2) < 1) {
			return c/2*t*t + b;
		}
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInStrong: function(t, b, c, d){ //二次方加速
		return c*(t/=d)*t*t*t + b;
	},
	easeOutStrong: function(t, b, c, d){ //二次方减速
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeBothStrong: function(t, b, c, d){ //二次方先加速后减速
		if ((t/=d/2) < 1) {
			return c/2*t*t*t*t + b;
		}
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	elasticIn: function(t, b, c, d, a, p){ //弹性在开始方向
		if (t === 0) { 
			return b; 
		}
		if ( (t /= d) == 1 ) {
			return b+c; 
		}
		if (!p) {
			p=d*0.3; 
		}
		if (!a || a < Math.abs(c)) {
			a = c; 
			var s = p/4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	elasticOut: function(t, b, c, d, a, p){ //弹性在结束方向
		if (t === 0) {
			return b;
		}
		if ( (t /= d) == 1 ) {
			return b+c;
		}
		if (!p) {
			p=d*0.3;
		}
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},    
	elasticBoth: function(t, b, c, d, a, p){ //弹性 开始和结束都有
		if (t === 0) {
			return b;
		}
		if ( (t /= d/2) == 2 ) {
			return b+c;
		}
		if (!p) {
			p = d*(0.3*1.5);
		}
		if ( !a || a < Math.abs(c) ) {
			a = c; 
			var s = p/4;
		}
		else {
			var s = p/(2*Math.PI) * Math.asin (c/a);
		}
		if (t < 1) {
			return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
					Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		}
		return a*Math.pow(2,-10*(t-=1)) * 
				Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
	},
	backIn: function(t, b, c, d, s){ //回弹 在开始方向
		if (typeof s == 'undefined') {
		   s = 1.70158;
		}
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	backOut: function(t, b, c, d, s){ //回弹 在结束方向
		if (typeof s == 'undefined') {
			s = 2.70158;  //回缩的距离
		}
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	}, 
	backBoth: function(t, b, c, d, s){ //回弹 开始和结束都有
		if (typeof s == 'undefined') {
			s = 1.70158; 
		}
		if ((t /= d/2 ) < 1) {
			return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		}
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	bounceIn: function(t, b, c, d){ //碰撞 在开始方向
		return c - Tween['bounceOut'](d-t, 0, c, d) + b;
	},       
	bounceOut: function(t, b, c, d){ //碰撞 在结束方向
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
		}
		return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
	},      
	bounceBoth: function(t, b, c, d){ //碰撞 开始和结束都有
		if (t < d/2) {
			return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
		}
		return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
	}
};
/* 当css的参数个数小于3，获取否则 设置 */
function css(el,attr,val) {
	switch(attr){
		case "rotate":
		case "rotateX":
		case "rotateY":
		case "rotateZ":
		case "scale":
		case "scaleX":
		case "scaleY":
		case "skewX":
		case "skewY":
		case "translateX":
		case "translateY":
		case "translateZ":
			return cssTransform(el,attr,val);
	}
	/*参数小于3执行*/
	if(arguments.length < 3) { 
		var val  = 0; //声明变量val
		/*获取元素样式*/
		if(el.currentStyle) { //做判断，用于兼容IE 6 7 8
			val = el.currentStyle[attr]; //将获取到的当前样式值赋值给val
		} else {
			val = getComputedStyle(el)[attr];
		}
		if(attr == "opacity") { // 判断attr若为opacity
			val*=100; //处理js小数值计算不准确问题
		}
		return parseFloat(val); //转成浮点数，去掉单位
	}
	/*当参数为3个时执行如下代码*/
	if(attr == "opacity") { //判断attr是否为opacity
		el.style.opacity = val/100; //还原为小数值
		el.style.filter = "alpha(opacity = "+val+")"; //兼容IE
	} else { // attr不为opacity执行
		el.style[attr] = val + "px";//其他元素执行方法
	}
}
	// el 元素，target(对象：传入属性和值),time(时间),type(运动类型),callBack(回调函数),delay(回调函数延迟执行时间)
function mTween(el,target,time,type,callBack) {
	//参数默认值设置
	if(typeof time == 'undefined'){ 
		time = 400;
		type = 'linear';
	}//time,type未设置时，默认time:400，type:linear
	if(typeof time == 'string'){
		if(typeof type == 'undefined') {
			type = time;
			time = 400;
		}
		if(typeof type == 'function') {
			callBack = type;
			type = time;
			time = 400;
		}
		
	}
	if(typeof time == 'function'){
		callBack = time;
		type = 'linear';
		time = 400;
	}
	if(typeof time == 'number'){
		if(typeof type == 'undefined'){
			type = 'linear';
		}
		if(typeof type == 'function'){
			callBack = type;
			type = 'linear';
		}
	}
	var t = 0; // 从第0次开始
	var b = {}; //初始值
	var c = {};   //差值
	var d = time/20; // 运动的总次数等于总时间/间隔时间
	for(var s in target) { //获取target每个属性，并将每个属性赋值给s变量
		b[s] = css(el,s);  //每个对象的属性的初始值
		c[s] = target[s] - b[s]; //每个对象属性的差值
	}
	clearInterval(el.timer); //关闭上一个定时器
	/*定时器*/
	el.timer = setInterval(function(){
		t++; //次数自增
		if(t > d) {//判断执行次数是否大于总次数 
			clearInterval(el.timer); //条件成立 清除定时器
			// callBack&&setTimeout(callBack,delay); //回调函数,动画执行完了以后，要执行的内容 ，类型 function	
			if(typeof callBack === 'function'){
				setTimeout(function(){
				    callBack.call(el);
				},16);
			}
		} else {
			for(var s in target) {
				var val = Tween[type](t,b[s],c[s],d); //声明val用于获取每次运动后的返回值
				css(el,s,val); //将val赋值给el元素中的每个属性值
			}
		}

	},20);
}
function cssTransform(el,attr,val){
	if(typeof el.transform == "undefined"){
		el.transform = {};
	}
	if(typeof val == "undefined"){
		if(!el.transform[attr]){
			switch(s){
				case "scale":
				case "scaleX":
				case "scaleY":
					el.transform[attr] = 1;
					break;
				default:
					el.transform[attr] = 0;	
			}
		}
		return el.transform[attr];
	} else {
		var value = "";
		el.transform[attr] = val;
		for(var s in el.transform){
			switch(s){
				case "rotate":
				case "rotateX":
				case "rotateY":
				case "rotateZ":
				case "skewX":
				case "skewY":
					value += " "+s+"("+el.transform[s]+"deg)";
					break;
				case "translateX":
				case "translateY":
				case "translateZ":	
					value += " "+s+"("+el.transform[s]+"px)";
					break;
				case "scale":
				case "scaleX":
				case "scaleY":	
					value += " "+s+"("+el.transform[s]+")";
					break;	
			}
			
		}
		el.style.WebkitTransform = el.style.MozTransform = el.style.transform = value;
	}
}







/*抖函数 兼容版*/
//el要抖动的元素, attr要变化的样式, second要抖动的次数, callBack回调函数
function toShake(el,attr,second,callBack){
	if(typeof second === 'undefined') {
		second = 30;
	}
	if(typeof second ==='function') {
		callBack = second;
		second = 30;
	}
	if(typeof second === 'number') {
		
	}
	if(el.shake){
		return;
	} // 抖函数执行时，关闭这个抖函数，避免同时开启多个抖函数
	var arr = []; //创建数组用于存放要变化的数据。
	var b = css(el,attr); //获取元素样式当前值
	var nub = 0; 
	for(var i = second-1; i >= 0; i--){ //抖动的幅度越来越小，所有值在自减
		i%2?arr.push(i):arr.push(-i); //根据奇偶给对应的值取正负数
	}
	el.shake = setInterval(
		function(){
			if(nub >= second){ //当nub大于等于抖动的次数时
				clearInterval(el.shake);
				// callBack&&callBack();
				if(typeof callBack === 'function'){
					setTimeout(function(){
					    callBack.call(el);
					},16);
				}
			} else {
				var val = b + arr[nub]; 
				css(el,attr,val);  //给样式加值
				nub++;
			}
		},40
	);
}

/*抖函数translate版*/
//obj要抖动的元素，times抖动的时间，dir:Y或X，fn回调函数
function shake(obj,times,dir,fn) {
	if(typeof times === 'undefined') {
		times = 50;
		dir = 'Y';
	}
	if(typeof times === 'string') {
		if(typeof dir ==='undefined') {
			dir = times;
			times = 50;
		}
		if(typeof dir ==='function') {
			fn = dir;
			dir = times;
			times = 50;
		}
	}
	if(typeof times === 'function') {
		fn = times;
		times = 50;
		dir = 'Y';
	}
	if(typeof times === 'number') {
		if(typeof dir === 'undefined') {
			dir = 'Y';
		}
		if(typeof dir ==='function') {
			fn = dir;
			dir = 'Y';
		}
	}
	var arr = [];
	for(var i=times; i>=0; i--){
		arr.push(i,-i);
	}
	arr.push(0);
	var n = 0;
	clearInterval(obj.timer);
	obj.timer = setInterval(function() {
		obj.style.transform = 'translate'+dir+'('+arr[n]+'px)';
		n++;
		if(n == arr.length){
			clearInterval(timer);
			if(typeof fn == 'function'){
				setTimeout(fn, 16);
			}
		}
	}, 16);
}



/*速度版运动*/
//匀速运动
function linearMove(el,target,speed,callBack){
	clearInterval(el.timer);
	var d = 0;
	var t = 0;
	var speeds = {};
	for(var s in target){
		var now = css(el,s);
		var dis = target[s] - now;
		var sD = Math.ceil(Math.abs(dis/speed));
		d = Math.max(d,sD);
	}
	for(var s in target){
		var now = css(el,s);
		var dis = target[s] - now;
		speeds[s] = dis/d;
	}
	el.timer = setInterval(function(){
		t++;
		if(t >= d){
			clearInterval(el.timer);
			if(typeof callBack === 'function'){
				setTimeout(function(){
				    callBack.call(el);
				},16);
			}
		}
		for(var s in target){
			var now = css(el,s);
			now += speeds[s];
			css(el,s,now);
		}
	},20);
}

//缓冲运动
function bufferMove(el,attr,target,AC){
	clearInterval(el.timer);
	el.timer = setInterval(function(){
		var now = css(el,attr);
		var speed = (target - css(el,attr))*AC;	
		if( Math.abs(target - now) < 2){
			clearInterval(el.timer);
			now = target;
			css(el,attr,now);
		} else {
			now += speed;
			css(el,attr,now);
		}
	},20);
}