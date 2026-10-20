// Game State
let playerHP = 100;
let playerMaxHP = 100;
let koenkHP = 100;
let koenkMaxHP = 100;
let koenkPhase = 1; // 1 = Philosopher, 2 = Billy
let koenkStunned = false;
let currentClass = null;

// DOM Elements
const selectionScreen = document.getElementById('selection-screen');
const battleScreen = document.getElementById('battle-screen');
const arenaElem = document.querySelector('.arena');
const playerNameElem = document.getElementById('player-name');
const playerIconElem = document.getElementById('player-icon');
const msgBox = document.getElementById('message-box');
const playerHealthFill = document.getElementById('player-health');
const koenkHealthFill = document.getElementById('koenk-health');
const playerHpText = document.getElementById('player-hp-text');
const koenkHpText = document.getElementById('koenk-hp-text');
const koenkNameTag = document.getElementById('koenk-name-tag');
const playerSprite = document.getElementById('player-sprite');
const koenkSpriteImg = document.querySelector('#koenk-sprite img');
const koenkSpriteDiv = document.getElementById('koenk-sprite');
const actionMenu = document.getElementById('action-menu');
const gameOverScreen = document.getElementById('game-over');
const endTitle = document.getElementById('end-title');
const endDesc = document.getElementById('end-desc');

// Class Data (English)
const classData = {
    'macos': {
        name: 'MACOS USER',
        icon: '🍎💻',
        spriteImg: 'img/mac.png',
        introMsg: "A wild KoenK appears! He looks at your terminal with pure disgust.",
        attacks: [
            { id: 'beachball', name: 'Spinning Beach Ball', desc: '10 DMG. Reliable.', dmg: 10, msg: "You use Spinning Beach Ball. It's super annoying!" },
            { id: 'update', name: 'Update Requires Restart', desc: '30 DMG. 30% miss chance.', dmg: 30, chance: 0.7, msg: "Update Requires Restart! Critical damage!", failMsg: "Your update crashed..." },
            { id: 'dongle', name: 'Dongle Strike', desc: '15 DMG.', dmg: 15, msg: "You hit him with an overpriced USB-C dongle!" },
            { id: 'sudo', name: 'Sudo su', desc: 'Stun. Emot. dmg.', dmg: 5, effect: 'stun', msg: "You try to get root access. It fails, but KoenK cringes so hard he is stunned." }
        ],
        koenkAttacks: [
            { name: "Unix-ish", dmg: 10, msg: "KoenK reminds you that macOS is 'technically' Unix. (10 DMG)" },
            { name: "Cursed Terminal", dmg: 20, msg: "KoenK shows your terminal on the projector. Massive emotional damage! (20 DMG)" },
            { name: "Linux Superiority", dmg: 15, msg: "KoenK boots his Thinkpad with Arch Linux. You are intimidated. (15 DMG)" }
        ]
    },
    'late': {
        name: 'LATE STUDENT',
        icon: '🎒🏃‍♂️',
        spriteImg: 'img/late.png',
        introMsg: "You step into the OS class 15 minutes late. KoenK stares at you...",
        attacks: [
            { id: 'nmbs', name: 'Train was late', desc: '10-15 DMG.', dmg: [10, 15], msg: "You use 'The train was late'! KoenK knows the struggle." },
            { id: 'sneaken', name: 'Sneak to back row', desc: '30 DMG. 30% miss chance.', dmg: 30, chance: 0.7, msg: "You perfectly sneak to the back row!", failMsg: "You trip over a charger! KoenK sees everything." },
            { id: 'badge', name: 'Forgot Badge', desc: 'Stuns enemy.', dmg: 5, effect: 'stun', msg: "You say 'I forgot my badge'. KoenK sighs and is stunned!" },
            { id: 'online', name: 'Thought it was online', desc: '25 DMG. 10 Self-DMG.', dmg: 25, selfDmg: 10, msg: "You yell 'Wasn't this online?!' It's effective, but you take cringe-damage." }
        ],
        koenkAttacks: [
            { name: "Disappointment", dmg: 12, msg: "KoenK sighs and shakes his head. You feel terrible. (12 DMG)" },
            { name: "Flappy KoenK Deadline", dmg: 18, msg: "KoenK reminds you about the missed Flappy KoenK deadline. (18 DMG)" },
            { name: "TV Stare", dmg: 25, msg: "KoenK stares at you, and then at the code on the TV. (25 DMG)" }
        ]
    },
    'ai': {
        name: 'CHATGPT ADDICT',
        icon: '🤖⌨️',
        spriteImg: 'img/ai.png',
        introMsg: "You try to defend the code you 'wrote yourself'...",
        attacks: [
            { id: 'copy', name: 'Copy & Paste', desc: '10 DMG.', dmg: 10, msg: "You blindly copy code from ChatGPT." },
            { id: 'prompt', name: 'Prompt Engineering', desc: '10-30 DMG.', dmg: [10, 30], msg: "You type 'Write me a script...'. The output is surprisingly good!" },
            { id: 'language', name: 'As an AI...', desc: 'Stuns enemy.', dmg: 5, effect: 'stun', msg: "You accidentally start your sentence with 'As an AI language model...'. KoenK is confused!" },
            { id: 'lie', name: 'Claim you wrote it', desc: '40 DMG. 50% miss chance.', dmg: 40, chance: 0.5, msg: "You claim you wrote the code yourself. KoenK believes it (for now)!", failMsg: "KoenK asks you to explain the code. You completely freeze." }
        ],
        koenkAttacks: [
            { name: "100% ChatGPT", dmg: 25, msg: "KoenK yells: 'This is 100% ChatGPT!'. Critical hit! (25 DMG)" },
            { name: "What is a variable?", dmg: 20, msg: "KoenK asks: 'What is a variable?'. Your panic level rises. (20 DMG)" },
            { name: "Log4j Quiz", dmg: 15, msg: "KoenK asks about Log4j. You know absolutely nothing. (15 DMG)" }
        ]
    }
};

