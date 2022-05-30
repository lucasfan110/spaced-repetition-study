import { Link } from "react-router-dom";
export default function DeckNotFound(): JSX.Element {
	return (
		<section className="not-found">
			<h1>Oops, the deck you are looking at doesn't exist!</h1>
			<Link to="/" className="link">
				Go to home
			</Link>
		</section>
	);
}
