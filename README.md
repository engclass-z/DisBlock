# DisBlock
YouTube 動画の批判コメントの投稿主表示を任意に変更できる Chrome 拡張

# Installation

1. ダウンロードしたい階層で `git clone https://github.com/engclass-z/disblock.git` コマンドを実行
1. clone したディレクトリに移動
1. `yarn && yarn build` を実行し、dist ディレクトリが作成されることを確認
1. Google Chrome で `chrome://extensions` を開く
1. 右上の `デベロッパーモード` を ON にする
1. 上部メニューの `パッケージ化されていない拡張機能を読み込む` を選択する
1. 最初に `git clone` してきたディレクトリの中の dist ディレクトリを選択する

# How to update

1. インストール時に `git clone` したディレクトリに移動する
1. `git pull && yarn && yarn build` コマンドを実行する
1. `chrome://extensions` を開く
1. 一覧に表示されている `DisBlock` 拡張機能の更新ボタンを押す
