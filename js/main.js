var arr = [1,3,5,7,9,11,9,7,5,3,1];
/*初始化变化和方法****************************************/
var oSence = document.querySelector('.scene');
var oBox = oSence.querySelector('.box');
var oUl = oBox.getElementsByTagName('ul')[0];
var aLi = oUl.getElementsByTagName('li');
var btns = document.querySelectorAll('#nav li');
var lava = document.getElementById('lavalamp');
var theta = Math.PI/(arr.length-1);
var phi = 0;
var r = 2500;
var angleX = 0;
var angleY = 0;
var onOff = true;
var isClick = false;
var isSlide = false;
var isDrag = true;
var arrLi = [];
var timer1= null;
var timer2 = null;
var now = 0;
var arrDiv = [];
/*初始化主要逻辑*****************************************/
star();
drawCylinder();
drag();
doBoom();
doChange();




/*需求***************************************************/

//需求1:出场状态 圆球
function star(){
    oSence.style.left = (document.documentElement.clientWidth - oSence.offsetWidth)/2 +'px';
    //创建li 圆球自定义属性
    for (var i = 0; i < arr.length; i++) {
        phi = 2*Math.PI/arr[i];
        for (var j = 0; j < arr[i]; j++) {
           var li = document.createElement('li');
           circle(li,theta,phi,i,j);
           setRound(li);
           arrLi.push(li);
        }
    }

     //圆柱/斜圆柱自定义属性
    var liNub = 0;
    columnH = Math.floor(arrLi.length/(arr.length-2));
    columnNum = columnH*(arr.length-2);
    for(var i=0; i<arr.length-1; i++){
        phi = 2*Math.PI/columnH;
        for(var j=0; j<columnH; j++){
            column(arrLi[liNub],phi,i,j);
            italicColumn(arrLi[liNub],phi,i,j);
            liNub++;
        }
    }


    //画圆球
    for (var i = 0; i < arrLi.length; i++) {
        var h2 = document.createElement('h2');
        var p = document.createElement('p');
        p.className = 'shadow';
        arrLi[i].appendChild(h2);
        arrLi[i].appendChild(p);
        arrLi[i].style.opacity = 0;
        setCss3(arrLi[i],{transform:'translate3D('+ arrLi[i].tX +'px,'+ arrLi[i].tY +'px,'+ arrLi[i].tZ +'px) rotateY('+ arrLi[i].rY +'deg) rotateX('+ arrLi[i].rX +'deg)'});
        
        creatParts(arrLi[i],i%25);
        oUl.appendChild(arrLi[i]);
    }

    //出场动画效果
    setTimeout(function(){
        for (var i = 0; i < arrLi.length; i++) {
            arrLi[i].className = 'one';
            arrLi[i].style.opacity = 1;
            setCss3(arrLi[i],{transform:'translate3D('+ arrLi[i].circleX +'px,'+ arrLi[i].circleY +'px,'+ arrLi[i].circleZ +'px) rotateY('+ arrLi[i].circlePhi +'rad) rotateX('+ arrLi[i].circleTheta +'rad)'});
        }
    },300);

    //每个li里创建100个div
    function creatParts(obj,n) {
        var W = 96;
        var H = 60;
        for(var i=0;i<100;i++){
            var div = document.createElement('div');       
            div.cells = i%10;
            div.rows = parseInt(i/10);
            setRound(div);
            div.style.backgroundImage = 'url(img/'+n+'.jpg)';
            div.style.backgroundPosition = -div.cells*W+'px -'+div.rows*H+'px';
            obj.appendChild(div);
        }
    }
}


