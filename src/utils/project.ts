import type { LanguageItems, ProjectsReponse } from "@/data/projects";

export function filterProjectNames(projects: ProjectsReponse) {
	if (!projects) return [];
	return projects.viewer.pinnedItems.edges.map((x) => {
		return {
			name: x.node.name,
			url: x.node.url,
			description: x.node.description,
			languages: formatLanguages(x.node.languages.edges, x.node.languages.totalSize),
      updatedAt: x.node.updatedAt,
		};
	});
}

function formatLanguages(languages: LanguageItems, totalSize: number) {
	const significantLower = 5;
	if (languages.length == 0) return [];

	let significantOthers = {
		name: "Other",
		color: "#ededed",
		percentage: 0,
	};

	const lang = languages.map((x) => {
		return {
			name: x.node.name,
			color: x.node.color,
			percentage: ((x.size / totalSize) * 100).toFixed(1),
		};
	});

	lang.forEach((x) => {
		if (Number(x.percentage) < significantLower) {
			significantOthers.percentage += Number(x.percentage);
		}
	});

	return lang
		.filter((x) => Number(x.percentage) > significantLower)
		.concat({
			...significantOthers,
			percentage: significantOthers.percentage.toFixed(1),
		});
}
