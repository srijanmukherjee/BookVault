import { client } from "./db";
import booksJSON from "../prisma/books.json";

interface Options {
    exclude?: {
        category?: string[];
        format?: string[];
    }
}

interface BookObj {
    title: string;
    author: string;
    image: string;
    pages: number;
    format: string;
    genres: string[]
}

interface ProcessedBook {
    title: string;
    author: string;
    image: string;
    pages: number;
    format: string;
    categories: string[];
    slug: string;
}

function preprocess(books: any[], options: Options): [ProcessedBook[], string[], string[]] {
    const processed_books: ProcessedBook[] = [];
    const categories = new Set<string>();
    const formats: Set<string> = new Set<string>();

    for (const book of books) {
        if (options.exclude?.format?.includes(book.format) || !book.pages || !book.format || book.genres.length == 0 || !book.title || !book.author) continue;

        const _categories = book.genres.filter((cat: string) => !options.exclude?.category?.includes(cat));
        _categories.forEach((cat: string) => categories.add(cat));
        formats.add(book.format);
        const processed_book = {
            title: book.title,
            author: book.author,
            image: book.image,
            pages: book.pages,
            format: book.format,
            categories: _categories,
            slug: book.title.toLowerCase().replace(/ /g, '-').replace(/[-]+/g, '-').replace(/[^\w-]+/g, '')
        }

        if (processed_book.categories.length == 0) continue;

        processed_books.push(processed_book);
    }

    return [processed_books, Array.from(categories.values()), Array.from(formats.values())];
}

async function main() {
    const [books, categories, formats] = preprocess(booksJSON, {
        exclude: {
            category: ['Audiobook'],
            format: ['ebook', 'Kindle Edition']
        }
    });

    const category_id_map: { [key: string]: number } = {};

    for (const category of categories) {
        const result = await client.category.create({
            data: {
                name: category
            }
        });
        category_id_map[category] = result.id;
    }

    for (const book of books) {
        try {
            const record = await client.book.create({
                data: {
                    name: book.title,
                    author: book.author,
                    image: book.image,
                    pages: book.pages,
                    format: book.format,
                    categories: {
                        connect: book.categories.map(category => ({ id: category_id_map[category] }))
                    },
                    slug: book.slug
                }
            });
            console.log(`🟩 ${record.id} | ${record.name}`);
        } catch (err: any) {
            console.log(`🟥 ${err.toString()}.`);
            console.log(book);
        }
    }

    console.log('🟩 done');
}

main()
    .then(async () => {
        await client.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await client.$disconnect();
        process.exit(1);
    })