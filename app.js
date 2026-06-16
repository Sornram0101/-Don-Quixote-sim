const donData = {
    wCorp: {
        name: "W Corp. L3 Cleanup Agent",
        desc: "สายชาร์จพลังสายฟ้า ไฮป์ง่ายมาก (สติเพิ่มขึ้น +15 ต่อการตี)",
        flavor: "“ตัดมิติและเคลียร์เส้นทาง! ชาร์จพลังสายฟ้าเต็มพิกัด!”",
        spGain: 15,
        maxHp: 180,
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
        maxHp: 210,
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
        maxHp: 240,
        skills: [
            { name: "S1: Vengeance Fret", basePower: 3, coinBonus: 3, coinCount: 3 },
            { name: "S2: Trust the Book!", basePower: 4, coinBonus: 4, coinCount: 4 },
            { name: "S3: Claim Their Sins", basePower: 5, coinBonus: 5, coinCount: 3 }
        ]
    },
    base: {
        name: "Shi Assoc. South Section 5",
        desc: "สายก้ามข้ามความตาย ร่างกายอ่อนล้าทำให้สติขึ้นช้า (สติเพิ่มขึ้น +8 ต่อการตี)",
        flavor: "“ถึงแม้ร่างกายจะเหนื่อยล้า... แต่ข้าจะก้าวข้ามขีดจำกัดแห่งความตาย!”",
        spGain: 8,
        maxHp: 160,
        skills: [
            { name: "S1: Extreme Edge", basePower: 4, coinBonus: 2, coinCount: 2 },
            { name: "S2: Flashing Strike", basePower: 4, coinBonus: 4, coinCount: 3 },
            { name: "S3: Boundary of Death", basePower: 1, coinBonus: 44, coinCount: 1 }
        ]
    }
};

const enemyData = {
    dummy: { name: "หุ่นซ้อมรบธรรมดา", maxHp: 100, currentHp: 100, minAtk: 5, maxAtk: 12, attackName: "พุ่งชนทื่อๆ" },
    pequod: { name: "ลูกเรือ Pequod Town", maxHp: 250, currentHp: 250, minAtk: 15, maxAtk: 28, attackName: "แทงด้วยฉมวกขึ้นสนิม" },
    windmill: { name: "ยักษ์กังหันลมในจินตนาการ (BOSS)", maxHp: 600, currentHp: 600, minAtk: 30, maxAtk: 55, attackName: "ใบพัดยักษ์บดขยี้ความฝัน" }
};

let selectedIdentityKey = "";
let activeEnemyKey = "dummy";
let currentSP = 0; 
let playerCurrentHp = 100;
let playerMaxHp = 100;

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
    
    // ตั้งค่า HP ดอนกิฮอเต้ตาม Identity
    playerMaxHp = donData[selectedIdentityKey].maxHp;
    playerCurrentHp = playerMaxHp;
    
    currentSP = 0;
    updateSPUI();
    updatePlayerUI();
    
    // รีเซ็ตศัตรูใหม่
    changeEnemy();
    
    document.getElementById("resultBox").style.display = "none";
    document.getElementById("coinStage").innerHTML = "";
    updateSkillOptions();
    document.getElementById("tossButton").disabled = false;
}

function goToSelectScreen() {
    document.getElementById("battleScreen").classList.remove("active-screen");
    document.getElementById("selectScreen").classList.add("active-screen");
}

function toggleMusic() {
    const music = document.getElementById("themeMusic");
    const btn = document.getElementById("musicBtn");
    
    // ตรวจสอบความปลอดภัยกรณีเบราว์เซอร์หาชื่อไฟล์เดิมไม่เจอ ให้พยายามโหลดใหม่
    if(music.error) {
        music.load(); 
    }

    if (music.paused) {
        music.play().then(() => {
            btn.innerText = "⏸️ PAUSE THEME: \"HERO\"";
            btn.style.backgroundColor = "#ff9800";
        }).catch(err => {
            console.log("Audio play blocked/failed:", err);
            alert("กรุณากดคลิกบนหน้าจอเกมสัก 1 ครั้งก่อน แล้วกดเปิดเพลงใหม่อีกรอบนะครับผู้จัดการ!");
        });
    } else {
        music.pause();
        btn.style.backgroundColor = "#ff4500";
        btn.innerText = "🔥 PLAY THEME: \"HERO\" (DON QUIXOTE)";
    }
}

function changeEnemy() {
    activeEnemyKey = document.getElementById("enemySelect").value;
    const enemy = enemyData[activeEnemyKey];
    enemy.currentHp = enemy.maxHp; 
    updateEnemyUI();
    
    // ปลดล็อคปุ่มสู้หากเลือดมอนสเตอร์ยังไม่เป็น 0
    if(playerCurrentHp > 0) {
        document.getElementById("tossButton").disabled = false;
    }
}

function updateEnemyUI() {
    const enemy = enemyData[activeEnemyKey];
    document.getElementById("enemyName").innerText = `ศัตรู: ${enemy.name}`;
    document.getElementById("enemyHpText").innerText = `${enemy.currentHp} / ${enemy.maxHp}`;
    const percent = (enemy.currentHp / enemy.maxHp) * 100;
    document.getElementById("hpBar").style.width = `${percent}%`;
}

