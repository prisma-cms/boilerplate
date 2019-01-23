
self.addEventListener('sync', function (event) {
  if (event.tag == 'myFirstSync') {

    console.log("myFirstSync");

    const doSomeStuff = async function () {

      return true;
    }

    event.waitUntil(doSomeStuff());
  }
});
