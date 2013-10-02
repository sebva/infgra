//----------------------------------------------------------------------------------------------------------
//--------------------------------- WebGLTools.js begins ---------------------------------------------------
//----------------------------------------------------------------------------------------------------------

/**
 * Global variables requested for WebGL tools.
 */

var glContext = null;
var glC1 = null;
var glC2 = null;
var glC3 = null;

var c_width = 0;
var c_height = 0;

var prg = null; // The program (shaders)


/**
 * Allow to initialize Shaders.
 */
function getShader(gl, id) {
	var script = document.getElementById(id);
	if (!script) {
	   return null;
	}

	var str = "";
	var k = script.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	var shader;
	if (script.type == "x-shader/x-fragment") {
		shader = glContext.createShader(glContext.FRAGMENT_SHADER);
	} else if (script.type == "x-shader/x-vertex") {
		shader = glContext.createShader(glContext.VERTEX_SHADER);
	} else {
		return null;
	}

	glContext.shaderSource(shader, str);
	glContext.compileShader(shader);

	if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
		alert(glContext.getShaderInfoLog(shader));
		return null;
	}
	return shader;
}

/**
 * The program contains a series of instructions that tell the Graphic Processing Unit (GPU)
 * what to do with every vertex and fragment that we transmit.
 * The vertex shader and the fragment shaders together are called through that program.
 */
function initProgram() {
    var fgShader = getShader(glContext, "shader-fs");
    var vxShader = getShader(glContext, "shader-vs");

    prg = glContext.createProgram();
    glContext.attachShader(prg, vxShader);
    glContext.attachShader(prg, fgShader);
    glContext.linkProgram(prg);

    if (!glContext.getProgramParameter(prg, glContext.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    glContext.useProgram(prg);

    initShaderParameters(prg);

}	

function requestAnimFrame(o){
		requestAnimFrame(o);
}
	
/**
 * Provides requestAnimationFrame in a cross browser way.
 */
requestAnimFrame = (function() {
return window.requestAnimationFrame ||
     window.webkitRequestAnimationFrame ||
     window.mozRequestAnimationFrame ||
     window.oRequestAnimationFrame ||
     window.msRequestAnimationFrame ||
     function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
       window.setTimeout(callback, 1000.0/60.0);
     };
})();
	
/**
* Render Loop: frame rate and scene drawing.
*/
function renderLoop() {
    requestAnimFrame(renderLoop);
    drawScene();
}
    
/**
* Verify that WebGL is supported by your machine
*/
function getGLContext(canvasName){
	var canvas = document.getElementById(canvasName);
	if (canvas == null){
		alert("there is no canvas on this page");
		return;
	}else {
		c_width = canvas.width;
		c_height = canvas.height;
	}
	
	var gl = null;
	var names = ["webgl",
				 "experimental-webgl",
				 "webkit-3d",
				 "moz-webgl"];
				 
	for (var i = 0; i < names.length; i++){
		try{
			gl = canvas.getContext(names[i]);
		}catch(e){}
		
		if(gl) break;
	}	
	
	if (gl == null){
		alert("WebGL is not available");
	}else{
		//alert("We got a WebGL context: "+names[i]);
		return gl;
	}
} 


/**
* The following code snippet creates a vertex buffer and binds the vertices to it.
*/
function getVertexBufferWithVertices(vertices) {
    var vBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(vertices), glContext.STATIC_DRAW);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, null);    
    
    return vBuffer;
}

/**
* The following code snippet creates a vertex buffer and binds the indices to it.
*/
function getIndexBufferWithIndices(indices){
    var iBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, iBuffer);
    glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), glContext.STATIC_DRAW);
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, null);
    
    return iBuffer;
}


function getArrayBufferWithArray(values) {
    //The following code snippet creates an array buffer and binds the array values to it
    var vBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(values), glContext.STATIC_DRAW);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, null);    
    
    return vBuffer;
}

function getIndexBufferWithIndices(indices){
	    //The following code snippet creates a vertex buffer and binds the indices to it
    var iBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, iBuffer);
    glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), glContext.STATIC_DRAW);
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, null);
    
    return iBuffer;
}

function initTextureWithImage( sFilename, texturen ){
	var anz = texturen.length;
	
	//console.log( "anz=" + anz );
	
	texturen[anz] = glContext.createTexture();
	// this is a bad code. on context lost glContext.createTexture() will return null and
	// an exception will be thrown when you try to attach .image to null
	// Better would be
	// texturen[anz] = {};
	// texturen[anz].texture = glContext.createTexture();
	// texturen[anz].image = new Image();
	
	texturen[anz].image = new Image();
	texturen[anz].image.onload = function() {
		glContext.bindTexture(glContext.TEXTURE_2D, texturen[anz]);
		glContext.pixelStorei(glContext.UNPACK_FLIP_Y_WEBGL, true);//, false);
		glContext.texImage2D  (glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, texturen[anz].image);
		glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.NEAREST);
		glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.NEAREST);

		glContext.generateMipmap(glContext.TEXTURE_2D);
//		glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
//		glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);

		glContext.bindTexture(glContext.TEXTURE_2D, null);
	}
	
	texturen[anz].image.src = sFilename;
	
	// let's use a canvas to make textures, with by default a random color (red, green, blue)
	function rnd() { return Math.floor(Math.random() * 256); }
	
	var c = document.createElement("canvas");
	c.width = 64;
	c.height = 64;
	var ctx = c.getContext("2d");
	var red = rnd();
	var green = rnd();
	var blue = rnd();
	ctx.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";

	//console.log( "texcolor:" + red + "," + green + "," + blue );

	ctx.fillRect(0, 0, 64, 64);
	
	glContext.bindTexture(glContext.TEXTURE_2D, texturen[anz]);
	glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, c);
	glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.NEAREST);
	glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.NEAREST);
	glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
	glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);
}

//----------------------------------------------------------------------------------------------------------
//-------------------------------------- WebGLTools.js ends ------------------------------------------------
//----------------------------------------------------------------------------------------------------------