var isAndroid = (window.navigator.userAgent.indexOf('Android')>=0)?true : false;
appcan.ready(function(){
    uexWindow.setWindowScrollbarVisible(false);
});
/**
*检查网络
*返回值：-1=网络不可用  0=WIFI网络  1=3G网络  2=2G网络
*/
function checkNet(cb){
    uexDevice.cbGetInfo=function (opCode,dataType,data){
        var device = eval('('+data+')');
        var connectStatus=device.connectStatus;
        if(isDefine(connectStatus)){
            cb(connectStatus);
            //if(connectStatus==-1){
            //  console.log('网络状态：网络不可用');
            //}else if(connectStatus==0){
            //  console.log('网络状态：WIFI网络'); 
            //}else if(connectStatus==1){
            //  console.log('网络状态：3G网络'); 
            //}else if(connectStatus==2){
            //  console.log('网络状态：2G网络');
            //}
        }
    }
    uexDevice.getInfo('13');
}  
/*
 * 发送ajax请求
 * @param {string} obj  请求参数
 */
function AJAX(obj){
    openMask('0');
    //阿里云
    //var baseUrl = 'http://42.96.192.59:8089/userappapi/';
    //正式
    var baseUrl = 'http://10.0.5.164:6888/ormrpc/RestServer';
    //var baseUrl = 'http://154i277l07.51mypc.cn:14562/userappapi/';
    appcan.request.ajax({
        url : (baseUrl+(obj.url?obj.url:'')),
        data : (obj.data?obj.data:''),
        type : (obj.type?obj.type:'GET'),
        contentType: (obj.contentType?obj.contentType:false),
        timeout: 8000,
        dataType : 'json',
        success : function(data, status, requestCode, response, xhr){
            uexWindow.closeToast();
            closeMask();
            $closeToast();
            console.log(obj.data.method+'>>>'+JSON.stringify(data));
            var errCode = data.code;
            if(errCode != 200){ //请求为通过mas应用认证时返回14504状态码
                //ueppscript('root', 'content', 'initialize()');
            }else{
                //存在成功回调则执行成功回调
                if(obj.success)
                    obj.success(data, status, requestCode, response, xhr);
            }
        },
        error : function(xhr,erroType,error,msg) {
            $closeToast();
            if(obj.error){
                obj.error(xhr,erroType,error,msg);
            }else{
                errorCallBack(xhr,erroType,error,msg);
            }
        }
    })
}
/*
 * ajax公用失败回调
 */
function errorCallBack(xhr,erroType,error,msg,URL){
    try{
        appcan.window.resetBounceView(0);
        appcan.window.resetBounceView(1);
    }catch(e){}
    uexWindow.closeToast();
    closeMask();
    checkNet(function(connectSta){
        if(connectSta==-1){
            uexWindow.toast(0, '5', '网络请求失败,请检查您的网络！', 3000);
        }else{
            uexWindow.toast(0, '5', '系统异常', 3000);
        }
    });
}
/**
 *自定义alert 
 */
function $popup(obj){
    template.config("escape", false);//art  
    var self = this;
    LoadTplByUrl(obj.tpl?obj.tpl:'tpl/alert.html',function(tpl){
       //var render = template.compile(tpl);
        //var html = render(obj);
        $('body').append(template.compile(tpl)(obj));
        $('.pop-container').on('touchmove',function(e){
            e.stopPropagation();
            e.preventDefault();
        })
        appcan.button($('.pop-container').find('.button'),'ani-act',function(e){
            var $this = $(this);
            var index = $this.index();
            if(!$this.attr('data-close')){
                closePop($this);
            }
            obj.buttonCallBack(index,e);
        })
    }) 
}
/**
 * 关闭弹出窗
 */
function closePop(ele,cb){
    var  $alertContainer = $(ele);
    while (!$alertContainer.hasClass('pop-container')){
         $alertContainer = $alertContainer.parent();
     }
    var closeAni = $alertContainer.attr('data-close-ani')?$alertContainer.attr('data-close-ani'):'fadeOut';
    $alertContainer.addClass('fadeOut').find('.pop-content').addClass(closeAni).one('webkitAnimationEnd   animationend', function(){
        $alertContainer.remove();
        if(cb) cb();
    });
}
/**
 *toast框 
 */
function $toast(obj){
    $('.toast').remove();
    LoadTplByUrl(obj.tpl?obj.tpl:'tpl/toast.html',function(tpl){
        console.log(tpl);
        $('body').append(template.compile(tpl)(obj));
        if(obj.time){
            setTimeout(function(){
                $closeToast()
            },obj.time)
        }
    }) 
}
/**
 *关闭toast 
 */
