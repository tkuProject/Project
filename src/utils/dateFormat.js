const dateToShow = date => {
    let res = '';
    const d = new Date(date);
    const paramYear = d.getFullYear();
    if(paramYear != new Date().getFullYear()) {
        res += paramYear + '/';
    }
    res += `${ d.getMonth()+1 }/${ d.getDate() }`;
    return res;
};

const dateToDateTime = date => {
    const month = date.getMonth()+1;
    const day = date.getDate();
    return `${ date.getFullYear() }-${ month>=10 ? month : ('0'+month) }-${ day>=10 ? day : ('0'+day) }`;
};

export { dateToShow, dateToDateTime };