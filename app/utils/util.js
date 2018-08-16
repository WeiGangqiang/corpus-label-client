// 判断一个数是否在给定的数组区间
export const isArrayDomain = (arr, array) => {
    let flag = true;
    array.map((item) => {
        const arrItem = item.split(',');
        if (arr[0] >= arrItem[1] || arr[1] <= arrItem[0]) {
        } else {
            flag = false
        }
    })
    return flag
}

export const getIndexFromString = (words, string) => {
    for (var i = -1, arr = []; (i = string.indexOf(words, i + 1)) > -1; arr.push(i)) ;
    return arr
}

export const arrayToDisc = (arr, parentObj) => {

    let keyPath = arr[0].modelWord[0]

    let rightArray = arr.filter(item =>
        item.modelWord[0] == keyPath && item.modelWord[0]
    )

    let wrongArray = arr.filter(item => (item.modelWord[0] != keyPath && item.modelWord[0]))

    rightArray.map(item => item.modelWord.shift())

    if(keyPath){
        let sonObj = {
            key:arr[0].modelPath.replace(/\:/g,'').match('(.*)'+keyPath)[0],
            title:keyPath,
            children: [],
            intentId: arr[0].intentId,
            modelPath: arr[0].modelPath,
            name: arr[0].name,
            zhName: arr[0].zhName
        }
        if (parentObj) {
            parentObj.children.push(sonObj);
        }

        if(rightArray.length){
            arrayToDisc(rightArray, sonObj)
        }
    }

    if(wrongArray.length){
        arrayToDisc(wrongArray, parentObj);
    }
}

export const getDisc = (intent) => {
    intent.map(item => {
        item.modelWord = item.modelPath.replace(/\:/g,'/').split('/')
    })
    let discArr={
        key:'root',
        title:'root',
        children:[]
    }
    arrayToDisc(intent,discArr);
    return discArr
}