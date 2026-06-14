import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import defineVersionedConfig from 'vitepress-versioning-plugin';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineVersionedConfig(
  {
    title: 'ezai-marketplace',
    description:
      'CLI to install AI skills from the ezai marketplace into Claude Code, Gemini CLI, and Copilot',
    lang: 'en-US',
    base: '/ezai-marketplace/',

    // Fail the build on broken internal links — the VitePress analogue of mkdocs `strict: true`.
    ignoreDeadLinks: false,
    // Drop the `.html` suffix from generated URLs.
    cleanUrls: true,
    // Surface the git commit date on every page (requires full git history in CI: fetch-depth: 0).
    lastUpdated: true,

    head: [
      ['link', { rel: 'icon', href: '/ezai-marketplace/favicon.ico' }],
      ['meta', { name: 'theme-color', content: '#646cff' }],
    ],

    sitemap: {
      hostname: 'https://neuraaak.github.io/ezai-marketplace/',
    },

    // Version-switcher dropdown — the VitePress analogue of mike. latestVersion must equal package.json version.
    versioning: {
      latestVersion: '1.2.1',
    },

    themeConfig: {
      // Client-side full-text search — no external service, the analogue of Material's search plugin.
      search: {
        provider: 'local',
      },

      nav: [
        { text: 'Getting Started', link: '/getting-started' },
        { text: 'CLI Reference', link: '/cli/' },
        { text: 'Skills', link: '/skills/' },
        { text: 'Guides', link: '/guides/' },
        { text: 'Examples', link: '/examples/' },
        { text: 'Concepts', link: '/concepts/' },
      ],

      // Multi-sidebar object form (keyed by path) — required by vitepress-versioning-plugin;
      // the array form silently disables version-scoped sidebars.
      sidebar: {
        '/': [
          {
            text: 'Tutorial',
            items: [{ text: 'Getting Started', link: '/getting-started' }],
          },
          {
            text: 'Reference',
            items: [
              { text: 'CLI Reference', link: '/cli/' },
              { text: 'Available Skills', link: '/skills/' },
            ],
          },
          {
            text: 'How-To Guides',
            items: [{ text: 'Overview', link: '/guides/' }],
          },
          {
            text: 'Examples',
            items: [{ text: 'CLI scenarios', link: '/examples/' }],
          },
          {
            text: 'Concepts',
            items: [
              { text: 'Overview', link: '/concepts/' },
              { text: 'How skill installation works', link: '/concepts/how-skills-work' },
            ],
          },
          {
            text: 'More',
            items: [{ text: 'Changelog', link: '/changelog' }],
          },
        ],
      },

      // Right-hand on-page table of contents.
      outline: {
        level: [2, 3],
        label: 'On this page',
      },

      // "Edit this page on GitHub" link under every page.
      editLink: {
        pattern: 'https://github.com/Neuraaak/ezai-marketplace/edit/main/docs/:path',
        text: 'Edit this page on GitHub',
      },

      lastUpdated: {
        text: 'Last updated',
        formatOptions: { dateStyle: 'medium', timeStyle: 'short' },
      },

      docFooter: {
        prev: 'Previous',
        next: 'Next',
      },

      socialLinks: [
        {
          icon: 'github',
          link: 'https://github.com/Neuraaak/ezai-marketplace',
        },
      ],

      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2024-present Florian Salort',
      },
    },

    markdown: {
      lineNumbers: true,
    },
  },
  __dirname
);
