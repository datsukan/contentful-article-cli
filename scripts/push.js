require("dotenv").config({ path: ".env" })
const fs = require("fs").promises
const Client = require("./client")
const Validator = require("./validate")

const saveDir = `${__dirname}/../articles/`
const articleId = process.argv[2] ?? null

main()

async function main() {
  try {
    const client = new Client()
    await client.init()

    const validate = new Validator(articleId)
    if (!validate.articleId) return

    const articleInfo = await client.getEntry(articleId)

    await pushArticle(articleInfo, client)
  } catch (error) {
    console.error(error)
    console.log("異常終了しました。")
  }
}

async function pushArticle(articleInfo, client) {
  const body = await getFileBody()
  if (body === null) {
    console.log("指定されたidに問題があったため処理を中断します。")
    return
  }

  const defaultLocaleCode = await client.getDefaultLocaleCode()

  if (!("body" in articleInfo.fields)) {
    articleInfo.fields.body = {}
  }
  articleInfo.fields.body[defaultLocaleCode] = body

  try {
    await client.updateEntry(articleInfo)
    console.warn("記事の更新が完了しました。")

    return
  } catch (error) {
    console.warn("更新でエラーが発生しました。")
    throw error
  }
}

async function getFileBody() {
  const filename = await getFilename()
  if (filename === null) return null

  const body = await fs.readFile(`${saveDir}${filename}`, "utf-8")
  return body
}

async function getFilename() {
  // ファイル名を全件取得する
  const filenames = await getFilenames()

  // 記事として有効かつ指定されたidのファイル名だけ抽出する
  const articleFilenames = filenames.filter(filename => {
    const strArr = filename.split("--")
    if (strArr.length < 4) return false

    const name = strArr[1]
    const slug = strArr[2]
    const id = strArr[3].replace(".md", "")

    return !!name && !!slug && !!id && articleId === id
  })

  if (articleFilenames.length === 0) return null

  return articleFilenames[0]
}

async function getFilenames() {
  return await fs.readdir(saveDir)
}
