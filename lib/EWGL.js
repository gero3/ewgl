; 

var EWGL = {};

window.requestAnimationFrame = (function() {
  return  window.requestAnimationFrame || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame || 
          window.oRequestAnimationFrame || 
          window.msRequestAnimationFrame ||
  function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

EWGL.noop = function() {};

EWGL.DEBUG = true;; 


/* 
 * glMatrix.js - High performance matrix and vector operations for WebGL
 * version 0.9.4
 *
 * updated by EWGL to be more consistent
 * version 0.1
 */
 
/*
 * Copyright (c) 2010 Brandon Jones
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
 */

// Fallback for systems that don't support WebGL

var arraychosen = function(elements){
  var a = [];
  while (elements--){
    a.push(0);
  };
  return a;
};

if(typeof Float32Array != 'undefined') {
  glMatrixArrayType = Float32Array;
} else if(typeof WebGLFloatArray != 'undefined') {
  glMatrixArrayType = WebGLFloatArray;
} else {
  glMatrixArrayType = arraychosen;
}

/*
 * vec3 - 3 Dimensional Vector
 */
var vec3 = {};

/*
 * vec3.create
 * Creates a new instance of a vec3 using the default array type
 * Any javascript array containing at least 3 numeric elements can serve as a vec3
 *
 * Params:
 * vec - Optional, vec3 containing values to initialize with
 *
 * Returns:
 * New vec3
 */
vec3.create = function(vec) {
  var dest = new glMatrixArrayType(3);
  
  if(vec) {
    dest[0] = vec[0];
    dest[1] = vec[1];
    dest[2] = vec[2];
  }
  
  return dest;
};

/*
 * vec3.set
 * Copies the values of one vec3 to another
 *
 * Params:
 * vec - vec3 containing values to copy
 * dest - vec3 receiving copied values
 *
 * Returns:
 * dest
 */
vec3.set = function(vec, dest) {
  dest[0] = vec[0];
  dest[1] = vec[1];
  dest[2] = vec[2];
  
  return dest;
};

/*
 * vec3.add
 * Performs a vector addition
 *
 * Params:
 * vec - vec3, first operand
 * vec2 - vec3, second operand
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.add = function(vec, vec2, dest) {
  if(!dest || vec == dest) {
    vec[0] += vec2[0];
    vec[1] += vec2[1];
    vec[2] += vec2[2];
    return vec;
  }
  
  dest[0] = vec[0] + vec2[0];
  dest[1] = vec[1] + vec2[1];
  dest[2] = vec[2] + vec2[2];
  return dest;
};

/*
 * vec3.subtract
 * Performs a vector subtraction
 *
 * Params:
 * vec - vec3, first operand
 * vec2 - vec3, second operand
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.subtract = function(vec, vec2, dest) {
  if(!dest || vec == dest) {
    vec[0] -= vec2[0];
    vec[1] -= vec2[1];
    vec[2] -= vec2[2];
    return vec;
  }
  
  dest[0] = vec[0] - vec2[0];
  dest[1] = vec[1] - vec2[1];
  dest[2] = vec[2] - vec2[2];
  return dest;
};

/*
 * vec3.negate
 * Negates the components of a vec3
 *
 * Params:
 * vec - vec3 to negate
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.negate = function(vec, dest) {
  if(!dest) { dest = vec; }
  
  dest[0] = -vec[0];
  dest[1] = -vec[1];
  dest[2] = -vec[2];
  return dest;
};

/*
 * vec3.scale
 * Multiplies the components of a vec3 by a scalar value
 *
 * Params:
 * vec - vec3 to scale
 * val - Numeric value to scale by
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.scale = function(vec, val, dest) {
  if(!dest || vec == dest) {
    vec[0] *= val;
    vec[1] *= val;
    vec[2] *= val;
    return vec;
  }
  
  dest[0] = vec[0]*val;
  dest[1] = vec[1]*val;
  dest[2] = vec[2]*val;
  return dest;
};

vec3.scaleVec3 = function(vec, vec2, dest) {
  if(!dest) {
    dest = vec;
  }
  
  dest[0] = vec[0]*vec2[0];
  dest[1] = vec[1]*vec2[1];
  dest[2] = vec[2]*vec2[2];
  return dest;
};

/*
 * vec3.normalize
 * Generates a unit vector of the same direction as the provided vec3
 * If vector length is 0, returns [0, 0, 0]
 *
 * Params:
 * vec - vec3 to normalize
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.normalize = function(vec, dest) {
  if(!dest) { dest = vec; }
  
  var x = vec[0], y = vec[1], z = vec[2];
  var len = Math.sqrt(x*x + y*y + z*z);
  
  if (!len) {
    dest[0] = 0;
    dest[1] = 0;
    dest[2] = 0;
    return dest;
  } else if (len === 1) {
    dest[0] = x;
    dest[1] = y;
    dest[2] = z;
    return dest;
  }
  
  len = 1 / len;
  dest[0] = x*len;
  dest[1] = y*len;
  dest[2] = z*len;
  return dest;
};

/*
 * vec3.cross
 * Generates the cross product of two vec3s
 *
 * Params:
 * vec - vec3, first operand
 * vec2 - vec3, second operand
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.cross = function(vec, vec2, dest){
  if(!dest) { dest = vec; }
  
  var x = vec[0], y = vec[1], z = vec[2];
  var x2 = vec2[0], y2 = vec2[1], z2 = vec2[2];
  
  dest[0] = y*z2 - z*y2;
  dest[1] = z*x2 - x*z2;
  dest[2] = x*y2 - y*x2;
  return dest;
};

/*
 * vec3.length
 * Caclulates the length of a vec3
 *
 * Params:
 * vec - vec3 to calculate length of
 *
 * Returns:
 * Length of vec
 */
vec3.length = function(vec){
  var x = vec[0], y = vec[1], z = vec[2];
  return Math.sqrt(x*x + y*y + z*z);
};

/*
 * vec3.dot
 * Caclulates the dot product of two vec3s
 *
 * Params:
 * vec - vec3, first operand
 * vec2 - vec3, second operand
 *
 * Returns:
 * Dot product of vec and vec2
 */
vec3.dot = function(vec, vec2){
  return vec[0]*vec2[0] + vec[1]*vec2[1] + vec[2]*vec2[2];
};

/*
 * vec3.direction
 * Generates a unit vector pointing from one vector to another
 *
 * Params:
 * vec - origin vec3
 * vec2 - vec3 to point to
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
vec3.direction = function(vec, vec2, dest) {
  if(!dest) { dest = vec; }
  
  var x = vec[0] - vec2[0];
  var y = vec[1] - vec2[1];
  var z = vec[2] - vec2[2];
  
  var len = Math.sqrt(x*x + y*y + z*z);
  if (!len) { 
    dest[0] = 0; 
    dest[1] = 0; 
    dest[2] = 0;
    return dest; 
  }
  
  len = 1 / len;
  dest[0] = x * len; 
  dest[1] = y * len; 
  dest[2] = z * len;
  return dest; 
};

/*
 * vec3.str
 * Returns a string representation of a vector
 *
 * Params:
 * vec - vec3 to represent as a string
 *
 * Returns:
 * string representation of vec
 */
vec3.str = function(vec) {
  return '[' + vec[0] + ', ' + vec[1] + ', ' + vec[2] + ']'; 
};

/*
 * mat3 - 3x3 Matrix
 */
var mat3 = {};

/*
 * mat3.create
 * Creates a new instance of a mat3 using the default array type
 * Any javascript array containing at least 9 numeric elements can serve as a mat3
 *
 * Params:
 * mat - Optional, mat3 containing values to initialize with
 *
 * Returns:
 * New mat3
 */
mat3.create = function(mat) {
  var dest = new glMatrixArrayType(9);
  
  if(mat) {
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[3];
    dest[4] = mat[4];
    dest[5] = mat[5];
    dest[6] = mat[6];
    dest[7] = mat[7];
    dest[8] = mat[8];
    dest[9] = mat[9];
  }
  
  return dest;
};

/*
 * mat3.set
 * Copies the values of one mat3 to another
 *
 * Params:
 * mat - mat3 containing values to copy
 * dest - mat3 receiving copied values
 *
 * Returns:
 * dest
 */
mat3.set = function(mat, dest) {
  dest[0] = mat[0];
  dest[1] = mat[1];
  dest[2] = mat[2];
  dest[3] = mat[3];
  dest[4] = mat[4];
  dest[5] = mat[5];
  dest[6] = mat[6];
  dest[7] = mat[7];
  dest[8] = mat[8];
  return dest;
};

/*
 * mat3.identity
 * Sets a mat3 to an identity matrix
 *
 * Params:
 * dest - mat3 to set
 *
 * Returns:
 * dest
 */
mat3.identity = function(dest) {
  dest[0] = 1;
  dest[1] = 0;
  dest[2] = 0;
  dest[3] = 0;
  dest[4] = 1;
  dest[5] = 0;
  dest[6] = 0;
  dest[7] = 0;
  dest[8] = 1;
  return dest;
};

/*
 * mat3.toMat4
 * Copies the elements of a mat3 into the upper 3x3 elements of a mat4
 *
 * Params:
 * mat - mat3 containing values to copy
 * dest - Optional, mat4 receiving copied values
 *
 * Returns:
 * dest if specified, a new mat4 otherwise
 */
mat3.toMat4 = function(mat, dest) {
  if(!dest) { dest = mat4.create(); }
  
  dest[0] = mat[0];
  dest[1] = mat[1];
  dest[2] = mat[2];
  dest[3] = 0;

  dest[4] = mat[3];
  dest[5] = mat[4];
  dest[6] = mat[5];
  dest[7] = 0;

  dest[8] = mat[6];
  dest[9] = mat[7];
  dest[10] = mat[8];
  dest[11] = 0;

  dest[12] = 0;
  dest[13] = 0;
  dest[14] = 0;
  dest[15] = 1;
  
  return dest;
}

/*
 * mat3.str
 * Returns a string representation of a mat3
 *
 * Params:
 * mat - mat3 to represent as a string
 *
 * Returns:
 * string representation of mat
 */
mat3.str = function(mat) {
  return '[' + mat[0] + ', ' + mat[1] + ', ' + mat[2] + 
    ', ' + mat[3] + ', '+ mat[4] + ', ' + mat[5] + 
    ', ' + mat[6] + ', ' + mat[7] + ', '+ mat[8] + ']';
};

/*
 * mat4 - 4x4 Matrix
 */
var mat4 = {};

/*
 * mat4.create
 * Creates a new instance of a mat4 using the default array type
 * Any javascript array containing at least 16 numeric elements can serve as a mat4
 *
 * Params:
 * mat - Optional, mat4 containing values to initialize with
 *
 * Returns:
 * New mat4
 */
mat4.create = function(mat) {
  var dest = new glMatrixArrayType(16);
  
  if(mat) {
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[3];
    dest[4] = mat[4];
    dest[5] = mat[5];
    dest[6] = mat[6];
    dest[7] = mat[7];
    dest[8] = mat[8];
    dest[9] = mat[9];
    dest[10] = mat[10];
    dest[11] = mat[11];
    dest[12] = mat[12];
    dest[13] = mat[13];
    dest[14] = mat[14];
    dest[15] = mat[15];
  }
  
  return dest;
};

/*
 * mat4.set
 * Copies the values of one mat4 to another
 *
 * Params:
 * mat - mat4 containing values to copy
 * dest - mat4 receiving copied values
 *
 * Returns:
 * dest
 */
mat4.set = function(mat, dest) {
  dest[0] = mat[0];
  dest[1] = mat[1];
  dest[2] = mat[2];
  dest[3] = mat[3];
  dest[4] = mat[4];
  dest[5] = mat[5];
  dest[6] = mat[6];
  dest[7] = mat[7];
  dest[8] = mat[8];
  dest[9] = mat[9];
  dest[10] = mat[10];
  dest[11] = mat[11];
  dest[12] = mat[12];
  dest[13] = mat[13];
  dest[14] = mat[14];
  dest[15] = mat[15];
  return dest;
};

/*
 * mat4.identity
 * Sets a mat4 to an identity matrix
 *
 * Params:
 * dest - mat4 to set
 *
 * Returns:
 * dest
 */
mat4.identity = function(dest) {
  dest[0] = 1;
  dest[1] = 0;
  dest[2] = 0;
  dest[3] = 0;
  dest[4] = 0;
  dest[5] = 1;
  dest[6] = 0;
  dest[7] = 0;
  dest[8] = 0;
  dest[9] = 0;
  dest[10] = 1;
  dest[11] = 0;
  dest[12] = 0;
  dest[13] = 0;
  dest[14] = 0;
  dest[15] = 1;
  return dest;
};

/*
 * mat4.transpose
 * Transposes a mat4 (flips the values over the diagonal)
 *
 * Params:
 * mat - mat4 to transpose
 * dest - Optional, mat4 receiving transposed values. If not specified result is written to mat
 *
 * Returns:
 * dest is specified, mat otherwise
 */
mat4.transpose = function(mat, dest) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if(!dest || mat == dest) { 
    var a01 = mat[1], a02 = mat[2], a03 = mat[3];
    var a12 = mat[6], a13 = mat[7];
    var a23 = mat[11];
    
    mat[1] = mat[4];
    mat[2] = mat[8];
    mat[3] = mat[12];
    mat[4] = a01;
    mat[6] = mat[9];
    mat[7] = mat[13];
    mat[8] = a02;
    mat[9] = a12;
    mat[11] = mat[14];
    mat[12] = a03;
    mat[13] = a13;
    mat[14] = a23;
    return mat;
  }
  
  dest[0] = mat[0];
  dest[1] = mat[4];
  dest[2] = mat[8];
  dest[3] = mat[12];
  dest[4] = mat[1];
  dest[5] = mat[5];
  dest[6] = mat[9];
  dest[7] = mat[13];
  dest[8] = mat[2];
  dest[9] = mat[6];
  dest[10] = mat[10];
  dest[11] = mat[14];
  dest[12] = mat[3];
  dest[13] = mat[7];
  dest[14] = mat[11];
  dest[15] = mat[15];
  return dest;
};

/*
 * mat4.determinant
 * Calculates the determinant of a mat4
 *
 * Params:
 * mat - mat4 to calculate determinant of
 *
 * Returns:
 * determinant of mat
 */
mat4.determinant = function(mat) {
  // Cache the matrix values (makes for huge speed increases!)
  var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
  var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
  var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
  var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];

  return  a30*a21*a12*a03 - a20*a31*a12*a03 - a30*a11*a22*a03 + a10*a31*a22*a03 +
      a20*a11*a32*a03 - a10*a21*a32*a03 - a30*a21*a02*a13 + a20*a31*a02*a13 +
      a30*a01*a22*a13 - a00*a31*a22*a13 - a20*a01*a32*a13 + a00*a21*a32*a13 +
      a30*a11*a02*a23 - a10*a31*a02*a23 - a30*a01*a12*a23 + a00*a31*a12*a23 +
      a10*a01*a32*a23 - a00*a11*a32*a23 - a20*a11*a02*a33 + a10*a21*a02*a33 +
      a20*a01*a12*a33 - a00*a21*a12*a33 - a10*a01*a22*a33 + a00*a11*a22*a33;
};

/*
 * mat4.inverse
 * Calculates the inverse matrix of a mat4
 *
 * Params:
 * mat - mat4 to calculate inverse of
 * dest - Optional, mat4 receiving inverse matrix. If not specified result is written to mat
 *
 * Returns:
 * dest is specified, mat otherwise
 */
mat4.inverse = function(mat, dest) {
  if(!dest) { dest = mat; }
  
  // Cache the matrix values (makes for huge speed increases!)
  var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
  var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
  var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
  var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
  
  var b00 = a00*a11 - a01*a10;
  var b01 = a00*a12 - a02*a10;
  var b02 = a00*a13 - a03*a10;
  var b03 = a01*a12 - a02*a11;
  var b04 = a01*a13 - a03*a11;
  var b05 = a02*a13 - a03*a12;
  var b06 = a20*a31 - a21*a30;
  var b07 = a20*a32 - a22*a30;
  var b08 = a20*a33 - a23*a30;
  var b09 = a21*a32 - a22*a31;
  var b10 = a21*a33 - a23*a31;
  var b11 = a22*a33 - a23*a32;
  
  // Calculate the determinant (inlined to avoid double-caching)
  var invDet = 1/(b00*b11 - b01*b10 + b02*b09 + b03*b08 - b04*b07 + b05*b06);
  
  dest[0] = (a11*b11 - a12*b10 + a13*b09)*invDet;
  dest[1] = (-a01*b11 + a02*b10 - a03*b09)*invDet;
  dest[2] = (a31*b05 - a32*b04 + a33*b03)*invDet;
  dest[3] = (-a21*b05 + a22*b04 - a23*b03)*invDet;
  dest[4] = (-a10*b11 + a12*b08 - a13*b07)*invDet;
  dest[5] = (a00*b11 - a02*b08 + a03*b07)*invDet;
  dest[6] = (-a30*b05 + a32*b02 - a33*b01)*invDet;
  dest[7] = (a20*b05 - a22*b02 + a23*b01)*invDet;
  dest[8] = (a10*b10 - a11*b08 + a13*b06)*invDet;
  dest[9] = (-a00*b10 + a01*b08 - a03*b06)*invDet;
  dest[10] = (a30*b04 - a31*b02 + a33*b00)*invDet;
  dest[11] = (-a20*b04 + a21*b02 - a23*b00)*invDet;
  dest[12] = (-a10*b09 + a11*b07 - a12*b06)*invDet;
  dest[13] = (a00*b09 - a01*b07 + a02*b06)*invDet;
  dest[14] = (-a30*b03 + a31*b01 - a32*b00)*invDet;
  dest[15] = (a20*b03 - a21*b01 + a22*b00)*invDet;
  
  return dest;
};

mat3.transpose = function(mat, dest) {
        // If we are transposing ourselves we can skip a few steps but have to cache some values
        if(!dest || mat == dest) { 
                var a01 = mat[1], a02 = mat[2];
                var a12 = mat[5];
                
        mat[1] = mat[3];
        mat[2] = mat[6];
        mat[3] = a01;
        mat[5] = mat[7];
        mat[6] = a02;
        mat[7] = a12;
                return mat;
        }
        
        dest[0] = mat[0];
        dest[1] = mat[3];
        dest[2] = mat[6];
        dest[3] = mat[1];
        dest[4] = mat[4];
        dest[5] = mat[7];
        dest[6] = mat[2];
        dest[7] = mat[5];
        dest[8] = mat[8];
        return dest;
};


/*
 * mat4.toMat3
 * Copies the upper 3x3 elements of a mat4 into a mat3
 *
 * Params:
 * mat - mat4 containing values to copy
 * dest - Optional, mat3 receiving copied values
 *
 * Returns:
 * dest is specified, a new mat3 otherwise
 */
mat4.toMat3 = function(mat, dest) {
  if(!dest) { dest = mat3.create(); }
  
  dest[0] = mat[0];
  dest[1] = mat[1];
  dest[2] = mat[2];
  dest[3] = mat[4];
  dest[4] = mat[5];
  dest[5] = mat[6];
  dest[6] = mat[8];
  dest[7] = mat[9];
  dest[8] = mat[10];
  
  return dest;
};

/*
 * mat4.toInverseMat3
 * Calculates the inverse of the upper 3x3 elements of a mat4 and copies the result into a mat3
 * The resulting matrix is useful for calculating transformed normals
 *
 * Params:
 * mat - mat4 containing values to invert and copy
 * dest - Optional, mat3 receiving values
 *
 * Returns:
 * dest is specified, a new mat3 otherwise
 */
mat4.toInverseMat3 = function(mat, dest) {
  // Cache the matrix values (makes for huge speed increases!)
  var a00 = mat[0], a01 = mat[1], a02 = mat[2];
  var a10 = mat[4], a11 = mat[5], a12 = mat[6];
  var a20 = mat[8], a21 = mat[9], a22 = mat[10];
  
  var b01 = a22*a11-a12*a21;
  var b11 = -a22*a10+a12*a20;
  var b21 = a21*a10-a11*a20;
    
  var d = a00*b01 + a01*b11 + a02*b21;
  if (!d) { return null; }
  var id = 1/d;
  
  if(!dest) { dest = mat3.create(); }
  
  dest[0] = b01*id;
  dest[1] = (-a22*a01 + a02*a21)*id;
  dest[2] = (a12*a01 - a02*a11)*id;
  dest[3] = b11*id;
  dest[4] = (a22*a00 - a02*a20)*id;
  dest[5] = (-a12*a00 + a02*a10)*id;
  dest[6] = b21*id;
  dest[7] = (-a21*a00 + a01*a20)*id;
  dest[8] = (a11*a00 - a01*a10)*id;
  
  return dest;
};

