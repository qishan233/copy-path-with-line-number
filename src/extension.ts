import * as vscode from 'vscode';
import { DoCopy } from './command';
import { CopyCommand } from './core';

export function activate(context: vscode.ExtensionContext) {
	const relativePath = vscode.commands.registerCommand('qishan233.copy.relative.path', (uri) => {
		DoCopy(CopyCommand.CopyRelativePath, uri);
	});

	const relativePathWithLine = vscode.commands.registerCommand('qishan233.copy.relative.path.line', (uri) => {
		DoCopy(CopyCommand.CopyRelativePathWithLine, uri);
	});

	const absolutePath = vscode.commands.registerCommand('qishan233.copy.absolute.path', (uri) => {
		DoCopy(CopyCommand.CopyAbsolutePath, uri);
	});

	const absolutePathWithLine = vscode.commands.registerCommand('qishan233.copy.absolute.path.line', (uri) => {
		DoCopy(CopyCommand.CopyAbsolutePathWithLine, uri);
	});


	context.subscriptions.push(relativePath, relativePathWithLine, absolutePath, absolutePathWithLine);
}

export function deactivate() { }