function $closeToast(){
    $('.toast').addClass('fadeOut').one('webkitAnimationEnd   animationend', function(){
        $(this).remove();
    });
}
/**
 *动态加载模板 
 */
function LoadTplByUrl(url, cb) {
    var key = 'tpl_'+url.split('tpl/')[1].split('.')[0];
    var data = window[key];
    cb(data);
    // appcan.ajax({
        // url : url,
        // type : 'GET',
        // timeout : 10000,
        // //async : false,
        // success : function(data) {
            // cb(data);
        // },
        // error : function(xhr, erroType, error, msg) {
            // var key = 'tpl_'+url.split('tpl/')[1].split('.')[0];
            // var data = window[key];
            // cb(data);
        // }
    // });
}
/**
 * 初始化时间选择器
 */
function initDatePicker(ele,cb) {
    var thisDate = isDefine($(ele).val())? $(ele).val() : new Date().Format('yyyy-MM-dd');
    $(ele).val(thisDate);
    appcan.button(ele,'btn-act',function(){
         var Adate = $(ele).val().split('-');
         uexControl.openDatePicker(+Adate[0], +Adate[1], +Adate[2], function(data){
             $(ele).val(data.year + '-' + setNum(data.month) + '-' + setNum(data.day));
         })
    })
}
/**
 * 初始化用户的账户信息
 */
function initUserAccount(){
    if (!getLocVal('accountBank')) return;
    accountBank = str2json(getLocVal('accountBank'));
    $('#userName').val(accountBank.userName);
    $('#payeeAccount').val(accountBank.payeeAccount);
    if (getLocVal('companyDefault')) {
        companyDefault = str2json(getLocVal('companyDefault'));
        $('.gongsi').html(companyDefault.companyName).attr('data-num',companyDefault.companyNumber);
    }
    if (getLocVal('depDefault')) {
        depDefault = str2json(getLocVal('depDefault'));
        $('.bumen').html(depDefault.depName).attr('data-num',depDefault.depNumber);
    }  
}
/**
* 选择报销公司页面选择公司后调用  显示选择的公司
*/
function UPDATEGS(){
    var baoxiao_gongsi = str2json(getLocVal('baoxiao_gongsi'));
    var companyNumber = baoxiao_gongsi.companyNumber;
    if(companyNumber != $('.gongsi').attr('data-num')){
        $('.gongsi').html(baoxiao_gongsi.companyName).attr('data-num',baoxiao_gongsi.companyNumber);
        if ($('.bumen')) {
            $('.bumen').html('请选择部门').attr('data-num','');
        }
    }
}
/**
 * 选择报销部门页面选择部门后调用  显示选择的部门
 */
function UPDATEBM(){
    var baoxiao_bumen = str2json(getLocVal('baoxiao_bumen'));
    var depNumber = baoxiao_bumen.depNumber;
    if(depNumber != $('.bumen').attr('data-num')){
        $('.bumen').html(baoxiao_bumen.depName).attr('data-num',baoxiao_bumen.depNumber);
    }
}
/**
 * 页面跳转统一控制
 * @param value
 */
appcan.button('.pageLink','btn-act',function(){
    var Apage = $(this).attr('data-page').split(',');
    openNewWin(Apage[0], Apage[0]+'.html', Apage[1]?Apage[1]:10);
})
/**
 *页面无数据 
 * @param ele 要显示数据的容器
 * @param text 要显示的文字
 */
function showNoData(ele,text){
    var Txt = text?text:'抱歉，暂无数据';
    var str = '<div class="ub ub-ver ub-pc  ub-ac">'
                        +'<div class="icon-noData ub ub-img mag-t64"></div>'
                       +'<div class="mag-t40 tc-777 fons-30 mag-t64">'+Txt+'</div>';
                   +'</div>';
   $(ele).html(str);
}
/**
 *设置右滑返回 
 * @param ele 绑定右滑返回事件的元素
 * @param cb 右滑效果触发的回调
 */
