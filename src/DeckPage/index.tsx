import React from "react";
import Row from "react-bootstrap/Row";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Deck from "../Deck";
import AddCard from "./AddCard";
import "./index.scss";
import ShowAll from "./ShowAll";
import StudyDeck from "./StudyDeck";

type Tabs = "none" | "show-cards" | "add-card";
type Action = { type: "trigger"; to: Tabs };

function setTab(state: Tabs, action: Action): Tabs {
    switch (action.type) {
        case "trigger":
            return state === action.to ? "none" : action.to;
    }

    return state;
}

type Props = {
    deck: Deck;
    deleteCard: (index: number) => void;
};
export default function DeckPage({ deck, deleteCard }: Props): JSX.Element {
    const navigate = useNavigate();

    const [tab, dispatchTab] = React.useReducer(setTab, "none");

    return (
        <main className="container mt-5">
            <StudyDeck deck={deck} />

            <Row className="justify-content-center">
                <Link
                    to={`${tab === "add-card" ? "" : "add-card"}`}
                    className="btn btn-primary col-4 me-1"
                    onClick={() => {
                        dispatchTab({ type: "trigger", to: "add-card" });
                    }}
                >
                    Add Card
                </Link>
                <Link
                    to={`${tab === "show-cards" ? "" : "show-cards"}`}
                    className={`btn btn-info col-4 me-1`}
                    onClick={() => {
                        dispatchTab({ type: "trigger", to: "show-cards" });
                    }}
                >
                    {`${tab === "show-cards" ? "Hide" : "Show"}`} All Cards
                </Link>
            </Row>

            <Link to="/" className="btn btn-secondary col-2 back-btn">
                Go back
            </Link>

            <Routes>
                <Route
                    path="add-card"
                    element={
                        <AddCard
                            onSubmit={data => {
                                deck.addCard(data);
                                navigate("");
                            }}
                        />
                    }
                />
                <Route
                    path="show-cards"
                    element={<ShowAll deck={deck} deleteCard={deleteCard} />}
                />
            </Routes>
        </main>
    );
}
