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

// Class Data
const classData = {
    'macos': {
        name: 'MACOS GEBRUIKER',
        icon: '🍎💻',
        spriteImg: 'img/mac.png',
        introMsg: "Een wilde KoenK verschijnt! Hij kijkt vol walging naar je terminal.",
        attacks: [
            { id: 'beachball', name: 'Spinning Beach Ball', desc: '10 DMG. Betrouwbaar.', dmg: 10, msg: "Je gebruikt Spinning Beach Ball. Het is super irritant!" },
            { id: 'update', name: 'Update Requires Restart', desc: '30 DMG. 30% kans op falen.', dmg: 30, chance: 0.7, msg: "Update Requires Restart! Kritieke schade!", failMsg: "Je update is vastgelopen..." },
            { id: 'dongle', name: 'Dongle Strike', desc: '15 DMG.', dmg: 15, msg: "Je slaat hem met een overpriced USB-C dongle!" },
            { id: 'sudo', name: 'Sudo su', desc: 'Stun. Emotionele schade.', dmg: 5, effect: 'stun', msg: "Je probeert root rechten te krijgen op macOS. Het faalt, maar KoenK cringet zo hard dat hij gestunned is." }
        ],
        koenkAttacks: [
            { name: "Unix-ish", dmg: 10, msg: "KoenK herinnert je eraan dat macOS 'technisch gezien' Unix is. (10 DMG)" },
            { name: "Cursed Terminal", dmg: 20, msg: "KoenK toont je terminal op de projector. Massive emotional damage! (20 DMG)" },
            { name: "Linux Superiority", dmg: 15, msg: "KoenK start zijn Thinkpad op met Arch Linux. Je bent geïntimideerd. (15 DMG)" }
        ]
    },
    'late': {
        name: 'TE LATE STUDENT',
        icon: '🎒🏃‍♂️',
        spriteImg: 'img/late.png',
        introMsg: "Je stapt 15 minuten te laat de les OS binnen. KoenK staart je aan...",
        attacks: [
            { id: 'nmbs', name: 'NMBS Smoesje', desc: '10-15 DMG.', dmg: [10, 15], msg: "Je gebruikt 'De trein had vertraging'! KoenK kent de NMBS." },
            { id: 'sneaken', name: 'Sneaken', desc: '30 DMG. 30% kans op missen.', dmg: 30, chance: 0.7, msg: "Je sneakt perfect naar de achterste rij!", failMsg: "Je struikelt over een oplader! KoenK ziet alles." },
            { id: 'badge', name: 'Badge vergeten', desc: 'Stun de vijand.', dmg: 5, effect: 'stun', msg: "Je zegt 'Ik was mijn badge vergeten'. KoenK zucht en is gestunned!" },
            { id: 'online', name: 'Dacht dat het online was', desc: '25 DMG. 10 Self-DMG.', dmg: 25, selfDmg: 10, msg: "Je roept 'Was het niet online?!' Het is effectief, maar je neemt cringe-schade." }
        ],
        koenkAttacks: [
            { name: "Teleurstelling", dmg: 12, msg: "KoenK zucht en schudt zijn hoofd. Je voelt je vreselijk. (12 DMG)" },
            { name: "Flappy KoenK Deadline", dmg: 18, msg: "KoenK zegt dat je de Flappy KoenK deadline gemist hebt. (18 DMG)" },
            { name: "TV Staar", dmg: 25, msg: "KoenK staart zwijgend naar jou, en dan naar de code op de TV. (25 DMG)" }
        ]
    },
    'ai': {
        name: 'CHATGPT ADDICT',
        icon: '🤖⌨️',
        spriteImg: 'img/ai.png',
        introMsg: "Je probeert je code te verdedigen die 'jezelf' geschreven hebt...",
        attacks: [
            { id: 'copy', name: 'Kopieer & Plak', desc: '10 DMG.', dmg: 10, msg: "Je kopieert blind code van ChatGPT." },
            { id: 'prompt', name: 'Prompt Engineering', desc: '10-30 DMG.', dmg: [10, 30], msg: "Je typt 'Write me a script...'. De output is verrassend goed!" },
            { id: 'language', name: 'As an AI...', desc: 'Stun de vijand.', dmg: 5, effect: 'stun', msg: "Je begint per ongeluk je zin met 'As an AI language model...'. KoenK is in de war!" },
            { id: 'lie', name: 'Zeggen dat jij het was', desc: '40 DMG. 50% kans op missen.', dmg: 40, chance: 0.5, msg: "Je claimt de code zelf geschreven te hebben. KoenK gelooft het (even)!", failMsg: "KoenK vraagt je de code uit te leggen. Je bevriest volledig." }
        ],
        koenkAttacks: [
            { name: "100% ChatGPT", dmg: 25, msg: "KoenK roept: 'Dit is 100% van ChatGPT!'. (25 DMG)" },
            { name: "Wat is een variabele?", dmg: 20, msg: "KoenK vraagt: 'Wat is een variabele?'. Je panic level stijgt. (20 DMG)" },
            { name: "Log4j Quiz", dmg: 15, msg: "KoenK begint over Log4j. Je weet absoluut niets. (15 DMG)" }
        ]
    }
};