//需求2:拖拽旋转 鼠标滚轮拉近   鼠标双击图片展开
function drag() {
    
    //拖拽
    oSence.onmousedown = function(ev){
        if(isDrag) {
            clearInterval(timer1);
            clearInterval(timer2);
            var e = ev||event;
            var clickX = e.clientX;
            var clickY = e.clientY;
            var disX = 0;
            var disY = 0;
            document.onmousemove = function(ev){
                var e = ev||event;
                disX = e.clientX - clickX;
                disY = e.clientY - clickY;
                oBox.style.transform = 'translateZ('+now+'px) rotateX('+(angleX - disY)+'deg) rotateY('+(angleY+disX)+'deg)';
            };
            document.onmouseup = function(){
                // clearInterval(timer2);
                document.onmousemove = null;
                document.onmouseup = null;
                angleX = angleX - disY;
                angleY = angleY + disX;

                //判断单击后继续转
                // if(disY==0 && disX==0){
                //     disX = -300;
                // }
                timer2 = setInterval(function(){
                    angleX -= disY/100;
                    angleY += disX/100;
                    oBox.style.transform = 'translateZ('+now+'px) rotateX('+angleX+'deg) rotateY('+angleY+'deg) ';
                },60);
            };
        }
        return false;
    };

    //旋转
    timer1 = setInterval(function(){
        angleX -= 1;
        angleY -= 1;
        setCss3(oBox,{ transform: 'translateZ('+now+'px) rotateX('+ angleX +'deg) rotateY('+ angleY +'deg) ' });

    },60);
    //鼠标滚轮
    wheelfn(oSence,function(o){
        if(onOff) {
            if(o) {
                now += 50;
                oBox.style.transform = 'translateZ('+now+'px) rotateX('+angleX+'deg) rotateY('+angleY+'deg) ';
            }else {
                now -= 50;
                oBox.style.transform = 'translateZ('+now+'px) rotateX('+angleX+'deg) rotateY('+angleY+'deg) ';
            }
        }
    });

    //鼠标双击图片效果
    oUl.ondblclick = function(ev) {
        clearInterval(timer2);
        isDrag = false;
        onOff = false;
        isClick = true;
        if(ev.target.parentNode.nodeName.toLowerCase() == 'li') {
            for (var i = 0; i < aLi.length; i++) {
                aLi[i].className = 'all';
                aLi[i].style.transform = 'translate3D('+ aLi[i].bigCircleX +'px,'+ aLi[i].bigCircleY +'px,'+ aLi[i].bigCircleZ +'px) rotateY('+ aLi[i].circlePhi +'rad) rotateX('+ aLi[i].circleTheta +'rad)';
                aLi[i].style.opacity = 0;
            }
            oBox.style.transform = '';
            ev.target.parentNode.style.opacity = '1';
            ev.target.parentNode.style.transform = '';
            for(var i = 0;i < btns.length;i++) {
                btns[i].firstElementChild.className = '';
                btns[1].firstElementChild.className = 'active';
                lava.style.left = '90px';

            }
        }

    };
    
}



