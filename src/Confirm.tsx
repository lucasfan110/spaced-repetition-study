import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

type Props = {
    onCanceled?: () => void;
    onConfirm?: () => void;
    onClose?: (confirmed: boolean) => void;
    show: boolean;
};
export default function Confirm({
    onCanceled = () => {},
    onConfirm = () => {},
    onClose = () => {},
    show,
}: Props): JSX.Element {
    return (
        <Modal
            onHide={() => {
                onCanceled();
                onClose(false);
            }}
            show={show}
        >
            <Modal.Header>
                <Modal.Title>Are You Sure?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>Are you sure you want to delete this deck? It cannot be undone</p>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => {
                        onConfirm();
                        onClose(true);
                    }}
                >
                    Yes
                </Button>

                <Button
                    variant="primary"
                    onClick={() => {
                        onCanceled();
                        onClose(false);
                    }}
                >
                    No
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
