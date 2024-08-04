import { Uri, window, workspace } from "vscode";
import { DefaultConnector, DefaultSeparator } from "./const";
import path from "path";

interface IUriResolver {
    GetPath(uri: Uri): string;
}

class RelativeUriResolver implements IUriResolver {
    GetPath(uri: Uri): string {
        return workspace.asRelativePath(uri.fsPath).replace(/\//g, path.sep);;
    }
}

class AbsoluteUriResolver implements IUriResolver {
    GetPath(uri: Uri): string {
        return uri.fsPath;
    }
}

class UriResolverFactory {
    static CreateUriResolver(isAbsolute: boolean): IUriResolver {
        return isAbsolute ? new AbsoluteUriResolver() : new RelativeUriResolver();
    }
}

class Range {
    start: number;
    end: number;
    constructor(start: number, end: number) {
        this.start = start;
        this.end = end;
    }
}



interface ILineInfoMaker {
    GetLineInfo(): string;
}

class LineInfoMakerFactory {
    static CreateLineInfoMaker(): ILineInfoMaker {
        return new LineInfoMaker();
    }
}

class LineInfoMaker implements ILineInfoMaker {
    GetLineInfo(): string {
        var editor = window.activeTextEditor;
        if (!editor) {
            return "1";
        }

        var isSingleLine = editor.selections.length === 1 && editor.selections[0].isSingleLine;
        var lineNumber = editor.selection.active.line + 1;

        if (isSingleLine) {
            return lineNumber.toString();
        }

        var selectedLines: string;
        var selectionRanges: Range[] = new Array<Range>();

        editor.selections.forEach(selection => {
            selectionRanges.push(new Range(selection.start.line + 1, selection.end.line + 1));
        });

        selectedLines = selectionRanges.map(range => {
            if (range.start === range.end) {
                return range.start;
            }
            return `${range.start}${DefaultConnector}${range.end}`;
        }).join(DefaultSeparator + ' ');

        return selectedLines;
    }
}


export {
    UriResolverFactory,
    IUriResolver,

    LineInfoMakerFactory,
    ILineInfoMaker
};