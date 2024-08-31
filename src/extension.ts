import * as vscode from 'vscode';
import { DoCopy, CopyCommandType } from './facade';

export function activate(context: vscode.ExtensionContext) {
	const relativePath = vscode.commands.registerCommand('qishan233.copy.relative.path', (uri) => {
		DoCopy(CopyCommandType.CopyRelativePath, uri);
	});

	const relativePathWithLine = vscode.commands.registerCommand('qishan233.copy.relative.path.line', (uri) => {
		DoCopy(CopyCommandType.CopyRelativePathWithLine, uri);
	});

	const absolutePath = vscode.commands.registerCommand('qishan233.copy.absolute.path', (uri) => {
		DoCopy(CopyCommandType.CopyAbsolutePath, uri);
	});

	const absolutePathWithLine = vscode.commands.registerCommand('qishan233.copy.absolute.path.line', (uri) => {
		DoCopy(CopyCommandType.CopyAbsolutePathWithLine, uri);
	});


	context.subscriptions.push(relativePath, relativePathWithLine, absolutePath, absolutePathWithLine);
}

export function deactivate() { }
