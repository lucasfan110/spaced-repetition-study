import { Route, Routes } from "react-router-dom";
import "./App.scss";
import DeckNotFound from "./DeckNotFound";
import LoadDeck from "./DeckPage/LoadDeck";
import HomePage from "./HomePage";

export default function App(): JSX.Element {
    return (
        <Routes>
            <Route index key="home-page" element={<HomePage />} />
            <Route key="decks" path="decks">
                <Route path=":deckName/*" key="deckRoutes" element={<LoadDeck />} />
            </Route>
            <Route key="deck-not-found" path="deck-not-found" element={<DeckNotFound />} />
        </Routes>
    );
}
