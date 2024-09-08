import { Uri, window, workspace, env } from 'vscode';
import { UriResolverFactory, LineInfoMakerFactory, IUriResolver, ILineInfoMaker } from './resolver_decorator';

function DoCopy(command: CopyCommandType, uri: Uri) {

    try {
        var content = GetCopyContent(command, uri);
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

class ConcreteCopyCommand implements Command {
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

    Execute(uri: Uri): string {
        var res = this.uriResolver.GetPath(uri);

        if (this.lineInfoMaker !== null) {
            res += ":" + this.lineInfoMaker.GetLineInfo();
        }

        return res;
    }
}

const CommandContainer = new Map<CopyCommandType, Command>([
    [CopyCommandType.CopyRelativePath, new ConcreteCopyCommand(false, false)],
    [CopyCommandType.CopyAbsolutePath, new ConcreteCopyCommand(true, false)],
    [CopyCommandType.CopyAbsolutePathWithLine, new ConcreteCopyCommand(true, true)],
    [CopyCommandType.CopyRelativePathWithLine, new ConcreteCopyCommand(false, true)],
]);


function GetCopyContent(commandType: CopyCommandType, uri: Uri): string {
    var command = CommandContainer.get(commandType);
    if (command === undefined) {
        return "not supported command";
    }

    return command.Execute(uri);
}

interface Command {
    Execute(uri: Uri): string;
}


export {
    CopyCommandType
};