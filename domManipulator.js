/*
 * Fill-it
 * Fill-it is Google Chrome extension design to fill HTML form with fake values in order to saving time when it comes to fill forms.
 * 
 * Copyright (C) 2018 Florian Knibbe
 * 
 * This file is part of Fill-it.
 *
 * Fill-it is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Fill-it is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Fill-it.  If not, see <https://www.gnu.org/licenses/>
 *
*/

var getFieldProperties = function (elem) {

    // TagName
    let props = {
        tagName: elem.prop("tagName").toLowerCase(),
        placeholder: elem.attr('placeholder'),
        name: elem.attr('name').toLowerCase(),
        labelPrev: elem.prev('label').text(),
        labelNext: elem.next('label').text(),
        type: elem.attr('type'),
        min: elem.attr('min'),
        max: elem.attr('max'),
        minLength: elem.attr('minlength'),
        maxLength: elem.attr('maxlength')
    };
    
    if(props.tagName === 'textarea'){
        props.type = 'textarea';
    }
    return props;
};

var randomBetween = function (min, max) {
    return Math.floor(Math.random() * (Number(max) - Number(min)) + Number(min));
}

var getRegex = function (params, fieldProperties) {
    let fillerVal = '';
    for (let i in params) {
        
        // Si il existe un filtre sur le nom et sur le type
        if(params[i].targetName != '' && params[i].targetType != ''){
            let regexTargetName = new RegExp(params[i].targetName, 'i');
            let regexTargetType = new RegExp(params[i].targetType, 'i');
            
            if (typeof fieldProperties.type != 'undefined' && fieldProperties.type.match(regexTargetType) !== null) { // Respect le type...
                //... alors test des autres attributs
                if (typeof fieldProperties.placeholder != 'undefined' && fieldProperties.placeholder.match(regexTargetName) !== null) {
                    fillerVal = params[i].fillerValue;
                    break;
                } else if (typeof fieldProperties.name != 'undefined' && fieldProperties.name.match(regexTargetName) !== null) {
                    fillerVal = params[i].fillerValue;
                    break;
                } else if (typeof fieldProperties.labelPrev != 'undefined' && fieldProperties.labelPrev.match(regexTargetName) !== null) {
                    fillerVal = params[i].fillerValue;
                    break;
                } else if (typeof fieldProperties.labelNext != 'undefined' && fieldProperties.labelNext.match(regexTargetName) !== null) {
                    fillerVal = params[i].fillerValue;
                    break;
                }
            } // Sinon c'est mort on passe au autre cas...
 
        }else if(params[i].targetName != ''){ // SI il existe juste un filtre sur le name etc..
            let regexTargetName = new RegExp(params[i].targetName, 'i');
            if (typeof fieldProperties.placeholder != 'undefined' && fieldProperties.placeholder.match(regexTargetName) !== null) {
                fillerVal = params[i].fillerValue;
                break;
            }else if (typeof fieldProperties.name != 'undefined' && fieldProperties.name.match(regexTargetName) !== null) {
                fillerVal = params[i].fillerValue;
                break;
            }  else if (typeof fieldProperties.labelPrev != 'undefined' && fieldProperties.labelPrev.match(regexTargetName) !== null) {
                fillerVal = params[i].fillerValue;
                break;
            } else if (typeof fieldProperties.labelNext != 'undefined' && fieldProperties.labelNext.match(regexTargetName) !== null) {
                fillerVal = params[i].fillerValue;
                break;
            }
        }else if(params[i].targetType != ''){ // Si il existe juste un filtre sur le type
            let regexTargetType = new RegExp(params[i].targetType, 'i');
            if (typeof fieldProperties.type != 'undefined' && fieldProperties.type.match(regexTargetType) !== null) {
                fillerVal = params[i].fillerValue;
                break; // On sort de la boucle
            }
        }
    }
    return fillerVal;
};

var fillerField = function (field,params) {
    
    // On récupère les propriétés du champ
    let fieldProps = getFieldProperties(field);

    // SI c'est un select - pas besoin du regex on fait un random d'option
    if(fieldProps.tagName === 'select'){
        let randomOptionIndex = randomBetween(0,(field.find('option:enabled').length-1));
        field.find("option:nth-child(" + randomOptionIndex + ")").prop("selected", true);
    }else if(fieldProps.tagName === 'input' && typeof fieldProps.type != 'undefined' && (fieldProps.type.toLowerCase() === 'radio' || fieldProps.type.toLowerCase() === 'checkbox') ){
        // Il faudrait optimiser pour ne pas passer sur chaque radio du meme nom...
        let randomCheck = randomBetween(0,10);
        if( (randomCheck % 2) === 0){
            field.prop('checked',false);
        }else{
            field.prop('checked',true);
        }
    }else{
        let fieldRegex = getRegex(params, fieldProps);
        if(fieldRegex != ''){
            field.val(new RandExp(fieldRegex).gen());
        }else{
            if(fieldProps.type === 'range' || fieldProps.type === 'number'){
                let min = 1;
                let max = 1000;
                if(typeof fieldProps.min != 'undefined' && fieldProps.min != null){
                    min = fieldProps.min;
                }
                if(typeof fieldProps.max != 'undefined' && fieldProps.max != null){
                    max = fieldProps.max;
                }
                let randomInt = randomBetween(min,max);
                field.val(randomInt);
            }else if(fieldProps.type === 'text' || fieldProps.type === 'textarea'){
                let pattern = '^([a-zA-Zéàù]{2,9}[ ]{1})';
                let min, max;
                
                if(fieldProps.type === 'text'){
                    min = 5;
                    max = 100;
                }else{
                    min = 40;
                    max = 200;
                }
                
                if(typeof fieldProps.minLength != 'undefined'){
                    min = Math.round(fieldProps.minLength/3);
                    if(min < 1){
                        min = 1;
                    }
                }
                if(typeof fieldProps.maxLength != 'undefined'){
                    max = Math.round(fieldProps.maxLength/3);
                }
                pattern = pattern+'{'+min+','+max+'}';
                let randomVal = new RandExp(pattern).gen();
                if(randomVal.length >= fieldProps.maxLength){
                    randomVal = randomVal.substr(0,fieldProps.maxLength);
                }
                field.val(randomVal);
            }
        }
    }
};

var formFillerParam;

// Dom ready
$(function () {
    
    chrome.storage.sync.get(['fillerFormFrParameters'], function(result) {
        formFillerParam = result.fillerFormFrParameters;
    });
    
    // Bouble click sur champ
    $('body').on('dblclick', 'input:enabled, textarea:enabled, select:enabled',function (e) {
        if (e.ctrlKey === true) {
            fillerField($(this),formFillerParam);
        }
    });
    
    $('body').on('keydown', 'input:enabled, textarea:enabled, select:enabled',function (e) {
        
        if (e.key == 'A' && e.ctrlKey === true && e.shiftKey === true) {
            $('input:enabled, textarea:enabled, select:enabled').each(function () {
                fillerField($(this),formFillerParam);
            });
        }else if(e.key == 'F' && e.ctrlKey === true && e.shiftKey === true){
            let fillerF = $(this).closest('[data-filler]');
            if(fillerF.length > 0){
                fillerF.find('input:enabled, textarea:enabled, select:enabled').each(function () {
                    fillerField($(this),formFillerParam);
                });
            }else{
                let fillerF = $(this).closest('form');
                if(fillerF.length > 0){
                    fillerF.find('input:enabled, textarea:enabled, select:enabled').each(function () {
                        fillerField($(this),formFillerParam);
                    });
                }
            }
        }
    });
});



