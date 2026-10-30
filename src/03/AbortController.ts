/**
 * 本练习的取消流程：
 * 超时计时器 / 外部 signal → 内部 controller.abort(原因)
 * → fetch 或响应体读取被取消 → catch 将错误交给调用方。
 *
 * AbortController 是“控制端”，负责发出取消通知；
 * AbortSignal 是“信号端”，传给支持取消的操作（例如 fetch）。
 * 取消需要操作配合，不能自动停止任意 Promise，也不能撤销服务器已完成的操作。
 */

// 联合类型：kind 只能取下面四个字符串，调用方可用 switch 区分处理。
// http：服务器返回错误状态；network：网络或读取失败；
// timeout：超过时限；cancelled：调用方主动取消。
type RequestErrorKind = "http" | "network" | "timeout" | "cancelled";

// 在普通 Error 上增加分类信息，避免调用方靠匹配错误消息判断原因。
class RequestError extends Error {
  constructor(
    // public readonly 是 TypeScript 的参数属性语法：
    // 自动创建同名实例属性并赋值，外部可以读取，但不能重新赋值。
    public readonly kind: RequestErrorKind,
    message: string,
    // ? 表示可选；只有 HTTP 错误需要携带状态码，例如 404。
    public readonly status?: number,
  ) {
    // 调用父类构造函数，保存错误消息到 error.message。
    super(message);
    this.name = "RequestError";
  }
}

/**
 * 获取并解析 JSON，同时支持超时和主动取消。
 * url：请求地址；timeoutMs：超时时间（毫秒），默认 3000；
 * signal：调用方传入的取消信号，不传则只启用超时取消。
 *
 * 返回 Promise<unknown>：JSON 的结构尚未验证，使用字段前应先检查类型。
 * async 函数里的 throw 会使返回的 Promise 拒绝，调用方应使用
 * try { await fetchJson(...) } catch (error) { ... } 处理失败。
 *
 * 主动取消的调用方式：
 * const userController = new AbortController();
 * // 将 userController.signal 作为第三个参数传给 fetchJson。
 * // 用户点击取消时调用 userController.abort()。
 * 每次新的请求建议创建新的 controller，已取消的 signal 不能恢复。
 */
async function fetchJson(
  url: string,
  timeoutMs = 3000,
  signal?: AbortSignal,
): Promise<unknown> {
  // 排除 NaN、Infinity 和负数，避免无效的计时器参数。
  // 0 是允许的：计时器会在后续可执行的时机尽快触发，并非同步取消。
  if (!Number.isFinite(timeoutMs) || timeoutMs < 0) {
    throw new RangeError("timeoutMs 必须是非负有限数");
  }

  // 外部只传入 signal，我们不能通过它直接调用 abort()。
  // 因此创建内部 controller，把“超时”和“外部主动取消”汇总到同一个信号。
  const controller = new AbortController();

  const cancel = () => {
    // abort(reason) 会将内部 signal.aborted 设为 true，并保存 signal.reason。
    // 这里主动提供自定义错误，因此取消时不应只判断错误名是否为 AbortError。
    // 同一个 controller 多次 abort()，只保留第一次取消的原因。
    controller.abort(
      new RequestError("cancelled", "用户主动取消"),
    );
  };

  // ?. 是可选链：调用方没传 signal 时，不访问其属性或方法。
  if (signal?.aborted) {
    // 信号可能在调用本函数之前就已取消；只监听未来事件会漏掉这种情况。
    cancel();
  } else {
    // 将外部取消转发到内部 controller；once: true 表示触发一次后移除监听。
    signal?.addEventListener("abort", cancel, { once: true });
  }

  // setTimeout 只负责到点执行回调；真正取消请求的是回调里的 abort()。
  // 超时和主动取消使用不同的 kind，便于调用方给出不同提示。
  const timer = setTimeout(() => {
    controller.abort(
      new RequestError("timeout", `请求超过 ${timeoutMs}ms`),
    );
  }, timeoutMs);

  try {
    let text: string;

    // 内层 try/catch 只处理请求和响应体读取，以免把 JSON 语法错误归为网络错误。
    try {
      // 如果内部信号已经取消，直接抛出 signal.reason，不再发起请求；否则继续。
      controller.signal.throwIfAborted();

      // 必须把 signal 传给 fetch，它才能接收取消通知。
      // await 等待 Promise 的结果；失败或被取消时，会跳到下面的 catch。
      const response = await fetch(url, {
        signal: controller.signal,
      });

      // fetch 遇到 404、500 等状态码不会自动 reject，需要自己检查。
      // response.ok 在状态码为 200～299 时为 true。
      if (!response.ok) {
        throw new RequestError(
          "http",
          `HTTP ${response.status}`,
          response.status,
        );
      }

      // fetch 返回 response 时，响应体可能还没接收完，需要继续 await 读取。
      // 读取响应体也可能失败或被取消，计时器此时仍然有效。
      text = await response.text();
    } catch (error: unknown) {
      // unknown 要先缩小类型才能访问属性；instanceof 检查是否为指定类的实例。
      // 已分类的错误直接向外抛出，例如 HTTP 错误或自定义的取消原因。
      if (error instanceof RequestError) {
        throw error;
      }

      // 响应体读取被取消时，运行环境可能抛出通用取消错误。
      // 改为抛出我们保存的 reason，保留 timeout / cancelled 分类。
      if (controller.signal.aborted) {
        throw controller.signal.reason;
      }

      // 未主动取消且未被分类的请求/读取错误，在这里统一归为 network。
      throw new RequestError("network", "请求或响应体读取失败");
    }

    // 单独解析：JSON 格式错误应保留为 SyntaxError，
    // 不应误判为网络错误。as unknown 只是类型标注，不会验证 JSON 数据结构。
    return JSON.parse(text) as unknown;
  } finally {
    // 无论 return 成功还是 throw 失败，离开 try 前都会执行 finally。
    // 清除尚未触发的计时器，避免请求结束后仍执行超时回调。
    clearTimeout(timer);
    // 正常结束时 once 监听可能尚未触发，因此仍需手动移除。
    // 必须使用注册时的同一个 cancel 函数引用，才能正确移除监听。
    signal?.removeEventListener("abort", cancel);
  }
}
