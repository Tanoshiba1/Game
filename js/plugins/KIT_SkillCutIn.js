//=============================================================================
// Kit Skill Cut-in scene
// by CodingKitsune / codingkitsune@gmail.com
// Date: 06/15/2018  
//=============================================================================

/*:
 * @plugindesc (v1.0) - Adds cut-ins for skills!
 * @author CodingKitsune
 *
 * @help
 * 
 * To add a cut-in to a skill, just add the following code to it's notes (i.e)!
 * 
 * <cutin>
 *  <chance>70</chance>
 *  <frames>500</frames>
 *  <flash>false</frames>
 *  <pic ox="5" opacity="240" blendMode="2" oy="1" chance="100">CloudySky1</pic>
 *  <pic>x</pic>
 *  <snd volume="100" pitch="100" pan="0" chance="100">Bell1</snd>
 *  <snd>Battle2</snd>
 * </cutin>
 * 
 * -the chance tag represents how often should this cut-in appear (in percentage)
 * this is an optional tag, default is 100
 * *IT IS IMPORTANT THAT THE SUM OF THE CHANCE OF ALL CUT-INS PRESENT IN THE SKILL
 * IS EQUAL TO 100! OTHERWISE WEIRD STUFF MIGHT HAPPEN!
 * 
 * -the frames tag is how many frames the cut-in should take, this is an optional tag
 * the default is 120 if you ommit it! (ONLY ONE PER CUT-IN!)
 * 
 * -the flash tag represents if there should be a flash on screen when the cut-in appears
 * it is also optional, default is true (ONLY ONE PER CUT-IN!)
 * 
 * -the pic tag represents a picture to be shown in the cut-in, order MATTERS!
 * it also has attributes, which are:
 * *ox -> speed of horizontal scrolling of that picture
 * *oy -> speed of vertical scrolling of that picture
 * *blendMode -> blendMode of that picture (0 is normal, 1 is add, 2 is multiply)
 * *opacity -> picture opacity
 * (AS MANY AS YOU WISH PER CUT-IN!)
 * [IMPORTANT: Images must be stored in 'img/cutin/' directory!]
 * 
 * -the snd tag represent a SE to be played when the cut-in appears
 * it also has attributes, which are:
 * *volume -> volume of the SE
 * *pitch -> pitch of the SE
 * *pan -> pan of the SE
 * (AS MANY AS YOU WISH PER CUT-IN!)
 * 
 */

var $KIT = $KIT || {};

$KIT.skillCutIn = {
    isExecutingCutIn: false,
    cutInData: {},
    prepareCutIn: false,
    frameCount: 0
};

