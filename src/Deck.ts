import { fs, path } from "@tauri-apps/api";
import * as FsUtil from "./FsUtil";
import * as uuid from "uuid";

export const DAYS_TO_MS = 86_400_000;

export type Flashcard = {
    id: string;
    question: string;
    answer: string;
    lastTimeCorrect: Date | null;
    correctCount: number;
};

export type DeckJson = {
    id: string;
    flashcards: Flashcard[];
};

export class CannotReadFileError extends Error {
    public constructor(path: string) {
        super(`Failed to read data at ${path}`);

        Object.setPrototypeOf(this, CannotReadFileError.prototype);
    }
}

export class InvalidFormatError extends Error {
    public constructor() {
        super("Format is not valid");

        Object.setPrototypeOf(this, InvalidFormatError.prototype);
    }
}

export default class Deck {
    private _id: string;
    private _deckName: string;
    private _flashcards: Flashcard[] = [];

    public constructor(deckName: string) {
        this._id = uuid.v4();
        this._deckName = deckName;
    }

    public static async getSaveDir(deckName: string): Promise<string> {
        return `${await path.appDir()}flashcards/${deckName}/`;
    }

    public static fromJson(name: string, json: DeckJson): Deck {
        const deck = new Deck(name);
        deck.flashcards = json.flashcards;
        return deck;
    }

    public clone(): Deck {
        return Deck.fromJson(this._deckName, this.toJson());
    }

    public toJson(): DeckJson {
        return {
            id: this._id,
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
        return await Deck.getSaveDir(this.deckName);
    }

    public async delete() {
        await fs.removeDir(await this.getSaveDir(), { recursive: true });
    }

    public async save() {
        await fs.createDir(await this.getSaveDir(), { recursive: true });
        await fs.writeFile({
            path: `${await this.getSaveDir()}cards.json`,
            contents: JSON.stringify(this.toJson(), undefined, 4),
        });
    }

    public async addCard(card: Flashcard) {
        this.flashcards.push(card);
        await this.save();
    }

    public async changeDeckName(newName: string) {
        fs.removeDir(await this.getSaveDir(), { recursive: true });
        this._deckName = newName;
        await this.save();
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

    public get id() {
        return this._id;
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

    return Deck.fromJson(deckName, deckJson);
}

export type Info = {
    id: string;
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

    public async saveInfo() {
        const json = JSON.stringify(this.info, undefined, 4);
        const path = await RecentDeckInfo.filePath();
        fs.writeFile({ path, contents: json });
    }

    public openDeck = async (deckName: string, isNewDeck: boolean): Promise<Deck | null> => {
        const index = this.info.findIndex(info => info.deckName === deckName);

        let deck: Deck | null = null;

        if (index === -1) {
            if (isNewDeck) {
                deck = new Deck(deckName);
                this.info.push({ id: deck.id, deckName, lastOpened: new Date() });
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

        this.saveInfo();
        console.log(`updated recent.json for deck name "${deckName}"`);

        return deck;
    };

    public createDeck(title: string) {
        const newDeck = new Deck(title);
        newDeck.save();
        this.openDeck(title, true);
    }

    public async deleteDeck(index: number) {
        const info = this.info[index];

        if (info === undefined) {
            return;
        }

        const exist = await FsUtil.isDir(await Deck.getSaveDir(info.deckName));

        try {
            await fs.removeDir(await Deck.getSaveDir(info.deckName), { recursive: true });
        } catch (e) {
            if (exist) {
                alert(`Failed to remove deck. Error: (${e})`);
                return;
            }
        }

        this.info.splice(index, 1);
        this.saveInfo();
    }

    public async editDeck(index: number, newName: string) {
        const info = this.info[index];

        if (info === undefined) {
            return;
        }

        const exist = await FsUtil.isDir(await Deck.getSaveDir(info.deckName));
        let variable = 20;

        try {
            await FsUtil.renameDir(
                await Deck.getSaveDir(info.deckName),
                await Deck.getSaveDir(newName)
            );
        } catch (e) {
            alert(`Failed to rename deck. Error: (${e})`);

            if (exist) {
                return;
            } else {
                const isDeleting = confirm(
                    "It seems like the deck you are trying to modify does not exist. Do you want to delete it instead?"
                );

                if (isDeleting) {
                    await this.deleteDeck(index);
                    return;
                }
            }
        }

        info.deckName = newName;
        this.saveInfo();
    }

    public get info() {
        return this._info;
    }
}

export const recentDeck = await RecentDeckInfo.getInfo();
