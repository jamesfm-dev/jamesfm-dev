/// <reference path="../.astro/types.d.ts" />
/// <reference types="@astrojs/image/client" />

interface ImportMetaEnv {
	readonly GA_MEASUREMENT_ID: string;
	readonly GH_TOKEN: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
