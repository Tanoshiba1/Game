//=============================================================================
// Dualtech system
// Jay_Dualtechs.js
// Version 3.1.3
//=============================================================================

var Imported = Imported || {};
Imported.Jay_Dualtechs = true;

var Jay = Jay || {};
Jay.Dualtechs = Jay.Dualtechs || {};

//=============================================================================
 /*:
 * @plugindesc Adds functionality for multitech skills.
 *
 * @author Jason R. Godding
 *
 * @param Cycle Actors
 * @type boolean
 * @desc Set to "true" to have skill costs cycle between actors. 
 * Set to "false" to display costs for all actors at once.
 * @default false
 *
 * @param Cycle Length
 * @type Number
 * @desc How long it takes to switch actors with "Cycle Actors". 
 * 60 = 1 second.
 * @default 60
 *
 * @param Always Display User
 * @type boolean
 * @desc "true": User's name/face will be displayed with no cost.
 * "false": User's name/face won't be displayed with no cost.
 * @default true
 *
 * @help Allows certain skills to be dualtechs, combining two characters' skills
 * into one. For dualtechs that do not have special unlock conditions, just
 * have the characters learn them at level 1; they won't show up unless
 * both characters are present and have the necessary skills.
 *
 * A dualtech skill should have the following tag in its note box:
 * <Dual:ID1,Skill1,ID2,Skill2,ID3,...,HitRate>
 *
 * ID1 is the character ID of one of the characters involved.
 * Skill1 is the skill required for that character, either as an ID or skill name.
 * ID2 and Skill2 likewise refer to the second character. You can include up
 * to 10 characters with skills.
 *
 * Hit Rate is optional and only useful for dualtechs that are not Certain Hit. 
 * Without it, it will use the Hit Rate of the user. HitRate is always defined last. You may define
 * the following values for Hit Rate:
 *
 * user - Uses the user's hit rate.
 * first - Uses the first actor's (ID1's) hit rate.
 * second - Uses the second actor's (ID2's) hit rate.
 * highest - Uses the hit rate of the actor whose hit rate is highest.
 * lowest - Uses the hit rate of the actor whose hit rate is lowest.
 * actor# - Uses the hit rate of the actor who is defined in place # in the Dual
 *          tag. So "actor3" would get the hit rate of whichever actor is
 *          defined third (not necessarily the third character in the database!)
 *
 * For battle algorithms, "a" still refers to the user of the skill (defined as the
 * one who actually used the skill from the menu), and "b" to the target. But now,
 * there is "c", the character defined by ID1, and "d", the character defined by ID2,
 * which do not change based on which character selected the skill. These continue on
 * to "e" for ID3, "f" for ID4, all the way up to "l".
 *
 * If Game_Actor.icon() is defined, it will show an icon of each user of the skill.
 * Otherwise, it will show the characters' names, which can get kind of unweildy.
 * Game_Actor.icon() is not defined in here.
 *
 * The component skills of the actors can use any sort of cost you can dream of, even
 * those defined with other plugins. However, and this is important, certain "universal"
 * costs must ONLY be defined for at most one character in the tech! Universal costs
 * are those not tied to a specific actor, like items, gold, Yanfly's Party Limit gauge,
 * and so on. You can use multiple universal costs, but each cost can only be used by
 * one character. Non-universal costs (such as HP, MP, or TP) are perfectly valid
 * for multiple characters to use.
 *
 * Teaching a multitech skill to someone other than those defined in the Dual tag will
 * cause the user to be treated as a member of the multitech, but without having to
 * define a component (the user will spend the costs associated with the multitech).
 * However, it will only work with the user. (Example: If the Dual tag lists Joe and Bob,
 * but Alice learns the tech, then Alice can use it as a triple tech. However, Joe
 * and Bob would not be able to use it while keeping Alice as a part of it.)
 *
 * If you define the dualtech as a component for itself for any actor, then you drop
 * the dependency on another skill and instead use the costs and restrictions defined
 * to the dualtech. One or both characters may be set this way. It is not recommended to
 * set a skill as a component to itself for any actor if the user of the skill is not,
 * itself, defined in the dual tag.
 *
 * If a different skill is listed as the component, the MP and other associated costs
 * of the dualtech skill will be ignored (but not its restrictions).
 *
 * It is not required that all members of the tech learn the tech itself - if Joe and Bob
 * have a dualtech, you can teach it only to Joe and it will still work. However, Bob will
 * not be able to initiate the dualtech. Bob must still learn his component skill either way,
 * though.
 *
 * This does not define animations for the characters; only the user will animate. If you
 * are using side-view battles, it is recommended you use a plugin that allows for such
 * animations, such as Yanfly's Action Sequence plugins.
 *
 * Choosing to use a dualtech will normally only use up the turn of the character who uses 
 * the skill. However, under certain Yanfly battle systems, you may "link" characters' turns
 * together so that the skill will use up everyone's turn, and only activate when the last
 * character involved gets his or her turn. To do this, make the first parameter "linked".
 *
 * <Dual:linked,1,Move1,2,Move2>
 *
 * The compatible battle systems are ATB and CTB, and DTB if and only if BattleStatusWindow
 * is installed and the option of using Left/Right or Page Up/Page Down to switch between
 * actors is turned on. In that case, the behavior will change slightly (BattleStatusWindow
 * normally starts the turn automatically when you input an action for the user on the far
 * right, regardless of whether the other actors have selected moves. With this plugin
 * installed, that will no longer be the case; it will only start the turn when either ALL
 * actors have been given actions, or when right is pressed on the far right actor. This was
 * mainly done for compatibility purposes, but I do personally find it intuitive anyway.)
 *
 * Under CTB and ATB, linked dualtechs will postpone until all actors have their turn (if
 * any actor is prevented from acting in any way, the dualtech will cancel.) They will then
 * proceed as normal.
 *
 * Under Battle Status Window DTB, selecting a linked dualtech will cancel any pending
 * actions (including other dualtechs) for the involved actors; the dualtech can be the
 * only normal action the actors use in their turn.
 *
 * Dualtechs are not compatible with enemy battlers.
 *
 * This is compatible with Yanfly's Skill Core plugin v. 1.01 and up, as well as any other
 * plugins that affect the skill cost that follow the recommendation below. Please
 * place this plugin after all such plugins in your plugin list.
 * 
 * === NOTE TO OTHER PLUGIN WRITERS ===
 *
 * If you are writing a plugin that adds other sorts of skill costs or modifies the
 * display of the skill cost in any way, please have Window_SkillList.drawSkillCost
 * return the width of the remaining text area after drawing the cost of your skill
 * to maintain compatibility with this plugin.
 *
 * ====================================
 *
 * Version 3.1.3 - Fixed a bug where canceling a dualtech and then re-selecting it would
 *  crash the engine.
 *
 * Version 3.1.2 - Fixed a bug where magical skills would not show a chanting animation.
 *
 * Version 3.1.1 - Fixed an oversight that would cause a single actor to never
 *  get his or her turn.
 *
 * Version 3.1 - Turn linking implemented for Yanfly's Battle Status Window when
 *  using DTB and character switching is turned on. Also, smarter animations for
 *  turn-linked dualtechs.
 *
 * Version 3.0 - Turn linking implemented for Yanfly's ATB system. Also a few 
 *  minor changes for robustness.
 *
 * Version 2.0 - Turn linking implemented for Yanfly's CTB system.
 *
 * Version 1.1.2d - Bug fix.
 *
 * Version 1.1.2c - Better error reporting.
 *
 * Version 1.1.2b - Fixed a small bug in Cycle Actors.
 *
 * Version 1.1.2 - Should now display actor-context-sensitive costs (like percentage MP)
 *  correctly.
 *
 * Version 1.1.1b - Fixed a compatibility issue.
 *
 * Version 1.1.1 - Added "Display User with No Cost" parameter.
 *
 * Version 1.1 - You can now define up to 10 characters for a tech.
 *
 * Version 1.0.5d - Fixed an incompatibility issue with Bobstah's Battle Commands.
 *
 * Version 1.0.5c - Fixed a couple of minor issues for triple techs.
 *
 * Version 1.0.5b - Last version contained a clumsy bug that let actors use non-
 *  dualtech skills even when they have insufficient MP! Oops. Fixed that.
 *
 * Version 1.0.5 - Fixed another minor bug and added commands for determining which
 *  actor's Hit Rate to use for a skill.
 *
 * Version 1.0.4 - Fixed a minor bug and added a segment to the help file.
 *
 * Version 1.0.3 - Added the option to cycle between actors instead of displaying all
 *  of them at once.
 *
 * Version 1.0.2 - Fixed compatibility with Yanfly's Skill Core (and other similar
 *  plugins.)
 *
 * Version 1.0.1 - Fixed an issue where skills temporarily granted to an actor through
 *  Traits would not activate dualtechs.
 *
 * Version 1.0 - First version.
 *
 * ==== LEGAL STUFF ====
 * 
 * This version of the plugin is not free to use; please purchase before using.
 * Do not distribute or claim ownership.
 * When used, please credit Jason R. Godding in your project.
 * © Jason R. Godding, 2019
 * 
 */

