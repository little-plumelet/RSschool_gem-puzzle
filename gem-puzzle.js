let tokenLayoutOriginal = [
"*", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"
];

let count = 0;
let hour = 0;
let min = 0;
let sec = 0;
let woneGames = 0;


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let t = array[i];
        array[i] = array[j];
        array[j] = t;
    }
};

function checkForSolvability(array) {
    let count = 0;
    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if (array[j] < array[i] && (array[i] != "*" && array [j] != "*")) count++;
        }
    }
        if (array.indexOf("*") >= 0 && array.indexOf("*") <= 3) count += 1;
        else if (array.indexOf("*") >= 4 && array.indexOf("*") <= 7) count += 2;
        else if (array.indexOf("*") >= 8 && array.indexOf("*") <= 11) count += 3;
        else if (array.indexOf("*") >= 12 && array.indexOf("*") <= 15) count += 4;
    return count;
};

// Add Zeros
function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
}


const Gem = {
    
    elements: {
        main: null,
        wrapper: null,
        tokenContainer: null,
        tokens: [],
        info: null,
        reset: null,
        score: null,
        time: null,
    },

    init() {

        count = 0;
        hour = 0;
        min = 0;
        sec = 0;

        

        //create elements
        this.elements.main = document.createElement("div");
        this.elements.wrapper = document.createElement("div");
        this.elements.tokenContainer = document.createElement("div");

        this.elements.info = document.createElement("div");
        this.elements.reset = document.createElement("button");
        this.elements.score = document.createElement("div");
        this.elements.time = document.createElement("div");

        //setup main elements
        this.elements.main.classList.add("gem-puzzle");
        this.elements.wrapper.classList.add("wrapper");
        

        this.elements.info.classList.add("info");

        this.elements.reset.classList.add("reset");
        this.elements.reset.setAttribute("type", "button");
        this.elements.reset.textContent = "reset";

        this.elements.score.classList.add("score");
        if (localStorage.getItem('score') === null) {
            this.elements.score.innerHTML = count/*this._rememberGame() */
        }
        else if (localStorage.getItem('score') !== null) {
             this.elements.score.innerHTML = localStorage.getItem('score');
             count = localStorage.getItem('score');
        };

        this.elements.time.classList.add("time");
        if (localStorage.getItem('sec') === null && localStorage.getItem('min') === null && localStorage.getItem('hour') === null) {
             this.elements.time.innerHTML = `${addZero(hour)}<span>:</span>${addZero(min)}<span>:</span>${addZero(
            sec
          )}`;
             } else {
                 this.elements.time.innerHTML = `${addZero(localStorage.getItem('hour'))}<span>:</span>${addZero(localStorage.getItem('min'))}<span>:</span>${addZero(
            localStorage.getItem('sec')
            )}`;

            hour = localStorage.getItem('hour');
            min = localStorage.getItem('min');
            sec = localStorage.getItem('sec')
                 };

        this.elements.tokenContainer.classList.add("tokens");
        if (localStorage.getItem('tokensRemembered') !== null && localStorage.getItem('tokensRemembered') !== "") {
            let tokensRemembered = localStorage.getItem('tokensRemembered');
            tokensRemembered = tokensRemembered.split(',');
            this.elements.tokenContainer.append(...this._recreateTokens(tokensRemembered));
        }
        else this.elements.tokenContainer.appendChild(this._createTokens());
        
        this.elements.tokens = this.elements.tokenContainer.querySelectorAll(".token");
       

        //add to DOM
        this.elements.wrapper.appendChild(this.elements.main);
        this.elements.wrapper.appendChild(this.elements.info);
        this.elements.main.appendChild(this.elements.tokenContainer);
        
        this.elements.info.appendChild(this.elements.score);
        this.elements.info.appendChild(this.elements.reset);
        this.elements.info.appendChild(this.elements.time);
        
        document.body.appendChild(this.elements.wrapper);

        let tokens = document.querySelectorAll(".standard");
            tokens.forEach(button => {
                    button.addEventListener("click", () => {
                        
                        let rem = document.querySelector(".rem");
                        let domRect = rem.getBoundingClientRect();
                        let domRect1 = button.getBoundingClientRect();
                        if (isNedeedToSwap(domRect, domRect1)) 
                            swapTokens(button, rem);
                        })
                    });
        //document.body.appendChild(this.elements.main);
        //document.body.appendChild(this.elements.info);
        //document.body.appendChild(this.elements.reset);
        //document.body.appendChild(this.elements.score);
    
        //RESET
        let reset = document.querySelector(".reset");
        reset.addEventListener("click", () => {
        localStorage.removeItem('hour');
        localStorage.removeItem('min');
        localStorage.removeItem('sec');
        localStorage.removeItem('score');
        localStorage.removeItem('tokensRemembered');
        Gem._remove();
        Gem.init();

        });

    },

    
    
    //private methods
    _createTokens() {
        
        const fragment = document.createDocumentFragment();

        let tokenLayout = tokenLayoutOriginal;
        let count = 1;
        
        while (count % 2 !== 0) {
            shuffle(tokenLayout);
            count = checkForSolvability(tokenLayout);
        };
        
        tokenLayout.forEach(token => {
                const tokenElement = document.createElement("button");
            
    
            //add atributes and classes
            tokenElement.setAttribute("type", "button");
            tokenElement.classList.add("token");
            
            switch (token) {
                case "*":
                    tokenElement.classList.add("rem");
                    break;

                default:
                    tokenElement.classList.add("standard");
                    tokenElement.textContent = token.toLowerCase();

                break;
            }
    
            fragment.appendChild(tokenElement);

        });
        return fragment;
    },

    _recreateTokens(tokens) {
        
        let result = [];

        tokens.forEach(token => {
            const tokenElement = document.createElement("button");
        

        //add atributes and classes
        tokenElement.setAttribute("type", "button");
        tokenElement.classList.add("token");
        
        switch (token) {
            case "":
                tokenElement.classList.add("rem");
                break;

            default:
                tokenElement.classList.add("standard");
                tokenElement.textContent = token.toLowerCase();

            break;
        }

        result.push(tokenElement);

    });
    return result;
    },

    _remove() {

        let removing = document.querySelector(".gem-puzzle");
        let removing1 = document.querySelector(".score");
        let removing2 = document.querySelector(".time");
        let removing3 = document.querySelector(".reset");
        let removing4 = document.querySelector(".info");
        let removing5 = document.querySelector(".wrapper");
       
        removing1.remove();
        removing2.remove();
        removing3.remove();
        removing4.remove();
        removing5.remove();
        removing.remove();
    },

    _showTime() {
        
        function timing() {
        
            sec++;
            if (sec >= 60) {
                sec = 0;
                min++;
            }
            if (min >= 60) {
                min = 0;
                hour++;
            }
        time = document.querySelector(".time");
        time.innerHTML = `${addZero(hour)}<span>:</span>${addZero(min)}<span>:</span>${addZero(
            sec
          )}`;
        }
        setInterval(timing, 1000);
    },

    _rememberGame() {

        if (count >= 0) localStorage.setItem('score', count);
        if (hour >= 0) localStorage.setItem('hour', hour);
        if (min >= 0) localStorage.setItem('min', min);
        if (sec >= 0) localStorage.setItem('sec', sec);

        let tokensRemembered = document.querySelectorAll(".token");
        if (tokensRemembered !== null) {
            let array = [];

            tokensRemembered.forEach(button => {
              array.push(button.textContent);
            });
        
        localStorage.setItem('tokensRemembered', array);
        }
        
        setInterval(this._rememberGame, 1000);
    },

};

