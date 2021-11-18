let state = {};

chrome.runtime.onInstalled.addListener(() => {
    console.log('onInstalled...');
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.action) {
            case "set-state":
                state = request.state;
                sendResponse(state);
                break;
            case "get-state":
                sendResponse(state);
        }
    }
);


function helloWorld() {
    console.log("Hello, world!");
}