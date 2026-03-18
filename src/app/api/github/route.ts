import { NextResponse } from "next/server";

export const revalidate = 3600;

const USERNAME = "Keshav-poha";
const GH_HEADERS = { Accept: "application/vnd.github+json", "User-Agent": "portfolio-app" };

const PINNED_QUERY = `
  query($login: String!) {
    user(login: $login) {
      pinnedItems(first: 6, types: [REPOSITORY]) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            homepageUrl
            isFork
            primaryLanguage {
              name
              color
            }
          }
        }
      }
    }
  }
`;

type GQLRepo = {
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  homepageUrl: string | null;
  isFork: boolean;
  primaryLanguage: { name: string; color: string } | null;
};

export async function GET() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "GitHub token not configured" },
      { status: 500 }
    );
  }

  // Fetch pinned repos via GraphQL
  const gqlRes = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      ...GH_HEADERS,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query: PINNED_QUERY, variables: { login: USERNAME } }),
    next: { revalidate: 3600 },
  }).catch(() => null);

  if (!gqlRes?.ok) {
    return NextResponse.json(
      { error: "Failed to fetch pinned repos" },
      { status: 500 }
    );
  }

  const json = await gqlRes.json();
  const nodes: GQLRepo[] = json?.data?.user?.pinnedItems?.nodes ?? [];

  return NextResponse.json(
    nodes.map((r) => ({
      name: r.name,
      description: r.description ?? "",
      html_url: r.url,
      language: r.primaryLanguage?.name ?? null,
      stars: r.stargazerCount,
      homepage: r.homepageUrl ?? "",
      fork: r.isFork,
    }))
  );
}