/*
 * mat4.multiply
 * Performs a matrix multiplication
 *
 * Params:
 * mat - mat4, first operand
 * mat2 - mat4, second operand
 * dest - Optional, mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
mat4.multiply = function(mat, mat2, dest) {
  if(!dest) { dest = mat }
  
  // Cache the matrix values (makes for huge speed increases!)
  var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
  var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
  var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
  var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];
  
  var b00 = mat2[0], b01 = mat2[1], b02 = mat2[2], b03 = mat2[3];
  var b10 = mat2[4], b11 = mat2[5], b12 = mat2[6], b13 = mat2[7];
  var b20 = mat2[8], b21 = mat2[9], b22 = mat2[10], b23 = mat2[11];
  var b30 = mat2[12], b31 = mat2[13], b32 = mat2[14], b33 = mat2[15];
  
  dest[0] = b00*a00 + b01*a10 + b02*a20 + b03*a30;
  dest[1] = b00*a01 + b01*a11 + b02*a21 + b03*a31;
  dest[2] = b00*a02 + b01*a12 + b02*a22 + b03*a32;
  dest[3] = b00*a03 + b01*a13 + b02*a23 + b03*a33;
  dest[4] = b10*a00 + b11*a10 + b12*a20 + b13*a30;
  dest[5] = b10*a01 + b11*a11 + b12*a21 + b13*a31;
  dest[6] = b10*a02 + b11*a12 + b12*a22 + b13*a32;
  dest[7] = b10*a03 + b11*a13 + b12*a23 + b13*a33;
  dest[8] = b20*a00 + b21*a10 + b22*a20 + b23*a30;
  dest[9] = b20*a01 + b21*a11 + b22*a21 + b23*a31;
  dest[10] = b20*a02 + b21*a12 + b22*a22 + b23*a32;
  dest[11] = b20*a03 + b21*a13 + b22*a23 + b23*a33;
  dest[12] = b30*a00 + b31*a10 + b32*a20 + b33*a30;
  dest[13] = b30*a01 + b31*a11 + b32*a21 + b33*a31;
  dest[14] = b30*a02 + b31*a12 + b32*a22 + b33*a32;
  dest[15] = b30*a03 + b31*a13 + b32*a23 + b33*a33;
  
  return dest;
};

/*
 * mat4.multiplyVec3
 * Transforms a vec3 with the given matrix
 * 4th vector component is implicitly '1'
 *
 * Params:
 * mat - mat4 to transform the vector with
 * vec - vec3 to transform
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
mat4.multiplyVec3 = function(mat, vec, dest) {
  if(!dest) { dest = vec }
  
  var x = vec[0], y = vec[1], z = vec[2];
  
  dest[0] = mat[0]*x + mat[4]*y + mat[8]*z + mat[12];
  dest[1] = mat[1]*x + mat[5]*y + mat[9]*z + mat[13];
  dest[2] = mat[2]*x + mat[6]*y + mat[10]*z + mat[14];
  
  return dest;
};

/*
 * mat4.multiplyVec4
 * Transforms a vec4 with the given matrix
 *
 * Params:
 * mat - mat4 to transform the vector with
 * vec - vec4 to transform
 * dest - Optional, vec4 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
mat4.multiplyVec4 = function(mat, vec, dest) {
  if(!dest) { dest = vec }
  
  var x = vec[0], y = vec[1], z = vec[2], w = vec[3];
  
  dest[0] = mat[0]*x + mat[4]*y + mat[8]*z + mat[12]*w;
  dest[1] = mat[1]*x + mat[5]*y + mat[9]*z + mat[13]*w;
  dest[2] = mat[2]*x + mat[6]*y + mat[10]*z + mat[14]*w;
  dest[4] = mat[4]*x + mat[7]*y + mat[11]*z + mat[15]*w;
  
  return dest;
};

/*
 * mat4.translate
 * Translates a matrix by the given vector
 *
 * Params:
 * mat - mat4 to translate
 * vec - vec3 specifying the translation
 * dest - Optional, mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
mat4.translate = function(mat, vec, dest) {
  var x = vec[0], y = vec[1], z = vec[2];
  
  if(!dest || mat == dest) {
    mat[12] = mat[0]*x + mat[4]*y + mat[8]*z + mat[12];
    mat[13] = mat[1]*x + mat[5]*y + mat[9]*z + mat[13];
    mat[14] = mat[2]*x + mat[6]*y + mat[10]*z + mat[14];
    mat[15] = mat[3]*x + mat[7]*y + mat[11]*z + mat[15];
    return mat;
  }
  
  var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
  var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
  var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
  
  dest[0] = a00;
  dest[1] = a01;
  dest[2] = a02;
  dest[3] = a03;
  dest[4] = a10;
  dest[5] = a11;
  dest[6] = a12;
  dest[7] = a13;
  dest[8] = a20;
  dest[9] = a21;
  dest[10] = a22;
  dest[11] = a23;
  
  dest[12] = a00*x + a10*y + a20*z + mat[12];
  dest[13] = a01*x + a11*y + a21*z + mat[13];
  dest[14] = a02*x + a12*y + a22*z + mat[14];
  dest[15] = a03*x + a13*y + a23*z + mat[15];
  return dest;
};

mat4.setTranslation = function(mat, vec, dest) {
  var x = vec[0], y = vec[1], z = vec[2];
  
  if(!dest || mat == dest) {
    mat[12] = x;
    mat[13] = y;
    mat[14] = z;
    return mat;
  }
  
  var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
  var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
  var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
  
  dest[0] = a00;
  dest[1] = a01;
  dest[2] = a02;
  dest[3] = a03;
  dest[4] = a10;
  dest[5] = a11;
  dest[6] = a12;
  dest[7] = a13;
  dest[8] = a20;
  dest[9] = a21;
  dest[10] = a22;
  dest[11] = a23;
  
  dest[12] = x;
  dest[13] = y;
  dest[14] = z;
  dest[15] = mat[15];
  return dest;
};

/*
 * mat4.scale
 * Scales a matrix by the given vector
 *
 * Params:
 * mat - mat4 to scale
 * vec - vec3 specifying the scale for each axis
 * dest - Optional, mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
mat4.scale = function(mat, vec, dest) {
  var x = vec[0], y = vec[1], z = vec[2];
  
  if(!dest || mat == dest) {
    mat[0] *= x;
    mat[1] *= x;
    mat[2] *= x;
    mat[3] *= x;
    mat[4] *= y;
    mat[5] *= y;
    mat[6] *= y;
    mat[7] *= y;
    mat[8] *= z;
    mat[9] *= z;
    mat[10] *= z;
    mat[11] *= z;
    return mat;
  }
  
  dest[0] = mat[0]*x;
  dest[1] = mat[1]*x;
  dest[2] = mat[2]*x;
  dest[3] = mat[3]*x;
  dest[4] = mat[4]*y;
  dest[5] = mat[5]*y;
  dest[6] = mat[6]*y;
  dest[7] = mat[7]*y;
  dest[8] = mat[8]*z;
  dest[9] = mat[9]*z;
  dest[10] = mat[10]*z;
  dest[11] = mat[11]*z;
  dest[12] = mat[12];
  dest[13] = mat[13];
  dest[14] = mat[14];
  dest[15] = mat[15];
  return dest;
};

/*
 * mat4.rotate
 * Rotates a matrix by the given angle around the specified axis
 * If rotating around a primary axis (X,Y,Z) one of the specialized rotation functions should be used instead for performance
 *
 * Params:
 * mat - mat4 to rotate
 * angle - angle (in radians) to rotate
 * axis - vec3 representing the axis to rotate around 
 * dest - Optional, mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
mat4.rotate = function(mat, angle, axis, dest) {
  var x = axis[0], y = axis[1], z = axis[2];
  var len = Math.sqrt(x*x + y*y + z*z);
  if (!len) { return null; }
  if (len != 1) {
    len = 1 / len;
    x *= len; 
    y *= len; 
    z *= len;
  }
  
  var s = Math.sin(angle);
  var c = Math.cos(angle);
  var t = 1-c;
  
  // Cache the matrix values (makes for huge speed increases!)
  var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
  var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
  var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
  
  // Construct the elements of the rotation matrix
  var b00 = x*x*t + c, b01 = y*x*t + z*s, b02 = z*x*t - y*s;
  var b10 = x*y*t - z*s, b11 = y*y*t + c, b12 = z*y*t + x*s;
  var b20 = x*z*t + y*s, b21 = y*z*t - x*s, b22 = z*z*t + c;
  
  if(!dest) { 
    dest = mat 
  } else if(mat != dest) { // If the source and destination differ, copy the unchanged last row
    dest[12] = mat[12];
    dest[13] = mat[13];
    dest[14] = mat[14];
    dest[15] = mat[15];
  }
  
  // Perform rotation-specific matrix multiplication
  dest[0] = a00*b00 + a10*b01 + a20*b02;
  dest[1] = a01*b00 + a11*b01 + a21*b02;
  dest[2] = a02*b00 + a12*b01 + a22*b02;
  dest[3] = a03*b00 + a13*b01 + a23*b02;
  
  dest[4] = a00*b10 + a10*b11 + a20*b12;
  dest[5] = a01*b10 + a11*b11 + a21*b12;
  dest[6] = a02*b10 + a12*b11 + a22*b12;
  dest[7] = a03*b10 + a13*b11 + a23*b12;
  
  dest[8] = a00*b20 + a10*b21 + a20*b22;
  dest[9] = a01*b20 + a11*b21 + a21*b22;
  dest[10] = a02*b20 + a12*b21 + a22*b22;
  dest[11] = a03*b20 + a13*b21 + a23*b22;
  return dest;
};

/*
 * mat4.rotateX
 * Rotates a matrix by the given angle around the X axis
 *
 * Params:
 * mat - mat4 to rotate
 * angle - angle (in radians) to rotate
 * dest - Optional, mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
mat4.rotateX = function(mat, angle, dest) {
  var s = Math.sin(angle);
  var c = Math.cos(angle);
  
  // Cache the matrix values (makes for huge speed increases!)
  var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
  var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];

  if(!dest) { 
    dest = mat 
  } else if(mat != dest) { // If the source and destination differ, copy the unchanged rows
    dest[0] = mat[0];
    dest[1] = mat[1];
    dest[2] = mat[2];
    dest[3] = mat[3];
    
    dest[12] = mat[12];
    dest[13] = mat[13];
    dest[14] = mat[14];
    dest[15] = mat[15];
  }
  
  // Perform axis-specific matrix multiplication
  dest[4] = a10*c + a20*s;
  dest[5] = a11*c + a21*s;
  dest[6] = a12*c + a22*s;
  dest[7] = a13*c + a23*s;
  
  dest[8] = a10*-s + a20*c;
  dest[9] = a11*-s + a21*c;
  dest[10] = a12*-s + a22*c;
  dest[11] = a13*-s + a23*c;
  return dest;
};

/*
 * mat4.rotateY
 * Rotates a matrix by the given angle around the Y axis
 *
 * Params:
 * mat - mat4 to rotate
 * angle - angle (in radians) to rotate
 * dest - Optional, mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
mat4.rotateY = function(mat, angle, dest) {
  var s = Math.sin(angle);
  var c = Math.cos(angle);
  
  // Cache the matrix values (makes for huge speed increases!)
  var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
  var a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
  
  if(!dest) { 
    dest = mat 
  } else if(mat != dest) { // If the source and destination differ, copy the unchanged rows
    dest[4] = mat[4];
    dest[5] = mat[5];
    dest[6] = mat[6];
    dest[7] = mat[7];
    
    dest[12] = mat[12];
    dest[13] = mat[13];
    dest[14] = mat[14];
    dest[15] = mat[15];
  }
  
  // Perform axis-specific matrix multiplication
  dest[0] = a00*c + a20*-s;
  dest[1] = a01*c + a21*-s;
  dest[2] = a02*c + a22*-s;
  dest[3] = a03*c + a23*-s;
  
  dest[8] = a00*s + a20*c;
  dest[9] = a01*s + a21*c;
  dest[10] = a02*s + a22*c;
  dest[11] = a03*s + a23*c;
  return dest;
};

/*
 * mat4.rotateZ
 * Rotates a matrix by the given angle around the Z axis
 *
 * Params:
 * mat - mat4 to rotate
 * angle - angle (in radians) to rotate
 * dest - Optional, mat4 receiving operation result. If not specified result is written to mat
 *
 * Returns:
 * dest if specified, mat otherwise
 */
mat4.rotateZ = function(mat, angle, dest) {
  var s = Math.sin(angle);
  var c = Math.cos(angle);
  
  // Cache the matrix values (makes for huge speed increases!)
  var a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
  var a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
  
  if(!dest) { 
    dest = mat 
  } else if(mat != dest) { // If the source and destination differ, copy the unchanged last row
    dest[8] = mat[8];
    dest[9] = mat[9];
    dest[10] = mat[10];
    dest[11] = mat[11];
    
    dest[12] = mat[12];
    dest[13] = mat[13];
    dest[14] = mat[14];
    dest[15] = mat[15];
  }
  
  // Perform axis-specific matrix multiplication
  dest[0] = a00*c + a10*s;
  dest[1] = a01*c + a11*s;
  dest[2] = a02*c + a12*s;
  dest[3] = a03*c + a13*s;
  
  dest[4] = a00*-s + a10*c;
  dest[5] = a01*-s + a11*c;
  dest[6] = a02*-s + a12*c;
  dest[7] = a03*-s + a13*c;
  
  return dest;
};

/*
 * mat4.frustum
 * Generates a frustum matrix with the given bounds
 *
 * Params:
 * left, right - scalar, left and right bounds of the frustum
 * bottom, top - scalar, bottom and top bounds of the frustum
 * near, far - scalar, near and far bounds of the frustum
 * dest - Optional, mat4 frustum matrix will be written into
 *
 * Returns:
 * dest if specified, a new mat4 otherwise
 */
mat4.frustum = function(left, right, bottom, top, near, far, dest) {
  if(!dest) { dest = mat4.create(); }
  var rl = (right - left);
  var tb = (top - bottom);
  var fn = (far - near);
  dest[0] = (near*2) / rl;
  dest[1] = 0;
  dest[2] = 0;
  dest[3] = 0;
  dest[4] = 0;
  dest[5] = (near*2) / tb;
  dest[6] = 0;
  dest[7] = 0;
  dest[8] = (right + left) / rl;
  dest[9] = (top + bottom) / tb;
  dest[10] = -(far + near) / fn;
  dest[11] = -1;
  dest[12] = 0;
  dest[13] = 0;
  dest[14] = -(far*near*2) / fn;
  dest[15] = 0;
  return dest;
};

/*
 * mat4.perspective
 * Generates a perspective projection matrix with the given bounds
 *
 * Params:
 * fovy - scalar, vertical field of view
 * aspect - scalar, aspect ratio. typically viewport width/height
 * near, far - scalar, near and far bounds of the frustum
 * dest - Optional, mat4 frustum matrix will be written into
 *
 * Returns:
 * dest if specified, a new mat4 otherwise
 */
mat4.perspective = function(fovy, aspect, near, far, dest) {
  var top = near*Math.tan(fovy*Math.PI / 360.0);
  var right = top*aspect;
  return mat4.frustum(-right, right, -top, top, near, far, dest);
};

/*
 * mat4.ortho
 * Generates a orthogonal projection matrix with the given bounds
 *
 * Params:
 * left, right - scalar, left and right bounds of the frustum
 * bottom, top - scalar, bottom and top bounds of the frustum
 * near, far - scalar, near and far bounds of the frustum
 * dest - Optional, mat4 frustum matrix will be written into
 *
 * Returns:
 * dest if specified, a new mat4 otherwise
 */
mat4.ortho = function(left, right, bottom, top, near, far, dest) {
  if(!dest) { dest = mat4.create(); }
  var rl = (right - left);
  var tb = (top - bottom);
  var fn = (far - near);
  dest[0] = 2 / rl;
  dest[1] = 0;
  dest[2] = 0;
  dest[3] = 0;
  dest[4] = 0;
  dest[5] = 2 / tb;
  dest[6] = 0;
  dest[7] = 0;
  dest[8] = 0;
  dest[9] = 0;
  dest[10] = -2 / fn;
  dest[11] = 0;
  dest[12] = (left + right) / rl;
  dest[13] = (top + bottom) / tb;
  dest[14] = (far + near) / fn;
  dest[15] = 1;
  return dest;
};

/*
 * mat4.ortho
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * Params:
 * eye - vec3, position of the viewer
 * center - vec3, point the viewer is looking at
 * up - vec3 pointing "up"
 * dest - Optional, mat4 frustum matrix will be written into
 *
 * Returns:
 * dest if specified, a new mat4 otherwise
 */
mat4.lookAt = function(eye, center, up, dest) {
  if(!dest) { dest = mat4.create(); }
  
  var eyex = eye[0],
    eyey = eye[1],
    eyez = eye[2],
    upx = up[0],
    upy = up[1],
    upz = up[2],
    centerx = center[0],
    centery = center[1],
    centerz = center[2];

  if (eyex == centerx && eyey == centery && eyez == centerz) {
    return mat4.identity(dest);
  }
  
  var z0,z1,z2,x0,x1,x2,y0,y1,y2,len;
  
  //vec3.direction(eye, center, z);
  z0 = eyex - center[0];
  z1 = eyey - center[1];
  z2 = eyez - center[2];
  
  // normalize (no check needed for 0 because of early return)
  len = 1/Math.sqrt(z0*z0 + z1*z1 + z2*z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  
  //vec3.normalize(vec3.cross(up, z, x));
  x0 = upy*z2 - upz*z1;
  x1 = upz*z0 - upx*z2;
  x2 = upx*z1 - upy*z0;
  len = Math.sqrt(x0*x0 + x1*x1 + x2*x2);
  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1/len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  };
  
  //vec3.normalize(vec3.cross(z, x, y));
  y0 = z1*x2 - z2*x1;
  y1 = z2*x0 - z0*x2;
  y2 = z0*x1 - z1*x0;
  
  len = Math.sqrt(y0*y0 + y1*y1 + y2*y2);
  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1/len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }
  
  dest[0] = x0;
  dest[1] = y0;
  dest[2] = z0;
  dest[3] = 0;
  dest[4] = x1;
  dest[5] = y1;
  dest[6] = z1;
  dest[7] = 0;
  dest[8] = x2;
  dest[9] = y2;
  dest[10] = z2;
  dest[11] = 0;
  dest[12] = -(x0*eyex + x1*eyey + x2*eyez);
  dest[13] = -(y0*eyex + y1*eyey + y2*eyez);
  dest[14] = -(z0*eyex + z1*eyey + z2*eyez);
  dest[15] = 1;
  
  return dest;
};

/*
 * mat4.str
 * Returns a string representation of a mat4
 *
 * Params:
 * mat - mat4 to represent as a string
 *
 * Returns:
 * string representation of mat
 */
mat4.str = function(mat) {
  return '[' + mat[0] + ', ' + mat[1] + ', ' + mat[2] + ', ' + mat[3] + 
    ', '+ mat[4] + ', ' + mat[5] + ', ' + mat[6] + ', ' + mat[7] + 
    ', '+ mat[8] + ', ' + mat[9] + ', ' + mat[10] + ', ' + mat[11] + 
    ', '+ mat[12] + ', ' + mat[13] + ', ' + mat[14] + ', ' + mat[15] + ']';
};

/*
 * quat4 - Quaternions 
 */
var quat4 = {};

/*
 * quat4.create
 * Creates a new instance of a quat4 using the default array type
 * Any javascript array containing at least 4 numeric elements can serve as a quat4
 *
 * Params:
 * quat - Optional, quat4 containing values to initialize with
 *
 * Returns:
 * New quat4
 */
quat4.create = function(quat) {
  var dest = new glMatrixArrayType(4);
  
  if(quat) {
    dest[0] = quat[0];
    dest[1] = quat[1];
    dest[2] = quat[2];
    dest[3] = quat[3];
  }
  
  return dest;
};

/*
 * quat4.set
 * Copies the values of one quat4 to another
 *
 * Params:
 * quat - quat4 containing values to copy
 * dest - quat4 receiving copied values
 *
 * Returns:
 * dest
 */
quat4.set = function(quat, dest) {
  dest[0] = quat[0];
  dest[1] = quat[1];
  dest[2] = quat[2];
  dest[3] = quat[3];
  
  return dest;
};

/*
 * quat4.calculateW
 * Calculates the W component of a quat4 from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length. 
 * Any existing W component will be ignored. 
 *
 * Params:
 * quat - quat4 to calculate W component of
 * dest - Optional, quat4 receiving calculated values. If not specified result is written to quat
 *
 * Returns:
 * dest if specified, quat otherwise
 */
quat4.calculateW = function(quat, dest) {
  var x = quat[0], y = quat[1], z = quat[2];

  if(!dest || quat == dest) {
    quat[3] = -Math.sqrt(Math.abs(1.0 - x*x - y*y - z*z));
    return quat;
  }
  dest[0] = x;
  dest[1] = y;
  dest[2] = z;
  dest[3] = -Math.sqrt(Math.abs(1.0 - x*x - y*y - z*z));
  return dest;
}

/*
 * quat4.inverse
 * Calculates the inverse of a quat4
 *
 * Params:
 * quat - quat4 to calculate inverse of
 * dest - Optional, quat4 receiving inverse values. If not specified result is written to quat
 *
 * Returns:
 * dest if specified, quat otherwise
 */
quat4.inverse = function(quat, dest) {
  if(!dest || quat == dest) {
    quat[0] *= 1;
    quat[1] *= 1;
    quat[2] *= 1;
    return quat;
  }
  dest[0] = -quat[0];
  dest[1] = -quat[1];
  dest[2] = -quat[2];
  dest[3] = quat[3];
  return dest;
}

/*
 * quat4.length
 * Calculates the length of a quat4
 *
 * Params:
 * quat - quat4 to calculate length of
 *
 * Returns:
 * Length of quat
 */
