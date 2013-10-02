
/**
 * Created on Sep 19, 2009
 * Course: CS5620 (Interactive Computer Graphics) by Kavita Bala
 * Originally written for CS467/468 (Computer Graphics II and Practicum) by Kavita Bala
 * Copyright 2009 Computer Science Department, Cornell University
 * 
 * @author Adam Arbree -- arbree@cs.cornell.edu
 * @author Wenzel Jakob
 * @author Shuang Zhao
 */


function Vector2(){
	this.x = 0;
	this.y = 0;
}

Vector2.prototype.toString = function(){
	return "[" + this.x + "," + this.y + "]";
}

function Vector3(){
	this.x = 0;
	this.y = 0;
	this.z = 0;
}

Vector3.prototype.toString = function(){
	return "[" + this.x + "," + this.y + "," + this.z + "]";
}

function Face3(){
	this.texCoords = [];
	this.vertices = [];
	this.normals = [];
}

Face3.prototype.toString = function(){
	return "Face3[verts=" + vertices.length + ", normals=" + normals.length + ", texCoords=" + texCoords.length + "]";
}

function OBJLoader(){
	this.vertices = new Array();
	this.normals = new Array();
	this.indices = new Array();
	this.texcoords = new Array();
	this.groups = new Array();
	this.objectName = "";
	this.materialName = "";
	this.isLoaded = false;
}

OBJLoader.prototype.loadFile = function(address)
{
	this.isLoaded = false;
	var request = new XMLHttpRequest();
    request.open("GET", address);
	request.overrideMimeType("text/plain");
	var self = this;
    request.onreadystatechange = function () {
        if (request.readyState == 4) {
			self.handleLoadedOBJ(request.responseText);
			self.isLoaded = true;
        }
    }
    request.send();

	/*
	// finally get data from the file
	parseFile();

	// do some extra computations
	if (normalList.size() == 0) {
		computeNormals();
	}

	// resize the object to fit a canonical cube if specified
	if (normalize) {
		normalize();
	}

	// expand the groups out
	expandGroups();

	// make sure the representation is OK
	repOK();
	*/
}
	

