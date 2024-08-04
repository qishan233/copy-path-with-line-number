import { Uri, window, workspace } from 'vscode';
import { UriResolverFactory, LineInfoMakerFactory, IUriResolver, ILineInfoMaker } from './base';
import { Decorator, ConfigurablePathDecorator, ConfigurableLineNumberDecorator } from './decorator';


enum CopyCommand {
    CopyRelativePath,
    CopyAbsolutePath,
    CopyRelativePathWithLine,
    CopyAbsolutePathWithLine,
}

interface IContentMaker {
    GetContent(uri: Uri): string;
}

class ContentMaker implements IContentMaker {
    uriResolver: IUriResolver;
    lineInfoMaker: ILineInfoMaker | null;
    decorators: Decorator[] = [];
    constructor(absolutePath: boolean, needLineInfo: boolean) {
        this.uriResolver = UriResolverFactory.CreateUriResolver(absolutePath);

        if (needLineInfo) {
            this.lineInfoMaker = LineInfoMakerFactory.CreateLineInfoMaker();
        } else {
            this.lineInfoMaker = null;
        }

        this.decorators.push(new ConfigurablePathDecorator(), new ConfigurableLineNumberDecorator());

    }
    GetContent(uri: Uri): string {
        var res = this.uriResolver.GetPath(uri);

        if (this.lineInfoMaker !== null) {
            res += ":" + this.lineInfoMaker.GetLineInfo();
        }

        for (let decorator of this.decorators) {
            res = decorator.Decorate(res);
        }

        return res;
    }
}

const Command2ContentMaker = new Map<CopyCommand, IContentMaker>([
    [CopyCommand.CopyRelativePath, new ContentMaker(false, false)],
    [CopyCommand.CopyAbsolutePath, new ContentMaker(true, false)],
    [CopyCommand.CopyAbsolutePathWithLine, new ContentMaker(true, true)],
    [CopyCommand.CopyRelativePathWithLine, new ContentMaker(false, true)],
]);


function GetContent(command: CopyCommand, uri: Uri): string {
    var contentMaker = Command2ContentMaker.get(command);
    if (contentMaker === undefined) {
        return "not supported command";
    }

    return contentMaker.GetContent(uri);
}

export {
    GetContent,
    CopyCommand
};