window.startGame = function(classId) {
    currentClass = classData[classId];
    
    playerNameElem.innerText = currentClass.name;
    playerIconElem.src = currentClass.spriteImg;
    
    actionMenu.innerHTML = '';
    currentClass.attacks.forEach(atk => {
        const btn = document.createElement('button');
        btn.className = 'action-btn';
        btn.innerHTML = `${atk.name}<br><span>${atk.desc}</span>`;
        btn.onclick = () => handlePlayerAttack(atk);
        actionMenu.appendChild(btn);
    });

    koenkPhase = 1;
    koenkHP = 100;
    playerHP = 100;

    const koenkForms = [
        { name: "ELEGANT KOENK", img: "img/elegant.png", filter: "drop-shadow(0 15px 15px rgba(0,0,0,0.6))" },
        { name: "HELLO KOENK", img: "img/hello.png", filter: "drop-shadow(0 15px 15px rgba(0,0,0,0.6))" },
        { name: "PHILOSOPHER KOENK", img: "img/philosopher.png", filter: "drop-shadow(0 15px 15px rgba(0,0,0,0.6))" },
        { name: "CYBORG KOENK", img: "img/philosopher.png", filter: "hue-rotate(90deg) contrast(1.5) saturate(2) drop-shadow(0 0 20px #3fb950)" },
        { name: "GOLDEN KING KOENK", img: "img/elegant.png", filter: "sepia(1) saturate(5) hue-rotate(30deg) brightness(1.2) drop-shadow(0 0 30px gold)" },
        { name: "SHADOW KOENK", img: "img/hello.png", filter: "grayscale(1) brightness(0.6) contrast(2) drop-shadow(0 0 25px purple)" },
        { name: "GHOST KOENK", img: "img/philosopher.png", filter: "invert(1) opacity(0.8) hue-rotate(180deg) drop-shadow(0 0 20px cyan)" },
        { name: "BLOOD MOON KOENK", img: "img/elegant.png", filter: "sepia(1) saturate(10) hue-rotate(-50deg) contrast(1.5) drop-shadow(0 0 25px red)" }
    ];
    const randomForm = koenkForms[Math.floor(Math.random() * koenkForms.length)];

    koenkSpriteImg.src = randomForm.img;
    koenkSpriteImg.style.filter = randomForm.filter;
    koenkNameTag.innerText = randomForm.name;
    koenkSpriteDiv.style.transform = "scale(1)";

    // Add crown if Golden King
    let existingCrown = document.getElementById('koen-crown');
    if (existingCrown) existingCrown.remove();
    
    if (randomForm.name === "GOLDEN KING KOENK") {
        let crown = document.createElement('div');
        crown.id = 'koen-crown';
        crown.innerText = '👑';
        crown.style.position = 'absolute';
        crown.style.top = '-50px';
        crown.style.left = '50%';
        crown.style.transform = 'translateX(-50%) rotate(15deg)';
        crown.style.fontSize = '80px';
        crown.style.filter = 'drop-shadow(0 5px 15px gold)';
        crown.style.zIndex = '10';
        crown.style.animation = 'float-crown 3s infinite ease-in-out';
        koenkSpriteDiv.appendChild(crown);
    }

    if (randomForm.name === "CYBORG KOENK") {
        let eye = document.createElement('div');
        eye.id = 'koen-eye';
        eye.style.position = 'absolute';
        eye.style.top = '30%'; 
        eye.style.left = '55%';
        eye.style.width = '12px';
        eye.style.height = '12px';
        eye.style.background = '#ff0000';
        eye.style.borderRadius = '50%';
        eye.style.boxShadow = '0 0 15px 5px #ff0000, inset 0 0 5px #fff';
        eye.style.zIndex = '10';
        eye.style.animation = 'pulse 1s infinite alternate';
        koenkSpriteDiv.appendChild(eye);
    }

    selectionScreen.style.display = 'none';
    battleScreen.style.display = 'flex';

    updateHealth();
    typeMessage(currentClass.introMsg, null);
};

