import path from "path";
import { workspace } from "vscode";
import { DefaultRangeConnector, DefaultRangeSeparator, DefaultPathSeparator } from "./const";


export {
    ISymbolStrategy,
    ISymbolStrategyFactory,
    GetSymbolStrategyFactory,
};

interface ISymbolStrategy {
    GetSymbol(): string;
}

class ConfigurablePathSeparatorSymbolStrategy implements ISymbolStrategy {
    GetSymbol(): string {
        var targetSep = DefaultPathSeparator;

        var config = workspace.getConfiguration('copyPathWithLineNumber');

        var pathSeparator = config.get("path.separator");

        switch (pathSeparator) {
            case "slash":
                targetSep = '/';
                break;
            case "backslash":
                targetSep = '\\';
                break;
            case "system":
                targetSep = path.sep;
                break;
        }

        return targetSep;
    }
}

class ConfigurableRangeSeparatorSymbolStrategy implements ISymbolStrategy {
    GetSymbol(): string {
        var separator = DefaultRangeSeparator;

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
        }

        return separator;
    }
}

class ConfigurableRangeConnectorSymbol implements ISymbolStrategy {
    GetSymbol(): string {
        var connector = DefaultRangeConnector;

        var config = workspace.getConfiguration('copyPathWithLineNumber');

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

        return connector;

    }
}

class DefaultPathSeparatorSymbolStrategy implements ISymbolStrategy {
    GetSymbol(): string {
        return DefaultPathSeparator;
    }
}

class DefaultRangeConnectorSymbolStrategy implements ISymbolStrategy {
    GetSymbol(): string {
        return DefaultRangeConnector;
    }
}

class DefaultRangeSeparatorSymbolStrategy implements ISymbolStrategy {
    GetSymbol(): string {
        return DefaultRangeSeparator;
    }
}



interface ISymbolStrategyFactory {
    GetPathSeparatorStrategy(): ISymbolStrategy;
    GetRangeSeparatorStrategy(): ISymbolStrategy;
    GetRangeConnectorStrategy(): ISymbolStrategy;
}

class DefaultSymbolStrategyFactory implements ISymbolStrategyFactory {
    GetPathSeparatorStrategy(): ISymbolStrategy {
        return new DefaultPathSeparatorSymbolStrategy();
    }
    GetRangeSeparatorStrategy(): ISymbolStrategy {
        return new DefaultRangeSeparatorSymbolStrategy();
    }
    GetRangeConnectorStrategy(): ISymbolStrategy {
        return new DefaultRangeConnectorSymbolStrategy();
    }
}


class ConfigurableSymbolStrategyFactory implements ISymbolStrategyFactory {
    GetPathSeparatorStrategy(): ISymbolStrategy {
        return new ConfigurablePathSeparatorSymbolStrategy();
    }
    GetRangeSeparatorStrategy(): ISymbolStrategy {
        return new ConfigurableRangeSeparatorSymbolStrategy();
    }
    GetRangeConnectorStrategy(): ISymbolStrategy {
        return new ConfigurableRangeConnectorSymbol();
    }
}

// configurable factory
const cf = new ConfigurableSymbolStrategyFactory();

// default factory
const df = new DefaultSymbolStrategyFactory();

function GetSymbolStrategyFactory(): ISymbolStrategyFactory {
    return cf;
}