function onSwipeRightBack(ele, cb){
    var maxMove;
    var startX;
    var startY;
    var endX;
    var endY;
    var timeStart; //触摸开始时间
    $(ele).off('touchstart').on('touchstart',function(e){
        timeStart = new Date().getTime();
        var ev = e.touches[0];
        startX= Math.floor(ev.clientX);
        startY = ev.clientY;
    });
    if(isAndroid){
        $(ele).off('touchmove').on('touchmove',function(e){ 
            var ev = e.changedTouches[0];
            var moveX = Math.floor(ev.clientX);
            var moveY = Math.floor(ev.clientY);
            var changeX = moveX - startX;
            var changeY = moveY - startY;
            if((changeX > 0)&&(changeY > 0)&&(changeY<changeX)){
                 e.preventDefault();
                 uexWindow.setBounce(0);
             }
        });
    };
    $(ele).off('touchend').on('touchend',function(e){ 
        if(isAndroid){
            uexWindow.setBounce(1);
        };
        var ev = e.changedTouches[0];
        endX = Math.floor(ev.clientX);
        endY = Math.floor(ev.clientY);
        var moveX = endX - startX;
        var moveY = endY - startY;
        var timeEnd = new Date().getTime();
        var timeCount = timeEnd - timeStart;
        if((moveX> 80)&&(moveY > 0)&&(moveY<moveX)&&(timeCount<400)){
             if(cb) cb();
         };
    })
}
/**
 *七牛云图片尺寸自定义  默认300
 */
function getSizeImg(url,size){
    var Size = size?size:300;
    var  newUrl = url+"?imageView2/0/w/"+Size;
    return newUrl;
}
/**
 * 下拉刷新,上拉加载
 * @param bounceType-数组 callback-回调
 */
function setPageBounce(bounceType, callback){
        uexWindow.onBounceStateChange=function(type,status){
              var TYPE = type+''+status;
              if(TYPE == '02'){
                    if(isCanCallback){
                        callback(type);
                        isCanCallback = false;
                        setTimeout(function(){
                            isCanCallback = true;
                            appcan.window.resetBounceView(0);
                        },600);
                    }else{
                        openToast('请求中，请稍等',2000,1);
                    } 
               }else if(TYPE == '12'){
                   if(isCanCallback){
                        callback(type);
                        isCanCallback = false;
                        setTimeout(function(){
                            isCanCallback = true;
                            appcan.window.resetBounceView(1);
                        },1000);
                    }else{
                        openToast('请求中，请稍等',2000,1);
                    }     
               }
        };
        var textColor = (isAndroid) ? '' : '#5c6c83'; //文字颜色
        var ABounceParams= [{
            'imagePath':'res://reload.png',
            'textColor':textColor,
            'pullToReloadText': '下拉刷新',
            'releaseToReloadText': '释放立即刷新',
            'loadingText':'正在刷新...'
        },{
            'imagePath':'res://loadmore.png',
            'textColor':textColor,
            'pullToReloadText': ' 　 ',
            'releaseToReloadText': ' 　 ',
            'loadingText':'加载中...'
        }];
        var isCanCallback = true;
        uexWindow.setBounce(1);
        for(var i in bounceType){
            var imgSettings = ABounceParams[i];
            uexWindow.setBounceParams(bounceType[i]+'', JSON.stringify(imgSettings));
            uexWindow.showBounceView(i, '#FFF', '1');
            uexWindow.notifyBounceEvent(bounceType[i]+'', "1");
        }; 
}
/**
 * 去除字符串中的空格
 * @param String s
 */
function trim(str) { //删除左右两端的空格
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
/**
 * 判断是否是空
 * @param value
 */
function isDefine(value){
    if(value == null || value == "" || value == "undefined" || value == undefined || value == "null" || value == "(null)" || value == 'NULL' || typeof(value) == 'undefined'){
        return false;
    }
    else{
        value = value+"";
        value = value.replace(/\s/g,"");
        if(value == ""){
            return false;
        }
        return true;
    }
}
/**
 * json对象转为string
 * @param {Object} j
 */
function json2str(j){
    return JSON.stringify(j);
}
/**
 * string转为json对象
 * @param String s
 */
function str2json(s){
    return JSON.parse(s);
}
/**设置安卓back和menu按键事件监听
 * @b: back键，1为监听。
 * @m: menu键，1为监听。
 * @cb1: back键监听处理回调方法。
 * @cb2: menu键监听处理回调方法。
 */
function addKeyListener(b, m, cb1, cb2){
    uexWindow.onKeyPressed = function(keyCode){
        if(keyCode==0){
            if(cb1)  cb1();
            //uexWidget.finishWidget(''); //退出应用
        }
        else{
            if(cb2) cb2();
        }
    }
    if(b) uexWindow.setReportKey('0', '1');
    if(m) uexWindow.setReportKey('1', '1');
}
/**
 * 获取链接后面的参数
 * @param String name 需要获取的参数名字
 */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    return r != null ? unescape(r[2]) : null;
}
/**
 * 获取元素距离文档顶部的距离
 * @param 
 */
