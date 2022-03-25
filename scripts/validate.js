class Validator {
  constructor(value) {
    this.value = value
  }

  async articleId() {
    if (!this.value) {
      console.warn("第1引数に記事IDを指定してください。")
      return false
    }

    if (!(await exists())) {
      console.warn("第1引数に存在する正しい記事IDを指定してください。")
      return false
    }

    return true
  }

  async exists() {
    // ファイル名を全件取得する
    const filenames = await getFilenames()

    // 記事として有効なファイル名だけ抽出する
    const articleFilenames = filenames.filter(filename => {
      const strArr = filename.split("--")
      if (strArr.length < 4) return false

      const name = strArr[1]
      const slug = strArr[2]
      const id = strArr[3].replace(".md", "")

      return !!name && !!slug && !!id
    })

    let exists = false
    articleFilenames.map(filename => {
      const strArr = filename.split("--")
      const id = strArr[3].replace(".md", "")

      if (this.value === id) exists = true
    })

    return exists
  }
}

module.exports = Validator
