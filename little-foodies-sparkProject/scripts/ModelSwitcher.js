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
var charModels = [];
charModels[0] = Scene.root.find('char-newyellow');
charModels[1] = Scene.root.find('char-hipster-girl');
charModels[2] = Scene.root.find('char-hipster-guy');
charModels[3] = Scene.root.find('char-gang');
charModels[4] = Scene.root.find('char-jock');
charModels[5] = Scene.root.find('char-summer-girl');
charModels[6] = Scene.root.find('char-game-girl');

const blobShadowPlane = Scene.root.find('blob-shadow');

Patches.getScalarValue('scriptModelIndex').monitor({fireOnInitialValue:true}).subscribe(function(value){
    SwitchModelByIndex(value.newValue);
});


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

var charIndex = 0;

const iconHeadNY = Textures.get('head-newyellow');
const iconHeadSummergirl = Textures.get('head-summer-girl');
const iconHeadHipstergirl = Textures.get('head-hipster-girl');
const iconHeadJock = Textures.get('head-jock');
const iconHeadGang = Textures.get('head-gang');
const iconHeadGamegirl = Textures.get('head-game-girl');
const iconHeadHipsterguy = Textures.get('head-hipster-guy');
const iconHeadHidden = Textures.get('head-hidden');

const charIcons = [
  {image_texture: iconHeadNY},
  {image_texture: iconHeadHipstergirl},
  {image_texture: iconHeadHipsterguy},
  {image_texture: iconHeadGang},
  {image_texture: iconHeadJock},
  {image_texture: iconHeadSummergirl},
  {image_texture: iconHeadGamegirl},
  {image_texture: iconHeadHidden}
];

var charConfig = {
  selectedIndex: animIndex,
  items: charIcons
}


var animIndex = 0;

const iconAnimDancing = Textures.get('anim-icon-dancing');
const iconAnimThumbs = Textures.get('anim-icon-thumbs-up');
const iconAnimOhmygod = Textures.get('anim-icon-ohmygod');
const iconAnimWaiting = Textures.get('anim-icon-waiting');
const iconAnimYahoo = Textures.get('anim-icon-yahoo');
const iconAnimBad = Textures.get('anim-icon-bad');
const iconAnimYum = Textures.get('anim-icon-yum');
const iconAnimSoso = Textures.get('anim-icon-soso');

const animIcons = [
  {image_texture: iconAnimYum},
  {image_texture: iconAnimDancing},
  {image_texture: iconAnimBad},
  {image_texture: iconAnimWaiting},
  {image_texture: iconAnimYahoo},
  {image_texture: iconAnimSoso},
  {image_texture: iconAnimThumbs},
  {image_texture: iconAnimOhmygod}
];

var animConfig = {
    selectedIndex: animIndex,
    items: animIcons
}


var faceIndex = 0;
const iconFaceNothing = Textures.get('face-nothing');
const iconFaceSoso = Textures.get('face-soso');
const iconFaceLove = Textures.get('face-love');
const iconFaceOhmygod = Textures.get('face-ohmygod');
const iconFaceNice = Textures.get('face-nice');
const iconFaceSmile = Textures.get('face-smile');
const iconFaceOh = Textures.get('face-oh');
const iconFaceAngry = Textures.get('face-angry');

const faceIcons = [
  {image_texture: iconFaceNothing},
  {image_texture: iconFaceSoso},
  {image_texture: iconFaceLove},
  {image_texture: iconFaceOhmygod},
  {image_texture: iconFaceNice},
  {image_texture: iconFaceSmile},
  {image_texture: iconFaceOh},
  {image_texture: iconFaceAngry}
];

var faceConfig = {
    selectedIndex: animIndex,
    items: faceIcons
}


var bubbleIndex = 0;
const iconBubbleNormalRect = Textures.get('icon-bubble-normal-rect');
const iconBubbleNormalRound = Textures.get('icon-bubble-normal-round');
const iconBubbleCloud = Textures.get('icon-bubble-cloud');
const iconBubbleAngry = Textures.get('icon-bubble-angry');
const iconBubbleAmazSharp = Textures.get('icon-bubble-amaz-sharp');
const iconBubbleAmazCurve = Textures.get('icon-bubble-amaz-curve');
const iconBubbleWeak = Textures.get('icon-bubble-weak');

