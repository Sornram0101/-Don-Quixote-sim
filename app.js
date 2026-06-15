// ข้อมูลสกิลของ Don Quixote แต่ละ Identity
const donData = {
    wCorp: {
        name: "W Corp. L3 Cleanup Agent Don Quixote",
        skills: [
            { name: "Overcharge", basePower: 3, coinBonus: 4, coinCount: 4 }, // สกิลทำดาเมจหลักสุดแรง
            { name: "Rip Space (Max Charge)", basePower: 1, coinBonus: 3, coinCount: 5 }
        ]
    },
    cinq: {
        name: "Cinq Assoc. Director Don Quixote",
        skills: [
            { name: "Salut", basePower: 4, coinBonus: 4, coinCount: 3 },
            { name: "Fleche", basePower: 6, coinBonus: 3, coinCount: 4 }
        ]
    },
    base: {
        name: "Shi Assoc. Don Quixote",
        skills: [
            { name: "Boundary of Death", basePower: 1, coinBonus: 44, coinCount: 1 }, // แซวสกิลในตำนาน
            { name: "Flashing Strike", basePower: 4, coinBonus: 4, coinCount: 3 }
        ]
    }
};

// ฟังก์ชันอัปเดตรายชื่อสกิลตาม Identity ที่เลือก
function updateSkillOptions() {
    const identityKey = document.getElementById("identitySelect").value;
    const skillSelect = document.getElementById("skillSelect");
    skillSelect.innerHTML = ""; // ล้างค่าเก่า

    donData[identityKey].skills.forEach((skill, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.text = `${skill.name} (Base: ${skill.basePower} | Coin: +${skill.coinBonus} x ${skill.coinCount})`;
        skillSelect.appendChild(option);
    });
}

// ฟังก์ชันจำลองการทอยเหรียญ
function executeCoinToss() {
    const identityKey = document.getElementById("identitySelect").value;
    const skillIndex = document.getElementById("skillSelect").value;
    let sp = parseInt(document.getElementById("spInput").value);

    // ป้องกันกรณีป้อนค่า SP เกินกำหนด
    if (sp > 45) sp = 45;
    if (sp < -45) sp = -45;

    const selectedSkill = donData[identityKey].skills[skillIndex];
    
    // คำนวณโอกาสออกหัว (Base 50% + SP% เช่น SP 45 จะมีโอกาสออกหัว 50 + 45 = 95%)
    const headChance = 50 + sp; 

    let currentPower = selectedSkill.basePower;
    let detailsHTML = "";
    let headsCount = 0;

    // เริ่มทอยเหรียญทีละเหรียญ
    for (let i = 1; i <= selectedSkill.coinCount; i++) {
        const roll = Math.random() * 100; // สุ่ม 0.00 - 99.99
        let isHead = roll < headChance;

        if (isHead) {
            currentPower += selectedSkill.coinBonus;
            headsCount++;
            detailsHTML += `เหรียญที่ ${i}: <span class="coin head">หัว (Heads)</span> (+${selectedSkill.coinBonus})<br>`;
        } else {
            detailsHTML += `เหรียญที่ ${i}: <span class="coin tail">ก้อย (Tails)</span> (+0)<br>`;
        }
    }

    // แสดงผลลัพธ์บนหน้าเว็บ
    document.getElementById("tossDetails").innerHTML = detailsHTML;
    document.getElementById("finalPowerResult").innerHTML = `พลังโจมตีสุทธิ (Final Power): ${currentPower} (ออกหัว ${headsCount}/${selectedSkill.coinCount} เหรียญ)`;
    document.getElementById("resultBox").style.display = "block";
}

// เรียกใช้งานครั้งแรกตอนโหลดหน้าเว็บ
updateSkillOptions();