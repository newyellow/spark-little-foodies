/**
 * (c) Facebook, Inc. and its affiliates. Confidential and proprietary.
 */

//==============================================================================
// Welcome to scripting in Spark AR Studio! Helpful links:
//
// Scripting Basics - https://fb.me/spark-scripting-basics
// Reactive Programming - https://fb.me/spark-reactive-programming
// Scripting Object Reference - https://fb.me/spark-scripting-reference
// Changelogs - https://fb.me/spark-changelog
//
// For projects created with v87 onwards, JavaScript is always executed in strict mode.
//==============================================================================

// How to load in modules
const Scene = require('Scene');
const Patches = require('Patches');
const NativeUI = require('NativeUI');
const Textures = require('Textures');
const Reactive = require('Reactive');
const Time = require('Time');
const Animation = require('Animation');
const Persistence = require('Persistence');

const userScope = Persistence.userScope;
var storageData = {};

// Use export keyword to make a symbol available in scripting debug console
export const Diagnostics = require('Diagnostics');


var canMoveObj = true;
var canMoveBubble = false;

// To use variables and functions across files, use export/import keyword
// export const animationDuration = 10;

// Use import keyword to import a symbol from another file
// import { animationDuration } from './script.js'

// To access scene objects
// const directionalLight = Scene.root.find('directionalLight0');

// To access class properties
// const directionalLightIntensity = directionalLight.intensity;

// To log messages to the console
// Diagnostics.log('Console message logged from the script.');

// model switch part
let charModels = [];
let blobShadowPlane;

async function LoadModels () {
    charModels[0] = await Scene.root.findFirst('char-newyellow');
    charModels[1] = await Scene.root.findFirst('char-hipster-girl');
    charModels[2] = await Scene.root.findFirst('char-hipster-guy');
    charModels[3] = await Scene.root.findFirst('char-gang');
    charModels[4] = await Scene.root.findFirst('char-jock');
    charModels[5] = await Scene.root.findFirst('char-summer-girl');
    charModels[6] = await Scene.root.findFirst('char-game-girl');

    blobShadowPlane = await Scene.root.findFirst('blob-shadow');

    await Patches.outputs.getScalar('scriptModelIndex').then(signal=>{
        signal.monitor({fireOnInitialValue:true}).subscribe(function(value){
            SwitchModelByIndex(value.newValue);
        });
    });
}

let animControllersNY = [];
let animControllersFoodies = [];
let animTargetNY;
let animTargetFoodies;

async function LoadAnimations () {

    animTargetNY = await Scene.root.findFirst('char-newyellow');
    animTargetFoodies = await Scene.root.findFirst('foodies-renamed-anim-clipped-no-neck');

    animControllersNY[0] = await Animation.playbackControllers.findFirst('anim-ny-yumyum');
    animControllersNY[1] = await Animation.playbackControllers.findFirst('anim-ny-dance');
    animControllersNY[2] = await Animation.playbackControllers.findFirst('anim-ny-sobad');
    animControllersNY[3] = await Animation.playbackControllers.findFirst('anim-ny-waiting');
    animControllersNY[4] = await Animation.playbackControllers.findFirst('anim-ny-yahoo');
    animControllersNY[5] = await Animation.playbackControllers.findFirst('anim-ny-soso');
    animControllersNY[6] = await Animation.playbackControllers.findFirst('anim-ny-thumbsup');
    animControllersNY[7] = await Animation.playbackControllers.findFirst('anim-ny-ohmygod');

    animControllersFoodies[0] = await Animation.playbackControllers.findFirst('anim-yumyum');
    animControllersFoodies[1] = await Animation.playbackControllers.findFirst('anim-dance');
    animControllersFoodies[2] = await Animation.playbackControllers.findFirst('anim-sobad');
    animControllersFoodies[3] = await Animation.playbackControllers.findFirst('anim-waiting');
    animControllersFoodies[4] = await Animation.playbackControllers.findFirst('anim-yahoo');
    animControllersFoodies[5] = await Animation.playbackControllers.findFirst('anim-soso');
    animControllersFoodies[6] = await Animation.playbackControllers.findFirst('anim-thumbsup');
    animControllersFoodies[7] = await Animation.playbackControllers.findFirst('anim-ohmygod');

}

function SwitchModelByIndex (newIndex) {
    for(var i=0; i< charModels.length; i++)
    {
        if(newIndex == charModels.length) // if it is the last hidden index
            charModels[i].hidden = true;
        else if(i == newIndex)
            charModels[i].hidden = false;
        else
            charModels[i].hidden = true;
    }

    if(newIndex == charModels.length)
        blobShadowPlane.hidden = true;
    else
        blobShadowPlane.hidden = false;
}



// picker things

