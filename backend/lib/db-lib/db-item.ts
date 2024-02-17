import { getClient } from './db-client';
import { COLLECTION } from '../enums';

/**
 * A database item. All database items should extend this class.
 */
export abstract class DbItem {
  /**
   * The id of the item in a collection
   */
  public readonly id: number;

  /**
   * The collection this database item belongs to
   */
  public readonly collectionName: COLLECTION;

  constructor(id: number, collectionName: COLLECTION, _key: string | null = null) {
    this.id = id;
    this.collectionName = collectionName;
  }

  /**
   * Writes this database item to the database
   */
  public async writeToDatabase(): Promise<void> {
    const client = await getClient();
    return client.writeDbItems(this);
  }

  /**
   * Remove this database item from the database
   */
  public async removeFromDatabase(): Promise<any> {
    const client = await getClient();
    return client.deleteDbItem(this);
  }

  /**
   * Convert the class into a JSON object for storage
   */
  public abstract toJson(): Record<string, any>;
}