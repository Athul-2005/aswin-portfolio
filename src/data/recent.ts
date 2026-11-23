export type RecentArt = {
  id: string;
  src: string;
  title: string;
  date: string;
  instagramUrl: string;
  width: number;
  height: number;
  alt: string;
};

// [PLACEHOLDER - to be replaced with real Instagram posts]
export const recentArts: RecentArt[] = [
  {
    id: "recent-1",
    src: "/photos/recent/scarborough-mist.jpg",
    title: "Morning Mist over the Bluffs",
    date: "October 2026",
    instagramUrl: "https://instagram.com/",
    width: 2000,
    height: 1333,
    alt: "Dramatic bluffs vanishing into low autumn clouds",
  },
  {
    id: "recent-2",
    src: "/photos/recent/candid-street-reflection.jpg",
    title: "After the Rain / Queen West",
    date: "October 2026",
    instagramUrl: "https://instagram.com/",
    width: 2000,
    height: 1333,
    alt: "Street puddle reflecting historic red brick architecture",
  },
  {
    id: "recent-3",
    src: "/photos/recent/wedding-confetti.jpg",
    title: "The Exit / St. Lawrence Hall",
    date: "September 2026",
    instagramUrl: "https://instagram.com/",
    width: 2000,
    height: 1333,
    alt: "Dried flower petals falling around laughing newlyweds",
  },
  {
    id: "recent-4",
    src: "/photos/recent/muskoka-dock-solo.jpg",
    title: "Solitude at 6 AM",
    date: "September 2026",
    instagramUrl: "https://instagram.com/",
    width: 2000,
    height: 1333,
    alt: "Empty Adirondack chair perched on a still lake dock",
  },
  {
    id: "recent-5",
    src: "/photos/recent/coffee-light-shadow.jpg",
    title: "Interlude",
    date: "August 2026",
    instagramUrl: "https://instagram.com/",
    width: 2000,
    height: 1333,
    alt: "Graphic geometric shadows falling across an espresso cup",
  },
  {
    id: "recent-6",
    src: "/photos/recent/distillery-winter-dusk.jpg",
    title: "Cobblestones & Edison Bulbs",
    date: "August 2026",
    instagramUrl: "https://instagram.com/",
    width: 2000,
    height: 1333,
    alt: "Warm industrial district illuminated by overhead filament lights",
  },
];
