
interface JikanAnimeResult {
  mal_id: number;
  title: string;
  episodes: number | null;
  status: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

interface AniListAnimeResult {
  id: number;
  title: {
    romaji: string;
    english: string | null;
  };
  episodes: number | null;
  status: string;
  coverImage: {
    large: string;
  };
}

export interface ExternalAnimeResult {
  id: string;
  title: string;
  totalEpisodes: number | null;
  status: string;
  imageUrl: string;
  source: 'jikan' | 'anilist';
}

export async function searchJikan(query: string): Promise<ExternalAnimeResult[]> {
  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`
    );
    
    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }

    const data = await response.json();
    const results: JikanAnimeResult[] = data.data || [];

    return results.map(anime => ({
      id: `jikan-${anime.mal_id}`,
      title: anime.title,
      totalEpisodes: anime.episodes,
      status: anime.status.toLowerCase(),
      imageUrl: anime.images.jpg.image_url,
      source: 'jikan' as const,
    }));
  } catch (error) {
    console.error('Jikan search error:', error);
    return [];
  }
}

export async function searchAniList(query: string): Promise<ExternalAnimeResult[]> {
  try {
    const graphqlQuery = `
      query ($search: String) {
        Page(page: 1, perPage: 10) {
          media(search: $search, type: ANIME) {
            id
            title {
              romaji
              english
            }
            episodes
            status
            coverImage {
              large
            }
          }
        }
      }
    `;

    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: { search: query },
      }),
    });

    if (!response.ok) {
      throw new Error(`AniList API error: ${response.status}`);
    }

    const data = await response.json();
    const results: AniListAnimeResult[] = data.data?.Page?.media || [];

    return results.map(anime => ({
      id: `anilist-${anime.id}`,
      title: anime.title.english || anime.title.romaji,
      totalEpisodes: anime.episodes,
      status: anime.status.toLowerCase(),
      imageUrl: anime.coverImage.large,
      source: 'anilist' as const,
    }));
  } catch (error) {
    console.error('AniList search error:', error);
    return [];
  }
}

export async function searchAllSources(query: string): Promise<ExternalAnimeResult[]> {
  const [jikanResults, anilistResults] = await Promise.all([
    searchJikan(query),
    searchAniList(query),
  ]);

  // Combine and deduplicate results based on title similarity
  const allResults = [...jikanResults, ...anilistResults];
  const uniqueResults: ExternalAnimeResult[] = [];
  const seenTitles = new Set<string>();

  for (const result of allResults) {
    const normalizedTitle = result.title.toLowerCase().trim();
    if (!seenTitles.has(normalizedTitle)) {
      seenTitles.add(normalizedTitle);
      uniqueResults.push(result);
    }
  }

  return uniqueResults.slice(0, 15);
}
