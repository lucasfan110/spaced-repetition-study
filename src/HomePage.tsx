import "./HomePage.scss";
import { recentDeck } from "./Deck";
import { Link, useNavigate } from "react-router-dom";

export default function HomePage(): JSX.Element {
	const navigate = useNavigate();

	const recentList = recentDeck.info.map(({ deckName, lastOpened }) => (
		<tr
			key={deckName}
			className="list-row"
			onClick={() => {
				navigate(`/decks/${encodeURI(deckName)}`);
			}}
		>
			<td>{deckName}</td>
			<td>{lastOpened?.toLocaleDateString() ?? "Unknown"}</td>
		</tr>
	));

	return (
		<main className="container">
			<h1 className="text-center">
				Welcome to Spaced Repetition Learning App!
			</h1>

			<h2 className="text-center mt-5">Open recent</h2>

			<table className="recent-list container">
				<thead>
					<tr>
						<th>Name</th>
						<th>Last Opened</th>
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
