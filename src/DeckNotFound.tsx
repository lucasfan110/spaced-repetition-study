import { Link } from "react-router-dom";

export default function DeckNotFound(): JSX.Element {
	return (
		<section className="container">
			<h1 className="text-center">
				Oops, the deck you are looking at doesn't exist!
			</h1>
			<div className="row justify-content-center">
				<Link to="/" className="btn btn-primary col-4">
					Go to home
				</Link>
			</div>
		</section>
	);
}
