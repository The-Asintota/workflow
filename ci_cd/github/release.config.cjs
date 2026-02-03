const types = [
  { type: "feat", section: "✨ Nuevas Funcionalidades", hidden: false },
  { type: "fix", section: "🐛 Corrección de Errores", hidden: false },
  { type: "docs", hidden: true },
  { type: "style", hidden: true },
  { type: "refactor", hidden: true },
  { type: "test", hidden: true },
  { type: "wip", hidden: true },
  { type: "add", hidden: true },
  { type: "perf", section: "⚡️ Mejoras de Rendimiento", hidden: false },
  { type: "chore", hidden: true }
];

const repositoryUrl = "url-repository";
const repositoryUrlCommit = "url-repository-commit";
const repositoryUrlMergeRequests = "url-repository-pull-request";

module.exports = {
  branches: ['main'],
  repositoryUrl: repositoryUrl,
  tagFormat: 'v${version}',
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types
        },
        writerOpts: {
          transform: (commit, context) => {
            let discard = true;
            const issues = [];

            // Clone the commit object so we don't modify the immutable original
            const mutableCommit = { ...commit };
            mutableCommit.notes = commit.notes.map(note => ({ ...note }));

            mutableCommit.notes.forEach(note => {
              note.title = 'Cambios Importantes';
              discard = false;
            });

            if (mutableCommit.type === `release`) {
              discard = true;
            }

            if (mutableCommit.subject && typeof mutableCommit.subject === 'string') {
              // Capitalize the first letter of the subject
              mutableCommit.subject = mutableCommit.subject.charAt(0).toUpperCase() + mutableCommit.subject.slice(1);
            }

            const definition = types.find(t => t.type === mutableCommit.type);

            if (definition) {
              if (definition.hidden) return;
              mutableCommit.type = definition.section;
              discard = false;
            } else {
              return;
            }

            if (discard) return;

            if (mutableCommit.hash) {
              mutableCommit.shortHash = mutableCommit.hash.substring(0, 7);
            }

            return mutableCommit;
          },
          finalizeContext: (context, options, commits, keyCommit) => {
            const baseUrl = repositoryUrlCommit;
            const prUrl = repositoryUrlMergeRequests;

            context.commitGroups.forEach(group => {
              const byScope = {};

              group.commits.forEach(commit => {
                const scope = commit.scope || 'Global';
                commit.link = `${baseUrl}${commit.hash}`;

                if (commit.subject) {
                  commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
                    return `[#${issue}](${prUrl}${issue})`;
                  });
                }

                if (!byScope[scope]) byScope[scope] = [];
                byScope[scope].push(commit);
              });

              const newCommits = [];

              Object.keys(byScope).sort().forEach(scope => {
                const title = scope.charAt(0).toUpperCase() + scope.slice(1);
                newCommits.push({ scope: title, commits: byScope[scope] });
              });

              group.commits = newCommits;
            });

            return context;
          },
          commitPartial: `{{#if scope}}
- ### {{scope}}
{{/if}}
{{#each commits}}
  - {{subject}} ([{{shortHash}}]({{link}}))
{{/each}}`
        }
      }
    ],
    ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
    ['@semantic-release/git', {
      assets: ['CHANGELOG.md'],
      message: 'chore(release): se actualizan referencias de la nueva versión v${nextRelease.version} [skip ci]'
    }],
    ['@semantic-release/github', { githubUrl: 'https://github.com' }]
  ]
};