//
//window.addEventListener("DOMContentloaded", function () {
 //   Gem.init();
//})

Gem.init();
Gem._showTime();
Gem._rememberGame();

let tokenContainer = document.querySelector(".tokens");
let reset = document.querySelector(".reset");
let tokens = document.querySelectorAll(".standard");
let cloneButtonSt;
let cloneButtonRem;

document.onkeypress = f5press;
document.onkeydown = f5press;
document.onkeyup = f5press;


function checkWin() {
    let checkWin = document.querySelectorAll(".token");
            let array = [];

            checkWin.forEach(button => {
              array.push(button.textContent);
            });
            
            let j = 2;
            for (let i = 1; i < array.length; i++) {
                if (tokenLayoutOriginal[i + 1] == array[i]) j++;
                if (tokenLayoutOriginal[i + 1] !== array[i]) {
               break;
              }
              
          }
          if (j == array.length) {
              woneGames ++;
              if (woneGames <= 10) {
                  //while (woneGames <= 10) {
                    let iterator = "woneGames" + woneGames;
                    localStorage.setItem(iterator, `Вы решили головоломку за ${localStorage.getItem('hour')} : ${localStorage.getItem('min')} : ${localStorage.getItem('sec')} и ${(Number(localStorage.getItem('score')) + 1)} ходов`);
                //}
              }

              else woneGames = 0;
              function alertWinText () {
                alert(`<<Ура! Вы решили головоломку за ${addZero(localStorage.getItem('hour'))} : ${addZero(localStorage.getItem('min'))} : ${addZero(localStorage.getItem('sec'))} и ${(Number(localStorage.getItem('score')) + 1)} ходов>> `);
              }
              setTimeout(alertWinText, 300);
          }
          else {
            console.log("Играйте дальше!")
          }
};