quat4.length = function(quat) {
  var x = quat[0], y = quat[1], z = quat[2], w = quat[3];
  return Math.sqrt(x*x + y*y + z*z + w*w);
}

/*
 * quat4.normalize
 * Generates a unit quaternion of the same direction as the provided quat4
 * If quaternion length is 0, returns [0, 0, 0, 0]
 *
 * Params:
 * quat - quat4 to normalize
 * dest - Optional, quat4 receiving operation result. If not specified result is written to quat
 *
 * Returns:
 * dest if specified, quat otherwise
 */
quat4.normalize = function(quat, dest) {
  if(!dest) { dest = quat; }
  
  var x = quat[0], y = quat[1], z = quat[2], w = quat[3];
  var len = Math.sqrt(x*x + y*y + z*z + w*w);
  if(len == 0) {
    dest[0] = 0;
    dest[1] = 0;
    dest[2] = 0;
    dest[3] = 0;
    return dest;
  }
  len = 1/len;
  dest[0] = x * len;
  dest[1] = y * len;
  dest[2] = z * len;
  dest[3] = w * len;
  
  return dest;
}

/*
 * quat4.multiply
 * Performs a quaternion multiplication
 *
 * Params:
 * quat - quat4, first operand
 * quat2 - quat4, second operand
 * dest - Optional, quat4 receiving operation result. If not specified result is written to quat
 *
 * Returns:
 * dest if specified, quat otherwise
 */
quat4.multiply = function(quat, quat2, dest) {
  if(!dest) { dest = quat; }
  
  var qax = quat[0], qay = quat[1], qaz = quat[2], qaw = quat[3];
  var qbx = quat2[0], qby = quat2[1], qbz = quat2[2], qbw = quat2[3];
  
  dest[0] = qax*qbw + qaw*qbx + qay*qbz - qaz*qby;
  dest[1] = qay*qbw + qaw*qby + qaz*qbx - qax*qbz;
  dest[2] = qaz*qbw + qaw*qbz + qax*qby - qay*qbx;
  dest[3] = qaw*qbw - qax*qbx - qay*qby - qaz*qbz;
  
  return dest;
}

/*
 * quat4.multiplyVec3
 * Transforms a vec3 with the given quaternion
 *
 * Params:
 * quat - quat4 to transform the vector with
 * vec - vec3 to transform
 * dest - Optional, vec3 receiving operation result. If not specified result is written to vec
 *
 * Returns:
 * dest if specified, vec otherwise
 */
quat4.multiplyVec3 = function(quat, vec, dest) {
  if(!dest) { dest = vec; }
  
  var x = vec[0], y = vec[1], z = vec[2];
  var qx = quat[0], qy = quat[1], qz = quat[2], qw = quat[3];

  // calculate quat * vec
  var ix = qw*x + qy*z - qz*y;
  var iy = qw*y + qz*x - qx*z;
  var iz = qw*z + qx*y - qy*x;
  var iw = -qx*x - qy*y - qz*z;
  
  // calculate result * inverse quat
  dest[0] = ix*qw + iw*-qx + iy*-qz - iz*-qy;
  dest[1] = iy*qw + iw*-qy + iz*-qx - ix*-qz;
  dest[2] = iz*qw + iw*-qz + ix*-qy - iy*-qx;
  
  return dest;
}

/*
 * quat4.toMat3
 * Calculates a 3x3 matrix from the given quat4
 *
 * Params:
 * quat - quat4 to create matrix from
 * dest - Optional, mat3 receiving operation result
 *
 * Returns:
 * dest if specified, a new mat3 otherwise
 */
quat4.toMat3 = function(quat, dest) {
  if(!dest) { dest = mat3.create(); }
  
  var x = quat[0], y = quat[1], z = quat[2], w = quat[3];

  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;

  var xx = x*x2;
  var xy = x*y2;
  var xz = x*z2;

  var yy = y*y2;
  var yz = y*z2;
  var zz = z*z2;

  var wx = w*x2;
  var wy = w*y2;
  var wz = w*z2;

  dest[0] = 1 - (yy + zz);
  dest[1] = xy - wz;
  dest[2] = xz + wy;

  dest[3] = xy + wz;
  dest[4] = 1 - (xx + zz);
  dest[5] = yz - wx;

  dest[6] = xz - wy;
  dest[7] = yz + wx;
  dest[8] = 1 - (xx + yy);
  
  return dest;
}

/*
 * quat4.toMat4
 * Calculates a 4x4 matrix from the given quat4
 *
 * Params:
 * quat - quat4 to create matrix from
 * dest - Optional, mat4 receiving operation result
 *
 * Returns:
 * dest if specified, a new mat4 otherwise
 */
quat4.toMat4 = function(quat, dest) {
  if(!dest) { dest = mat4.create(); }
  
  var x = quat[0], y = quat[1], z = quat[2], w = quat[3];

  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;

  var xx = x*x2;
  var xy = x*y2;
  var xz = x*z2;

  var yy = y*y2;
  var yz = y*z2;
  var zz = z*z2;

  var wx = w*x2;
  var wy = w*y2;
  var wz = w*z2;

  dest[0] = 1 - (yy + zz);
  dest[1] = xy - wz;
  dest[2] = xz + wy;
  dest[3] = 0;

  dest[4] = xy + wz;
  dest[5] = 1 - (xx + zz);
  dest[6] = yz - wx;
  dest[7] = 0;

  dest[8] = xz - wy;
  dest[9] = yz + wx;
  dest[10] = 1 - (xx + yy);
  dest[11] = 0;

  dest[12] = 0;
  dest[13] = 0;
  dest[14] = 0;
  dest[15] = 1;
  
  return dest;
}

/*
 * quat4.str
 * Returns a string representation of a quaternion
 *
 * Params:
 * quat - quat4 to represent as a string
 *
 * Returns:
 * string representation of quat
 */
quat4.str = function(quat) {
  return '[' + quat[0] + ', ' + quat[1] + ', ' + quat[2] + ', ' + quat[3] + ']'; 
};
var exports;
if (exports !== undefined){
exports.glMatrixArrayType = glMatrixArrayType 
exports.mat4 = mat4;
exports.quat4 = quat4;
exports.mat3 = mat3
exports.vec3 = vec3
  };; 

vec3.createFixedPool = function(length){
  var pool = [];
  
  while(length--){
    pool.push(vec3.create());
  }
  return pool;
}; 


mat4.decompose= function(mat,result){
  
  result = result || {};
  
  var t = result.translation = result.translation || vec3.create([0,0,0]);
  var s = result.scale = result.scale || vec3.create([1,1,1]);
  var r = result.rotation = result.rotation || quat4.create([0,0,0,1]);
  
  t[0] = mat[12];
  t[1] = mat[13];
  t[2] = mat[14];
  
  s[0] = Math.sqrt(mat[0] * mat[0] + mat[1] * mat[1] + mat[2] * mat[2]);
  s[1] = Math.sqrt(mat[4] * mat[4] + mat[5] * mat[5] + mat[6] * mat[6]);
  s[2] = Math.sqrt(mat[8] * mat[8] + mat[9] * mat[9] + mat[10] * mat[10]);
  
};

mat4.compose = function(translation, rotation,scale,matrix){

      var x = rotation[0], y = rotation[1], z = rotation[2], w = rotation[3];
      var scalex = scale[0],scaley = scale[1],scalez = scale[2];

      var x2 = x + x;
      var y2 = y + y;
      var z2 = z + z;
    
      var xx = x*x2;
      var xy = x*y2;
      var xz = x*z2;
    
      var yy = y*y2;
      var yz = y*z2;
      var zz = z*z2;
    
      var wx = w*x2;
      var wy = w*y2;
      var wz = w*z2;
      
      matrix[0] =  (1 - (yy + zz))*scalex;
      matrix[1] =  (xy - wz)*scaley;
      matrix[2] =  (xz + wy)*scalez;
      matrix[3] =  0;
      matrix[4] =  (xy + wz)*scalex;
      matrix[5] =  (1 - (xx + zz))*scaley;
      matrix[6] =  (yz - wx)*scalez;
      matrix[7] =  0;
      matrix[8] =  (xz - wy)*scalex;
      matrix[9] =  (yz + wx)*scaley;
      matrix[10] = (1 - (xx + yy))*scalez;
      matrix[11] = 0;
      matrix[12] = translation[0];
      matrix[13] = translation[1];
      matrix[14] = translation[2];
      matrix[15] = 1;
}; 

(function(global){
  
  var boundingBox = function(args){
    
    if (args){
      this.minX  = args.minX  || Number.POSITIVE_INFINITY;
      this.plusX = args.plusX || Number.NEGATIVE_INFINITY;
    
      this.minY  = args.minY  || Number.POSITIVE_INFINITY;
      this.plusY = args.plusY || Number.NEGATIVE_INFINITY;
    
      this.minZ  = args.minZ  || Number.POSITIVE_INFINITY;
      this.plusZ = args.plusZ || Number.NEGATIVE_INFINITY;
    } else { 
      this.minX  = Number.POSITIVE_INFINITY;
      this.plusX = Number.NEGATIVE_INFINITY;
    
      this.minY  = Number.POSITIVE_INFINITY;
      this.plusY = Number.NEGATIVE_INFINITY;
    
      this.minZ  = Number.POSITIVE_INFINITY;
      this.plusZ = Number.NEGATIVE_INFINITY;
    }
  };
  
  boundingBox.prototype.getBoundingFromPoints = function(points){
    
    this.minX  = Number.POSITIVE_INFINITY;
    this.plusX = Number.NEGATIVE_INFINITY;
    
    this.minY  = Number.POSITIVE_INFINITY;
    this.plusY = Number.NEGATIVE_INFINITY;
    
    this.minZ  = Number.POSITIVE_INFINITY;
    this.plusZ = Number.NEGATIVE_INFINITY;
    
    var size = points.length;
    var x,y,z;
    
    for(var i = 0;i<size;i+=3){
      x = points[i];
      y = points[i + 1];
      z = points[i + 2];
      
      if (x < this.minX){
        this.minX = x;
      }
      
      if (x > this.plusX){
        this.plusX = x;
      }
      
      if (y < this.minY){
        this.minY = y;
      }
      
      if (y > this.plusY){
        this.plusY = y;
      }
      
      if (z < this.minZ){
        this.minZ = z;
      }
      
      if (z > this.plusZ){
        this.plusZ = z;
      }
    }
  };
  
  var vecs = vec3.createFixedPool(8);
    
  
  boundingBox.prototype.toAABB = function(mat,AABB){
    var a00 = mat[0], a01 = mat[1], a02 = mat[2];
    var a10 = mat[4], a11 = mat[5], a12 = mat[6];
    var a20 = mat[8], a21 = mat[9], a22 = mat[10];
    var a30 = mat[12], a31 = mat[13], a32 = mat[14];
    
    var minX = this.minX, minY = this.minY, minZ = this.minZ;
    var plusX = this.plusX, plusY = this.plusY, plusZ = this.plusZ;
    
    var a00minX  = a00 * minX,  a01minX  = a01 * minX,  a02minX  = a02 * minX;
    var a00plusX = a00 * plusX, a01plusX = a01 * plusX, a02plusX = a02 * plusX;
    
    var a10minY  = a10 * minY,  a11minY  = a11 * minY,  a12minY  = a12 * minY;
    var a10plusY = a10 * plusY, a11plusY = a11 * plusY, a12plusY = a12 * plusY;
    
    var a20minZ  = a20 * minZ,  a21minZ  = a21 * minZ,  a22minZ  = a22 * minZ;
    var a20plusZ = a20 * plusZ, a21plusZ = a21 * plusZ, a22plusZ = a22 * plusZ;
    
    var minX2,minY2,minZ2;
    var maxX2,maxY2,maxZ2;
    
    if (a00minX < a00plusX){
      minX2 = a00minX;
      maxX2 = a00plusX;
    } else {
      minX2 = a00plusX;
      maxX2 = a00minX;
    }
    
    if (a10minY < a10plusY){
      minY2 = a10minY;
      maxY2 = a10plusY;
    } else {
      minY2 = a10plusY;
      maxY2 = a10minY;
    }
    
    if (a20minZ < a20plusZ){
      minZ2 = a20minZ;
      maxY2 = a20plusZ;
    } else {
      minZ2 = a20plusZ;
      maxZ2 = a20minZ;
    }
    
    AABB.minX = minX2 + minY2 + minZ2 + a30;
    AABB.plusX = maxX2 + maxY2 + maxZ2 + a30;
    
    if (a01minX < a01plusX){
      minX2 = a01minX;
      maxX2 = a01plusX;
    } else {
      minX2 = a01plusX;
      maxX2 = a01minX;
    }
    
    if (a11minY < a11plusY){
      minY2 = a11minY;
      maxY2 = a11plusY;
    } else {
      minY2 = a11plusY;
      maxY2 = a11minY;
    }
    
    if (a21minZ < a21plusZ){
      minZ2 = a21minZ;
      maxY2 = a21plusZ;
    } else {
      minZ2 = a21plusZ;
      maxZ2 = a21minZ;
    }
    
    AABB.minY = minX2 + minY2 + minZ2 + a31;
    AABB.plusY = maxX2 + maxY2 + maxZ2 + a31;
    
    
    if (a02minX < a02plusX){
      minX2 = a02minX;
      maxX2 = a02plusX;
    } else {
      minX2 = a02plusX;
      maxX2 = a01minX;
    }
    
    if (a12minY < a12plusY){
      minY2 = a12minY;
      maxY2 = a12plusY;
    } else {
      minY2 = a12plusY;
      maxY2 = a12minY;
    }
    
    if (a22minZ < a22plusZ){
      minZ2 = a22minZ;
      maxY2 = a22plusZ;
    } else {
      minZ2 = a22plusZ;
      maxZ2 = a22minZ;
    }
    
    AABB.minZ = minX2 + minY2 + minZ2 + a32;
    AABB.plusZ = maxX2 + maxY2 + maxZ2 + a32;
    
    
    /*vecs[0][0] = a00minX  + a10minY  + a20minZ  + a30;
    vecs[1][0] = a00minX  + a10minY  + a20plusZ + a30;
    vecs[2][0] = a00minX  + a10plusY + a20minZ  + a30;
    vecs[3][0] = a00minX  + a10plusY + a20plusZ + a30;
    vecs[4][0] = a00plusX + a10minY  + a20minZ  + a30;
    vecs[5][0] = a00plusX + a10minY  + a20plusZ + a30;
    vecs[6][0] = a00plusX + a10plusY + a20minZ  + a30;
    vecs[7][0] = a00plusX + a10plusY + a20plusZ + a30;
    
    vecs[0][1] = a01minX  + a11minY  + a21minZ  + a31;
    vecs[1][1] = a01minX  + a11minY  + a21plusZ + a31;
    vecs[2][1] = a01minX  + a11plusY + a21minZ  + a31;
    vecs[3][1] = a01minX  + a11plusY + a21plusZ + a31;
    vecs[4][1] = a01plusX + a11minY  + a21minZ  + a31;
    vecs[5][1] = a01plusX + a11minY  + a21plusZ + a31;
    vecs[6][1] = a01plusX + a11plusY + a21minZ  + a31;
    vecs[7][1] = a01plusX + a11plusY + a21plusZ + a31;
    
    vecs[0][2] = a02minX  + a12minY  + a22minZ  + a32;
    vecs[1][2] = a02minX  + a12minY  + a22plusZ + a32;
    vecs[2][2] = a02minX  + a12plusY + a22minZ  + a32;
    vecs[3][2] = a02minX  + a12plusY + a22plusZ + a32;
    vecs[4][2] = a02plusX + a12minY  + a22minZ  + a32;
    vecs[5][2] = a02plusX + a12minY  + a22plusZ + a32;
    vecs[6][2] = a02plusX + a12plusY + a22minZ  + a32;
    vecs[7][2] = a02plusX + a12plusY + a22plusZ + a32;
    
    var b = AABB,x,y,z;
    b.minX  = vecs[0][0];
    b.plusX = vecs[0][0];
      
    b.minY  = vecs[0][1];
    b.plusY = vecs[0][1];
    
    b.minZ  = vecs[0][2];
    b.plusZ = vecs[0][2];
    
    for (var i= 1,l= vecs.length;i<l;i++){
      var vec =  vecs[i];
      x = vec[0];
      y = vec[1];
      z = vec[2];
      
      if (x < b.minX){
        b.minX = x;
      } else if (x > b.plusX){
        b.plusX = x;
      }
      
      if (y < b.minY){
        b.minY = y;
      } else if (y > b.plusY){
        b.plusY = y;
      }
      
      if (z < b.minZ){
        b.minZ = z;
      } else if (z > b.plusZ){
        b.plusZ = z;
      }
    }*/
  };
  
  EWGL.boundingBox = boundingBox;
  
}(EWGL));; 

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
    
})(EWGL);; 

(function(global){
  
  var plane = global.plane;

  var frustrum = function(args){
    this.near = new plane();
    this.far = new plane();
   
    this.left = new plane();
    this.right = new plane();
    
    this.bottom = new plane();
    this.top = new plane();
   
    this.planes = [this.near,this.far,this.left,this.right,this.bottom,this.top];
  };
  
  
  frustrum.prototype.extractPlanes = function(perpectivematrix,modelviewmatrix) {
    var matrix = mat4.create();
    
    var m = function(row,col){
      return matrix[col*4+row-5];  
    };

    mat4.multiply(perpectivematrix,modelviewmatrix,matrix);

    this.near.setCoefficients(
				 m(3,1) + m(4,1),
				 m(3,2) + m(4,2),
				 m(3,3) + m(4,3),
				 m(3,4) + m(4,4));
	this.far.setCoefficients(
				-m(3,1) + m(4,1),
				-m(3,2) + m(4,2),
				-m(3,3) + m(4,3),
				-m(3,4) + m(4,4));
	this.bottom.setCoefficients(
				 m(2,1) + m(4,1),
				 m(2,2) + m(4,2),
				 m(2,3) + m(4,3),
				 m(2,4) + m(4,4));
	this.top.setCoefficients(
				-m(2,1) + m(4,1),
				-m(2,2) + m(4,2),
				-m(2,3) + m(4,3),
				-m(2,4) + m(4,4));
	this.left.setCoefficients(
				 m(1,1) + m(4,1),
				 m(1,2) + m(4,2),
				 m(1,3) + m(4,3),
				 m(1,4) + m(4,4));
	this.right.setCoefficients(
				-m(1,1) + m(4,1),
				-m(1,2) + m(4,2),
				-m(1,3) + m(4,3),
				-m(1,4) + m(4,4));

  };
  
  frustrum.prototype.isInFrustrum = function(AABB){
    
    for(var i=0; i < 6; i++) {
      var vecTest = vec3.create([AABB.minX,AABB.minY,AABB.minZ]);
      var plane = this.planes[i];
      
      if (plane.normal[0] > 0){
        vecTest[0] = AABB.plusX;
      }
      
      if (plane.normal[1] > 0){
        vecTest[1] = AABB.plusY;
      }
      
      if (plane.normal[2] > 0){
        vecTest[2] = AABB.plusZ;
      }
      
      if ((plane.distance + plane.normal[0]*vecTest[0] +plane.normal[1]*vecTest[1] +plane.normal[2]*vecTest[2]) < 0){
        console.log(i);
        return false;
      }  
    }
    return true;
  };
  
  frustrum.create = function(args){
    return new frustrum(args);
  };
  
  global.frustrum = frustrum;

})(EWGL);; 

(function(global){
  var undef,counter = 0;
  
  var inputmanager = {
    "mappings" : {},
    "updateCallbacks" : []
  };
  
  inputmanager.addMapping = function(name,func){
    inputmanager.mappings[name] = inputmanager.mappings[name] || [];
    inputmanager.mappings[name].push(func);
  };   
  
  inputmanager.mappingExists = function(name){
    return !!inputmanager.mappings[name];
  };
  
  inputmanager.update = function(info){
    var i, l = inputmanager.updateCallbacks.length;
    for (i= 0;i<l;i++){
      inputmanager.updateCallbacks[i](info);
    };
  };  
  
  inputmanager.createAddHandler = function(buffer){
    return function(args){
      var func,name,i,l,keyname;
      
      if (!args.func && !args.name){
        throw "there should always be a function mapped to the key:{" + keyname + " : " + name + "};";
      };
      func = args.func;
      name = args.name || (Handler + (counter++));
      keyname = args.keyName || 0;
      
      if (func){
        inputmanager.addMapping(name,func);
      }
      
      buffer[keyname] = buffer[keyname] || [];  
      buffer[keyname].push({"name": name});
    };
  };
  
  inputmanager.activateAction = function(name,args){
    var i,l,mapped;
    if (inputmanager.mappings[name]){
      mapped = inputmanager.mappings[name];
      l = mapped.length;
      for (i=0;i<l;i++){
        mapped[i](args);
      };
    }; 
  };
    
  
  
  global.inputManager = inputmanager;
  
}(EWGL));
; 

