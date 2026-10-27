async function mapLimit<T, R>(
  items: readonly T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new Error("limit 必须是正整数");
  }

  const results = new Array<R>(items.length);
  let nextIndex = 0;

  // 一个消费者：不断领取任务，直到没有任务
  async function consume(): Promise<void> {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await worker(items[index]!, index);
    }
  }

  // 最多启动 limit 个消费者
  const consumers = Array.from(
    { length: Math.min(limit, items.length) },
    () => consume()
  );

  await Promise.all(consumers);
  return results;
}