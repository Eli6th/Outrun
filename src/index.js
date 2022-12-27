function isMobile(){
    // credit to Timothy Huang for this regex test: 
    // https://dev.to/timhuang/a-simple-way-to-detect-if-browser-is-on-a-mobile-device-with-javascript-44j3
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        return true
   }
   else{
        return false
   }
}

window.onload = () => {
    console.log(isMobile());
    if (isMobile()) {
        document.getElementById("game").style.opacity = "0";
        document.getElementById("sorry").style.opacity = "1";
    }
};