(function(global){
  
  var inputManager = EWGL.inputManager;
  
  var keyhandlers = {};
  var keydownhandlers = {};
  var keyuphandlers = {};
  var keypressed = {};
  
  var keys = {};
  keys.BACKSPACE=8;
  keys.TAB=9;
  keys.ENTER=13;
  keys.SHIFT=16;
  keys.CTRL=17;
  keys.ALT=18;
  keys.PAUSE_BREAK=19;
  keys.CAPS_LOCK=20;
  keys.ESCAPE=27;
  keys.PAGE_UP=33;
  keys.PAGE_DOWN=34;
  keys.END=35;
  keys.HOME=36;
  keys.LEFT_ARROW=37;
  keys.UP_ARROW=38;
  keys.RIGHT_ARROW=39;
  keys.DOWN_ARROW=40;
  keys.INSERT=45;
  keys.DELETE=46;
  keys[0]=48;
  keys[1]=49;
  keys[2]=50;
  keys[3]=51;
  keys[4]=52;
  keys[5]=53;
  keys[6]=54;
  keys[7]=55;
  keys[8]=56;
  keys[9]=57;
  keys.A=65;
  keys.B=66;
  keys.C=67;
  keys.D=68;
  keys.E=69;
  keys.F=70;
  keys.G=71;
  keys.H=72;
  keys.I=73;
  keys.J=74;
  keys.K=75;
  keys.L=76;
  keys.M=77;
  keys.N=78;
  keys.O=79;
  keys.P=80;
  keys.Q=81;
  keys.R=82;
  keys.S=83;
  keys.T=84;
  keys.U=85;
  keys.V=86;
  keys.W=87;
  keys.X=88;
  keys.Y=89;
  keys.Z=90;
  keys.LEFT_WINDOW_KEY=91;
  keys.RIGHT_WINDOW_KEY=92;
  keys.SELECT_KEY=93;
  keys.NUMPAD_0=96;
  keys.NUMPAD_1=97;
  keys.NUMPAD_2=98;
  keys.NUMPAD_3=99;
  keys.NUMPAD_4=100;
  keys.NUMPAD_5=101;
  keys.NUMPAD_6=102;
  keys.NUMPAD_7=103;
  keys.NUMPAD_8=104;
  keys.NUMPAD_9=105;
  keys.MULTIPLY=106;
  keys.ADD=107;
  keys.SUBTRACT=109;
  keys.DECIMAL_POINT=110;
  keys.DIVIDE=111;
  keys.F1=112;
  keys.F2=113;
  keys.F3=114;
  keys.F4=115;
  keys.F5=116;
  keys.F6=117;
  keys.F7=118;
  keys.F8=119;
  keys.F9=120;
  keys.F10=121;
  keys.F11=122;
  keys.F12=123;
  keys.NUM_LOCK=144;
  keys.SCROLL_LOCK=145;
  keys.SEMI_COLON=186;
  keys.EQUAL_SIGN=187;
  keys.COMMA=188;
  keys.DASH=189;
  keys.PERIOD=190;
  keys.FORWARD_SLASH=191;
  keys.GRAVE_ACCENT=192;
  keys.OPEN_BRACKET=219;
  keys.BACK_SLASH=220;
  keys.CLOSE_BRAKET=221;
  keys.SINGLE_QUOTE=222;
  keys.SPACE=32;
  
  var keyDownUpdater = function(e){
    
    var key = e.which,keyhandlerslist = keydownhandlers[key],l, handler,i;
    
    if (keyhandlerslist && !keypressed[key]){
      l = keyhandlerslist.length;
      for (i = 0; i<l; i++){
        inputmanager.activateAction(keyhandlerslist[i].name,e);
      };
    };
    keypressed[key] = true;
    
  };
  
  
  var keyUpUpdater =function(e){
    var key = e.which, keyhandlerslist = keyuphandlers[key],l, handler,i;
    
    if (keyhandlerslist){
      l = keyhandlerslist.length;
      for (i = 0; i<l; i++){
        inputManager.activateAction(keyhandlerslist[i].name,e);
      }; 
    };
    if (keypressed[key]){
      delete keypressed[key];
    };
  };
  
  var keyUpdater = function(args){
    var key,l,handler,i,keyhandlerslist;
    
    for (key in keypressed){
      keyhandlerslist = keyhandlers[key];
      if (keyhandlerslist && key){
        l = keyhandlerslist.length;
        for (i = 0; i<l; i++){
          inputManager.activateAction(keyhandlerslist[i].name,args);
        }; 
      };
    };
  };
  
  document.addEventListener("keydown",keyDownUpdater,true);
  document.addEventListener("keyup",keyUpUpdater,true);
  inputManager.updateCallbacks.push(keyUpdater);
  
  
  inputManager.addKeyHandler = inputManager.createAddHandler(keyhandlers);
  inputManager.addKeyUpHandler = inputManager.createAddHandler(keyuphandlers);
  inputManager.addKeyDownHandler = inputManager.createAddHandler(keydownhandlers);
  
  inputManager.keyboard = {};
  inputManager.keyboard.keys = keys;
  inputManager.keyboard.keyspressed = keypressed;
  
}(EWGL)); 

(function(global){
  
  var inputManager = global.inputManager;
  
  var mouseButtons = {};
  mouseButtons.NONE =0;
  mouseButtons.LEFT = 1;
  mouseButtons.MIDDLE = 2;
  mouseButtons.RIGHT = 3;
   
  var mouseDragHandlers = {},
      mouseUpHandlers = {},
      mouseDownHandlers = {},
      mouseWheelHandlers = {},
      mousePressed = {},
      buttonsPressed = 0,
      startPosition = {},
      prevPosition = [],
      position = [];
      
  mousePressed[mouseButtons.NONE] = true;
  mousePressed[mouseButtons.LEFT] = false;
  mousePressed[mouseButtons.MIDDLE] = false;
  mousePressed[mouseButtons.RIGHT] = false;
  
  var mouseUpdater = function(args){
    var mouseButton,l,handler,i,mousehandlerslist;
    args.mouse = {};
    for (mouseButton in mousePressed){
      if (mousePressed[mouseButton] === true){
        mousehandlerslist = mouseDragHandlers[mouseButton];
        
        args.mouse.startPosition = startPosition[mouseButton];
        args.mouse.prevPosition = prevPosition;
        args.mouse.position = position;
        
        if (mousehandlerslist && mouseButton){
          l = mousehandlerslist.length;
          for (i = 0; i<l; i++){
            inputManager.activateAction(mousehandlerslist[i].name,args);
          }
        }
      }
    }
    prevPosition = position;
  };
  
  var mouseDownUpdater = function(e){
    var mouseButton = e.which,mousehandlerslist = mouseDownHandlers[mouseButton],l, handler,i;
    
    if (mousehandlerslist && !mousePressed[mouseButton]){
      l = mousehandlerslist.length;
      for (i = 0; i<l; i++){
        inputManager.activateAction(mousehandlerslist[i].name,e);
      }
    }
    mousePressed[mouseButtons.NONE] = false;
    mousePressed[mouseButton] = true;
    startPosition[mouseButton] = [e.screenX,e.screenY];
    prevPosition = [e.screenX,e.screenY];
  };
  
  var mouseUpUpdater = function(e){
    var mouseButton = e.which,mousehandlerslist = mouseUpHandlers[mouseButton],l, handler,i;
    
    if (mousehandlerslist){
      l = mousehandlerslist.length;
      for (i = 0; i<l; i++){
        inputManager.activateAction(mousehandlerslist[i].name,e);
      }
    }
    
    mousePressed[mouseButton] = false;
    if (!mousePressed[mouseButtons.LEFT] && !mousePressed[mouseButtons.MIDDLE] && !mousePressed[mouseButtons.RIGHT]){
      mousePressed[mouseButtons.NONE] = true;
    }
  };
  
  function wheel(event){
    var delta = 0;
    if (!event) {
       event = window.event;
    }
    if (event.wheelDelta) { 
      delta = event.wheelDelta/120;
      if (window.opera) {
              delta = -delta;
      }
    } else if (event.detail) {
      delta = -event.detail/3;
    }
    
    var mousehandlerslist = mouseWheelHandlers[0],l, handler,i;

    if (mousehandlerslist){
      l = mousehandlerslist.length;
      for (i = 0; i<l; i++){
          inputManager.activateAction(mousehandlerslist[i].name,delta);
      }
    }
    if (event.preventDefault) {
      event.preventDefault();
      event.returnValue = false;
    }
  }
  
  var mousemove = function(e){
    position = [e.screenX,e.screenY];  
  };
      
      
  document.addEventListener("mousedown",mouseDownUpdater,true);
  document.addEventListener("mouseup",mouseUpUpdater,true);
  document.addEventListener("mousemove",mousemove,true);
  window.addEventListener('DOMMouseScroll', wheel, true);

  window.onmousewheel = document.onmousewheel = wheel;
  
  inputManager.updateCallbacks.push(mouseUpdater);
  
  inputManager.addMouseDragHandler = inputManager.createAddHandler(mouseDragHandlers);
  inputManager.addMouseUpHandler = inputManager.createAddHandler(mouseUpHandlers);
  inputManager.addMouseWheelHandler = inputManager.createAddHandler(mouseWheelHandlers);
  inputManager.addMouseDownHandler = inputManager.createAddHandler(mouseDownHandlers);
  
  inputManager.mouse = {};
  inputManager.mouse.mouseButtons = mouseButtons;
  inputManager.mouse.mousePressed = mousePressed;
    
}(EWGL));  ; 

(function(global) {

  var _renderer, undef;
  var renderer = {};
  var prevwidth= 0, prevHeight = 0; 

  Object.defineProperties(renderer, {
    "_canvas": {
      "value": undef,
      "configurable": true,
      "writable": true
    },
    "canvas": {
      "get": function() {
        return renderer._canvas;
      },
      "set": function(value) {
        if (renderer._canvas !== value) {
          removeHandlers(renderer);
          removeglcontext(renderer);
          renderer._canvas = value;
          addglcontext(renderer);
          addHandlers(renderer);
          setOptions(renderer);
        }
      }
    },

    "_gl": {
      "value": undef,
      "configurable": true,
      "writable": true
    },
    "gl": {
      "get": function() {
        return renderer._gl;
      }
    },

    "backcolor": {
      "value": [0, 0, 0, 1]
    },

    "_camera": {
      "value": undef,
      "configurable": true,
      "writable": true
    },
    "camera": {
      "get": function() {
        return renderer._camera;
      },
      "set": function(value) {
        if (value !== renderer._camera) {
          renderer._camera = value;
          value.updateView(renderer.canvas);
        }
      }
    }
  });

  var removeHandlers = function(renderer) {
    
  };
  var removeglcontext = function(renderer) {

    };
  var addglcontext = function(renderer) {
      var context = renderer._canvas.getContext("experimental-webgl");
      renderer._gl = context;
      };
  var addHandlers = function(renderer) {

    };
  var setOptions = function(renderer) {
      if (renderer._camera) {
        renderer._camera.updateView(renderer.canvas);
      }
      if (renderer.backcolor) {
        renderer.gl.clearColor(renderer.backcolor[0], renderer.backcolor[1], renderer.backcolor[2], renderer.backcolor[3]);
      }
      renderer.gl.frontFace( renderer.gl.CCW );
	    renderer.gl.cullFace( renderer.gl.BACK );
	    renderer.gl.enable( renderer.gl.CULL_FACE );
      
      renderer.gl.enable(renderer.gl.DEPTH_TEST);
      renderer.gl.clear(renderer.gl.COLOR_BUFFER_BIT | renderer.gl.DEPTH_BUFFER_BIT);
      };

  renderer.clear = function() {
    renderer.gl.clear(renderer.gl.COLOR_BUFFER_BIT | renderer.gl.DEPTH_BUFFER_BIT);
  };

  renderer.createShaderProgram = function(vertexshader, fragmentshader) {
    var gl = renderer.gl;

    var start = +(new Date());
    var fragshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragshader, fragmentshader);
    gl.compileShader(fragshader);
    if (!gl.getShaderParameter(fragshader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(fragshader));
      return null;
    }
    console.log("fragshader alone:" + (+(new Date()) - start));
    start = +(new Date());
    var vertshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertshader, vertexshader);
    gl.compileShader(vertshader);
    if (!gl.getShaderParameter(vertshader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(vertshader));
      return null;
    };
    console.log("vertshader alone:" + (+(new Date()) - start));
    start = +(new Date());
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertshader);
    gl.attachShader(shaderProgram, fragshader);
    gl.linkProgram(shaderProgram);
    console.log("linkshader alone:" + (+(new Date()) - start));
    start = +(new Date());
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialise shaders");
    }
    gl.useProgram(shaderProgram);
    
    shaderProgram.info = {};
    shaderProgram.info.vertexshader = vertexshader;
    shaderProgram.info.fragmentshader = fragmentshader;
    
    return shaderProgram;
  };

  renderer.getAttribute = function(shaderProgram, name) {
    var gl = renderer.gl;
    var returnValue = gl.getAttribLocation(shaderProgram, name);
    gl.enableVertexAttribArray(returnValue);
    return returnValue;
  };

  renderer.getUniform = function(shaderProgram, name) {
    return renderer.gl.getUniformLocation(shaderProgram, name);
  };

  renderer.AdjustGLBuffer = function(vertexbuffer) {
    var gl = renderer.gl,
        glObject, data = vertexbuffer.getData();
    glObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, glObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

    vertexbuffer.glObject = glObject;
    vertexbuffer.flags.dataChanged = false;
  };

  renderer.AdjustGLELMENTBuffer = function(vertexbuffer) {
    var gl = renderer.gl,
        glObject, data = vertexbuffer.getData();
    glObject = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glObject);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);

    vertexbuffer.glObject = glObject;
    vertexbuffer.flags.dataChanged = false;

  };


  usedShaderProgram = undef;
  renderer.useProgram = function(shaderProgram) {
    if (usedShaderProgram !== shaderProgram) {
      renderer.gl.useProgram(shaderProgram);
      usedShaderProgram = shaderProgram;
    };
  };

  global.renderer = renderer;



}(EWGL));; 

(function(global){

  var undef;
  var counterId = 0;
  
  var mesh = function(){
    this.meshId = "mesh" + (counterId++);
    this.flags = {};
    this.vertexbuffers = {};
  };
  
  mesh.prototype.addNewVertexbuffer = function(args){
    if (!args){
      throw "Always create a vertexbuffer with at least some args";
    }
    args.mesh = this;
    var buffer = new vertexbuffer(args);
    this.vertexbuffers[args.type] = buffer;
    
  };  
  
  var vertexbuffer = function(args){
    var data;

    this.flags = {};
    this.type = args.type;
    this._mesh = args.mesh;
    this.glObject = undef;
    this.size = 0;
    this.listeners = [];
    
    
    this.setData = function(dataObject){
      var flagsToset = mesh.flagsToSet[this.type];
      
      data = dataObject;
      this.size = data.length;
      this.flags.dataChanged = true;

      if(flagsToset){
        for(var i = 0,l =flagsToset.length;i<l;i++){
          this._mesh.flags[flagsToset[i]] = true;
        }
      }
    };
    
    this.getData = function(){
      return data;
    };
    
    this.setData(args.data || []);
    
  };
  
    
  var vertexbufferType ={};
  vertexbufferType.position = "position";
  vertexbufferType.color    = "color";
  vertexbufferType.texture  = "texture";
  vertexbufferType.indices  = "indices";
  
  
  mesh.flagsToSet = {};
  global.mesh = mesh;
  global.vertexbufferType = vertexbufferType;
  
}(EWGL));; 

(function(global){
  var undef;
  var replacementImage = new Image();
  
  
  var texture = function(args){
    args = args || {};
    this.texture = undef;
    this.flags = {};
    this.image = args.img || undef;
  };
  
  global.texture = texture;
}(EWGL));; 

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
    var vsID = (vsmain.calculateID && vsmain.calculateID()) || 1;
    stackId += "V" + vsmain + "," + vsID;

    var fsID = (fsmain.calculateID && fsmain.calculateID()) || 1;
    stackId += "F" + fsmain + "," + fsID;
    
    
    var registerID = [];
    for(i = 0,l=shaderExts.length;i<l;i++){
      shaderExt = shaderExts[i];
      registerID[i] = (shaderExt.calculateID && shaderExt.calculateID()) || 1;
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
  
  
}(EWGL)); 