function getTop(e){
    var offset=e.offsetTop;
    if(e.offsetParent!=null) offset+=getTop(e.offsetParent);
    return offset;
}
/**
 * @param String inWndName 新窗口名称
 * @param String html       新窗口路径
 * @param String inAniID    打开动画
 * @param String f
 */
function openNewWin(inWndName,html,inAniID,f){
    if(arguments.length == 2){
        uexWindow.open(inWndName,'0',inWndName+'.html',html,'','',(f)?f:0);
        return;
    }
    if(arguments.length == 1){
        uexWindow.open(inWndName,'0',inWndName+'.html',2,'','',(f)?f:0);
        return;
    }
    if(inAniID)
        uexWindow.open(inWndName,'0',html,inAniID,'','',(f)?f:0);
    else
        uexWindow.open(inWndName,'0',html,'','','',(f)?f:0);
}

/**
 * 解决点击一次多次调用问题打开窗口
 * @param obj event对象
 * @param String 窗口名称，不带有.html
 */
function openNextWin(e,htmlName){
    if(e.type == "click") return;
    openNewWin(htmlName,htmlName+".html");
}
/**
 * 关闭窗口
 * @param string n 关闭窗口动画，默认-1
 */
function winClose(n){
    if(n){
        uexWindow.close(n);
        return;
    }
    if(parseInt(n)==0){
        uexWindow.close(n);
        return;
    }
    uexWindow.close(-1);
}
/**
 * alert 和 confirm 弹出框
 * @param String tit 提示标题
 * @param String str 提示语
 * @param String Abutton 操作按钮数组
 * @param Function callback confirm的回调函数
 */
function Alert(str,tit,Abutton,callback){
    uexWindow.cbConfirm = function(opId,dataType,data){
        if(callback) callback(data);  
    }
    uexWindow.confirm(tit?tit:'提示',str?str:'确定?',Abutton?Abutton:['确定']);
}
function Aler(title,str,Abutton,callback){
    openMask(0.5);
    
}
/**
 * 遮罩层
 *  * @param String opacity  遮罩透明度，不传则为0.40
 */
function openMask(opacity){
    if(!document.getElementById("mask")){
        var newMask = document.createElement("div");
        newMask.id = "mask";
        newMask.style.position = "absolute";
        newMask.style.zIndex = "8888888";
        var _scrollWidth = Math.max(document.body.scrollWidth,document.documentElement.scrollWidth);
        var _scrollHeight = Math.max(document.body.scrollHeight,document.documentElement.scrollHeight);
        newMask.style.width = _scrollWidth + "px";
        newMask.style.height = _scrollHeight + "px";
        newMask.style.top = "0px";
        newMask.style.left = "0px";
        newMask.style.background = '#000';
        newMask.style.opacity = opacity?opacity : '0.40';
        document.body.appendChild(newMask);
    } 
}
function closeMask(){
    if(document.getElementById("mask")){
        document.body.removeChild(document.getElementById("mask"));
    }
}
/**
 * 显示加载框
 * @param String mes 显示的提示语
 * @param String t  显示时间
  * @param String type  1-没有加载圈；没值或者0-有加载圈
 */
function openToast(msg, t, type){
    uexWindow.toast(type?'0':'1', '5', msg?msg:'加载中', t?t:'');
}
/**
 * 关闭加载框
 */
function closeToast(){
    uexWindow.closeToast();
}
/**
 * localStorage保存数据
 * @param String key  保存数据的key值
 * @param String value  保存的数据
 */
function setLocVal(key,value){
    window.localStorage[key] = value;
}
/**
 * 根据key取localStorage的值
 * @param Stirng key 保存的key值
 */
function getLocVal(key){
    if(window.localStorage[key])
        return window.localStorage[key];
    else
        return "";
}

/**
 * 清除localStorage
 * @param Striong key  保存数据的key，如果不传清空所有缓存数据
 */
function clearLocVal(key){
    if(key)
        window.localStorage.removeItem(key);
    else
        window.localStorage.clear();
}
/**
 * 在其他窗口中执行指定主窗口中的代码
 * @param String wn  需要执行代码窗口的名称
 * @param String scr 需要执行的代码
 */
function uescript(wn, scr){
    uexWindow.evaluateScript(wn,'0',scr);
}
/**
 * 在其他窗口中执行指定浮动窗口中的代码
 * @param String wn  需要执行代码浮动窗口所在的主窗口的名称
 * @param String pn  需要执行代码的浮动窗口的名称
 * @param String scr 需要执行的代码
 */