Jay.Parameters = Jay.Parameters || {};
Jay.Parameters.Dualtechs = PluginManager.parameters('Jay_Dualtechs');

Jay.Param = Jay.Param || {};
Jay.Param.CycleActors = eval(Jay.Parameters.Dualtechs['Cycle Actors']);
Jay.Param.CycleLength = Number(Jay.Parameters.Dualtechs['Cycle Length']);
Jay.Param.AlwaysShowUser = eval(Jay.Parameters.Dualtechs['Always Display User']);

// Gets the dualtech data out of a skill's note tag.
Jay.Dualtechs.dualSkillData = function(dualData) {
	var dualParams = dualData.split(',');
	var returnParams = {};
	var len = dualParams.length;
    var linked = false;
    
    if(len === 0) {
        return returnParams;
    }
    
    if(dualParams[0].toLowerCase() === 'linked') {
        linked = true;
        len--;
    }

	if(len%2 === 0) { // Or, in other words, if the number of parameters is even
		returnParams.accType = 'user';
	}
	else {
		returnParams.accType = dualParams[len-1 + (linked ? 1 : 0)].trim();
		len--;
	}

	returnParams.actors = [];
	returnParams.skills = [];
    returnParams.linked = linked;

	for(var i=(linked ? 1 : 0); i < len; i += 2) {
		returnParams.actors.push(Number(dualParams[i]));
		if(isNaN(dualParams[i+1].trim())) {
            var parentSkills = $dataSkills.filter(function(skill) { 
				return skill !== null && skill.name === dualParams[i+1].trim(); 
				});
            if (parentSkills.length == 0) {
                throw "Could not find skill named " + dualParams[i+1];
            }
            else {
                returnParams.skills.push(parentSkills[0].id);
            }
		}
		else {
			returnParams.skills.push(Number(dualParams[i+1].trim()));
		}
	}

	return returnParams;
}

