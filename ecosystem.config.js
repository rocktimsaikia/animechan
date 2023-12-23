module.exports = {
	apps: [
		{
			name: 'animechan',
			script: 'pnpm',
			args: 'start:prod',
			watch: true,
			ignore_watch: [
				'**/node_modules',
				'**/pnpm-lock.yaml',
				'**/*.md',
				'.github',
				'.editorconfig',
				'.gitignore',
				'.prettierignore',
				'.env_example',
				'client/.next',
				'LICENSE',
				'logs',
			],
			autorestart: true,
			max_memory_restart: '1G',
			out_file: 'logs/out.log',
			error_file: 'logs/error.log',
		},
	],
};