var isEditModeOn = true; // never end edit now
var editModeIndex = 0;


const emptyIcons = [];
var emptyConfig = {
    selectedIndex: 0,
    items: emptyIcons
}
let iconEditMode;

let charIndex = 0;
let charIcons;
let charConfig;


let animIndex = 0;
let animIcons;
let animConfig;

let faceIndex = 0;
let faceIcons;
let faceConfig;

let bubbleIndex = 0;
let bubbleIcons;
let bubbleConfig;


let starIndex = 0;
let starIcons;
let starConfig;

async function LoadAllTextures () {
    const iconHeadNY = await Textures.findFirst('head-newyellow');
    const iconHeadSummergirl = await Textures.findFirst('head-summer-girl');
    const iconHeadHipstergirl = await Textures.findFirst('head-hipster-girl');
    const iconHeadJock = await Textures.findFirst('head-jock');
    const iconHeadGang = await Textures.findFirst('head-gang');
    const iconHeadGamegirl = await Textures.findFirst('head-game-girl');
    const iconHeadHipsterguy = await Textures.findFirst('head-hipster-guy');
    const iconHeadHidden = await Textures.findFirst('head-hidden');

    charIcons = [
      {image_texture: iconHeadNY},
      {image_texture: iconHeadHipstergirl},
      {image_texture: iconHeadHipsterguy},
      {image_texture: iconHeadGang},
      {image_texture: iconHeadJock},
      {image_texture: iconHeadSummergirl},
      {image_texture: iconHeadGamegirl},
      {image_texture: iconHeadHidden}
    ];

    charConfig = {
      selectedIndex: animIndex,
      items: charIcons
    }

    const iconAnimDancing = await Textures.findFirst('anim-icon-dancing');
    const iconAnimThumbs = await Textures.findFirst('anim-icon-thumbs-up');
    const iconAnimOhmygod = await Textures.findFirst('anim-icon-ohmygod');
    const iconAnimWaiting = await Textures.findFirst('anim-icon-waiting');
    const iconAnimYahoo = await Textures.findFirst('anim-icon-yahoo');
    const iconAnimBad = await Textures.findFirst('anim-icon-bad');
    const iconAnimYum = await Textures.findFirst('anim-icon-yum');
    const iconAnimSoso = await Textures.findFirst('anim-icon-soso');

    animIcons = [
      {image_texture: iconAnimYum},
      {image_texture: iconAnimDancing},
      {image_texture: iconAnimBad},
      {image_texture: iconAnimWaiting},
      {image_texture: iconAnimYahoo},
      {image_texture: iconAnimSoso},
      {image_texture: iconAnimThumbs},
      {image_texture: iconAnimOhmygod}
    ];

    animConfig = {
        selectedIndex: animIndex,
        items: animIcons
    }


    const iconFaceNothing = await Textures.findFirst('face-nothing');
    const iconFaceSoso = await Textures.findFirst('face-soso');
    const iconFaceLove = await Textures.findFirst('face-love');
    const iconFaceOhmygod = await Textures.findFirst('face-ohmygod');
    const iconFaceNice = await Textures.findFirst('face-nice');
    const iconFaceSmile = await Textures.findFirst('face-smile');
    const iconFaceOh = await Textures.findFirst('face-oh');
    const iconFaceAngry = await Textures.findFirst('face-angry');

    faceIcons = [
      {image_texture: iconFaceNothing},
      {image_texture: iconFaceSoso},
      {image_texture: iconFaceLove},
      {image_texture: iconFaceOhmygod},
      {image_texture: iconFaceNice},
      {image_texture: iconFaceSmile},
      {image_texture: iconFaceOh},
      {image_texture: iconFaceAngry}
    ];

    faceConfig = {
        selectedIndex: animIndex,
        items: faceIcons
    }


    const iconBubbleNormalRect = await Textures.findFirst('icon-bubble-normal-rect');
    const iconBubbleNormalRound = await Textures.findFirst('icon-bubble-normal-round');
    const iconBubbleCloud = await Textures.findFirst('icon-bubble-cloud');
    const iconBubbleAngry = await Textures.findFirst('icon-bubble-angry');
    const iconBubbleAmazSharp = await Textures.findFirst('icon-bubble-amaz-sharp');
    const iconBubbleAmazCurve = await Textures.findFirst('icon-bubble-amaz-curve');
    const iconBubbleWeak = await Textures.findFirst('icon-bubble-weak');

    bubbleIcons = [
      {image_texture: iconBubbleNormalRect},
      {image_texture: iconBubbleNormalRound},
      {image_texture: iconBubbleCloud},
      {image_texture: iconBubbleAngry},
      {image_texture: iconBubbleAmazSharp},
      {image_texture: iconBubbleAmazCurve},
      {image_texture: iconBubbleWeak}
    ];

    bubbleConfig = {
        selectedIndex: bubbleIndex,
        items: bubbleIcons
    }

    const iconStar1 = await Textures.findFirst('icon-star-1');
    const iconStar2 = await Textures.findFirst('icon-star-2');
    const iconStar3 = await Textures.findFirst('icon-star-3');
    const iconStar4 = await Textures.findFirst('icon-star-4');
    const iconStar5 = await Textures.findFirst('icon-star-5');

    iconEditMode = await Textures.findFirst('edit-icon');

    starIcons = [
        {image_texture: iconStar1},
        {image_texture: iconStar2},
        {image_texture: iconStar3},
        {image_texture: iconStar4},
        {image_texture: iconStar5}
    ];

    starConfig = {
        selectedIndex: starIndex,
        items: starIcons
    }
}