//需求3:点击div爆炸效果
function doBoom() {
    var nub = 200;
    var maxZ = 13;
    var minZ = 50;
    var n = 0;
    for (var i = 0; i < arrLi.length; i++) {
        arrLi[i].onclick = function(ev) {
            if(isClick) {
                var ele = ev.target;
                var divs = this.children;
                if(ele.nodeName.toLowerCase() == 'div') {
                    n++;
                    for(var i=0;i<divs.length;i++){
                        divs[i].style.transition = '0.1s'; 
                        var disX = divs[i].cells-ele.cells;
                        var disY = divs[i].rows-ele.rows;
                        boom(divs[i],disX,disY);
                    }   
                }
            }
        };
    }
    function boom(el,disX,disY){
        var delay = Math.abs(disX)+Math.abs(disY);
        var disZ = Math.sqrt(disX*disX+disY*disY);
        var TranslateZ = (maxZ-disZ)/maxZ*nub+minZ;
        disX = disX == 0?.5:disX;
        disY = disY == 0?.5:disY;
        var TranslateX = disX/Math.abs(disX)*Math.abs(disX)*80;
        var TranslateY = disY/Math.abs(disY)*Math.abs(disY)*80;
        var rotateX = disY/Math.abs(disY)*720+(Math.random()-.5)*720;
        var rotateY = disX/Math.abs(disX)*720+(Math.random()-.5)*720;           
        mTween(el,{
                opacity: 0, 
                translateZ:TranslateZ,
                translateX:TranslateX,
                translateY:TranslateY,                  
                rotateY:rotateY,
                rotateX:rotateX                 
            },400,'linear',function() {
                el.style.backgroundImage = 'url(img/'+n%25+'.jpg)';
                mTween(el,{
                opacity: 100,   
                translateZ:0,
                translateX:0,
                translateY:0,                   
                rotateY:0,
                rotateX:0                   
                },400,'linear');
            });     
    }

}
//需求4:按钮点击切换场景
function doChange() {
    var lavaArr = [13,90,170,250];
    for(var i = 0;i < btns.length;i++) {
        btns[i].index = i;
        btns[i].addEventListener('click',function(){
            now = 0;
            angleX = 0;
            angleY = 0;
            for(var i = 0;i < btns.length;i++) {
                btns[i].firstElementChild.className = '';
            }
            this.firstElementChild.className = 'active';
            lava.style.left = lavaArr[this.index] + 'px';

            if(this.index != 1) {
                console.log(this.index);
                isDrag = true;
                onOff = true;
                isClick = false;
            }
            for(var i = 0;i < arrDiv.length;i++) {
                arrDiv[i].style.opacity = 0;
                arrDiv[i].style.left = 0;
                arrDiv[i].style.transform = 'translate3D('+arrDiv[i].tX+'px,'+arrDiv[i].tY+'px,'+arrDiv[i].tZ+'px) rotateX('+arrDiv[i].rX+'deg) rotateY('+arrDiv[i].rY+'deg) rotateZ('+arrDiv[i].rZ+'deg)';
            }
        });
        btns[i].addEventListener('mouseover',function(){
            lava.style.left = lavaArr[this.index] + 'px';
        });
    }

    //球转场效果
    btns[0].onclick = function() {
        //圆球切换模拟爆炸
       startChange();
        //圆球从爆炸复原
        setTimeout(function(){
            changeCircle();
        },1050);
    };
    //平面转场效果
     btns[1].onclick = function() {
        //100div模拟爆炸
        isDrag = false;
        onOff = false;
        isClick = true;
        // oSence.onmousedown = null;
        for (var i = 0; i < aLi.length; i++) {
            aLi[i].className = 'all';
            aLi[i].style.transform = 'translate3D('+ aLi[i].bigCircleX +'px,'+ aLi[i].bigCircleY +'px,'+ aLi[i].bigCircleZ +'px) rotateY('+ aLi[i].circlePhi +'rad) rotateX('+ aLi[i].circleTheta +'rad)';
            aLi[i].style.opacity = 0;
        }
        clearInterval(timer1);
        clearInterval(timer2);
        oBox.style.transform = '';
        aLi[0].className = 'one';
        for(var i = 0; i < aLi[0].children.length;i++) {
            aLi[0].children[i].style.opacity = 0;
            aLi[0].children[i].style.transform = 'translateX('+aLi[0].children[i].tX+'px) translateY('+aLi[0].children[i].tY+'px) translateZ('+aLi[0].children[i].tZ+'px) rotateX('+aLi[0].children[i].rX+'deg) rotateY('+aLi[0].children[i].rY+'deg) rotateZ('+aLi[0].children[i].rZ+'deg)';
        }
        setTimeout(function(){
            mTween(aLi[0],{
                opacity:100,
                translateX:0,
                translateY:0,
                translateZ:0,
                rotateX:0,
                rotateY:0,
                rotateZ:0
            },300,'easeBoth',function(){
                for(var i = 0; i < aLi[0].children.length;i++) {
                    aLi[0].children[i].style.opacity = '1';
                    aLi[0].children[i].style.transform = '';
                }
            });
        },500);

     };

     //螺旋柱体转场效果
     btns[2].onclick = function() {
        startChange();
        setTimeout(function(){
            changeColumn2();
        },1050);
     };


}














//切换
function startChange(){
    for(var i=0; i<aLi.length; i++) {
        aLi[i].className = 'all';
        aLi[i].style.transform = 'translate3D(' + aLi[i].maxX + 'px,' + aLi[i].maxY + 'px,' + aLi[i].maxZ + 'px) rotateY(' + aLi[i].maxPhi + 'rad) rotateX(' + (aLi[i].maxTheta) + 'rad)';
        aLi[i].style.opacity = 0;
    }
}