(function () {
    
    var parser = new DOMParser();

    function getPropertyValue(attr, name, defaultValue) {
        var namedItem = attr.getNamedItem(name);
        if (namedItem !== null) {
            return namedItem.value;
        } else {
            return defaultValue ;      
        }
    }

    function parseCutInData(xmlData) {
        try {            
            var parsedXml = parser.parseFromString(xmlData, "text/xml");

            var pictures = [];
            var sounds = [];

            var frames = 120;
            var chance = 100;
            var flash = true;

            var xmlChances = parsedXml.getElementsByTagName('chance');
            var xmlFlashes = parsedXml.getElementsByTagName('flash');
            var xmlFrames = parsedXml.getElementsByTagName('frames');
            var xmlPics = parsedXml.getElementsByTagName('pic');
            var xmlSnds = parsedXml.getElementsByTagName('snd');

            if (xmlChances.length > 0) {
                chance = parseInt(xmlChances[0].childNodes[0].nodeValue);
            }

            if (xmlFlashes.length > 0) {
                flash = xmlFlashes[0].childNodes[0].nodeValue.trim().replace(' ', '') === 'true';
            }

            if (xmlFrames.length > 0) {
                frames = parseInt(xmlFrames[0].childNodes[0].nodeValue);
            }

            var attributes;
            for (var i = 0; i < xmlPics.length; i++){
                attributes = xmlPics[i].attributes;
                pictures.push({
                    name: xmlPics[i].childNodes[0].nodeValue,
                    ox: parseInt(getPropertyValue(attributes, 'ox', 0)),
                    oy: parseInt(getPropertyValue(attributes, 'oy', 0)),
                    opacity: parseInt(getPropertyValue(attributes, 'opacity', 255)),
                    blendMode: parseInt(getPropertyValue(attributes, 'blendMode', 0)),
                });
            }

            for (var i = 0; i < xmlSnds.length; i++){
                attributes = xmlSnds[i].attributes;
                sounds.push({
                    name: xmlSnds[i].childNodes[0].nodeValue,
                    volume: parseInt(getPropertyValue(attributes, 'volume', 100)),
                    pitch: parseInt(getPropertyValue(attributes, 'pitch', 100)),
                    pan: parseInt(getPropertyValue(attributes, 'pan', 100)),
                });
            }

            return { pictures: pictures, sounds: sounds, frames: frames , chance: chance, flash: flash};
        } catch (error) {
            throw new Error('Skill Cut-in tags in skill note are not formatted correctly!\nDETAILS:\n'+error);
        }
    }

    function getCutInDataList(notes) {
        var start = -1;
        var end = -1;
        var cutins = [];

        do {
            start = notes.indexOf('<cutin>', end+1);

            if (start !== -1) {
                end = notes.indexOf('</cutin>', start);
                var xmlData = notes.substr(start, end);
                cutins.push(parseCutInData(xmlData));
            }
        } while (start !== -1);

        return { cutins: cutins };
    }

    ImageManager.loadCutIn = function(filename, hue) {
        return this.loadBitmap('img/cutin/', filename, hue, true);
    };

    var OLD_Game_Battler_performActionStart = Game_Battler.prototype.performActionStart;
    Game_Battler.prototype.performActionStart = function (action) {
        if (action.isSkill()) {
            var cutInDataList = action.item().cutInDataList;
            if (cutInDataList == null || cutInDataList === undefined) {
                cutInDataList = getCutInDataList(action.item().note);
                action.item().cutInDataList = cutInDataList;
                cutInDataList.chanceMap = [];
                var index = 0;
                var cutin;
                for (var i = 0; i < 100; i++){
                    cutInDataList.chanceMap[i] = -1;
                }
                for (var i = 0; i < cutInDataList.cutins.length; i++){
                    cutin = cutInDataList.cutins[i];
                    for (j = 0; j <= cutin.chance; j++){
                        if (index <= 100) {
                            cutInDataList.chanceMap[index++] = i;
                        }
                    }
                }
            }

            var selectedCutInIndex = cutInDataList.chanceMap[Math.floor(Math.random() * 100) + 1];

            var activeCutIn =
                cutInDataList.cutins.length >= selectedCutInIndex ? cutInDataList.cutins[selectedCutInIndex] : -1;

            if (activeCutIn !== -1) {
                $KIT.skillCutIn.isExecutingCutIn = true;
                $KIT.skillCutIn.cutInData = activeCutIn;
                $KIT.skillCutIn.prepareCutIn = true;
            }
        }

        OLD_Game_Battler_performActionStart.call(this, action);
    };

    var OLD_Scene_Battle_initialize = Scene_Battle.prototype.initialize;
    Scene_Battle.prototype.initialize = function () {
        OLD_Scene_Battle_initialize.call(this);
        this._kitCutInSprites = [];
    };

    var OLD_Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function () {
        if ($KIT.skillCutIn.isExecutingCutIn === false) {
            OLD_Scene_Battle_update.call(this);  
        } else {
            if ($KIT.skillCutIn.prepareCutIn === true) {
                this.prepareCutIn();
            }
            Scene_Base.prototype.update.call(this);
            $gameScreen.update();
            this.updateCutIn();
        }
    };

    Scene_Battle.prototype.prepareCutIn = function () {
        $KIT.skillCutIn.prepareCutIn = false;
        var data = $KIT.skillCutIn.cutInData;

        if (data !== null && data !== undefined) {
            $KIT.skillCutIn.frameCount = data.frames;
        
            var newSprite;
            var picture;
            for (var i = 0; i < data.pictures.length; i++){
                picture = data.pictures[i];
                newSprite = new TilingSprite();
                newSprite.move(0, 0, Graphics.width, Graphics.height);
                newSprite.bitmap = ImageManager.loadCutIn(picture.name);
                newSprite.opacity = 0;
                newSprite.x = 100;
                newSprite.kitSpeedOx = picture.ox;
                newSprite.kitSpeedOy = picture.oy;
                newSprite.kitOpacity = picture.opacity;
                newSprite.blendMode = picture.blendMode;
                this._kitCutInSprites.push(newSprite);
                this.addChild(newSprite);
            }

            if (data.flash === true) {
                $gameScreen.startFlash([255, 255, 255, 255], 10);
            }

            var sound;
            for (var i = 0; i < data.sounds.length; i++){
                sound = data.sounds[i];
                AudioManager.playSe({ name: sound.name, volume: sound.volume, pitch: sound.pitch, pan: sound.pan});  
            }
        }
    };

    Scene_Battle.prototype.updateCutIn = function () {
        var frameCount = --$KIT.skillCutIn.frameCount;
        if (frameCount <= 30 && frameCount > 0) {
            for (var i = 0; i < this._kitCutInSprites.length; i++){
                this._kitCutInSprites[i].opacity -= 10;
            }
        } else if (frameCount < 0) {
            $KIT.skillCutIn.isExecutingCutIn = false;
            this.removeCutIn();
        } else {
            var sprite;
            for (var i = 0; i < this._kitCutInSprites.length; i++){
                sprite = this._kitCutInSprites[i]
                sprite.opacity = Math.min(sprite.kitOpacity, sprite.opacity+20);
                if (sprite.x > 0) {
                    sprite.x -= 20;
                }
                sprite.origin.x += sprite.kitSpeedOx;
                sprite.origin.y += sprite.kitSpeedOy;
            }
        }
    };

    Scene_Battle.prototype.removeCutIn = function () {
        var data = $KIT.skillCutIn.cutInData;
        for (var i = 0; i < this._kitCutInSprites.length; i++){
            this.removeChild(this._kitCutInSprites[i]);
        }
        this._kitCutInSprites = [];
    }

    var OLD_Scene_Battle_terminate = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function () {
        this.removeCutIn();
        OLD_Scene_Battle_terminate.call(this);
    }

})();
