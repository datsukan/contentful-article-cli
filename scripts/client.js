const contentful = require("contentful-management")

class Client {
  constructor() {
    this.defaultLocaleCode = null
    this.client = null
  }

  async init() {
    const client = contentful.createClient({
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    })
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
    this.client = await space.getEnvironment("master")
  }

  async getDefaultLocaleCode() {
    if (this.defaultLocaleCode) return this.defaultLocaleCode
    if (!this.client) await this.init()

    const locales = await this.client.getLocales()
    const defaultLocale = locales.items.filter(locale => locale.default)[0]
    this.defaultLocaleCode = defaultLocale.code
    return this.defaultLocaleCode
  }

  async getEntry(id) {
    if (!this.client) await this.init()
    return await this.client.getEntry(id)
  }

  async getEntries(param) {
    if (!this.client) await this.init()
    return await this.client.getEntries(param)
  }

  async updateEntry(data) {
    return await data.update()
  }
}

module.exports = Client
