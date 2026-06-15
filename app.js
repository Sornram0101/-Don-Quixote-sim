// ข้อมูลอัตลักษณ์ของ Don Quixote
const donData = {
    wCorp: {
        name: "W Corp. L3 Cleanup Agent",
        desc: "สายชาร์จพลังสายฟ้าและตัดมิติ ดาเมจเหรียญสุดท้ายแรงจัด",
        flavor: "“ตัดมิติและเคลียร์เส้นทาง! ชาร์จพลังสายฟ้าเต็มพิกัด!”",
        skills: [
            { name: "S1: Leap", basePower: 4, coinBonus: 2, coinCount: 2 },
            { name: "S2: Overcharge", basePower: 3, coinBonus: 4, coinCount: 4 },
            { name: "S3: Rip Space (MAX)", basePower: 1, coinBonus: 3, coinCount: 5 }
        ]
    },
    cinq: {
        name: "Cinq Assoc. South Section 5 Director",
        desc: "เน้นความเร็วและการดวล 1v1 ทอยเหรียญเสถียรมาก",
        flavor: "“ข้าขอท้าดวลอย่างเป็นทางการ! จงรับการทิ่มแทงอันรวดเร็ว!”",
        skills: [
            { name: "S1: Attaque", basePower: 3, coinBonus: 3, coinCount: 2 },
            { name: "S2: Salut", basePower: 4, coinBonus: 4, coinCount: 3 },
            { name: "S3: Fleche", basePower: 6, coinBonus: 3, coinCount: 4 }
        ]
    },
    middleSister: {
        name: "The Middle Little Sister",
        desc: "สายทุบทำลายล้างแค้น ยิ่งออกหัวยิ่งตึง",
        flavor: "“การลบหลู่ครอบครัวของข้า... โทษทัณฑ์ของมันคือความเจ็บปวด!”",
        skills: [
            { name: "S1: Vengeance Fret", basePower: 3, coinBonus: 3, coinCount: 3 },
            { name: "S2: Trust the Book!", basePower: 4, coinBonus: 4, coinCount: 4 },
            { name: "S3: Claim Their Sins", basePower: 5, coinBonus: 5, coinCount: 3 }
        ]
    },
    base: {
        name: "Shi Assoc. South Section 5",
        desc: "สายก้าวข้ามความตาย สกิล 3 ทอยติดหัวคือจบชีวิตศัตรูได้ในคราเดียว",
        flavor: "“ถึงแม้ร่างกายจะเหนื่อยล้า... แต่ข้าจะก้าวข้ามขีดจำกัดแห่งความตาย!”",
        skills: [
            { name: "S1: Extreme Edge", basePower: 4, coinBonus: 2, coinCount: 2 },
            { name: "S2: Flashing Strike", basePower: 4, coinBonus: 4, coinCount: 3 },
            { name: "S3: Boundary of Death", basePower: 1, coinBonus: 44, coinCount: 1 }
        ]
    }
};

// ข้อมูลมอนสเตอร์ศัตรู
const enemyData = {
    dummy: { name: "หุ่นซ้อมรบธรรมดา", maxHp: 100, currentHp: 100 },
    pequod: { name: "ลูกเรือ Pequod Town", maxHp: 250, currentHp: 250 },
    windmill: { name: "ยักษ์กังหันลมในจินตนาการ (BOSS)", maxHp: 600, currentHp: 600 }
};

let selectedIdentityKey = "";
let activeEnemyKey = "dummy";

// สร้าง UI รายชื่อการ์ดตัวละครในหน้าแรก
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

// ฟังก์ชันเลือกตัวละครเมื่อกดคลิกที่การ์ด
function selectCharacter(key) {
    selectedIdentityKey = key;
    
    // เคลียร์คลาสเก่าออกให้หมดก่อน
    document.querySelectorAll(".identity-card").forEach(c => c.classList.remove("selected"));
    
    // ไฮไลต์การ์ดที่เลือกปัจจุบัน
    document.getElementById(`card-${key}`).classList.add("selected");
    
    // เปิดให้กดปุ่มสู้ได้
    document.getElementById("startBattleBtn").disabled = false;
}

// สลับหน้าจอไปหน้าสู้
function goToBattleScreen() {
    document.getElementById("selectScreen").classList.remove("active-screen");
    document.getElementById("battleScreen").classList.add("active-screen");
    
    // ตั้งชื่อหัวเรื่องตัวละครที่ใช้
    document.getElementById("activeCharacterTitle").innerText = `กำลังควบคุม: ${donData[selectedIdentityKey].name}`;
    
    // รีเซ็ตสติเริ่มต้นที่ 0 และล้างผลลัพธ์เก่า
    document.getElementById("spInput").value = 0;
    document.getElementById("resultBox").style.display = "none";
    document.getElementById("coinStage").innerHTML = "";

    updateSkillOptions();
}

// กลับไปหน้าเลือกตัวละคร
function goToSelectScreen() {
    document.getElementById("battleScreen").classList.remove("active-screen");
    document.getElementById("selectScreen").classList.add("active-screen");
}

// เปิด/ปิดเพลงธีม
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

// สลับเป้าหมายศัตรู
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

// ตรรกะระบบต่อสู้และทอยเหรียญ
function executeCoinToss() {
    const skillIndex = document.getElementById("skillSelect").value;
    const tossButton = document.getElementById("tossButton");
    const backBtn = document.getElementById("backBtn");
    let sp = parseInt(document.getElementById("spInput").value);

    if (sp > 45) sp = 45;
    if (sp < -45) sp = -45;

    const selectedIdentity = donData[selectedIdentityKey];
    const selectedSkill = selectedIdentity.skills[skillIndex];
    const headChance = 50 + sp; 

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

                    document.getElementById("flavorText").innerText = selectedIdentity.flavor;
                    document.getElementById("tossDetails").innerHTML = detailsHTML;
                    document.getElementById("finalPowerResult").innerHTML = `พลังรวมสุดท้าย (Final Power): ${currentPower}`;
                    
                    if(enemy.currentHp === 0) {
                        document.getElementById("damageResult").innerHTML = `💥 โจมตีแรงกระแทก ${totalDamage} ดาเมจ! <br>🎉 ศัตรูพ่ายแพ้ราบคาบด้วยพลังแห่งความยุติธรรม!`;
                    } else {
                        document.getElementById("damageResult").innerHTML = `💥 สร้างความเสียหาย ${totalDamage} ดาเมจ แก่ศัตรู!`;
                    }
                    
                    document.getElementById("resultBox").style.display = "block";
                    tossButton.disabled = false;
                    backBtn.disabled = false;
                }, 300);
            }
        }, i * 400);
    }
}

// เริ่มต้นระบบ
initCharacterSelection();
updateEnemyUI();