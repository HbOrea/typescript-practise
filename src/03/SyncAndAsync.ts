async function delay(ms: number): Promise<string> {
    return new Promise<string>((resolve) => {
        setTimeout(()=>{
            resolve("完成");
        }, ms)
    });
}

async function mainDemo() {
    console.time("顺序执行");
    await delay(500);
    await delay(500);
    await delay(500);
    console.timeEnd("顺序执行");
    console.time("并发执行");
    await Promise.all([delay(500), delay(500), delay(500)]);
    console.timeEnd("并发执行");
}