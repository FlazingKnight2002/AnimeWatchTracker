
export interface ExternalAnimeResult {
  id: string;
  title: string;
  totalEpisodes: number | null;
  status: string;
  imageUrl: string;
  source: 'jikan' | 'anilist';
}

export async function searchExternalAnime(
  query: string,
  source?: 'jikan' | 'anilist'
): Promise<ExternalAnimeResult[]> {
  try {
    const params = new URLSearchParams({ q: query });
    if (source) {
      params.append('source', source);
    }

    const response = await fetch(`/api/anime/search?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('External anime search error:', error);
    return [];
  }
}
