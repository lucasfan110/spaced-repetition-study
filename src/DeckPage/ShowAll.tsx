import { faPenSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Row from "react-bootstrap/Row";
import Deck from "../Deck";
import "./ShowAll.scss";

type Props = {
    deck: Deck;
};

export default function ShowAll({ deck }: Props): JSX.Element {
    const displayCards = () => {
        if (deck.flashcards.length === 0) {
            return <p className="text-center lead">There is no card in the deck!</p>;
        }

        const deckList = deck.flashcards.map(card => {
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
                            <button className="icon-button">
                                <FontAwesomeIcon icon={faPenSquare} size="2x" />
                            </button>
                            <button className="icon-button">
                                <FontAwesomeIcon icon={faXmark} size="2x" />
                            </button>
                        </div>
                    </td>
                </tr>
            );
        });

        return (
            <table className="card-terms">
                <colgroup>
                    {/* Will be styled in css */}
                    <col />
                    <col />
                    <col />
                </colgroup>
                <thead>
                    <tr className="card-term">
                        <th>Questions</th>
                        <th colSpan={2}>Answers</th>
                    </tr>
                </thead>
                <tbody>{deckList}</tbody>
            </table>
        );
    };

    return <Row className="justify-content-center mt-5">{displayCards()}</Row>;
}
