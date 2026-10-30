/**
 * 对数组执行异步映射，同时限制正在执行的任务数量。
 * T 是输入元素类型，R 是单个任务的结果类型，调用时通常可以自动推断。
 * 任务完成顺序可以不同，但返回数组与输入数组按索引一一对应。
 * 任一任务失败时，返回的 Promise 会拒绝；其他已启动的消费者不会自动取消。
 */
async function mapLimit<T, R>(
  // readonly T[]：函数内不能通过该参数增删、替换数组元素（不是深度只读）。
  items: readonly T[],
  limit: number,
  // 函数类型：接收元素和索引，返回一个最终产生 R 类型值的 Promise。
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  // async 函数返回 Promise；这里抛出的错误会使返回的 Promise 拒绝。
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new Error("limit 必须是正整数");
  }

  // 预留结果位置；按原索引写入，而不是按任务完成顺序 push。
  const results = new Array<R>(items.length);
  // 所有消费者通过闭包共享这个变量，用它记录下一个待领取的位置。
  // 记录并发场景下，共享的信号量类似python semaphore，任务执行顺序，并存入结果中
  let nextIndex = 0;

  // 一个消费者：不断领取任务，直到没有任务
  async function consume(): Promise<void> {
    while (nextIndex < items.length) {
      // 后置 ++：先把旧值交给 index，再将 nextIndex 加 1。
      // 领取过程发生在 await 之前，在当前 JS 执行线程内不会被其他消费者插入。
      const index = nextIndex++;
      // await 暂停当前消费者，其他消费者仍能继续执行。
      // ! 是非空断言：告诉 TS 此处元素存在，不会在运行时执行检查。
      // 同一消费者必须等本次任务完成后，才能进入下一轮领取任务。
      results[index] = await worker(items[index]!, index);
    }
  }

  // 最多启动 limit 个消费者
  // Array.from 的第一个参数是类数组对象，第二个参数是生成各元素的函数。
  // consume() 会立即运行到第一个 await，并返回 Promise<void>。
  const consumers = Array.from(
    { length: Math.min(limit, items.length) },
    () => consume()
  );

  // consumers 是 Promise<void>[]；等待所有消费者完成后，结果数组才填充完毕。
  // 空输入会创建零个消费者，Promise.all([]) 正常完成，最终返回 []。
  await Promise.all(consumers);
  return results;
}

async function MapLimitMain(): Promise<void> {
  // _ 表示未使用的元素值，i 是从 0 开始的索引，生成 [1, 2, ..., 10]。
  const ids = Array.from({ length: 10 }, (_, i) => i + 1);
  // active 记录当前任务数，peak 记录历史最大任务数。
  let active = 0;
  let peak = 0;

  // 推断出 T 为 number、R 为 string，所以 results 的类型是 string[]。
  const results = await mapLimit(ids, 3, async (id) => {
    active++;
    peak = Math.max(peak, active);

    try {
      console.log("开始", id, "当前并发", active);

      // Promise<void> 表示完成时没有结果值；resolve 由定时器调用。
      // 随机等待约 200～1000 毫秒，模拟耗时不同的异步任务。
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 200 + Math.random() * 800);
      });

      // 模板字符串：使用反引号包裹，通过 ${...} 插入表达式的值。
      return `结果-${id}`;
    } finally {
      // 无论 try 正常 return 还是抛出错误，finally 都会执行，确保计数归还。
      active--;
    }
  });

  console.log(results); // 顺序仍然是 结果-1 到 结果-10
  console.log("峰值并发", peak); // 应为 3
}

// async 函数返回 Promise；catch 捕获主流程的拒绝，并把错误交给 console.error。
MapLimitMain().catch(console.error);
