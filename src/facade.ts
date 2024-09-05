import { Uri, window, workspace, env } from 'vscode';
import { UriResolverFactory, LineInfoMakerFactory, IUriResolver, ILineInfoMaker } from './resolver';

function DoCopy(command: CopyCommandType, uri: Uri) {

    try {
        var content = GetContent(command, uri);
    } catch (error: any) {
        window.showErrorMessage(error.message);
        return;
    }


    Copy(content);

    TryShowMessage(content);
}

function TryShowMessage(content: string) {
    var config = workspace.getConfiguration('copyPathWithLineNumber');

    if (config.get('show.message') === true) {
        window.showInformationMessage('Copied to clipboard: ' + content);
    }
}


const Copy = (content: string) => {
    env.clipboard.writeText(content);
};

export {
    DoCopy
};

enum CopyCommandType {
    CopyRelativePath,
    CopyAbsolutePath,
    CopyRelativePathWithLine,
    CopyAbsolutePathWithLine,
}

class ConcreteContentResolver implements ContentResolver {
    uriResolver: IUriResolver;
    lineInfoMaker: ILineInfoMaker | null;

    constructor(absolutePath: boolean, needLineInfo: boolean) {
        this.uriResolver = UriResolverFactory.CreateUriResolver(absolutePath);

        if (needLineInfo) {
            this.lineInfoMaker = LineInfoMakerFactory.CreateLineInfoMaker();
        } else {
            this.lineInfoMaker = null;
        }
    }

    Resolve(uri: Uri): string {
        var res = this.uriResolver.GetPath(uri);

        if (this.lineInfoMaker !== null) {
            res += ":" + this.lineInfoMaker.GetLineInfo();
        }

        return res;
    }
}

const CommandContainer = new Map<CopyCommandType, ContentResolver>([
    [CopyCommandType.CopyRelativePath, new ConcreteContentResolver(false, false)],
    [CopyCommandType.CopyAbsolutePath, new ConcreteContentResolver(true, false)],
    [CopyCommandType.CopyAbsolutePathWithLine, new ConcreteContentResolver(true, true)],
    [CopyCommandType.CopyRelativePathWithLine, new ConcreteContentResolver(false, true)],
]);


function GetContent(commandType: CopyCommandType, uri: Uri): string {
    var command = CommandContainer.get(commandType);
    if (command === undefined) {
        return "not supported command";
    }

    return command.Resolve(uri);
}

interface ContentResolver {
    Resolve(uri: Uri): string;
}


export {
    GetContent,
    CopyCommandType
};