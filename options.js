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

$(function(){
    chrome.storage.sync.get(['fillerFormFrParameters'], function(result) {
        $('[name="paramFiller"]').val(JSON.stringify(result.fillerFormFrParameters, undefined, 4));
    });
    
    $('[name="saveParam"]').on('click',function(){
        let paramsFiller = $('[name="paramFiller"]').val();
        console.log(JSON.parse(paramsFiller));
        try{
            let paramParse = JSON.parse(paramsFiller);
            chrome.storage.sync.set({fillerFormFrParameters: paramParse}, function() {
              alert('Settings saved');
            });
        }catch (e) {
            alert("JSON parsing error : ", e); 
        }
    });
});