function sound() {
        let audio = new Audio();
        audio.src = 'assets/intuition-561.mp3';
        audio.autoplay = true;        
};

function swapTokens (button, rem) {

            count ++;
            let score = document.querySelector(".score");
            score.innerHTML = count;
            cloneButtonSt = button.cloneNode(true);
            cloneButtonRem = rem.cloneNode(true);
            
            tokenContainer.appendChild(cloneButtonSt);
            tokenContainer.appendChild(cloneButtonRem);

            button.replaceWith(cloneButtonRem);
            button = cloneButtonSt;
            button.addEventListener("click", () => {
                let rem = document.querySelector(".rem");
                let domRect = rem.getBoundingClientRect();
                let domRect1 = button.getBoundingClientRect();
                if (isNedeedToSwap(domRect, domRect1))
                    swapTokens(button, rem);
            });
            rem.replaceWith(cloneButtonSt); 
            sound();

            //Chek for win combination
            checkWin();
            
};

function isNedeedToSwap(domRect, domRect1){
    let windowWidth = window.innerWidth;
    if (windowWidth > 400)
    {
        return (domRect.x + 100 == domRect1.x & domRect.y == domRect1.y || 
            domRect.x - 100 == domRect1.x & domRect.y == domRect1.y || 
            domRect.y + 100 == domRect1.y & domRect.x == domRect1.x || 
            domRect.y - 100 == domRect1.y & domRect.x == domRect1.x) ? true : false;
        }
    else {
        return (domRect.x + 60 == domRect1.x & domRect.y == domRect1.y || 
            domRect.x - 60 == domRect1.x & domRect.y == domRect1.y || 
            domRect.y + 60 == domRect1.y & domRect.x == domRect1.x || 
            domRect.y - 60 == domRect1.y & domRect.x == domRect1.x) ? true : false;
        }
    }

tokens.forEach(button => {
    button.addEventListener("click", () => {
        let rem = document.querySelector(".rem");
        let domRect = rem.getBoundingClientRect();
        let domRect1 = button.getBoundingClientRect();
        if (isNedeedToSwap(domRect, domRect1)) 
            swapTokens(button, rem);
            // if (domRect.top == domRect1.top || domRect.left == domRect1.left) swapTokens(button, rem)
    })
});

function f5press(e) {
    e = e || window.event; 
    if (e.keyCode == 'F5' || e.keyCode == 116) {
        Gem._remove();
        Gem.init();
    }
};



