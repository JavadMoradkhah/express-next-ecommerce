import { AppDataSource } from '../config/database';
import { Tag } from '../entities/tag.entity';

export const tagsRepo = AppDataSource.getRepository(Tag);
