import { Uri, window, workspace, env } from 'vscode';
import { UriResolverFactory, LineInfoMakerFactory, IUriResolver, ILineInfoMaker } from './resolver_decorator';

async function DoCopy(command: CopyCommandType, uri: Uri) {

    try {
        var content = await GetCopyContent(command, uri);
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
    needLineInfo: boolean;

    constructor(absolutePath: boolean, needLineInfo: boolean) {
        this.uriResolver = UriResolverFactory.CreateUriResolver(absolutePath);
        this.needLineInfo = needLineInfo;

        if (needLineInfo) {
            this.lineInfoMaker = LineInfoMakerFactory.CreateLineInfoMaker();
        } else {
            this.lineInfoMaker = null;
        }
    }

    async Execute(uri: Uri): Promise<string> {
        if (this.needLineInfo && this.lineInfoMaker !== null) {
            let res = this.getPath(uri);
            res += ":" + this.lineInfoMaker.GetLineInfo();
            return res;
        }

        return this.getPaths(uri);
    }

    getPath(uri: Uri): string {
        return this.uriResolver.GetPath(uri);
    }

    async getPaths(uri: Uri): Promise<string> {
        var res = await this.uriResolver.GetPaths(uri);

        return res.join('\n');
    }
}

const CommandContainer = new Map<CopyCommandType, Command>([
    [CopyCommandType.CopyRelativePath, new ConcreteCopyCommand(false, false)],
    [CopyCommandType.CopyAbsolutePath, new ConcreteCopyCommand(true, false)],
    [CopyCommandType.CopyAbsolutePathWithLine, new ConcreteCopyCommand(true, true)],
    [CopyCommandType.CopyRelativePathWithLine, new ConcreteCopyCommand(false, true)],
]);


async function GetCopyContent(commandType: CopyCommandType, uri: Uri): Promise<string> {
    var command = CommandContainer.get(commandType);
    if (command === undefined) {
        return "not supported command";
    }

    var res = await command.Execute(uri);
    return res;
}

interface Command {
    Execute(uri: Uri): Promise<string>;
}


export {
    CopyCommandType
};