var uiPicker = NativeUI.picker;

Patches.outputs.getScalar('editModeIndex').then(signal=>{
    signal.monitor({fireOnInitialValue:false}).subscribe(function(value){
        editModeIndex = value.newValue;
        SwitchEditMode();
    });
});

function SwitchEditMode ()
{
    if(isEditModeOn)
    {
        if(editModeIndex != 0)
        {
            isFirstSound = true;
            canPickSound = true;
        }
    }

    if(editModeIndex == 0)
    {
        uiPicker.configure(getEditConfig());
    }
    if(editModeIndex == 1) // character
    {
        charConfig.selectedIndex = charIndex;
        uiPicker.configure(charConfig);
    }
    else if(editModeIndex == 2) // anim
    {
        animConfig.selectedIndex = animIndex;
        uiPicker.configure(animConfig);
    }
    else if(editModeIndex == 3)
    {
        faceConfig.selectedIndex = faceIndex;
        uiPicker.configure(faceConfig);
    }
    else if(editModeIndex == 4) // dialogue
    {
        bubbleConfig.selectedIndex = bubbleIndex;
        uiPicker.configure(bubbleConfig);
    }
    else if(editModeIndex == 5) // star
    {
        starConfig.selectedIndex = starIndex;
        uiPicker.configure(starConfig);
    }
}

var canPickSound = false;
var isFirstSound = false;

var indexSelected = false;
var indexWaitTime = 200;
var tempSelectedIndex = 0;

uiPicker.selectedIndex.monitor().subscribe(function(index) {
    indexSelected = true;
    indexWaitTime = 300;
    tempSelectedIndex = index;
});

const selectIndexUpdateTimer = Time.setInterval(Update, 50);

function Update () {
    if(indexSelected)
    {
        if(indexWaitTime <= 0)
        {
            selectedIndexExecute(tempSelectedIndex);
            indexSelected = false;
        }
        else
        {
            indexWaitTime -= 50;
        }
    }
}

async function selectedIndexExecute (index) {
    if(canPickSound && editModeIndex != 0)
    {
        if(isFirstSound)
        {
            PlayUISound(1);
            isFirstSound = false;
        }
        else
            PlayUISound(2);
    }

    if(editModeIndex == 0) // choose setting thing
    {
        editModeIndex = index.newValue;
        SwitchEditMode();
    }
    else if(editModeIndex == 1)
    {
        charIndex = index.newValue;
        await Patches.inputs.setScalar('pickerCharIndex', charIndex);
        SavePersistConfig();
    }
    else if(editModeIndex == 2)
    {
        animIndex = index.newValue;
        //await Patches.inputs.setScalar('pickerAnimIndex', animIndex);
        PlayAnimation(animIndex);
        SavePersistConfig();
    }
    else if(editModeIndex == 3)
    {
        faceIndex = index.newValue;
        await Patches.inputs.setScalar('pickerFaceIndex', faceIndex);
        SavePersistConfig();
    }
    else if(editModeIndex == 4)
    {
        bubbleIndex = index.newValue;
        await Patches.inputs.setScalar('pickerDialogueIndex', bubbleIndex);
        SavePersistConfig();
    }
    else if(editModeIndex == 5)
    {
        starIndex = index.newValue;
        await Patches.inputs.setScalar('pickerRating', starIndex);
        SavePersistConfig();
    }
}

Patches.outputs.getPulse('longPressed').then(signal=>{
    signal.subscribe(function(){
        if(isEditModeOn)
        {
            if(editModeIndex > 0)
            {
                editModeIndex = 0;
                SwitchEditMode();
                PlayUISound(0);
            }
            else // turn off
            {
                // no turning off now

                //isEditModeOn = false;
                //uiPicker.visible = false;
                //uiPicker.configure(emptyConfig);

                PlayUISound(0);
            }
        }
        else // turn on
        {
            isEditModeOn = true;

            editModeIndex = 0;
            SwitchEditMode();
            uiPicker.visible = true;
            uiPicker.configure(getEditConfig());
            PlayUISound(1);
        }
    });
});