function updateHealth() {
    playerHP = Math.max(0, Math.min(playerMaxHP, playerHP));
    koenkHP = Math.max(0, Math.min(koenkMaxHP, koenkHP));

    playerHealthFill.style.width = playerHP + '%';
    koenkHealthFill.style.width = koenkHP + '%';

    playerHealthFill.style.background = playerHP < 30 ? '#f85149' : '#3fb950';
    koenkHealthFill.style.background = koenkHP < 30 ? '#f85149' : '#3fb950';

    playerHpText.innerText = `${playerHP}/${playerMaxHP}`;
    koenkHpText.innerText = `${koenkHP}/${koenkMaxHP}`;
}

function spawnDamageText(amount, targetDiv, type) {
    const dmgElem = document.createElement('div');
    dmgElem.className = `dmg-text ${type}`;
    dmgElem.innerText = amount;
    
    const rect = targetDiv.getBoundingClientRect();
    const arenaRect = arenaElem.getBoundingClientRect();
    
    const x = (rect.left - arenaRect.left) + (Math.random() * 50) + 20;
    const y = (rect.top - arenaRect.top) + (Math.random() * 50);
    
    dmgElem.style.left = `${x}px`;
    dmgElem.style.top = `${y}px`;
    
    arenaElem.appendChild(dmgElem);
    
    setTimeout(() => {
        dmgElem.remove();
    }, 1000);
}

function setButtonsState(disabled) {
    const btns = document.querySelectorAll('.action-btn');
    btns.forEach(btn => btn.disabled = disabled);
}

function typeMessage(msg, callback) {
    msgBox.innerText = '';
    let i = 0;
    function type() {
        if(i < msg.length) {
            msgBox.innerText += msg.charAt(i);
            i++;
            setTimeout(type, 20);
        } else if(callback) {
            setTimeout(callback, 800);
        }
    }
    type();
}

function triggerAnim(element, animClass) {
    element.classList.add(animClass);
    setTimeout(() => {
        element.classList.remove(animClass);
    }, 500);
}

function checkPhaseChange(callback) {
    if (koenkHP <= 50 && koenkHP > 0 && koenkPhase === 1) {
        koenkPhase = 2;
        
        typeMessage("WHAT?! KoenK is transforming...", () => {
            triggerAnim(arenaElem, 'screen-shake');
            koenkSpriteDiv.classList.add('transform');
            
            let existingCrown = document.getElementById('koen-crown');
            if (existingCrown) existingCrown.remove();
            let existingEye = document.getElementById('koen-eye');
            if (existingEye) existingEye.remove();

            setTimeout(() => {
                koenkSpriteImg.src = "img/Billy-KoenK.png";
                koenkSpriteImg.style.filter = "drop-shadow(0 15px 15px rgba(0,0,0,0.6))";
                koenkNameTag.innerText = "BILLY KOENK (ANGRY)";
                koenkHP += 30;
                updateHealth();
                spawnDamageText("+30", koenkSpriteDiv, 'heal');
                
                typeMessage("Billy KoenK has awakened! His attacks now deal extra damage!", () => {
                    if (callback) callback();
                });
            }, 750);
        });
        return true;
    }
    return false;
}

