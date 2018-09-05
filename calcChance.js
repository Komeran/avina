/**
 * @author marc.schaefer
 * @date 29.08.2018
 */

let systemsChance = 0.0909;
let chassisChance = 0.0564;
let chassisLuaChance = 0.0737;
let neuropticsChance = 0.0752;
let blueprintChance = 0.0752;

function printGuaranteedSpyMissions(chancePerDataVault) {
    let currentTotalChance = chancePerDataVault;
    let vaultCount = 0;
    let printedHalf = false;
    do {
        currentTotalChance += Math.pow((1-chancePerDataVault),  vaultCount) * chancePerDataVault;
        vaultCount++;
        if(!printedHalf && currentTotalChance >= .5) {
            printedHalf = vaultCount;
        }
        let percentBar = vaultCount + (vaultCount/10 >= 1 ? "" : " ");
        for(let i = 0; i/100 < currentTotalChance; i++) {
            percentBar+="-";
        }
        //console.log(percentBar);
    } while(currentTotalChance < 0.9999);
    console.log("Guaranteed after " + vaultCount + " missions!");
    console.log("50% chance after " + printedHalf + " missions!");
}

console.log("Systems");
printGuaranteedSpyMissions(systemsChance);
console.log("Chassis");
printGuaranteedSpyMissions(chassisChance);
console.log("Chassis on Lua");
printGuaranteedSpyMissions(chassisLuaChance);
console.log("Neuroptics");
printGuaranteedSpyMissions(neuropticsChance);
console.log("Blueprint");
printGuaranteedSpyMissions(blueprintChance);