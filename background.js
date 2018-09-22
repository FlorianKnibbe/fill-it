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
 */

'use strict';

const defaultParameters = [
    {
        targetName: "siret",
        targetType: "(text|number)",
        fillerValue: "^(2210005200011|35022996900026|74988814500010|40410704700015|41510193000014|38298492000043|41994912800039|40422352100018|03865996700012|38031673700010|45379509800012|21100004700012|51269164300013)$"
    },
    {
        targetName: "(n°|num|numéro)",
        targetType: "text",
        fillerValue: "^[0-9]{1,3}$"
    },
    {
        targetName: "(qte|quantité|nombre)",
        targetType: "text",
        fillerValue: "^[0-9]{1,2}$"
    },
    {
        targetName: "(?<!(n° |num |numéro ))rue",
        targetType: "text",
        fillerValue: "^(rue|avenue|boulevard|impasse) ((Saint|Honoré|)[ ]){0,1}(Jackson|Aiden|Liam|Lucas|Noah|Mason|Jayden|Ethan|Jacob|Jack|Caden|Logan|Benjamin|Michael|Caleb|Ryan|Alexander|Elijah|James|William|Oliver|Connor|Matthew|Daniel|Luke|Brayden|Jayce|Henry|Carter|Dylan|Gabriel|Joshua|Nicholas|Isaac|Owen|Nathan|Grayson|Eli|Landon|Andrew|Max|Samuel|Gavin|Wyatt|Christian|Hunter|Cameron|Evan|Charlie|David|Sebastian|Joseph|Dominic|Anthony|Colton|John|Tyler|Zachary|Thomas|Julian|Levi|Adam|Isaiah|Alex|Aaron|Parker|Cooper|Miles|Chase|Muhammad|Christopher|Blake|Austin|Jordan|Leo|Jonathan|Adrian|Colin|Hudson|Ian|Xavier|Camden|Tristan|Carson|Jason|Nolan|Riley|Lincoln|Brody|Bentley|Nathaniel|Josiah|Declan|Jake|Asher|Jeremiah|Cole|Mateo|Micah|Elliot|Sophia|Emma|Olivia|Isabella|Mia|Ava|Lily|Zoe|Emily|Chloe|Layla|Madison|Madelyn|Abigail|Aubrey|Charlotte|Amelia|Ella|Kaylee|Avery|Aaliyah|Hailey|Hannah|Addison|Riley|Harper|Aria|Arianna|Mackenzie|Lila|Evelyn|Adalyn|Grace|Brooklyn|Ellie|Anna|Kaitlyn|Isabelle|Sophie|Scarlett|Natalie|Leah|Sarah|Nora|Mila|Elizabeth|Lillian|Kylie|Audrey|Lucy|Maya|Annabelle|Makayla|Gabriella|Elena|Victoria|Claire|Savannah|Peyton|Maria|Alaina|Kennedy|Stella|Liliana|Allison|Samantha|Keira|Alyssa|Reagan|Molly|Alexandra|Violet|Charlie|Julia|Sadie|Ruby|Eva|Alice|Eliana|Taylor|Callie|Penelope|Camilla|Bailey|Kaelyn|Alexis|Kayla|Katherine|Sydney|Lauren|Jasmine|London|Bella|Adeline|Caroline|Vivian|Juliana|Gianna|Skyler|Jordyn)$"
    },
    {
        targetName: "(cp|code postal)",
        targetType: "(text|number)",
        fillerValue: "^[0-8]{1}[0-9]{1}[0-9]{2}0$"
    },
    {
        targetName: "^ville",
        targetType: "text",
        fillerValue: "^(Paris|Melun|Troyes|Marseille|Sens|Dijon|Nime|Bordeaux|Nogent|Amance)$"
    },
    {
        targetName: "(dénomination|libellé|raison sociale)",
        targetType: "text",
        fillerValue: "^Entreprise de test [0-9a-zA-Zéèà]{4,10}$"
    },
    {
        targetName: "(fonction|r(ô|o)le|m(e|é)tier)",
        targetType: "text",
        fillerValue: "^(Developpeur|Directeur|Le grand patron|Adjoint|Cultivateur|Forestier|Analyste|Testeur|Dormeur)$"
    },
    {
        targetName: "pr(é|e)nom",
        targetType: "text",
        fillerValue: "^(Jackson|Aiden|Liam|Lucas|Noah|Mason|Jayden|Ethan|Jacob|Jack|Caden|Logan|Benjamin|Michael|Caleb|Ryan|Alexander|Elijah|James|William|Oliver|Connor|Matthew|Daniel|Luke|Brayden|Jayce|Henry|Carter|Dylan|Gabriel|Joshua|Nicholas|Isaac|Owen|Nathan|Grayson|Eli|Landon|Andrew|Max|Samuel|Gavin|Wyatt|Christian|Hunter|Cameron|Evan|Charlie|David|Sebastian|Joseph|Dominic|Anthony|Colton|John|Tyler|Zachary|Thomas|Julian|Levi|Adam|Isaiah|Alex|Aaron|Parker|Cooper|Miles|Chase|Muhammad|Christopher|Blake|Austin|Jordan|Leo|Jonathan|Adrian|Colin|Hudson|Ian|Xavier|Camden|Tristan|Carson|Jason|Nolan|Riley|Lincoln|Brody|Bentley|Nathaniel|Josiah|Declan|Jake|Asher|Jeremiah|Cole|Mateo|Micah|Elliot|Sophia|Emma|Olivia|Isabella|Mia|Ava|Lily|Zoe|Emily|Chloe|Layla|Madison|Madelyn|Abigail|Aubrey|Charlotte|Amelia|Ella|Kaylee|Avery|Aaliyah|Hailey|Hannah|Addison|Riley|Harper|Aria|Arianna|Mackenzie|Lila|Evelyn|Adalyn|Grace|Brooklyn|Ellie|Anna|Kaitlyn|Isabelle|Sophie|Scarlett|Natalie|Leah|Sarah|Nora|Mila|Elizabeth|Lillian|Kylie|Audrey|Lucy|Maya|Annabelle|Makayla|Gabriella|Elena|Victoria|Claire|Savannah|Peyton|Maria|Alaina|Kennedy|Stella|Liliana|Allison|Samantha|Keira|Alyssa|Reagan|Molly|Alexandra|Violet|Charlie|Julia|Sadie|Ruby|Eva|Alice|Eliana|Taylor|Callie|Penelope|Camilla|Bailey|Kaelyn|Alexis|Kayla|Katherine|Sydney|Lauren|Jasmine|London|Bella|Adeline|Caroline|Vivian|Juliana|Gianna|Skyler|Jordyn)$"
    },
    {
        targetName: "(?<!(pre|pré))nom",
        targetType: "text",
        fillerValue: "^(adamant|adroit|amatory|animistic|antic|arcadian|baleful|bellicose|bilious|boorish|calamitous|caustic|cerulean|comely|concomitant|contumacious|corpulent|crapulous|defamatory|didactic|dilatory|dowdy|efficacious|effulgent|egregious|endemic|equanimous|execrable|fastidious|feckless|fecund|friable|fulsome|garrulous|guileless|gustatory|heuristic|histrionic|hubristic|incendiary|insidious|insolent|intransigent|inveterate|invidious|irksome|jejune|jocular|judicious|lachrymose|limpid|loquacious|luminous|mannered|mendacious|meretricious|minatory|mordant|munificent|nefarious|noxious|obtuse|parsimonious|pendulous|pernicious|pervasive|petulant|platitudinous|precipitate|propitious|puckish|querulous|quiescent|rebarbative|recalcitant|redolent|rhadamanthine|risible|ruminative|sagacious|salubrious|sartorial|sclerotic|serpentine|spasmodic|strident|taciturn|tenacious|tremulous|trenchant|turbulent|turgid|ubiquitous|uxorious|verdant|voluble|voracious|wheedling|withering|zealous)$"
    },
    {
        targetName: "fixe",
        targetType: "tel",
        fillerValue: "^0325[0-9]{6}$"
    },
    {
        targetName: "portable",
        targetType: "tel",
        fillerValue: "^06[0-9]{8}$"
    },
    {
        targetName: "",
        targetType: "tel",
        fillerValue: "^06[0-9]{8}$"
    },
    {
        targetName: "",
        targetType: "email",
        fillerValue: "^[a-z0-9]{4,30}@(orange|sfr|free|gmail|yahoo|outlook)[\.](fr|com|net)$"
    },
    {
        targetName: "",
        targetType: "(url)",
        fillerValue: "^(http|https)://(www[.]{1})?[a-z0-9\-]{4,20}[\.](fr|com|net|org|io)$"
    },
    {
        targetName: "",
        targetType: "password",
        fillerValue: "^A2erty$"
    },
    {
        targetName: "",
        targetType: "color",
        fillerValue: "^\#[0-9abcdef]{6}$"
    },
    {
        targetName: "",
        targetType: "date",
        fillerValue: "^2018-(01|02|03|04|05|06|07|08|09|10|11|12)-(1|2)[0-8]{1}$"
    }
];

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.get(['fillerFormFrParameters'], function (result) {
        console.log(result);
        if (typeof result.fillerFormFrParameters == 'undefined' || result.fillerFormFrParameters == null) {
            chrome.storage.sync.set({fillerFormFrParameters: defaultParameters}, function () {
                // Initialisation OK !
                console.log('set data !!');
            });
        }
    });

});
