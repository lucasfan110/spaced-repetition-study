import { Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
import DeckNotFound from "./DeckNotFound";
import HomePage from "./HomePage";
import LoadDeck from "./DeckPage/LoadDeck";

export default function App(): JSX.Element {
	return (
		<Routes>
			<Route index key="home-page" element={<HomePage />} />
			<Route key="decks" path="decks">
				{/* {deckRoutes} */}
				<Route
					path=":deckName/*"
					key="deckRoutes"
					element={<LoadDeck />}
				/>
				<Route
					key="404"
					path="*"
					element={<Navigate to="/deck-not-found" replace />}
				/>
			</Route>
			<Route
				key="deck-not-found"
				path="deck-not-found"
				element={<DeckNotFound />}
			/>
		</Routes>
	);
}
