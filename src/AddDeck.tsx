import React from "react";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";

type SubmitEvent = {
	canceled: boolean;
	deckTitle: string;
};

type Props = {
	show?: boolean;
	onSubmit?: (event: SubmitEvent) => void;
};

export default function AddDeck({
	show = false,
	onSubmit = () => {},
}: Props): JSX.Element {
	const titleRef = React.useRef<HTMLInputElement>(null);

	const [invalidInput, setInvalidInput] = React.useState(false);

	const close = (event?: SubmitEvent) => {
		setInvalidInput(false);
		onSubmit(event ?? { canceled: true, deckTitle: "" });
	};

	return (
		<Modal
			show={show}
			backdrop="static"
			keyboard={false}
			onHide={() => {
				close();
			}}
		>
			<Modal.Header closeButton>
				<Modal.Title>Add Deck</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Container fluid>
					<Form>
						<Form.Label htmlFor="title">
							Put in the deck title below
						</Form.Label>
						<Alert variant="danger" show={invalidInput}>
							Title cannot be empty!
						</Alert>
						<Form.Control
							type="text"
							ref={titleRef}
							name="title"
							id="title"
						/>
					</Form>
				</Container>
			</Modal.Body>
			<Modal.Footer>
				<Button
					variant="primary"
					onClick={() => {
						if (
							titleRef.current === null ||
							!titleRef.current.value
						) {
							setInvalidInput(true);
							return;
						}

						close({
							canceled: false,
							deckTitle: titleRef.current?.value ?? "",
						});
					}}
				>
					Add
				</Button>
				<Button
					variant="secondary"
					onClick={() => {
						close();
					}}
				>
					Cancel
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
