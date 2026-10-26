let r1 = new Promise((resolve) => {resolve("完成1")});
let r2 = new Promise((reject) => {reject(new Error("失败2"))});
let r3 = new Promise((resolve) => {resolve("完成3")});

Promise.allSettled([r1, r2, r3]).then((results) => {
     results.forEach(function(result, index) {
        if (result.status === "fulfilled") {
            console.log("Promise " + index + ": " + result.value);
        } else {
            console.log("Promise " + index + ": " + result.reason.message);
        }
    });
});