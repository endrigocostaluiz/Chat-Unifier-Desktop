const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = `<div class="w-full" data-index="3" style="padding-top: 4px;"><div class="css-dkahau relative flex items-center pt-2 pb-4 px-12 P4-Regular text-UIText1 cursor-pointer" data-e2e="chat-message"><div class="flex self-start py-2"><div class="w-24 h-24 flex flex-shrink-0 overflow-hidden justify-center items-center rounded-[50%] bg-BGInput ltr:mr-8 rtl:ml-8 cursor-pointer"><img src="..." class="tiktok-ogoe9v erkh6b50" style="display: block;"></div></div><div class="flex flex-col justify-start items-start overflow-hidden flex-1 break-words"><div class="w-full flex items-center whitespace-nowrap"><div class="inline-flex items-center overflow-x-hidden cursor-pointer whitespace-break-spaces align-middle"><div class="flex-auto overflow-hidden inline-block ltr:mr-4 rtl:ml-4 text-UIText3 font-600 cursor-pointer whitespace-nowrap hover:underline max-w-[150px] truncate" data-e2e="message-owner-name" title="EU GOSTO DI CARRO">EU GOSTO DI CARRO</div></div></div><div class="w-full break-words align-middle">a live está sem som</div></div><div class="moreActionButton w-16 h-16 flex flex-shrink-0 self-start pt-4 cursor-pointer text-TextTertiary invisible pointer-events-none" data-e2e="more-action-button" aria-expanded="false" aria-haspopup="dialog"><svg fill="currentColor" font-size="16px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M24 5a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 15a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 15a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"></path></svg></div></div></div>`;

const dom = new JSDOM(html);
const document = dom.window.document;
const NodeFilter = dom.window.NodeFilter;

function parseMessageContent(msgEl) {
  if (!msgEl) return '';
  let content = '';
  const walker = document.createTreeWalker(msgEl, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      if (node.parentNode && node.parentNode.tagName === 'IMG') return NodeFilter.FILTER_SKIP;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  let cur = walker.nextNode();
  while (cur) {
    if (cur.nodeType === 3) content += cur.textContent;
    cur = walker.nextNode();
  }
  return content;
}

const tiktokMsg = document.querySelector('[data-e2e="chat-message"]');
console.log("tiktokMsg:", !!tiktokMsg);

const authorEl = tiktokMsg.querySelector('[data-e2e="message-owner-name"], [data-e2e="chat-message-user-name"], span[class*="Username"], span[class*="Nickname"], div[class*="Username"]');
const msgEl = tiktokMsg.querySelector('.w-full.break-words.align-middle, [data-e2e="chat-message-text"], span[class*="MessageText"], span[class*="ChatContent"], div[class*="MessageText"], span[class*="Comment"]');

console.log("authorEl:", !!authorEl, authorEl ? authorEl.textContent : null);
console.log("msgEl:", !!msgEl, msgEl ? msgEl.textContent : null);
console.log("parsed message:", parseMessageContent(msgEl));