(function(global){
    
  var counter = 0;
  var shaderExtension = function(args){
    //Nessecary to id shader extension
    this.shaderExtensionCounter = counter++;
    
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
  // mustoverride
  shaderExtension.prototype.calculateID = function(){
    return -1;
  };
  
  //override
  shaderExtension.prototype.generateShaderPieces = function(id){};
  
  //override
  shaderExtension.prototype.getShaderInputs = function(program,id){};
  
  shaderExtension.prototype.setShaderPieces = function(shaderProgram,id){};
  
  shaderExtension.prototype.setFrameInputs = function(shaderProgram,id){};
  
  shaderExtension.prototype.setObjectInputs = function(shaderProgram,id){};
  
  
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
  
  
}(EWGL));; 

(function(global){
  var counterid = 0;
  var undef,p;
  var node = function(argus){
    
    var args = argus || {};

    this.name = args.name;
    this.id = "node" + (counterid++);
    
    this.flags = {};
    this.controllers = [];
    
    this._rotation = quat4.create();
    this._translation = vec3.create();
    this._scale = vec3.create();
    
    this.rotation = args.rotation || quat4.create([0,0,0,1]);
    this.translation = args.translation || vec3.create();
    this.scale = args.scale || vec3.create([1,1,1]);
    
    this._worldRotation = quat4.create([0,0,0,1]);
    this._worldTranslation = vec3.create([0,0,0]);
    this._worldScale = vec3.create([1,1,1]);
    this._matrix = mat4.create();
    
    this._boundingBox = new EWGL.boundingBox();
    
    
    this.parent = args.parent || undef;
    this.children = args.children || [];
    
    return this;
  };
  
  Object.defineProperties(node.prototype,{
    "_name": { 
      "value" : undef,
      "configurable" : true,   
      "writable": true
    },
    "name": {
      "get" : function(){
        return this._name;
      },
      "set" : function(name){
        if (name){
          if (name === this._name){
            return;
          } else if(!node.Nodes[name]){
            if (node.Nodes[this._name]){
              node.Nodes[this._name] = undef;
            }
            this._name = name;
            node.Nodes[name] = this;
          } else {
            throw "All Nodes need a different name : " + name +" is at least added twice.";
          }
        } else{
          if (node.Nodes[this._name]){
            node.Nodes[this._name] = undef;
          }
          this._name = undef;
        }
      }
    },
    
    "_id": { 
      "value" : undef,
      "configurable" : true,   
      "writable": true
    },
    "id": {
      "get" : function(){
        return this._id;
      },
      "set" : function(id){
        if (id){
          if (id === this._id){
            return;
          } else if(!node.NodesById[id]){
            if (node.NodesById[this._id]){
              node.NodesById[this._id] = undef;
            }
            this._id= id;
            node.NodesById[id] = this;
          } else {
            throw "All Nodes need a different id: " + id+" is at least added twice.";
          }
        } else {
          throw "All Nodes need at least One Id.";
        }        
      }
    },
    "_rotation": { 
      "value" : quat4.create([0,0,0,1]),
      "configurable" : true,   
      "writable": true
    },
    "rotation": {
      "get" : function(){
        return this._rotation;
      },
      "set" : function(rot){
          quat4.set(rot,this._rotation) ;
          this.setUpdateMatrixFlag();
          this.setUpdateBoundingBoxFlag();
      }
    },

    "_translation":{
      "value":vec3.create(),
      "configurable" : true,   
      "writable": true
    },
    "translation": {
      "get" : function(){
        return this._translation;
      },
      "set" : function(pos){
          vec3.set(pos,this._translation);
          this.setUpdateMatrixFlag();
          this.setUpdateBoundingBoxFlag();
      }
    },
    
    "_scale":{
      "value":vec3.create(),
      "configurable" : true,   
      "writable": true
    },
    "scale": {
      "get" : function(){
        return this._scale;
      },
      "set" : function(scale){
          if (!scale.length){
            scale = [scale,scale,scale];
          }
          vec3.set(scale,this._scale);
          this.setUpdateMatrixFlag();
          this.setUpdateBoundingBoxFlag();
      }
    },
    
    "flags":{
      "value":{},
      "configurable" : true,   
      "writable": true
    },
    
    "_children" : {
      "value" :[],
      "configurable" : true,   
      "writable": true
    },
    "children" : {
      "get" : function(){
        return this._children;
      },
      "set" : function(children){
        if (this._children !== children){ 
          removeAllChildren(this);
          addChildren(this,children);
        };
      }
    },
    
    "_parent" : {
      "value" : undef,
      "configurable" : true,   
      "writable": true
    },
    "parent" : {
      "get" : function(){
        return this._parent;
      },
      "set" : function(parent){
        if (parent !==this._parent){
          setParent(this,parent);
          this.setUpdateMatrixFlag();
        };
      }
    },
    
    "_matrix" : {
      "value" : undef,
      "configurable" : true,   
      "writable": true
    },
    "matrix" : {
      "get" : function(){
        if (this.flags.UpdateMatrix){
          calculateUpdateMatrix(this);
        };
        return this._matrix;
      }
    },
    
    "_worldScale" : {
      "value" : undef,
      "configurable" : true,   
      "writable": true
    },
    "worldScale" : {
      "get" : function(){
        if (this.flags.UpdateMatrix){
          calculateUpdateMatrix(this);
        };
        return this._worldScale;
      }
    },
    
    "_worldTranslation" : {
      "value" : undef,
      "configurable" : true,   
      "writable": true
    },
    "worldTranslation" : {
      "get" : function(){
        if (this.flags.UpdateMatrix){
          calculateUpdateMatrix(this);
        };
        return this._worldTranslation;
      }
    },
    
    "_worldRotation" : {
      "value" : undef,
      "configurable" : true,   
      "writable": true
    },
    "worldRotation" : {
      "get" : function(){
        if (this.flags.UpdateMatrix){
          calculateUpdateMatrix(this);
        };
        return this._worldRotation;
      }
    },
    
    "_boundingBox" : {
      "value" : undef,
      "configurable" : true,   
      "writable": true
    },
    "boundingBox" : {
      "get" : function(){
        if (this.flags.UpdateBoundingBox){
          calculateUpdateBoundingBox(this);
        };
        return this._boundingBox;
      }
    },
    
    
    "controllers" : {
      "value":[],
      "configurable" : true,   
      "writable": true
    },
    "lastUpdate" : {
      "value": -1,
      "configurable" : true,   
      "writable": true
    }
    
  });
  
  
  
  node.prototype.update = function(info){
    this.lastUpdate = info.counter;
    
    var i,l = this.controllers.length;

    for(i = 0;i<l;i++){
      this.controllers[i].update(info);
    }  
    l = this.children.length;
    for(i = 0;i<l;i++){
      this.children[i].update(info);
    }
  };
  
  node.prototype.render = function(info){
    var i,l = this.children.length;
    for(i = 0;i<l;i++){
      this.children[i].render(info);
    } 
  };
  
  node.prototype.setUpdateMatrixFlag = function(){
    setUpdateMatrixFlag(this);
  };
  
  node.prototype.setUpdateBoundingBoxFlag = function(){
    setUpdateBoundingBoxFlag(this);
  };
  
  node.prototype.removeAllChildren = function(){
    removeAllChildren(this);
  };
  
  node.prototype.addChildren = function(children){
    addChildren(this,children);
  };
  node.prototype.addController = function(controller){
    controller.node = this;
    this.controllers.push(controller);
  };
  
  node.prototype.addChild = function(children){
    addChildren(this,children);
  };
  
  node.prototype.removeParent = function(){
    removeParent(this);
  };
  node.prototype.setParent = function(parent){
    setParent(this,parent);
  };
  
  node.prototype._calculateUpdateMatrix = function(){
    calculateUpdateMatrix(this);
  };
  
  
  var setUpdateBoundingBoxFlag = function(node1){
    if (!node1.flags.UpdateBoundingBox){
      node1.flags.UpdateBoundingBox = true;
      if (node1.parent){
        node1.parent.setUpdateBoundingBoxFlag();
      }
    }
  };
  
  var setUpdateMatrixFlag = function(node1){
    var i,l,c;
    if (!node1.flags.UpdateMatrix){
      node1.flags.UpdateMatrix = true;
      c = node1.children;
      l = c.length;
      for(i = 0;i <l;i++){
        c[i].setUpdateMatrixFlag();
      }
    }
  };
  
  var removeAllChildren = function(node1){
    var c = node1._children,l,i;
    if (c != undef && c.length > 0){
      l = c.length;
      for(i = 0;i <l;i++){
        c[i]._parent = undef;
      }
    }
    node1._children = [];
  };
  
  var addChildren = function(node1,children){
    var c,l,i,children2;
    if (children){
      l = children.length;
      if (!l){
        children2 = [children];
        l = 1;
      } else {
        children2 = children;
      }
      for (i = 0;i<l;i++){
        children2[i].parent = node1;
      }
    }
  };
  
  var removeParent = function(node1){
    var i = node1.parent.children.indexOf(node1);
    if (i !== -1) {
      node1.parent.children.splice(i,1);
      node1.parent = undef;
    }
  };
  
  var setParent = function(node1,parent){
    if (node1.parent !==  undef){
      node1.removeParent();
    };
    node1._parent = parent;
    
    if (parent !== undef) {
      node1._parent._children.push(node1);
    };
  };

  
  var calculateUpdateBoundingBox = function(node1){
    var children = node1.children,
        l = children.length,i,
        b = node1._boundingBox,bc;
        
    if (node1.flags.UpdateBoundingBox){
      b.minX  = Number.POSITIVE_INFINITY; b.plusX = Number.NEGATIVE_INFINITY;
      b.minY  = Number.POSITIVE_INFINITY; b.plusY = Number.NEGATIVE_INFINITY;
      b.minZ  = Number.POSITIVE_INFINITY; b.plusZ = Number.NEGATIVE_INFINITY;
      
      for (i = 0; i<l; i++){
        bc = children[i].boundingBox;
        if (bc.minX  !== Number.POSITIVE_INFINITY || bc.plusX !== Number.NEGATIVE_INFINITY ||
            bc.minY  !== Number.POSITIVE_INFINITY || bc.plusY !== Number.NEGATIVE_INFINITY ||
            bc.minZ  !== Number.POSITIVE_INFINITY || bc.plusZ !== Number.NEGATIVE_INFINITY) {
            
            if (bc.minX < b.minX){
              b.minX = bc.minX;
            }
            
            if (bc.plusX > b.plusX){
              b.plusX = bc.plusX;
            }
            
            if (bc.minY < b.minY){
              b.minY = bc.minY;
            }
            
            if (bc.plusY > b.plusY){
              b.plusY = bc.plusY;
            }
            
            if (bc.minZ < b.minZ){
              b.minZ = bc.minZ;
            }
            
            if (bc.plusZ > b.plusZ){
              b.plusZ = bc.plusZ;
            }
              
        }
      }
    }
    
  };
  
  var destMatrix = mat4.create();
  var calculateUpdateMatrix = function(node1){
    
    var parent = node1.parent;
    
    var node1Scale = node1.scale;
    var node1Rotation =node1.rotation;
    var node1Translation = node1.translation;
    
    
    var matrix = node1._matrix;
    var node1WorldScale = node1._worldScale;
    var node1WorldRotation = node1._worldRotation;
    var node1WorldTranslation = node1._worldTranslation;
    
    if(node1.flags.UpdateMatrix){
      if (parent){
        
        var parentWorldScale = parent.worldScale;
        var parentWorldRotation = parent.worldRotation;
        var parentWorldTranslation = parent.worldTranslation;
        
        
        vec3.scaleVec3(node1Scale,parentWorldScale,node1WorldScale);
        quat4.multiply(parentWorldRotation,node1Rotation,node1WorldRotation);
        quat4.multiplyVec3(parentWorldRotation,node1Translation ,node1WorldTranslation);
        vec3.scaleVec3(node1WorldTranslation,parentWorldScale);
        vec3.add(node1WorldTranslation,parentWorldTranslation);
        
      } else {
        vec3.set(node1._scale,node1WorldScale);
        quat4.set(node1._rotation,node1WorldRotation);
        vec3.set(node1._translation,node1WorldTranslation);
      }
      
      mat4.compose(node1WorldTranslation,node1WorldRotation,node1WorldScale,matrix);
      
      node1.flags.UpdateMatrix = false;
      node1.flags.MatrixUpdated = true;
    }
  };
  
  nexboundingboxCounter = 0;
  node.prototype.showBounds = function(){
    if (EWGL.DEBUG){
      if (!this.flags.hasBoundingBoxOutline){
        for(var i = 0;i<this.children.length;i++){
          this.children[i].showBounds();
        };
        this.flags.hasBoundingBoxOutline = true;
        this.attachNewBoundingBoxOutline();
      }
    };
  };
  
  
  
  node.$ = function(name){
    return node.Nodes[name];
  };
    
  node.getById = function(ID){
    return node.NodesById[ID];
  };
  
  node.prototype.attachNewNode = function(args){
    args = args || {};
    args.parent = this;
    return new node(args);
  };
      
  node.Nodes = {};
  node.NodesById = {};
  
  
  global.node = node;
}(EWGL));
; 

(function(global){
  var node = EWGL.node;
  
  var p = node.prototype;
  
  p.translate = function(vec){
    vec3.add(this.translation ,vec);
    this.setTransformFlag();
  };
  
  p.rotate = function(quat){
    quat4.multiply(this.rotation,quat);
    this.setTransformFlag();
  };
  
  
  p.lookAt = function(pos, upDir){
    
    var direction,left;
    var up = upDir || vec3.create([0,1,0]);
    direction = vec3.direction(this.worldTranslation,pos,vec3.create());

    
    left = vec3.create(up);
    vec3.cross(left,direction);
    vec3.normalize(left);
    if (left[0]===0 && left[1]===0 && left[2]===0){
      if (direction[0] !== 0) {
        vec3.set([direction[1], -direction[0], 0],left);   
      } else {
        vec3.set([0, direction[2], -direction[1]],left);
      }
    }
    
    up = vec3.create(direction);
    vec3.cross(up,left);
    vec3.normalize(up);
    
    
    var m00 = left[0], m10 = up[0], m20 = direction[0],
        m01 = left[1], m11 = up[1], m21 = direction[1],
        m02 = left[2], m12 = up[2], m22 = direction[2];
    
    //console.log(vec3.set(left,[]),vec3.set(up,[]),direction);
    
    var t = m00 + m11 + m22,s,x,y,z,w;
    
    if (t > 0) { 
      s =  Math.sqrt(t+1)*2; 
      w = 0.25 * s;            
      x = (m21 - m12) / s;
      y = (m02 - m20) / s;
      z = (m10 - m01) / s;
    } else if ((m00 > m11) && (m00 > m22)) {
      s =  Math.sqrt(1.0 + m00 - m11 - m22)*2;
      x = s * 0.25;
      y = (m10 + m01) / s;
      z = (m02 + m20) / s;
      w = (m21 - m12) / s;
    } else if (m11 > m22) {
      s =  Math.sqrt(1.0 + m11 - m00 - m22) *2; 
      y = s * 0.25;
      x = (m10 + m01) / s;
      z = (m21 + m12) / s;
      w = (m02 - m20) / s;
    } else {
      s =  Math.sqrt(1.0 + m22 - m00 - m11) *2; 
      z = s * 0.25;
      x = (m02 + m20) / s;
      y = (m21 + m12) / s;
      w = (m10 - m01) / s;
    }
    
    this.rotation = quat4.create([x,y,z,w]);
    quat4.normalize(this.rotation);
    
  //  console.log(quat4.toMat3(this.rotation,[]));
  };
  
  p.lookAt2 = function(pos, upDir){
    
    var direction,left;
    var up = upDir || [0,1,0];
    direction = vec3.direction(pos,this.worldTranslation,[]);
    direction[2] = -direction[2];
    
    left = vec3.create(up);
    vec3.cross(left,direction);
    vec3.normalize(left);
    if (left[0]===0 && left[1]===0 && left[2]===0){
      if (direction[0] !== 0) {
        vec3.set([direction[1], -direction[0], 0],left);   
      } else {
        vec3.set([0, direction[2], -direction[1]],left);
      }
    }
    
    up = vec3.create(direction);
    vec3.cross(up,left);
    vec3.normalize(up);
    
    
    var m00 = left[0], m01 = up[0], m02 = direction[0],
        m10 = left[1], m11 = up[1], m12 = direction[1],
        m20 = left[2], m21 = up[2], m22 = direction[2];
    
    var t = m00 + m11 + m22,s,x,y,z,w;
    
    
    w = Math.sqrt( Math.max( 0, 1 + m00 + m11 + m22 ) ) / 2;
    x = Math.sqrt( Math.max( 0, 1 + m00 - m11 - m22 ) ) / 2;
    y = Math.sqrt( Math.max( 0, 1 - m00 + m11 - m22 ) ) / 2;
    z = Math.sqrt( Math.max( 0, 1 - m00 - m11 + m22 ) ) / 2;
    x = m21 - m12 > 0 ? x: -x;
    y = m02 - m20 > 0 ? y: -y;
    z = m10 - m01 > 0 ? z: -z;
    
    this.rotation = quat4.create([x,y,z,w]);
    quat4.normalize(this.rotation);
    
    
   console.log(quat4.toMat3(this.rotation,[]));
    
  };

  
  p.getUp = function(){
    var rotMat = quat4.toMat3(this.worldRotation);
    return [rotMat[3],rotMat[4],rotMat[5]];
  };
  
  
}(EWGL));
  ; 

(function(global){
  
  var node = global.node;
  var frustrum = global.frustrum;
  
  var undef;
  var cameraNode = function cameraNode(args){
    //important to keep the prototypal chain clean
    node.call(this,args);
    
    this._perspective = mat4.create();
    this._inverseMatrix = mat4.create(); 
    this.frustrum = frustrum.create();
    return this;
  };
  
  
  
  cameraNode.prototype = new node();
  
  Object.defineProperties(cameraNode.prototype,{
    "_fovy" : {
      "value": 45,
      "configurable" : true,   
      "writable": true
    },
    "fovy" : {
      "get" : function(){
        return this._fovy;
      },
      "set" : function(value){
        this._fovy  = value;
        setperspective(this);
      }
    },
    
    "_aspect": {
      "value" : 1,
      "configurable" : true,   
      "writable": true
    },
    "aspect": {
      "get" : function(){
        return this._aspect;
      },
      "set" : function(value){
        this._aspect = value;
        setperspective(this);
      }
    },
    
    "_near": {
      "value" : 0.1,
      "configurable" : true,   
      "writable": true
    },
    "near": {
      "get" : function(){
        return this._near;
      },
      "set" : function(value){
        this._near = value;
        setperspective(this);
      }
    },
    
    "_far": {
      "value" : 10000,
      "configurable" : true,   
      "writable": true
    },
    "far": {
      "get" : function(){
        return this._far;
      },
      "set" : function(value){
        this._far = value;
        setperspective(this);
      }
    },
    
    "_perspective": {
      "value" : mat4.create(),
      "configurable" : true,   
      "writable": true
    },
    "perspective": {
      "get" : function(){
        return this._perspective;
      }
    },
    
    "_inverseMatrix": {
      "value" : mat4.create(),
      "configurable" : true,   
      "writable": true
    },
    "inverseMatrix": {
      "get" : function(){
        if (this.flags.UpdateMatrix || this.flags.MatrixUpdated){
          updateInverseMatrix(this);
        }
        return this._inverseMatrix;
      }
    }
  });
  
  var setperspective = function(cameraToSet){ 
    mat4.perspective(cameraToSet.fovy, cameraToSet.aspect, cameraToSet.near, cameraToSet.far, cameraToSet._perspective);
  };
  
  
  cameraNode.prototype.updateView = function(canvas){
    if (canvas){
      this.aspect = canvas.width/canvas.height;
    } else { 
      this.aspect = 1;
    }
  };
  
  var updateInverseMatrix = function(node1){
    mat4.inverse(node1.matrix,node1._inverseMatrix);
    node1.flags.MatrixUpdated = false;
  };
  
  var nodeUpdate = node.prototype.update;
  cameraNode.prototype.update = function(info){
      nodeUpdate.call(this,info);
      this.frustrum.extractPlanes(this.perspective,this.inverseMatrix);
  };
  
  global.cameraNode = cameraNode;
  
}(EWGL));
  ; 

(function(global){
  var undef;
  var node = global.node;
  
  var POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
  var NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
  
  var vecs = vec3.createFixedPool(8);
  
  var geometry = function geometry(args){
    //important to keep the prototypal chain clean
    if (args === undef){
      args = {};
    }
    node.call(this,args);
    
    this.mesh = args.mesh || new global.mesh();
    this.material = args.material || global.materialList.baseMaterial;
    this.materialOptions =  args.materialOptions || {};
    
    return this;
  };
  
  geometry.prototype = new node();
  
  Object.defineProperties(geometry.prototype,{
    "_mesh":{
      "value":undef,
      "configurable" : true,   
      "writable": true
    },
    "mesh": {
      "get" : function(){
        return this._mesh;
      },
      "set" : function(mesh){
        if (mesh !== this._mesh){
          var id;
          if (this._material && this._mesh){
            id = this._material.meshes[this._mesh.meshId];      
            this._material.geometries[id].splice(this._material.geometries[id].indexOf(this),1);
          }
          this._mesh= mesh;
          this._mesh.flags.changedMesh = true;
          if (this._material &&  this._mesh){ 
             id = this._material.meshes[this._mesh.meshId];
            if (id === undef){
              this._material.meshes[this._mesh.meshId] = this._material.geometries.length;
              id = this._material.geometries.length;
              this._material.geometries[id] = [];
            }
            this._material.geometries[id].push(this);
          }
        }
      }
    }, 
    "_material":{
      "value":undef,
      "configurable" : true,   
      "writable": true
    },
    "material": {
      "get" : function(){
        return this._material;
      },
      "set" : function(material){
        var id;
        if (this._material && this._mesh){
          id = this._material.meshes[this._mesh.meshId];      
          this._material.geometries[id].splice(this._material.geometries[id].indexOf(this),1);
        }
       
          this._material= material;
          this.flags.changedMaterial = true;
        if (material){   
          if( this._mesh){
            id = this._material.meshes[this._mesh.meshId];
            if (id === undef){
              this._material.meshes[this._mesh.meshId] = this._material.geometries.length;
              id = this._material.geometries.length;
              this._material.geometries[id] = [];
            }
            this._material.geometries[id].push(this);
          }
        }
      }
    },
    "_boundingBox" : {
      "value" : undef,
      "configurable" : true,   
      "writable": true
    },
    "boundingBox" : {
      "get" : function(){
        if (!this.flags.staticBoundingBox && this.flags.UpdateBoundingBox){
          calculateUpdateBoundingBox(this);
        }
        return this._boundingBox;
      }
    }
  }); 
  
  var calculateUpdateBoundingBox = function(geom1){
    var mesh = geom1.mesh,x,y,z;
    if (! geom1.flags.NoBoundingBox){
      if (mesh.flags.boundingBoxChanged){
        if (!mesh.boundingBox){
          mesh.boundingBox = new global.boundingBox();
        }
        mesh.boundingBox.getBoundingFromPoints( mesh.vertexbuffers.position.getData() );
        mesh.flags.boundingBoxChanged = false;        
      }
      var matrix = geom1.matrix;
      var mb = mesh.boundingBox;
      var b = geom1._boundingBox;
      
      mb.toAABB(matrix,b);
      /*
      mat4.multiplyVec3(matrix,[mb.minX,mb.minY,mb.minZ],vecs[0]);
      mat4.multiplyVec3(matrix,[mb.minX,mb.minY,mb.plusZ],vecs[1]);
      
      mat4.multiplyVec3(matrix,[mb.minX,mb.plusY,mb.minZ],vecs[2]);
      mat4.multiplyVec3(matrix,[mb.minX,mb.plusY,mb.plusZ],vecs[3]);
      
      mat4.multiplyVec3(matrix,[mb.plusX,mb.minY,mb.minZ],vecs[4]);
      mat4.multiplyVec3(matrix,[mb.plusX,mb.minY,mb.plusZ],vecs[5]);
      
      mat4.multiplyVec3(matrix,[mb.plusX,mb.plusY,mb.minZ],vecs[6]);
      mat4.multiplyVec3(matrix,[mb.plusX,mb.plusY,mb.plusZ],vecs[7]);
      

      
      b.minX  = POSITIVE_INFINITY;
      b.plusX = NEGATIVE_INFINITY;
      
      b.minY  = POSITIVE_INFINITY;
      b.plusY = NEGATIVE_INFINITY;
      
      b.minZ  = POSITIVE_INFINITY;
      b.plusZ = NEGATIVE_INFINITY;
      
      for (var i= 0,l= vecs.length;i<l;i++){
        var vec =  vecs[i];
        x = vec[0];
        y = vec[1];
        z = vec[2];
        
        if (x < b.minX){
          b.minX = x;
        } else if (x > b.plusX){
          b.plusX = x;
        }
        
        if (y < b.minY){
          b.minY = y;
        } else if (y > b.plusY){
          b.plusY = y;
        }
        
        if (z < b.minZ){
          b.minZ = z;
        } else if (z > b.plusZ){
          b.plusZ = z;
        }
      }  */
    }
  };
  
  
  geometry.prototype.setColor = function(color){
    var buffers = this.mesh.vertexbuffers;
    if (!buffers.position){
      return;
    }
    var size = buffers.position.size/3;
    var data = [];
    while(size > 0){
      
      data.push(color[0]);
      data.push(color[1]);
      data.push(color[2]);
      data.push(1);
      
      size--;
    }
    if (buffers.color){
      buffers.color.setData(data);
    } else { 
      this.mesh.addNewVertexbuffer({"type" :"color","data":data});
    }
  };
  
  geometry.prototype.setTexture = function(texture){
    this.materialOptions.texture = texture;
  };
  
  geometry.create = function(args){
    return new geometry(args);
  };
  
  var nodeUpdate = node.prototype.update;
  geometry.prototype.update = function(info){
      nodeUpdate.call(this,info);
      this.material.lastUpdate = info.counter;
  };
  
  global.node.prototype.attachNewGeometry = function(args){
    args = args || {};
    args.parent = this;
    return new geometry(args);
  };
  
  global.mesh.flagsToSet.position = ["boundingBoxChanged"];
  
  global.geometry = geometry;
  
  
  
  
}(EWGL));
; 

(function(global) {

  var shaderExt = global.shaderExtension;

  var lights = {
    lights: [],
    flags: {},
    types: {
      ambientLight: 1,
      directionalLight: 2
    },
    usedLights: {},
    vsShaderExtension: new shaderExt({
      "type": shaderExt.types.vertex
    }),
    fsShaderExtension: new shaderExt({
      "type": shaderExt.types.fragment
    })
  };

  lights.addLight = function(light) {
    lights.lights.push(light);
    lights.flags.changedLights = true;
  };

  var calculateSimpleLightsId = function() {
    var usedLights = lights.usedLights;
    var ambientlights = (usedLights[1] && 1) || 0;
    var directionalLights = (usedLights[2] && usedLights[2].length) || 0;

    return (directionalLights * 100 + ambientlights);
  };
  lights.vsShaderExtension.calculateID = calculateSimpleLightsId;
  lights.fsShaderExtension.calculateID = calculateSimpleLightsId;
  
  
  lights.vsShaderExtension.generateShaderPieces = function(id){
    var vs = lights.vsShaderExtension;
    var ambient = id%100;
    var directional = ((id-ambient)/100)%100;
    var uniformTypes = shaderExt.uniform.types;
    var varyingTypes = shaderExt.varying.types;
    
    if (vs.stack[id]){
      vs.useId(id);
      return;
    }
    
    vs.clear();
    
    if (ambient > 0){
      vs.addUniform("uAmbientColor", uniformTypes.vec3);
      vs.addVarying("vLightWeighting", varyingTypes.vec3);
      vs.appendProgram("vLightWeighting = uAmbientColor;");
    } else if(directional > 0){
      vs.addVarying("vLightWeighting", varyingTypes.vec3);
      vs.appendProgram("vLightWeighting = vec3(0.0,0.0,0.0);");
    }
    
    if (directional > 0) {
      vs.appendProgram("float directionalWeighting;");
      vs.appendProgram("vec3 transformedNormal;"); 

      for (var i = 0; i < directional; i++) {
        vs.addUniform("uDirectionalColor" + i, uniformTypes.vec3);
        vs.addUniform("uDirectionalDirection" + i, uniformTypes.vec3);

        vs.appendProgram("transformedNormal = uNMatrix * aVertexNormal;");
        vs.appendProgram("directionalWeighting = max(dot(normalize(transformedNormal), normalize(uDirectionalDirection" + i + ")), 0.0);");
        vs.appendProgram("vLightWeighting += uDirectionalColor" + i + " * directionalWeighting;");

      }
      
    }
    vs.idNumber = id;
    
  };
  
  lights.fsShaderExtension.generateShaderPieces = function(id){
    var fs = lights.fsShaderExtension;
    var ambient = id%100;
    var directional = ((id-ambient)/100)%100;
    var varyingTypes = shaderExt.varying.types;
    
    if (fs.stack[id]){
      fs.useId(id);
      return;
    }
    
    fs.clear();
    
    if (ambient > 0 || directional > 0){
      fs.addVarying("vLightWeighting", varyingTypes.vec3);
      fs.appendProgram("gl_FragColor = vec4(gl_FragColor.rgb * vLightWeighting, gl_FragColor.a);");
    }
    
    fs.idNumber = id;
  };

  var getShaderInputs = function(shaderProgram,id){
    var uniforms = shaderProgram.uniforms;
    var ambient = id%100;
    var directional = ((id-ambient)/100)%100;
    var renderer = shaderProgram.renderer;
    var i,l;
    
    if (ambient > 0) {
     uniforms.AmbientUniform = renderer.getUniform(shaderProgram.program, "uAmbientColor");
    }
    if (directional > 0) {
      for (i = 0, l = directional; i < l; i++) {
        var color = "directionalLightColor" + i;
        var direction = "directionalLightDirection" + i;
        
        uniforms[color] = renderer.getUniform(shaderProgram.program, "uDirectionalColor" + i);
        uniforms[direction] = renderer.getUniform(shaderProgram.program, "uDirectionalDirection" + i);
      }
    }
  }
  
  lights.vsShaderExtension.getShaderInputs = getShaderInputs;
  
  var setSimpleLightsUniforms = function(shaderProgram,id){
    
    var uniforms = shaderProgram.uniforms;
    var ambient = id%100;
    var directional = ((id-ambient)/100)%100;
    var renderer = shaderProgram.renderer;
    var gl = renderer.gl;
    var i,l;
    
    
    if (ambient > 0) {
      var test = vec3.create();
      for (i = 0, l = lights.usedLights[1].length; i < l; i++) {
        vec3.add(test, lights.usedLights[1][i].color);
      }
      gl.uniform3fv(uniforms.AmbientUniform, test);
    }
    if (directional > 0) {
      for (i = 0, l = directional; i < l; i++) {
        var color = "directionalLightColor" + i;
        var direction = "directionalLightDirection" + i;
        
        gl.uniform3fv(uniforms[color], lights.usedLights[2][i].color);
        gl.uniform3fv(uniforms[direction], lights.usedLights[2][i].direction);
        
      }
    }
  };
  
  lights.vsShaderExtension.setShaderPieces = setSimpleLightsUniforms;

  global.lights = lights;


}(EWGL));; 

(function(global){
  
  var node = global.node;
  var lights = global.lights;
  
  var undef;
  
  var light = function light(args){
    
    //important to keep the prototypal chain clean
    node.call(this,args);
    
    lights.addLight(this);
    return this;
  };
  
  light.prototype = new node();
  
  global.light = light;
  
}(EWGL));; 

(function(global){
  
  var light = global.light;
  var lights = global.lights;
  var node = global.node;
  
  var ambientLight = function ambientLight(args){
    //important to keep the prototypal chain clean
    light.call(this,args);
    this.color = args.color || vec3.create([1,1,1]);
    return this;
  };
  
  ambientLight.prototype = new light();
  ambientLight.prototype.type = lights.types.ambientLight;
  
  node.prototype.attachNewAmbientLight = function(args){
    args = args || {};
    args.parent = this;
    return new ambientLight(args);
  };
  
  global.ambientLight = ambientLight;
  
}(EWGL));; 

(function(global){
  
  var light = global.light;
  var lights = global.lights;
  var node = global.node;
  
  var undef;
  
  var directionalLight = function directionalLight(args){
    
    //important to keep the prototypal chain clean
    light.call(this,args);
    
    this.color = args.color || vec3.create([1,1,1]);
    this.direction = args.direction || vec3.create([1,1,0]);
    
    return this;
  };
  
  directionalLight.prototype = new light();
  directionalLight.prototype.type = lights.types.directionalLight;
  
  node.prototype.attachNewDirectionalLight = function(args){
    args = args || {};
    args.parent = this;
    return new directionalLight(args);
  };
  
  global.directionalLight = directionalLight;
  
}(EWGL));; 

(function(global){
  
  var shaderExt = global.shaderExtension;
  
  var program = new global.shaderProgram({"renderer": global.renderer});
  
  //*****************************************************************//
  //                           vertexshader                          //
  //*****************************************************************//
  
  var vertexshader = new shaderExt({"type": shaderExt.types.vertex});
  
  vertexshader.addAttribute("aVertexPosition","vec3");
  vertexshader.addAttribute("aVertexNormal","vec3");
  vertexshader.addAttribute("aTexturePosition","vec2");
  
  vertexshader.addUniform("uMVMatrix","mat4");
  vertexshader.addUniform("uPMatrix","mat4");
  vertexshader.addUniform("uCMatrix","mat4");
  vertexshader.addUniform("uNMatrix","mat3");  
  
  vertexshader.addVarying("vTexture","vec2");
  
  vertexshader.appendProgram("gl_Position = uPMatrix * (uCMatrix * uMVMatrix) * vec4(aVertexPosition, 1.0);");
  vertexshader.appendProgram("vTexture = aTexturePosition;");
  
  program.vsMain = vertexshader;
  
  //*****************************************************************//
  //                     fragmentshader                              //
  //*****************************************************************//
  
  var fragmentshader = new shaderExt({"type": shaderExt.types.fragment});
  
  fragmentshader.addPreprocessor("#ifdef GL_ES\n  precision highp float; \n#endif \n");
  
  fragmentshader.addVarying("vTexture","vec2");
  
  fragmentshader.addUniform("uSampler","sampler2D");
  
  fragmentshader.appendProgram("gl_FragColor = texture2D(uSampler, vec2(vTexture.s, vTexture.t));");
  
  program.fsMain = fragmentshader;
  
  //*****************************************************************//
  //                  shader Extensions                              //
  //*****************************************************************//
  
  program.extensions.push(global.lights.vsShaderExtension);
  program.extensions.push(global.lights.fsShaderExtension);

  
  //*****************************************************************//
  //                             common                              //
  //*****************************************************************//
  
  vertexshader.calculateID = false;
  fragmentshader.calculateID = false;
  
  vertexshader.getShaderInputs = function(shaderProgram,id){
    var program = shaderProgram.program;
    var r = shaderProgram.renderer;
    var uniforms = shaderProgram.uniforms;
    var attributes = shaderProgram.attributes;
    
    attributes.vertexPositionAttribute = r.getAttribute(program,"aVertexPosition");
    attributes.TexturePositionAttribute = r.getAttribute(program,"aTexturePosition");
    attributes.VertexNormalAttribute =  r.getAttribute(program,"aVertexNormal");
    
    uniforms.pMatrixUniform =  r.getUniform(program, "uPMatrix");
    uniforms.cMatrixUniform = r.getUniform(program, "uCMatrix");
    uniforms.mvMatrixUniform =  r.getUniform(program, "uMVMatrix");
    uniforms.samplerUniform =  r.getUniform(program, "uSampler");
    uniforms.NMatrixUniform =  r.getUniform(program, "uNMatrix");
    
  };
  
  global.shaders = global.shaders || {};
  global.shaders.baseShader = program;
  
}(EWGL));; 

(function(global){
  
  var shaderExt = global.shaderExtension;
  
  var program = new global.shaderProgram({"renderer": global.renderer});
  
  //*****************************************************************//
  //                           vertexshader                          //
  //*****************************************************************//
  
  var vertexshader = new shaderExt({"type": shaderExt.types.vertex});
  
  vertexshader.addAttribute("aVertexPosition","vec3");
  vertexshader.addAttribute("aVertexNormal","vec3");
  vertexshader.addAttribute("aVertexColor","vec4");

  vertexshader.addUniform("uMVMatrix","mat4");
  vertexshader.addUniform("uPMatrix","mat4");
  vertexshader.addUniform("uCMatrix","mat4");
  vertexshader.addUniform("uNMatrix","mat3");  
  
  vertexshader.addVarying("vColor","vec4");
  
  vertexshader.appendProgram("gl_Position = uPMatrix * (uCMatrix * uMVMatrix) * vec4(aVertexPosition, 1.0);");
  vertexshader.appendProgram("vColor = aVertexColor;");
  
  program.vsMain = vertexshader;
  
  //*****************************************************************//
  //                     fragmentshader                              //
  //*****************************************************************//
  
    var fragmentshader = new shaderExt({"type": shaderExt.types.fragment});
  
  fragmentshader.addPreprocessor("#ifdef GL_ES\n  precision highp float; \n#endif \n");
  
  fragmentshader.addVarying("vColor","vec4");
  
  fragmentshader.appendProgram("gl_FragColor = vColor;");

  program.fsMain = fragmentshader;
  
  //*****************************************************************//
  //                  shader Extensions                              //
  //*****************************************************************//
  
  program.extensions.push(global.lights.vsShaderExtension);
  program.extensions.push(global.lights.fsShaderExtension);

  
  //*****************************************************************//
  //                             common                              //
  //*****************************************************************//
  
  vertexshader.calculateID = false;
  fragmentshader.calculateID = false;
  
  vertexshader.getShaderInputs = function(shaderProgram,id){
    var program = shaderProgram.program;
    var r = shaderProgram.renderer;
    var uniforms = shaderProgram.uniforms;
    var attributes = shaderProgram.attributes;
    
    attributes.vertexPositionAttribute = r.getAttribute(program,"aVertexPosition");
    attributes.vertexColorAttribute =r.getAttribute(program,"aVertexColor");
    attributes.VertexNormalAttribute =  r.getAttribute(program,"aVertexNormal");
    
    uniforms.pMatrixUniform =  r.getUniform(program, "uPMatrix");
    uniforms.cMatrixUniform = r.getUniform(program, "uCMatrix");
    uniforms.mvMatrixUniform =  r.getUniform(program, "uMVMatrix");
    uniforms.NMatrixUniform =  r.getUniform(program, "uNMatrix");
    
  };
  
  global.shaders = global.shaders || {};
  global.shaders.colorShader = program;
  
}(EWGL));; 

(function(global){
  
  var shaderExt = global.shaderExtension;
  
  var program = new global.shaderProgram({"renderer": global.renderer});
  
  //*****************************************************************//
  //                           vertexshader                          //
  //*****************************************************************//
  
  var vertexshader = new shaderExt({"type": shaderExt.types.vertex});
  
  vertexshader.addAttribute("aVertexPosition","vec3");

  vertexshader.addUniform("uPMatrix","mat4");
  vertexshader.addUniform("uCMatrix","mat4");
  
  vertexshader.appendProgram("gl_Position = uPMatrix * uCMatrix * vec4(aVertexPosition, 1.0);");
  
  program.vsMain = vertexshader;
  
  //*****************************************************************//
  //                     fragmentshader                              //
  //*****************************************************************//
  
    var fragmentshader = new shaderExt({"type": shaderExt.types.fragment});
  
  fragmentshader.addPreprocessor("#ifdef GL_ES\n  precision highp float; \n#endif \n");
  
  fragmentshader.appendProgram("gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);");

  program.fsMain = fragmentshader;
    
  //*****************************************************************//
  //                             common                              //
  //*****************************************************************//
  
  vertexshader.calculateID = false;
  fragmentshader.calculateID = false;
  
  vertexshader.getShaderInputs = function(shaderProgram,id){
    var program = shaderProgram.program;
    var r = shaderProgram.renderer;
    var uniforms = shaderProgram.uniforms;
    var attributes = shaderProgram.attributes;
    
    attributes.vertexPositionAttribute = r.getAttribute(program,"aVertexPosition");
    
    uniforms.pMatrixUniform =  r.getUniform(program, "uPMatrix");
    uniforms.cMatrixUniform = r.getUniform(program, "uCMatrix");
  };
  
  global.shaders = global.shaders || {};
  global.shaders.whiteColorShader = program;
  
}(EWGL));; 

(function(global){
  var undef;
  var materialList = {
    
    "materials" : [],
    "baseMaterial" : undef
    
  };
  
  materialList.registerMaterial = function(material){
    if (materialList.materials.length === 0 ){
      materialList.baseMaterial = material;
    }
    if ( materialList.materials.indexOf(material)){
      materialList.materials.push(material);
    } else {
      console.log("material was already registered");
    }
  };
  
  
  materialList.render = function(info){
    
    update(info);
    
    var i,l = materialList.materials.length;
    global.renderer.clear();
    for(i = 0;i<l;i++){
      if (info.counter === materialList.materials[i].lastUpdate){
        materialList.materials[i].render(info);
      }
    }
  };
  
  var update = function(info){
    var lights = global.lights,AllLights,light;
    if (lights){
      AllLights =lights.lights;
      lights.usedLights = {};
      for(var j = 0;j< AllLights.length;j++){
        light = AllLights[j];
        if (light.lastUpdate === info.counter){
          lights.usedLights[light.type] = lights.usedLights[light.type] || [];
          lights.usedLights[light.type].push(light);
        };
      };
    };
    
  };
  
  
  global.materialList = materialList;
  
  
  
}(EWGL));; 

(function(global){
  var undef;
  
  var emptyTexture;
  
  var materialList = global.materialList;
  var lights = global.lights;
  
  
  var material = function(args){
    
    if (!args) {
      args = {};
    }
    
    //materialList.registerMaterial(this);
    
    this.meshes = {}; 
    this.geometries = [];
    this.zOrdered = false;
    this.shaderProgram = args.shaderProgram || undef;
    this.lastUpdate = -1;
    
    Object.defineProperties(this,{
      "renderer":{
        "get":function(){
          return global.renderer;
        }
      }
    });
    
    
  };
  
  var p = material.prototype;
  
  p.update = function(){};
  
  p.render = function(){};
  
  /*********************************************************************/
  /*                                                                   */
  /*                       Helper Functions                            */
  /*                                                                   */
  /*********************************************************************/

  p.calculateNormals =function(mesh){
    var vertexbuffers = mesh.vertexbuffers;
    
    var positions = vertexbuffers.position.getData();
    var indices = vertexbuffers.indices.getData();
    
    var normal = new Float32Array(positions.length);
    
    var i,l =indices.length;
    var pointindex1,pointindex2,pointindex3;
    var point1 = vec3.create(),
        point2 = vec3.create(),
        point3 = vec3.create(),
        subtract1 = vec3.create(),
        subtract2 = vec3.create(),
        cross = vec3.create(),
        normalVec = vec3.create();
    
    for(i = 0;i<l;i+= 3){
      
      pointindex1 = indices[i] * 3;
      pointindex2 = indices[i + 1] * 3;
      pointindex3 = indices[i + 2] * 3;
      
      vec3.set([positions[pointindex1],positions[pointindex1 + 1],positions[pointindex1 + 2]],point1);
      vec3.set([positions[pointindex2],positions[pointindex2 + 1],positions[pointindex2 + 2]],point2);
      vec3.set([positions[pointindex3],positions[pointindex3 + 1],positions[pointindex3 + 2]],point3);
      
      
      vec3.subtract(point3,point2,subtract1);
      vec3.subtract(point1,point2,subtract2);
      
      vec3.cross(subtract1,subtract2,cross);
      
      vec3.normalize(cross);
      
      normal[pointindex1] += cross[0];
      normal[pointindex2] += cross[0];
      normal[pointindex3] += cross[0];
      
      normal[pointindex1 + 1] += cross[1];
      normal[pointindex2 + 1] += cross[1];
      normal[pointindex3 + 1] += cross[1];
            
      normal[pointindex1 + 2] += cross[2];
      normal[pointindex2 + 2] += cross[2];
      normal[pointindex3 + 2] += cross[2];
      
    }
      
      
    for(i = 0,l = normal.length;i<l;i+= 3){
      
      vec3.set([normal[i],normal[i + 1],normal[i + 2]],normalVec);  
      
      vec3.normalize(normalVec);
      
      normal[i] = normalVec[0];
      normal[i + 1] = normalVec[1];
      normal[i + 2] = normalVec[2];
      
    }
    
    mesh.addNewVertexbuffer({"type" :"normal",
                            "data" :normal});
  };
  
  var FrustrumUpdated,
      _frustum = [quat4.create(),quat4.create(),quat4.create(),quat4.create(),quat4.create(),quat4.create()],
      m = mat4.create(); 
  p.isInFrustrum = function(info,boundingbox,cameraPerspective,cameraMatrix) {
      var i, plane,l;
    if (info.count === FrustrumUpdated){
      FrustrumUpdated = info.count;
      mat4.multiply(cameraPerspective,cameraMatrix,m);
      
      quat4.set( [ m[12] - m[0], m[13] - m[1], m[14] - m[2], m[15] - m[3] ] , _frustum[ 0 ]);
		  quat4.set( [ m[12] + m[0], m[13] + m[1], m[14] + m[2], m[15] + m[3] ] , _frustum[ 1 ]);
		  quat4.set( [ m[12] + m[4], m[13] + m[5], m[14] + m[6], m[15] + m[7] ] , _frustum[ 2 ]);
		  quat4.set( [ m[12] - m[4], m[13] - m[5], m[14] - m[6], m[15] - m[7] ] , _frustum[ 3 ]);
		  quat4.set( [ m[12] - m[8], m[13] - m[9], m[14] - m[10], m[15] - m[11] ] , _frustum[ 4 ]);
		  quat4.set( [ m[12] + m[8], m[13] + m[9], m[14] + m[10], m[15] + m[11] ] , _frustum[ 5 ]);
      
    

		  for ( i = 0; i < 6; i ++ ) {

			  plane = _frustum[ i ];
        l = Math.sqrt( plane[0] * plane[0] + plane[1] * plane[1] + plane[2] * plane[2] );
			  quat4.set([plane[0]/l,plane[1]/l,plane[2]/l,plane[3]/l],plane);

		  }
    }
    
    var radius;
    for(i=0; i < 6; i++) {
      radius = - Math.max( boundingbox.plusX -boundingbox.minX/2 , Math.max( boundingbox.plusY -boundingbox.minY/2, boundingbox.plusZ -boundingbox.minZ/2 ))

    }

    return true;
  };

 global.material = material;

}(EWGL));; 

(function(global){
  var undef;
  
  var emptyTexture;
  
  var materialList = global.materialList;
  var lights = global.lights;
  var shaderExt = global.shaderExtension;
  

  var basematerial = new global.material({"shaderProgram":global.shaders.baseShader});
  
  basematerial.render = function(info){
    
    var i,renderer = basematerial.renderer,
        l = basematerial.geometries.length,
        gl = renderer.gl,
        shaderProgram = this.shaderProgram,
        geom,mesh;
    
    shaderProgram.use();
    
    //setcameraMatrix
    gl.uniformMatrix4fv(shaderProgram.uniforms.pMatrixUniform, false, basematerial.renderer.camera.perspective);
    gl.uniformMatrix4fv(shaderProgram.uniforms.cMatrixUniform, false, basematerial.renderer.camera.inverseMatrix);
    
    lights.vsShaderExtension.setShaderPieces(shaderProgram,lights.vsShaderExtension.calculateID());
    
    //render Geometries
    for(i=0;i<l;i++){
      geom = basematerial.geometries[i];
      if(geom.lastUpdate === info.counter){
        mesh = geom.mesh;
        //setmatrix
        gl.uniformMatrix4fv(shaderProgram.uniforms.mvMatrixUniform, false, geom.matrix);
        
        var test = mat4.multiply( basematerial.renderer.camera.inverseMatrix,geom.matrix,mat4.create());
        var test2 = mat4.toMat3(test,mat3.create());
        test2 = mat3.transpose(test2);
        
        gl.uniformMatrix3fv(shaderProgram.uniforms.NMatrixUniform, false, test2);   
        
        //ready the 
        if (mesh.vertexbuffers.position.flags.dataChanged){
          renderer.AdjustGLBuffer(mesh.vertexbuffers.position);
        }
        if (! mesh.vertexbuffers.normal){
         this.calculateNormals(geom);
        }
        if (mesh.vertexbuffers.normal.flags.dataChanged){
          renderer.AdjustGLBuffer(mesh.vertexbuffers.normal);
        }
        
        if (mesh.vertexbuffers.color.flags.dataChanged){
          renderer.AdjustGLBuffer(mesh.vertexbuffers.color);
        }
        
        if (mesh.vertexbuffers.texture.flags.dataChanged){
          renderer.AdjustGLBuffer(mesh.vertexbuffers.texture);
        }
        
        if (mesh.vertexbuffers.indices.flags.dataChanged){
          renderer.AdjustGLELMENTBuffer(mesh.vertexbuffers.indices);
        }
        
        if (!geom.materialOptions.texture){
          geom.materialOptions.texture = createEmptyTexture();
        }
        
        if (!geom.materialOptions.texture.texture){
          geom.materialOptions.texture.texture = gl.createTexture();
        }
        
        if (geom.materialOptions.texture.flags.imageLoaded){
          gl.bindTexture(gl.TEXTURE_2D, geom.materialOptions.texture.texture);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, geom.materialOptions.texture.image);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
          gl.bindTexture(gl.TEXTURE_2D, null);
          geom.materialOptions.texture.flags.imageLoaded = false;
        }
        
        
        
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.position.glObject);
        gl.vertexAttribPointer(shaderProgram.attributes.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.normal.glObject);
        gl.vertexAttribPointer(shaderProgram.attributes.VertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.color.glObject);
        gl.vertexAttribPointer(shaderProgram.attributes.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.texture.glObject);
        gl.vertexAttribPointer(shaderProgram.attributes.TexturePositionAttribute, 2, gl.FLOAT, false, 0, 0);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, geom.materialOptions.texture.texture);
        gl.uniform1i(shaderProgram.uniforms.samplerUniform, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.vertexbuffers.indices.glObject);
        gl.drawElements(gl.TRIANGLES, mesh.vertexbuffers.indices.size, gl.UNSIGNED_SHORT, 0);
        
      }
    }
  };
  
  var createEmptyTexture = function(){
     if (!emptyTexture){
       emptyTexture = new EWGL.texture({"url":"http://media.tojicode.com/q3bsp/demo_baseq3/webgl/no-shader.png"});
     }
     return emptyTexture;
  };

  
  materialList.registerMaterial(basematerial);
  
  global.baseMaterial = basematerial;
  
}(EWGL));; 

