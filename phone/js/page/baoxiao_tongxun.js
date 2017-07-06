(function($) {
    appcan.ready(function() {
        $("#ScrollContent").on("reload", function(ev,scrollbox){
            alert(1);
           scrollbox.reset();
        });
        $("#ScrollContent").on("more", function(ev,scrollbox){
            scrollbox.reset();
        });
        var $scrollbox = $.scrollbox($("body")).on("releaseToReload",function() { 
            //After Release or call reload function,we reset the bounce
            $("#ScrollContent").trigger("reload", this);
        }).on("onReloading",function(a) { 
            //if onreloading status, drag will trigger this event
        }).on("dragToReload",function() { 
            //drag over 30% of bounce height,will trigger this event
        }).on("draging",function(status) {
            
        }).on("release",function() { 
            //on draging, this event will be triggered.
        }).on("scrollbottom",function() { 
            //on scroll bottom,this event will be triggered.you should get data from server
            $("#ScrollContent").trigger("more", this);
        });
        $scrollbox.hide();
    });
    appcan.button("#nav-left", "btn-act",function(){
        winClose(-1);
    });
    appcan.button("#nav-right", "btn-act",function(){
        
    });
})($);