import idb from 'idb'

//create idb
let db = idb.open('CurrencyDb', 1, upgradeDb => {
    if (!upgradeDb.objectStoreNames.contains("Currencies")) {
        let currDb = upgradeDb.createObjectStore("Currencies", { keyPath: 'Id_currency', autoIncrement: true });
    }
    if (!upgradeDb.objectStoreNames.contains("conversionRates")) {
        let currDb = upgradeDb.createObjectStore("conversionRates", { keyPath: 'rateId' });
    }
});

//get & set DOM elements
const fromCurrencies = document.querySelector('#fromCurr');
const toCurrencies = document.querySelector('#toCurr');
const inputCurrency = document.querySelector('#queryCurrency');
const outputCurrency = document.querySelector('#resCurrency');
const convertButton = document.querySelector('#convert');
const errorSpan = document.querySelector('#error');


let fromValue = fromCurrencies.value;
let toValue = toCurrencies.value;

//when the window loads
window.addEventListener('load', e => {
    queryCurrency.focus();

    //registration of serviceWorker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(() => console.log('serviceWorker Registered')).catch(() => console.log('serviceWorker Registration Failed'));
    }

    //fetch the currencies
    fetchCurrencies();

    //when select option is changed
    fromCurrencies.addEventListener('change', e => {
        fromValue = e.target.value;
    });

    //when select option is changed
    toCurrencies.addEventListener('change', e => {
        toValue = e.target.value;
    });

    //when convert button is clicked
    convertButton.addEventListener('click', () => {
        errorSpan.innerHTML = '';
        if (inputCurrency.value) {
            convertCurrency(fromValue, toValue);
            queryCurrency.focus();
        } else {
            errorSpan.innerHTML = '**ERROR: Empty input field**';
        }
    });

});

async function fetchCurrencies() {
    await fetch(`https://free.currencyconverterapi.com/api/v5/currencies`)
        .then(async res => {

            const json = await res.json();

            let jsonData = Array.from(values(json.results));

            fromCurrencies.innerHTML = jsonData.map(opts => `<option value="${opts.id}">${opts.currencyName} (${opts.currencySymbol})</option>`);
            toCurrencies.innerHTML = jsonData.map(opts => `<option value="${opts.id}">${opts.currencyName} (${opts.currencySymbol})</option>`);


            //store or update the currencies in IDB
            db.then(database => {
                let transaction = database.transaction('Currencies', 'readwrite');
                let store = transaction.objectStore('Currencies');
                store.put(jsonData);
                return transaction.complete;
            }).then(() => {
                console.log("Currencies added");
            });


        }).catch(() => {
            //If there is no network connection
            //fetch currencies from IDB

            db.then(database => {
                let transaction = database.transaction('Currencies', 'readonly');
                let store = transaction.objectStore('Currencies');
                return store.getAll();
            }).then(json => {

                const jsonData = json[0];

                fromCurrencies.innerHTML = jsonData.map(opts => `<option value="${opts.id}">${opts.currencyName} (${opts.currencySymbol})</option>`);
                toCurrencies.innerHTML = jsonData.map(opts => `<option value="${opts.id}">${opts.currencyName} (${opts.currencySymbol})</option>`);
            });

        });
}



function* values(obj) {
    for (let prop of Object.keys(obj))
        yield obj[prop];
}


async function convertCurrency(from, to) {

    await fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${from}_${to}&compact=ultra`)
        .then(async res => {


            const json = await res.json();

            const rate = json[`${from}_${to}`];


            outputCurrency.value = (inputCurrency.value * parseFloat(rate)).toFixed(2);

            //store or update IDB
            db.then((database) => {
                let transaction = database.transaction('conversionRates', 'readwrite');
                let store = transaction.objectStore('conversionRates');
                store.put({ rateId: from + "_" + to, rate: rate });

                //Store the inverse-rate conversion too.
                store.put({ rateId: to + "_" + from, rate: (1 / parseFloat(rate)) });
                return transaction.complete;
            }).then(() => {
                console.log("Rates Added");
            });


        }).catch(() => {
            db.then((database) => {
                let transaction = database.transaction('conversionRates', 'readonly');
                let store = transaction.objectStore('conversionRates');
                return store.get(`${from}_${to}`);
            }).then((res) => {
                outputCurrency.value = (inputCurrency.value * parseFloat(res.rate)).toFixed(2);
            });

        });

}