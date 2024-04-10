import { ZkNoidGameFeature, ZkNoidGameGenre } from '@/lib/platform/game_tags';

export interface IGame {
  id: string;
  logo: string;
  rating: number;
  name: string;
  description: string;
  genre: ZkNoidGameGenre;
  features: ZkNoidGameFeature[];
  defaultPage: string;
  active: boolean;
  isReleased: boolean;
  releaseDate: Date;
  popularity: number;
  author: string;
}

export const announcedGames: IGame[] = [
  {
    id: 'checkers',
    logo: '/image/games/soon.svg',
    rating: 0,
    name: 'Checkers game',
    description: 'Compete other players in the classic board game',
    genre: ZkNoidGameGenre.BoardGames,
    features: [ZkNoidGameFeature.Multiplayer],
    defaultPage: 'global',
    active: false,
    isReleased: false,
    releaseDate: new Date(2024, 2, 25),
    popularity: 0,
    author: 'ZkNoid Team',
  },
  {
    id: 'znake',
    logo: '/image/games/soon.svg',
    rating: 0,
    name: 'Znake game',
    description: 'Collect all the points and try not to bite your tail',
    genre: ZkNoidGameGenre.Arcade,
    features: [ZkNoidGameFeature.SinglePlayer],
    defaultPage: 'global',
    active: false,
    isReleased: false,
    releaseDate: new Date(2024, 5, 1),
    popularity: 0,
    author: 'ZkNoid Team',
  },
  {
    id: 'poker',
    logo: '/image/games/soon.svg',
    rating: 0,
    name: 'Poker game',
    description:
      'A card game, the purpose is to collect a winning combination or force all rivals to stop participating in the game',
    genre: ZkNoidGameGenre.Lucky,
    features: [ZkNoidGameFeature.Multiplayer],
    defaultPage: 'global',
    active: false,
    isReleased: false,
    releaseDate: new Date(2024, 4, 21),
    popularity: 0,
    author: 'ZkNoid Team',
  },
];

export const defaultGames: IGame[] = [
  {
    id: 'arkanoid',
    logo: '/image/games/arkanoid.svg',
    rating: 4.5,
    name: 'Arkanoid game',
    description:
      'Old but gold game. Beat all the bricks and protect the ball from falling',
    genre: ZkNoidGameGenre.Arcade,
    features: [ZkNoidGameFeature.SinglePlayer],
    defaultPage: 'competitions-list',
    active: true,
    isReleased: true,
    releaseDate: new Date(2023, 11, 1),
    popularity: 60,
    author: 'ZkNoid Team',
  },
  {
    id: 'randzu',
    logo: '/image/games/randzu.svg',
    rating: 2.2,
    name: 'Randzu game',
    description:
      'Two players take turns placing pieces on the board attempting to create lines of 5 of their own color',
    genre: ZkNoidGameGenre.BoardGames,
    features: [ZkNoidGameFeature.Multiplayer],
    defaultPage: 'global',
    active: true,
    isReleased: true,
    releaseDate: new Date(2024, 0, 1),
    popularity: 50,
    author: 'ZkNoid Team',
  },
];
