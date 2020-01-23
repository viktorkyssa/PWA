let defferedPrompt = null;

if(!window.Promise) {
    window.Promise = Promise;
}

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(() => { // {scope: '/help/'} - we can override scope of sw
        console.log('Service Worker Refistered!');
    }).catch(err => {
        console.error('Registration SW Error: ', err);
    });
}

window.addEventListener('beforeinstallprompt', e => {
    console.log('beforeinstall prompt fired');
    e.preventDefault();
    defferedPrompt = e;
    return false;
});

let promise = new Promise((resolve, reject) => {
   setTimeout(() => {
       // resolve('RESOLVED PROMISE');
       reject({code: 500, message: 'Some error occurred!'});
   }, 3000);
});

promise.then(text => {
    return text + '!!!';
}).then(newText => {
    console.log(newText);
}).catch(err => {
    console.error(err.code, err.message);
});

fetch('https://httpbin.org/ip').then(res => res.json())
    .then(data => {
        console.log(data);
    }).catch(err => {
    console.error(err);
});

fetch('https://httpbin.org/post', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json', // tell server what kind of data we will send
        'Accept': 'application/json' // tell what kind of data we wait from server back
    },
    mode: 'cors', // no-corse
    body: JSON.stringify({message: 'Does this work?'})
})
.then(res => res.json())
.then(data => {
    console.log(data);
}).catch(err => {
    console.error(err);
});

