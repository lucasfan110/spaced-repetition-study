import "./Card.scss";
import React from "react";
import { Button, Card, Row } from "react-bootstrap";

const ANIM_TIME = 500;

type Props = {
	question: string;
	answer: string;
	onNext: (gotCorrect: boolean) => void;
};

type State = {
	currentSide: "front" | "back";
};

export default class CardDisplay extends React.Component<Props, State> {
	flashcardRef: React.RefObject<HTMLDivElement>;
	cardTextRef: React.RefObject<HTMLDivElement>;
	checkCorrectBox: React.RefObject<HTMLDivElement>;

	ongoingAnim: boolean;
	answerChecked: boolean;

	constructor(props: Props) {
		super(props);

		this.flashcardRef = React.createRef();
		this.cardTextRef = React.createRef();
		this.checkCorrectBox = React.createRef();

		this.ongoingAnim = false;
		this.answerChecked = false;

		this.state = {
			currentSide: "front",
		};
	}

	componentDidMount = () => {
		if (this.checkCorrectBox.current === null) {
			return;
		}

		this.checkCorrectBox.current.style.display = "none";
	};

	cardFlipped = () => {
		this.setState(prev => {
			const nextSide = prev.currentSide === "front" ? "back" : "front";
			return {
				currentSide: nextSide,
			};
		});
	};

	flipAnim = () => {
		if (this.ongoingAnim) {
			return;
		}

		let start: number | null = null;
		let currentDeg = 0;
		let doneHalf = false;

		const animation = (timestamp: number) => {
			if (this.flashcardRef.current === null) {
				return;
			}
			if (this.cardTextRef.current === null) {
				return;
			}

			this.ongoingAnim = true;

			if (start === null) {
				start = timestamp;
			}

			const elapsed = timestamp - start;
			const percent = elapsed / ANIM_TIME;

			const transform = `rotateY(${Math.round(currentDeg)}deg)`;
			this.flashcardRef.current.style.transform = transform;

			if (percent < 0.5) {
				currentDeg = percent * 180;
			} else {
				if (!doneHalf) {
					console.log("setting done half");

					doneHalf = true;
					this.cardFlipped();
				}

				currentDeg = 180 - percent * 180;
			}

			if (elapsed <= ANIM_TIME) {
				requestAnimationFrame(animation);
			} else {
				this.ongoingAnim = false;
			}
		};

		requestAnimationFrame(animation);
	};

	/**
	 * A confusing name, but basically depend on the side the function will either return
	 * the `frontText` and the `backText`
	 * @param frontText The text to show when card is at front side
	 * @param backText The text to show when card is at back side
	 * @returns The text based on the side
	 */
	sideText = (frontText: string, backText: string): string => {
		return this.state.currentSide === "front" ? frontText : backText;
	};

	override render = (): React.ReactNode => {
		if (this.checkCorrectBox.current !== null) {
			if (this.answerChecked) {
				this.checkCorrectBox.current.style.display = "flex";
			}
		}

		return (
			<div className="container">
				<Card
					className="flashcard m-5 noselect"
					ref={this.flashcardRef}
				>
					<Card.Body>
						<div ref={this.cardTextRef} className="text-center">
							{this.sideText(
								this.props.question,
								this.props.answer
							)}
						</div>

						<Row className="align-items-center justify-content-center mt-5">
							<Button
								variant="primary"
								className="col-4 mt-5"
								onClick={() => {
									this.answerChecked = true;
									this.flipAnim();
								}}
							>
								{this.sideText(
									"Check Answer",
									"Back To Question"
								)}
							</Button>
						</Row>

						<Row
							className="align-items-center justify-content-center mt-3"
							ref={this.checkCorrectBox}
						>
							<Button
								variant="success"
								className="col-4 me-2"
								onClick={() => this.props.onNext(true)}
							>
								I got it right
							</Button>
							<Button
								variant="danger"
								className="col-4"
								onClick={() => this.props.onNext(false)}
							>
								I got it wrong
							</Button>
						</Row>
					</Card.Body>
				</Card>
			</div>
		);
	};
}