// Overrides the Window_SkillList.includes function so that dualtechs will
// only appear when the conditions are met - all actors are present and know
// their component skills.
Jay.Dualtechs.skillListIncludes = Window_SkillList.prototype.includes;
Window_SkillList.prototype.includes = function(item) {
	if(item.meta.Dual) {
		var dualParams = Jay.Dualtechs.dualSkillData(item.meta.Dual);

		for(var i=0; i<dualParams.actors.length; i++) {
			var actorId = dualParams.actors[i];
			var skillId = dualParams.skills[i];
			if ($gameParty.members().indexOf($gameActors.actor(actorId)) === -1) {
				return false;
			}
			if(!$gameActors.actor(actorId).skills().contains($dataSkills[skillId])) {
				return false;
			}
		}
	}

	return Jay.Dualtechs.skillListIncludes.call(this, item);
};

// Adds actor cycling to updateWindow.
Jay.Dualtechs.updateWindow = Window_SkillList.prototype.update;
Window_SkillList.prototype.update = function() {
	if(Jay.Param.CycleActors) {
        if (!this._cycleTimer) {
            this._cycleTimer = 0;
            this._cyclePhase = 0;
        }
        this._cycleTimer += 1;
        if(this._cycleTimer >= Jay.Param.CycleLength + 1) {
            this._cycleTimer = 1;
            this._cyclePhase += 1;
            if(this._cyclePhase >= 2520) {
                this._cyclePhase -= 2520;
            }
            this.refresh();
        }
    }
	Jay.Dualtechs.updateWindow.call(this);
}

// Adds in skill cost displays for dualtechs.
Jay.Dualtechs.drawSkillCost = Window_SkillList.prototype.drawSkillCost;
Window_SkillList.prototype.drawSkillCost = function(skill, x, y, width) {
	if(!skill.meta.Dual) {
		return this.drawNonDualSkillCost(this._actor, skill, x, y, width);
	}

	var dualParams = Jay.Dualtechs.dualSkillData(skill.meta.Dual);
	var actorCount = dualParams.actors.length;
	var endWidth = width;

	var userIsInTech = dualParams.actors.contains(this._actor.actorId());

	if(Jay.Param.CycleActors) {
		var oldEndWidth = endWidth;
		if(!userIsInTech) {
			actorCount++;
		}
        
        if(isNaN(this._cyclePhase)) {
            this._cyclePhase = 0;
        }
        
		var actorToShow = this._cyclePhase%actorCount;
		if(!userIsInTech) {
			actorToShow--;
		}
		if(!Jay.Param.AlwaysShowUser) {
			if(userIsInTech) {
				var userIndex = dualParams.actors.indexOf(this._actor.actorId());
				if(this.drawComponentSkillCost(this._actor,
					$dataSkills[dualParams.skills[userIndex]], Graphics.boxHeight, 0,
					endWidth) === endWidth) {
					actorToShow = this._cyclePhase%(actorCount - 1);
					if(actorToShow >= userIndex) {
						actorToShow++;
					}
				}
				
			}
			else {
				if(this.drawComponentSkillCost(this._actor, skill, Graphics.boxHeight, 0, 
					endWidth) === endWidth) {
					actorToShow = this._cyclePhase%(actorCount - 1);
				}
			}
		}
		if(actorToShow === -1) {
			endWidth = this.drawComponentSkillCost(this._actor, skill, x, y, endWidth);
		}
		else {
			endWidth = this.drawComponentSkillCost($gameActors.actor(dualParams.actors[actorToShow]),
				$dataSkills[dualParams.skills[actorToShow]], x, y, endWidth);
		}
	}
	else {
		for(var i=actorCount-1; i>=0; i--) {
			endWidth = this.drawComponentSkillCost($gameActors.actor(dualParams.actors[i]),
				$dataSkills[dualParams.skills[i]], x, y, endWidth);
		}
		if(!userIsInTech) {
			endWidth = this.drawComponentSkillCost(this._actor, skill, x, y, endWidth);
		}
	}

	return endWidth;
}

// Draws the skill cost for a non-dualtech skill.
Window_SkillList.prototype.drawNonDualSkillCost = function(actor, skill, x, y, width) {
	var tempActor = this._actor;
	this._actor = actor;

	var returnWidth = Jay.Dualtechs.drawSkillCost.call(this, skill, x, y, width);
		
	if (returnWidth === undefined) {
		if (this._actor.skillTpCost(skill) > 0) {
			returnWidth = width - this.textWidth(skill.tpCost);
		} else if (this._actor.skillMpCost(skill) > 0) {
			returnWidth = width - this.textWidth(skill.mpCost);
		} else {
			returnWidth = width;
		}
	}

	this._actor = tempActor;
		
	return returnWidth;
}

