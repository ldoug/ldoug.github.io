THREE.UCSCharacter = function() {

	var scope = this;
	
	var mesh;
	
	this.scale = 1;
	this.infodis = 0;
	this.root = new THREE.Object3D();
	
	this.numSkins;
	this.numMorphs;
	
	this.skins = [];
	this.materials = [];
	this.morphs = [];

	this.onLoadComplete = function () {};
	
	this.loadCounter = 0;

	this.loadParts = function ( config ) {
		
		this.numSkins = config.skins.length;
		this.numMorphs = config.morphs.length;
		
		
		this.loadCounter = 1 + config.skins.length;
		
		console.log('UCSCharacter loadParts');
		this.skins = loadTextures( config.baseUrl + "skins/", config.skins );
		this.materials = createMaterials( this.skins );
		
		// Morphing 
		
		this.morphs = config.morphs;

		var loader = new THREE.JSONLoader();
		console.log( config.baseUrl + config.character );
		loader.load( config.baseUrl + config.character, function( geometry ) {
			geometry.computeBoundingBox();
			geometry.computeVertexNormals();


			mesh = new THREE.SkinnedMesh( geometry, new THREE.MeshFaceMaterial() );
			scope.root.add( mesh );
			
			var bb = geometry.boundingBox;
			scope.root.scale.set( config.s, config.s, config.s );
			scope.root.position.set( config.x, config.y - bb.min.y * config.s, config.z );

			mesh.castShadow = true;
			mesh.receiveShadow = true;

			animation = new THREE.Animation( mesh, geometry.animation );
			animation.play();
			
			scope.setSkin(0);
			
			scope.checkLoadComplete();
		} );

	};
	
	this.setSkin = function( index ) {
		if(!this.infodis){
			this.infodis = 1;
		}else{
			$("#info").html(bodyd[index]);
			if(index !=0){
			if( $('#volumeimg').is(':empty')){
			$("#volumeimg").show();
			$("#volumeimg").append( "click for audio<img title='click for audio' type='image' id='icon' src='images/index.png' onclick='callme()' ></img>"+ "<img title='click for audio' type='image' id='iconstop' src='images/iconstop.png' onclick='stopspeak()' ></img>");	
		}
		}
		else{
		$("#volumeimg").empty();
		$("#volumeimg").hide();	
		}
		}
		console.log('UCSCharacter setSkin' + index );
		
		if ( mesh && scope.materials ) {
			mesh.material = scope.materials[ index ];
		}
	};
	
	this.updateMorphs = function( influences ) {
		console.log('UCSCharacter updateMorphs');
		if ( mesh ) {
			for ( var i = 0; i < scope.numMorphs; i ++ ) {
				mesh.morphTargetInfluences[ i ] = influences[ scope.morphs[ i ] ] / 100;
			}
		}
	}
	
	function loadTextures( baseUrl, textureUrls ) {
		console.log('loadTextures UCSCharacter');
		var mapping = THREE.UVMapping;
		var textures = [];

		for ( var i = 0; i < textureUrls.length; i ++ ) {

			textures[ i ] = THREE.ImageUtils.loadTexture( baseUrl + textureUrls[ i ], mapping, scope.checkLoadComplete );

			var name = textureUrls[ i ];
			name = name.replace(/\.jpg/g, "");
			textures[ i ].name = name;
			console.log(textures[ i ].name );

		}

		return textures;
	};

	function createMaterials( skins ) {
		var materials = [];
		console.log('createMaterials UCSCharacter');
		for ( var i = 0; i < skins.length; i ++ ) {

			materials[ i ] = new THREE.MeshLambertMaterial( {
				color: 0xeeeeee,
				specular: 10.0,
				map: skins[ i ],
				skinning: true,
				morphTargets: true,
				wrapAround: true
			} );

		}
		
		return materials;
	}

	this.checkLoadComplete = function () {
		console.log('checkLoadComplete');
		scope.loadCounter -= 1;

		if ( scope.loadCounter === 0 ) {

			scope.onLoadComplete();

		}

	}

}
