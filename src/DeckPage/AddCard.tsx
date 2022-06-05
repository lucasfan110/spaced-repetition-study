import { Flashcard } from "../Deck";

type Props = {
	onSubmit?: (card: Flashcard) => void;
};
export default function AddCard({ onSubmit }: Props): JSX.Element {
	return (
		<section>
			<h2 className="text-center mt-5">Add a new card!</h2>
			<form
				onSubmit={e => {
					e.preventDefault();

					// Magic conversion to get the data from the form element
					const target = e.target as typeof e.target & {
						question: { value: string };
						answer: { value: string };
					};

					if (onSubmit !== undefined) {
						onSubmit({
							question: target.question.value,
							answer: target.answer.value,
							lastTimeCorrect: null,
						});
					}
				}}
			>
				<div className="form-group">
					<label htmlFor="question">Type in the question</label>
					<textarea
						id="question"
						name="question"
						className="form-control card-input"
						required
					></textarea>
				</div>
				<div className="form-group">
					<label htmlFor="answer">
						Type in the answer of the flash card
					</label>
					<textarea
						id="answer"
						name="answer"
						className="form-control card-input"
						required
					></textarea>
				</div>
				<section className="row mt-5 justify-content-center">
					<button type="submit" className="btn btn-primary col-4">
						Add
					</button>
				</section>
			</form>
		</section>
	);
}