// Draws the skill cost for a component skill in a dualtech.
Window_SkillList.prototype.drawComponentSkillCost = function(actor, skill, x, y, width) {
	var endWidth = this.drawNonDualSkillCost(actor, skill, x, y, width);

	this.resetTextColor();

	if(endWidth === width && actor === this._actor && !Jay.Param.AlwaysShowUser) {
		return endWidth;
	}

	if(actor.icon) {
		this.drawIcon(actor.icon(), x + endWidth - Window_Base._iconWidth - 2, y + 2);
		endWidth -= Window_Base._iconWidth + 10;
	}
	else {
		if(endWidth === width) {
			this.drawText(actor.name(), x, y, endWidth, 'right');
			endWidth -= this.textWidth(" " + actor.name());
		}
		else {
			this.drawText(actor.name() + ":", x, y, endWidth, 'right');
			endWidth -= this.textWidth(" " + actor.name() + ":");
		}
	}

	return endWidth;
}

// Determines if an actor is preparing a dualtech, and therefore cannot act
// until the dualtech is complete or interrupted.
Game_Actor.prototype.isPreparingDualtech = function() {
    if(((BattleManager.isCTB && BattleManager.isCTB()) ||
        (BattleManager.isATB && BattleManager.isATB()))
        && this.dualtech && this.dualtech > 0) {
        return true;
    }
    return false;
}

// Adds checking for all actors' skill requirements in a dualtech.
Jay.Dualtechs.meetsSkillConditions = Game_BattlerBase.prototype.meetsSkillConditions;
Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
	if(skill.meta.Dual) {	
		if (this.isEnemy()) {
			return false;
		}

		var dualParams = Jay.Dualtechs.dualSkillData(skill.meta.Dual);

		var actorList = $gameParty.members();
		var testedUser = false;

		for(var i=0; i<dualParams.actors.length; i++) {
			var actor = $gameActors.actor(dualParams.actors[i]);
			if(actorList.indexOf(actor) === -1) {
				return false;
			}
			if(!Jay.Dualtechs.meetsSkillConditions.call(actor, $dataSkills[dualParams.skills[i]])) {
				return false;
			}
			if(this === actor) {
				testedUser = true;
                
                // Needs to check if this actor can use the skill for all reasons, including those
                // from other plugins, EXCEPT skill costs. So canPaySkillCost gets temporarily
                // replaced with a dummy function and then gets set back. A bit hackish, but
                // it gets the job done.
                var standardSkillCostFunction = Game_BattlerBase.prototype.canPaySkillCost;
                Game_BattlerBase.prototype.canPaySkillCost = function(skill) { return true; }
                var meetsConditions = Jay.Dualtechs.meetsSkillConditions.call(this, skill);
                Game_BattlerBase.prototype.canPaySkillCost = standardSkillCostFunction;
                
				if(!meetsConditions) {
					return false;
				}
			}
            if(actor.isPreparingDualtech() && (actor.dualtech != skill.id || actor.dualtechUser != this.actorId())) {
                return false;
            }
		}
		
		if(testedUser) {
			return true;
		}
	}

	return Jay.Dualtechs.meetsSkillConditions.call(this, skill);
}

// Adds the ability to apply skill costs to all actors in a dualtech.
Jay.Dualtechs.paySkillCost = Game_BattlerBase.prototype.paySkillCost;
Game_BattlerBase.prototype.paySkillCost = function(skill) {
	if(skill.meta.Dual) {	
		var dualParams = Jay.Dualtechs.dualSkillData(skill.meta.Dual);
		var userPaid = false;
		
		for(var i=0; i<dualParams.actors.length; i++) {
			Jay.Dualtechs.paySkillCost.call($gameActors.actor(dualParams.actors[i]),
				$dataSkills[dualParams.skills[i]]);
			if(this === $gameActors.actor(dualParams.actors[i])) {
				userPaid = true;
			}
		}
		
		if(userPaid) {
			return;
		}
	}
	
	Jay.Dualtechs.paySkillCost.call(this, skill);
}

// Adds the ability to call actors with "c", "d", "e", etc. in a dualtech's
// damage formula.
Jay.Dualtechs.evalDamageFormula = Game_Action.prototype.evalDamageFormula;
Game_Action.prototype.evalDamageFormula = function(target) {
	if(!this.item().meta.Dual) {
		return Jay.Dualtechs.evalDamageFormula.call(this, target);
	}
	try {
		var item = this.item();
		var dualParams = Jay.Dualtechs.dualSkillData(item.meta.Dual);
		var c = $gameActors.actor(dualParams.actors[0]);
		var d = $gameActors.actor(dualParams.actors[1]);
		var e = $gameActors.actor(dualParams.actors[2]);
		var f = $gameActors.actor(dualParams.actors[3]);
		var g = $gameActors.actor(dualParams.actors[4]);
		var h = $gameActors.actor(dualParams.actors[5]);
		var i = $gameActors.actor(dualParams.actors[6]);
		var j = $gameActors.actor(dualParams.actors[7]);
		var k = $gameActors.actor(dualParams.actors[8]);
		var l = $gameActors.actor(dualParams.actors[9]);
		var a = this.subject();
		var b = target;
		var v = $gameVariables._data;
		var sign = ([3, 4].contains(item.damage.type) ? -1 : 1);
		return Math.max(eval(item.damage.formula), 0) * sign;
	} 
	catch (e) {
		return 0;
	}
}

