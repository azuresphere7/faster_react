interface Route {
  headers?: Record<string, string>;
  content?:
  | Record<string, unknown>
  | (() => Record<string, unknown> | Promise<Record<string, unknown>>);
  path: string;
  startLoad?: () => void | Promise<void>;
  endLoad?: () => void | Promise<void>;
  onError?: (e: Error) => void | Promise<void>;
  elSelector?: string;
  method?: string;
}

function executePostInnerHTMLScriptsTags(el: HTMLElement) {
  Array.from(el.querySelectorAll("script")).forEach((oldScriptEl: HTMLScriptElement) => {
    const newScriptEl = document.createElement("script");
    Array.from(oldScriptEl.attributes).forEach((attr) => {
      newScriptEl.setAttribute(attr.name, attr.value);
    });
    const scriptText = document.createTextNode(oldScriptEl.innerHTML);
    newScriptEl.appendChild(scriptText);
    oldScriptEl.parentNode?.replaceChild(newScriptEl, oldScriptEl);
  });
}

async function componentRoute(params: Route) {
  if (!params.elSelector) {
    throw new Error(
      `The ${params.path} component route needs a DOM element selector like #myID, .myCLass, #myID .Myclass, etc.`,
    );
  }
  if (params.startLoad) {
    await params.startLoad();
  }
  let data: Record<string, unknown> = {};
  try {
    if (typeof params.content === "function") {
      data = await params.content();
    } else {
      data = params.content || {};
    }
    const headers = new Headers();
    if (params.headers) {
      for (const hName in params.headers) {
        headers.append(hName, params.headers[hName]);
      }
    }
    const el = document.querySelector(params.elSelector);
    if (!el) {
      throw new Error(
        `The selector ${params.elSelector} on route ${params.path} did not find any elements. Examples of selectors: #myID, .myCLass, #myID .Myclass, etc.`,
      );
    }
    const fetchParams: RequestInit = {
      method: params.content ? "POST" : "GET",
      headers: headers,
    };
    if (params.content) {
      fetchParams.body = JSON.stringify(data);
      headers.append("Content-Type", "application/json");
    }
    const res = await fetch(params.path, fetchParams);
    const text = await res.text();
    el.innerHTML = text;
    executePostInnerHTMLScriptsTags(el as HTMLElement);
    if (params.endLoad) {
      await params.endLoad();
    }
  } catch (e) {
    if (params.onError) {
      await params.onError(e as Error);
    }
    if (params.endLoad) {
      await params.endLoad();
    }
    console.error(e);
  }
}

async function pageRoute(params: Route) {
  if (params.startLoad) {
    await params.startLoad();
  }
  if (params.headers) {
    const url = new URL(globalThis.location.origin + params.path);
    for (const hName in params.headers) {
      url.searchParams.append(hName, params.headers[hName]);
    }
    params.path = url.toString();
  }
  if (!params.content) {
    globalThis.location.href = params.path;
  } else {
    let data: Record<string, unknown> = {};
    try {
      if (typeof params.content === "function") {
        data = await params.content();
      } else {
        data = params.content;
      }
      const form = document.createElement("form");
      form.setAttribute("action", params.path);
      form.setAttribute("method", "post");
      form.style.display = "none";
      const input = document.createElement("input");
      input.type = "text";
      input.name = "faster_react_route_helper";
      input.value = JSON.stringify(data);
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
      form.remove();
      if (params.endLoad) {
        await params.endLoad();
      }
    } catch (e) {
      if (params.onError) {
        await params.onError(e as Error);
      }
      if (params.endLoad) {
        await params.endLoad();
      }
      console.error(e);
    }
  }
}

async function getJSON(params: Route) {
  if (params.startLoad) {
    await params.startLoad();
  }
  let data: Record<string, unknown> = {};
  try {
    if (typeof params.content === "function") {
      data = await params.content();
    } else {
      data = params.content || {};
    }
    const headers = new Headers();
    if (params.headers) {
      for (const hName in params.headers) {
        headers.append(hName, params.headers[hName]);
      }
    }
    const fetchParams: RequestInit = {
      method: params.content ? "POST" : "GET",
      headers: headers,
      body: params.content ? JSON.stringify(data) : undefined,
    };
    if (params.method) {
      fetchParams.method = params.method.toUpperCase();
    }
    const res = await fetch(params.path, fetchParams);
    const json = await res.json();
    if (params.endLoad) {
      await params.endLoad();
    }
    return json;
  } catch (e) {
    if (params.onError) {
      await params.onError(e as Error);
    }
    if (params.endLoad) {
      await params.endLoad();
    }
    console.error(e);
  }
}

function route(params: Route) {
  if (!params.path.startsWith("/")) {
    throw new Error(`Route ${params.path} must start with /`);
  }
  if (params.path.startsWith("/components")) {
    return () => componentRoute(params);
  } else {
    return () => pageRoute(params);
  }
}

export { getJSON, type Route, route };
