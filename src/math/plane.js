(function(global) {
    
    var plane = function(args) {
        
        this.normal = vec3.create();
        this.distance = 0;
        
    };
    
    plane.prototype.setCoefficients = function(a,b,c,d){
        
        var l = Math.sqrt(a*a+b*b+c*c);
        vec3.set([a/l,b/l,c/l],this.normal);
        this.distance = d/l;
        
    };
    
    global.plane = plane;
    
})(EWGL);