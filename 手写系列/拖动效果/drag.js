~function () {
    /**获取DOM对象*/
    var getDom = function (el) {
        if (el[0] === '#')
            return document.getElementById(el.slice(1));
        else if (el[0] === '.')
            return document.getElementsByClassName(el.slice(1));
        else
            return document.getElementsByTagName(el);
    };
    var box = getDom('#box');
    var winWH = {
        W: document.documentElement.clientWidth,
        H: document.documentElement.clientHeight
    };
    var boxWH = {
        W: box.offsetWidth,
        H: box.offsetHeight
    };
    var maxWH = {
        W: winWH.W - boxWH.W,
        H: winWH.H - boxWH.H
    };
    var position = { startX: 0, startY: 0, x: 0, y: 0, prevX: 0, prevY: 0 };
    var setTranslate = function (x, y) {
        x = x < 0 ? 0 : (x > maxWH.W ? maxWH.W : x);
        y = y < 0 ? 0 : (y > maxWH.H ? maxWH.H : y);
        position.prevX = x;
        position.prevY = y;
        return 'translate(' + x + 'px,' + y + 'px)';
    };
    var boxMouseDown = function (ev) {
        position.startX = ev.clientX;
        position.startY = ev.clientY;
        position.x = position.prevX;
        position.y = position.prevY;
        window.addEventListener('mousemove', boxMouseMove);
        window.addEventListener('mouseup', boxMouseUp);
    };
    var boxMouseMove = function (ev) {
        console.log(111);
        ev.preventDefault();
        var x = ev.clientX - position.startX + position.x, y = ev.clientY - position.startY + position.y;
        box.style.transform = setTranslate(x, y);
    };
    var boxMouseUp = function (ev) {
        window.removeEventListener('mousemove', boxMouseMove);
        window.removeEventListener('mouseup', boxMouseUp);
    };
    box.addEventListener('mousedown', boxMouseDown);
}();
