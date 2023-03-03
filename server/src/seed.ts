import path from "path";
import { client } from "../src/db";
import { readFileSync } from "fs";

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
    languages: string[];
}

interface Product {
    slug: string;
    book: ProcessedBook;
    price: number;
    discount: number;
    featured: boolean;
    rating: number;
}

const languages = ['English', 'German', 'French'];

const shuffle = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const generateRandomLanguageSet = (): string[] => {
    const len = Math.floor(Math.random() * languages.length) + 1;
    const languagesCopy = [...languages];
    shuffle(languagesCopy);
    return languagesCopy.slice(0, len);
}

function preprocess(books: BookObj[], options: Options): [Product[], string[], string[]] {
    const processed_products: Product[] = [];
    const categories = new Set<string>();
    const formats: Set<string> = new Set<string>();

    for (const book of books) {
        if (options.exclude?.format?.includes(book.format) || !book.pages || !book.format || book.genres.length == 0 || !book.title || !book.author) continue;

        const _categories = book.genres.filter((cat) => !options.exclude?.category?.includes(cat));
        _categories.forEach((cat) => categories.add(cat));
        formats.add(book.format);
        const processed_book = {
            title: book.title,
            author: book.author,
            image: book.image,
            pages: book.pages,
            format: book.format,
            categories: _categories,
            languages: generateRandomLanguageSet()
        }

        if (processed_book.categories.length == 0) continue;

        processed_products.push({
            slug: book.title.toLowerCase().replace(/ /g, '-').replace(/[-]+/g, '-').replace(/[^\w-]+/g, ''),
            book: processed_book,
            price: Math.floor(Math.random() * 100000) + 20000,
            discount: Math.floor(Math.random() * 15),
            featured: Math.random() < 0.2,
            rating: Math.floor(Math.random() * (10 + 1)) * 5 / 10 // gives values between 0 and 5 with step size 0.5
        });
    }

    return [processed_products, Array.from(categories.values()), Array.from(formats.values())];
}

async function main() {
    const booksJSON = JSON.parse(readFileSync(path.join(__dirname, "../prisma/books.json")).toString());
    const [products, categories, formats] = preprocess(booksJSON, {
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

    const language_id_map: { [key: string]: number } = {};

    for (const language of languages) {
        const result = await client.language.create({
            data: {
                name: language
            }
        });
        language_id_map[language] = result.id;
    }

    for (const product of products) {
        const { book } = product;
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
                    languages: {
                        connect: book.languages.map(language => ({ id: language_id_map[language] }))
                    }
                }
            });
            const productRecord = await client.product.create({
                data: {
                    slug: product.slug,
                    rating: product.rating,
                    price: product.price,
                    discount: product.discount,
                    featured: product.featured,
                    book: {
                        connect: {
                            id: record.id
                        }
                    }
                }
            })
            console.log(`🟩 ${productRecord.id} | ${record.name}`);
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