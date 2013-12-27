var canvas = document.getElementById('mask');
var curPoint = $('#signStatus').val();
var scratchCard = {
    startX : 0,
    startY : 0,
    t : null,
    num : 0
}
if(canvas || canvas.getContext('2d')){
    var ctx = canvas.getContext('2d');
}
//绘画函数 如果ie 6-8 画矩形，
function mask(ctx){
    if(!$.support.leadingWhitespace){
        ctx.fillStyle = "#666";
        ctx.beginPath();
        ctx.fillRect(0, 0, ctx.canvas.width,ctx.canvas.height);
        ctx.closePath();
    }else
        drawRoundRect(ctx,0,0,ctx.canvas.width,ctx.canvas.height,5,"#666");
}
//绘画圆角矩形 
function drawRoundRect(ctx,x,y,w,h,r,c){
    if(w < 2 * r) r = w/2;
    if(h < 2 * r) r = h/2;
    ctx.beginPath();
    ctx.moveTo(x + r,y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    ctx.fillStyle = c;
    ctx.fill();
    ctx.closePath();
}
// 清除画笔
function clearBrush(ctx,x1,y1,x2,y2){
    ctx.save();//存储
    ctx.globalCompositeOperation = 'destination-out';//画笔与背景重叠部分变透明。
    // ctx.globalAlpha = 0;
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#fff";
    ctx.beginPath();
    ctx.lineCap = "round";//起点与终点成圆角
    ctx.lineJoin = "round";//交叉区圆角处理
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();//恢复
}
// 绑定 mouseup.prize mousemove 函数
function bink(){
    $('#mask').on('mousemove.prize',function(e){
        var mouseX = e.offsetX || e.originalEvent.X || e.originalEvent.layerX || 0;
        var mouseY = e.offsetY || e.originalEvent.Y || e.originalEvent.layerY || 0;
        // alert(mouseX+','+mouseY);
        // if( mouseX - scratchCard.startX < 0 )
        clearBrush(ctx,scratchCard.startX,scratchCard.startY,mouseX,mouseY);
        // else
        //     clearBrush(ctx,mouseX,mouseY,scratchCard.startX,scratchCard.startY);
        scratchCard.startX = mouseX;
        scratchCard.startY = mouseY;
        // $('#mask').html(scratchCard.startX+','+scratchCard.startY);
    });
    $(document).on('mouseup.prize',function(e){
        //刮图次数加1
        scratchCard.num++;
        // $('#againBtn').text(scratchCard.num+','+scratchCard.t);
        //刮图次数为3结束刮图
        // 判断是否是ie6-8
        if (!$.support.leadingWhitespace) { 
            gameOver(); 
        }else if(scratchCard.num >= 3) gameOver();
        clearTimeout(scratchCard.t);
        $('#mask').off('mousemove.prize');
        $(document).off('mouseup.prize');
    });
}
//刮图结束
function gameOver(){
    $('#mask').off('mousemove.prize mousedown.prize');
    $(document).off('mouseup.prize');
    $('#mask').fadeOut(300);
    // $('#againBtn').attr('point',curPoint).show();
}
//gameStart
function gameStart(){
    scratchCard.num = 0;
    // 绘画遮罩
    mask(ctx);        
    //给canvas 绑定 mousedown事件
    $('#mask').on('mousedown.prize',function(e){
        // 初始化鼠标的X，Y坐标
        scratchCard.startX = e.offsetX || e.originalEvent.X || e.originalEvent.layerX || 0;
        scratchCard.startY = e.offsetY || e.originalEvent.Y || e.originalEvent.layerY || 0;
        // alert(scratchCard.startX+','+scratchCard.startY);
        //调用 绑定事件mouseup.prize mousemove 函数
        bink();
        //刮图计时器开始计时
        scratchCard.t = setTimeout('gameOver()',1000);
    });
}

$(function(){
    // 关闭按钮增加监听事件
    $('#sClose').on('mousedown.prize',function(){
       $('#scratchCard').hide();
        // gameOver();
        // $('#sClose').off('mousedown.prize');
    });
    // 生成中奖信息
    creatInfo();
    // 刮卡游戏开始
    $('#mask').fadeIn(400);
    gameStart();
    // 再玩一次
    // $('#againBtn').on('mousedown.prize',function(e){
    //     gameOver();
    //     // 生成中奖信息
    //     setTimeout('creatInfo()',700);
    //     $('#mask').fadeIn(400);
    //     gameStart();
    // });
});

// 随机生成中奖信息
function creatInfo(){
    // 生成0- ?的随机数
    var r = Math.random();
    var random = parseInt (r * 30);
    // 获得积分数
    var point = parseInt (r * 10);
    switch(random){
        case 0:
            var h = '男人忽悠女人，叫调戏；女人忽悠男人，叫勾引；男女相互忽悠，叫爱情。';
            break;
        case 1:
            var h = '原来只要是分开了的人，不论原来多么熟悉，也会慢慢变得疏远。';
            break;
        case 2:
            var h ='人和猪的区别就是：猪一直是猪，而人有时却不是人！';
            break;
        case 3:
            var h ='去披萨店买披萨！服务员问我是要切成8块还是12块？我想了想说：还是8块吧！12块吃不完！';
            break;
        case 4:
            var h ='男人忽悠女人，叫调戏；女人忽悠男人，叫勾引；男女相互忽悠，叫爱情。';
            break;
        case 5:
            var h ='是金子总要发光的，但当满地都是金子的时候，我自己也不知道自己是哪颗了。';
            break;
        case 6:
            var h ='谎言与誓言的区别在于：一个是听的人当真了，一个是说的人当真了。';
            break;
        case 7:
            var h ='真正的好朋友，并不是在一起就有聊不完的话题，而是在一起，就算不说话，也不会觉得尴尬。';
            break;
        case 8:
            var h ='没有100分的另一半，只有50分的两个人！';
            break;
        case 9:
            var h ='人生没有彩排，每天都是直播；不仅收视率低，而且工资不高。';
            break;
        case 10:
            var h ='能用钱解决的问题都不是问题，可问题是我是穷人。';
            break;
        case 11:
            var h ='唯女人与英雄难过也，唯老婆与工作难找也。';
            break;
        case 12:
            var h ='老鼠一发威，大家都是病猫。';
            break;
        case 13:
            var h ='脱了衣服我是禽兽，穿上衣服我是衣冠禽兽！';
            break;
        case 14:
            var h ='读10年语文，不如聊半年QQ。';
            break;
        case 15:
            var h ='问：你喜欢我哪一点？答：我喜欢你离我远一点！';
            break;
        case 16:
            var h ='我就算是一只癞蛤蟆，我也决不娶母癞蛤蟆。';
            break;
        case 17:
            var h ='刚毕业后会有期；毕业一年后会有妻；后来后悔有妻；再后来会有后妻；最后悔有后妻';
            break;
        case 18:
            var h ='老子不打你，你不知道我文武双全。';
            break;
        case 19:
            var h ='我允许你走进我的世界,但不许你在我的世界里走来走去..';
            break;
        case 20:
            var h ='要么忍，要么残忍';
            break;
        case 21:
            var h ='虽然你身上喷了古龙水，但我还是能隐约闻到一股人渣味儿。';
            break;
        case 22:
            var h ='西游记告诉我们：凡是有后台的妖怪都被接走了，凡是没后台的都被一棒子打死了';
            break;
        case 23:
            var h ='旋转木马是这世上最残酷的游戏，彼此追逐，却永远隔着可悲的距离';
            break;
        case 24:
            var h ='我爱你时，你说什么就是什么。 我不爱你时，你说你是什么。';
            break;
        case 25:
            var h ='我又不是人民币，怎么能让人人都喜欢我？';
            break;
        case 26:
            var h ='我们的目标:向钱看,向厚赚';
            break;
        case 27:
            var h ='如果心情不好， 就去超市捏捏方便面';
            break;
        case 28:
            var h ='最是夜深人静时，思念才变得如此放肆';
            break;
        case 29:
            var h ='诸葛亮出山前也没带过兵啊，你们凭啥要我有工作经验';
            break;
        case 30:
            var h ='回忆是一座桥，却是通往寂寞的牢';
            break;
        default:
            var h ='谢谢参与！';
            break;
    }
    $('#sCardInfo').html(h+'<br>恭喜你获得<span>  '+ curPoint +'   </span>积分！');
}