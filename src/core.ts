import { Uri, window, workspace } from 'vscode';


enum CopyCommand {
    CopyRelativePath,
    CopyAbsolutePath,
    CopyRelativePathWithLine,
    CopyAbsolutePathWithLine,
}

function GetContent(command: CopyCommand, uri: Uri): string {
    var editor = window.activeTextEditor;

    var absolutePath: string;
    var currentLine: number;


    if (!editor) {
        // 如果没有打开的编辑器，那么返回 uri 的对应路径
        absolutePath = uri.fsPath;
        currentLine = 1;
    } else {
        absolutePath = editor.document.fileName;
        currentLine = editor.selection.active.line + 1;
    }

    if (absolutePath !== uri.fsPath) {
        absolutePath = uri.fsPath;
        currentLine = 1;
    }

    var relativePath = workspace.asRelativePath(absolutePath);

    var workspaceDir = workspace.getWorkspaceFolder(uri);
    if (workspaceDir && workspaceDir.uri.fsPath === uri.fsPath) {
        currentLine = 0;
    }


    switch (command) {
        case CopyCommand.CopyRelativePath:
            return relativePath;
        case CopyCommand.CopyAbsolutePath:
            return absolutePath;
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