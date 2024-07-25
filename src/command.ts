import { GetContent, CopyCommand } from './core';

import { env, window, Uri, workspace } from 'vscode';


function DoCopy(command: CopyCommand, uri: Uri) {
    var content = GetContent(command, uri);

    CopyAndShowMessage(content);
}


const CopyAndShowMessage = (content: string) => {
    env.clipboard.writeText(content);
    window.showInformationMessage('Copied!');
};

export {
    DoCopy
};