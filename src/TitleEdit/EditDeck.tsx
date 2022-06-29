import * as edit from "./index";

export default function EditDeck(props: edit.DefaultProps) {
    return <edit.default titleText="Edit Deck" confirmText="Edit" {...props}></edit.default>;
}
