~function(){
    /**获取DOM对象*/
    const getDom = (el:string):any =>{
        if(el[0]==='#') return document.getElementById(el.slice(1))
        else if(el[0]==='.') return document.getElementsByClassName(el.slice(1))
        else return document.getElementsByTagName(el);
    }

    const box:HTMLSelectElement = getDom('#box');
    let winWH = {
        W:document.documentElement.clientWidth,
        H:document.documentElement.clientHeight
    };
    let boxWH = {
        W:box.offsetWidth,
        H:box.offsetHeight
    }
    let maxWH = {
        W:winWH.W-boxWH.W,
        H:winWH.H-boxWH.H,
    }

    let position={startX:0,startY:0,x:0,y:0,prevX:0,prevY:0};

    const setTranslate=(x:number,y:number):string=>{
        x = x < 0 ? 0 : ( x > maxWH.W ? maxWH.W : x )
        y = y < 0 ? 0 : ( y > maxWH.H ? maxWH.H : y )
        position.prevX=x;
        position.prevY=y;
        return 'translate('+ x + 'px,'+ y+'px)';
    }

    const boxMouseDown = (ev:MouseEvent) =>{
        position.startX = ev.clientX
        position.startY = ev.clientY

        position.x=position.prevX;
        position.y=position.prevY;
        
        window.addEventListener('mousemove',boxMouseMove)
        window.addEventListener('mouseup',boxMouseUp)
    }

    const boxMouseMove = function(ev:MouseEvent){
        console.log(111)
        ev.preventDefault();
        let x = ev.clientX-position.startX+position.x,
            y = ev.clientY-position.startY+position.y;
        box.style.transform = setTranslate(x,y);
    }

    const boxMouseUp = (ev:MouseEvent) =>{
        window.removeEventListener('mousemove',boxMouseMove)
        window.removeEventListener('mouseup',boxMouseUp)
    }

    box.addEventListener('mousedown',boxMouseDown)

}()