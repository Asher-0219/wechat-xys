function imageUtil(e,w,h) {  
  var imageSize = {};  
  var originalWidth = e.detail.width;//图片原始宽  
  var originalHeight = e.detail.height;//图片原始高  
  var originalScale = originalHeight/originalWidth;//图片高宽比   
  //获取屏幕宽高  
  var windowWidth = w;  
  var windowHeight = h;  
  var windowscale = windowHeight/windowWidth;//屏幕高宽比   
  if(originalScale < windowscale){
    //图片高宽比小于屏幕高宽比  
    //图片缩放后的宽为屏幕宽  
     imageSize.imageWidth = windowWidth;  
     imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;  
  }else{
    //图片高宽比大于屏幕高宽比  
    //图片缩放后的高为屏幕高  
     imageSize.imageHeight = windowHeight;  
     imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;  
  }  
  imageSize.windowWidth = windowWidth;
  imageSize.windowHeight = windowHeight;
  return imageSize;  
}  
  
module.exports = {  
  imageUtil: imageUtil  
}  