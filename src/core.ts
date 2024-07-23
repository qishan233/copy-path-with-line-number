import { TextEditor, window, env, workspace } from 'vscode';


enum CopyCommand {
    CopyRelativePath,
    CopyAbsolutePath,
    CopyRelativePathWithLine,
    CopyAbsolutePathWithLine,
}

function GetContent(command: CopyCommand): string {
    var editor = window.activeTextEditor;

    if (!editor) {
        return "no active editor";
    }

    var absolutePath = editor.document.fileName;
    var relativePath = workspace.asRelativePath(absolutePath);
    var currentLine = editor.selection.active.line + 1;

    console.log(absolutePath, "    ", relativePath, "    ", currentLine);

    switch (command) {
        case CopyCommand.CopyRelativePath:
            return relativePath;
        case CopyCommand.CopyAbsolutePath:
            return editor.document.fileName;
        case CopyCommand.CopyRelativePathWithLine:
            return `${relativePath}:${currentLine}`;
        case CopyCommand.CopyAbsolutePathWithLine:
            return `${absolutePath}:${currentLine}`;
        default:
            return "not supported command";
    }
}

export {
    GetContent,
    CopyCommand
};