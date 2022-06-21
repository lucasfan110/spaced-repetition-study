import { fs, path } from "@tauri-apps/api";

export const DAYS_TO_MS = 86_400_000;

export type Flashcard = {
	question: string;
	answer: string;
	lastTimeCorrect: Date | null;
	correctCount: number;
};

export type DeckJson = {
	deckName: string;
	flashcards: Flashcard[];
};

export class CannotReadFileError extends Error {
	public constructor(path: string) {
		super(`Failed to read data at ${path}`);

		Object.setPrototypeOf(this, CannotReadFileError.prototype);
	}

	public test = () => {};
}

export class InvalidFormatError extends Error {
	public constructor() {
		super("Format is not valid");

		Object.setPrototypeOf(this, InvalidFormatError.prototype);
	}
}

export default class Deck {
	private _deckName: string;
	private _flashcards: Flashcard[] = [];

	public constructor(deckName: string) {
		this._deckName = deckName;
	}

	public static async getSaveDir(deckName: string): Promise<string> {
		return `${await path.appDir()}flashcards/${deckName}/`;
	}

	public static fromJson(json: DeckJson): Deck {
		const deck = new Deck(json.deckName);
		deck.flashcards = json.flashcards;
		return deck;
	}

	public toJson(): DeckJson {
		return {
			deckName: this.deckName,
			flashcards: this.flashcards,
		};
	}

	public static async getAvailableDeckNames(): Promise<string[]> {
		const dirs = await fs.readDir(`${await path.appDir()}flashcards/`, {
			recursive: true,
		});

		return dirs
			.filter(dir => {
				const children = dir.children;

				if (!children) {
					return false;
				}

				const containData = children.find(child => {
					return child.name === "cards.json" && child.children === undefined;
				});
				return dir.name && containData !== undefined;
			})
			.map(dir => dir.name!);
	}

	private async getSaveDir(): Promise<string> {
		return Deck.getSaveDir(this.deckName);
	}

	public async save() {
		fs.createDir(await this.getSaveDir(), { recursive: true });
		fs.writeFile({
			path: `${await this.getSaveDir()}cards.json`,
			contents: JSON.stringify(this.toJson(), undefined, 4),
		});
	}

	public addCard(card: Flashcard) {
		this.flashcards.push(card);
		this.save();
	}

	public async changeDeckName(newName: string) {
		fs.removeDir(await this.getSaveDir(), { recursive: true });
		this._deckName = newName;
		this.save();
	}

	public spacedRepetitionFilter(): Flashcard[] {
		return this.flashcards.filter(card => {
			if (card.lastTimeCorrect === null) {
				return true;
			}

			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

			const lastTimeCorrectDate = new Date(
				card.lastTimeCorrect.getFullYear(),
				card.lastTimeCorrect.getMonth() + 1,
				card.lastTimeCorrect.getDate()
			);

			const days = Math.round((today.getTime() - lastTimeCorrectDate.getTime()) / DAYS_TO_MS);
			console.log("days = ", days);

			if (days >= card.correctCount) {
				return true;
			}

			return false;
		});
	}

	public get deckName(): string {
		return this._deckName;
	}

	public get flashcards(): Flashcard[] {
		return this._flashcards;
	}

	public set flashcards(value: Flashcard[]) {
		this._flashcards = value;
	}
}

async function loadDeck(deckName: string): Promise<Deck> {
	const path = `${await Deck.getSaveDir(deckName)}cards.json`;

	let json: string;
	try {
		json = await fs.readTextFile(path);
	} catch {
		throw new CannotReadFileError(path);
	}

	let deckJson: DeckJson;
	try {
		deckJson = JSON.parse(json, (key, value) => {
			if (key === "lastTimeCorrect" && value !== null) {
				return new Date(value);
			}

			return value;
		}) as DeckJson;
	} catch {
		throw new InvalidFormatError();
	}

	return Deck.fromJson(deckJson);
}

export type Info = {
	deckName: string;
	lastOpened: Date;
};

export class RecentDeckInfo {
	private _info: Info[];

	private constructor(info: Info[]) {
		this._info = info;
	}

	private static async filePath(): Promise<string> {
		return `${await path.appDir()}flashcards/recent.json`;
	}

	public static async getInfo(): Promise<RecentDeckInfo> {
		const recentPath = await RecentDeckInfo.filePath();

		let recentJson: string;
		try {
			recentJson = await fs.readTextFile(recentPath);
		} catch (e) {
			fs.writeFile({ path: recentPath, contents: "[]" });
			return new RecentDeckInfo([]);
		}

		let infos: Info[];
		try {
			infos = JSON.parse(recentJson, (key, value) => {
				if (key === "lastOpened") {
					return new Date(value);
				}
				return value;
			}) as Info[];
		} catch (e) {
			console.error("Failed to parse recent.json! Error: " + e);
			return new RecentDeckInfo([]);
		}

		return new RecentDeckInfo(infos);
	}

	public openDeck = async (deckName: string, isNewDeck: boolean): Promise<Deck | null> => {
		const index = this.info.findIndex(info => info.deckName === deckName);

		let deck: Deck | null = null;

		if (index === -1) {
			if (isNewDeck) {
				this.info.push({ deckName, lastOpened: new Date() });
				deck = new Deck(deckName);
			} else {
				deck = null;
			}
		} else {
			try {
				deck = await loadDeck(deckName);
			} catch (err) {
				if (err instanceof CannotReadFileError) {
					this.info.splice(index, 1);
					deck = null;
				} else if (err instanceof InvalidFormatError) {
					deck = new Deck(deckName);
				}
			}
		}

		// Move that element to the top.
		// If deck is null, then it means deck doesn't exist, which we won't update the recent.json
		if (deck !== null) {
			const info = this.info.splice(index, 1)[0];
			info.lastOpened = new Date();
			this.info.unshift(info);
		}

		const json = JSON.stringify(this.info, undefined, 4);
		const path = await RecentDeckInfo.filePath();
		await fs.writeFile({ path, contents: json });

		console.log(`updated recent.json for deck name "${deckName}"`);

		return deck;
	};

	public createDeck(title: string) {
		const newDeck = new Deck(title);
		newDeck.save();
		this.openDeck(title, true);
	}

	public get info() {
		return this._info;
	}
}

export const recentDeck = await RecentDeckInfo.getInfo();
