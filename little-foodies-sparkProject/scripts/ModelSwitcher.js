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

// Use export keyword to make a symbol available in scripting debug console
export const Diagnostics = require('Diagnostics');



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

Patches.getScalarValue('scriptModelIndex').monitor({fireOnInitialValue:true}).subscribe(function(value){
    SwitchModelByIndex(value.newValue);
});


function SwitchModelByIndex (newIndex) {
    for(var i=0; i< charModels.length; i++)
    {
        if(i == newIndex)
            charModels[i].hidden = false;
        else
            charModels[i].hidden = true;
    }
}



// picker things

var isEditModeOn = false;
var editModeIndex = 0;



var charIndex = 0;

const iconHeadNY = Textures.get('head-newyellow');
const iconHeadSummergirl = Textures.get('head-summer-girl');
const iconHeadHipstergirl = Textures.get('head-hipster-girl');
const iconHeadJock = Textures.get('head-jock');
const iconHeadGang = Textures.get('head-gang');
const iconHeadGamegirl = Textures.get('head-game-girl');
const iconHeadHipsterguy = Textures.get('head-hipster-guy');

const charIcons = [
  {image_texture: iconHeadNY},
  {image_texture: iconHeadHipstergirl},
  {image_texture: iconHeadHipsterguy},
  {image_texture: iconHeadGang},
  {image_texture: iconHeadJock},
  {image_texture: iconHeadSummergirl},
  {image_texture: iconHeadGamegirl}
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

const faceIcons = [
  {image_texture: iconFaceNothing},
  {image_texture: iconFaceSoso},
  {image_texture: iconFaceLove},
  {image_texture: iconFaceOhmygod},
  {image_texture: iconFaceNice},
  {image_texture: iconFaceSmile},
  {image_texture: iconFaceOh}
];

var faceConfig = {
    selectedIndex: animIndex,
    items: faceIcons
}



var uiPicker = NativeUI.picker;

Patches.getScalarValue('editModeIndex').monitor({fireOnInitialValue:true}).subscribe(function(value){
    editModeIndex = value.newValue;
    SwitchEditMode();
});

function SwitchEditMode ()
{
    if(editModeIndex == 0)
    {
        var editConfig = {
            selectedIndex: 0,
            items: [
                {image_texture: iconEditMode},
                charIcons[charIndex],
                animIcons[animIndex],
                faceIcons[faceIndex]
            ]
        }
        uiPicker.configure(editConfig);
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
}



uiPicker.selectedIndex.monitor().subscribe(function(index) {
    if(editModeIndex == 0) // nothing
    {
        editModeIndex = index.newValue;
        SwitchEditMode();
    }
    else if(editModeIndex == 1)
    {
        charIndex = index.newValue;
        Patches.setScalarValue('pickerCharIndex', charIndex);
    }
    else if(editModeIndex == 2)
    {
        animIndex = index.newValue;
        Patches.setScalarValue('pickerAnimIndex', animIndex);
    }
    else if(editModeIndex == 3)
    {
        faceIndex = index.newValue;
        Patches.setScalarValue('pickerFaceIndex', faceIndex);
    }
    Diagnostics.log(index);
});





const iconEditMode = Textures.get('edit-icon');

Patches.getPulseValue('bgTapped').subscribe(function(){
    isEditModeOn = !isEditModeOn;

    if(isEditModeOn)
    {
        editModeIndex = 0;
        SwitchEditMode();
        uiPicker.visible = true;
    }
    else
    {
        uiPicker.visible = false;
    }
});
