// ข้อมูลอัตลักษณ์ของ Don Quixote พร้อมเพิ่มค่า spGain (ค่าสติที่จะได้รับต่อการโจมตี 1 ครั้ง)
const donData = {
    wCorp: {
        name: "W Corp. L3 Cleanup Agent",
        desc: "สายชาร์จพลังสายฟ้า ไฮป์ง่ายมาก (สติเพิ่มขึ้น +15 ต่อการตี)",
        flavor: "“ตัดมิติและเคลียร์เส้นทาง! ชาร์จพลังสายฟ้าเต็มพิกัด!”",
        spGain: 15,
        skills: [
            { name: "S1: Leap", basePower: 4, coinBonus: 2, coinCount: 2 },
            { name: "S2: Overcharge", basePower: 3, coinBonus: 4, coinCount: 4 },
            { name: "S3: Rip Space (MAX)", basePower: 1, coinBonus: 3, coinCount: 5 }
        ]
    },
    cinq: {
        name: "Cinq Assoc. South Section 5 Director",
        desc: "สายสุขุม ดวลดาบอย่างมีสมาธิ ค่อยๆ รุกคืบ (สติเพิ่มขึ้น +12 ต่อการตี)",
        flavor: "“ข้าขอท้าดวลอย่างเป็นทางการ! จงรับการทิ่มแทงอันรวดเร็ว!”",
        spGain: 12,
        skills: [
            { name: "S1: Attaque", basePower: 3, coinBonus: 3, coinCount: 2 },
            { name: "S2: Salut", basePower: 4, coinBonus: 4, coinCount: 3 },
            { name: "S3: Fleche", basePower: 6, coinBonus: 3, coinCount: 4 }
        ]
    },
    middleSister: {
        name: "The Middle Little Sister",
        desc: "สายล้างแค้น ยิ่งสู้ยิ่งเดือดดาลขั้นสุด (สติเพิ่มขึ้น +18 ต่อการตี)",
        flavor: "“การลบหลู่ครอบครัวของข้า... โทษทัณฑ์ของมันคือความเจ็บปวด!”",
        spGain: 18,
        skills: [
            { name: "S1: Vengeance Fret", basePower: 3, coinBonus: 3, coinCount: 3 },
            { name: "S2: Trust the Book!", basePower: 4, coinBonus: 4, coinCount: 4 },
            { name: "S3: Claim Their Sins", basePower: 5, coinBonus: 5, coinCount: 3 }
        ]
    },
    base: {
        name: "Shi Assoc. South Section 5",
        desc: "สายก้าวข้ามความตาย ร่างกายอ่อนล้าทำให้สติขึ้นช้า (สติเพิ่มขึ้น +8 ต่อการตี)",
        flavor: "“ถึงแม้ร่างกายจะเหนื่อยล้า... แต่ข้าจะก้าวข้ามขีดจำกัดแห่งความตาย!”",
        spGain: 8,
        skills: [
            { name: "S1: Extreme Edge", basePower: 4, coinBonus: 2, coinCount: 2 },
            { name: "S2: Flashing Strike", basePower: 4, coinBonus: 4, coinCount: 3 },
            { name: "S3: Boundary of Death", basePower: 1, coinBonus: 44, coinCount: 1 }
        ]
    }
};

const enemyData = {
    dummy: { name: "หุ่นซ้อมรบธรรมดา", maxHp: 100, currentHp: 100 },
    pequod: { name: "ลูกเรือ Pequod Town", maxHp: 250, currentHp: 250 },
    windmill: { name: "ยักษ์กังหันลมในจินตนาการ (BOSS)", maxHp: 600, currentHp: 600 }
};

let selectedIdentityKey = "";
let activeEnemyKey = "dummy";
let currentSP = 0; // ตัวแปรเก็บค่าสติปัจจุบันในด่าน

function initCharacterSelection() {
    const grid = document.getElementById("identityGrid");
    grid.innerHTML = "";
    
    Object.keys(donData).forEach(key => {
        const card = document.createElement("div");
        card.className = "identity-card";
        card.id = `card-${key}`;
        card.onclick = () => selectCharacter(key);
        card.innerHTML = `
            <h4>${donData[key].name}</h4>
            <p>${donData[key].desc}</p>
        `;
        grid.appendChild(card);
    });
}

function selectCharacter(key) {
    selectedIdentityKey = key;
    document.querySelectorAll(".identity-card").forEach(c => c.classList.remove("selected"));
    document.getElementById(`card-${key}`).classList.add("selected");
    document.getElementById("startBattleBtn").disabled = false;
}

function goToBattleScreen() {
    document.getElementById("selectScreen").classList.remove("active-screen");
    document.getElementById("battleScreen").classList.add("active-screen");
    
    document.getElementById("activeCharacterTitle").innerText = `กำลังควบคุม: ${donData[selectedIdentityKey].name}`;
    
    // ตั้งค่าสติเริ่มต้นที่ 0
    currentSP = 0;
    updateSPUI();
    
    document.getElementById("resultBox").style.display = "none";
    document.getElementById("coinStage").innerHTML = "";

    updateSkillOptions();
}

function goToSelectScreen() {
    document.getElementById("battleScreen").classList.remove("active-screen");
    document.getElementById("selectScreen").classList.add("active-screen");
}

function toggleMusic() {
    const music = document.getElementById("themeMusic");
    const btn = document.getElementById("musicBtn");
    if (music.paused) {
        music.play();
        btn.innerText = "⏸️ PAUSE BATTLE THEME";
        btn.style.backgroundColor = "#ff9800";
    } else {
        music.pause();
        btn.style.backgroundColor = "#00bcd4";
        btn.innerText = "🎵 PLAY BATTLE THEME";
    }
}

