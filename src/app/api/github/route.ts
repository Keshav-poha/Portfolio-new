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

  // 1. Try pinned repos via GraphQL (requires token)
  if (token) {
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

    if (gqlRes?.ok) {
      const json = await gqlRes.json();
      const nodes: GQLRepo[] = json?.data?.user?.pinnedItems?.nodes ?? [];
      if (nodes.length > 0) {
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
    }
  }

  // 2. Fallback: top starred repos via REST
  const res = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?sort=stars&per_page=6`,
    { headers: GH_HEADERS, next: { revalidate: 3600 } }
  );

  if (!res.ok) return NextResponse.json({ error: "Failed to fetch repos" }, { status: 500 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any[] = await res.json();
  return NextResponse.json(
    data.map((r) => ({
      name: r.name as string,
      description: (r.description ?? "") as string,
      html_url: r.html_url as string,
      language: (r.language ?? null) as string | null,
      stars: r.stargazers_count as number,
      homepage: (r.homepage ?? "") as string,
      fork: r.fork as boolean,
    }))
  );
}
