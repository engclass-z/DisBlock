import './index.scss';

const INTERVAL_MS = 500;

const NG_WORD = '';
const REPLACE_USER_NAME = 'この名前に変える';
const REPLACE_USER_ICON =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIHZpZXdCb3g9IjAgMCAxNyAxNyIgZmlsbD0ibm9uZSI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNyA4LjVhOC41IDguNSAwIDExLTE3IDAgOC41IDguNSAwIDAxMTcgMHptLTUgMEw2LjUgNXY3TDEyIDguNXptLTEuODYgMEw3LjUgNi44MnYzLjM2bDIuNjQtMS42OHpNOC41IDE2YTcuNSA3LjUgMCAxMDAtMTUgNy41IDcuNSAwIDAwMCAxNXoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjE1IiAvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTYgOC41YTcuNSA3LjUgMCAxMS0xNSAwIDcuNSA3LjUgMCAwMTE1IDB6bS00IDBMNi41IDEyVjVMMTIgOC41eiIgZmlsbD0iI2ZmZiIgLz48L3N2Zz4=';

// dis コメント化を判定する
// TODO: ここのロジックを充実させる
export const isDisComment = (input: string, ngList: string[]): boolean => {
  return !!ngList.find((ng) => input.includes(ng));
};

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
          if (!isDisComment(comment, [NG_WORD])) return;

          // 本来のアイコンのロード後に画像を書き換える
          userIconElement.onload = () => {
            if (userIconElement.src !== REPLACE_USER_ICON) {
              userIconElement.src = REPLACE_USER_ICON;
            }
          };

          // 名前を書き換える
          userNameElement.innerText = REPLACE_USER_NAME;
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
