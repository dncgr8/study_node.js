var f = function(){
    console.log(1+4);
    console.log(2+7);
}

var a = [f];
a[0]();

var o= {
    func:f
}

o.func();