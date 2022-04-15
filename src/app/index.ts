import './index.scss';

const INTERVAL_MS = 500;

let ngWord = '';
let replaceUserName = '';
let replaceUserIcon = '';

// dis コメント化を判定する
// TODO: ここのロジックを充実させる
export const isDisComment = (input: string, ngList: string[]): boolean => {
  return !!ngList.find((ng) => input.includes(ng));
};

// 保存してある語句を読み込み
chrome.storage.local.get(['comment', 'nickname', 'imageUrl']).then((value) => {
  const { comment, nickname, imageUrl } = value;
  ngWord = comment;
  replaceUserName = nickname;
  replaceUserIcon = imageUrl;
});

// コメントが遅延ロードされるので定期監視する
const timer = setInterval(() => {
  const selector = "ytd-item-section-renderer[section-identifier='comment-item-section'] #contents";
  const dom = document.querySelector(selector);

  // コメントが見つかった
  if (dom) {
    // これ以上の定期監視をやめる
    clearTimeout(timer);

    // コメントの inview によるロードを新たに監視するための
    new MutationObserver((records) => {
      records.forEach((record) => {
        const childNodes = record.target.childNodes;
        childNodes.forEach((childNode) => {
          const element: HTMLElement = childNode as HTMLElement;
          if (!element || !element.querySelector) return;

          // ユーザアイコン、ユーザ名
          const userIconElement: HTMLImageElement | null =
            element.querySelector('#author-thumbnail')?.querySelector('#img') || null;
          const userNameElement: HTMLSpanElement | null =
            element.querySelector('#main')?.querySelector('#author-text')?.querySelector('span') ||
            null;

          // コメント内容を取得
          let comment = '';
          const contentText = element.querySelector('#main')?.querySelector('#content-text');
          const hasChildNode = !!contentText?.querySelector('span');
          if (!contentText) {
            comment = '';
          } else if (hasChildNode) {
            contentText?.querySelectorAll('span')?.forEach((c) => (comment += c.innerText));
          } else {
            comment = contentText.innerHTML;
          }

          // どれか1つでもデータが取得できなければ何もしない
          if (!userNameElement || !userIconElement || !comment) return;

          // dis コメントでない場合は何もしない
          if (!isDisComment(comment, [ngWord])) return;

          // 本来のアイコンのロード後に画像を書き換える
          userIconElement.onload = () => {
            if (userIconElement.src !== replaceUserIcon) {
              userIconElement.onload = () => {};
              userIconElement.src = replaceUserIcon;
            }
          };

          // 名前を書き換える
          userNameElement.innerText = replaceUserName;
        });
      });
    }).observe(dom, {
      childList: true,
      subtree: false,
      attributes: false,
      characterData: false,
    });
  }
}, INTERVAL_MS);