// Determines the hit rate of dualtechs.
Game_Action.prototype.itemHit = function(target) {
	if (this.isPhysical()) {
		var hitRate = this.subject().hit;
		if (this.item().meta.Dual) {
			var dualParams = Jay.Dualtechs.dualSkillData(this.item().meta.Dual);
			switch (dualParams.accType) {
			case "user":
				hitRate = this.subject().hit;
				break;
			case "first":
			case "actor1":
				hitRate = $gameActors.actor(dualParams.actors[0]).hit;
				break;
			case "second":
			case "actor2":
				hitRate = $gameActors.actor(dualParams.actors[1]).hit;
				break;
			case "actor3":
				hitRate = $gameActors.actor(dualParams.actors[2]).hit;
				break;
			case "actor4":
				hitRate = $gameActors.actor(dualParams.actors[3]).hit;
				break;
			case "actor5":
				hitRate = $gameActors.actor(dualParams.actors[4]).hit;
				break;
			case "actor6":
				hitRate = $gameActors.actor(dualParams.actors[5]).hit;
				break;
			case "actor7":
				hitRate = $gameActors.actor(dualParams.actors[6]).hit;
				break;
			case "actor8":
				hitRate = $gameActors.actor(dualParams.actors[7]).hit;
				break;
			case "actor9":
				hitRate = $gameActors.actor(dualParams.actors[8]).hit;
				break;
			case "actor10":
				hitRate = $gameActors.actor(dualParams.actors[9]).hit;
				break;
			case "higher":
			case "highest":
			case "max":
				for(var i=0; i<dualParams.actors.length; i++) {
					var newHitRate = $gameActors.actor(dualParams.actors[i]).hit;
					if (newHitRate > hitRate) {
						hitRate = newHitRate;
					}
				}
				break;
			case "lower":
			case "lowest":
			case "min":
				for(var i=0; i<dualParams.actors.length; i++) {
					var newHitRate = $gameActors.actor(dualParams.actors[i]).hit;
					if (newHitRate < hitRate) {
						hitRate = newHitRate;
					}
				}
				break;
			}
		}
		return this.item().successRate * 0.01 * hitRate;
	} else {
		return this.item().successRate * 0.01;
	}
};

