import { Tag } from "./tag";

export type TagEditorProps_ = {
    tooltip: string,
    setTooltip: (s: string) => void;
    addTag: (tag: Tag) => (tags: Tag[]) => Tag[],
    rmTag: (tags: Tag[]) => Tag[],
    rmDot: () => void,
}

export type TagEditorProps = TagEditorProps_ & {
    closeEditor: (f: (tags: Tag[]) => Tag[]) => void,
};

export default function TagEditor(props: TagEditorProps) {
    const selectSuggestion = (tag: Tag) => () =>
        props.closeEditor(props.addTag(tag));

    const getSuggestions = () => [1, 2, 3, 4]
        .map(id => {
            const name = `Tag ${id}`;
            const tag: Tag = { id, name };

            return <p className="suggestion"
                onClick={selectSuggestion(tag)}
                key={id}>{name}</p>
        });

    const suggestions = getSuggestions();

    return (
        <div>
            <input className="tag-edit"
                value={props.tooltip}
                onChange={e => props.setTooltip(e.target.value)}></input>
            <div className="suggestions-container">
                {...suggestions}
            </div>
            <button className="tag-rm" onClick={() => {
                props.rmDot();
                props.closeEditor(props.rmTag);
            }}>
                Remove tag
            </button>
        </div>
    );
}
