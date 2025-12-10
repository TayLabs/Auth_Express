import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts', 'src/types/authenticate-middleware.d.ts'],
	format: ['cjs', 'esm'],
	dts: true,
	outDir: 'dist',
	clean: true,
	treeshake: true,
	target: 'es2020',
});
