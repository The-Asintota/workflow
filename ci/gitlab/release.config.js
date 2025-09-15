// The semantic-release configuration is exported as a Node.js module.
module.exports = {
  branches: ['main'],
  repositoryUrl: 'repository url',
  tagFormat: 'v${version}',
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
    [
      '@semantic-release/release-notes-generator',
      { 
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: "feat", section: "✨ Nuevas Funcionalidades", hidden: false },
            { type: "fix", section: "🐛 Corrección de Errores", hidden: false },
            { type: "docs", hidden: true },
            { type: "style", hidden: true },
            { type: "refactor", section: "📋 Refactorizaciones", hidden: false },
            { type: "test", hidden: true },
            { type: "perf", section: "⚡️ Mejoras de Rendimiento", hidden: false },
            { type: "chore", hidden: true }
          ]
        }
      }
    ],
    ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
    ['@semantic-release/git', {
      assets: ['CHANGELOG.md'],
      message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
    }],
    ['@semantic-release/gitlab', { gitlabUrl: 'https://gitlab.com' }]
  ]
};
