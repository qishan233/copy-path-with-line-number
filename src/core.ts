import { Uri, window, workspace } from 'vscode';

import path from 'path';


enum CopyCommand {
    CopyRelativePath,
    CopyAbsolutePath,
    CopyRelativePathWithLine,
    CopyAbsolutePathWithLine,
}

class Range {
    start: number;
    end: number;
    constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
    }
}

function GetContent(command: CopyCommand, uri: Uri): string {
    var editor = window.activeTextEditor;

    var absolutePath: string;
    var lineNumber: number;
    var selectedLines: string;
    var selectionRanges: Range[] = new Array<Range>();
    var isSingleLine = true;

    var lineInfo: string | number;

    if (!editor) {
        // 如果没有打开的编辑器，那么返回 uri 的对应路径
        absolutePath = uri.fsPath;
        lineNumber = 1;
    } else {
        absolutePath = editor.document.fileName;
        isSingleLine = editor.selections.length === 1 && editor.selections[0].isSingleLine;
        lineNumber = editor.selection.active.line + 1;
        editor.selections.forEach(selection => {
            selectionRanges.push(new Range(selection.start.line + 1, selection.end.line + 1));
        });
    }


    // use uri.fsPath in title context 
    if (absolutePath !== uri.fsPath) {
        absolutePath = uri.fsPath;
        lineNumber = 1;
    }

    var relativePath = workspace.asRelativePath(absolutePath);

    // there is no item selected, so set currentLine to zero
    var workspaceDir = workspace.getWorkspaceFolder(uri);
    if (workspaceDir && workspaceDir.uri.fsPath === uri.fsPath) {
        lineNumber = 0;
    }




    if (isSingleLine) {
        lineInfo = lineNumber;
    } else {
        var separator = '';
        var connector = '';

        var config = workspace.getConfiguration('copyPathWithLineNumber');

        var separatorConfig = config.get("selection.separator");
        switch (separatorConfig) {
            case "comma":
                separator = ',';
                break;
            case "semicolon":
                separator = ';';
                break;
            case "space":
                separator = ' ';
                break;
            default:
                separator = ',';
        }

        var rangeConfig = config.get("range.connector");
        switch (rangeConfig) {
            case "tilde":
                connector = '~';
                break;
            case "dash":
                connector = '-';
                break;
            default:
                connector = '~';
        }


        console.log('path separator:', path.sep);

        console.log('separator:', separator);

        selectedLines = selectionRanges.map(range => {
            if (range.start === range.end) {
                return range.start;
            }

            return `${range.start}${connector}${range.end}`;
        }).join(separator + ' ');
        lineInfo = selectedLines;
    }


    switch (command) {
        case CopyCommand.CopyRelativePath:
            return relativePath;
        case CopyCommand.CopyAbsolutePath:
            return absolutePath;
        case CopyCommand.CopyRelativePathWithLine:
            return `${relativePath}:${lineInfo}`;
        case CopyCommand.CopyAbsolutePathWithLine:
            return `${absolutePath}:${lineInfo}`;
        default:
            return "not supported command";
    }
}

export {
    GetContent,
    CopyCommand
};