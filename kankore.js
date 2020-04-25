jQuery.browser = {};
(function () {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
})();

var prefixs = ["-webkit-", "-moz-", "-ms-", ""];
(function (jQuery) {
    document.ondragstart = function () {
        return false;
    }
    var kans = jQuery(".kankore-bath .kan"),
        kan_id = Math.floor(Math.random() * kans.length),
        kan = kans.eq(kan_id);
    var screen_width = jQuery(window).width(),
        screen_height = jQuery(window).height(),
        x = Math.random() > .5 ? screen_width : -170,
        dx = x > 0 ? -10 : 10,
        y = screen_height - 170,
        angle = 1.3,
        water_direction = x > 0 ? "waves-r2l" : "waves-l2r";
    var water_animation = {};
    for (var i in prefixs)
        water_animation[prefixs[i] + "animation"] = water_direction + " 10s linear infinite";
    jQuery(".kankore-bath .water").css(water_animation);
    kan.css({
        "left": x,
        "top": y,
        "display": "block"
    }).addClass("floating")
    jQuery(document).on("mousedown", ".kan", start_drag).on("mousemove", dragging).on("mouseup", stop_drag);
    jQuery(window).resize(function () {
        screen_height = jQuery(window).height(), y = screen_height - 170;
    });
    var tick = null;
    float();

    function float() {
        clearInterval(tick);
        tick = setInterval(frame, 1000);
    }

    function frame() {
        if (x < -170 || x > screen_width) {
            stop();
        }
        x += dx;
        var _y = y + 3 * Math.sin(x) - 3;
        angle = Math.random() * 4 - 2;
        var transform = {
            "left": x,
            "top": _y
        };
        for (var i in prefixs) {
            transform[prefixs[i] + "transform"] = "rotate(" + angle + "deg)"
        }
        if (jQuery.browser.msie && jQuery.browser.version < 10) {
            kan.animate(transform, 1000, "linear");
        } else {
            kan.css(transform);
        }
    }

    function pause() {
        clearInterval(tick);
    }

    function stop() {
        pause();
        jQuery(".kankore-bath").fadeOut();
    }
    var offsetX, offsetY, mouse_down_flag = false,
        mouse_move_flag = false;

    function start_drag(e) {
        pause();
        kan.removeClass("floating").addClass("dragging");
        mouse_down_flag = true;
        mouse_move_flag = false;
        offsetX = kan.offset().left - e.screenX;
        offsetY = kan.offset().top - e.pageY;
    }

    function dragging(e) {
        if (!mouse_down_flag) return;
        mouse_move_flag = true;
        x = e.clientX + offsetX;
        kan.css({
            "left": x,
            "top": e.clientY + offsetY
        });
    }

    function stop_drag() {
        if (!mouse_down_flag)
            return;
        if (!mouse_move_flag) {
            var url = kan.attr("href");
            window.open(url, "_self");
        } else {
            kan.removeClass("dragging").addClass("dropping");
            if (jQuery.browser.msie && jQuery.browser.version < 10)
                kan.animate({
                    "left": x,
                    "top": y
                }, 800);
            else
                kan.css({
                    "left": x,
                    "top": y
                });
            setTimeout(function () {
                kan.removeClass("dropping").addClass("floating");
                frame();
                float();
            }, 800);
        }
        mouse_down_flag = false;
        mouse_move_flag = false;
    }
})(jQuery);