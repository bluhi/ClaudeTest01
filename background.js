const VIEW_SOURCE_PREFIX = "view-source:";

function stripViewSource(url) {
  if (!url || !url.startsWith(VIEW_SOURCE_PREFIX)) {
    return null;
  }
  const targetUrl = url.slice(VIEW_SOURCE_PREFIX.length);
  return targetUrl || null;
}

function handleTabUrl(tabId, url) {
  const targetUrl = stripViewSource(url);
  if (targetUrl) {
    chrome.tabs.update(tabId, { url: targetUrl });
  }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = changeInfo.url || tab.url;
  handleTabUrl(tabId, url);
});

chrome.tabs.onCreated.addListener((tab) => {
  if (tab.id !== undefined) {
    handleTabUrl(tab.id, tab.url);
  }
});
