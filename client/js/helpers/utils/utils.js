import moment from 'moment';
import requestUtils from './request-utils';

const utils = Object.assign({
    uploadFile,
    capitalizeString,
    formatDate,
    formatDateInterval,
    getPercentFromTotal,
    roundNumber,
    formatNumber,
    formatMoney,
    formatFileSize,
    getQueryStringParamValue,
    compareDates,
    compareValues,
    copyTextToClipboard,
    moment,
    prepareDownloadFileName
}, requestUtils);

async function uploadFile(file, url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        const data = new FormData();

        xhr.onload = (e) => {
            resolve(JSON.parse(e.target.response));
        };

        xhr.open('post', url, true);
        data.append('file', file, file.name);
        xhr.send(data);
    });
}

function capitalizeString(str) {
    return str[0].toUpperCase() + str.substring(1);
};

function formatDate(date, format='MM.DD.YYYY') {
    if(!date) {
        return '';
    }
    return moment(date).format(format);
};

function formatDateInterval(startDate, endDate, separator='-', format='MM.DD.YYYY') {
    return `${formatDate(startDate, format)} ${separator} ${formatDate(endDate, format)}`;
}

function getPercentFromTotal(val, total, precision=2) {
    if(!total) {
        return 0;
    }

    return roundNumber(val / total * 100, precision);
};

function roundNumber(num, precision=2) {
    num += 0.0000001;
    const multiplier = Math.pow(10, precision);
    return Math.trunc(num * multiplier) / multiplier;
};

function formatNumber(val, allowZeroFractionalPart) {
    if(isNaN(parseFloat(val))) {
        return val;
    }
    const splittedVal = val.toString().split('.');
    const hasFractionalPart = splittedVal[1] && (parseFloat(splittedVal[1].substring(0, 2)) > 0 || allowZeroFractionalPart);
    const fractionalPart = hasFractionalPart ? '.' + splittedVal[1].substring(0, 2) : '';
    const formattedNum = splittedVal[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + fractionalPart;

    return formattedNum;
};

function formatMoney(val) {
    return formatNumber(val) + ' ₽';
}

function formatFileSize(val) {
    const sizeNames = ['B', 'KB', 'MB', 'GB'];
    let depthIndex = 0;
    while(val / 1024 > 1) {
        depthIndex++;
        val = val / 1024;
    }

    return `${parseInt(val)} ${sizeNames[depthIndex]}`;
}

function getQueryStringParamValue(paramName) {
    const regExp = new RegExp(`${paramName}=\\S+`);
    const queryParam = location.href.match(regExp);
    if(!queryParam) {
        return null;
    }
    return queryParam[0].replace(`${paramName}=`, '');
};

function compareDates(date1, date2, comparisonType='eq') {
    date1 = date1 instanceof Date ? date1 : new Date(date1);
    date2 = date2 instanceof Date ? date2 : new Date(date2);
    return compareValues(date1, date2, comparisonType);
};

function compareValues(val1, val2, comparisonType='lt') {
    val1 = prepareValToCompare(val1, comparisonType);
    val2 = prepareValToCompare(val2, comparisonType);

    if(comparisonType === 'lt') {
        return val1 < val2;
    } else if(comparisonType === 'lt_or_eq') {
        return val1 <= val2;
    } else if(comparisonType === 'gt') {
        return val1 > val2;
    } else if(comparisonType === 'gt_or_eq') {
        return val1 >= val2;
    } else if(comparisonType === 'eq') {
        return val1 == val2;
    } else if(comparisonType === 'in') {
        return val2.indexOf(val1) > -1;
    }
};

function prepareValToCompare(val, comparisonType) {
    if(typeof val === 'string') {
        if(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z/.test(val)) {
            return new Date(val);
        }
        if(parseFloat(val) == val && comparisonType !== 'in') {
            return parseFloat(val);
        }
    }
    return val;
};

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = 0;
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;

    document.body.appendChild(textArea);

    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch(err) {
    }

    document.body.removeChild(textArea);
};

function prepareDownloadFileName(fileName) {
    return fileName.replace(/[\/\\\s]/g, '_');
};

export default utils;