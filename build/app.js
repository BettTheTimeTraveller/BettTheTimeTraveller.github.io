const idb = require('./idb');

const fromCurrencies = document.querySelector('#fromCurr');
const toCurrencies = document.querySelector('#toCurr');
const inputCurrency = document.querySelector('#queryCurrency');
const outputCurrency = document.querySelector('#resCurrency');
const convertButton = document.querySelector('#convert');
const errorSpan = document.querySelector('#error');

let fromValue = fromCurrencies.value;
let toValue = toCurrencies.value;

window.addEventListener('load', e => {
    queryCurrency.focus();
    fetchCurrencies();

    if (idb) {
        console.log('there');
    } else {
        console.log('Not there');
    }

    fromCurrencies.addEventListener('change', e => {
        fromValue = e.target.value;
    });

    toCurrencies.addEventListener('change', e => {
        toValue = e.target.value;
    });

    convertButton.addEventListener('click', () => {
        errorSpan.innerHTML = '';
        if (inputCurrency.value) {
            convertCurrency(fromValue, toValue);
            queryCurrency.focus();
        } else {
            errorSpan.innerHTML = '**ERROR: Empty input field**';
        }
    });

    //regstration of serviceWorker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(() => console.log('serviceWorker Registered')).catch(() => console.log('serviceWorker Registration Failed'));
    }
});

async function fetchCurrencies() {
    const curs = await fetch(`https://free.currencyconverterapi.com/api/v5/currencies`);
    const json = await curs.json();

    function* values(obj) {
        for (let prop of Object.keys(obj)) yield obj[prop];
    }

    let jsonData = Array.from(values(json.results));

    fromCurrencies.innerHTML = jsonData.map(opts => `<option value="${opts.id}">${opts.currencyName} (${opts.currencySymbol})</option>`);
    toCurrencies.innerHTML = jsonData.map(opts => `<option value="${opts.id}">${opts.currencyName} (${opts.currencySymbol})</option>`);
}

async function convertCurrency(from, to) {

    const res = await fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${from}_${to}&compact=ultra`);
    const json = await res.json();
    const rate = json[`${from}_${to}`];

    outputCurrency.value = (inputCurrency.value * rate).toFixed(2);
}