(function(scope){
  var ImageCropper = function(opt) {
    this.$range = opt.range || $(".uploadPic [type=range]");
    this.$file = opt.file || $(".uploadPic [type=file]");
    this.$submit = opt.submit || $(".uploadPic [type=submit]");
    this.cropperPic = opt.cropper||"cropper";
    this.cutPic = opt.cutPic || "cutPic";
    this.rangeMeanwhile = opt.rangeMeanwhile || false;
    this.showRange = !opt.hideRange;

    this.url=opt.url||null; // 头像保存，ajax请求地址
    this.onInit = opt.onInit || null; // 初始化成功后的回调
    this.onReset = opt.onReset || null; // canvas重置后的回调
    this.onRange = opt.onRange || null; // 缩放的回调
    this.notSupport = opt.notSupport||null;   // 不支持此插件的回调
    this.onSelected = opt.onSelected || null; // 图片选择后
    this.onSubmit = opt.onSubmit || null; // 提交时候的回调
    this.onSuccess = opt.onSuccess || null; // 上传成功后的回调
    this.onError = opt.onError || null; // 上传失败后的回调
    this.onFileError = opt.onFileError || null; // 选择的文件错误的回调

    this.cropWidth = opt.cropWidth||100;
    this.cropHeight = opt.cropHeight||100;
    this.cropMinWidth = opt.cropMinWidth || 100;
    this.cropMinHeight = opt.cropMinHeight || 100;
    this.imageSize=opt.imageSize || 4096 * 1024; // 4M大小
    this.imageMaxWidth=opt.imageMaxWidth||1600;
    this.imageMaxHeight=opt.imageMaxHeight||1600;
    this.imageMinWidth=opt.imageMinWidth||200;
    this.imageMinHeight=opt.imageMinHeight||200;
    this.imageStyleArray=opt.imageStyleArray||["png","jpg","jpeg","gif"];

    this.cutPicIdSets = [];
    this.$cutPic = null;

    this.width = null;
    this.height = null;
    this.image = null;
    this.imageCanvas = null;
    this.imageContext = null;
    this.imageScale = 1;
    this.imageRotation = 0;
    this.imageLeft = 0;
    this.imageTop = 0;
    this.imageViewLeft = 0;
    this.imageViewTop = 0;

    this.canvas = null;
    this.context = null;
    this.previews = [];

    // 遮罩层
    this.maskGroup = [];
    this.maskAlpha = 0.3;
    this.maskColor = "#fff";
    this.borderColor="#000";
    this.borderWidth=2;

    this.cropLeft = 0;
    this.cropTop = 0;
    this.cropViewWidth =  this.cropWidth;
    this.cropViewHeight = this.cropHeight;

    this.dragSize = 7;
    this.dragColor = "#fff";
    this.dragLeft = 0;
    this.dragTop = 0;

    this.mouseX = 0;
    this.mouseY = 0;
    this.inCropper = false;
    this.inDragger = false;
    this.isMoving = false;
    this.isResizing = false;

    //move and resize help properties
    this.mouseStartX = 0;
    this.mouseStartY = 0;
    this.cropStartLeft = 0;
    this.cropStartTop = 0;
    this.cropStartWidth = 0;
    this.cropStartHeight = 0;
    this.imageX=0;
    this.imageY=0;
    this.firstScale=0;
    this.ratio=1;

    //remind crop image
    this.oldImageX=0;
    this.oldImageY=0;
    this.oldCropViewWidth=0;
    this.oldCropViewHeight=0;
    this.oldCropLeft=0;
    this.oldCropTop=0;
    this.oldImageScale=0;
    this.oldN=0;
    this.notFirstClick=false;

    //input=range
    this.min=0;
    this.max=0;
    this.step=0;
    this.n=0;
    this.mousewheelUp=0;

    this.isSet=false;
    this.isBind=true;
    this.bSmallImage = false;
    this._init();
  }
  scope.ImageCropper = ImageCropper;
  ImageCropper.prototype._init=function(){
    if(!this.isAvaiable()){ // 判断是否支持
      this.notSupport && this.notSupport.call(this);
      return false;
    }
    if( window.navigator.userAgent.indexOf("Chrome") === -1 && this.showRange ){
      this.$range.replaceWith("<span>您可滚动鼠标缩放图片</span>");
    }
    this._inputFile();
    this._getCutPicId();
    !this.showRange && this.$range.hide();
    this.onInit && this.onInit.call(this);
  }
  ImageCropper.prototype._getCutPicId=function(){
    var me = this
      , now = $.now()
      , id = '';

    this.$cutPic = $("." + me.cutPic);
    for( var i = 0, len = this.$cutPic.length; i < len; i++ ){
      id = $(this.$cutPic[i]).attr('id') || $(this.$cutPic[i]).attr('id', now + '' + i).attr('id');
      me.cutPicIdSets.push(id);
    }
  }
  ImageCropper.prototype._inputFile=function(){
    var me=this;
    this.$file.on("change",function(e){
      me.loadImage(this.files[0]);
    });
  }
  ImageCropper.prototype.setCanvas = function(canvas) {
    //working canvas
    this.canvas = document.getElementById(canvas) || canvas;
    this.width=this.canvas.width;
    this.height=this.canvas.height;
    this.context = this.canvas.getContext("2d");
//        this.canvas.width = this.width;
//        this.canvas.height = this.height;
    this.canvas.oncontextmenu = this.canvas.onselectstart = function(){return false;};

    //caching canvas
    this.imageCanvas = document.createElement("canvas");
    this.imageContext = this.imageCanvas.getContext("2d");
    this.imageCanvas.width = this.width;
    this.imageCanvas.height = this.height;
  }

  ImageCropper.prototype.addPreview = function(canvas) {
    var preview = document.getElementById(canvas) || canvas;
    var context = preview.getContext("2d");
    this.previews.push(context);
  }

  ImageCropper.prototype.loadImage = function(file) {
    var imageStyleArray=this.imageStyleArray.join(",");
    if(file.type.indexOf("image") !== 0){       //判断文件类型
      this.fileError(1);
      return false;
    }else{
      if(imageStyleArray.indexOf(file.type.slice(6))==-1){
        this.fileError(2);
        return false;
      }

      if(file.size>this.imageSize){                  //判断图片size
        this.fileError(3);
        return false;
      }
    }
    var reader = new FileReader();
    var me = this;
    reader.readAsDataURL(file);
    reader.onload = function(evt) {
      var image = new Image();
      image.src = evt.target.result;
      image.onload = function(e){

        if(image.width>me.imageMaxWidth || image.height>me.imageMaxHeight){  //判断图片长宽
          me.fileError(4);
          return false;
        }
        if((image.width<me.imageMinWidth || image.height<me.imageMinHeight)){
          me.fileError(5);
          return false;
        }
        me.setCanvas(me.cropperPic);
        me.removePreviews();
        for(var i = 0, len = me.cutPicIdSets.length; i < len; i++){
          me.addPreview(me.cutPicIdSets[i]);
        }
        me._reset();
        me._bindEvent();
        me._view(image);
        me.onSelected && me.onSelected.call(me, e, me.bSmallImage);
        image = null;
      };
    }
  }
  ImageCropper.prototype._reset=function(){
    this.$range.val(this.$range.attr("min"));
    this.isSet=false;

    this.oldImageX=this.imageX=0;
    this.oldImageY=this.imageY=0;
    this.oldCropViewWidth=0;
    this.oldCropViewHeight=0;
    this.oldCropTop=0;
    this.oldCropLeft=0;
    this.oldImageScale=0;
    this.oldN=0;
    this.notFirstClick=false;
    this.imageScale = 1;
    this.min=0;
    this.max=0;
    this.step=0;
    this.n=0;
    this.ratio=1;

    this.onReset && this.onReset.call(this);
  }
  ImageCropper.prototype._bindEvent=function(){
    if(this.isBind){
      this.$range.on("change", this,function(e) {
        var me= e.data
          , n=$(this).val();
        me.zoom();
        me.onRange && me.onRange.call(me, e, n);
        return false;
      });
      this.$submit.on("click", this, function(e){
        var me = e.data
          , dataForm = new FormData()
          , cutId, i, len, imgData, imgWidth, imgHeight, dataName;
        for( i = 0, len = me.cutPicIdSets.length; i < len; i++ ){
          cutId = me.cutPicIdSets[i];
          imgData = $("#" + cutId)[0].toDataURL("image/jpeg");
          imgWidth = $("#" + cutId).attr('width');
          imgHeight = $("#" + cutId).attr('height');
          dataName = $("#" + cutId).data('name');
          dataForm.append(dataName || imgWidth + '_' + imgHeight, imgData);
        }
        me.onSubmit && me.onSubmit.call(me, e, dataForm);
        me.url && me.ajax(dataForm);
      });
      this.isBind = false;
    }
    $('.cropperPart').addClass('hide');
    if(!this.rangeMeanwhile){
      var me = this;
      for(var i = 0, len = this.cutPicIdSets.length; i < len; i++){
        $("body").off("click", "#"+this.cutPicIdSets[i], me.cutPicFocus);
        if(0 == i){
          $('#'+this.cutPicIdSets[i]).addClass('on');
        } else {
          $("body").on("click", "#"+this.cutPicIdSets[i], me, me.cutPicFocus);
          $('#'+this.cutPicIdSets[i]).removeClass('on');
        }
      }
    }
  }

  ImageCropper.prototype.cutPicFocus=function(e){
    var me= e.data;
    var id=$(this).attr("id");
    var height=$(this).height();
    var width=$(this).width();
    me.removePreviews();
    me.addPreview(id);
    me.setCropper(width,height);

    for(var i = 0, len = me.cutPicIdSets.length; i < len; i++){
      $("body").off("click", "#" + me.cutPicIdSets[i], me.cutPicFocus);
      if(me.cutPicIdSets[i] == id){
        $('#'+me.cutPicIdSets[i]).addClass('on');
      } else {
        $("body").on("click", "#" + me.cutPicIdSets[i], me, me.cutPicFocus);
        $('#'+me.cutPicIdSets[i]).removeClass('on');
      }
    }
  }

  ImageCropper.prototype._view = function(image){
    this.image=image;
    var scale=Math.min(this.width/this.image.width,this.height/this.image.height); //保证图片全部内容在canvas中 并拉伸居中
    if( image.width < this.imageCanvas.width && image.height < this.imageCanvas.height ){
      scale = 1;
      this.bSmallImage = true;
      this.showRange && this.$range.hide();
    } else {
      this.bSmallImage = false;
      this.showRange && this.$range.show();
    }
    // if (scale > 1) scale = Math.min(this.cropViewWidth/this.image.width, this.cropViewHeight/this.image.height);
     if (this.image.width*scale<this.cropViewWidth) scale = Math.min(scale, this.cropViewWidth/this.image.width);
     if (this.image.height*scale<this.cropViewHeight) scale = Math.min(scale, this.cropViewHeight/this.image.height);
    this.imageViewLeft = this.imageLeft = (this.width - this.image.width*scale)/2;
    this.imageViewTop = this.imageTop = (this.height - this.image.height*scale)/2;
    this.imageScale =this.firstScale= scale;
    this.imageRotation = 0;
    //crop view size
    var minSize = Math.min(this.image.width*scale, this.image.height*scale);
    this.cropViewWidth = Math.min(minSize, this.cropWidth);
    this.cropViewHeight = Math.min(minSize, this.cropHeight);
    this.cropLeft = (this.width - this.cropViewWidth)/2;
    this.cropTop = (this.height - this.cropViewHeight)/2;
    this._update();

    //register event handlers
    var me = this;
    this.canvas.onmousedown = function(e){me._mouseHandler.call(me, e)};
    document.body.onmouseup = function(e){me._mouseHandler.call(me, e)};
    //this.canvas.onmouseup = function(e){me._mouseHandler.call(me, e)};
    this.canvas.onmousemove = function(e){me._mouseHandler.call(me, e)};
    this.canvas.onmousewheel=function(e){me._mouseHandler.call(me, e)};
    if(document.addEventListener){
      document.addEventListener('DOMMouseScroll',function(e){me._mouseHandler.call(me, e)},false);
    }//兼容firefox
  }
  ImageCropper.prototype._mouseHandler = function(e) {
    if(e.type == "mousemove") {
      var clientRect = this.canvas.getClientRects()[0];
      this.mouseX = e.pageX - clientRect.left - $(window).scrollLeft();
      this.mouseY = e.pageY - clientRect.top - $(window).scrollTop();
      this._checkMouseBounds();
      this.canvas.style.cursor = (this.inCropper || this.isMoving)  ? "move" : (this.inDragger || this.isResizing) ? "se-resize" : "";
      this.isMoving ? this._move() : this.isResizing ? this._resize() : null;
    } else if(e.type == "mousedown") {
      this.mouseStartX = this.mouseX;
      this.mouseStartY = this.mouseY;
      this.cropStartLeft = this.cropLeft;
      this.cropStartTop = this.cropTop;
      this.cropStartWidth = this.cropViewWidth;
      this.cropStartHeight = this.cropViewHeight;
      this.inCropper ? this.isMoving = true : this.inDragger ? this.isResizing = true : null;
    } else if(e.type == "mouseup") {
      this.isMoving = this.isResizing = false;
    } else if(e.type="mousewheel") {
      if(this.bSmallImage){
        return false;
      }
      this.mousewheelUp= e.wheelDelta/120 || e.detail/(-3); //兼容firefox
      this._range();
      e.preventDefault();
    }
  }

  ImageCropper.prototype._checkMouseBounds = function() {
    this.inCropper = (this.mouseX >= this.cropLeft && this.mouseX <= this.cropLeft+this.cropViewWidth &&
      this.mouseY >= this.cropTop && this.mouseY <= this.cropTop+this.cropViewHeight);
    // console.log(this.mouseX, this.mouseY, this.cropLeft, this.cropViewWidth, this.cropTop, this.cropViewHeight, this.inCropper);

    this.inDragger = (this.mouseX >= this.dragLeft && this.mouseX <= this.dragLeft+this.dragSize &&
      this.mouseY >= this.dragTop && this.mouseY <= this.dragTop+this.dragSize);
    // console.log(this.dragLeft, this.dragSize, this.dragTop);

    this.inCropper = this.inCropper && !this.inDragger;
  }

  ImageCropper.prototype._move = function() {
    var deltaX = this.mouseX - this.mouseStartX;
    var deltaY = this.mouseY - this.mouseStartY;
    this.cropLeft = Math.max(0,this.imageViewLeft, this.cropStartLeft + deltaX);
    this.cropLeft = Math.min(this.cropLeft, this.width-this.imageViewLeft-this.cropViewWidth);
    this.cropTop = Math.max(0,this.imageViewTop, this.cropStartTop + deltaY);
    this.cropTop = Math.min(this.cropTop, this.height-this.imageViewTop-this.cropViewHeight);
    this._update();
  }

  ImageCropper.prototype._resize = function() {
    var delta = Math.min(this.mouseX - this.mouseStartX, this.mouseY - this.mouseStartY);
    var cw = Math.max(this.cropMinWidth, this.cropStartWidth + delta);
    var ch = Math.max(this.cropMinHeight, this.cropStartHeight + delta);
    var cw = Math.min(cw, this.width-this.cropStartLeft-this.imageViewLeft);
    var ch = Math.min(ch, this.height-this.cropStartTop-this.imageViewTop);
    this.cropViewWidth = Math.round(Math.min(cw, ch));
    this.cropViewHeight=this.cropViewWidth/this.ratio;
    if(this.bSmallImage){
      this.cropViewHeight=Math.min(this.cropViewHeight,this.image.height-this.cropTop+this.imageViewTop);
      this.cropViewWidth=Math.min(this.cropViewWidth,this.image.width-this.cropLeft+this.imageViewLeft);
    } else {
      this.cropViewHeight=Math.min(this.cropViewHeight,this.image.height-this.cropTop);
      this.cropViewWidth=Math.min(this.cropViewWidth,this.image.width-this.cropLeft);
    }
    this._update();
  }

  ImageCropper.prototype._update = function() {
    this.imageViewLeft = this.imageLeft = Math.max(0,(this.width - this.image.width*this.imageScale)/2);
    this.imageViewTop = this.imageTop = Math.max(0,(this.height - this.image.height*this.imageScale)/2);
    if(this.cropTop+this.cropViewHeight>this.height){
      this.cropTop=this.height-this.cropViewHeight;
    }
    if(this.cropLeft+this.cropViewWidth>this.width){
      this.cropLeft=this.width-this.cropViewWidth;
    }
    this.cropViewHeight=this.cropViewWidth/this.ratio;
    this.cropTop=Math.max(0,this.cropTop,this.imageViewTop);
    this.cropLeft=Math.max(0,this.cropLeft,this.imageViewLeft);
    if(this.cropViewHeight>this.image.height*this.imageScale){
      this.cropViewHeight=this.image.height*this.imageScale;
      this.cropViewWidth=this.cropViewHeight*this.ratio;
    }
    if(this.cropViewWidth>this.image.width*this.imageScale){
      this.cropViewWidth=this.image.width*this.imageScale;
      this.cropViewHeight=this.cropViewWidth/this.ratio;
    }
    if(this.cropTop+this.cropViewHeight>this.imageViewTop+this.image.height*this.imageScale){
      this.cropTop=this.imageViewTop+this.image.height*this.imageScale-this.cropViewHeight;
    }
    if(this.cropLeft+this.cropViewWidth>this.imageViewLeft+this.image.width*this.imageScale){
      this.cropLeft=this.imageViewLeft+this.image.width*this.imageScale-this.cropViewWidth;
    }
    this.dragLeft = this.cropLeft + this.cropViewWidth - this.dragSize/2;
    this.dragTop = this.cropTop + this.cropViewHeight - this.dragSize/2;
    this.context.clearRect(0, 0, this.width, this.height);
    this._drawImage();
    this._drawMask();
    this._drawDragger();
    this._drawPreview();
  }

  ImageCropper.prototype._drawImage = function() {
    this.imageContext.clearRect(0, 0, this.width, this.height);
    this.imageContext.save();
    this.imageContext.translate((this.width-this.image.width*this.imageScale)/2, (this.height-this.image.height*this.imageScale)/2);
    if(this.image.width*this.imageScale>=this.width){
      this.imageContext.translate(this.imageX ,0);
    }
    if(this.image.height*this.imageScale>=this.height){
      this.imageContext.translate(0,this.imageY);
    }

    this.imageContext.scale(this.imageScale, this.imageScale);
    this.imageContext.drawImage(this.image,0,0 );
    this.imageContext.restore();
    this.context.drawImage(this.imageCanvas, 0, 0);
  }

  ImageCropper.prototype._drawPreview = function() {
    for(var i = 0; i < this.previews.length; i++) {
      var preview = this.previews[i];
      preview.clearRect(0, 0, preview.canvas.width, preview.canvas.height);
      preview.save();
      preview.drawImage(this.imageCanvas, this.cropLeft, this.cropTop, this.cropViewWidth, this.cropViewHeight, 0, 0, preview.canvas.width, preview.canvas.height);
      preview.restore();
    }
    if(!this.rangeMeanwhile && this.previews.length>1){
      this.previews.splice(1,this.previews.length-1); //留下默认第一个元素
    }
  }

  ImageCropper.prototype._drawMask = function() {
    //this._drawRect(this.imageViewLeft, this.imageViewTop, this.cropLeft-this.imageViewLeft, this.height, this.maskColor, null, this.maskAlpha);
    //this._drawRect(this.cropLeft+this.cropViewWidth, this.imageViewTop, this.width-this.cropViewWidth-this.cropLeft+this.imageViewLeft, this.height, this.maskColor, null, this.maskAlpha);
    //this._drawRect(this.cropLeft, this.imageViewTop, this.cropViewWidth, this.cropTop-this.imageViewTop, this.maskColor, null, this.maskAlpha);
    //this._drawRect(this.cropLeft, this.cropTop+this.cropViewHeight, this.cropViewWidth, this.height-this.cropViewHeight-this.cropTop+this.imageViewTop, this.maskColor, null, this.maskAlpha);
    this._drawRect(this.cropLeft, this.cropTop, this.cropViewWidth, this.cropViewHeight, this.maskColor, this.borderWidth,this.borderColor, this.maskAlpha);
  }

  ImageCropper.prototype._drawDragger = function(){
    this._drawRect(this.dragLeft, this.dragTop, this.dragSize, this.dragSize, null,null, this.dragColor, null);
  }

  ImageCropper.prototype._drawRect = function(x, y, width, height, color,borderWidth, borderColor, alpha){ //画矩形
    this.context.save();
    if(color !== null) this.context.fillStyle = color;
    if(borderColor !== null) this.context.strokeStyle = borderColor;
    if(alpha !== null) this.context.globalAlpha = alpha;
    if(borderWidth!=null)this.context.lineWidth=borderWidth;
    this.context.beginPath();

    this.context.rect(x, y, width, height);
    this.context.closePath();
    if(color !== null) this.context.fill();
    if(borderColor !== null) this.context.stroke();
    this.context.restore();
  }


  ImageCropper.prototype.isAvaiable = function() {
    return typeof(FileReader) !== "undefined";
  }

  ImageCropper.prototype.isImage = function(file) {
    return (/image/i).test(file.type);
  }
  ImageCropper.prototype.removePreviews=function(){
     this.previews.length=0;
  }
  ImageCropper.prototype.setCropper=function(cropWidth, cropHeight){
    this.cropMinHeight = cropHeight;
    this.cropMinWidth = cropWidth;
    if(0 && this.notFirstClick){
      this.ratio=cropWidth/cropHeight||this.cropWidth/this.cropHeight;
      this._save();
    }else{
      this.oldImageX=this.imageX;
      this.oldImageY=this.imageY;
      this.oldImageScale=this.imageScale;
      this.oldCropViewHeight=this.cropViewHeight;
      this.oldCropViewWidth=this.cropViewWidth;
      this.oldCropLeft=this.cropLeft;
      this.oldCropTop=this.cropTop;
      this.oldN=this.n;

      this.cropWidth = cropWidth||this.cropWidth;
      this.cropHeight = cropHeight||this.cropHeight;
      this.cropViewWidth = this.cropWidth;
      this.cropViewHeight =this.cropHeight;
      this.notFirstClick=true;
      this.ratio=cropWidth/cropHeight||this.cropWidth/this.cropHeight;
      this._update();
    }
  }
  ImageCropper.prototype._range=function(){
    this.n=this.$range.val();
    this.max=this.$range.attr("max");
    this.min=this.$range.attr("min");
    this.step=this.$range.attr("step");
    if(this.mousewheelUp<0){
      if(this.n>this.min){
        this.imageScale=this.firstScale*(this.n-this.step);
        this.$range.val(this.n-this.step);
        this.$range.trigger("change");
      }

    }else {
      if(this.n<this.max){
        this.imageScale=this.firstScale*((this.n-0)+(this.step-0));
        this.$range.val((this.n-0)+(this.step-0));
        this.$range.trigger("change");
      }
    }
  }
  ImageCropper.prototype._save=function(){
    var imageX=this.imageX;
    var imageY=this.imageY;
    var imageScale=this.imageScale;
    var cropViewHeight=this.cropViewHeight;
    var cropViewWidth=this.cropViewWidth;
    var cropLeft=this.cropLeft;
    var cropTop=this.cropTop;
    var n=this.n;

    this.imageX=this.oldImageX;
    this.imageY=this.oldImageY;
    this.imageScale=this.oldImageScale;
    this.cropViewHeight=this.oldCropViewHeight;
    this.cropViewWidth=this.oldCropViewWidth;
    this.cropLeft=this.oldCropLeft;
    this.cropTop=this.oldCropTop;
    this.n=this.oldN;

    this.oldImageX=imageX;
    this.oldImageY=imageY;
    this.oldImageScale=imageScale;
    this.oldCropViewHeight=cropViewHeight;
    this.oldCropViewWidth=cropViewWidth;
    this.oldCropLeft=cropLeft;
    this.oldCropTop=cropTop;
    this.oldN=n;

    this.$range.val(this.n);
    this.$range.trigger("change");
  }
  ImageCropper.prototype.zoom=function(){
    this.n=this.$range.val();
    this.imageScale=this.firstScale*this.n;
    this.imageX =(this.width/2-this.cropLeft-this.cropViewWidth/2)*(this.image.width*this.imageScale-this.width)/(this.width-this.cropViewWidth);
    this.imageY =(this.height/2-this.cropTop-this.cropViewHeight/2)*(this.image.height*this.imageScale-this.height)/(this.height-this.cropViewHeight);
    this._update();
  }
  ImageCropper.prototype.ajax=function(dataForm){
    var me = this;
    $.ajax({
      type: 'POST',
      url: me.url,
      data: dataForm,
      /**
       *必须false才会自动加上正确的Content-Type
       */
      contentType: false,
      /**
       * 必须false才会避开jQuery对 formdata 的默认处理
       * 必须false才会避开jQuery对 formdata 的默认处理
       * XMLHttpRequest会对 formdata 进行正确的处理
       */
      processData: false,
      success: function(data){
        me.onSuccess && me.onSuccess.call(me, data)
      },
      error: function(data){
        me.onError && me.onError.call(me, data);
      }
    })
  }
  ImageCropper.prototype.fileError = function(type){
    var message = ''
      , me = this;

    switch(type){
      case 1:   // 文件类型错误
        message = '文件类型错误，请检查您选择的文件';
        break;
      case 2:   // 图片格式错误
        message = '图片类型不符，请检查您选择的文件';
        break;
      case 3:   // 图片大小太大
        message = '图片太大，请检查您选择的文件';
        break;
      case 4:   // 图片尺寸过大
        message = '请上传小于' + me.imageMaxWidth + '*' + me.imageMaxHeight + '的图片';
        break;
      case 5:   // 图片尺寸过小
        message = '请上传大于' + me.imageMinWidth + '*' + me.imageMinHeight + '的图片';
        break;
    };

    me.onFileError && me.onFileError.call(me, message, type);
  }
})(window);