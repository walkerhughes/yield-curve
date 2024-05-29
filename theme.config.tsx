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
  head: () => (
    <>
      <title>Yield Curve Central 👋</title>
      <meta name="description" content="Welcome to Yield Curve Central 👋" />
      {/* Add other meta tags here if needed */}
    </>
  ),
}

export default config



