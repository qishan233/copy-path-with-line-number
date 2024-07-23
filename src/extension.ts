import * as vscode from 'vscode';
import { DoCopy } from './command';
import { CopyCommand } from './core';

// "qishan233.copy.relative.path",
// "qishan233.copy.absolute.path",
// "qishan233.copy.relative.path.line",
// "qishan233.copy.absolute.path.line",

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "copy-path-with-line-number" is now active!');

	const relativePath = vscode.commands.registerCommand('qishan233.copy.relative.path', () => {
		DoCopy(CopyCommand.CopyRelativePath);
	});

	const relativePathWithLine = vscode.commands.registerCommand('qishan233.copy.relative.path.line', () => {
		DoCopy(CopyCommand.CopyRelativePathWithLine);
	});
	
	const absolutePath = vscode.commands.registerCommand('qishan233.copy.absolute.path', () => {
		DoCopy(CopyCommand.CopyAbsolutePath);
	});

	const absolutePathWithLine = vscode.commands.registerCommand('qishan233.copy.absolute.path.line', () => {
		DoCopy(CopyCommand.CopyAbsolutePathWithLine);
	});


	context.subscriptions.push(relativePath, relativePathWithLine, absolutePath, absolutePathWithLine);
}

export function deactivate() { }
