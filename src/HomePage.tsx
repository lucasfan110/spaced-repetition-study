import React from "react";
import { Button, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AddDeck from "./AddDeck";
import { recentDeck } from "./Deck";
import "./HomePage.scss";

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

	const [addDeck, setAddDeck] = React.useState(false);

	return (
		<main className="container">
			<h1 className="text-center">Welcome to Spaced Repetition Learning App!</h1>

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
							<Link to="decks/test-404" key="test-404" className="">
								Test 404
							</Link>
						</td>
					</tr>
				</tbody>
			</table>

			<Row className="justify-content-center">
				<Button variant="primary" className="mt-3 col-4" onClick={() => setAddDeck(true)}>
					Add Deck
				</Button>
			</Row>

			<AddDeck
				show={addDeck}
				onSubmit={e => {
					setAddDeck(false);

					if (e.canceled) {
						return;
					}

					const title = e.deckTitle;
					recentDeck.createDeck(title);
				}}
			/>
		</main>
	);
}