function updatePlayerUI() {
    document.getElementById("playerHpText").innerText = `${playerCurrentHp} / ${playerMaxHp}`;
    const percent = (playerCurrentHp / playerMaxHp) * 100;
    document.getElementById("playerHpBar").style.width = `${percent}%`;
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
    const headChance = 50 + currentSP; 

    tossButton.disabled = true;
    backBtn.disabled = true;
    document.getElementById("resultBox").style.display = "none";
    document.getElementById("enemyResponseResult").innerText = "";
    
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

            // เมื่อทอยครบทุกเหรียญ: คำนวณดาเมจฝ่ายเรา -> มอนสเตอร์ตีสวน
            if (i === selectedSkill.coinCount) {
                setTimeout(() => {
                    let totalDamage = currentPower * (1 + (headsCount * 0.2));
                    totalDamage = Math.floor(totalDamage);

                    const enemy = enemyData[activeEnemyKey];
                    enemy.currentHp -= totalDamage;
                    if (enemy.currentHp < 0) enemy.currentHp = 0;
                    
                    updateEnemyUI();

                    currentSP += selectedIdentity.spGain;
                    if (currentSP > 45) currentSP = 45; 
                    updateSPUI(); 

                    document.getElementById("flavorText").innerText = selectedIdentity.flavor;
                    document.getElementById("tossDetails").innerHTML = detailsHTML;
                    document.getElementById("finalPowerResult").innerHTML = `พลังรวมสุดท้าย (Final Power): ${currentPower}`;
                    
                    let spGainText = `<br><span style="color: #4caf50; font-size:13px;">(จิตวิญญาณอัศวินตื่นรู้! ค่าสติเพิ่มขึ้น +${selectedIdentity.spGain} SP)</span>`;
                    
                    document.getElementById("damageResult").innerHTML = `💥 ดอนกิฮอเต้สร้างความเสียหาย ${totalDamage} ดาเมจ แก่ศัตรู! ${spGainText}`;
                    document.getElementById("resultBox").style.display = "block";

                    // บล็อกตรวจสอบชัยชนะหรือเข้าสู่เทิร์นศัตรู
                    if (enemy.currentHp === 0) {
                        document.getElementById("damageResult").innerHTML += `<br><br><span style="color: #ffeb3b; font-size: 20px;">🎉 ชัยชนะเป็นของพวกเรา! ศัตรูพ่ายแพ้ราบคาบ บทเพลงแห่ง HERO ได้ขับขานเพื่อความยุติธรรมแล้ว!</span>`;
                        tossButton.disabled = true;
                        backBtn.disabled = false;
                    } else {
                        // --- ศัตรูเริ่มสวนกลับทันทีหลังโดนโจมตี ---
                        document.getElementById("enemyResponseResult").innerHTML = `<span class="enemy-turn-alert">⚠️ เทิร์นของศัตรู! กำลังเตรียมจู่โจมสวนกลับ...</span>`;
                        
                        setTimeout(() => {
                            const enemyAtkRange = enemy.maxAtk - enemy.minAtk;
                            let enemyDamage = enemy.minAtk + Math.floor(Math.random() * enemyAtkRange);
                            
                            // ระบบสุ่มหลบหลีก/ป้องกันของดอนกิฮอเต้ตามระดับความโชคดี (SP)
                            const dodgeRoll = Math.random() * 100;
                            if (dodgeRoll < (20 + currentSP * 0.5)) { 
                                enemyDamage = Math.floor(enemyDamage * 0.3); // ป้องกันสำเร็จ ดาเมจเบาลงเยอะมาก
                                document.getElementById("enemyResponseResult").innerHTML = `🛡️ ดอนกิฮอเต้ตั้งการ์ดทัน! ศัตรูใช้ท่า [${enemy.attackName}] โจมตีเบาลง เหลือเพียง ${enemyDamage} ดาเมจ!`;
                            } else {
                                document.getElementById("enemyResponseResult").innerHTML = `❌ โดนสวนกลับ! ศัตรูใช้ท่า [${enemy.attackName}] อัดกระแทกเข้าเต็ม ๆ ได้รับความเสียหาย ${enemyDamage} ดาเมจ!`;
                            }
                            
                            playerCurrentHp -= enemyDamage;
                            if (playerCurrentHp < 0) playerCurrentHp = 0;
                            updatePlayerUI();
                            
                            // เช็คเงื่อนไข Game Over
                            if(playerCurrentHp === 0) {
                                document.getElementById("enemyResponseResult").innerHTML += `<br><br><span style="color: #f44336; font-size: 20px;">💀 GAME OVER! ดอนกิฮอเต้หมดสติในสมรภูมิ... ลองเปลี่ยน Identity หรือกลับมาท้าทายใหม่อีกครั้งนะผู้จัดการ!</span>`;
                                currentSP = -15; // หักแต้มสติเมื่อพ่ายแพ้
                                if (currentSP < -45) currentSP = -45;
                                updateSPUI();
                                tossButton.disabled = true;
                            } else {
                                tossButton.disabled = false;
                            }
                            backBtn.disabled = false;
                        }, 1200);
                    }
                }, 300);
            }
        }, i * 400);
    }
}

initCharacterSelection();
updateEnemyUI();