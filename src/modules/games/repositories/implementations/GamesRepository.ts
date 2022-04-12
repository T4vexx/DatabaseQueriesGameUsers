import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = this.repository
      .createQueryBuilder()
      .where('title ilike :title', {title: `%${param}%`})
      .getMany()
      // Complete usando query builder
    return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const countRaw = await this.repository.query("SELECT * FROM games ORDER BY title ASC");

    return [{ 
      count: String(countRaw.length)
    }]; // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const user = this.repository
      .createQueryBuilder('games')
      .innerJoinAndSelect('games.users', 'users')
      .getOne().then(game => {
        if (!game) {
          throw new Error('Game not found!')
        }
        return game.users
      })
      // Complete usando query builder

    return user;
  }
}