function checkWin() {
    if(playerHP <= 0) {
        setTimeout(() => {
            endTitle.innerText = "FAILED";
            endTitle.style.color = "#f85149";
            endDesc.innerText = "Your terminal was deleted and you must retake the class next year.";
            gameOverScreen.style.display = 'flex';
        }, 1000);
        return true;
    }
    if(koenkHP <= 0) {
        setTimeout(() => {
            endTitle.innerText = "VICTORY";
            endTitle.style.color = "#3fb950";
            endDesc.innerText = "You defeated the legend. The realm is yours.";
            gameOverScreen.style.display = 'flex';
        }, 1000);
        return true;
    }
    return false;
}

function handlePlayerAttack(atk) {
    setButtonsState(true);
    let finalDmg = 0;
    let finalSelfDmg = atk.selfDmg || 0;
    let finalMsg = "";

    if (atk.chance !== undefined && Math.random() > atk.chance) {
        finalMsg = atk.failMsg;
        triggerAnim(playerSprite, 'dodge');
    } else {
        if (Array.isArray(atk.dmg)) {
            finalDmg = Math.floor(Math.random() * (atk.dmg[1] - atk.dmg[0] + 1)) + atk.dmg[0];
        } else {
            finalDmg = atk.dmg;
        }
        finalMsg = atk.msg;
        if (atk.effect === 'stun') koenkStunned = true;
    }

    typeMessage(finalMsg, () => {
        if (finalSelfDmg > 0) {
            playerHP -= finalSelfDmg;
            updateHealth();
            spawnDamageText(`-${finalSelfDmg}`, playerSprite, 'enemy-dmg');
            triggerAnim(arenaElem, 'screen-shake');
        }

        if (finalDmg > 0) {
            triggerAnim(playerSprite, 'attack-left');
            setTimeout(() => {
                triggerAnim(koenkSpriteDiv, 'hurt');
                koenkHP -= finalDmg;
                updateHealth();
                spawnDamageText(finalDmg > 25 ? `Crit! -${finalDmg}` : `-${finalDmg}`, koenkSpriteDiv, finalDmg > 25 ? 'crit' : '');
                
                if(!checkWin()) {
                    if(!checkPhaseChange(enemyTurn)) {
                        setTimeout(enemyTurn, 500);
                    }
                }
            }, 200);
        } else {
            if(!checkWin()) {
                setTimeout(enemyTurn, 500);
            }
        }
    });
}

function enemyTurn() {
    if(checkWin()) return;

    if(koenkStunned) {
        koenkStunned = false;
        typeMessage("KoenK sighs loudly and skips his turn out of disappointment!", () => {
            setButtonsState(false);
            msgBox.innerText = "What will you do?";
        });
        return;
    }

    const attacks = currentClass.koenkAttacks;
    const move = attacks[Math.floor(Math.random() * attacks.length)];
    
    const dmgMultiplier = koenkPhase === 2 ? 1.5 : 1;
    const dmg = Math.floor(move.dmg * dmgMultiplier);
    
    typeMessage(koenkPhase === 2 ? `[BILLY MODE] ${move.msg}` : move.msg, () => {
        triggerAnim(koenkSpriteDiv, 'attack-right');
        setTimeout(() => {
            triggerAnim(playerSprite, 'hurt');
            playerHP -= dmg;
            updateHealth();
            spawnDamageText(`-${dmg}`, playerSprite, 'enemy-dmg');
            
            if (dmg > 15) triggerAnim(arenaElem, 'screen-shake');

            if(!checkWin()) {
                setButtonsState(false);
                msgBox.innerText = "What will you do?";
            }
        }, 200);
    });
}
