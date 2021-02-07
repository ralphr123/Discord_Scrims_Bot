// let disparity = 0, amount = 500;

// for (let i = 0; i < amount; i++) {
    let arr = [];
    
    for (let i = 0; i < 10; i++) {
        arr.push({ username: 'Tornope', winrate: Number(Math.random().toFixed(5)) } );
    }
    
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

const splitGroup = (arr, format = 'balanced') => {
    const split = {
        radiant: [],
        dire: [],
        disparity: '0%'
    }
    if (format === 'balanced') {
        arr.sort((a, b) => b.winrate - a.winrate);
    } else {
        let j = arr.length;
        console.log(arr);

        while (j) {
            let randomInd = Math.floor(Math.random() * j);
            j--;

            [arr[j], arr[randomInd]] = [arr[randomInd], arr[j]];
        }
        console.log(arr);

    }

    for (let i = 0; i < arr.length; i++) {
        if (i % 2 === 0) split.radiant.push(arr[i]);
        else split.dire.push(arr[i]);
    }

    let radiantAvg = split.radiant.reduce((a, b) => a + b.winrate, 0) / split.radiant.length;
    let direAvg = split.dire.reduce((a, b) => a + b.winrate, 0) / split.dire.length;

    if (format === 'balanced') {
        let j = 1;
        while (((Math.min(radiantAvg, direAvg) / Math.max(radiantAvg, direAvg)) < 0.93) && j < Math.floor(arr.length/2)) {
            [split.radiant[split.radiant.length - j], split.dire[split.dire.length - j]] = [split.dire[split.dire.length - j], split.radiant[split.radiant.length - j]];
            radiantAvg = split.radiant.reduce((a, b) => a + b.winrate, 0) / split.radiant.length;
            direAvg = split.dire.reduce((a, b) => a + b.winrate, 0) / split.dire.length;
            j++;
        }
    }

    split.disparity = `${((1 - (Math.min(radiantAvg, direAvg) / Math.max(radiantAvg, direAvg)))*100).toPrecision(2)}%`
    if (split.disparity == `NaN%`) split.disparity = "0%";

    return split;
}
console.log(splitGroup(arr, 'random'));