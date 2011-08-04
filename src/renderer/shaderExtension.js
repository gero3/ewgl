(function(global){
    
  var shaderExtension = function(args){
    this.type = args.type;
    
    this.preprocessor = args.preprocessor || "";
    
    this.uniforms = args.uniforms || "";
    this.attributes = args.attributes || "";
    this.varyings = args.varyings || "";
    
    this.functionDeclarations = args.functionDeclarations || "";
    
    this.programPieces = args.programPieces || {};
    this.program = args.program || "";
    this.stack = {};
    
    Object.defineProperties(this,{
      "_changed" : {
        "value" : true,
        "configurable" : true,   
        "writable": true
      },
      "changed" : {
        "get" : function(){
          return this._changed;
        }
      },
      "_idNumber" : {
        "value" : -1,
        "configurable" : true,   
        "writable": true
      },
      "idNumber" : {
        "get" : function(){
          return this._idNumber;
        },
        "set" : function(value){
          if (value === this._idNumber){
            this._changed = false;
          } else {
            this._changed = true;
            this._idNumber = value;
            
            if (!this.stack[value]){
              this.stack[value] = {
                "preprocessor"         : this.preprocessor,
                "uniforms"             : this.uniforms,
                "attributes"           : this.attributes,
                "varyings"             : this.varyings,
                "functionDeclarations" : this.functionDeclarations,
                "programPieces"        : this.programPieces,
                "program"              : this.program
              };
            }
          }
        }
      }
    });  
  };
  
  shaderExtension.prototype.clear = function(){
    this.preprocessor = "";
    
    this.uniforms = "";
    this.attributes = "";
    this.varyings = "";
    
    this.functionDeclarations = "";
    
    this.programPieces = {};
    this.program = "";    
  };
  
  shaderExtension.prototype.fullClear = function(){
    this.preprocessor = "";
    
    this.uniforms = "";
    this.attributes = "";
    this.varyings = "";
    
    this.functionDeclarations = "";
    
    this.programPieces = {};
    this.program = "";
    this.stack = [];
    
    this.idNumber = -1;
  };
  
  shaderExtension.prototype.addAttribute = function(attributeName,type){
    this.attributes += "attribute " + type + " " + attributeName + ";\n";
  };
  
  shaderExtension.prototype.addUniform = function(uniformName,type){
    this.uniforms += "uniform " + type + " " + uniformName + ";\n";
  };
  
  shaderExtension.prototype.addVarying = function(varyingName,type){
    this.varyings += "varying " + type + " " + varyingName + ";\n";
  };
  
  shaderExtension.prototype.appendProgram = function(program){
    this.program += program + "\n";
  };
  
  shaderExtension.prototype.addPreprocessor = function(preprocessor){
    this.preprocessor += preprocessor + "\n\n";
  };
  
  shaderExtension.prototype.useId = function(nb){
     var value = this.stack[nb];
     
     this.preprocessor = value.preprocessor;
     this.uniforms = value.uniforms;
     this.attributes = value.attributes;
     this.varyings = value.varyings;
     this.functionDeclarations = value.functionDeclarations;
     this.programPieces = value.programPieces;
     this.program = value.program;
     
  };
  
  
  shaderExtension.types = {
    "vertex"   : 35633,
    "fragment" : 35634
  };
  
  shaderExtension.uniform = {};
  shaderExtension.uniform.types = {
    "vec2"      : "vec2",
    "vec3"      : "vec3",
    "vec4"      : "vec4",
    "mat3"      : "mat3",
    "mat4"      : "mat4",
    "sampler2D" : "sampler2D"
  };
  
  shaderExtension.varying = {};
  shaderExtension.varying.types = {
    "vec2"   : "vec2",
    "vec3"   : "vec3",
    "vec4"   : "vec4",
    "mat3"   : "mat3",
    "mat4"   : "mat4"
  };
  
  global.shaderExtension = shaderExtension;
  
  
}(EWGL));