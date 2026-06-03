import { defineConfig } from 'vitepress';
import { withVersioning } from 'vitepress-versioning-plugin';

export default withVersioning(
  defineConfig({
    title: 'ezai-marketplace',
    description:
      'CLI to install AI skills from the ezai marketplace into Claude Code, Gemini CLI, and Copilot',
    base: '/ezai-marketplace/',

    themeConfig: {
      nav: [
        { text: 'Getting Started', link: '/getting-started' },
        { text: 'CLI Reference', link: '/cli/' },
        { text: 'Skills', link: '/skills/' },
        { text: 'Guides', link: '/guides/' },
      ],

      sidebar: [
        {
          text: 'Introduction',
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
          text: 'Guides',
          items: [{ text: 'Overview', link: '/guides/' }],
        },
      ],

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
  }),
  {
    versioning: {
      latestVersion: '1.1.0',
    },
  }
);
