//=============================================================================
// Kit Loveless Screen Title
// by Kitstainedheart / kitstainedheart@gmail.com
// Date: 03/30/2017  
//=============================================================================
 
/*:
 * @plugindesc Custom title screen for the Loveless game!
 * @author kitstainedheart
 
 * @param command file prefix
 * @desc Prefix for the command png file
 * @default command

 * @param cursor file
 * @desc Name of the png file for the cursor
 * @default cursor

 * @param clouds file 1
 * @desc Name of the png file for the clouds layer #1
 * @default fog0

 * @param clouds file 2
 * @desc Name of the png file for the clouds layer #2
 * @default fog1

 * @param clouds file 3
 * @desc Name of the png file for the clouds layer #3
 * @default fog2

 * @param clouds file 4
 * @desc Name of the png file for the clouds layer #4
 * @default fog3

 * @param clouds file 5
 * @desc Name of the png file for the clouds layer #5
 * @default fog4

 * @param clouds file 6
 * @desc Name of the png file for the clouds layer #6
 * @default fog5

 * @param clouds file 7
 * @desc Name of the png file for the clouds layer #7
 * @default fog6

 * @param stars file 1
 * @desc Name of the png file for the stars layer #1
 * @default stars0

 * @param stars file 2
 * @desc Name of the png file for the stars layer #2
 * @default stars1

 * @param rune file 1
 * @desc Name of the png file for the big runes on the left 
 * @default rune0

 * @param rune file 2
 * @desc Name of the png file for the small runes on the left 
 * @default rune1

 * @param rune file 3
 * @desc Name of the png file for the big runes on the right 
 * @default rune0

 * @param grid file
 * @desc Name of the png file for the grid around the borders of the screen
 * @default grid

 * @param logo file
 * @desc Name of the png file for the logo of the game
 * @default logo

 * @param press start file
 * @desc Name of the png file for the press start prompt
 * @default press_start

 * @param credits scene
 * @desc Name of the credits scene to be called when clicking the credits option
 * @default Scene_MCredits

 * @param website to open
 * @desc Website to open when clicking the website option
 * @default google.com


 

 */
  
$KIT_Loveless_Scene_Title = {};
$KIT_Loveless_Scene_Title.version = 1.0;

