// ==UserScript==
// @name         Miniblox Chat Translator
// @namespace    #TheM1ddleM1nCooksAgain
// @version      2.0
// @description  Ts is tuff 🪙
// @match        *://miniblox.io/*
// @author       TheM1ddleM1n
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    console.log("[CHAT] Translator loaded");

    let currentLang = "OFF";

    const HI_MAP = {
        a:"ए", b:"बी", c:"सी", d:"डी", e:"ई", f:"एफ", g:"जी", h:"एच",
        i:"आई", j:"जे", k:"के", l:"एल", m:"एम", n:"एन", o:"ओ", p:"पी",
        q:"क्यू", r:"आर", s:"एस", t:"टी", u:"यू", v:"वी", w:"डब्लू", x:"एक्स",
        y:"वाय", z:"ज़ैड",
        A:"ए", B:"बी", C:"सी", D:"डी", E:"ई", F:"एफ", G:"जी", H:"एच",
        I:"आई", J:"जे", K:"के", L:"एल", M:"एम", N:"एन", O:"ओ", P:"पी",
        Q:"क्यू", R:"आर", S:"एस", T:"टी", U:"यू", V:"वी", W:"डब्लू", X:"एक्स",
        Y:"वाय", Z:"ज़ैड"
    };

    const RU_MAP = {
        a:"а", b:"б", c:"ц", d:"д", e:"е", f:"ф", g:"г", h:"х",
        i:"и", j:"й", k:"к", l:"л", m:"м", n:"н", o:"о", p:"п",
        q:"я", r:"р", s:"с", t:"т", u:"у", v:"в", w:"ш", x:"кс",
        y:"ы", z:"з",
        A:"А", B:"Б", C:"Ц", D:"Д", E:"Е", F:"Ф", G:"Г", H:"Х",
        I:"И", J:"Й", K:"К", L:"Л", M:"М", N:"Н", O:"О", P:"П",
        Q:"Я", R:"Р", S:"С", T:"Т", U:"У", V:"В", W:"Ш", X:"КС",
        Y:"Ы", Z:"З"
    };

    const COMMON = {
        "0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9",
        " ":" ",".":".",",":",","!":"!","?":"?","-":"-","_":"_","/":"/"
    };

    Object.assign(HI_MAP, COMMON);
    Object.assign(RU_MAP, COMMON);

    function translate(text) {
        if (currentLang === "HI") {
            return text.split("").map(c => HI_MAP[c] || c).join("");
        }
        if (currentLang === "RU") {
            return text.split("").map(c => RU_MAP[c] || c).join("");
        }
        return text;
    }

    function createUI() {

        const button = document.createElement("button");

        button.innerText = "Chat: OFF";
        button.style.position = "fixed";
        button.style.top = "10px";
        button.style.right = "10px";
        button.style.zIndex = "9999";
        button.style.padding = "8px 12px";
        button.style.background = "#222";
        button.style.color = "white";
        button.style.border = "1px solid #555";
        button.style.borderRadius = "6px";
        button.style.cursor = "pointer";
        button.style.fontWeight = "bold";

        button.onclick = () => {

            if (currentLang === "OFF") {
                currentLang = "HI";
                button.innerText = "Chat: Hindi";
            } else if (currentLang === "HI") {
                currentLang = "RU";
                button.innerText = "Chat: Russian";
            } else {
                currentLang = "OFF";
                button.innerText = "Chat: OFF";
            }

        };

        document.body.appendChild(button);
    }

    function waitForGame() {

        const reactRoot = document.querySelector("#react");
        if (!reactRoot) return setTimeout(waitForGame, 1000);

        try {

            const internal = Object.values(reactRoot)[0];
            const game = internal?.updateQueue?.baseState?.element?.props?.game;

            if (!game || !game.chat) return setTimeout(waitForGame, 1000);

            const originalSubmit = game.chat.submit;

            game.chat.submit = function(...args) {

                let message = this.inputValue || this.value || "";

                if (message && !message.trim().startsWith("/")) {

                    const translated = translate(message);

                    if (this.inputValue !== undefined) this.inputValue = translated;
                    if (this.value !== undefined) this.value = translated;

                }

                return originalSubmit.apply(this, args);
            };

            console.log("[CHAT] Translator ready");

        } catch {
            setTimeout(waitForGame, 1000);
        }

    }

    createUI();
    waitForGame();

})();
