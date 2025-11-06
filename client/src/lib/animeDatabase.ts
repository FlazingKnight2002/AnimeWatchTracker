export interface AnimeInfo {
  title: string;
  totalEpisodes?: number;
  totalSeasons?: number;
}

export const popularAnime: AnimeInfo[] = [
  { title: "Attack on Titan", totalEpisodes: 87 },
  { title: "Death Note", totalEpisodes: 37 },
  { title: "One Piece", totalEpisodes: 1000 },
  { title: "Naruto", totalEpisodes: 220 },
  { title: "Demon Slayer", totalEpisodes: 55 },
  { title: "My Hero Academia", totalEpisodes: 138 },
  { title: "Fullmetal Alchemist: Brotherhood", totalEpisodes: 64 },
  { title: "Hunter x Hunter", totalEpisodes: 148 },
  { title: "Steins;Gate", totalEpisodes: 24 },
  { title: "Code Geass", totalEpisodes: 50 },
  { title: "Cowboy Bebop", totalEpisodes: 26 },
  { title: "Sword Art Online", totalEpisodes: 96 },
  { title: "Tokyo Ghoul", totalEpisodes: 48 },
  { title: "One Punch Man", totalEpisodes: 24 },
  { title: "Dragon Ball Z", totalEpisodes: 291 },
  { title: "Bleach", totalEpisodes: 366 },
  { title: "Fairy Tail", totalEpisodes: 328 },
  { title: "Jujutsu Kaisen", totalEpisodes: 47 },
  { title: "Chainsaw Man", totalEpisodes: 12 },
  { title: "Spy x Family", totalEpisodes: 25 },
  { title: "Mob Psycho 100", totalEpisodes: 37 },
  { title: "Vinland Saga", totalEpisodes: 48 },
  { title: "Re:Zero", totalEpisodes: 50 },
  { title: "Violet Evergarden", totalEpisodes: 13 },
  { title: "Haikyuu!!", totalEpisodes: 85 },
  { title: "Fate/Zero", totalEpisodes: 25 },
  { title: "Made in Abyss", totalEpisodes: 25 },
  { title: "Your Lie in April", totalEpisodes: 22 },
  { title: "Parasyte", totalEpisodes: 24 },
  { title: "Black Clover", totalEpisodes: 170 },
  { title: "Fire Force", totalEpisodes: 48 },
  { title: "Dr. Stone", totalEpisodes: 58 },
  { title: "The Promised Neverland", totalEpisodes: 23 },
  { title: "Erased", totalEpisodes: 12 },
  { title: "Overlord", totalEpisodes: 52 },
  { title: "No Game No Life", totalEpisodes: 12 },
  { title: "That Time I Got Reincarnated as a Slime", totalEpisodes: 72 },
  { title: "Konosuba", totalEpisodes: 20 },
  { title: "The Rising of the Shield Hero", totalEpisodes: 50 },
  { title: "Mushoku Tensei", totalEpisodes: 48 },
  { title: "Tokyo Revengers", totalEpisodes: 50 },
  { title: "Blue Lock", totalEpisodes: 24 },
  { title: "Bocchi the Rock!", totalEpisodes: 12 },
  { title: "Lycoris Recoil", totalEpisodes: 13 },
  { title: "Cyberpunk: Edgerunners", totalEpisodes: 10 },
  { title: "Ranking of Kings", totalEpisodes: 23 },
  { title: "Odd Taxi", totalEpisodes: 13 },
  { title: "Vivy: Fluorite Eye's Song", totalEpisodes: 13 },
  { title: "86 Eighty-Six", totalEpisodes: 23 },
  { title: "Horimiya", totalEpisodes: 13 },
  { title: "Fruits Basket", totalEpisodes: 63 },
  { title: "Jojo's Bizarre Adventure", totalEpisodes: 190 }, 
  { title: "A Silent Voice", totalEpisodes: 1 }, 
  { title: "Hellsing Ultimate", totalEpisodes: 10 },
  { title: "Gurren Lagann", totalEpisodes: 27 },
  { title: "Code Geass R2", totalEpisodes: 25 },
  { title: "Your Name", totalEpisodes: 1 }, 
  { title: "Sonic X", totalEpisodes: 78 }, 
  { title: "The Apothecary Diaries", totalEpisodes: 48 }, 
  { title: "Date A Live", totalEpisodes: 58 }, 
  { title: "Komi Can't Communicate", totalEpisodes: 24 }, 
  { title: "Gachiakuta", totalEpisodes: 24 }, 
  { title: "Solo Leveling", totalEpisodes: 25 }, 
  { title: "Kaiju No. 8", totalEpisodes: 12 },
  { title: "Frieren: Beyond Journey's End", totalEpisodes: 28 },
  { title: "Dandadan", totalEpisodes: 12 }, 
  { title: "Delicious in Dungeon", totalEpisodes: 24 },
];

export function addAnimeToDatabase(anime: AnimeInfo): void {
  const exists = popularAnime.some(
    existing => existing.title.toLowerCase() === anime.title.toLowerCase()
  );
  
  if (!exists) {
    popularAnime.push(anime);
  }
}

export function fuzzySearch(query: string, limit: number = 8): AnimeInfo[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();

  const scored = popularAnime
    .map(anime => {
      const lowerAnime = anime.title.toLowerCase();
      let score = 0;

      if (lowerAnime === lowerQuery) {
        score = 1000;
      } else if (lowerAnime.startsWith(lowerQuery)) {
        score = 500;
      } else if (lowerAnime.includes(lowerQuery)) {
        score = 250;
      } else {
        const words = lowerAnime.split(/\s+/);
        for (const word of words) {
          if (word.startsWith(lowerQuery)) {
            score = 300;
            break;
          }
        }
      }

      if (score > 0) {
        score -= anime.title.length * 0.1;
      }

      return { anime, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.anime);

  return scored;
}