//圆切换
function changeCircle() {
    for(var i=0; i<columnNum; i++){
        aLi[i].className = '';
        aLi[i].maxX = aLi[i].bigCircleX;
        aLi[i].maxY = aLi[i].bigCircleY;
        aLi[i].maxZ = aLi[i].bigCircleZ;
        aLi[i].maxTheta =aLi[i].circleTheta;;
        aLi[i].maxPhi = aLi[i].circlePhi;
        setCss3(aLi[i],{transform:'translate3D('+ aLi[i].maxX +'px,'+ aLi[i].maxY +'px,'+ aLi[i].maxZ +'px) rotateY('+ aLi[i].maxPhi +'rad) rotateX('+ aLi[i].maxTheta +'rad)'});

    }
    setTimeout(function(){
        for (var i = 0; i < aLi.length; i++) {
            aLi[i].className = 'one';
            aLi[i].style.opacity = 1;
            aLi[i].style.transform = 'translate3D('+ aLi[i].circleX +'px,'+ aLi[i].circleY +'px,'+ aLi[i].circleZ +'px) rotateY('+ aLi[i].circlePhi +'rad) rotateX('+ aLi[i].circleTheta +'rad)';

        }
    },100);
}


//斜圆柱切换
function changeColumn2(){
    for(var i=0; i<columnNum; i++){
        aLi[i].className = '';
        aLi[i].maxX = aLi[i].bigColumn2X;
        aLi[i].maxY = aLi[i].bigColumn2Y;
        aLi[i].maxZ = aLi[i].bigColumn2Z;
        aLi[i].maxTheta = 0;
        aLi[i].maxPhi = aLi[i].column2Phi;
        setCss3(aLi[i],{transform:'translate3D('+ aLi[i].maxX +'px,'+ aLi[i].maxY +'px,'+ aLi[i].maxZ +'px) rotateY('+ aLi[i].maxPhi +'rad) rotateX('+ aLi[i].maxTheta +'rad)'});

    }
    setTimeout(function() {
        for (var i = 0; i < columnNum; i++) {
            aLi[i].className = 'one';
            aLi[i].style.opacity = 1;
            setCss3(aLi[i], {transform: 'translate3D(' + aLi[i].column2X + 'px,' + aLi[i].column2Y + 'px,' + aLi[i].column2Z + 'px) rotateY(' + aLi[i].column2Phi + 'rad)'});

        }

    },100);

}


//圆球方法
function circle(obj,theta,phi,i,j){
    obj.circleX = r*Math.sin(theta*i)*Math.sin(phi*j)+480;
    obj.circleY = r*Math.cos(theta*i)+200;
    obj.circleZ = r*Math.sin(theta*i)*Math.cos(phi*j);
    obj.circleTheta = theta*i-Math.PI/2;
    obj.circlePhi = phi*j;

    obj.bigCircleX = (r+5000)*Math.sin(theta*i)*Math.sin(phi*j) + 480;
    obj.bigCircleY = (r+5000)*Math.cos(theta*i) + 200;
    obj.bigCircleZ = (r+5000)*Math.sin(theta*i)*Math.cos(phi*j);
    obj.maxX = obj.bigCircleX;
    obj.maxY = obj.bigCircleY;
    obj.maxZ = obj.bigCircleZ;
    obj.maxTheta = obj.circleTheta;
    obj.maxPhi = obj.circlePhi;
}

