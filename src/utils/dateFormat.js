const fillZero = num => {
    return num>=10 ? num : ('0'+num);
};

const dateToShow = date => {
    let res = '';
    const d = new Date(date);
    const paramYear = d.getFullYear();
    if(paramYear != new Date().getFullYear()) {
        res += paramYear + '/';
    }
    res += `${ d.getMonth()+1 }/${ d.getDate() } ${ fillZero(d.getHours()) }:${ fillZero(d.getMinutes()) }`;
    return res;
};

const dateToDateTime = date => {
    const month = date.getMonth()+1;
    const day = date.getDate();
    return `${ date.getFullYear() }-${ fillZero(month) }-${ fillZero(day) }`;
};

export { dateToShow, dateToDateTime };