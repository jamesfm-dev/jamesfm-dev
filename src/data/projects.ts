import { graphql } from "@octokit/graphql";

const query = graphql.defaults({
	headers: {
		authorization: `token ${import.meta.env.GH_TOKEN}`,
	},
});

export type ProjectsReponse = {
	viewer: {
		pinnedItems: {
			edges: ProjectItems;
		};
	};
};

type ProjectItems = ProjectItem[];
type ProjectItem = {
	node: {
		name: string;
		languages: {
			totalSize: number;
			nodes: {
				id: string;
			}[];
			edges: LanguageItems;
		};
		url: string;
		description: string;
		primaryLanguage: Omit<LanguageItem, "size">["node"];
		updatedAt: string;
		pushedAt: string;
	};
};

export type LanguageItems = LanguageItem[];
type LanguageItem = {
	size: number;
	node: {
		name: string;
		color: string;
	};
};

export const queryProjects = async () => {
	const repo = await query<ProjectsReponse>(`{
    viewer {
      pinnedItems(first: 10) {
        edges {
          node {
            ... on Repository {
              name
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                totalSize
                nodes {
                  id
                }
                edges {
                  size
                  node {
                    name
                    color
                  }
                }
              }
              url
              description
              primaryLanguage {
                color
                name
              }
              updatedAt
              pushedAt
            }
          }
        }
      }
    }
  }`);

	return repo;
};
