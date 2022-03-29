require("dotenv").config({ path: ".env" })
const fs = require("fs").promises
const dayjs = require("dayjs")
const Client = require("./client")

const saveDir = `${__dirname}/../articles/`
const articleId = process.argv[2] ?? null

main()

// メイン処理
async function main() {
  try {
    const client = new Client()
    await client.init()

    articleId ? await pullArticle(client) : await pullArticles(client)
  } catch (error) {
    console.error(error)
    console.log("異常終了しました。")
  }
}

// 記事を1件取得して保存する
async function pullArticle(client) {
  const articleInfo = await client.getEntry(articleId)

  await fileSave(articleInfo, client)
}

// 記事を複数件取得して保存する（最大100件）
async function pullArticles(client) {
  const articlesInfo = await client.getEntries({
    content_type: "article",
    limit: 100,
  })

  await filesSave(articlesInfo.items, client)
}

// 1件の記事をファイルとして保存する
async function fileSave(article, client) {
  await resetDir()

  const { fileName, body } = await extractArticleInfo(article, client)

  // 書き込み
  await fs.writeFile(fileName, body, _ => errorCount++)

  console.info("記事の取得が正常に終了しました。")
}

// 複数件の記事をファイルとして保存する
async function filesSave(articles, client) {
  await resetDir()

  let errorCount = 0
  const promises = articles.map(async article => {
    const { fileName, body } = await extractArticleInfo(article, client)

    // 書き込み
    await fs.writeFile(fileName, body, _ => errorCount++)
  })
  await Promise.all(promises)

  if (errorCount > 0) {
    console.error(`${errorCount}件の取得エラーが発生しました。`)
  } else {
    console.info("記事の取得が正常に終了しました。")
  }
}

// 記事を格納するディレクトリの状態を初期化する
async function resetDir() {
  if (await dirExists()) {
    // ディレクトリが存在する場合は中のファイルを削除する
    await fileDelete()
    console.log("既存のファイルを削除しました。")
  } else {
    // ディレクトリが存在しない場合は作成する
    await fs.mkdir(saveDir, { recursive: true })
    console.log("ディレクトリを作成しました。")
  }
}

// 記事の全データから必要な情報だけ抽出する
async function extractArticleInfo(article, client) {
  const defaultLocaleCode = await client.getDefaultLocaleCode()

  // 公開中の場合
  if ("firstPublishedAt" in article.sys) {
    const id = article.sys.id
    const publishedAt = article.sys.publishedAt
    const formattedPublishedAt = dayjs(publishedAt).format("YYYY-MM-DD")
    const title = article.fields.title[defaultLocaleCode].replace(/\//g, "／")
    const slug = article.fields.slug[defaultLocaleCode]
    const fileName = `${saveDir}${formattedPublishedAt}--${title}--${slug}--${id}.md`
    const body = article.fields.body[defaultLocaleCode]

    return { fileName, body }
  }

  // 下書きの場合
  const getValueOfFields = (key, dummyString) => {
    return key in article.fields
      ? article.fields[key][defaultLocaleCode]
      : dummyString
  }

  const id = article.sys.id
  const title = getValueOfFields("title", "none").replace(/\//g, "／")
  const slug = getValueOfFields("slug", "none")
  const fileName = `${saveDir}draft--${title}--${slug}--${id}.md`
  const body = getValueOfFields("body", "")

  return { fileName, body }
}

// 記事を格納するディレクトリ内のファイルを削除する
async function fileDelete() {
  const files = await fs.readdir(saveDir)
  const promises = files.map(async file => {
    await fs.unlink(`${saveDir}/${file}`)
    console.log(`削除： ${file}`)
  })
  await Promise.all(promises)
}

// 記事を格納するディレクトリが存在していることを判定する
async function dirExists() {
  try {
    return (await fs.lstat(saveDir)).isDirectory()
  } catch (e) {
    return false
  }
}