const bubbleIcons = [
  {image_texture: iconBubbleNormalRect},
  {image_texture: iconBubbleNormalRound},
  {image_texture: iconBubbleCloud},
  {image_texture: iconBubbleAngry},
  {image_texture: iconBubbleAmazSharp},
  {image_texture: iconBubbleAmazCurve},
  {image_texture: iconBubbleWeak}
];

var bubbleConfig = {
    selectedIndex: bubbleIndex,
    items: bubbleIcons
}


var starIndex = 0;

const iconStar1 = Textures.get('icon-star-1');
const iconStar2 = Textures.get('icon-star-2');
const iconStar3 = Textures.get('icon-star-3');
const iconStar4 = Textures.get('icon-star-4');
const iconStar5 = Textures.get('icon-star-5');

const starIcons = [
    {image_texture: iconStar1},
    {image_texture: iconStar2},
    {image_texture: iconStar3},
    {image_texture: iconStar4},
    {image_texture: iconStar5}
];

var starConfig = {
    selectedIndex: starIndex,
    items: starIcons
}


var uiPicker = NativeUI.picker;

Patches.getScalarValue('editModeIndex').monitor({fireOnInitialValue:false}).subscribe(function(value){
    editModeIndex = value.newValue;
    SwitchEditMode();
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

function selectedIndexExecute (index) {
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
        Patches.setScalarValue('pickerCharIndex', charIndex);
        SavePersistConfig();
    }
    else if(editModeIndex == 2)
    {
        animIndex = index.newValue;
        Patches.setScalarValue('pickerAnimIndex', animIndex);
        SavePersistConfig();
    }
    else if(editModeIndex == 3)
    {
        faceIndex = index.newValue;
        Patches.setScalarValue('pickerFaceIndex', faceIndex);
        SavePersistConfig();
    }
    else if(editModeIndex == 4)
    {
        bubbleIndex = index.newValue;
        Patches.setScalarValue('pickerDialogueIndex', bubbleIndex);
        SavePersistConfig();
    }
    else if(editModeIndex == 5)
    {
        starIndex = index.newValue;
        Patches.setScalarValue('pickerRating', starIndex);
        SavePersistConfig();
    }
}


const iconEditMode = Textures.get('edit-icon');

Patches.getPulseValue('longPressed').subscribe(function(){
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

Patches.getPulseValue('bgTapped').subscribe(function(){
    userScope.remove('foodieSetting').then(function(result){
        Diagnostics.log("test data removed:" + result);
    });
    if(!canMoveObj) // if state switch
    {
        canMoveObj = true;
        canMoveBubble = false;

        Patches.inputs.setBoolean('canMoveObject', canMoveObj);
        Patches.inputs.setBoolean('canMoveBubble', canMoveBubble);

        PlayUISound(3);
    }
});

async function LoadPersistConfig () {
    await userScope.get('foodieSetting').then(function(result){
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
    Patches.setScalarValue('pickerCharIndex', charIndex);
    Patches.setScalarValue('pickerAnimIndex', animIndex);
    Patches.setScalarValue('pickerFaceIndex', faceIndex);
    Patches.setScalarValue('pickerDialogueIndex', bubbleIndex);
    Patches.setScalarValue('pickerRating', starIndex);
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

    return editConfig;
}

// initial setting
async function Start () {

    editModeIndex = 0;

    await LoadPersistConfig();

    uiPicker.visible = true;
    uiPicker.configure(getEditConfig());
    Patches.inputs.setBoolean('canMoveObject', canMoveObj);
    Patches.inputs.setBoolean('canMoveBubble', canMoveBubble);
}
Start();

Patches.getPulseValue('bubbleTapped').subscribe(function(){

    if(!canMoveBubble)
    {
        canMoveBubble = true;
        canMoveObj = false;

        Patches.inputs.setBoolean('canMoveObject', canMoveObj);
        Patches.inputs.setBoolean('canMoveBubble', canMoveBubble);

        PlayUISound(3);
    }
});

function PlayUISound (soundIndex)
{
    Patches.inputs.setScalar('uiSoundIndex', soundIndex);
    Patches.inputs.setPulse('playUiSound', Reactive.once());
}
