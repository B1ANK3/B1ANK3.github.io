
const counter = {
    element: document.querySelector('.counter-inline'),
    loaded: false,
    publicIP: () => {
        return new Promise((resolve) => {
            fetch('https://api.ipify.org/?format=json')
                .then(response => response.json())
                .then(data => resolve(data.ip));
        })
    },
    visited: 0,
    setVisited: (val) => {
        if (typeof (val) != "number") throw new Error('Value is not of type number')
        if (val == counter.visited) return
        counter.visited = val
        counter.updateVisitorCounter()
    },
    getVisited: () => {
        return counter.visited
    },
    updateVisitorCounter: () => {
        if (counter.visited != counter.element.innerText) {
            if (counter.visited > counter.element.innerText) {
                // counter goes up add animation
            } else {
                // counter goes down
            }
            counter.element.innerText = counter.visited
        }
    }
}

// Set the configuration for your app
// TODO: Replace with your project's config object
var config = {
    apiKey: "AIzaSyCymYVoviPu_6tUI4TDfi0G-cKx2a-Lfw4",
    authDomain: "githubpages-counter.firebaseapp.com",
    // For databases not in the us-central1 location, databaseURL will be of the
    // form https://[databaseName].[region].firebasedatabase.app.
    // For example, https://your-database-123.europe-west1.firebasedatabase.app
    databaseURL: "https://githubpages-counter-default-rtdb.firebaseio.com/",
    storageBucket: "githubpages-counter.appspot.com",
    projectId: "githubpages-counter",
    storageBucket: "githubpages-counter.appspot.com",
    messagingSenderId: "25743868539",
    appId: "1:25743868539:web:870def717e5f109e7898de"
};

firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();
var dbRef = database.ref('/pageData')

dbRef.on('value', (snap) => {
    var snapData = snap.val()

    // User add 
    // counter.publicIP().then(ip => {
    //     // inc visited
    //     snapData.pageData.visited++

    //     // add user to array
    //     snapData.users.push({
    //         ipAddress: ip,
    //         time: Date.now()
    //     })
    // })

    console.log(snapData)
    snapData.visited++
    // set counter value
    counter.setVisited(snapData.visited ?? 0)

    if (!counter.loaded) {
        counter.loaded = true
        dbRef.set({
            visited: snapData.visited
        })
    }
}, (err) => {
    console.log('Error: ' + err.code)
})