function changeEnemy() {
    activeEnemyKey = document.getElementById("enemySelect").value;
    const enemy = enemyData[activeEnemyKey];
    enemy.currentHp = enemy.maxHp; 
    updateEnemyUI();
}

function updateEnemyUI() {
    const enemy = enemyData[activeEnemyKey];
    document.getElementById("enemyName").innerText = `ศัตรู: ${enemy.name}`;
    document.getElementById("enemyHpText").innerText = `${enemy.currentHp} / ${enemy.maxHp}`;
    const percent = (enemy.currentHp / enemy.maxHp) * 100;
    document.getElementById("hpBar").style.width = `${percent}%`;
}

function updateSPUI() {
    document.getElementById("spDisplay").innerText = currentSP;
}

function updateSkillOptions() {
    const skillSelect = document.getElementById("skillSelect");
    skillSelect.innerHTML = ""; 

    donData[selectedIdentityKey].skills.forEach((skill, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.text = `${skill.name} (Base: ${skill.basePower} | Coin: +${skill.coinBonus} x ${skill.coinCount})`;
        skillSelect.appendChild(option);
    });
}

function executeCoinToss() {
    const skillIndex = document.getElementById("skillSelect").value;
    const tossButton = document.getElementById("tossButton");
    const backBtn = document.getElementById("backBtn");

    const selectedIdentity = donData[selectedIdentityKey];
    const selectedSkill = selectedIdentity.skills[skillIndex];
    
    // โอกาสออกหัวคำนวณจากค่าสติปัจจุบัน (Base 50% + currentSP)
    const headChance = 50 + currentSP; 

    tossButton.disabled = true;
    backBtn.disabled = true;
    document.getElementById("resultBox").style.display = "none";
    
    const coinStage = document.getElementById("coinStage");
    coinStage.innerHTML = ""; 

    for (let i = 1; i <= selectedSkill.coinCount; i++) {
        const coinWrapper = document.createElement("div");
        coinWrapper.className = "coin-wrapper";
        coinWrapper.innerHTML = `
            <div class="coin-inner spinning" id="coin-${i}">
                <div class="coin-face coin-front">HEAD</div>
                <div class="coin-face coin-back">TAIL</div>
            </div>
        `;
        coinStage.appendChild(coinWrapper);
    }

    let currentPower = selectedSkill.basePower;
    let detailsHTML = "";
    let headsCount = 0;

    for (let i = 1; i <= selectedSkill.coinCount; i++) {
        setTimeout(() => {
            const coinInner = document.getElementById(`coin-${i}`);
            coinInner.classList.remove("spinning");

            const roll = Math.random() * 100;
            let isHead = roll < headChance;

            if (isHead) {
                coinInner.style.transform = "rotateY(0deg)";
                currentPower += selectedSkill.coinBonus;
                headsCount++;
                detailsHTML += `เหรียญที่ ${i}: <span class="coin-text head-text">● หัว (Heads)</span> (+${selectedSkill.coinBonus})<br>`;
            } else {
                coinInner.style.transform = "rotateY(180deg)";
                detailsHTML += `เหรียญที่ ${i}: <span class="coin-text tail-text">○ ก้อย (Tails)</span> (+0)<br>`;
            }

            if (i === selectedSkill.coinCount) {
                setTimeout(() => {
                    let totalDamage = currentPower * (1 + (headsCount * 0.2));
                    totalDamage = Math.floor(totalDamage);

                    const enemy = enemyData[activeEnemyKey];
                    enemy.currentHp -= totalDamage;
                    if (enemy.currentHp < 0) enemy.currentHp = 0;
                    
                    updateEnemyUI();

                    // คำนวณเพิ่มค่าสติสะสมหลังการโจมตีตามอัตราของตัวละครนั้นๆ
                    const previousSP = currentSP;
                    currentSP += selectedIdentity.spGain;
                    if (currentSP > 45) currentSP = 45; // ล็อคไม่ให้เกิน 45 ตามกฎเกม
                    
                    updateSPUI(); // อัปเดตตัวเลขสติบนหน้าจอ

                    document.getElementById("flavorText").innerText = selectedIdentity.flavor;
                    document.getElementById("tossDetails").innerHTML = detailsHTML;
                    document.getElementById("finalPowerResult").innerHTML = `พลังรวมสุดท้าย (Final Power): ${currentPower}`;
                    
                    let spGainText = `<br><span style="color: #4caf50; font-size:14px;">(จิตใจฮึกเหิม! ค่าสติเพิ่มขึ้น +${selectedIdentity.spGain} SP จากการปะทะ)</span>`;
                    
                    if(enemy.currentHp === 0) {
                        document.getElementById("damageResult").innerHTML = `💥 โจมตีแรงกระแทก ${totalDamage} ดาเมจ! ${spGainText} <br>🎉 ศัตรูพ่ายแพ้ราบคาบด้วยพลังแห่งความยุติธรรม!`;
                    } else {
                        document.getElementById("damageResult").innerHTML = `💥 สร้างความเสียหาย ${totalDamage} ดาเมจ แก่ศัตรู! ${spGainText}`;
                    }
                    
                    document.getElementById("resultBox").style.display = "block";
                    tossButton.disabled = false;
                    backBtn.disabled = false;
                }, 300);
            }
        }, i * 400);
    }
}

initCharacterSelection();
updateEnemyUI();