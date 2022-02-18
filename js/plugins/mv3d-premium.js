/*:
@plugindesc Premium features for MV3D
version 0.6.2
@author Dread/Nyanak
@help

This version of the MV3D premium plugin was sold on [itch.io]. If
you have not purchased this plugin, please do not use it.  
You can also subscribe on [Patreon].  

[itch.io]:https://cutievirus.itch.io/mv3d
[Patreon]:https://www.patreon.com/cutievirus

For documentation, please see the [wiki].

[wiki]:https://mv3d.cutievirus.com/documentation




@param shadow
@text Light & Shadow

@param dynShadowEnabled
@text Use Dynamic Shadows
@parent shadow
@type Boolean
@default true

@param defShadowQuality
@text Default Shadow Quality
@parent shadow
@type combo
@option OFF
@option LOW
@option MEDIUM
@option HIGH
@default MEDIUM

@param shadowQualityOptionName
@text Shadow Quality Option Name
@desc symbol name: mv3d-dynShadow
@parent shadow
@type Text
@default Shadow Quality

@param softShadows
@text Soft Shadows
@parent shadow
@type Boolean
@default true

@param abnormal
@text Cross Normals Face Up
@desc Removes the darkness on fence and cross back faces.
@parent shadow
@type Boolean
@default true

@param dynamicNormals
@text Dynamic Normals
@desc Characters won't be shaded when facing away from the sun.
@parent shadow
@type Boolean
@default true

@param postProcessing
@text Post-Processing and Effects

@param alphaFog
@text Alpha Fog
@parent postProcessing
@desc How far the alpha fog will reach. 0=off, 1=full
@type Number
@decimals 4
@min 0 @max 1
@default 0.1

@param glow
@text Glow Effect
@parent postProcessing
@desc The intensity of the glow effect.
@type Combo
@option Off
@option 0.5
@option 1.0
@option 2.0
@default 1.0

@param glowRadius
@text Glow Radius
@parent postProcessing
@desc The size of the glow effect.
@type Number
@decimals 0
@min 0
@default 48
*/!function(e){var t={};function o(a){if(t[a])return t[a].exports;var n=t[a]={i:a,l:!1,exports:{}};return e[a].call(n.exports,n,n.exports,o),n.l=!0,n.exports}o.m=e,o.c=t,o.d=function(e,t,a){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(o.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)o.d(a,n,function(t){return e[t]}.bind(null,n));return a},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=0)}([function(e,t,o){window.mv3d.premium="premium",o(1)},function(e,t,o){"use strict";o.r(t);o(2),o(3),o(4),o(5),o(6),o(7),o(8),o(9),o(10)},function(e,t){const o=window.mv3d,{booleanString:a}=o.util,n=PluginManager.parameters(`mv3d-${o.premium}`);var s,r,i;Object.assign(o,{DYNAMIC_SHADOWS:a(n.dynShadowEnabled),DEFAULT_SHADOW_QUALITY:Math.max(0,["OFF","LOW","MEDIUM","HIGH"].indexOf(n.defShadowQuality.toUpperCase())),SOFT_SHADOWS:a(n.softShadows),DYNAMIC_SHADOW_RES:1024,OPTION_NAME_DYNAMIC_SHADOWS:(s="shadowQualityOptionName",r="Shadow Quality",i=String,s in n?i?i(n[s]):n[s]:r),ABNORMAL:a(n.abnormal),DYNAMIC_NORMALS:a(n.dynamicNormals),ALPHA_FOG:Number(n.alphaFog),AMBIENT_OCCLUSION:a(n.ambientOcclusion),GLOW:Number(o.util.booleanNumber(n.glow)),GLOW_RADIUS:Number(n.glowRadius)})},function(e,t){const o=window.mv3d,{MaterialHelper:a}=BABYLON;o.getDepthMap=function(e=o.camera){const t=e.getScene().enableDepthRenderer(e),a=t.getDepthMap();return a.mv3d_modded?a:(t._mv3d_modDepthRenderer(),a.mv3d_modded=!0,a)},BABYLON.DepthRenderer.prototype._mv3d_modDepthRenderer=function(){const e=this._depthMap.customRenderFunction;this._depthMap.customRenderFunction=(t,o,a,n)=>{e(t,o,[],n),e([],a,[],[])},this._depthMap.getCustomRenderList=()=>this._camera.getActiveMeshes().data,this._depthMap.mv3d_modded=!0};const n=BABYLON.ShadowGenerator.prototype._renderSubMeshForShadowMap;BABYLON.ShadowGenerator.prototype._renderSubMeshForShadowMap=function(e){const t=e.getMaterial();t&&!t.mv3d_noShadow&&n.apply(this,arguments)}},function(e,t){const o=window.mv3d;class View{constructor(e,t){let a;e instanceof HTMLCanvasElement?a={}:(a=e,t||(t=a.camera),(e=a.canvas)||(e=document.createElement("canvas")),e.width||(e.width=a.width||Graphics.width),e.height||(e.height=a.height||Graphics.height)),this.canvas=e,this.camera=t,this.view=o.engine.registerView(e,t),this.texture=PIXI.Texture.fromCanvas(e),this.texture.baseTexture.scaleMode=PIXI.SCALE_MODES.NEAREST,this.sprite=new PIXI.Sprite(this.texture),this.index=a.index||0,View.list.push(this),View.sort(),this.enabled=!0,this.needsRender=null}updateSize(){this.canvas.width=o.canvas.width,this.canvas.height=o.canvas.height,this.sprite.scale.copy(o.pixiSprite.scale)}disable(){this.enabled=!1,this.sprite.visible=!1}enable(){this.enabled=!0,this.sprite.visible=!0}static sort(){View.list.sort(View._sortAbs).sort(View._sortNeg)}static _sortFunction(e,t){return Math.abs(t)-Math.abs(e)}}View._sortAbs=(e,t)=>Math.abs(t.index)-Math.abs(e.index),View._sortNeg=(e,t)=>(e,t)=>e.index<0&&t.index>=0?-1:0,View.list=[],o.View=View;const a=Spriteset_Map.prototype.createTilemap;Spriteset_Map.prototype.createTilemap=function(){o.callFeatures("createViews"),a.apply(this,arguments);const e=o.viewContainer,t=e.children.indexOf(o.pixiSprite);for(view of View.list)e.addChildAt(view.sprite,view.index<0?t:t+1)},o.renderViews=function(){if(!View.list.length)return;const e=o.canvas.width,t=o.canvas.height,a=o.scene.activeCamera;for(const e of View.list){if(!e.enabled)continue;if(null!=e.needsRender){if(!e.needsRender)continue;e.needsRender=!1}const t=e.canvas,n=t.getContext("2d");if(!n)continue;e.updateSize();const s=e.camera||a;o.scene.activeCamera=s,o.canvas.width=t.width,o.canvas.height=t.height,o.scene.render(),n.clearRect(0,0,t.width,t.height),n.drawImage(o.canvas,0,0),e.texture.update()}o.canvas.width=e,o.canvas.height=t,o.scene.activeCamera=a};const n=o.render;o.render=function(){o.renderViews(),n.apply(this,arguments)}},function(e,t){const o=window.mv3d,{util:a,Feature:n,Blender:s,ColorBlender:r}=o,{makeColor:i}=a,{TransformNode:d,DirectionalLight:l,ShadowGenerator:u,Vector3:c,Mesh:h}=window.BABYLON;new n("dynamicShadows",{resizeShadowMap(e){o.shadowGenerator._mapSize=e,o.shadowGenerator.recreateShadowMap()},setup(){o.sunNode=new d("sunNode",o.scene),o.sunlight=new l("sunlight",new c(0,-1,0),o.scene),o.sunlight.renderPriority=10,o.sunlight.parent=o.sunNode,o.sunlight.specular.set(0,0,0),o.shadowGenerator=new u(o.DYNAMIC_SHADOW_RES,o.sunlight),o.shadowGenerator.transparencyShadow=!0,o.shadowGenerator.usePercentageCloserFiltering=o.SOFT_SHADOWS,o.blendSunYaw=new s("sunYaw",45),o.blendSunYaw.cycle=360,o.blendSunPitch=new s("sunPitch",45),o.blendSunPitch.cycle=360,o.blendSunColor=new r("sunColor",16777215),w()},update(){o.sunNode.position.copyFrom(o.cameraStick.position)},blend(e){e|o.blendSunYaw.update()|o.blendSunPitch.update()|o.blendSunColor.update()&&(o.sunNode.yaw=o.blendSunYaw.currentValue(),o.sunNode.pitch=o.blendSunPitch.currentValue(),o.sunlight.diffuse.set(...o.blendSunColor.currentComponents()),this.updateEnabled())},updateEnabled(){o.blendSunColor.currentValue()?o.sunlight.isEnabled()||o.sunlight.setEnabled(!0):o.sunlight.isEnabled()&&o.sunlight.setEnabled(!1)},clearMap(){o.shadowGenerator.getShadowMap().renderList.splice(0,1/0)},createCellMesh(e){e.receiveShadows=!0,o.shadowGenerator.addShadowCaster(e)},destroyCellMesh(e){o.shadowGenerator.removeShadowCaster(e)},createCharMesh(e){-1===o.shadowGenerator.getShadowMap().renderList.indexOf(e)&&(e.receiveShadows=!0,o.shadowGenerator.addShadowCaster(e))},destroyCharMesh(e){o.shadowGenerator.removeShadowCaster(e)},updateParameters(){w(),this.updateEnabled()},applyMapSettings(e){"sunColor"in e&&o.blendSunColor.setValue(e.sunColor,0),"sunYaw"in e&&o.blendSunYaw.setValue(e.sunYaw,0),"sunPitch"in e&&o.blendSunPitch.setValue(e.sunPitch,0),this.updateEnabled()}},()=>o.DYNAMIC_SHADOWS);let p=o.DEFAULT_SHADOW_QUALITY;function w(){if(o.shadowGenerator.frustumEdgeFalloff=0,o.sunlight.shadowFrustumSize=2*o.RENDER_DIST,o.sunlight.shadowMinZ=-o.RENDER_DIST,o.sunlight.shadowMaxZ=o.RENDER_DIST,p){o.sunlight.shadowEnabled=!0;const e=Math.min(4096,24*o.RENDER_DIST*p);o.callFeature("dynamicShadows","resizeShadowMap",e),o.shadowGenerator.bias=6/e,o.shadowGenerator.normalBias=0}else o.sunlight.shadowEnabled=!1}o.DYNAMIC_SHADOWS&&(o.options["mv3d-dynShadow"]={name:o.OPTION_NAME_DYNAMIC_SHADOWS,values:["OFF","LOW","MEDIUM","HIGH"],default:o.DEFAULT_SHADOW_QUALITY,apply(e){p=e}}),o.DYNAMIC_SHADOWS&&Object.assign(o.PluginCommand.prototype,{sun(...e){var t=this._TIME(e[2]);switch(e[0].toLowerCase()){case"color":return void this._sunColor(e[1],t);case"yaw":return void this._sunYaw(e[1],t);case"pitch":return void this._sunPitch(e[1],t);case"angle":return t=this._TIME(e[3]),this._sunYaw(e[1],t),void this._sunPitch(e[2],t)}t=this._TIME(e[3]),this._sunColor(e[0],t),this._sunYaw(e[1],t),this._sunPitch(e[2],t)},_sunColor(e,t=1){o.blendSunColor.setValue(i(e).toNumber(),t)},_sunYaw(e,t=1){this._RELATIVE_BLEND(o.blendSunYaw,e,t)},_sunPitch(e,t=1){this._RELATIVE_BLEND(o.blendSunPitch,e,t)}}),o.DYNAMIC_SHADOWS&&Object.assign(o.mapConfigurationFunctions,{sun:new o.ConfigurationFunction("color[dir]yaw,pitch",(function(e,t){const{color:o,yaw:a,pitch:n}=t;o&&(e.sunColor=i(o).toNumber()),a&&(e.sunYaw=Number(a)),n&&(e.sunPitch=Number(n))}))});const b=[];Object.defineProperty(h.prototype,"mv3d_castShadows",{get(){return this._mv3d_castShadows},set(e){this._mv3d_castShadows=e;const t=b.indexOf(this);e?t<0&&b.push(this):t>=0&&b.splice(t,1)}}),Object.defineProperty(o.MeshGroup.prototype,"mv3d_castShadows",{get(){return this._mv3d_castShadows},set(e){this._mv3d_castShadows=e;for(const t of this.meshes)t.mv3d_castShadows=e}})},function(e,t){const o=window.mv3d,a=o.Feature,{Vector2:n,PostProcess:s}=window.BABYLON;new a("ambientOcclusion",{setup(){const e=new BABYLON.SSAORenderingPipeline("ssao",o.scene,{ssaoRatio:.5,combineRatio:1});e.fallOff=1e-6,e.area=1,e.radius=.03,e.totalStrength=1,e.base=.5,o.scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao",o.camera),o.ssao=e,o.getDepthMap(o.camera).resize(Graphics)}},()=>o.AMBIENT_OCCLUSION)},function(e,t){const o=window.mv3d,a=o.Feature,{Vector2:n,PostProcess:s}=window.BABYLON;new a("alphaFog",{setup(){this.alphaFog=new AlphaFogPostProcess("alphaFog",o.camera)},updateCameraMode(){const e=o.camera._postProcesses.indexOf(this.alphaFog);o.hasAlphaFog?e<0&&o.camera._postProcesses.push(this.alphaFog):e>=0&&o.camera._postProcesses.splice(e,1)}});const r=o.features.alphaFog.methods;Object.defineProperties(o,{hasAlphaFog:{get:()=>Boolean("ORTHOGRAPHIC"!==o.cameraMode&&o.ALPHA_FOG)},alphaFog:{get(){return this.ALPHA_FOG},set(e){this.ALPHA_FOG=e,r.updateCameraMode(),o.updateClearColor()}}});class AlphaFogPostProcess extends s{constructor(e,t){super(e,"alphaFog",["alphaFog"],["depthMap"],1,t),this.depthMap=o.getDepthMap(t),this.depthMap.resize(Graphics),this.onApplyObservable.add(e=>{e.setTexture("depthMap",this.depthMap),e.setFloat("alphaFog",o.ALPHA_FOG)})}}BABYLON.Effect.ShadersStore.alphaFogPixelShader="\nvarying vec2 vUV;\nuniform sampler2D textureSampler;\nuniform sampler2D depthMap;\nuniform float alphaFog;\nvoid main(void) {\n\tgl_FragColor=texture2D(textureSampler,vUV).rgba;\n\tgl_FragColor.a *= min(1.0,(1.0-texture2D(depthMap,vUV).r)/alphaFog);\n\tgl_FragColor.rgb*=gl_FragColor.a;\n\t//gl_FragColor=texture2D(depthMap,vUV).rgba;\n}\n"},function(e,t){const o=window.mv3d,a=o.Feature,{Color4:n}=window.BABYLON;function s(e,t,o,a){const n=o.mv3d_glowColor;return n?(a.copyFrom(o.mv3d_glowColor),a.r*=n.a,a.g*=n.a,a.b*=n.a,a.a=n.a,a):(a.copyFrom(new BABYLON.Color4(0,0,0,0)),a)}new a("glowLayer",{setup(){o.glowLayer=new BABYLON.GlowLayer("glow",o.scene,{mainTextureRatio:.5,blurKernelSize:o.GLOW_RADIUS}),o.glowLayer.intensity=o.GLOW,o.glowLayer.customEmissiveColorSelector=s}},()=>o.GLOW)},function(e,t){const o=window.mv3d,{Feature:a,ConfigurationFunction:n,util:s}=o,{file:r,booleanString:i}=s,{MeshBuilder:d,StandardMaterial:l,CubeTexture:u,Color3:c,Vector3:h,Quaternion:p,FreeCamera:w,RenderTargetTexture:b,TransformNode:m}=window.BABYLON,f=BABYLON.Texture.SKYBOX_MODE;Object.defineProperties(o,{hasSkybox:{get:()=>Boolean(y())}}),new a("skybox",{createViews(){o.skyboxView||(o.skyboxCamera=new w("skyboxCamera",new h(0,0,0),this.scene),o.skyboxCamera.minZ=.1,o.skyboxCamera.maxZ=2,o.skyboxCamera.z=-1e3,o.skyboxView=new o.View({camera:o.skyboxCamera,index:-1}),o.skyboxView.disable()),this.createSkybox()},createSkybox(){o.hasSkybox&&!o.skybox&&(o.skybox=d.CreateBox("skybox",{size:1},o.scene),o.skybox.setEnabled(!1),o.skybox.isPickable=!1,o.skybox.material=new l("skybox",o.scene),o.skybox.material.backFaceCulling=!1,o.skybox.material.diffuseColor=c.Black(),o.skybox.material.specularColor=c.Black(),o.skybox.material.fogEnabled=!1,o.skybox.renderingGroupId=o.enumRenderGroups.BACK,o.skyboxNode=new m("skyboxNode",o.scene),o.skybox.parent=o.skyboxNode,o.skyboxNode.parent=o.skyboxCamera,o.skyboxMatrix=o.skybox._localMatrix.clone(),this.updateParameters())},updateParameters(){o.skybox&&(o.skyboxCamera.fov=o.camera.fov)},update(){o.skybox&&o.skybox._isEnabled&&(o.skyboxNode.rotation.copyFrom(p.Inverse(o.cameraNode.rotation.toQuaternion()).toEulerAngles()),o.hasAlphaFog||"ORTHOGRAPHIC"===o.cameraMode?(o.skyboxNode.parent=o.skyboxCamera,o.skyboxCamera.rotation.equals(o.cameraNode.rotation)&&o.skyboxMatrix.equals(o.skybox._localMatrix)||(o.skyboxMatrix.copyFrom(o.skybox._localMatrix),o.skyboxCamera.rotation.copyFrom(o.cameraNode.rotation),o.skyboxView.needsRender=!0),o.skyboxView.enabled||o.skyboxView.enable()):(o.skyboxNode.parent=o.camera,o.skyboxView.enabled&&o.skyboxView.disable()))},blend(e){o.skybox&&o.blendResolutionScale.updated&&(o.skyboxView.needsRender=!0)},beforeMapLoad(e){e&&o.clearData("skybox")},async afterMapLoad(e){if(!o.skybox)return;const t=y();if(!t)return o.skyboxView.disable(),void o.skybox.setEnabled(!1);const a=[];for(let e=0;e<t.length;++e)a[e]=await o.getTextureUrl(t[e]);if(t!==y())return;const n=u.CreateFromImages(a,o.scene,!0);n.coordinatesMode=f,await o.waitTextureLoaded(n),t===y()?(n.updateSamplingMode(1),o.skybox.material.reflectionTexture&&o.skybox.material.reflectionTexture.dispose(),o.skybox.material.reflectionTexture=n,o.skybox.rotation.set(0,0,0),o.skyboxView.enable(),o.skyboxView.needsRender=!0,o.skybox.setEnabled(!0)):n.dispose()}});const g=o.features.skybox.methods;function y(){return o.loadData("skybox",o.getMapConfig("skybox",null))}o.mapConfigurationFunctions.skybox=new n("default,top,bottom,north,west,south,east",(function(e,t){const{bottom:o=t.default||t.top||t.north||t.south||t.east||t.west,top:a=t.default||t.bottom||t.north||t.south||t.east||t.west,north:n=t.default||t.south||t.east||t.west||t.top||t.bottom,south:s=t.default||t.north||t.east||t.west||t.top||t.bottom,east:i=t.default||t.west||t.north||t.south||t.top||t.bottom,west:d=t.default||t.east||t.north||t.south||t.top||t.bottom}=t;e.skybox=[i,a,n,d,o,s].map(e=>r("img/parallaxes",e))})),Object.assign(o.PluginCommand.prototype,{skybox(...e){if(!i(e[0].toLowerCase()))return delete o.mapConfigurations.skybox,o.clearData("skybox"),void g.afterMapLoad();const t=function(){if(!y())return{};const[e,t,o,a,n,s]=y();return{east:e,top:t,north:o,west:a,bottom:n,south:s}}();let a=null;for(let o=0;o<e.length;++o){const n=e[o].toLowerCase();switch(n){case"north":case"south":case"east":case"west":case"top":case"bottom":null!=e[o+1]&&(t[n]=e[o+1]),++o;break;case"default":null!=e[o+1]&&(a=e[o+1]),++o;break;default:a||(a=e[o])}}a&&(t.default=a);let n=[];for(const e in t)n.push(`${e}:${t[e]}`);n=n.join(",");const s={};o.mapConfigurationFunctions.skybox.run(s,n),o.mapConfigurations.skybox=s.skybox,o.saveData("skybox",s.skybox),g.createSkybox(),g.afterMapLoad()}})},function(e,t){const o=window.mv3d,{util:a,ConfigurationFunction:n}=o,{assign:s,file:r,foldername:i,filename:d}=a,{SceneLoader:l,Mesh:u}=BABYLON,c={model:new n("filename",(function(e,t){e.model=r("./models/",t.filename),e.shape=o.enumShapes.MODEL}))};s(o.tilesetConfigurationFunctions,c),s(o.eventConfigurationFunctions,c),o.tilesetConfigurationFunctions.scale=o.eventConfigurationFunctions.scale,o.importModel=(e,t=!0)=>new Promise((a,n)=>{l.LoadAssetContainer(i(e),d(e),o.scene,e=>{const n=e.meshes,s=e.materials;for(const e of s){e.ambientColor.set(1,1,1);const t=e.diffuseTexture;t&&o.waitTextureLoaded(t).then(e=>{e.updateSamplingMode(1)})}let r=0;for(const e of n)r+=e.getTotalVertices(),t||(e.renderingGroupId=o.enumRenderGroups.MAIN);if(t){const e=u.MergeMeshes(n,!0,r>64e3,void 0,!1,!0);e.renderingGroupId=o.enumRenderGroups.MAIN,e.mv3d_materials=s,a(e)}else{const t=new MeshGroup;e.addAllToScene(),t.addMesh(...n),t.mv3d_materials=s,a(t)}})})}]);
//# sourceMappingURL=mv3d-premium.js.map