window.startGame = function(classId) {
    currentClass = classData[classId];
    
    // Set UI
    playerNameElem.innerText = currentClass.name;
    playerIconElem.src = currentClass.spriteImg;
    
    // Build Action Menu
    actionMenu.innerHTML = '';
    currentClass.attacks.forEach(atk => {
        const btn = document.createElement('button');
        btn.className = 'action-btn';
        btn.innerHTML = `${atk.name}<br><span>${atk.desc}</span>`;
        btn.onclick = () => handlePlayerAttack(atk);
        actionMenu.appendChild(btn);
    });

    // Reset State
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
        eye.style.top = '30%'; // Approximate eye level
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

    // Switch screens
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
    
    // Position randomly around the target
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
        
        typeMessage("WAT?! KoenK transformeert...", () => {
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
                koenkHP += 30; // Boss heal
                updateHealth();
                spawnDamageText("+30", koenkSpriteDiv, 'heal');
                
                typeMessage("Billy KoenK is ontwaakt! Zijn aanvallen doen nu extra schade!", () => {
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
            endTitle.innerText = "GEBUISD";
            endTitle.style.color = "#f85149";
            endDesc.innerText = "Je terminal is verwijderd en je moet volgend jaar opnieuw beginnen.";
            gameOverScreen.style.display = 'flex';
        }, 1000);
        return true;
    }
    if(koenkHP <= 0) {
        setTimeout(() => {
            endTitle.innerText = "VICTORY";
            endTitle.style.color = "#3fb950";
            endDesc.innerText = "Je hebt de legende verslagen. Het rijk is nu van jou.";
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

    // Chance check
    if (atk.chance !== undefined && Math.random() > atk.chance) {
        finalMsg = atk.failMsg;
        triggerAnim(playerSprite, 'dodge'); // Little stumble anim
    } else {
        // Calculate Damage
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
                spawnDamageText(finalDmg > 25 ? `Kritiek! -${finalDmg}` : `-${finalDmg}`, koenkSpriteDiv, finalDmg > 25 ? 'crit' : '');
                
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
        typeMessage("KoenK zucht heel luid en slaat zijn beurt over uit teleurstelling!", () => {
            setButtonsState(false);
            msgBox.innerText = "Wat ga je doen?";
        });
        return;
    }

    const attacks = currentClass.koenkAttacks;
    const move = attacks[Math.floor(Math.random() * attacks.length)];
    
    // If Phase 2, Koen deals 1.5x damage
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
                msgBox.innerText = "Wat ga je doen?";
            }
        }, 200);
    });
}