(function(global){
  var undef;
  
  var emptyTexture;
  
  var materialList = global.materialList;
  var lights = global.lights;

  var testMatrix4 = mat4.create();
  var testMatrix3 = mat3.create();
  

  var colorMaterial = new global.material({"shaderProgram":global.shaders.colorShader});
  
  colorMaterial.render = function(info){
    
    var i,renderer = colorMaterial.renderer,
        mesheslength = colorMaterial.geometries.length,
        geomLength,
        gl = renderer.gl,
        shaderProgram = this.shaderProgram,
        geom,mesh,geoms,size,matrix,cameraMatrix,
        camera = colorMaterial.renderer.camera;
    
    shaderProgram.use();

    //setcameraMatrix
    gl.uniformMatrix4fv(shaderProgram.uniforms.pMatrixUniform, false, camera.perspective);
    gl.uniformMatrix4fv(shaderProgram.uniforms.cMatrixUniform, false, camera.inverseMatrix);
    
    lights.vsShaderExtension.setShaderPieces(shaderProgram,lights.vsShaderExtension.calculateID());
    
    //render Geometries
    for(i=0;i<mesheslength;i++){ 
      geomLength = colorMaterial.geometries[i].length;
      if (geomLength > 0){
        mesh = colorMaterial.geometries[i][0].mesh;
        
        if (mesh.vertexbuffers.position.flags.dataChanged){
          renderer.AdjustGLBuffer(mesh.vertexbuffers.position);
        }
        
        if (! mesh.vertexbuffers.normal){
         this.calculateNormals(mesh);
        }
        
        if (mesh.vertexbuffers.normal.flags.dataChanged){
          renderer.AdjustGLBuffer(mesh.vertexbuffers.normal);
        }
        
        if (mesh.vertexbuffers.color.flags.dataChanged){
          renderer.AdjustGLBuffer(mesh.vertexbuffers.color);
        }
        
        if (mesh.vertexbuffers.indices.flags.dataChanged){
          renderer.AdjustGLELMENTBuffer(mesh.vertexbuffers.indices);
        }
      
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.position.glObject);
        gl.vertexAttribPointer(shaderProgram.attributes.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.normal.glObject);
        gl.vertexAttribPointer(shaderProgram.attributes.VertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.color.glObject);
        gl.vertexAttribPointer(shaderProgram.attributes.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
        
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.vertexbuffers.indices.glObject);
        
        geoms = colorMaterial.geometries[i];
        size = mesh.vertexbuffers.indices.size;
        cameraMatrix =  colorMaterial.renderer.camera.matrix;
        for(j=0;j<geomLength;j++){
          geom = geoms[j];

            matrix =  geom.matrix;
            
            gl.uniformMatrix4fv(shaderProgram.uniforms.mvMatrixUniform, false, matrix);
            
            var test = mat4.multiply(cameraMatrix,matrix,testMatrix4);
            var test2 = mat4.toMat3(mat4.inverse(test),testMatrix3);
            test2 = mat3.transpose(test2);
            
            gl.uniformMatrix3fv(shaderProgram.uniforms.NMatrixUniform, false, test2);   
          if (camera.frustrum.isInFrustrum(geom.boundingBox)){
            gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, 0);
          } else {
            //gl.drawElements(gl.LINES, size, gl.UNSIGNED_SHORT, 0);
          
          } 
        }
        
      }
    }
  };
  
  materialList.registerMaterial(colorMaterial);
  
  global.colorMaterial = colorMaterial;
  
}(EWGL));; 

