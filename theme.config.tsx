import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>Welcome to Yield Curve Central 👋</span>,
  project: {
    link: 'https://github.com/walkerhughes',
  },
  chat: {
    link: 'https://discord.com',
  },
  docsRepositoryBase: 'https://github.com/walkerhughes',
  footer: {
    text: '',
  },
  head: ({ meta }) => (
    <>
      <title>Welcome to Yield Curve Central 👋</title>
      {meta && meta.map((m) => (
        <meta key={m.name} {...m} />
      ))}
    </>
  ),
}

export default config


