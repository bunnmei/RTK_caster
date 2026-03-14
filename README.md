VNCコンソールから 
```cmd
login: root 
password: xxxxxxxxx 
```
でログインする。


### ユーザーを追加

まずはユーザーを追加 \
パスワードなどは適当に

```cmd
$ adduser rtk
```

（推奨）管理者権限（sudo権限）を付与する
```cmd
$ usermod -aG sudo rtk
```

作成したユーザーに切り替えて確認する
```cmd
$ su - rtk
```

### SSHでアクセスとアップデート

自宅のPCからSSH
```cmd
$ ssh ユーサー名@固定IP
```

アップグレード
```cmd
$ sudo apt update
$ sudo apt upgrade -y
```

### 必要なものをインストール
```cmd
# nvmのインストール
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# ターミナルにnvmを認識させる（または一度ログアウトして入り直す）
$ source ~/.bashrc

# Node.jsの安定版をインストール
$ nvm install --lts

$ node -v
$ npm -v
```
### ファイヤーウォールを開く(XServerはパケットフィルターも設定)
2101はRTCMを流すポート
```cmd
# SSH(22番)を許可（締め出し防止）
$ sudo ufw allow 22/tcp
$ sudo ufw allow 2101/tcp

# ファイアウォールを有効化（y を押してEnter）
$ sudo ufw enable

# 状態の確認
$ sudo ufw status
```
### gitの設定など
```cmd
$ ssh-keygen -t ed25519 -C "あなたのメールアドレス"
$ cat ~/.ssh/id_ed25519.pub
```
.pubをgithubに貼り付ける

疎通確認
```cmd
$ ssh -T git@github.com
```

秘密鍵: ~/.ssh/id_ed25519 （絶対に誰にも見せないでください）
公開鍵: ~/.ssh/id_ed25519.pub （GitHubやVPSに登録します）

### pm2などでnodeを起動

```cmd
# 1. pm2のインストール
npm install -g pm2

# 2. caster.js をバックグラウンドで起動
pm2 start caster.js --name ntrip-caster

状況確認
pm2 status

logが流れるようにする
pm2 logs

# 以下で止めることができる
pm2 stop アプリ名
# または
pm2 stop ID番号
```



