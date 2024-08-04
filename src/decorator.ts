import path from "path";
import { workspace } from "vscode";

import { DefaultConnector, DefaultSeparator } from "./const";

interface Decorator {
    Decorate(input: string): string;
}

class ConfigurablePathDecorator implements Decorator {
    Decorate(input: string): string {
        if (!input) {
            return input;
        }

        var config = workspace.getConfiguration('copyPathWithLineNumber');
        var pathSeparator = config.get("path.separator");

        var targetSep = '';
        switch (pathSeparator) {
            case "slash":
                targetSep = '/';
                break;
            case "backslash":
                targetSep = '\\';
                break;
            default:
        }

        if (targetSep !== '') {
            input = input.replace(new RegExp(path.sep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), targetSep);
        }

        return input;
    }
}

class ConfigurableLineNumberDecorator implements Decorator {
    Decorate(input: string): string {
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

        if (separator !== DefaultSeparator) {
            input = input.replace(new RegExp(DefaultSeparator, 'g'), separator);
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

        if (connector !== DefaultConnector) {
            input = input.replace(new RegExp(DefaultConnector, 'g'), connector);
        }

        return input;
    }
}

export {
    Decorator,
    ConfigurableLineNumberDecorator,
    ConfigurablePathDecorator
};