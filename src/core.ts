import { Uri, window, workspace } from 'vscode';


enum CopyCommand {
    CopyRelativePath,
    CopyAbsolutePath,
    CopyRelativePathWithLine,
    CopyAbsolutePathWithLine,
}

function GetContent(command: CopyCommand, uri: Uri): string {
    var editor = window.activeTextEditor;

    if (!editor) {
        // 如果没有打开的编辑器，那么返回 uri 的对应路径
        switch (command) {
            case CopyCommand.CopyRelativePath:
                return workspace.asRelativePath(uri);
            case CopyCommand.CopyAbsolutePath:
                return uri.fsPath;
            default:
                return "not supported command when no active editor";
        }
    }

    var absolutePath = editor.document.fileName;
    if (absolutePath !== uri.fsPath) {
        absolutePath = uri.fsPath;
    }

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