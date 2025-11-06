export const popularAnime = [
  "Attack on Titan",
  "Death Note",
  "One Piece",
  "Naruto",
  "Demon Slayer",
  "My Hero Academia",
  "Fullmetal Alchemist: Brotherhood",
  "Hunter x Hunter",
  "Steins;Gate",
  "Code Geass",
  "Cowboy Bebop",
  "Sword Art Online",
  "Tokyo Ghoul",
  "One Punch Man",
  "Dragon Ball Z",
  "Bleach",
  "Fairy Tail",
  "Jujutsu Kaisen",
  "Chainsaw Man",
  "Spy x Family",
  "Mob Psycho 100",
  "Vinland Saga",
  "Re:Zero",
  "Violet Evergarden",
  "Haikyuu!!",
  "Fate/Zero",
  "Made in Abyss",
  "Your Lie in April",
  "Parasyte",
  "Black Clover",
  "Fire Force",
  "Dr. Stone",
  "The Promised Neverland",
  "Erased",
  "Overlord",
  "No Game No Life",
  "That Time I Got Reincarnated as a Slime",
  "Konosuba",
  "The Rising of the Shield Hero",
  "Mushoku Tensei",
  "Tokyo Revengers",
  "Blue Lock",
  "Bocchi the Rock!",
  "Lycoris Recoil",
  "Cyberpunk: Edgerunners",
  "Ranking of Kings",
  "Odd Taxi",
  "Vivy: Fluorite Eye's Song",
  "86 Eighty-Six",
  "Horimiya",
  "Fruits Basket",
];

export function fuzzySearch(query: string, limit: number = 8): string[] {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  
  const scored = popularAnime
    .map(anime => {
      const lowerAnime = anime.toLowerCase();
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
        score -= anime.length * 0.1;
      }
      
      return { anime, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.anime);
  
  return scored;
}
