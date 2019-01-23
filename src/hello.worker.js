let helloInterval;

const sayHello = () => {
  self.postMessage({ message: 'Hello' }); // eslint-disable-line no-restricted-globals
};

self.addEventListener('message', event => { // eslint-disable-line no-restricted-globals
  if (event.data.run === true) {
    self.postMessage({ status: 'Worker started' }); // eslint-disable-line no-restricted-globals
    helloInterval = setInterval(sayHello, 1000);
  }

  if (event.data.run === false) {
    self.postMessage({ status: 'Worker stopped' }); // eslint-disable-line no-restricted-globals
    clearInterval(helloInterval);
  }
});
