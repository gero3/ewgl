(function(global){
  var undef;
  
  var shaderProgram = function(args){
    this.renderer = args.renderer;
    
    this.vsMain = args.main || undef; 
    this.fsMain = args.main || undef; 
    this.extensions = args.extensions || [];
    
    this.uniforms = {};
    this.attributes = {};

    this.program = undef;
    
    this.stack = [];
    
    
  };
  
  shaderProgram.prototype.use = function(){
    var program;
    
    var vsmain = this.vsMain;
    var fsmain = this.fsMain;
    var shaderExts = this.extensions;
    
    var stackId = "";
    var vsID = (vsmain.calculateID && vsmain.calculateID()) || 0;
    stackId += "V" + vsmain + "," + vsID;

    var fsID = (fsmain.calculateID && fsmain.calculateID()) || 0;
    stackId += "F" + fsmain + "," + fsID;
    
    
    var registerID = [];
    for(i = 0,l=shaderExts.length;i<l;i++){
      shaderExt = shaderExts[i];
      registerID[i] = (shaderExt.calculateID && shaderExt.calculateID()) || 0;
      stackId += "E" + shaderExt.shaderExtensionCounter + "," + registerID[i];
    }
    
    if (this.stack[stackId]){
      
      program = this.stack[stackId].program;
      this.uniforms = this.stack[stackId].uniforms; 
      this.attributes = this.stack[stackId].attributes;
      
      this.renderer.useProgram(program);
      this.program = program;
      
    } else {
      this.generateShaderExts(vsID,fsID,registerID);
      program = this.renderer.createShaderProgram(
        this.compose(this.vsMain,this.extensions,this.vsMain.type),
        this.compose(this.fsMain,this.extensions,this.fsMain.type)
      );
      
      
      this.renderer.useProgram(program);
      this.program = program;
      
      this.initializeProgram(this,vsID,fsID,registerID);
      
      this.stack[stackId] = {};
      this.stack[stackId].program = program;
      this.stack[stackId].uniforms = this.uniforms; 
      this.stack[stackId].attributes = this.attributes;
    }   

    

    return this;
  };
  
  shaderProgram.prototype.initializeProgram = function(program,vsID,fsID,shaderExtID){
    this.uniforms = {}; 
    this.attributes = {};
    
    this.vsMain.getShaderInputs(program,vsID);
    this.fsMain.getShaderInputs(program,fsID);
    
    for(i = 0,l=this.extensions.length;i<l;i++){
      this.extensions[i].getShaderInputs(program,shaderExtID[i]);
    }
  };
  
  shaderProgram.prototype.generateShaderExts = function(vsID,fsID,extIDs){
    
    //vertex part
    var vsmain = this.vsMain;
    var fsmain = this.fsMain;
    var shaderExts = this.extensions;
    
    vsmain.generateShaderPieces(vsID);
    fsmain.generateShaderPieces(fsID);
    
    for(i = 0,l=shaderExts.length;i<l;i++){
      shaderExt = shaderExts[i];
      shaderExt.generateShaderPieces(extIDs[i]);
    }
    
  };
  
  //overrideable
  shaderProgram.prototype.compose = function(main,shaderExts,type){
    
    var i,l,shaderExt,result;
    
    var preprocessor = main.preprocessor,
        uniforms = main.uniforms,
        attributes = main.attributes,
        varyings = main.varyings,
        program = main.program;
        
    for(i = 0,l=shaderExts.length;i<l;i++){
      shaderExt = shaderExts[i];
      if (shaderExt.type == type){ 
        preprocessor += shaderExt.preprocessor;
        
        attributes += shaderExt.attributes;
        uniforms += shaderExt.uniforms;
        varyings += shaderExt.varyings;
        
        program += shaderExt.program;
      }
    }
    
    result =  preprocessor + "\n" +
              attributes + "\n" +
              uniforms + "\n" +
              varyings + "\n" +
              "void main() {\n" +
              program +
              "}";
              
    return result;

    
  };
  
  
  global.shaderProgram = shaderProgram;
  
  
}(EWGL))