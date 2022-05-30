import { Link } from "react-router-dom";

type Props = {
	deckName: string;
};
export default function DeckPage({ deckName }: Props): JSX.Element {
	return (
		<main>
			<p>Add a new card!</p>
			<form
				onSubmit={e => {
					e.preventDefault();
				}}
				method="post"
			>
				<label htmlFor="front">
					Type in the front of the flash card
				</label>
				<div>
					<textarea id="front" name="front" required></textarea>
				</div>

				<label htmlFor="back">Type in the back of the flash card</label>
				<div>
					<textarea id="back" name="back" required></textarea>
				</div>

				<button type="submit">Add</button>
			</form>

			<Link to="/" className="link-button">
				Go to home page
			</Link>
		</main>
	);
}
