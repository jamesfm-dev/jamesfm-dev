import { graphql } from "@octokit/graphql";

const query = graphql.defaults({
	headers: {
		authorization: `token ${import.meta.env.GH_TOKEN}`,
	},
});

type SocialsResponse = {
	viewer: {
		twitterUsername: string;
		email: string;
		websiteUrl: string;
		socialAccounts: {
			nodes: [
				{
					displayName: string;
					provider: string;
					url: string;
				}
			];
		};
		url: string;
	};
};

export type Provider = "twitter" | "github" | "email" | "mastodon" | "linkedin";

export type Socials = Social[];

export type Social = {
	url: string;
	provider: Provider;
	displayName: string;
};

export const querySocials = async () => {
	const user = await query<SocialsResponse>(`{
    viewer {
      url
      twitterUsername
      email
      socialAccounts(first: 10) {
        nodes {
          displayName
          provider
          url
        }
      }
    }
  }`);

	return formatSocials(user);
};

function formatSocials(socials: SocialsResponse) {
	const { viewer } = socials;

	const formattedSocials: Socials = [
		{
			url: viewer.url,
			provider: "github",
			displayName: viewer.url.split("com/")[1]!,
		},
		{
			url: viewer.email,
			provider: "email",
			displayName: viewer.email,
		},
		{
			url: viewer.twitterUsername ? `https://twitter.com/${viewer.twitterUsername}` : "",
			provider: "twitter",
			displayName: viewer.twitterUsername,
		},
		...viewer.socialAccounts.nodes.map((social) => ({
			url: social.url,
			provider: social.provider.toLowerCase() as Provider,
			displayName: social.displayName,
		})),
	];

	return formattedSocials;
}
