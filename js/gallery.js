var Duck = window.Duck || {};
window.Duck = Duck;

Duck.Gallery = (function () {
    var SECONDS = 7;
    var images = [];
    var photoEl;
    var last = -1;

    function pick() {
        if (images.length <= 1) return 0;
        var index;
        do {
            index = Math.floor(Math.random() * images.length);
        } while (index === last);
        return index;
    }

    function showNext() {
        var index = pick();
        var src = "screenshots/" + images[index];
        var loader = new Image();
        loader.onload = function () {
            photoEl.className = "polaroid-photo polaroid-photo-out";
            setTimeout(function () {
                photoEl.style.backgroundImage = "url('" + src + "')";
                photoEl.className = "polaroid-photo";
            }, 400);
            last = index;
        };
        loader.src = src;
    }

    function start() {
        images = Duck.Data.screenshots || [];
        photoEl = document.getElementById("polaroid-photo");
        if (!images.length) {
            document.getElementById("polaroid").style.display = "none";
            return;
        }
        showNext();
        setInterval(showNext, SECONDS * 1000);
    }

    return { start: start };
})();