// All functions from here on out relate to turn linking functionality.
// Outside certain Yanfly battle systems, these are meaningless.
if (Imported.YEP_BattleEngineCore) {
    
    Jay.Dualtechs.BattleManager_startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function() {
        Jay.Dualtechs.BattleManager_startBattle.call(this);
        for(var i = 1; $gameActors.actor(i); i++) {
            $gameActors.actor(i).dualtech = 0;
            $gameActors.actor(i).dualtechUser = 0;
        }
    };
    
    Game_Battler.prototype.cancelDualtech = function() {
        if(this.dualtech > 0) {
            var dualtechUser = $gameActors.actor(this.dualtechUser);
            if (dualtechUser !== this) {
                dualtechUser.cancelDualtech();
                return;
            }
            
            var dualtechSkill = $dataSkills[this.dualtech];
            var dualParams = Jay.Dualtechs.dualSkillData(dualtechSkill.meta.Dual);
            
            for(var i=0; i<dualParams.actors.length; i++) {
                var actor = $gameActors.actor(dualParams.actors[i]);
                actor.dualtech = 0;
                
                if (actor.dualtechReady && actor.resetAllATB) {
                    actor.resetAllATB();
                }
                
                actor.dualtechReady = false;
                actor.dualtechUser = 0;
                actor.dualtechChanting = false;
                actor.requestStatusRefresh();
            }
            
            this.dualtech = 0;
            this.dualtechReady = false;
            this.dualtechUser = 0;
            this.dualtechReadyCount = 0;
            this.dualtechExpected = 0;
            this.dualtechChanting = false;
            this.requestStatusRefresh();
        }
    };
    
    Game_Battler.prototype.setupDualtech = function(skill) {
        var dualParams = Jay.Dualtechs.dualSkillData(skill.meta.Dual);
            
        if(this.dualtech > 0 && (this.dualtech != skill.id || this.dualtechUser != this.actorId())) {
            this.resolveDoubleDualtechs();
            throw "Somehow, two dualtechs are active on the same actor at once.";
        }
            
        this.dualtech = skill.id;
        this.dualtechUser = this.actorId();
        this.dualtechReadyCount = 1;
        this.dualtechExpected = 1;
        this.dualtechChanting = $dataSystem.magicSkills.contains(skill.styleId);
        this.requestStatusRefresh();
            
        for(var i=0; i<dualParams.actors.length; i++) {
            var actor = $gameActors.actor(dualParams.actors[i]);
            if(actor.dualtech > 0 && (actor.dualtech != skill.id || actor.dualtechUser != this.actorId())) {
                actor.resolveDoubleDualtechs();
            }
                
            if(actor != this) {
                this.dualtechExpected++;
                actor.cancelExistingSkill();
            }
                
            actor.dualtech = skill.id;
            actor.dualtechReady = false;
            actor.dualtechUser = this.actorId();
            var subSkill = $dataSkills[dualParams.skills[i]];
            actor.dualtechChanting = $dataSystem.magicSkills.contains(subSkill.stypeId);
            actor.requestStatusRefresh();
        }
            
        this.dualtechReady = true;
    }
    
    Jay.Dualtechs.isChanting = Game_Battler.prototype.isChanting;
    Game_Battler.prototype.isChanting = function() {
        if (this.dualtechChanting) {
            return true;
        }
        else {
            return Jay.Dualtechs.isChanting.call(this);
        }
    }
    
    Game_Battler.prototype.resolveDoubleDualtechs = function() {
        // This "if" statement might seem redundant, but the compiler complained when I 
        // didn't have it. Even an "if (true)" caused the complaints.
        if(this.dualtech > 0 && (this.dualtech != skill.id || this.dualtechUser != this.actorId())) {
            throw "Somehow, two dualtechs are active on the same actor at once.";
        }
    }
    
    Game_Battler.prototype.cancelExistingSkill = function() {
        // Deliberate no-op
    }

// Counter Time Battle
if (Imported.YEP_X_BattleSysCTB) {
    
    Jay.Dualtechs.BattleManager_startCTBInput = BattleManager.startCTBInput;
    BattleManager.startCTBInput = function(battler) {
        if(battler.isActor() && battler.isPreparingDualtech()) {
            var dualtechUser = $gameActors.actor(battler.dualtechUser);
            
            if(!battler.dualtechReady) {
                battler.dualtechReady = true;
                dualtechUser.dualtechReadyCount++;
            }
            
            if (!dualtechUser.meetsSkillConditions($dataSkills[dualtechUser.dualtech])) {
                dualtechUser.cancelDualtech();
                Jay.Dualtechs.BattleManager_startCTBInput.call(this, battler);
            }
            else if(dualtechUser.dualtechReadyCount >= dualtechUser.dualtechExpected) {
                dualtechUser.dualtechReady = false;
                Jay.Dualtechs.GameBattler_setupCTBCharge.call(dualtechUser);
            }
            
            return;
        }
        Jay.Dualtechs.BattleManager_startCTBInput.call(this, battler);
    };
    
    Jay.Dualtechs.GameBattler_setupCTBCharge = Game_Battler.prototype.setupCTBCharge;
    Game_Battler.prototype.setupCTBCharge = function() {
        var item = this.currentAction().item();
        if(this.currentAction().isSkill() && item.meta.Dual) {
            var dualParams = Jay.Dualtechs.dualSkillData(item.meta.Dual);
            
            if(!dualParams.linked) {
                Jay.Dualtechs.GameBattler_setupCTBCharge.call(this);
                return;
            }
        
            this.setupDualtech(item);
            
            this.setCTBCharging(true);
            this.setActionState('waiting');
            
            return;
        }
        Jay.Dualtechs.GameBattler_setupCTBCharge.call(this);
    };
    
    Jay.Dualtechs.GameBattler_updateCTB = Game_Battler.prototype.updateCTB;
    Game_Battler.prototype.updateCTB = function() {
        if(this.dualtech > 0 && this.dualtechReady) {
            if(this.dualtechUser != this.actorId()) {
                return;
            }
            
            if(!this.meetsSkillConditions($dataSkills[this.dualtech])) {
                this.cancelDualtech();
                Jay.Dualtechs.GameBattler_updateCTB.call(this);
            }
            
            if(this.dualtechReadyCount >= this.dualtechExpected) {
                Jay.Dualtechs.GameBattler_setupCTBCharge.call(this);
            }
            
            return;
        }
        Jay.Dualtechs.GameBattler_updateCTB.call(this);
    };
    
    Jay.Dualtechs.BattleManager_isBattlerCTBReady = BattleManager.isBattlerCTBReady;
    BattleManager.isBattlerCTBReady = function(battler) {
        if(battler.dualtechReady) return false;
        return Jay.Dualtechs.BattleManager_isBattlerCTBReady.call(this, battler);
    };
    
    Jay.Dualtechs.BattleManager_endCTBAction = BattleManager.endCTBAction;
    BattleManager.endCTBAction = function() {
        Jay.Dualtechs.BattleManager_endCTBAction.call(this);
        
        if (this._action.isSkill() && this._action.item().meta.Dual) {
            var dualParams = Jay.Dualtechs.dualSkillData(this._action.item().meta.Dual);
            
            if(dualParams.linked) {
                for(var i=0; i<dualParams.actors.length; i++) {
                    var actor = $gameActors.actor(dualParams.actors[i]);
                    if(actor.dualtechReady) {
                        actor.endTurnAllCTB();
                    }
                }
            
                this._subject.cancelDualtech();
            }
        }
    };
    
    // Partially reuses code from YEP_X_BattleSysCTB
    Game_Unit.prototype.increaseTurnTimeBasedCTB = function() {
        for (var i = 0; i < this.members().length; ++i) {
            var member = this.members()[i];
            if (!member) continue;
            if (member.isDead()) continue;
            if (member.isHidden()) continue;
            if (member.canMove()) continue;
            if (member.dualtech > 0 && member.dualtechReady) continue;
            member.onTurnEnd();
        }
    };
    
    // Partially reuses code from YEP_X_BattleSysCTB
    BattleManager.ctbTurnOrder = function() {
        var livingBattlers = $gameParty.aliveMembers().concat($gameTroop.aliveMembers());
        var battlers = [];
    
        for(var i=0; i<livingBattlers.length; i++) {
            if(livingBattlers[i].isActor() && livingBattlers[i].dualtech > 0 && livingBattlers[i].dualtechReady) {
                continue;
            }
            battlers.push(livingBattlers[i]);
        }
    
        battlers.sort(function(a, b) {
            if (a.ctbTicksToReady() > b.ctbTicksToReady()) return 1;
            if (a.ctbTicksToReady() < b.ctbTicksToReady()) return -1;
            return 0;
        });
        return battlers;
    };
};

// Active Time Battle
if (Imported.YEP_X_BattleSysATB) {    

    Jay.Dualtechs.BattleManager_startATBInput = BattleManager.startATBInput;
    BattleManager.startATBInput = function(battler) {
        if(battler.isActor() && battler.isPreparingDualtech()) {
            var dualtechUser = $gameActors.actor(battler.dualtechUser);
            
            if(!battler.dualtechReady) {
                battler.dualtechReady = true;
                dualtechUser.dualtechReadyCount++;
            }
            
            if (!dualtechUser.meetsSkillConditions($dataSkills[dualtechUser.dualtech])) {
                dualtechUser.cancelDualtech();
                Jay.Dualtechs.BattleManager_startATBInput.call(this, battler);
            }
            else if(dualtechUser.dualtechReadyCount >= dualtechUser.dualtechExpected) {
                dualtechUser.dualtechReady = false;
                Jay.Dualtechs.GameBattler_setupATBCharge.call(dualtechUser);
            }
            
            return;
        }
        Jay.Dualtechs.BattleManager_startATBInput.call(this, battler);
    };
    
    Jay.Dualtechs.GameBattler_setupATBCharge = Game_Battler.prototype.setupATBCharge;
    Game_Battler.prototype.setupATBCharge = function() {
        var item = this.currentAction().item();
        if(this.currentAction().isSkill() && item.meta.Dual) {
            var dualParams = Jay.Dualtechs.dualSkillData(item.meta.Dual);
            
            if(!dualParams.linked) {
                Jay.Dualtechs.GameBattler_setupATBCharge.call(this);
                return;
            }
        
            this.setupDualtech(item);
            
            this.setATBCharging(true);
            this.setActionState('waiting');
            
            return;
        }
        Jay.Dualtechs.GameBattler_setupATBCharge.call(this);
    };
    
    Jay.Dualtechs.GameBattler_updateATB = Game_Battler.prototype.updateATB;
    Game_Battler.prototype.updateATB = function() {
        if(this.dualtech > 0 && this.dualtechReady) {
            if(this.dualtechUser != this.actorId()) {
                return;
            }
            
            if(!this.meetsSkillConditions($dataSkills[this.dualtech])) {
                this.cancelDualtech();
                Jay.Dualtechs.GameBattler_updateATB.call(this);
            }
            
            if(this.dualtechReadyCount >= this.dualtechExpected) {
                Jay.Dualtechs.GameBattler_setupATBCharge.call(this);
            }
            
            return;
        }
        Jay.Dualtechs.GameBattler_updateATB.call(this);
    };
    
    Jay.Dualtechs.BattleManager_isBattlerATBReady = BattleManager.isBattlerATBReady;
    BattleManager.isBattlerATBReady = function(battler) {
        if(battler.dualtechReady) return false;
        return Jay.Dualtechs.BattleManager_isBattlerATBReady.call(this, battler);
    };

    Jay.Dualtechs.BattleManager_endATBAction = BattleManager.endATBAction;
    BattleManager.endATBAction = function() {
        Jay.Dualtechs.BattleManager_endATBAction.call(this)
    
    
        if (this._action.isSkill() && this._action.item().meta.Dual) {
            var dualParams = Jay.Dualtechs.dualSkillData(this._action.item().meta.Dual);
            
            if(dualParams.linked) {
                for(var i=0; i<dualParams.actors.length; i++) {
                    var actor = $gameActors.actor(dualParams.actors[i]);
                    if(actor.dualtechReady) {
                        actor.endTurnAllATB();
                    }
                }
            
                this._subject.cancelDualtech();
            }
        }
    };
};

if (Imported.YEP_BattleStatusWindow) {
    
    // Show the dualtech icons regardless of battle system if this plugin
    // is installed. Just looks nicer.
    Jay.Dualtechs.drawActorActionIcon = Window_Base.prototype.drawActorActionIcon;
    Window_Base.prototype.drawActorActionIcon = function(actor, wx, wy) {
        if (actor.dualtech) {
            icon = $dataSkills[actor.dualtech].iconIndex;
            this.drawIcon(icon, wx + 2, wy + 2);
        }
        else {
            Jay.Dualtechs.drawActorActionIcon.call(this, actor, wx, wy);
        }
    }
};

// Default Turn Battle... but not exactly default, because this only works with BattleStatusWindow
// installed, and actor switching is activated.
if (Imported.YEP_BattleStatusWindow && Yanfly.Param.BECSystem == 'dtb' && (Yanfly.Param.BSWLfRt || Yanfly.Param.BSWPageUpDn)) {
    
    // The old version is still used for pressing right, but for all
    // other cases, we need to skip actors with pending dualtechs.
    BattleManager.selectRightCommand = BattleManager.selectNextCommand;
    BattleManager.selectNextCommand = function() {
        var actorsChecked = 0;
        do {
            if (!this.actor() || !this.actor().selectNextCommand()) {
                this.changeActor(this._actorIndex + 1, 'waiting');
                if (this._actorIndex >= $gameParty.size()) {
                    this.changeActor(0, 'waiting');
                }
                if((!this.actor().canInput() || this.actor().hasACurrentAction()) && ++actorsChecked >= $gameParty.size()) {
                    this.startTurn();
                    break;
                }
            }
        } while (!this.actor().canInput() || this.actor().hasACurrentAction());
    };
    
    Game_Actor.prototype.hasACurrentAction = function() {
        if ((this.currentAction() && this.currentAction().item()) || this.dualtech > 0) return true;
        return false;
    }
    
    Game_Actor.prototype.removeCurrentAction = function() {
        if (this.dualtechUser == this.actorId()) {
            this.cancelDualtech();
        }
		this.dualtechUser = 0;
        
        Game_Battler.prototype.removeCurrentAction.call(this);
    };
    
    Game_Battler.prototype.resolveDoubleDualtechs = function() {
        var dualtechUser = $gameActors.actor(this.dualtechUser);
        dualtechUser.removeCurrentAction();
    }
    
    Game_Battler.prototype.cancelExistingSkill = function() {
        this.removeCurrentAction();
    }
    
    Jay.Dualtechs.SceneBattle_onSelectAction = Scene_Battle.prototype.onSelectAction;
    Scene_Battle.prototype.onSelectAction = function() {
        this.applyDualtech();
        Jay.Dualtechs.SceneBattle_onSelectAction.call(this);
    }
    
    Scene_Battle.prototype.applyDualtech = function() {
        var actor = BattleManager.actor();
        var skill = this._skillWindow.item();
        if (!actor || !skill) return;
        
        this.cancelExistingDualtech();
        
        if (skill.meta.Dual) {
            var dualParams = Jay.Dualtechs.dualSkillData(skill.meta.Dual);
            
            if (dualParams.linked) {
                BattleManager.actor().setupDualtech(skill);
                this._isSettingDuatech = true;
            }
        }
    }
    
    Scene_Battle.prototype.cancelExistingDualtech = function() {
        var actor = BattleManager.actor();
        if (!actor) return;
        
        if (actor.hasACurrentAction() && actor.dualtech > 0) {
            var dualtechUser = $gameActors.actor(actor.dualtechUser);
            dualtechUser.cancelDualtech();
            
            if (dualtechUser !== actor) {
                dualtechUser.removeCurrentAction();
            }
        }
    }

    Jay.Dualtechs.SceneBattle_clearInputtingAction = Scene_Battle.prototype.clearInputtingAction;
    Scene_Battle.prototype.clearInputtingAction = function() {
        var actor = BattleManager.actor();
        if (actor.dualtech > 0) {
            var dualtechUser = $gameActors.actor(actor.dualtechUser);
            dualtechUser.removeCurrentAction();
			dualtechUser.makeActions();
        }
        else {
            Jay.Dualtechs.SceneBattle_clearInputtingAction.call(this);
        }
    }
    
    Jay.Dualtechs.SceneBattle_selectNextCommand = Scene_Battle.prototype.selectNextCommand;
    Scene_Battle.prototype.selectNextCommand = function() {
        if (!this._isSettingDuatech) {
            this.cancelExistingDualtech();
        }
        Jay.Dualtechs.SceneBattle_selectNextCommand.call(this);
        this._isSettingDuatech = false;
    }
    
    // Partially reuses code from YEP_BattleStatusWindow
    Scene_Battle.prototype.selectRightCommand = function() {
        if (!this.isAllowRightCommand()) {
            return this._actorCommandWindow.activate();
        }
        if (Imported.YEP_BattleEngineCore && BattleManager.isTickBased()) {
            if (BattleManager.actor()) BattleManager.actor().onTurnStart();
        }
        BattleManager.selectRightCommand();
        this.changeInputWindow();
    };
    
    Jay.Dualtechs.processCancel = Window_ActorCommand.prototype.processCancel;
    Window_ActorCommand.prototype.processCancel = function() {
        var actor = this._actor;
        if (actor && actor.dualtech > 0) {
            var dualtechUser = $gameActors.actor(actor.dualtechUser);
            dualtechUser.removeCurrentAction();
        }
        Jay.Dualtechs.processCancel.call(this);
    }
};

};