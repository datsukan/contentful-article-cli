# Contentful article cli

This is a CLI tool for writing article text managed by Contentful in Markdown in Visual Studio Code.

## 🚀 Quick start

```
git clone https://github.com/datsukan/contentful-article-cli.git
cd contentful-article-cli
yarn install
```

### Install

- Node.js
- Yarn (Optional)
- [markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) (Optional)
- [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one) (Optional)

### Copy `.env`

```
cp .env.example .env
```

### Setting `.env`

```
CONTENTFUL_SPACE_ID=xxxxxxxxxx
CONTENTFUL_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## ❓ How to get

### Space id

[ Contentful dashboard > Settings > General settings > Space ID ]

### Access token

[ Contentful dashboard > Settings > API Keys > Content management tokens > Generate personal token ]

### Article id

[ Contentful dashboard > Content > entry item > Sidebar > info > ENTRY ID ]

## 🧐 Usage

```
Usage:
  yarn [command]
  yarn [command] [articleId]

  or

  npm run [command]
  npm run [command] [articleId]

Commands:
  article-help                  Show help.
  article-pull                  Get the body of multiple articles from Contentful. (Max 100)
  article-pull [articleId]      Get the body of a single article corresponding to the specified ID from Contentful.
  article-push [articleId]      Updates the body of a single article corresponding to the specified ID for Contentful.
  article-show                  Lists information about local article files.
```

## 📝 Markdown rule

`.markdownlint.jsonc` is the markdown rule configuration file.

### Reference page

- [rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)
- [manual](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint#configure)
