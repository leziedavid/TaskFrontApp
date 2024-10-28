declare module 'react-quill' {
    import { Component } from 'react';

    export interface ReactQuillProps {
        value?: string;
        onChange?: (value: string) => void;
    }

    export default class ReactQuill extends Component<ReactQuillProps> {
        focus() {
            throw new Error('Method not implemented.');
        }
}
}
