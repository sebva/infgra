function headerStyle()
{
	// change style as if it was a CSS:
	document.getElementById( "headerJS" ).setAttribute( "style",
		"color:#555588;"+			/* text color */
		"font:bold 9pt sans;"+		/* font style */
		"background:#ccccee;"+		/* background color */
		"border: solid black 2px;"+	/* thickness of the border */
		"border-color:#7777AA;"+	/* border color */
		"border-radius: 15px;" 		/* round corners */
	);
}

function displayTitle( title, a,b,c,d )
{
	// 1. To avoid recurrent issues with the console using MS-ie:
	if (!window.console) window.console = {};
	if (!window.console.log) window.console.log = function () { };

	// 2. Display title with compatibility icons:
	var bro = new Array();
	bro = [a,b,c,d];
	var logoPPUR = "<img src='fig/ppur_logo_mini.png'> ";
	var path = "fig/icons/";
	var icons = "";
	
	for( var i =0; i<4; ++i ){
		if( bro[i] ){
			icons += " <img src='"+path+"icon_";
			switch( i ){
				case 0: icons += "ieWin"; break;
				case 1: icons += "chronux"; break;
				case 2: icons += "firewin"; break;
				case 3: icons += "safap"; break;
				default: break;
			}
			icons+=".png'>";
		}
		
		//console.log( icons ); //--- DEBUG LINE ---
	}
	
	// make a similar title for all JS example presented in this course:
	var titleAsHeader = "<div id='headerJS'><center>" + "<h1>"+title+"<br />"+icons+"</h1>Introduction à l'infographie, chapitre 6 : WebGL © 2014, PPUR - EPFL / HES-SO "+logoPPUR+"<br /><br /></center></div>";
	document.write(titleAsHeader);
	headerStyle();
	document.title = title;
}
