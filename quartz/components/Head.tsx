import { i18n } from "../util/i18n"
import { FullSlug, joinSegments, pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export const customFormatDescription = (description: string, maxLen: number): string => {
  if (description.length <= maxLen) return description
  return description.substring(0, maxLen) + "..."
}

const Head: QuartzComponent = ({ cfg, fileData, externalResources }: QuartzComponentProps) => {
  const title = fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title
  const description = fileData.description ?? i18n(cfg.locale).propertyDefaults.description
  const { css, js } = externalResources

  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const path = url.pathname as FullSlug
  const baseDir = fileData.slug ? pathToRoot(fileData.slug) : ""

  return (
    <head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta { ...{ "data-accent": cfg.theme.colors.lightMode.accent } } />
      {css.map((href) => (
        <link key={href} rel="stylesheet" href={href} type="text/css" sparse="true" />
      ))}
      {js
        .filter((resource) => resource.loadTime === "beforeDOMReady")
        .map((resource) => {
          return <script key={resource.src} src={resource.src} type={resource.contentType ?? "text/javascript"} />
        })}
    </head>
  )
}

export default (() => Head) satisfies QuartzComponentConstructor
