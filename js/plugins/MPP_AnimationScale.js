//=============================================================================
// MPP_AnimationScale.js
//=============================================================================
// Copyright (c) 2017 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【ver.1.0】 Change the size of animations
 * @author Mokusei Penguin
 *
 * @help 
 * 
 * ================================
 * Author : Mokusei Penguin
 * URL : http://woodpenguin.blog.fc2.com/
 * 
 * @param Target Type Scale
 * @desc Size rate of animation for characters
 * @default 0.6
 * 
 * @param Screen Type Scale
 * @desc Size rate of animation for screen
 * @default 0.9
 * 
 * 
 */

(function () {

var MPPlugin = { params: PluginManager.parameters('MPP_AnimationScale') };

MPPlugin.TargetTypeScale = Number(MPPlugin.params['Target Type Scale'] || 1);
MPPlugin.ScreenTypeScale = Number(MPPlugin.params['Screen Type Scale'] || 1);

//-----------------------------------------------------------------------------
// Sprite_Animation

var _SpAn_createSprites = Sprite_Animation.prototype.createSprites;
Sprite_Animation.prototype.createSprites = function() {
    _SpAn_createSprites.call(this);
    if (this._animation.position === 3) {
        this.scale.x = MPPlugin.ScreenTypeScale;
        this.scale.y = MPPlugin.ScreenTypeScale;
    } else {
        this.scale.x = MPPlugin.TargetTypeScale;
        this.scale.y = MPPlugin.TargetTypeScale;
    }
};




})();