(function(){

	$KIT_Loveless_Scene_Title.parameters = PluginManager.parameters('KIT_Loveless_Scene_Title');

	//-----------------------------------------------------------------------------
	// KIT_TitleFog
	//
	// Class for the cloud effects;

	function KIT_TitleFog(){
		this.initialize.apply(this, arguments);
	}

	KIT_TitleFog.prototype = Object.create(TilingSprite.prototype);
	KIT_TitleFog.prototype.constructor = KIT_TitleFog;

	KIT_TitleFog.prototype.initialize = function(fogName, fogSpeed, fogBlendMode){
		TilingSprite.prototype.initialize.call(this);
		this.speed = fogSpeed;
		this.bitmap = ImageManager.loadTitle1(fogName);
	    this._start = true;
	    this.org = [0, 0];
	    this.sx = 0;
	    this.sy = 0;
	    this.blendMode = fogBlendMode;
	    this.isInit = false;
	}

	KIT_TitleFog.prototype.update = function(){
		this.origin.x += this.speed[0];
		this.origin.y += this.speed[1];
		if (!this.isInit && this.bitmap.height != 0){
			this.move(0, Graphics.boxHeight - this.bitmap.height, Graphics.boxWidth, Graphics.boxHeight);
			this.isInit = true;
		}
	}

	//-----------------------------------------------------------------------------
	// KIT_TitleRune
	//
	// Class for the rune effects;

	function KIT_TitleRune(){
		this.initialize.apply(this, arguments);
	}

	KIT_TitleRune.prototype = Object.create(Sprite.prototype);
	KIT_TitleRune.prototype.constructor = KIT_TitleRune;

	KIT_TitleRune.prototype.initialize = function(runeName, runeSpeed){
		Sprite.prototype.initialize.call(this);
		this.speed = runeSpeed;
		this.bitmap = ImageManager.loadTitle1(runeName);
	    this.blendMode = Graphics.BLEND_ADD;
	    this.anchor.x = 0.5;
		this.anchor.y = 0.5;
	    this.isInit = false;
	}

	KIT_TitleRune.prototype.update = function(){
		this.rotation += this.speed;
	}

	//-----------------------------------------------------------------------------
	// KIT_Window_TitleCommand
	//
	// Class for the command window in the title screen;


	function KIT_Window_TitleCommand(){
		this.initialize.apply(this, arguments);
	}

	KIT_Window_TitleCommand.prototype = Object.create(Window_Command.prototype);
	KIT_Window_TitleCommand.prototype.constructor = KIT_Window_TitleCommand;

	KIT_Window_TitleCommand.prototype.initialize = function(){
  		this.kitimages = [];
		Window_Command.prototype.initialize.call(this, 0, 0);
		this.opacity = 0;
		this.updatePlacement();
    	this.openness = 0;
    	this.selectLast();
		this.kitcursor = new Sprite();
		var file = $KIT_Loveless_Scene_Title.parameters['cursor file'];
		this.kitcursor.bitmap = ImageManager.loadTitle1(file);
		
		this.addChild(this.kitcursor);
		this.windowskin = new Bitmap(1, 1);

		this.commandPicture = new Sprite();
		this.addChild(this.commandPicture);

		var filePrefix = $KIT_Loveless_Scene_Title.parameters['command file prefix'];
		for (var i =0; i < 6; i++)
	    	this.kitimages.push(ImageManager.loadTitle1(filePrefix+i));

	    this.refreshPictures();
	}

	KIT_Window_TitleCommand._lastCommandSymbol = null;

	KIT_Window_TitleCommand.initCommandPosition = function() {
	    this._lastCommandSymbol = null;
	};

	KIT_Window_TitleCommand.prototype.updatePlacement = function() {
		this.width = 120;
		this.height = 250;
		this.targetX = Graphics.boxWidth - this.width;
		this.y = Graphics.boxHeight - this.height;
	    this.x = Graphics.boxWidth;
	};

	KIT_Window_TitleCommand.prototype.makeCommandList = function() {
	    this.addCommand('',   'newGame');
	    this.addCommand('',   'continue', this.isContinueEnabled());
	    this.addCommand('',   'options');
	    this.addCommand('',   'credits');
	    this.addCommand('',   'website');
	    this.addCommand('',   'exit');    
	};

	KIT_Window_TitleCommand.prototype.isContinueEnabled = function() {
	    return DataManager.isAnySavefileExists();
	};

	KIT_Window_TitleCommand.prototype.processOk = function() {
	    KIT_Window_TitleCommand._lastCommandSymbol = this.currentSymbol();
	    Window_Command.prototype.processOk.call(this);
	};

	KIT_Window_TitleCommand.prototype.selectLast = function() {
	    if (KIT_Window_TitleCommand._lastCommandSymbol)
	        this.selectSymbol(KIT_Window_TitleCommand._lastCommandSymbol);
	    else if (this.isContinueEnabled())
	        this.selectSymbol('continue');
	};

	KIT_Window_TitleCommand.prototype.update = function() {
		Window_Command.prototype.update.call(this);
		this.kitcursor.y = this.index() * 36;
		if (this.kitcursor.x > -100)
			this.kitcursor.x = Math.max(this.kitcursor.x - 15, -100);
		if (this.active){
	    	if (this.x > this.targetX)
	    		this.x = Math.max(this.x - 20, this.targetX);
	    } else {
	    	if (this.x < Graphics.boxWidth)
	    		this.x = Math.min(this.x + 20, Graphics.boxWidth);
	    }
	};

	KIT_Window_TitleCommand.prototype.refreshPictures = function(){
		this.kitcursor.x = 0;
		this.commandPicture.bitmap = this.kitimages[this.index()];
	}

	KIT_Window_TitleCommand.prototype.cursorDown = function(wrap) {
		Window_Command.prototype.cursorDown.call(this);
		this.refreshPictures();
	};

	KIT_Window_TitleCommand.prototype.cursorUp = function(wrap) {
		Window_Command.prototype.cursorUp.call(this);
		this.refreshPictures();
	};


	//-----------------------------------------------------------------------------
	// Scene_Title
	//
	// The scene class of the title screen.

	Scene_Title.prototype.create = function() {
	    Scene_Base.prototype.create.call(this);
	    this.createBackground();
	    this.createForeground();
	    var file = "";
	    this.hasPressedZ = false;
	    file = $KIT_Loveless_Scene_Title.parameters['clouds file 1'];
	    this.fogLevel0 = new KIT_TitleFog(file, [0.3, 0],Graphics.BLEND_NORMAL);
	    this.addChild(this.fogLevel0);
	    file = $KIT_Loveless_Scene_Title.parameters['clouds file 2'];
	    this.fogLevel1 = new KIT_TitleFog(file, [1.2, 0],Graphics.BLEND_ADD);
	    this.addChild(this.fogLevel1);
	    file = $KIT_Loveless_Scene_Title.parameters['clouds file 3'];
	    this.fogLevel2 = new KIT_TitleFog(file, [3.9, 0],Graphics.BLEND_NORMAL);
	    this.addChild(this.fogLevel2);
	    file = $KIT_Loveless_Scene_Title.parameters['clouds file 7'];
	    this.fogLevel6 = new KIT_TitleFog(file, [1.6, 0],Graphics.BLEND_MULTIPLY);
	    this.addChild(this.fogLevel6);
	    file = $KIT_Loveless_Scene_Title.parameters['clouds file 4'];
	    this.fogLevel3 = new KIT_TitleFog(file, [6.0, 0],Graphics.BLEND_NORMAL);
	    this.addChild(this.fogLevel3);
	    file = $KIT_Loveless_Scene_Title.parameters['clouds file 5'];
	    this.fogLevel4 = new KIT_TitleFog(file, [10.5, 0],Graphics.BLEND_SCREEN);
	    this.addChild(this.fogLevel4);
	    file = $KIT_Loveless_Scene_Title.parameters['clouds file 6'];
	    this.fogLevel5 = new KIT_TitleFog(file, [1, 0],Graphics.BLEND_MULTIPLY);
	    this.addChild(this.fogLevel5);


	    file = $KIT_Loveless_Scene_Title.parameters['grid file'];
	    this.grid = new Sprite();
	    this.grid.bitmap = ImageManager.loadTitle1(file);
	    this.grid.blendMode = Graphics.BLEND_ADD;
	    this.addChild(this.grid);

	    file = $KIT_Loveless_Scene_Title.parameters['rune file 1'];
	    this.rune0 = new KIT_TitleRune(file, 0.005, ["", "0"]);
	    this.rune0.y = Graphics.boxHeight;
	    this.addChild(this.rune0);

	    file = $KIT_Loveless_Scene_Title.parameters['rune file 2'];
	    this.rune1 = new KIT_TitleRune(file, -0.01);
	    this.rune1.y = Graphics.boxHeight;
	    this.addChild(this.rune1);

	    file = $KIT_Loveless_Scene_Title.parameters['rune file 3'];
	    this.rune2 = new KIT_TitleRune(file, 0.02);
	    this.rune2.y = Graphics.boxHeight - 100;
	    this.rune2.opacity = 100;
	    this.addChild(this.rune2);

	    this.stars = [];

	    file = $KIT_Loveless_Scene_Title.parameters['stars file 1'];
	    this.stars.push(new Sprite());
		this.stars[0].bitmap = ImageManager.loadTitle1(file);
		this.stars[0].blendMode = Graphics.BLEND_ADD;
		this.stars[0].trigger = true;
		this.stars[0].speed = 3;
	    this.addChild(this.stars[0]);

	    file = $KIT_Loveless_Scene_Title.parameters['stars file 2'];
	    this.stars.push(new Sprite());
	    this.stars[1].bitmap = ImageManager.loadTitle1(file);
		this.stars[1].blendMode = Graphics.BLEND_ADD;
		this.stars[1].trigger = true;
		this.stars[1].speed = 2;
	    this.addChild(this.stars[1]);

	    file = $KIT_Loveless_Scene_Title.parameters['logo file'];
	    this.logo = new Sprite();
		this.logo.bitmap = ImageManager.loadTitle1('logo');
	    this.logo.blendMode = Graphics.BLEND_NORMAL;
	    this.logo.anchor.x = 0.5;
	    this.logo.anchor.y = 0.5;
	    this.addChild(this.logo);
	    this.logoEffect = new Sprite();
		this.logoEffect.bitmap = ImageManager.loadTitle1(file);
	    this.logoEffect.blendMode = Graphics.BLEND_ADD;
	    this.logoEffect.anchor.x = 0.5;
	    this.logoEffect.anchor.y = 0.5;
	    this.addChild(this.logoEffect);

	    file = $KIT_Loveless_Scene_Title.parameters['press start file'];
	    this.pressStart = new Sprite();
		this.pressStart.bitmap = ImageManager.loadTitle1(file);
	    this.pressStart.anchor.x = 0.5;
	    this.pressStart.anchor.y = 0.5;
	    this.addChild(this.pressStart);

	    this.createWindowLayer();
	    this.createCommandWindow();
	};

	Scene_Title.prototype.start = function() {
	    Scene_Base.prototype.start.call(this);
	    SceneManager.clearStack();

	    this.rune2.x = Graphics.boxWidth + this.rune2.bitmap.width/4;
	    this.logo.x = Graphics.boxWidth/1.6;
	    this.logo.y = Graphics.boxHeight/4;

	    this.logoEffect.x = Graphics.boxWidth/1.6;
	    this.logoEffect.y = Graphics.boxHeight/4;

	    this.pressStart.y = Graphics.boxHeight*0.8
	    this.pressStart.x = this.pressStart.bitmap.width/2;

	    this.centerSprite(this._backSprite1);
	    this.centerSprite(this._backSprite2);
	    this.playTitleMusic();
	    this.startFadeIn(this.fadeSpeed(), false);
	};

	Scene_Title.prototype.update = function() {

	    if (this.logoEffect.scale.x < 1.5){
	    	this.logoEffect.opacity += 5;
	    	this.logoEffect.scale.x += 0.03;
	    	this.logoEffect.scale.y += 0.03;
	    } else {
	    	if (this.logoEffect.opacity > 0){

		    	this.logoEffect.opacity -= 1;
	    	} else {
		    	this.logoEffect.scale.x = 1.0;
		    	this.logoEffect.scale.y = 1.0;
		    }
	    }

	    this.stars.forEach( function(star, index) {
		    if (star.trigger){
		    	if (star.opacity > 0){
		    		star.opacity = Math.max(0, star.opacity - star.speed);
		    	} else {
		    		star.trigger = false
		    	}
		    } else {
		    	if (star.opacity < 255){
		    		star.opacity = Math.min(255, star.opacity + star.speed*2);
		    	} else {
		    		star.trigger = true
		    	}
		    }	
	    });
	    

	    if (this.hasPressedZ == false && Input.isTriggered('ok')){
	    	this.hasPressedZ = true;
	    	SoundManager.playCursor();
	    	this._commandWindow.activate();
	    	this._commandWindow.open();
	    }

	    if (this.hasPressedZ){
	    	if (this.pressStart.opacity > 0)
	    		this.pressStart.opacity -= 10;
	    } else {
			if (this.pressStart.opacity > 0){
	    		this.pressStart.opacity -= 5;
	    		this.pressStart.scale.x += 0.005;
	    		this.pressStart.scale.y += 0.005;
			}
	    	else {
	    		this.pressStart.opacity = 255;
	    		this.pressStart.scale.x = 1.0;
	    		this.pressStart.scale.y = 1.0;
	    	}
	    }

	    Scene_Base.prototype.update.call(this);
	};


	Scene_Title.prototype.terminate = function() {
	    Scene_Base.prototype.terminate.call(this);
	    SceneManager.snapForBackground();
	};

	Scene_Title.prototype.createBackground = function() {
	    this._backSprite1 = new Sprite(ImageManager.loadTitle1($dataSystem.title1Name));
	    this._backSprite2 = new Sprite(ImageManager.loadTitle2($dataSystem.title2Name));
	    this.addChild(this._backSprite1);
	    this.addChild(this._backSprite2);
	};

	Scene_Title.prototype.createForeground = function() {
	    this._gameTitleSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
	    this.addChild(this._gameTitleSprite);
	};

	Scene_Title.prototype.centerSprite = function(sprite) {
	    sprite.x = Graphics.width / 2;
	    sprite.y = Graphics.height / 2;
	    sprite.anchor.x = 0.5;
	    sprite.anchor.y = 0.5;
	};

	Scene_Title.prototype.createCommandWindow = function() {
	    this._commandWindow = new KIT_Window_TitleCommand();
	    this._commandWindow.setHandler('newGame',  this.commandNewGame.bind(this));
	    this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
	    this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
	    this._commandWindow.setHandler('credits',  this.commandCredits.bind(this));
	    this._commandWindow.setHandler('website',  this.commandWebsite.bind(this));
	    this._commandWindow.setHandler('exit',  this.commandExit.bind(this));
	    this._commandWindow.deactivate();
	    this.addWindow(this._commandWindow);
	};

	Scene_Title.prototype.commandNewGame = function() {
	    DataManager.setupNewGame();
	    this._commandWindow.close();
	    this.fadeOutAll();
	    SceneManager.goto(Scene_Map);
	};

	Scene_Title.prototype.commandContinue = function() {
	    this._commandWindow.close();
	    SceneManager.push(Scene_Load);
	};

	Scene_Title.prototype.commandOptions = function() {
	    this._commandWindow.close();
	    SceneManager.push(Scene_Options);
	};

	Scene_Title.prototype.commandCredits = function() {
	    this._commandWindow.close();
	    SceneManager.push(eval($KIT_Loveless_Scene_Title.parameters['credits scene']));
	};

	Scene_Title.prototype.commandWebsite = function() {
		var window = require('nw.gui').Window.get();
		var link = $KIT_Loveless_Scene_Title.parameters['website to open'];
		require('nw.gui').Window.open(link, {
			x: window.x,
			y: window.y,
			width: window.width,
			height: window.height
		});
		this._commandWindow.activate();
	};

	Scene_Title.prototype.commandExit = function() {
	    this._commandWindow.close();
	    require('nw.gui').Window.get().close();
	};

	Scene_Title.prototype.playTitleMusic = function() {
	    AudioManager.playBgm($dataSystem.titleBgm);
	    AudioManager.stopBgs();
	    AudioManager.stopMe();
	};	
})();