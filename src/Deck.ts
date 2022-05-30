import { fs, path } from "@tauri-apps/api";

export type Flashcard = {
	front: string;
	back: string;
};

export default class Deck {
	private deckName: string;
	private flashcards: Flashcard[] = [];

	private static getSaveDir = async (deckName: string): Promise<string> => {
		return `${await path.appDir()}flashcards/${deckName}/`;
	};

	public static loadDeck = async (
		deckName: string
	): Promise<Flashcard[] | null> => {
		try {
			return JSON.parse(
				await fs.readTextFile(
					`${await Deck.getSaveDir(deckName)}cards.json`
				)
			);
		} catch (e) {
			return null;
		}
	};

	public static getAvaliableDeckNames = async (): Promise<string[]> => {
		const dirs = await fs.readDir(`${await path.appDir()}flashcards/`, {
			recursive: true,
		});

		return dirs
			.filter(dir => {
				const children = dir.children;

				if (children === undefined) {
					return false;
				}

				const containData = children.find(child => {
					return (
						child.name === "cards.json" &&
						child.children === undefined
					);
				});

				return dir.name && containData !== undefined;
			})
			.map(dir => dir.name!);
	};

	public constructor(deckName: string) {
		this.deckName = deckName;
	}

	private getSaveDir = async (): Promise<string> => {
		return Deck.getSaveDir(this.deckName);
	};

	public save = async () => {
		fs.createDir(await this.getSaveDir(), { recursive: true });
		fs.writeFile({
			path: `${await this.getSaveDir()}cards.json`,
			contents: JSON.stringify(this.flashcards),
		});
	};

	public addCard = (card: Flashcard) => {
		this.flashcards.push(card);
		this.save();
	};

	public changeDeckName = async (newName: string) => {
		fs.removeDir(await this.getSaveDir(), { recursive: true });
		this.deckName = newName;
		this.save();
	};
}

// type RecentDeck = {
// 	name: string;
// 	lastOpened: Date;
// };
// type RecentDeckInfo = RecentDeck[];

export type Info = {
	deckName: string;
	lastOpened: Date;
};

export class RecentDeckInfo {
	private m_info: Info[];

	private constructor(info: Info[]) {
		this.m_info = info;
	}

	public static getInfo = async (): Promise<RecentDeckInfo> => {
		const recentPath = `${await path.appDir()}flashcards/recents.json`;

		let recentJson: string;
		try {
			recentJson = await fs.readTextFile(recentPath);
		} catch (e) {
			fs.writeFile({ path: recentPath, contents: "[]" });
			return new RecentDeckInfo([]);
		}

		let infos: Info[];
		try {
			infos = JSON.parse(recentJson) as Info[];
		} catch (e) {
			console.error("Failed to parse recents.json! Error: " + e);
			return new RecentDeckInfo([]);
		}

		return new RecentDeckInfo(infos);
	};

	public deckOpened = (deckName: string) => {
		const index = this.m_info.findIndex(info => info.deckName === deckName);
	};

	get info() {
		return this.m_info;
	}
}

export const recentDeck = await RecentDeckInfo.getInfo();
