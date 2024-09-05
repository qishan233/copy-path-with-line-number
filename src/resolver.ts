import { Uri, window, workspace } from "vscode";
import {
    ISymbolStrategy,
    GetSymbolStrategy,
} from './symbol_strategy';
import path from "path";

interface IUriResolver {
    GetPath(uri: Uri): string;
}

class UriResolver implements IUriResolver {
    GetPath(uri: Uri): string {
        if (uri === undefined) {
            if (window.activeTextEditor) {
                uri = window.activeTextEditor.document.uri;
            } else {
                throw new Error("Cannot copy path without an active editor or uri");
            }
        }

        return uri.fsPath;
    }
}


class RelativeUriResolver extends UriResolver implements IUriResolver {
    pathSeparatorStrategy: ISymbolStrategy;
    constructor() {
        super();
        this.pathSeparatorStrategy = GetSymbolStrategy().GetPathSeparatorStrategy();
    }
    GetPath(uri: Uri): string {
        var p = super.GetPath(uri);

        return workspace.asRelativePath(p).replace(/\//g, this.pathSeparatorStrategy.GetSymbol());
    }
}

class AbsoluteUriResolver extends UriResolver implements IUriResolver {
    pathSeparatorStrategy: ISymbolStrategy;
    constructor() {
        super();
        this.pathSeparatorStrategy = GetSymbolStrategy().GetPathSeparatorStrategy();
    }
    GetPath(uri: Uri): string {
        var content = super.GetPath(uri);

        var targetSep = this.pathSeparatorStrategy.GetSymbol();

        content = content.replace(new RegExp(path.sep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), targetSep);

        return content;
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
    rangeConnectorStrategy: ISymbolStrategy;
    rangeSeparatorStrategy: ISymbolStrategy;

    constructor() {
        this.rangeConnectorStrategy = GetSymbolStrategy().GetRangeConnectorStrategy();
        this.rangeSeparatorStrategy = GetSymbolStrategy().GetRangeSeparatorStrategy();

    }

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

        var rangeConnector = this.rangeConnectorStrategy.GetSymbol();
        var rangeSeparator = this.rangeSeparatorStrategy.GetSymbol();

        if (rangeSeparator !== ' ') {
            rangeSeparator += ' ';
        }

        selectedLines = selectionRanges.map(range => {
            if (range.start === range.end) {
                return range.start;
            }
            return `${range.start}${rangeConnector}${range.end}`;
        }).join(rangeSeparator);

        return selectedLines;
    }
}


export {
    UriResolverFactory,
    LineInfoMakerFactory,

    IUriResolver,
    ILineInfoMaker
};