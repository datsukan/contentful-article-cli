const help = `Usage:
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
`

console.log(help)
