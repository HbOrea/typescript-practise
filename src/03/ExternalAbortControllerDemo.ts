// 将本文件视为独立模块，避免与其他练习中的同名变量、类发生冲突。
export {};

type RequestErrorKind = "http" | "network" | "timeout" | "cancelled";

class RequestError extends Error {
  constructor(
    public readonly kind: RequestErrorKind,
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "RequestError";
  }
}

/**
 * 请求函数只接收 signal，不创建 controller，也不管理超时计时器。
 * signal 用来接收取消通知，不能通过它调用 abort()。
 * 谁创建外部 controller，谁负责决定什么时候取消。
 */
async function fetchJson(url: string, signal: AbortSignal): Promise<unknown> {
  let text: string;

  try {
    // 如果调用前就已取消，直接抛出取消原因，不再发起请求。
    signal.throwIfAborted();

    const response = await fetch(url, { signal });

    // 404、500 等 HTTP 错误不会让 fetch 自动拒绝，需要自己检查。
    if (!response.ok) {
      throw new RequestError("http", `HTTP ${response.status}`, response.status);
    }

    // fetch 返回时响应体可能还没接收完，读取期间仍然可以被取消。
    text = await response.text();
  } catch (error: unknown) {
    if (error instanceof RequestError) {
      throw error;
    }

    if (signal.aborted) {
      // 保留调用方传给 abort(reason) 的原因，区分超时和主动取消。
      // 读取响应体时可能收到通用 AbortError，因此这里读取 signal.reason。
      throw signal.reason;
    }

    throw new RequestError("network", "请求或响应体读取失败");
  }

  // 放在请求的 try/catch 外：JSON 格式错误保留为 SyntaxError。
  // unknown 表示数据结构尚未验证，使用具体字段前需要检查类型。
  return JSON.parse(text) as unknown;
}

async function main(): Promise<void> {
  // 整个示例只创建这一个 controller；同一个 signal 直接传给 fetch。
  const controller = new AbortController();

  // 可以修改下面两个时间，观察不同结果：
  // 1. 保持默认值：如果请求 100ms 内尚未完成，会主动取消。
  // 2. 将 cancelAfterMs 改为 undefined：不模拟用户取消。
  // 3. 再将 timeoutMs 改为 1：更容易观察超时（具体结果取决于实际请求）。
  // 4. 取消用户计时器并使用足够长的超时时间：观察成功或其他请求错误。
  const timeoutMs = 3000;
  const cancelAfterMs: number | undefined = 100;

  // 来源一：请求超时。计时器和 controller 都由调用方管理。
  const timeoutTimer = setTimeout(() => {
    controller.abort(new RequestError("timeout", `请求超过 ${timeoutMs}ms`));
  }, timeoutMs);

  // 来源二：模拟用户点击取消。真实页面中可以在按钮事件里调用这个函数。
  const cancel = () => {
    controller.abort(new RequestError("cancelled", "用户主动取消"));
  };

  const cancelTimer = cancelAfterMs === undefined
    ? undefined
    : setTimeout(cancel, cancelAfterMs);

  // 两种来源都调用同一个 controller.abort(reason)。
  // 如果都触发了，第一次取消的原因生效，后续 abort() 不会覆盖它。
  try {
    const data = await fetchJson(
      "https://jsonplaceholder.typicode.com/users/1",
      controller.signal,
    );
    console.log("请求成功：", data);
  } catch (error: unknown) {
    if (error instanceof RequestError) {
      switch (error.kind) {
        case "http":
          console.error("HTTP 错误，状态码：", error.status);
          break;
        case "network":
          console.error("网络错误：", error.message);
          break;
        case "timeout":
          console.error("请求超时：", error.message);
          break;
        case "cancelled":
          console.log("请求已主动取消");
          break;
      }
    } else {
      console.error("其他错误（例如 JSON 格式错误）：", error);
    }
  } finally {
    // 成功、失败或取消后都清理；等待范围包含响应体读取。
    clearTimeout(timeoutTimer);
    if (cancelTimer !== undefined) {
      clearTimeout(cancelTimer);
    }
  }
}

// void 仅表示忽略返回值，本身不会处理 rejection。
// 最外层 catch 用于兜住 main 中未预料到的错误。
void main().catch((error: unknown) => {
  console.error("示例执行失败：", error);
});
