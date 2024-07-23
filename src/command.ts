import { GetContent, CopyCommand } from './core';

import { env, window } from 'vscode';


function DoCopy(command: CopyCommand) {
    var content = GetContent(command);

    CopyAndShowMessage(content);
}


const CopyAndShowMessage = (content: string) => {
    env.clipboard.writeText(content);
    window.showInformationMessage('Copied!');
};

export {
    DoCopy
};