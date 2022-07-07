import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import * as uuid from "uuid";
import { Flashcard } from "../Deck";
import "./AddCard.scss";

type Props = {
    onSubmit?: (card: Flashcard) => void;
};

export default function AddCard({ onSubmit }: Props): JSX.Element {
    const [show, setShow] = React.useState(false);
    const toBeAdded = React.useRef<Flashcard>();

    const onHide = () => {
        if (onSubmit !== undefined) {
            // Should never be undefined since when dialog triggered the form data has already been saved.
            onSubmit(toBeAdded.current!);
            setShow(false);
        }
    };

    return (
        <section className="m-5">
            <h2 className="text-center mt-5">Add a new card!</h2>
            <Form
                onSubmit={e => {
                    e.preventDefault();

                    // Magic conversion to get the data from the form element
                    const target = e.target as typeof e.target & {
                        question: { value: string };
                        answer: { value: string };
                    };

                    toBeAdded.current = {
                        id: uuid.v4(),
                        question: target.question.value.trim(),
                        answer: target.answer.value.trim(),
                        lastTimeCorrect: new Date(),
                        correctCount: 1,
                    };
                    setShow(true);
                }}
            >
                <Form.Group>
                    <Form.Label htmlFor="question">Type in the question</Form.Label>
                    <Form.Control
                        as="textarea"
                        id="question"
                        name="question"
                        className="card-input"
                        required
                    ></Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="answer">Type in the answer of the flash card</Form.Label>
                    <Form.Control
                        id="answer"
                        name="answer"
                        as="textarea"
                        className="card-input"
                        required
                    ></Form.Control>
                </Form.Group>
                <section className="row mt-5 justify-content-center">
                    <Button type="submit" className="col-4">
                        Add
                    </Button>
                </section>
            </Form>

            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Added Successful!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Successfully added this flashcard to the deck! It will show up for you to review
                    in 24 hours
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={onHide}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
        </section>
    );
}
