import 'reflect-metadata';
import { ObjectType, Field, Resolver, Query, ID } from 'type-graphql';
import { client } from '../db';
import { Book } from './Book.model';

@ObjectType("Language")
export class Language {
    @Field(type => ID)
    id: number

    @Field()
    name: string

    @Field(type => [Book], { nullable: true })
    books: Book[]
}

@Resolver(Language)
export class LanguageResolver {
    @Query((returns) => [Language], { nullable: true })
    async languages() {
        return client.language.findMany({
            ...this.buildQuery()
        })
    }

    buildQuery() {
        const query: any = {};

        query.include = {
            books: true
        }

        return query;
    }
}