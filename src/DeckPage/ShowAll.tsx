import { faPenSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Row from "react-bootstrap/Row";
import Confirm from "../Confirm";
import Deck from "../Deck";
import "./ShowAll.scss";

type Props = {
    deck: Deck;
    deleteCard: (index: number) => void;
};

export default function ShowAll({ deck, deleteCard }: Props): JSX.Element {
    const [deleteInfo, setDeleteInfo] = React.useState<{ deleting: boolean; index: number | null }>(
        {
            deleting: false,
            index: null,
        }
    );

    const editCard = (index: number) => {};

    const displayCards = () => {
        if (deck.flashcards.length === 0) {
            return <p className="text-center lead">There is no card in the deck!</p>;
        }

        const deckList = deck.flashcards.map((card, index) => {
            const quesRef = React.useRef<HTMLDivElement>(null);
            const ansRef = React.useRef<HTMLDivElement>(null);

            return (
                <tr className="card-term">
                    <td>
                        <div className="card-question" ref={quesRef}>
                            {card.question}
                        </div>
                    </td>
                    <td>
                        <div className="card-answer" ref={ansRef}>
                            {card.answer}
                        </div>
                    </td>
                    <td>
                        <div className="buttons">
                            <button className="icon-button" onClick={() => editCard(index)}>
                                <FontAwesomeIcon icon={faPenSquare} size="2x" />
                            </button>
                            <button
                                className="icon-button"
                                onClick={() => setDeleteInfo({ deleting: true, index })}
                            >
                                <FontAwesomeIcon icon={faXmark} size="2x" />
                            </button>
                        </div>
                    </td>
                </tr>
            );
        });

        return (
            <>
                <table className="card-terms">
                    <colgroup>
                        {/* Will be styled in css */}
                        <col />
                        <col />
                        <col />
                    </colgroup>
                    <thead>
                        <tr className="card-term">
                            <th className="text-center">Questions</th>
                            <th className="text-center" colSpan={2}>
                                Answers
                            </th>
                        </tr>
                    </thead>
                    <tbody>{deckList}</tbody>
                </table>

                <Confirm
                    show={deleteInfo.deleting}
                    onConfirm={() => {
                        if (deleteInfo.index !== null) deleteCard(deleteInfo.index);
                    }}
                    onCanceled={() => setDeleteInfo({ deleting: false, index: null })}
                />
            </>
        );
    };

    return <Row className="justify-content-center mt-5">{displayCards()}</Row>;
}