OBJLoader.prototype.handleLoadedOBJ = function(data)
{
	// we'll parse the file in a series of passes.
	// This way we can be sure that we have info we need when we need them
	var vertList = new Array();
	var normalList = new Array();
	var texCoordList = new Array();
	var indexList = new Array();
	var groupList = new Array();
	
	// To grab all 3D vertices, use regex: ^v [\0-9]*
	// To grab all 3D normals, use regex: ^vn [\0-9]*
	// To get each number in a 3-tuple: [-0-9.]*
	// To grab all faces, use regex: ^f [0-9\/ ]*
	// To get each face in a face string: [0-9]*/[0-9]*/[0-9]*
	
	var pattAllVerts = /^v [\0-9]*/gm;
	var pattAllNormals = /^vn [\0-9]*/gm;
	var pattAllTexcoords = /^vt [\0-9]*/gm;
	var pattAllFaces = /^f [0-9\/ ]*/gm;
	
	var verts = data.match(pattAllVerts);
	var norms = data.match(pattAllNormals);
	if(!norms) norms = [];
	var tcoords = data.match(pattAllTexcoords);
	if(!tcoords) tcoords = [];
	var faces = data.match(pattAllFaces);
	
	// (1) parse the vertex positions ...
	for(var i=0; i<verts.length; i++){
		var vert = verts[i].match(/-?\d.\d*/g);
		var v = new Vector3();
		v.x = parseFloat(vert[0]);
		v.y = parseFloat(vert[1]);
		v.z = parseFloat(vert[2]);
		vertList.push(v);
	}
	
	// (2) parse the vertex normals ...
	for(var i=0; i<norms.length; i++){
		var norm = norms[i].match(/-?\d.\d*/g);
		var n = new Vector3();
		n.x = parseFloat(norm[0]);
		n.y = parseFloat(norm[1]);
		n.z = parseFloat(norm[2]);
		normalList.push(n);
	}
	
	// (3) parse out the texture coordinates ...
	for(var i=0; i<tcoords.length; i++){
		var texc = tcoords[i].match(/-?\d.\d*/g);
		var n = new Vector2();
		n.x = parseFloat(texc[0]);
		n.y = parseFloat(texc[1]);
		texCoordList.push(n);
	}
	
	var indexMap = new Map();
	var groupName = "Default";
	var material = "";
	// parse the group
	// parse the material(?)
	var objectName = groupName;
	var materialName = material;
	
	for(var i=0; i<faces.length; i++){
		// old, bad regex method...
		// var face = faces[i].match(/\d\d*/g);
		// var key = new Vector3();
		// key.x = parseInt(face[0]);
		// key.y = parseInt(face[1]);
		// key.z = parseInt(face[2]);
		
		// new, prolly better method...
		var faceIds = faces[i].split(" ");
		var key = new Vector3();
		for(var j=1; j<faceIds.length; j++){
			var components = faceIds[j].split("/");
			if(components.length > 0){
				key.x = parseInt(components[0]) || 0;
			}
			if(components.length > 1){
				key.y = parseInt(components[1]) || 0;
			}
			if(components.length > 2){
				key.z = parseInt(components[2]) || 0;
			}
		}
		
		if(!indexMap.contains(key)){
			// for collecting Vec3 objects...
			//this.vertices.push(vertList[key.x - 1]);	
			
			// for creating VBO float array...
			var vert = vertList[key.x - 1]; 
			this.vertices.push(vert.x);
			this.vertices.push(vert.y);
			this.vertices.push(vert.z);
			
			if (texCoordList.length > 0) {
				// for collecting Vec3 objects...
				//this.texcoords.push(texCoordList[key.y - 1]);
				
				// for creating VBO float array...
				var tx = texCoordList[key.y - 1];
				this.texcoords.push(tx.x);
				this.texcoords.push(tx.y);
			}
			if (normalList.length > 0) {
				// for collecting Vec3 objects...
				//this.normals.add(normalList[key.z - 1]);
				
				// for creating VBO float array...
				var norm = normalList[key.z - 1];
				this.normals.push(norm.x);
				this.normals.push(norm.y);
				this.normals.push(norm.z);
			}

			var imapIndex = this.vertices.length - 1;
			indexMap.put(key, imapIndex);
			indexList[i] = imapIndex;
		}
		else{
			indexList[i] = indexMap.get(key);
		}
	}
	
	for (var i=0; i<n-2; i++) {
		this.indices.push(indexList[0]);
		this.indices.push(indexList[i + 1]);
		this.indices.push(indexList[i + 2]);
	}
}

	/*
	// fourth pass: face indices
	// This is slightly trickier, because there are several different
	// formats
	// for representing the faces

	// first we create a map for all possible triplets of (v, vt, vn)
	// VertexIndexMap indexMap = new VertexIndexMap( vlist.size(),
	// tlist.size(),
	// nlist.size());
	HashMap<Point3i, Integer> indexMap = new HashMap<Point3i, Integer>();

	String groupname = "Default";
	String material = "";
	// find the object name and sets the material to the first material
	for (String currToken : fileString) {
		StringTokenizer st = new StringTokenizer(currToken);
		boolean exit = false;
		while (st.hasMoreTokens()) {
			String firstToken = st.nextToken();
			if (firstToken.equals("o")) {
				try {
					groupname = st.nextToken();
				} catch (Exception e) {
					// do nothing
				}
				exit = true;
				break;
			} else if (firstToken.equals("usemtl") && material.equals("")) {
				try {
					material = st.nextToken();
				} catch (Exception e) {
					// do nothing
				}
			}
		}
		if (exit) {
			break;
		}
	}
	objectName = groupname;
	materialName = material;

	// next iterate through the file
	GroupData group = new GroupData();
	group.name = groupname;
	group.material = material;
	groupList.clear();
	for (String currToken : fileString) {
		StringTokenizer st = new StringTokenizer(currToken);
		while (st.hasMoreTokens()) {
			String firstToken = st.nextToken();
			if (firstToken.equals("g")) {
				try {
					groupname = st.nextToken();
				} catch (Exception e) {
					groupname = "";
				}

				if (groupList.size() == 0 && group.indexList.size() == 0) {
					// this is the very first group, and there was no
					// geometry prior to
					// this
					groupname = objectName;
				} else {
					groupList.add(group);
				}
				group = new GroupData();
				group.name = groupname;
				group.material = material;
			} else if (firstToken.equals("usemtl")) {
				try {
					material = st.nextToken();
				} catch (Exception e) {
					material = "";
				}
				group.material = material;
			} else if (firstToken.equals("f")) {
				// multi-sided polygon
				// We treat all n-sided polygons as convex, for simplicity
				int n = st.countTokens();
				int[] indices = new int[n];
				for (int i = 0; i < n; ++i) {
					int[] is = getIndices(st.nextToken());

					Point3i key = new Point3i(is[0], is[1], is[2]);
					if (!indexMap.containsKey(key)) {
						// need to create a new vertex
						vertexList.add(new Vector3f(vlist
								.elementAt(is[0] - 1)));
						if (tlist.size() > 0) {
							texcoordList.add(new Vector2f(tlist
									.elementAt(is[1] - 1)));
						}
						if (nlist.size() > 0) {
							normalList.add(new Vector3f(nlist
									.elementAt(is[2] - 1)));
						}

						int imapIndex = vertexList.size() - 1;

						indexMap.put(key, imapIndex);
						indices[i] = imapIndex;
					} else {
						indices[i] = indexMap.get(key);
					}
				}

				for (int i = 0; i < n - 2; ++i) {
					int[] array = new int[3];
					array[0] = indices[0];
					array[1] = indices[i + 1];
					array[2] = indices[i + 2];

					indexList.add(array);

					int[] array2 = new int[3];
					for (int j = 0; j < 3; ++j) {
						array2[j] = array[j];
					}
					group.indexList.add(array2);
				}
			}
		}
	}
	groupList.add(group);
}
	protected void expandGroups() {
		// now we try to expand out the group into objects
		for (GroupData g : groupList) {
			g.vertexList.clear();
			g.normalList.clear();
			g.texcoordList.clear();

			int[] map = new int[vertexList.size()];
			for (int i = 0; i < vertexList.size(); ++i) {
				map[i] = -1;
			}

			for (int[] idx : g.indexList) {
				for (int i = 0; i < idx.length; ++i) {
					if (map[idx[i]] == -1) {
						g.vertexList.add(new Vector3f(vertexList
								.elementAt(idx[i])));
						g.normalList.add(new Vector3f(normalList
								.elementAt(idx[i])));
						if (texcoordList.size() > 0) {
							g.texcoordList.add(new Vector2f(texcoordList
									.elementAt(idx[i])));
						}

						map[idx[i]] = g.vertexList.size() - 1;
						idx[i] = map[idx[i]];
					} else {
						idx[i] = map[idx[i]];
					}
				}
			}
		}
	}

	protected int[] getIndices(String s) throws OBJLoaderException {
		int[] out = new int[3];

		// these will store the partitioned strings
		String[] st = new String[3];
		for (int i = 0; i < 3; ++i) {
			st[i] = "";
		}

		int currString = 0;
		for (int i = 0; i < s.length(); ++i) {
			// first do some error-checking
			// note that this also eliminates negative indices
			if (!((s.charAt(i) >= '0' && s.charAt(i) <= '9') || s.charAt(i) == '/')) {
				throw new OBJLoaderException(
						"Error: Unknown face index format: " + s);
			}

			if (s.charAt(i) != '/') {
				st[currString] += s.charAt(i);
			} else {
				if (currString < 2) {
					++currString;
				} else {
					throw new OBJLoaderException(
							"Error: Unknown face index format: " + s);
				}
			}
		}

		// now we can parse the tokens into integers
		for (int i = 0; i < 3; ++i) {
			if (st[i].length() == 0) {
				if (i == 0) {
					throw new OBJLoaderException(
							"Error: Unknown face index format: " + s);
				}
				out[i] = out[0];
			} else {
				out[i] = Integer.parseInt(st[i]);

				// the value 0 should never be used as an index in an OBJ file
				if (out[i] == 0) {
					throw new OBJLoaderException(
							"Error: Unknown face index format: " + s);
				}
			}
		}

		return out;
	}

	// for some files that do not have normals, compute them
	protected void computeNormals() {
		Vector3f[] faceNormal = new Vector3f[indexList.size()];

		// first compute the face-normals of each triangle
		Vector3f temp1 = new Vector3f();
		Vector3f temp2 = new Vector3f();
		int counter = 0;
		for (int[] idx : indexList) {
			faceNormal[counter] = new Vector3f();
			Vector3f v0 = vertexList.elementAt(idx[0]);
			Vector3f v1 = vertexList.elementAt(idx[1]);
			Vector3f v2 = vertexList.elementAt(idx[2]);
			temp1.sub(v1, v0);
			temp2.sub(v2, v0);
			faceNormal[counter].cross(temp1, temp2);
			faceNormal[counter].normalize();

			++counter;
		}

		// create the normal list
		for (int i = 0; i < vertexList.size(); ++i) {
			normalList.add(new Vector3f());
		}

		// sum up the normals at the vertices
		counter = 0;
		for (int[] idx : indexList) {
			for (int element : idx) {
				Vector3f n = normalList.elementAt(element);
				n.add(faceNormal[counter]);
			}
			++counter;
		}

		// average them all
		for (Vector3f n : normalList) {
			n.normalize();
		}
	}

	// checks the representation of the object
	public void repOK() throws OBJLoaderException {
		if (normalList.size() != vertexList.size()) {
			throw new OBJLoaderException("Error: Number of Vertices ("
					+ vertexList.size() + ") != Number of Normals ("
					+ normalList.size() + ").");
		}

		int counter = 0;
		for (int[] array : indexList) {

			// check for index out-of-bounds
			int max = vertexList.size() - 1;
			if (array[0] < 0 || array[1] < 0 || array[2] < 0 || array[0] > max
					|| array[1] > max || array[2] > max) {
				throw new OBJLoaderException(
						"Error: Index out of bounds: Idx: " + counter + " "
								+ array[0] + ", " + array[1] + ", " + array[2]
								+ " Max: " + max);
			}

			// check for degenerate triangles
			if (array[0] == array[1] || array[0] == array[2]
					|| array[1] == array[2]) {
				throw new OBJLoaderException(
						"Error: Degenerate triangles: Idx: " + counter + " "
								+ array[0] + ", " + array[1] + ", " + array[2]);
			}
			++counter;
		}
	}

	// for testing purposes, when dealing with potentially arbitrary sized
	// objects
	public void normalize() {
		double max = 0.0;

		for (Vector3f v : vertexList) {
			if (Math.abs(v.x) > max) {
				max = Math.abs(v.x);
			}
			if (Math.abs(v.y) > max) {
				max = Math.abs(v.y);
			}
			if (Math.abs(v.z) > max) {
				max = Math.abs(v.z);
			}
		}
		for (Vector3f v : vertexList) {
			v.x /= max;
			v.y /= max;
			v.z /= max;
		}
	}

	// accessor methods
	public Vector<Vector3f> getVertexList() {
		return vertexList;
	}

	public Vector<Vector3f> getNormalList() {
		return normalList;
	}

	public Vector<Vector2f> getTexcoordList() {
		return texcoordList;
	}

	public Vector<int[]> getIndexList() {
		return indexList;
	}

	public int getNumberOfVertices() {
		return vertexList.size();
	}

	public int getNumberOfIndices() {
		return indexList.size();
	}

	public Vector<GroupData> getGroupList() {
		return groupList;
	}

	public String getObjectName() {
		return objectName;
	}

	public String getMaterialName() {
		return materialName;
	}
*/