function ueppscript(wn, pn, scr){
    uexWindow.evaluatePopoverScript(wn,pn,scr);
}
/**
 *  格式化金额
 */
function Fmoney(s, n) {  
   n = n > 0 && n <= 20 ? n : 2;  
   s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";  
   var l = s.split(".")[0].split("").reverse(),  
   r = s.split(".")[1];  
   t = "";  
   for(i = 0; i < l.length; i ++ )  
   {  
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");  
   }  
   return t.split("").reverse().join("") + "." + r;  
}  
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
/**
 * 获取指定时间 thisdate 的后 addday 天 * thisdate格式为2016-03-15
 */
function countDate(thisdate, addday){
    var mydate =new Date(thisdate);
    mydate.setDate(mydate.getDate()+addday);
    var year = mydate.getFullYear();
    var month = mydate.getMonth()+1;
    var day = mydate.getDate();
    var endtime =year+'-'+month+'-'+day;
    return endtime;
}
/**
 * 小于9前面加0
 */
function setNum(s){
    return (s>9) ? s : '0'+s;
}
/**
 * 设置页面弹动背景色
 * @param String type 弹动类型
 * @param String color 弹动背景色
 */
function setBonece(type,color){
    color = color?color: '#FFF';
    if(type){
        uexWindow.showBounceView(type, color, '0');
    }else{
        uexWindow.showBounceView('0', color, '0');
        uexWindow.showBounceView('1', color, '0');
    }
}
/**
 * 图片缓存
 * @param   {string}  ele     
 * @param   {Array}   url_arr    存放图片url的数组
 * @returns {boolean} 没有找到类名时，返回false
 */
function saveImgCache(ele, url_arr) {
    var option = {
        maxtask: 1,
        url: "",
        progress: function (data, session) {
            var sdata = JSON.parse(JSON.stringify(data));
            var status = sdata["status"];
            var percent = sdata["percent"];
            switch (status) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    break;
                default:
                    break;
            }
        },
        success: function (path, session) {
            //openToast(2)
            var flag = this.element.is("img");
            if (flag) {
                openToast(path)
                this.element.attr("src", path);
            } else {
                this.element.css("background-image", "url(" + path + ")");
            }
        },
        fail: function (session) {
            var flag = this.element.is("img");
            if (flag) {
                this.element.attr("src", this.url);
            } else {
                this.element.css("background-image", "url(" + this.url + ")");
            }
        }
    };
    var cache = appcan.icache(option);
    var len = $(ele).length;
    for (var i = 0; i < len; i++) {
        var $this = $(ele).eq(i);
        var flag = $this.is("img");
        if (flag) {
            $this.attr("src","image/loading.gif");
        } else {
            $this.css("background-image", "url(image/loading.gif)");
        }
    };
    for (var i = 0; i < len; i++) {
        var $this = $(ele).eq(i);
        option.url = url_arr[i];
        option.element = $this;
        cache.run(option);
    };
}
/**
 * 滑到底部加载
 * @param String  ele 容器的ID 必传
 * @param String  distance 滚动条距离底部多少px时加载 不传则默认为0
 * @param function  callback 回调函数
 * 调用方法 slideBotLoad('ele', '0', function(){ alert("ok") })
 */
function slideBotLoad(ele, distance, callback){
     var ele = document.getElementById(ele);
     var top1 =  ele.scrollTop;
     var h2 = ele.offsetHeight;
     ele.onscroll = function(event){
        //event.preventDefault(); 
        var h1 = ele.scrollTop;
        var h3 = ele.scrollHeight;
        var top2 = ele.scrollTop;
        //distance = 0;
        if((h1+h2 >= h3)&&(top2-top1>0)){
            callback();
        }
        top1 =  ele.scrollTop;
    }
} 
//input限制
var inputManger = {
    getNum:function(value){
        var newValue = value.replace(/[^0-9]/g,'');
        return newValue;
    },
    testPhone:function(value){
        var r=/^((0\d{2,3}-\d{7,8})|(1[235874]\d{9}))$/;
        return r.test(value);
    },
    getPwd: function(value){
        var newValue = value.replace(/[^0-9a-zA-Z]/g,'');
        return newValue;
    },
    testPwd: function(value){
        
    }
}
//从数组删除指定元素
function deleteContentFromArr(Arr, content){
    var len = Arr.length;
    for(var i=0; i<len; i++) {
        if (Arr[i] == content) {
            Arr.splice(i, 1);
            return;//如果要删除内容全部为content的数据，就删除return
        }
    }
}