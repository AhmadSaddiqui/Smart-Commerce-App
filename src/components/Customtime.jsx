export const customtimer = (minute, second) => {
    let min = minute < 10 ? '0' + minute : minute
    let sec = second < 10 ? '0' + second : second
    return min + ': ' + sec
}

export const handleLargerText = (text, textLength) => {
    if (text?.length > textLength) {
        return text.substring(0, textLength).concat(' ...');
    } else {
        return text;
    }
};
