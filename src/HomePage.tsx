import { faPenSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import AddDeck from "./AddDeck";
import Confirm from "./Confirm";
import { recentDeck } from "./Deck";
import "./HomePage.scss";

type Props = {};

type State = {
    addDeck: boolean;
    deleting: [boolean, number];
};

export default class HomePage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            addDeck: false,
            deleting: [false, -1],
        };
    }

    private mapRecentList() {
        return recentDeck.info.map(({ deckName, lastOpened }, index) => (
            <tr
                key={deckName}
                className="list-row"
                onClick={() => {
                    window.location.href = `/decks/${encodeURI(deckName)}`;
                }}
            >
                <td>{deckName}</td>
                <td>{lastOpened?.toLocaleDateString() ?? "Unknown"}</td>
                <td>
                    <div className="row-control">
                        <button
                            className="edit-button"
                            onClick={e => {
                                e.stopPropagation();
                            }}
                        >
                            <FontAwesomeIcon icon={faPenSquare} size="2x" />
                        </button>
                        <button
                            className="delete-button"
                            onClick={e => {
                                e.stopPropagation();
                                this.setState({ deleting: [true, index] });
                            }}
                        >
                            <FontAwesomeIcon icon={faXmark} size="2x" />
                        </button>
                    </div>
                </td>
            </tr>
        ));
    }

    render(): React.ReactNode {
        const recentList = this.mapRecentList();

        return (
            <main className="container">
                <h1 className="text-center">Welcome to Spaced Repetition Learning App!</h1>
                <h2 className="text-center mt-5">Open recent</h2>
                <table className="recent-list container">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th colSpan={2}>Last Opened</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentList}
                        <tr key="test-404">
                            <td>
                                <Link to="decks/test-404" key="test-404" className="">
                                    Test 404
                                </Link>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Row className="justify-content-center">
                    <Button
                        variant="primary"
                        className="mt-3 col-4"
                        onClick={() => this.setState({ addDeck: true })}
                    >
                        Add Deck
                    </Button>
                </Row>
                <AddDeck
                    show={this.state.addDeck}
                    onSubmit={e => {
                        this.setState({ addDeck: false });
                        if (e.canceled) {
                            return;
                        }
                        const title = e.deckTitle;
                        recentDeck.createDeck(title);
                    }}
                />

                {/* Confirm Dialog, which is hidden and only activated when `this.state.deleting[0]` is true */}
                <Confirm
                    show={this.state.deleting[0]}
                    onClose={() => this.setState({ deleting: [false, -1] })}
                    onConfirm={async () => {
                        await recentDeck.deleteDeck(this.state.deleting[1]);
                        this.forceUpdate();
                    }}
                />
            </main>
        );
    }
}
