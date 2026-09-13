function scanPageForM3u8() {
  const html = document.documentElement.outerHTML;
  const lines = html.split(/\r?\n/);
  const urlRegex = /https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*/g;
  const seen = new Set();
  const matched = [];
  for (const raw of lines) {
    if (!raw.includes(".m3u8")) continue;
    const line = raw.trim();
    if (!line || seen.has(line)) continue;
    seen.add(line);
    matched.push({ line, urls: line.match(urlRegex) || [] });
  }
  return matched;
}

function render(matches) {
  const list = document.getElementById("results");
  const count = document.getElementById("count");
  list.innerHTML = "";

  if (matches.length === 0) {
    count.textContent = "발견된 .m3u8 줄이 없습니다";
    const empty = document.createElement("li");
    empty.id = "empty";
    empty.textContent = "이 페이지 소스에서 .m3u8을 찾지 못했습니다.";
    list.appendChild(empty);
    return;
  }

  count.textContent = `${matches.length}개 줄 발견 (클릭하여 복사)`;
  for (const { line, urls } of matches) {
    const li = document.createElement("li");
    const copyText = urls.length ? urls.join("\n") : line;

    const textDiv = document.createElement("div");
    textDiv.className = "line-text";
    textDiv.textContent = urls.length ? urls[0] : line;
    li.appendChild(textDiv);

    if (urls.length > 1) {
      const extra = document.createElement("div");
      extra.className = "extra";
      extra.textContent = `+ URL ${urls.length - 1}개 더 (전체 줄 복사됨)`;
      li.appendChild(extra);
    }

    li.addEventListener("click", () => {
      navigator.clipboard.writeText(copyText).then(() => {
        li.classList.add("copied");
        setTimeout(() => li.classList.remove("copied"), 800);
      });
    });

    list.appendChild(li);
  }
}

async function scan() {
  const countEl = document.getElementById("count");
  const list = document.getElementById("results");
  countEl.textContent = "스캔 중...";
  list.innerHTML = "";

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) {
    countEl.textContent = "탭을 찾을 수 없습니다.";
    return;
  }

  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scanPageForM3u8,
    });
    render(result || []);
  } catch (err) {
    countEl.textContent = "이 페이지에서는 스캔할 수 없습니다.";
  }
}

document.getElementById("rescan").addEventListener("click", scan);
scan();
