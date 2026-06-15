const donData = {
    wCorp: {
        name: "W Corp. L3 Cleanup Agent Don Quixote",
        flavor: "“ชาร์จพลังสายฟ้าพร้อมตัดมิติ! วิ่งทะลวงไปเลย!”",
        skills: [
            { name: "Overcharge", basePower: 3, coinBonus: 4, coinCount: 4 },
            { name: "Rip Space (Max Charge)", basePower: 1, coinBonus: 3, coinCount: 5 }
        ]
    },
    cinq: {
        name: "Cinq Assoc. South Section 5 Director Don Quixote",
        flavor: "“ข้าแต่ศัตรูผู้โง่เขลา! จงรับเพลงดาบเอเป้อันรวดเร็วของข้าไปเสีย!”",
        skills: [
            { name: "Salut", basePower: 4, coinBonus: 4, coinCount: 3 },
            { name: "Fleche", basePower: 6, coinBonus: 3, coinCount: 4 }
        ]
    },
    middleSister: {
        name: "The Middle Little Sister Don Quixote",
        flavor: "“ใครที่บังอาจทำให้พี่น้องของข้าต้องหลั่งน้ำตา... มันต้องถูกบันทึกในสมุดแค้น!”",
        skills: [
            { name: "Vengeance Fret", basePower: 3, coinBonus: 3, coinCount: 3 },
            { name: "Trust the Book!", basePower: 4, coinBonus: 4, coinCount: 4 }
        ]
    },
    lantern: {
        name: "Lantern E.G.Oist Don Quixote",
        flavor: "“ฮี่ๆ... กลิ่นเนื้อหอมๆ ในป่าใหญ่... ข้าจะกัดกินเจ้าให้หมดเลย!”",
        skills: [
            { name: "I'll Bite You", basePower: 5, coinBonus: 3, coinCount: 2 },
            { name: "Be Quiet, Forest", basePower: 4, coinBonus: 4, coinCount: 3 }
        ]
    },
    kCorp: {
        name: "K Corp. Class 3 Excision Staff Don Quixote",
        flavor: "“ด้วยพลังแห่งแอมพูลสีเขียวนี้! บาดแผลของข้าจะฟื้นฟูอย่างไร้ขีดจำกัด!”",
        skills: [
            { name: "HP Ampule Injection", basePower: 5, coinBonus: 2, coinCount: 2 },
            { name: "Excision Protocol", basePower: 4, coinBonus: 3, coinCount: 3 }
        ]
    },
    bladeLineage: {
        name: "Blade Lineage Salsu Don Quixote",
        flavor: "“เพลงดาบสังหารสไตล์ซัลซู... ข้าจะฟาดฟันเสื้อคลุมฮันบกนี้ให้สะบัด!”",
        skills: [
            { name: "Draw to the Hilt", basePower: 5, coinBonus: 2, coinCount: 2 },
            { name: "Aching Feather", basePower: 4, coinBonus: 5, coinCount: 3 }
        ]
    },
    tciAssoc: {
        name: "TCI Association Section 4 Don Quixote",
        flavor: "“ตรวจพบช่องโหว่ทางยุทธวิธีแล้วค่ะผู้จัดการ! กำลังดำเนินมาตรการขั้นเด็ดขาด!”",
        skills: [
            { name: "Focus Fire", basePower: 4, coinBonus: 3, coinCount: 3 },
            { name: "Tactical Breakthrough", basePower: 3, coinBonus: 5, coinCount: 4 }
        ]
    },
    base: {
        name: "Shi Assoc. South Section 5 Don Quixote",
        flavor: "“ถึงแม้ร่างกายจะเหนื่อยล้า... แต่ข้าจะก้าวข้ามขีดจำกัดแห่งความตาย!”",
        skills: [
            { name: "Boundary of Death", basePower: 1, coinBonus: 44, coinCount: 1 },
            { name: "Flashing Strike", basePower: 4, coinBonus: 4, coinCount: 3 }
        ]
    }
};

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

// ฟังก์ชันหลักที่เพิ่มระบบแอนิเมชันหมุนเหรียญ
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

    // ล็อคปุ่มไม่ให้กดซ้ำระหว่างหมุน
    tossButton.disabled = true;
    document.getElementById("resultBox").style.display = "none";
    
    const coinStage = document.getElementById("coinStage");
    coinStage.innerHTML = ""; // ล้างเหรียญเก่า

    // สร้าง Element เหรียญหมุนจำลองบนหน้าจอ
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

    // ค่อยๆ หยุดหมุนทีละเหรียญแบบมีดีเลย์สไตล์เกม
    for (let i = 1; i <= selectedSkill.coinCount; i++) {
        setTimeout(() => {
            const coinInner = document.getElementById(`coin-${i}`);
            coinInner.classList.remove("spinning"); // หยุดแอนิเมชันหมุนเร็ว

            const roll = Math.random() * 100;
            let isHead = roll < headChance;

            if (isHead) {
                coinInner.style.transform = "rotateY(0deg)"; // หยุดที่หน้าหัว (ทอง)
                currentPower += selectedSkill.coinBonus;
                headsCount++;
                detailsHTML += `เหรียญที่ ${i}: <span class="coin-text head-text">● หัว (Heads)</span> (+${selectedSkill.coinBonus})<br>`;
            } else {
                coinInner.style.transform = "rotateY(180deg)"; // หยุดที่หน้าก้อย (เงิน)
                detailsHTML += `เหรียญที่ ${i}: <span class="coin-text tail-text">○ ก้อย (Tails)</span> (+0)<br>`;
            }

            // ถ้าเป็นเหรียญสุดท้าย ให้สรุปผลลัพธ์การต่อสู้ทั้งหมดออกมา
            if (i === selectedSkill.coinCount) {
                setTimeout(() => {
                    document.getElementById("flavorText").innerText = selectedIdentity.flavor;
                    document.getElementById("tossDetails").innerHTML = detailsHTML;
                    document.getElementById("finalPowerResult").innerHTML = `พลังรวมสุดท้าย (Final Power): <span style="color:#ffeb3b;">${currentPower}</span><br><span style="font-size:14px; color:#aaa;">(ทอยได้หัวทั้งหมด ${headsCount} จาก ${selectedSkill.coinCount} เหรียญ)</span>`;
                    document.getElementById("resultBox").style.display = "block";
                    tossButton.disabled = false; // ปลดล็อคปุ่ม
                }, 300);
            }
        }, i * 400); // ดีเลย์เพิ่มทีละ 0.4 วินาทีต่อหนึ่งเหรียญ
    }
}

updateSkillOptions();