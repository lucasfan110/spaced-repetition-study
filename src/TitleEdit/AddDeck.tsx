import * as edit from "./index";

export default function AddDeck(props: edit.DefaultProps) {
    return <edit.default titleText="Add Deck" confirmText="Add" {...props}></edit.default>;
}
