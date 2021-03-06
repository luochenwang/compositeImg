/**
 * Loren
 *
 * imgMerge 1.0.2
 *
 * Released on: August 1, 2018
 */


(function() {

    function imgMergeClass(options){

        // data默认值
        /*
         *   {
         *       val:'xxxx.png',        // 文字或图片     必填
         *       x:0,                   // x坐标         非必填
         *       y:0,                   // y坐标         非必填
         *       color:'#000',          // 字体颜色       非必填
         *       fontSize:"12px",       // 字体大小       非必填
         *       fontFamily:"Arial",    // 字体          非必填     
         *       fontAlign:"left",      // 字体对齐       非必填
         *       zIndex:"",             // 层级          非必填
         *       scale:1,               // 缩放          非必填
         *       rotation:0,            // 旋转          非必填
         *   }
         */

        this.fontFamily = '"Arial", "Verdana", "sans-serif"';
        // 默认参数
        this.options = {
            canvasEl:null,
            cWidth:750,
            cHeight:1206,
            data:[],
            moveIndex:null,
            parentBoxEl:'',
            bgColor:"#ffffff"
        };

        // 图片判断正则
        this.imgReg = /.png|.jpg/i;
        // base64 正则
        this.base64Reg = /^data:image\/(jpeg|png|gif);base64,/;
        // 第一次加载完成的数量
        this.loadEndIndex = 0;
        for ( var i in options ) {
            this.options[i] = options[i];
        }
        if(this.options.canvasEl){
            this.canvas = this.options.canvasEl;
        }else{
            this.canvas = document.createElement('canvas');
        }

        if(this.options.parentBoxEl != ''){
            this.viewAdaptation();
        }else{
            this.canvas.width = this.options.cWidth;
            this.canvas.height = this.options.cHeight;
        }


        this.stage = new createjs.Stage(this.canvas);
        this.container = new createjs.Container();
        // 添加背景色
        this.addBgColor();
        // 默认参数合并
        for ( var i in options ) {
            this.options[i] = options[i];
        }
        this.dataInit();
    }
    // 添加背景色
    imgMergeClass.prototype.addBgColor = function(){
         var graphics = new createjs.Graphics().beginFill(this.options.bgColor).drawRect(0, 0, this.options.cWidth, this.options.cHeight);
         var shape = new createjs.Shape(graphics);
         this.stage.addChild(shape,this.container);
    }
    // 元素初始化
    imgMergeClass.prototype.dataInit = function(){
        var dataLength = this.options.data.length;

        if(this.options.moveIndex != null){
            var id = this.getIdData(this.options.moveIndex);
            if(id != -1){
                this.options.moveIndex = id;
            }else if(!this.options.data[this.options.moveIndex]){
                this.options.moveIndex = null;
            }
        }

        
        for(var d = 0;d<dataLength;d++){
            var data = this.options.data[d];
            (function(k){
                // 判断是不是图片
                this.dataCheck(data,k,dataLength);
            }.bind(this)(d))
        }

        this.update();
    }
    // 添不添加移动事件
    imgMergeClass.prototype.isAddImgEvent = function(val){
        if(this.options.moveIndex != null){

            var imgData = this.options.data[this.options.moveIndex].val;
            this.hammerData = {
                oldScale: 1,
                oldLateY: 0,
                oldLateX: 0,
                oldAngel: 0,
                oldAngel2:0,
                lastAngel:0,
                lastScale:imgData.scaleY-1,
                isScale:false,
                beginScale: 0,
                IsIn:true,
            };
            this.addMoveImgEvent();
        }
    };
    imgMergeClass.prototype.removeMove = function(){
        this.fileImg = false;
    }
    // 增加图片事件
    imgMergeClass.prototype.addMoveImgEvent = function(){
        var _this = this;
        this.fileImg = this.options.data[this.options.moveIndex].val;
        this.hammer = new Hammer(this.canvas);



        this.hammer.on("pinchmove", function (e) {
            if(!this.fileImg)return false;
            var scale;
            scale = this.hammerData.lastScale + this.hammerData.oldScale * e.scale
            if(scale >= 0.05){
                _this.fileImg.scaleX = scale;
                _this.fileImg.scaleY = scale;
            }
            
        }.bind(this));
        this.hammer.on("pinchend", function (e) {
            if(!this.fileImg)return false;
            this.hammerData.lastScale = _this.fileImg.scaleY-1;
            this.hammerData.beginScale = -1;
            this.hammerData.isFirst = false;
        }.bind(this))
        this.hammer.on("pan", function (e) {
            if(!this.fileImg)return false;
            var y = _this.fileImg.y + (e.deltaY - this.hammerData.oldLateY)*2;
            var x = _this.fileImg.x + (e.deltaX - this.hammerData.oldLateX)*2;
            this.hammerData.oldLateX = e.deltaX;
            this.hammerData.oldLateY = e.deltaY;
            _this.fileImg.x = x;
            _this.fileImg.y = y;

        }.bind(this));

        this.hammer.on("panend", function (e) {
            if(!this.fileImg)return false;
            this.hammerData.oldLateX = 0;
            this.hammerData.oldLateY = 0;
        }.bind(this));
        this.hammer.on("rotatestart", function (e) {
            if(!this.fileImg)return false;
            this.hammerData.oldAngel = e.rotation;
        }.bind(this))
        this.hammer.on("rotatemove", function (e) {
            if(!this.fileImg)return false;
            var oldAngel = e.rotation - this.hammerData.oldAngel;
            this.hammerData.oldAngel = e.rotation;
            _this.fileImg.rotation += oldAngel;
        }.bind(this));
        this.hammer.on("rotateend", function (e) {
            if(!this.fileImg)return false;
        }.bind(this));


        this.hammer.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
        this.hammer.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(this.hammer.get('pan'));
        this.hammer.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([this.hammer.get('pan'), this.hammer.get('rotate')]);

        createjs.Ticker.framerate = 30;
        createjs.Ticker.addEventListener("tick", this.stage);
    }
    // 元素校验
    imgMergeClass.prototype.dataCheck = function(obj,index,length){
        // 如果没有index    就是单独新增

        // 判断是不是图片
        if(this.imgReg.test(obj.val) || this.base64Reg.test(obj.val)){
            var imgX = obj.x || 0;
            var imgY = obj.y || 0;
            var imgScale = obj.scale || 1;
            var imgRotation = obj.rotation || 0;

            var imgN = new Image();
            imgN.src = obj.val;
            if(typeof index === "number"){
                imgN.index = index;
            }else{
                imgN.index = this.options.data.length-1;
            }
            imgN.data = obj;
            imgN.onload = function(){

                var img = new createjs.Bitmap(imgN);
                
                img.x = imgX;
                img.y = imgY;
                img.scaleX = imgScale;
                img.scaleY = imgScale;
                img.rotation = imgRotation;
                var shapeValIndex = imgN.index;

                this.options.data[shapeValIndex].val = img;
                if(typeof index === "number"){

                    this.imgDataInit(img);

                    if(this.options.moveIndex == shapeValIndex){
                        this.isAddImgEvent(imgN.data.moveIndex);
                    }
                    ++this.loadEndIndex;
                }else{
                    // 判断需不需要更新需要移动的元素
                    if(this.options.moveIndex){
                        this.fileImg = this.options.data[this.options.moveIndex].val;
                        var fileImgW = this.fileImg.getBounds().width/2;
                        var fileImgH = this.fileImg.getBounds().height/2;
                        if(this.fileImg.regX != fileImgW && this.fileImg.regY != fileImgH){
                            this.imgDataInit(this.fileImg);
                        }
                    }
                }

                // 判断图片是否铺满剧中
                if(imgN.data.align == 'center'){
                     if(imgN.width > imgN.height){
                        var scale = this.options.cWidth/imgN.width;
                    }else{
                        var scale = this.options.cHeight/imgN.height;
                    }

                    if(imgN.width > this.options.cWidth || imgN.height > this.options.cHeight){
                        img.scaleX = scale;
                        img.scaleY = scale;
                        img.x -= (imgN.width - imgN.width*scale)/2;
                        img.y -= (imgN.height - imgN.height*scale)/2;
                        img.x += this.options.cWidth/2 - imgN.width*scale/2;
                        img.y += this.options.cHeight/2 - imgN.height*scale/2;
                    }else{
                        img.x += this.options.cWidth/2 - imgN.width*img.scaleX/2;
                        img.y += this.options.cHeight/2 - imgN.height*img.scaleX/2;
                    }
                }


                //  执行图片加载完成的回调
                if(typeof imgN.data.callback == 'function'){
                    imgN.data.callback(img,imgN.width,imgN.height);
                }


                this.container.addChild(img);
                this.stage.update();

                this.dataSort();
                if(this.loadEndIndex >= length){
                    this.loadingEnd();
                }
            }.bind(this);

            imgN.onerror = function(){
                alert("图片地址错误");
            }
        }else{
            // 文字默认参数
            var defaultObj = {
                x:0,
                y:0,
                color:'#000',
                fontSize:"12px",
                fontFamily:this.fontFamily,
                fontAlign:"left",
                val:'',
                scale:1,
                rotation:0,
                callback:null
            }
            for ( var i in defaultObj) {
                defaultObj[i] = obj[i];
            }
            obj = defaultObj;
            var textN = new createjs.Text(obj.val, obj.fontSize+" "+obj.fontFamily, obj.color);
            textN.setTransform(obj.x,obj.y,obj.scale,obj.scale,obj.rotation);

            textN.textAlign = obj.fontAlign;
            this.container.addChild(textN);
            if(typeof index === "number"){
                this.options.data[index].val = textN;
                if(this.options.moveIndex == index){
                    this.isAddImgEvent(obj.moveIndex);
                }
                ++this.loadEndIndex;
            }else{
                this.options.data[this.options.data.length-1].val = textN;
                this.dataSort();
            }

            if(typeof obj.callback == 'function'){
                obj.callback();
            }
        }
    };
    imgMergeClass.prototype.imgDataInit = function (file){
        var fileImgW = file.getBounds().width/2;
        var fileImgH = file.getBounds().height/2;
        var regX = fileImgW - file.regX;
        var regY = fileImgH - file.regY;
        file.regX = regX;
        file.regY = regY;

        var fileImgX = file.scaleX*regX;
        var fileImgY = file.scaleX*regY;
        file.x += fileImgX;
        file.y += fileImgY;

        return file;
    }
    // 全部元素加载完成
    imgMergeClass.prototype.loadingEnd = function (){
        this.dataSort();
        this.update();
        if(typeof this.options.firstAllLoadEnd == 'function'){
            this.options.firstAllLoadEnd();
        }
    }
    // 添加元素到画布
    imgMergeClass.prototype.addData = function(data){

        var arr = [];
        if(typeof data === 'object' && data.val){
            arr.push(data);
            data = arr;
        }

        if(data instanceof Array){
            for(var i = 0,dataLength = data.length;i<dataLength;i++){
                this.options.data.push(data[i]);
                (function(k){
                    // 判断是不是图片
                    this.dataCheck(data[k]);
                }.bind(this)(i))
            }
        }
    }
    // 删除元素
    imgMergeClass.prototype.removeData = function(val){
        val = val || 'delactAll';
        var index = -1,idArr = [];
        if(val == 'delactAll'){
            idArr = [];
            this.container.removeAllChildren();
            this.options.data = [];
            this.update();
        }else if(val instanceof Array){
            idArr = val;
        }else{
            idArr.push(val);
        }

        for(var i = 0,idLength = idArr.length;i<idLength;i++){
            var idIndex = this.getIdData(idArr[i]);
            if(idIndex != -1){
                var index = idIndex;
            }else if(typeof idArr[i] === 'number'){
                var index = val;
            }

            if(index != -1 || this.options.data[index]){
                this.container.removeChild(this.options.data[index].val);
                this.options.data.splice(index,1);
                this.update();
            }
            index = -1;
        }

    }
    // 获取id的元素
    imgMergeClass.prototype.getIdData = function(id){
        for(var i = 0;i<this.options.data.length;i++){
            if(this.options.data[i].id == id){
                return i;
            }
        }
        return -1;
    }
    // 改变移动的图片
    imgMergeClass.prototype.changeMoveImg = function(val){
        var index = -1;
        if(this.getIdData(val) != -1){
            var index = this.getIdData(val);
        }else if(typeof val === 'number' && this.options.data[index].val){
            var index = val;
        }

        if(index != -1){
            this.options.moveIndex = index;
            this.fileImg = this.options.data[index].val;
            this.hammerData = {
                oldScale: 1,
                oldLateY: 0,
                oldLateX: 0,
                oldAngel: 0,
                oldAngel2:0,
                lastAngel:0,
                lastScale:this.options.data[index].scale-1 || 0,
                isScale:false,
                beginScale: 0,
                IsIn:true,
            };
            // 添加元素的时候添加移动事件
            if(!this.hammer){
                this.addMoveImgEvent();
            }
        }
    }
    // 添加套画布上
    imgMergeClass.prototype.update = function(){
        this.stage.update();
    }
    // 设置层级
    imgMergeClass.prototype.setZIndex = function(data,index){
        if(typeof index === "number"){
            this.container.setChildIndex(data,index);
        }
    }
    // 排序
    imgMergeClass.prototype.dataSort = function(data,index){
        var sortArr = [];
        for(var i = 0;i<this.options.data.length;i++){
            var item = this.options.data[i];
            if(typeof item.zIndex !== 'number'){
                var index = 0;
            }else{
                var index = item.zIndex;
            }
            sortArr.push(index);
        }
        function sequence(a,b){
            return a - b;
        }
        sortArr.sort(sequence);

        for(var i = 0;i<sortArr.length;i++){
            if(sortArr[i] != 0){
                var index = sortArr.indexOf(this.options.data[i].zIndex);
                this.setZIndex(this.options.data[i].val,index);
                sortArr[index] = null;
            }
        }
    }
    // 获取页面元素位置的数据
    imgMergeClass.prototype.getPathData = function(){
        var pathData = [];
        for(var d = 0;d<this.options.data.length;d++){
            var data = this.options.data[d].val;
            if(data.text){
                var obj = {
                    text:data.text,
                    x:data.x,
                    y:data.y,
                    color:data.color,
                };
            }else{
                var obj = {
                    x:data.x,
                    y:data.y,
                    scaleX:data.scaleX,
                    scaleY:data.scaleY,
                };
            }
            pathData.push(obj);
        }
        return pathData;
    };
    // 导出
    imgMergeClass.prototype.export = function(){
        var base64 = this.stage.toDataURL('image/png');
        return base64;
    };
    // 适配
    imgMergeClass.prototype.viewAdaptation = function(){
        // 判断是不是id
        var classIndex = this.options.parentBoxEl.indexOf("#");
        var classData = this.options.parentBoxEl.slice(1,this.options.parentBoxEl.length);
        if(classIndex != -1){
            var parentBox = document.getElementById(classData);
        }else{
            var parentBox = document.getElementsByClassName(classData);
            if(parentBox.length == 0){
                parentBox.clientWidth = 0;
            }else{
                parentBox = parentBox[0];
            }
        }
        var stageWidth = parentBox.clientWidth;
        var stageScale = stageWidth/this.options.cWidth;

        this.canvas.width = this.options.cWidth;
        this.canvas.height = this.options.cHeight;
        this.canvas.style.width = this.options.cWidth*stageScale + 'px';
        this.canvas.style.height = this.options.cHeight*stageScale + 'px';
    }
    // 销毁
    imgMergeClass.prototype.destroy = function(){
        // 判读有没有添加编辑事件
        if(this.hammer){
            this.hammer.off("pan");
            this.hammer.off("pinchmove");
            this.hammer.off("pinchend");
            this.hammer.off("panend");
            this.hammer.off("rotatemove");
            this.hammer.off("rotateend");
        }
        this.stage.removeAllChildren();
        createjs.Ticker.removeEventListener("tick", this.stage);
    }
    if (typeof exports !== 'undefined') exports.imgMerge = imgMergeClass;
    else window.imgMerge = imgMergeClass;
}());