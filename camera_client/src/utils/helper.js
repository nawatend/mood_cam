let removeAllElements = (array, elem) => {
    var index = array.indexOf(elem);
    while (index > -1) {
        array.splice(index, 1);
        index = array.indexOf(elem);
    }

    return array
}

export {
    removeAllElements
}