Patches.outputs.getPulse('bgTapped').then(signal=>{
    signal.subscribe(function(){
        if(!canMoveObj) // if state switch
        {
            canMoveObj = true;
            canMoveBubble = false;

            Patches.inputs.setBoolean('canMoveObject', canMoveObj);
            Patches.inputs.setBoolean('canMoveBubble', canMoveBubble);

            PlayUISound(3);
        }
    });
});

async function LoadPersistConfig () {
    await userScope.get('foodieSetting').then(result=>{
        Diagnostics.log("foodie loaded");
        if(result == null)
        {
            //Patches.inputs.setString('debugMsg', 'result null');
            Diagnostics.log("no data");
            storageData.charIndex = 0;
            storageData.animIndex = 0;
            storageData.faceIndex = 0;
            storageData.bubbleIndex = 0;
            storageData.starIndex = 0;
        }
        else
        {
            storageData = result;
            Diagnostics.log("yes data");

            if(storageData.charIndex != null)
                charIndex = storageData.charIndex;

            if(storageData.animIndex != null)
                animIndex = storageData.animIndex;

            if(storageData.faceIndex != null)
                faceIndex = storageData.faceIndex;

            if(storageData.bubbleIndex != null)
                bubbleIndex = storageData.bubbleIndex;

            if(storageData.starIndex != null)
                starIndex = storageData.starIndex;

        }
    }).catch(function(error){
        //Patches.inputs.setString('debugMsg', error);
        storageData.charIndex = 0;
        storageData.animIndex = 0;
        storageData.faceIndex = 0;
        storageData.bubbleIndex = 0;
        storageData.starIndex = 0;
    });

    // apply all
    await Patches.inputs.setScalar('pickerCharIndex', charIndex);
    PlayAnimation(animIndex);
    // await Patches.inputs.setScalar('pickerAnimIndex', animIndex);
    await Patches.inputs.setScalar('pickerFaceIndex', faceIndex);
    await Patches.inputs.setScalar('pickerDialogueIndex', bubbleIndex);
    await Patches.inputs.setScalar('pickerRating', starIndex);
}

async function SavePersistConfig () {
    storageData.charIndex = charIndex;
    storageData.animIndex = animIndex;
    storageData.faceIndex = faceIndex;
    storageData.bubbleIndex = bubbleIndex;
    storageData.starIndex = starIndex;

    await userScope.set('foodieSetting', storageData).then(success => {
        Diagnostics.log("foodieSetting Set: " + success);
        Diagnostics.log(storageData);
    });

}

function getEditConfig () {
    Diagnostics.log("QQ!!");
    Diagnostics.log(charIndex + "," + animIndex + "," + faceIndex + "," + bubbleIndex + "," + starIndex);

    var editConfig = {
        selectedIndex: 0,
        items: [
            {image_texture: iconEditMode},
            charIcons[charIndex],
            animIcons[animIndex],
            faceIcons[faceIndex],
            bubbleIcons[bubbleIndex],
            starIcons[starIndex]
        ]
    }

    Diagnostics.log("yoyo??");
    return editConfig;
}

// initial setting
async function Start () {

    editModeIndex = 0;

    Diagnostics.log("load textures");
    await LoadAllTextures();

    Diagnostics.log("load models");
    await LoadModels();
    await LoadAnimations();

    Diagnostics.log("load settings");
    await LoadPersistConfig();

    Diagnostics.log("ui picker configures");
    uiPicker.visible = true;
    await uiPicker.configure(getEditConfig());

    Diagnostics.log("sending values");
    await Patches.inputs.setBoolean('canMoveObject', canMoveObj);
    await Patches.inputs.setBoolean('canMoveBubble', canMoveBubble);

    Diagnostics.log("initializing completed");
}
Start();

Patches.outputs.getPulse('bubbleTapped').then(signal=>{
    signal.subscribe(function(){
        if(!canMoveBubble)
        {
            canMoveBubble = true;
            canMoveObj = false;

            Patches.inputs.setBoolean('canMoveObject', canMoveObj);
            Patches.inputs.setBoolean('canMoveBubble', canMoveBubble);

            PlayUISound(3);
        }
    });
});

function PlayUISound (soundIndex)
{
    Patches.inputs.setScalar('uiSoundIndex', soundIndex);
    Patches.inputs.setPulse('playUiSound', Reactive.once());
}

async function PlayAnimation (animationIndex)
{
    await animTargetNY.setAnimationPlaybackController(animControllersNY[animationIndex]);
    await animTargetFoodies.setAnimationPlaybackController(animControllersFoodies[animationIndex]);
}