(function(global){
    
  materialList = global.materialList;
 
  var linesMaterial = {
    "geometries" : [],
    "zOrdered": false,
    "lastUpdate": -1
  };
  Object.defineProperties(linesMaterial,{
    "renderer":{
      "get":function(){
        return global.renderer;
      }
    }
  });
  
  
  linesMaterial.update = function(){};
  
  linesMaterial.render = function(info){
    
    var i,l = linesMaterial.geometries.length,
        gl = linesMaterial.renderer.gl,
        r = linesMaterial.renderer,
        c = r.camera,
        shaderProgram,
        geom,mesh;
    
    //setshader
    if (! linesMaterial.shaderProgram){
      createShaderProgram();
    }
    shaderProgram =  linesMaterial.shaderProgram;
    r.useProgram(shaderProgram);
    //setcameraMatrix
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, c.perspective);
    gl.uniformMatrix4fv(shaderProgram.cMatrixUniform, false, c.inverseMatrix);
    
    //render Geometries
    for(i=0;i<l;i++){
      geom = linesMaterial.geometries[i];
      if(geom.lastUpdate === info.counter){
        mesh = geom.mesh;
        //setmatrix
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, geom.matrix);
        
        //draw
        if (mesh.vertexbuffers.position.flags.dataChanged){
          r.AdjustGLBuffer(mesh.vertexbuffers.position);
        };
        
        if (mesh.vertexbuffers.color.flags.dataChanged){
          r.AdjustGLBuffer(mesh.vertexbuffers.color);
        };
        
        if (mesh.vertexbuffers.indices.flags.dataChanged){
          r.AdjustGLELMENTBuffer(mesh.vertexbuffers.indices);
        };        
        
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.position.glObject);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.color.glObject);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.vertexbuffers.indices.glObject);
        gl.drawElements(gl.LINES, mesh.vertexbuffers.indices.size, gl.UNSIGNED_SHORT, 0);

      };
    };
  };
  
  var vertexshader = 
      "attribute vec3 aVertexPosition;" +
      "" +
      "attribute vec4 aVertexColor;" +
      "uniform mat4 uMVMatrix;" + 
      "uniform mat4 uPMatrix;" +
      "uniform mat4 uCMatrix;" +
      "varying vec4 vColor;" +
      "" + 
      "" + 
      "void main(void) {" +
      "  gl_Position = uPMatrix * (uCMatrix * uMVMatrix) * vec4(aVertexPosition, 1.0);" +
      "  vColor = aVertexColor;" +
      "" +
      "}";
  var fragmentshader = "#ifdef GL_ES\n" +
      "  precision highp float; \n" +
      "#endif \n" + 
      "varying vec4 vColor;" +
      "" +
      "" + 
      "void main(void) { \n" +
      "gl_FragColor = vColor; \n" +
      "}\n";
  
  
  var createShaderProgram = function(){
    var r = linesMaterial.renderer;
    
    var shaderProgram = r.createShaderProgram(vertexshader,fragmentshader);
    
    shaderProgram.vertexPositionAttribute =r.getAttribute(shaderProgram,"aVertexPosition");
    shaderProgram.vertexColorAttribute =r.getAttribute(shaderProgram,"aVertexColor");
    shaderProgram.TexturePosition =r.getAttribute(shaderProgram,"aTexturePosition");

    
    shaderProgram.pMatrixUniform = r.getUniform(shaderProgram, "uPMatrix");
    shaderProgram.cMatrixUniform = r.getUniform(shaderProgram, "uCMatrix");
    shaderProgram.mvMatrixUniform = r.getUniform(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = r.getUniform(shaderProgram, "uSampler");
    
    linesMaterial.shaderProgram = shaderProgram;
  };
  

  
  materialList.registerMaterial(linesMaterial);
  
  global.linesMaterial = linesMaterial;
  
}(EWGL));; 

(function(global){
  var undef;
  
  var emptyTexture;
  
  materialList = global.materialList;
  
  var skyboxMaterial = {
    "geometries" : [],
    "zOrdered": false,
    "shaderProgram" : undef,
    "lastUpdate": -1
  };
  Object.defineProperties(skyboxMaterial,{
    "renderer":{
      "get":function(){
        return global.renderer;
      }
    }
  });
  
  
  skyboxMaterial.update = function(){};
  
  skyboxMaterial.render = function(info){
    
    var i,renderer = skyboxMaterial.renderer,
        l = skyboxMaterial.geometries.length,
        gl = skyboxMaterial.renderer.gl,
        shaderProgram,
        geom,mesh;
    
    //setshader
    if (! skyboxMaterial.shaderProgram){
      createShaderProgram();
    }
    shaderProgram =  skyboxMaterial.shaderProgram;
    renderer.useProgram(shaderProgram);
    
    //setcameraMatrix
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, skyboxMaterial.renderer.camera.perspective);
    gl.uniformMatrix4fv(shaderProgram.cMatrixUniform, false, mat4.inverse(quat4.toMat4(skyboxMaterial.renderer.camera.worldRotation)));
    
    //render Geometries
    for(i=0;i<l;i++){
      geom = skyboxMaterial.geometries[i];
      if(geom.lastUpdate === info.counter){
        mesh = geom.mesh;
        //setmatrix
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, geom.matrix);
        
        //draw
        if (mesh.vertexbuffers.position.flags.dataChanged){
          renderer.AdjustGLBuffer(mesh.vertexbuffers.position);
        }
        
        if (mesh.vertexbuffers.color.flags.dataChanged){
          renderer.AdjustGLBuffer(mesh.vertexbuffers.color);
        }
        
        if (mesh.vertexbuffers.texture.flags.dataChanged){
          renderer.AdjustGLBuffer(mesh.vertexbuffers.texture);
        }
        
        if (mesh.vertexbuffers.indices.flags.dataChanged){
          renderer.AdjustGLELMENTBuffer(mesh.vertexbuffers.indices);
        }
        
        if (!geom.materialOptions.texture){
          geom.materialOptions.texture = createEmptyTexture();
        }
        
        if (!geom.materialOptions.texture.texture){
          geom.materialOptions.texture.texture = gl.createTexture();
        }
        
        if (geom.materialOptions.texture.flags.imageLoaded){
          gl.bindTexture(gl.TEXTURE_2D, geom.materialOptions.texture.texture);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, geom.materialOptions.texture.image);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
          gl.bindTexture(gl.TEXTURE_2D, null);
          geom.materialOptions.texture.flags.imageLoaded = false;
        }
        
        
        
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.position.glObject);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.color.glObject);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vertexbuffers.texture.glObject);
        gl.vertexAttribPointer(shaderProgram.TexturePosition, 2, gl.FLOAT, false, 0, 0);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, geom.materialOptions.texture.texture);
        gl.uniform1i(shaderProgram.samplerUniform, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.vertexbuffers.indices.glObject);
        gl.drawElements(gl.TRIANGLES, mesh.vertexbuffers.indices.size, gl.UNSIGNED_SHORT, 0);
        
      }
    }
  };
  
  var createEmptyTexture = function(){
     if (!emptyTexture){
       emptyTexture = new EWGL.texture({"url":"http://media.tojicode.com/q3bsp/demo_baseq3/webgl/no-shader.png"});
     }
     return emptyTexture;
  };
  
  var vertexshader = 
      "attribute vec3 aVertexPosition;" +
      "attribute vec2 aTexturePosition;" +
      "attribute vec4 aVertexColor;" +
      "uniform mat4 uMVMatrix;" + 
      "uniform mat4 uPMatrix;" +
      "uniform mat4 uCMatrix;" +
      "varying vec4 vColor;" +
      "varying vec2 vTexture;" + 
      "" + 
      "void main(void) {" +
      "  gl_Position = uPMatrix * (uCMatrix * uMVMatrix) * vec4(aVertexPosition, 1.0);" +
      "  vColor = aVertexColor;" +
      "  vTexture = aTexturePosition;" +
      "}";
  var fragmentshader = "#ifdef GL_ES\n" +
      "  precision highp float; \n" +
      "#endif \n" + 
      "varying vec4 vColor;" +
      "varying vec2 vTexture;" +
      "uniform sampler2D uSampler;" + 
      "void main(void) { \n" +
      "gl_FragColor = texture2D(uSampler, vec2(vTexture.s, vTexture.t)); \n" +
      "}\n";
  
  
  var createShaderProgram = function(){
    var start = +(new Date());
    var r = skyboxMaterial.renderer;
    
    var shaderProgram = r.createShaderProgram(vertexshader,fragmentshader);
    //console.log("shaderprogram alone:" + ( +(new Date()) - start));
    shaderProgram.vertexPositionAttribute =r.getAttribute(shaderProgram,"aVertexPosition");
    shaderProgram.vertexColorAttribute =r.getAttribute(shaderProgram,"aVertexColor");
    shaderProgram.TexturePosition =r.getAttribute(shaderProgram,"aTexturePosition");
    
    
    shaderProgram.pMatrixUniform = r.getUniform(shaderProgram, "uPMatrix");
    shaderProgram.cMatrixUniform = r.getUniform(shaderProgram, "uCMatrix");
    shaderProgram.mvMatrixUniform = r.getUniform(shaderProgram, "uMVMatrix");
    shaderProgram.samplerUniform = r.getUniform(shaderProgram, "uSampler");
    
    skyboxMaterial.shaderProgram = shaderProgram;
    //console.log( +(new Date()) - start);
  };
  
  
  
  materialList.registerMaterial(skyboxMaterial);
  
  global.skyboxMaterial = skyboxMaterial;
  
}(EWGL));; 

(function(global){
  var undef;
  
  var node = global.node;  
  var geometry = global.geometry;
  var vertexbuffer = global.vertexbuffer;
  
  var triangle = function(args){
    geometry.call(this,args);
    this.mesh.addVertexbuffer(new vertexbuffer({"type" :"position",
                                                "data" :[  0.0,  1.0,  0.0, 
                                                          -1.0, -1.0,  0.0,                                                          
                                                           1.0, -1.0,  0.0]
                                               })
                             );
    this.mesh.addVertexbuffer(new vertexbuffer({"type" :"color",
                                                "data" :[ 1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0]
                                               })
                             );
    this.mesh.addVertexbuffer(new vertexbuffer({"type" : "indices",
                                                "data" : [ 0,  1,  2]
                                               })
                             ); 
                                                           
  };
  
  triangle.prototype = new geometry();
  triangle.prototype.material = undef;
  
  node.prototype.attachNewTriangle = function(args){ 
    var t = new triangle(args);
    this.addChildren(t);
    return t;
  };                                                       
  
  global.triangle = triangle;
}(EWGL));





; 

(function(global){
  var undef;
    
  var node = global.node;  
  var geometry = global.geometry;
  var vertexbuffer = global.vertexbuffer;
  
  var Quad = function(args){
    geometry.call(this,args);
    this.mesh.addNewVertexbuffer({"type" :"position",
                                  "data" :[ 0.5,  0.5,  0.0, 
                                           -0.5, -0.5,  0.0,                                                          
                                            0.5, -0.5,  0.0,
                                           -0.5,  0.5,  0.0]
                                });
    this.mesh.addNewVertexbuffer({"type" :"color",
                                  "data" :[ 1.0,  1.0,  1.0,  1.0, 
                                            1.0,  1.0,  1.0,  1.0, 
                                            1.0,  1.0,  1.0,  1.0,
                                            1.0,  1.0,  1.0,  1.0]
                                });
    this.mesh.addNewVertexbuffer({"type" : "indices",
                                  "data" : [ 0,  2,  1,
                                             0,  1,  3]
                                }); 
    this.mesh.addNewVertexbuffer({"type" : "texture",
                                  "data" : [ 0,  0,
                                             1,  1,
                                             0,  1,
                                             1,  0]
                                });                                                        
                                                           
  };
  
  Quad.prototype = new geometry();
  Quad.prototype.material = undef;
  
  node.prototype.attachNewQuad = function(args){ 
    var t = new Quad(args);
    this.addChildren(t);
    return t;
  };                                                       
  
  global.quad = Quad;
}(EWGL));; 

(function(global){
  var undef;
    
  var node = global.node;  
  var geometry = global.geometry;
  var vertexbuffer = global.vertexbuffer;
  
  var Cube = function(args){
    geometry.call(this,args);
    this.mesh.addNewVertexbuffer({"type" :"position",
                                                "data" :[  //back side
                                                           1.0,  1.0, -1.0, 
                                                          -1.0, -1.0, -1.0,                                                          
                                                           1.0, -1.0, -1.0,
                                                          -1.0,  1.0, -1.0,
                                                          
                                                          // front side
                                                           1.0,  1.0,  1.0,
                                                          -1.0, -1.0,  1.0,                                                          
                                                           1.0, -1.0,  1.0,
                                                          -1.0,  1.0,  1.0,
                                                          
                                                          //up side
                                                           1.0,  1.0,   1.0,
                                                          -1.0,  1.0,  -1.0,                                                          
                                                           1.0,  1.0,  -1.0,
                                                          -1.0,  1.0,   1.0,
                                                          
                                                          //down side
                                                           1.0, -1.0,   1.0,
                                                          -1.0, -1.0,  -1.0,                                                          
                                                           1.0, -1.0,  -1.0,
                                                          -1.0, -1.0,   1.0,
                                                          
                                                          //right side
                                                           1.0,  1.0,   1.0,
                                                           1.0, -1.0,  -1.0,                                                          
                                                           1.0,  1.0,  -1.0,
                                                           1.0, -1.0,   1.0,
                                                          
                                                          //left side
                                                          -1.0,  1.0,   1.0,
                                                          -1.0, -1.0,  -1.0,                                                          
                                                          -1.0,  1.0,  -1.0,
                                                          -1.0, -1.0,   1.0]
                                               });
    this.mesh.addNewVertexbuffer({"type" :"color",
                                                "data" :[ 1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0,
                                                          1.0,  1.0,  1.0,  1.0,
                                                          
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0,
                                                          1.0,  1.0,  1.0,  1.0,
                                                          
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0,
                                                          1.0,  1.0,  1.0,  1.0,
                                                          
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0,
                                                          1.0,  1.0,  1.0,  1.0,
                                                          
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0,
                                                          1.0,  1.0,  1.0,  1.0,
                                                          
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0, 
                                                          1.0,  1.0,  1.0,  1.0,
                                                          1.0,  1.0,  1.0,  1.0]
                                               })
                             ;
    this.mesh.addNewVertexbuffer({"type" : "indices",
                                                "data" : [ 0, 1, 2,
                                                           0, 3, 1,
                                                           
                                                           4, 5, 6,
                                                           4, 7, 5,
                                                           
                                                           8, 9, 10,
                                                           8, 11, 9,
                                                           
                                                           12, 14, 13,
                                                           12, 13, 15,
                                                           
                                                           16, 17, 18,
                                                           16, 19, 17,
                                                           
                                                           20, 21, 22,
                                                           20, 23, 21]
                                               }); 
    this.mesh.addNewVertexbuffer({"type" : "texture",
                                                "data" : [ 0,  0,
                                                           1,  1,
                                                           0,  1,
                                                           1,  0,
                                                           
                                                           0,  0,
                                                           1,  1,
                                                           0,  1,
                                                           1,  0,
                                                           
                                                           0,  0,
                                                           1,  1,
                                                           0,  1,
                                                           1,  0,
                                                           
                                                           0,  0,
                                                           1,  1,
                                                           0,  1,
                                                           1,  0,
                                                           
                                                           0,  0,
                                                           1,  1,
                                                           0,  1,
                                                           1,  0,
                                                           
                                                           0,  0,
                                                           1,  1,
                                                           0,  1,
                                                           1,  0]
                                               });                                                        
                                                           
  };
  
  Cube.prototype = new geometry();
  Cube.prototype.material = undef;

  node.prototype.attachNewCube = function(args){ 
    var t = new Cube(args);
    this.addChildren(t);
    return t;
  };                                                       
  
  global.cube = Cube;
}(EWGL));; 

