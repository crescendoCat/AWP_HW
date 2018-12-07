window.onload = function(){
    var autoRedirectCheckbox = document.getElementById("autoRedirectCheck");
    var redirectImmediatelyCheckbox = document.getElementById("redirectImmediatelyCheck");
    var redirectSslCheckbox = document.getElementById("redirectSslCheck");
    var div = document.querySelector("#counter");
  if(autoRedirectCheckbox.checked && div!= null) {
    var myVar = setInterval(function() {
        
        var count = Number(div.attributes['countDown'].value) - 1;
        if (count > 0) {
            div.innerHTML = "This page will be redirect in " + count + " second(s).";
            div.setAttribute("countDown", count);
        } else if (count <= 0) {
            div.innerHTML = "Redirecting ...";
            window.location = div.attributes['redirectUri'].value;
            clearInterval(myVar);
        }
    }, 1000);
  }
  
  autoRedirectCheckbox.addEventListener( 'change', function() {
    if(this.checked) {
        redirectImmediatelyCheckbox.disabled = false;
    } else {
        redirectImmediatelyCheckbox.disabled = true;
    }
  });
  
}