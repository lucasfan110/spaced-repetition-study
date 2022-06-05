import "./Card.scss";
import React from "react";

const ANIM_TIME = 500;

type Props = {
	front: string;
	back: string;
};
export default function Card({ front, back }: Props): JSX.Element {
	const flashcardRef = React.useRef<HTMLDivElement>(null);
	const cardTextRef = React.useRef<HTMLDivElement>(null);

	const ongoingAnim = React.useRef(false);

	const currentSide = React.useRef("front");
	const [currentText, setCurrentText] = React.useState(front);

	const triggerFlip = () => {
		if (ongoingAnim.current) {
			return;
		}

		let start: number | null = null;
		let currentDeg = 0;
		let doneHalf = false;

		const animation = (timestamp: number) => {
			if (flashcardRef.current === null) {
				return;
			}
			if (cardTextRef.current === null) {
				return;
			}

			ongoingAnim.current = true;

			if (start === null) {
				start = timestamp;
			}

			const elapsed = timestamp - start;
			const percent = elapsed / ANIM_TIME;

			const transform = `rotateY(${Math.round(currentDeg)}deg)`;
			flashcardRef.current.style.transform = transform;

			if (percent < 0.5) {
				currentDeg = percent * 180;
			} else {
				if (!doneHalf) {
					console.log("setting done half");

					doneHalf = true;

					if (currentSide.current === "front") {
						setCurrentText(back);
						currentSide.current = "back";
					} else {
						setCurrentText(front);
						currentSide.current = "front";
					}
				}

				currentDeg = 180 - percent * 180;
			}

			if (elapsed <= ANIM_TIME) {
				requestAnimationFrame(animation);
			} else {
				ongoingAnim.current = false;
			}
		};

		requestAnimationFrame(animation);
	};

	return (
		<div className="container">
			<div className="flashcard card m-5 noselect" ref={flashcardRef}>
				<div className="card-body text-center row align-items-center justify-content-center">
					<div ref={cardTextRef}>{currentText}</div>

					<button
						className="btn btn-primary col-4"
						onClick={triggerFlip}
					>
						{currentSide.current === "front"
							? "Check Answer"
							: "Back To Question"}
					</button>
				</div>
			</div>
		</div>
	);
}
