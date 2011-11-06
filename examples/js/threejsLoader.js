/* 
 * This is experimental 
 */


(function(global){
  
  var loader = global.loader;
  var loaderCollection = global.loaderCollection;
  var mesh = global.mesh;
  
  var threejsLoader = function(args){
    loader.call(this,args);
  };
  
  global.inherit(loader,threejsLoader);
  
  threejsLoader.prototype.load = function(args){
    var self = this;
    self.onLoadStart();
    var mesh1 = new mesh();
    
    var onLoadComplete = function(data){
      parseData(data,mesh1);
      self.onLoadComplete(mesh1);
    };
                    
    var options = { "url":args.url,
                    "onDownloadStart": args.onDownloadStart,
                    "onDownloadComplete": args.onDownloadComplete,                    
                    "onLoadComplete": onLoadComplete,
                    "onError": args.onError};
    loaderCollection.loadWebworker(options);
    
    
  };
  
  var parseData = function(data,mesh){
    
    var vertices = data.vertices;
    var faces = data.faces;
    var indices = [];
    
    if ( data.version === undefined || data.version != 2 ) {
			console.error( 'Deprecated file format.' );
			return;
		}

		function isBitSet( value, position ) {
			return value & ( 1 << position );
		}
    
    var offset = 0;
		var zLength = faces.length;

		while ( offset < zLength ) {

			var type = faces[ offset ++ ];


			var isQuad          	  = isBitSet( type, 0 );
			var hasMaterial         = isBitSet( type, 1 );
			var hasFaceUv           = isBitSet( type, 2 );
			var hasFaceVertexUv     = isBitSet( type, 3 );
			var hasFaceNormal       = isBitSet( type, 4 );
			var hasFaceVertexNormal = isBitSet( type, 5 );
			var hasFaceColor	      = isBitSet( type, 6 );
			var hasFaceVertexColor  = isBitSet( type, 7 );
      
      if ( isQuad ) {
        
        indices.push(faces[offset]);        
        indices.push(faces[offset + 1]);
        indices.push(faces[offset + 3]);
        
        indices.push(faces[offset + 1]);        
        indices.push(faces[offset + 2]);
        indices.push(faces[offset + 3]);
        
        offset += 4;
        
			} else {
        
        indices.push(faces[offset]);        
        indices.push(faces[offset + 1]);
        indices.push(faces[offset + 2]);
        
        offset += 3;
			}
      
      if (hasMaterial){
        offset += 1;
      }
		}
    
    mesh.addNewVertexbuffer({ "type":"position",
                              "data":vertices});
                              
    mesh.addNewVertexbuffer({ "type":"indices",
                              "data":indices});
    
  };

  
  var options = {};
  options.property = "loadThreejs";
  loaderCollection.addLoader(threejsLoader,options);
  
}(EWGL));