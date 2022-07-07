import React from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import isValidFilename from "valid-filename";

export type SubmitEvent = {
    canceled: boolean;
    deckTitle: string;
};

export type DefaultProps = {
    show?: boolean;
    onSubmit?: (event: SubmitEvent) => void;
    defaultTitle?: string;
};

type Props = DefaultProps & {
    titleText: string;
    confirmText: string;
};

export default function TitleEdit({
    titleText,
    confirmText,
    show = false,
    onSubmit = () => {},
    defaultTitle = "",
}: Props): JSX.Element {
    const titleRef = React.useRef<HTMLInputElement>(null);

    const [invalidInputText, setInvalidInputText] = React.useState<string | null>(null);

    const close = (event?: SubmitEvent) => {
        setInvalidInputText(null);
        onSubmit(event ?? { canceled: true, deckTitle: "" });
    };

    return (
        <Modal
            show={show}
            onHide={() => {
                close();
            }}
        >
            <Modal.Header closeButton>
                <Modal.Title>{titleText}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container fluid>
                    <Form>
                        <Form.Label htmlFor="title">Put in the deck title below</Form.Label>
                        <Alert variant="danger" show={invalidInputText !== null}>
                            {invalidInputText}
                        </Alert>
                        <Form.Control
                            type="text"
                            ref={titleRef}
                            name="title"
                            id="title"
                            defaultValue={defaultTitle}
                        />
                    </Form>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="primary"
                    onClick={() => {
                        const titleInput = titleRef.current;

                        if (titleInput === null || !titleInput.value) {
                            setInvalidInputText("Title cannot be empty!");
                            return;
                        }

                        if (!isValidFilename(titleInput.value)) {
                            setInvalidInputText(
                                "Invalid name! Some characters other than letters and numbers are not supported."
                            );
                            return;
                        }

                        close({
                            canceled: false,
                            deckTitle: titleRef.current?.value.trim() ?? "",
                        });
                    }}
                >
                    {confirmText}
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
