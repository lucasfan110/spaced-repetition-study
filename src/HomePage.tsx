import { faPenSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Row } from "react-bootstrap";
import Confirm from "./Confirm";
import { recentDeck } from "./Deck";
import "./HomePage.scss";
import AddDeck from "./TitleEdit/AddDeck";
import EditDeck from "./TitleEdit/EditDeck";

type Props = {};

type State = {
    addDeck: boolean;
    editDeck: [boolean, number];
    deleting: [boolean, number];
};

export default class HomePage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            addDeck: false,
            deleting: [false, -1],
            editDeck: [false, -1],
        };
    }

    private mapRecentList() {
        if (recentDeck.info.length === 0) {
            return (
                <p>
                    There is no deck in here yet! Click the add deck button to add decks and start
                    your study journey!
                </p>
            );
        }

        const list = recentDeck.info.map(({ deckName, lastOpened }, index) => (
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
                            className="icon-button"
                            onClick={e => {
                                e.stopPropagation();
                                this.setState({ editDeck: [true, index] });
                            }}
                        >
                            <FontAwesomeIcon icon={faPenSquare} size="2x" />
                        </button>
                        <button
                            className="icon-button"
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

        return (
            <table className="recent-list container">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th colSpan={2}>Last Opened</th>
                    </tr>
                </thead>
                <tbody>{list}</tbody>
            </table>
        );
    }

    render(): React.ReactNode {
        const recentList = this.mapRecentList();

        return (
            <main className="container">
                <h1 className="text-center">Welcome to Spaced Repetition Learning App!</h1>
                <h2 className="text-center mt-5">Open recent</h2>
                {recentList}
                <Row className="justify-content-center">
                    <Button
                        variant="primary"
                        className="mt-3 col-4"
                        onClick={() => this.setState({ addDeck: true })}
                    >
                        Add Deck
                    </Button>
                </Row>

                {/* These are pop up windows */}
                {/* Add Deck Dialog */}
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

                {/* Edit Deck Dialog */}
                <EditDeck
                    show={this.state.editDeck[0]}
                    onSubmit={async e => {
                        const index = this.state.editDeck[1];
                        this.setState({ editDeck: [false, -1] });

                        if (e.canceled) {
                            return;
                        }

                        const newTitle = e.deckTitle;
                        await recentDeck.editDeck(index, newTitle);
                        this.forceUpdate();
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
