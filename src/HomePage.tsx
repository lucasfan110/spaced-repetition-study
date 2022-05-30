import "./HomePage.scss";
import { recentDeck } from "./Deck";
import { Link } from "react-router-dom";

export default function HomePage(): JSX.Element {
	const recentList = recentDeck.info.map(({ deckName }) => (
		<tr key={deckName} className="list-row">
			<td>{deckName}</td>
		</tr>
	));

	return (
		<main className="home-page">
			<h1>Welcome to Spaced Repetition Learning App!</h1>

			<p className="center">Open recent</p>

			<table className="recent-list">
				<thead>
					<tr>
						<th>Name</th>
					</tr>
				</thead>
				<tbody>
					{recentList}
					<tr key="test-404">
						<td>
							<Link
								to="decks/test-404"
								key="test-404"
								className=""
							>
								Test 404
							</Link>
						</td>
					</tr>
				</tbody>
			</table>
		</main>
	);
}
