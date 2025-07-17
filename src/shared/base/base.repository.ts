import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';

export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  private readonly dataSource: DataSource;

  constructor(target: EntityTarget<T>, dataSource: DataSource) {
      super(target, dataSource.createEntityManager());
      this.dataSource = dataSource;
  }

  getDataSource() {
      return this.dataSource;
  }
}
