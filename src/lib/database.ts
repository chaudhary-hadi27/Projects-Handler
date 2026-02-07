import Dexie, { Table } from 'dexie';

export interface Project {
    id?: number;
    title: string;
    url: string;
    category: string;
    createdAt: Date;
}

export interface Category {
    id?: number;
    name: string;
    createdAt: Date;
}

export class AppDatabase extends Dexie {
    projects!: Table<Project>;
    categories!: Table<Category>;

    constructor() {
        super('SmartKodeDB');
        this.version(1).stores({
            projects: '++id, title, category, createdAt',
            categories: '++id, name, createdAt'
        });
    }
}

export const db = new AppDatabase();