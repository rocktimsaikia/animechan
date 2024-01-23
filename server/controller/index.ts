import type { Request, Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { isEmpty } from 'lodash';
import { paginate } from '~/controller/utils';
import { db } from '~/db/drizzle';
import { anime, character, quote } from '~/db/schema';

import { iLike, rand } from '~/db/utils';

export const getRandomQuote = async (_: Request, res: Response) => {
	// List a single random quote
	const randomQuote = await db.select().from(quote).orderBy(rand).limit(1);
	res.json(randomQuote[0]);
};

export const getRandomQuotes = async (_: Request, res: Response) => {
	// List 10 random quotes
	const quotes = await db.select().from(quote).orderBy(rand).limit(10);
	res.json(quotes);
};

export const getRandomQuoteByAnime = async (req: Request, res: Response) => {
	// List a single random quote by anime name
	const { title } = req.query;

	if (!title || typeof title !== 'string') {
		res.status(StatusCodes.BAD_REQUEST).json({
			error: getReasonPhrase(StatusCodes.BAD_REQUEST),
		});
		return;
	}

	const randomQuote = await db
		.select()
		.from(quote)
		.where(iLike(anime.name, title))
		.orderBy(rand)
		.limit(1);

	res.status(200);
	res.json(randomQuote[0]);
};

export const getRandomQuoteByCharacter = async (req: Request, res: Response) => {
	// List a single random quote by character name
	let { name } = req.query;

	if (!name || typeof name !== 'string') {
		res.status(StatusCodes.BAD_REQUEST).json({
			error: getReasonPhrase(StatusCodes.BAD_REQUEST),
		});
		return;
	}

	const quotes = await db
		.select()
		.from(quote)
		.where(iLike(character.name, name))
		.limit(1);

	if (isEmpty(quotes)) {
		res.status(StatusCodes.NOT_FOUND).json({
			error: 'No related quotes found!',
		});
		return;
	}

	res.json(quotes[0]);
};

export const getQuotesByAnime = async (req: Request, res: Response) => {
	// List quotes by anime title
	let { title, page } = req.query;

	if (!title || typeof title !== 'string') {
		res.status(StatusCodes.BAD_REQUEST).json({
			error: getReasonPhrase(StatusCodes.BAD_REQUEST),
		});
		return;
	}

	if (page && typeof page === 'string') {
		let quotes = await db
			.select()
			.from(quote)
			.where(iLike(anime.name, title))
			.offset(parseInt(page) * 10)
			.limit(10);

		if (isEmpty(quotes)) {
			res.status(404).json({ error: 'No quotes found!' });
			return;
		}

		res.json(quotes);
		return;
	}

	const quotes = await db.select().from(quote).where(iLike(anime.name, title)).limit(10);

	if (isEmpty(quotes)) {
		res.status(StatusCodes.NOT_FOUND).json({
			error: 'No related quotes found!',
		});
		return;
	}

	res.json(quotes);
};

export const getQuotesByCharacter = async (req: Request, res: Response) => {
	// List quotes by anime character
	let { name, page } = req.query;
	name = name as string;
	page = page as string;

	if (!name) {
		res.status(StatusCodes.BAD_REQUEST).json({
			error: getReasonPhrase(StatusCodes.BAD_REQUEST),
		});
		return;
	}

	if (page) {
		let quotes = await db
			.select()
			.from(quote)
			.where(iLike(character.name, name))
			.offset(parseInt(page) * 10)
			.limit(10);

		quotes = paginate(quotes, parseInt(page));

		if (isEmpty(quotes)) {
			res.status(404).json({ error: 'No quotes found!' });
			return;
		}

		res.json(quotes);
		return;
	}

	const quotes = await db.select().from(quote).where(iLike(anime.name, name)).limit(10);

	if (isEmpty(quotes)) {
		res.status(StatusCodes.NOT_FOUND).json({
			error: 'No related quotes found!',
		});
		return;
	}

	res.json(quotes);
};

export const getAllAnimeNames = async (_: Request, res: Response) => {
	// List all the available anime names
	const allAnime = await db.select({ name: anime.name }).from(anime);
	const animeList: string[] = allAnime.map((a) => a.name);
	res.json(animeList);
};

export const getAllCharacterNames = async (_: Request, res: Response) => {
	// List all the available character names
	const allCharacters = await db.select({ name: character.name }).from(character);
	const characterList = allCharacters.map((c) => c.name);
	res.json(characterList);
};
