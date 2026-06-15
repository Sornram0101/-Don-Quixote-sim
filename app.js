// ข้อมูลสกิลของ Don 4 ตัวละครเด่น (ตัวละครละ 3 สกิลเต็มรูปแบบ)
const donData = {
    wCorp: {
        name: "W Corp. L3 Cleanup Agent Don Quixote",
        flavor: "“ตัดมิติและเคลียร์เส้นทาง! ชาร์จพลังสายฟ้าเต็มพิกัด!”",
        skills: [
            { name: "S1: Leap", basePower: 4, coinBonus: 2, coinCount: 2 },
            { name: "S2: Overcharge", basePower: 3, coinBonus: 4, coinCount: 4 },
            { name: "S3: Rip Space (MAX)", basePower: 1, coinBonus: 3, coinCount: 5 }
        ]
    },
    cinq: {
        name: "Cinq Assoc. Director Don Quixote",
        flavor: "“ข้าขอท้าดวลอย่างเป็นทางการ! จงรับการทิ่มแทงอันรวดเร็ว!”",
        skills: [
            { name: "S1: Attaque", basePower: 3, coinBonus: 3, coinCount: 2 },
            { name: "S2: Salut", basePower: 4, coinBonus: 4, coinCount: 3 },
            { name: "S3: Fleche", basePower: 6, coinBonus: 3, coinCount: 4 }
        ]
    },
    middleSister: {
        name: "The Middle Little Sister Don Quixote",
        flavor: "“การลบหลู่ครอบครัวของข้า... โทษทัณฑ์ของมันคือความเจ็บปวด!”",
        skills: [
            { name: "S1: Vengeance Fret", basePower: 3, coinBonus: 3, coinCount: 3 },
            { name: "S2: Trust the Book!", basePower: 4, coinBonus: 4, coinCount: 4 },
            { name: "S3: Claim Their Sins", basePower: 5, coinBonus: 5, coinCount: 3 }
        ]
    },
    base: {
        name: "Shi Assoc. Don Quixote",
        flavor: "“แม้ดาบจะบิ่นและแผลจะลึก แต่จิตวิญญาณแห่งอัศวินไม่เคยดับสิ้น!”",
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

let activeEnemyKey = "dummy";

// ฟังก์ชันเปิด/ปิดเพลงธีม
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

// อัปเดตเมนูเมื่อเปลี่ยนศัตรู
function changeEnemy() {
    activeEnemyKey = document.getElementById("enemySelect").value;
    const enemy = enemyData[activeEnemyKey];
    enemy.currentHp = enemy.maxHp; // รีเซ็ตเลือดใหม่ตอนเลือก
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
    const identityKey = document.getElementById("identitySelect").value;
    const skillSelect = document.getElementById("skillSelect");
    skillSelect.innerHTML = ""; 

    donData[identityKey].skills.forEach((skill, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.text = `${skill.name} (Base: ${skill.basePower} | Coin: +${skill.coinBonus} x ${skill.coinCount})`;
        skillSelect.appendChild(option);
    });
}

// ฟังก์ชันต่อสู้และหมุนเหรียญ
function executeCoinToss() {
    const identityKey = document.getElementById("identitySelect").value;
    const skillIndex = document.getElementById("skillSelect").value;
    const tossButton = document.getElementById("tossButton");
    let sp = parseInt(document.getElementById("spInput").value);

    if (sp > 45) sp = 45;
    if (sp < -45) sp = -45;

    const selectedIdentity = donData[identityKey];
    const selectedSkill = selectedIdentity.skills[skillIndex];
    const headChance = 50 + sp; 

    tossButton.disabled = true;
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
                    // คำนวณความเสียหายที่ทำได้จริง (พลังสุดท้าย x ตัวคูณโบนัสเหรียญหัว)
                    let totalDamage = currentPower * (1 + (headsCount * 0.2));
                    totalDamage = Math.floor(totalDamage);

                    // หักเลือดมอนสเตอร์
                    const enemy = enemyData[activeEnemyKey];
                    enemy.currentHp -= totalDamage;
                    if (enemy.currentHp < 0) enemy.currentHp = 0;
                    
                    // อัปเดต UI มอนสเตอร์
                    updateEnemyUI();

                    // อัปเดตกล่องบันทึก
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
                }, 300);
            }
        }, i * 400);
    }
}

// รันตั้งค่าเริ่มต้นตอนเปิดระบบ
updateSkillOptions();
updateEnemyUI();