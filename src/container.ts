import { Container } from 'inversify';
import { dataSource } from './db/database';

export const container = new Container();

export async function setupContainer() {
    await dataSource.initialize();

    // export container;
}
