// let disparity = 0, amount = 500;

// for (let i = 0; i < amount; i++) {
    let arr = [{ username: 'Tornope', winrate: 0.5 }];
    
    // for (let i = 0; i < 10; i++) {
    //     arr.push({ username: 'Tornope', winrate: Number(Math.random().toFixed(5)) } );
    // }
    
//     arr.sort((a, b) => b.winrate - a.winrate);
    
//     const radiant = [];
//     const dire = [];
//     for (let i = 0; i < arr.length; i++) {
//         if (i % 2 === 0) radiant.push(arr[i]);
//         else dire.push(arr[i]);
//     }
        
//     let radiantAvg = radiant.reduce((a, b) => a + b.winrate, 0) / radiant.length;
//     let direAvg = dire.reduce((a, b) => a + b.winrate, 0) / dire.length;
        
//     let j = 1;
//     while (((Math.min(radiantAvg, direAvg) / Math.max(radiantAvg, direAvg)) < 0.93) && j < Math.floor(arr.length/2)) {
//         [radiant[radiant.length - j], dire[dire.length - j]] = [dire[dire.length - j], radiant[radiant.length - j]];
//         radiantAvg = radiant.reduce((a, b) => a + b.winrate, 0) / radiant.length;
//         direAvg = dire.reduce((a, b) => a + b.winrate, 0) / dire.length;
//         j++;
//     }
    
//     disparity = 1 - (Math.min(radiantAvg, direAvg) / Math.max(radiantAvg, direAvg));
// // }
// console.log(disparity);
// console.log((disparity * 100).toPrecision(2) + '%');

const evenlySplit = (arr) => {
    arr.sort((a, b) => b.winrate - a.winrate);
    const split = {
        radiant: [],
        dire: [],
        disparity: '0%'
    }

    for (let i = 0; i < arr.length; i++) {
        if (i % 2 === 0) split.radiant.push(arr[i]);
        else split.dire.push(arr[i]);
    }

    let radiantAvg = split.radiant.reduce((a, b) => a + b.winrate, 0) / split.radiant.length;
    let direAvg = split.dire.reduce((a, b) => a + b.winrate, 0) / split.dire.length;

    let j = 1;
    while (((Math.min(radiantAvg, direAvg) / Math.max(radiantAvg, direAvg)) < 0.93) && j < Math.floor(arr.length/2)) {
        [split.radiant[split.radiant.length - j], split.dire[split.dire.length - j]] = [split.dire[split.dire.length - j], split.radiant[split.radiant.length - j]];
        radiantAvg = split.radiant.reduce((a, b) => a + b.winrate, 0) / split.radiant.length;
        direAvg = split.dire.reduce((a, b) => a + b.winrate, 0) / split.dire.length;
        j++;
    }

    split.disparity = `${((1 - (Math.min(radiantAvg, direAvg) / Math.max(radiantAvg, direAvg)))*100).toPrecision(2)}%`

    if (split.disparity == `NaN%`) split.disparity = "0%";

    return split;
}
console.log(evenlySplit(arr));