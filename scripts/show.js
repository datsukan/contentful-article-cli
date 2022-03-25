require("dotenv").config({ path: ".env" })
const fs = require("fs").promises

const saveDir = `${__dirname}/../articles/`

main()

async function main() {
  try {
    await printFilenames()
  } catch (error) {
    console.error(error)
    console.log("異常終了しました。")
  }
}

// ファイル名の情報を出力する
async function printFilenames() {
  // ファイル名を全件取得する
  const filenames = await getFilenames()

  if (filenames.length === 0) {
    console.log("0件")
    return
  }

  // 記事として有効かつ指定されたidのファイル名だけ抽出する
  let showList = []
  filenames.map(filename => {
    const strArr = filename.split("--")
    if (strArr.length < 4) return false

    const publishedAt = strArr[0]
    const name = strArr[1]
    const slug = strArr[2]
    const id = strArr[3].replace(".md", "")

    showList.push({
      id: id,
      publishedAt: publishedAt,
      name: name,
      slug: slug,
    })
  })

  console.table(showList)
}

// ローカルにあるファイル名をすべて取得する
async function getFilenames() {
  return await fs.readdir(saveDir)
}
