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
