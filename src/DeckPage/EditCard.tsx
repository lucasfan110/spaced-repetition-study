import React from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";

type Props = {
    show?: boolean;
    defaultQuestion?: string;
    defaultAnswer?: string;
    onSubmit?: (newQuestion: string, newAnswer: string) => void;
    onClose?: () => void;
};

export default function EditCard({
    show = true,
    defaultQuestion = "",
    defaultAnswer = "",
    onSubmit = () => {},
    onClose = () => {},
}: Props): JSX.Element {
    const form = React.useRef<HTMLFormElement>(null);

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Card</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Container fluid>
                    <Form ref={form}>
                        <Form.Group>
                            <Form.Label htmlFor="new-question">Type in the new question</Form.Label>
                            <Form.Control
                                as="textarea"
                                id="new-question"
                                name="newQuestion"
                                defaultValue={defaultQuestion}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label htmlFor="new-answer">Type in the new answer</Form.Label>
                            <Form.Control
                                as="textarea"
                                id="new-answer"
                                name="newAnswer"
                                defaultValue={defaultAnswer}
                            />
                        </Form.Group>
                    </Form>
                </Container>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="primary"
                    type="submit"
                    onClick={() => {
                        if (!form.current) return;

                        const formData = new FormData(form.current);
                        const newQuestion = formData.get("newQuestion")?.toString() ?? "";
                        const newAnswer = formData.get("newAnswer")?.toString() ?? "";

                        onSubmit(newQuestion, newAnswer);
                        onClose();
                    }}
                >
                    Edit
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