//圆柱方法
function column(obj,phi,i,j){
    obj.columnX = r/1.5*Math.sin(phi*j) + 200;
    obj.columnY = (2*r/(arr.length-2))*i + 50;
    obj.columnZ = (r/1.5*Math.cos(phi*j)).toFixed(2);
    obj.columnPhi = phi*j;

    obj.bigColumnX = (r+5000)/1.5*Math.sin(phi*j) + 200;
    obj.bigColumnY = (2*(r+5000)/(arr.length-2))*i + 50-2000;
    obj.bigColumnZ = ((r+5000)/1.5*Math.cos(phi*j)).toFixed(2);

}
//斜圆柱方法
function italicColumn(obj,phi,i,j){
    obj.column2X = r/1.5*Math.sin(phi*j+i*Math.PI/180*15) + 480;
    obj.column2Y = (2.5*r/(arr.length-2))*i - 3000;
    obj.column2Z = (r/1.5*Math.cos(phi*j+i*Math.PI/180*15)).toFixed(2);
    obj.column2Phi = phi*j+i*Math.PI/180*15;
    obj.bigColumn2X = (r+2000)/1.5*Math.sin(phi*j+i*Math.PI/180*15) + 200;
    obj.bigColumn2Y = (2*(r+2000)/(arr.length-2))*i + 50-2000;
    obj.bigColumn2Z = ((r+2000)/1.5*Math.cos(phi*j+i*Math.PI/180*15)).toFixed(2);

}


//出场随机位置
function setRound(obj) {
    obj.tX = Math.round(Math.random()*(8000) - 3000);
    obj.tY = Math.round(Math.random()*(8000) - 3000);
    obj.tZ = Math.round(Math.random()*(8000) - 3000);
    obj.rX = Math.round(Math.random()*(1440) - 720);
    obj.rY = Math.round(Math.random()*(1440) - 720);
    obj.rZ = Math.round(Math.random()*(1440) - 720);
}
//圆筒自定义属性


function drawCylinder() {
    var r = 150;
    var phi = 2*Math.PI/32;
    var isClick = false;
    for(var i = 0;i < 32;i++) {
        var div = document.createElement('div');
        div.style.backgroundPosition = -30*i+'px 0';
        draw(div,phi,i);
        setRound(div);
        div.style.opacity = 0;
        arrDiv.push(div);
        oBox.appendChild(div);
        div.posL = div.offsetWidth*i;
    }
    console.log(arrDiv);
    btns[3].onclick = function() {
        for (var i = 0; i < aLi.length; i++) {
            aLi[i].className = 'all';
            aLi[i].style.transform = 'translate3D('+ aLi[i].bigCircleX +'px,'+ aLi[i].bigCircleY +'px,'+ aLi[i].bigCircleZ +'px) rotateY('+ aLi[i].circlePhi +'rad) rotateX('+ aLi[i].circleTheta +'rad)';
            aLi[i].style.opacity = 0;
        }
        
        setTimeout(function(){
            for(var i = 0;i < arrDiv.length;i++) {
                arrDiv[i].style.display = "";
                arrDiv[i].style.opacity = 1;
                arrDiv[i].style.transform = 'translate3D('+arrDiv[i].circleX+'px,50px,'+arrDiv[i].circleZ+'px) rotateY('+arrDiv[i].circlePhi+'rad)';
            }
        },2000);
    };
    for(var i = 0;i < arrDiv.length;i++) {
        arrDiv[i].ondblclick = function() {
            if(!isClick) {
                this.style.transform = '';
                mTween(this,{left:this.posL},300,"linear");
                prevs(this);
                nexts(this);
                isClick = true;
            }
        };
    }














    function prevs(obj) {
        var prev = obj.previousElementSibling;
        if(prev) {
            setTimeout(function() {
                prev.style.transform = '';
                mTween(prev,{left:obj.previousElementSibling.posL},300,"linear");
                prevs(prev);
            },100);
        }   
    }

    function nexts(obj) {
        var next = obj.nextElementSibling;
        if(next) {
            setTimeout(function() {
                next.style.transform = '';
                mTween(next,{left:obj.previousElementSibling.posL},300,"linear");
                nexts(next);
            },100);
        }
        
    }






    function draw(obj,phi,i) {
        obj.circleX = r*Math.sin(phi*i)+480;
        obj.circleZ = r*Math.cos(phi*i);
        obj.circlePhi = phi*i;
        obj.circlePhi1 = 2*Math.PI+phi*i;
    }
}

function shine() {
    
}