(function(global){
  var undef;
    
  var node = global.node;  
  var geometry = global.geometry;
  var vertexbuffer = global.vertexbuffer;
  
  var Sphere = function(args){
    geometry.call(this,args);
    
    args = args ||{};
    var latitudeBands = args.latitudeBands || 30;
    var longitudeBands = args.longitudeBands || 30;
    var radius = args.radius || 1;
    
    var vertexPositionData = [];
    var normalData = [];
    var textureCoordData = [];
    var colors = [];
    for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
      var theta = latNumber * Math.PI / latitudeBands;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);
      
      for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
        var phi = longNumber * 2 * Math.PI / longitudeBands;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);
        
        var x = cosPhi * sinTheta;
        var y = cosTheta;
        var z = sinPhi * sinTheta;
        var u = 1 - (longNumber / longitudeBands);
        var v = 1 - (latNumber / latitudeBands);
        
        normalData.push(x);
        normalData.push(y);
        normalData.push(z);
        textureCoordData.push(u);
        textureCoordData.push(v);
        vertexPositionData.push(radius * x);
        vertexPositionData.push(radius * y);
        vertexPositionData.push(radius * z);
        colors.push(1.0);
        colors.push(1.0);
        colors.push(1.0);
        colors.push(1.0);
      }
    }
    
    var indexData = [];
    for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
      for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
        var first = (latNumber * (longitudeBands + 1)) + longNumber;
        var second = first + longitudeBands + 1;
        indexData.push(first);
        indexData.push(first + 1);
        indexData.push(second);

        
        indexData.push(second);
        indexData.push(first + 1);
        indexData.push(second + 1);

      }
    }
    
    
    this.mesh.addNewVertexbuffer({"type" : "position",
                                  "data" : vertexPositionData});
    /*                              
    this.mesh.addNewVertexbuffer({"type" : "normal",
                                  "data" : normalData});
     */                             
    this.mesh.addNewVertexbuffer({"type" : "color",
                                  "data" : colors});
                                  
    this.mesh.addNewVertexbuffer({"type" : "indices",
                                  "data" : indexData}); 
                                  
    this.mesh.addNewVertexbuffer({"type" : "texture",
                                  "data" : textureCoordData});                                                        
    
  };
  
  Sphere.prototype = new geometry();
  Sphere.prototype.material = undef;
  
  node.prototype.attachNewSphere = function(args){ 
    var t = new Sphere(args);
    this.addChildren(t);
    return t;
  };                                                       
  
  global.sphere = Sphere;
}(EWGL));; 

(function(global){
  
  var node = global.node;
  
  var undef;
  var skybox = function skybox(args){
    //important to keep the prototypal chain clean
    node.call(this,args);
    
    this.attachNewQuad({"material":global.skyboxMaterial,"translation":[-0.5, 0, 0],"rotation":[0.7071,0,-0.7071,0],"materialOptions":{"texture":args.left}});
    this.attachNewQuad({"material":global.skyboxMaterial,"translation":[ 0.5, 0, 0],"rotation":[0.7071,0,0.7071,0],"materialOptions":{"texture":args.right}});
    this.attachNewQuad({"material":global.skyboxMaterial,"translation":[ 0, 0,-0.5],"rotation":[1,0,0,0],"materialOptions":{"texture":args.front}});
    this.attachNewQuad({"material":global.skyboxMaterial,"translation":[ 0, 0, 0.5],"rotation":[0,0,1,0],"materialOptions":{"texture":args.back}});
    this.attachNewQuad({"material":global.skyboxMaterial,"translation":[ 0, 0.5, 0],"rotation":[0,0.7071,0.7071,0],"materialOptions":{"texture":args.top}});
    this.attachNewQuad({"material":global.skyboxMaterial,"translation":[ 0,-0.5, 0],"rotation":[-0.7071,0,0,0.7071],"materialOptions":{"texture":args.bottom}});
    
    return this;
  };
  
  
  
  skybox.prototype = new node();
  
  node.prototype.attachNewSkybox = function(args){
    var t = new skybox(args);
    this.addChildren(t);
    return t;
  };
  
  global.skybox = skybox;
  
}(EWGL));; 

(function(global){
  var undef;
    
  var node = global.node;  
  var geometry = global.geometry;
  var vertexbuffer = global.vertexbuffer;
  
  var boundingBoxOutline = function(args){
    geometry.call(this,args);

    var data =     [-1,-1,-1,
                    -1,-1,1,
                    
                    -1,1,-1,
                    -1,1,1,
                    
                    1,-1,-1,
                    1,-1,1,
                    
                    1,1,-1,
                    1,1,1];
        
    this.mesh.addNewVertexbuffer({"type" : "position",
                                  "data" : data});
                                  
    this.mesh.addNewVertexbuffer({"type" : "indices",
                                  "data" : [  0,1,
                                              0,2,
                                              0,4,
                                              1,3,
                                              1,5,
                                              2,3,
                                              2,6,
                                              3,7,
                                              4,5,
                                              4,6,
                                              5,7,
                                              6,7]});
             
             
    this.flags.NoBoundingBox = true;     
    this.material = global.debugBoundingBoxesMaterial;
  };
  
  
  
  boundingBoxOutline.prototype = new geometry();
  boundingBoxOutline.prototype.material = global.debugBoundingBoxesMaterial;
  
  
  boundingBoxOutline.prototype.update = function(info){
    var bdata = this.parent.boundingBox;
    var data = [bdata.minX,bdata.minY,bdata.minZ,
                bdata.minX,bdata.minY,bdata.plusZ,
                
                bdata.minX,bdata.plusY,bdata.minZ,
                bdata.minX,bdata.plusY,bdata.plusZ,
                
                bdata.plusX,bdata.minY,bdata.minZ,
                bdata.plusX,bdata.minY,bdata.plusZ,
                
                bdata.plusX,bdata.plusY,bdata.minZ,
                bdata.plusX,bdata.plusY,bdata.plusZ];
    this.mesh.vertexbuffers.position.setData(data);
    this.lastUpdate = info.counter;
    this.material.lastUpdate = info.counter;
  };
  
  node.prototype.attachNewBoundingBoxOutline = function(args){ 
    var t = new boundingBoxOutline(args);
    this.addChildren(t);
    return t;
  };                                                       
  
  global.boundingBoxOutline = boundingBoxOutline;
}(EWGL));; 

(function(global){
  var undef;
  
  var loader = {
    "loaders": [],
    "extensions" : {},
    "specialCases" : [],
    "defaultLoader" : undef,
    "onLoadedCompleted":function(){console.log("Everything is loaded");}
  };
  
  Object.defineProperties(loader,{
    "_counter" :{
      "value":0,
      "configurable" : true,   
      "writable": true
    },
    "counter": {
      "get": function(){
        return loader._counter;
      },
      "set":function(value){
        loader._counter = value;
        if (loader._counter === 0){
          loadingCompleted();
        }
      }
    }
  });

  loader.addLoader = function(args){
    var i,l;
    loader.loaders.push(args.loader);
    if (args.extensions){
      l = args.extensions.length;
      if (l !== undef){
        for(i=0;i<l;i++){
          loader.extensions[args.extensions[i].toUpperCase()] = args.loader;
        }
      } else {
        loader.extensions[args.extensions.toUpperCase()] = args.loader;
      }
    }
    if (args.specialCases){
      l = args.specialCases.length;
      if (l !== undef){
        for(i=0;i<l;i++){
          loader.specialCases.push({"evaluate":args.specialCases[i],"loader":args.loader});
        }
      } else {
        loader.specialCases.push({"evaluate":args.specialCases[i],"loader":args.loader});
      }
    }
  };
  
  loader.load = function(args){
    var i,l,extension;
    l = loader.specialCases.length;
    for(i=0;i<l;i++){
      if (loader.specialCases[i].evaluate(args)){
        return loader.load(args);
      }
    }
    i = args.url.lastIndexOf(".");
    l = args.url.substring(i+1).toUpperCase();
    if (loader.extensions[l]){
      return loader.extensions[l](args);
    }
    return loader.defaultLoader(args);
  };
    
    
  loader.onComplete = function(ex){
    console.log("test");
  };
  
  
  loader.onError = function(ex){
    throw "Something Not loaded correctly.";
  };
  
  var loadingCompleted = function(){
    loader.onLoadedCompleted();
  };
     
  global.loader = loader;  
  
  
}(EWGL));; 

(function(global){
  
  var loader = global.loader;
  
  var loading = [];
  
  var imageLoader = function(args){
    loader.counter += 1;
    
    args = args || {};
    
    var img = args.image || new Image();
    var argsToSent = {"image":img};
    img.onload = createOnCompleteCallback(args.onComplete,argsToSent);
    img.onerror =  createOnErrorCallback(args.onError,argsToSent);
    
    if (args.url.indexOf("http") !== -1) {
      img.crossOrigin = '';
    }
    
    img.src = args.url;
    return img;
  };
  
  var createOnCompleteCallback = function(onComplete,args){
    return function(){
      if (onComplete){
        onComplete(args);
      } else {
        loader.onComplete(args);
      }
      loader.counter -= 1;
    }; 
  };
  
  var createOnErrorCallback = function(onError,args){
    return function(){
      if (onError){
        onError(args);
      } else {
        loader.onError(args);
      }
      loader.counter -= 1;
    };
  };
  
  loader.loadImage = function(args){
    return imageLoader(args);
  };
  
  loader.addLoader({  "loader" : imageLoader,
                      "extensions": ["JPG","PNG","GIF"]
                  });
  
}(EWGL));; 

(function(global){
  
  var loader = global.loader;
  var Texture = global.texture;
  var replacementImage = new Image();
  
  var textureLoader = function(args){
    
    var texture = new Texture();
    var arg = {};
    arg.url = args.url;
    arg.onComplete = createOnCompleteCallback(args.onComplete,{"texture": texture});
    arg.onError = createOnErrorCallback(args.onError,{"texture": texture});
    texture.image = loader.loadImage(arg);
    
    return texture;
  };
  
  var createOnCompleteCallback = function(onComplete,args){
    return function(){
      if (onComplete){
        onComplete(args);
      }
      args.texture.flags.imageLoaded = true;
    }; 
  };
  
  var createOnErrorCallback = function(onError,args){
    return function(){
      if (onError){
        onError(args);
      }
    };
  };
  
  loader.loadTexture = function(args){
    return textureLoader(args);
  };
  
  loader.addLoader({  "loader" : textureLoader});
  
}(EWGL));; 

(function(global){
  var undef;
  
  var controller = function(args){
    this._node =args.node || undef;  
  };
  
  Object.defineProperties(controller.prototype,{
    "node" : {
      "get" : function(){
        return this._node;
      },
      "set" : function(node){
        this._node = node;
        this.changedNode();
      }
    }
  });
  
        
  
  controller.prototype._node = undef;
  
  //overrideable 
  controller.prototype.update = function(){};
  
  //overrideable
  controller.prototype.changedNode = function(){};
  
  global.controller = controller;
  
}(EWGL));; 

(function(global){
  var undef;
  
  var controller = global.controller;
  
  var positionController = function(args){
    this._node =args.node;
    this.rpm = args.rpm || 0;
    this.axis = args.axis || [0,0,0];
    this.startRotation = quat4.create()
      if(!args.notStarting){
        this.start();
      } else {
        this.stop();
      };
  };
  
  
  
  positionController.prototype = new controller({});
  
  
  positionController.prototype.rpm = 0;
  positionController.prototype.axis = [0,0,0];
  positionController.prototype.startTime = 0;
  positionController.prototype.enabled = false;
  positionController.prototype.startRotation = quat4.create();
  
  positionController.prototype.start =function(){
    this.startTime = +(new Date());
    this.enabled = true; 
  };
  positionController.prototype.stop =function(){
    this.startTime = +(new Date());
    this.enabled = false; 
  };
  positionController.prototype.update = function(){    
    var time = +(new Date()) - this.startTime;
    var angle = time * this.rpm/60000;
    var axis = vec3.normalize(this.axis,vec3.create());
    this.node.rotation = [axis[0]* Math.sin(angle/2),axis[1]* Math.sin(angle/2),axis[2]* Math.sin(angle/2),Math.cos(angle/2)];
  };
  
  positionController.prototype.changedNode = function(){  
    if(this.node){
      this.startRotation = quat4.create(this.node.rotation);
    };
  };
  
  global.positionController = positionController;
  
}(EWGL));; 

(function(global){
  var undef;
  
  var controller = global.controller;
  
  var pathController = function(args){
    this._node =args.node;
    this.path = args.path || [];
    this.totaltime = getTotaltime(this.path);
    if(!args.notStarting){
      this.start();
    } else {
      this.stop();
    };
  };
  
  
  
  pathController.prototype = new controller({});
  
  pathController.prototype.rpm = 0;
  pathController.prototype.path = [];
  pathController.prototype.totaltime = 0;
  pathController.prototype.enabled = false;
  
  var getTotaltime = function(path){
    
    var i,l= path.length,total = 0;
    for (i= 0;i<l;i++){
      total += path[i].time;
    };
    return total;
  };
  
  pathController.prototype.start =function(){
    this.startTime = +(new Date());
    this.enabled = true; 
  };
  
  pathController.prototype.stop =function(){
    this.startTime = +(new Date());
    this.enabled = false; 
  };
  
  pathController.prototype.update = function(){    
    var time = +(new Date()) - this.startTime;
    var timeLeft = time % this.totaltime;
    var path = this.path;
    var i = 0,l= path.length,total = 0;
    var translation = vec3.create()
    for (i= 0;i<l;i++){
      if ((total + path[i].time) < timeLeft) {
        total += path[i].time;
        vec3.add(translation ,path[i].translation);
      } else if (total < timeLeft){
        var diff = timeLeft - total;
        var diff2 = vec3.scale(path[i].translation,diff/path[i].time,vec3.create());
        vec3.add(translation ,diff2);
        total += path[i].time;
      };
    };
    this.node.translation = translation ;
  };
  
  global.pathController= pathController;
  
}(EWGL));; 

(function(global){
  var undef;
  
  var controller = global.controller;
  var input = global.inputManager;
  
  input.addKeyHandler({"name":"distanceAngleController.left",
                      "keyName":input.keyboard.keys.LEFT_ARROW
  });
  input.addKeyHandler({"name":"distanceAngleController.right",
                       "keyName":input.keyboard.keys.RIGHT_ARROW
  });
  input.addKeyHandler({"name":"distanceAngleController.down",
                       "keyName":input.keyboard.keys.DOWN_ARROW
  });
  input.addKeyHandler({"name":"distanceAngleController.up",
                       "keyName":input.keyboard.keys.UP_ARROW
  });
  input.addMouseDragHandler({"name":"distanceAngleController.drag",
                            "keyName":input.mouse.mouseButtons.LEFT
  });
  
  input.addMouseWheelHandler({"name":"distanceAngleController.wheel"});
  
  var distanceAngleController= function(args){
    this.distance = 0;
    this.height = 0;
    this.angle = 0;
    this.targetPosition = args.targetPosition || vec3.create(0,0,0);
    this.initialVecUp = [0,1,0];
  };
  
  
  distanceAngleController.prototype = new controller({});
  distanceAngleController.prototype.distance = 0;
  distanceAngleController.prototype.angle = quat4.create();
  
  distanceAngleController.prototype.changedNode = function(){ 
    var node = this.node;
    var targetPosition = this.targetPosition;
    var self = this;
    if (this.node){
      //this.targetPosition = this.node.worldTranslation;
      var diff = vec3.subtract(this.node.worldTranslation,this.targetPosition,[]);
      this.distance = Math.sqrt(diff[0]*diff[0] + diff[2]* diff[2]);
      this.height = diff[1];
      this.angle = Math.atan2(diff[2],diff[0]);
      targetPosition = this.targetPosition;
      input.addMapping("distanceAngleController.left",
                        function(){
                           self.angle += 0.05;
                           update(self ,node ,targetPosition);
                         });
      input.addMapping("distanceAngleController.right",
                        function(){
                          self.angle -= 0.05;
                          update(self ,node ,targetPosition);
                        });
      
      input.addMapping("distanceAngleController.up",
                        function(){
                           self.distance -= 0.3;
                           update(self ,node ,targetPosition);
                        });
      input.addMapping("distanceAngleController.down",
                        function(){
                           self.distance += 0.3;
                           update(self ,node ,targetPosition);
                        });
                        
      input.addMapping("distanceAngleController.drag",
                        function(args){
                           var mouse = args.mouse;
                           if (mouse.position[0] > mouse.prevPosition[0] ){
                             self.angle += 0.05;
                           } else if (mouse.position[0] < mouse.prevPosition[0] ) {
                             self.angle -= 0.05;
                           }
                           update(self ,node ,targetPosition);
                        });
                        
     input.addMapping("distanceAngleController.wheel",
                        function(delta){
                          self.distance -= 1* delta;
                          update(self ,node ,targetPosition);
                        });
      node.lookAt(targetPosition);
    }
  };
  
  
  var update = function(self,node,targetPosition){
    node.translation = vec3.add([Math.cos(self.angle)*self.distance, self.height, Math.sin(self.angle)*self.distance],targetPosition); 
    node.lookAt(targetPosition);
  };
  
  global.distanceAngleController = distanceAngleController;
  
}(EWGL));; 

(function(global) {
  var info = {};
  var app = function(args) {
      var camera, renderer, rootNode;
      renderer = global.renderer;
      
      
      this.renderer = global.renderer;
      this.materialList = global.materialList;
      this.input = global.inputManager;
      this.lights = global.lights;
      
      rootNode = new global.node({
        "name": "rootNode"
      });
      this.rootNode = rootNode;
      
      camera = new global.cameraNode({
        "name": "mainCamera",
        "parent": this.rootNode
      });
      renderer.camera = camera;
      
      this.mainLight = new global.ambientLight({
        "name": "mainLight",
        "color": vec3.create([0.5, 0.5, 0.5]),
        "parent": this.rootNode
      });
      
      this.stats = new global.stats();
      
      this.assetManager = global.loader;
      this.assetManager.onLoadedCompleted = (function(self) {
        return function() {
          self.startRendering();
        };
      }(this));
      
      if (args && args.canvas){
        var canvas = document.getElementById(args.canvas.id);
        canvas.width = args.canvas.width;
        canvas.height = args.canvas.height;
        this.renderer.canvas = canvas;
      } else {
        this.renderer.canvas = createcanvas();
      }
      
  };
  
  Object.defineProperties(app.prototype, {
    "camera": {
      "get": function() {
        return this.renderer.camera;
      },
      "set": function(cam) {
        this.renderer.camera = cam;
      }
    }
  });
  
  

  app.prototype.startRendering = function() {
    var applicationtest = this;
    timestart = +(new Date());
    var render = function() {
        requestAnimationFrame(render);
        applicationtest.stats.update(info);
        applicationtest.update(info);
        applicationtest.input.update(info);
        applicationtest.rootNode.update(info);
        applicationtest.materialList.render(info);
        };
    render();
  };

  app.prototype.renderOnce = function() {
    this.stats.update(info);
    this.update(info);
    this.input.update(info);
    this.rootNode.update(info);
    this.materialList.render(info);
  };

  app.prototype.update = function(info) {};

  var createcanvas;
  createcanvas = function() {
    var canvas;
    canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    return canvas;
  };

  global.app = app;
}(EWGL));; 

(function(global){
  
  var undef;
  var newTime,
      i,
      prevTime,
      timeCapsule, 
      firstTime;
  
  var stats = function(){
    
    prevTime = +(new Date());
    
    this.timeCapsule = [];
    for(i = 0; i < 100;i++){
      this.timeCapsule.push(prevTime);
    }
    
    this.counter = 0;
  };
  
  stats.prototype.update = function(info){
    timeCapsule = this.timeCapsule;
    
    newTime = +(new Date());
    prevTime = timeCapsule[99];
    firstTime = timeCapsule[0];
    
    timeCapsule.shift();
    timeCapsule.push(newTime);
    
    this.counter++; 
    
    info.timeElapsed = newTime - prevTime;
    info.counter = this.counter;
    info.AvgTime = (newTime - firstTime)/99;
    info.fps = parseInt(1000/info.AvgTime,10);
    
  };
  
  global.stats = stats;
  
}(EWGL));
