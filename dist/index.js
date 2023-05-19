require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 283:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.run = void 0;
const core_1 = __importDefault(__nccwpck_require__(186));
const sdk_1 = __nccwpck_require__(701);
const utils_1 = __nccwpck_require__(729);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = (0, sdk_1.createClient)({
                accessKey: core_1.default.getInput("access-key"),
                secretKey: core_1.default.getInput("secret-key"),
                defaultProjectId: core_1.default.getInput("default-project-id"),
                defaultRegion: core_1.default.getInput("default-region"),
                defaultZone: core_1.default.getInput("default-zone"),
            });
            const api = new sdk_1.Secret.v1alpha1.API(client);
            const secretConfigInputs = [
                ...new Set(core_1.default.getMultilineInput("secret-names")),
            ];
            for (let secretConf of secretConfigInputs) {
                const [envName, secretName] = (0, utils_1.extractAlias)(secretConf);
                try {
                    const secretValue = yield (0, utils_1.getSecretValue)(api, secretName);
                    core_1.default.setSecret(secretValue);
                    core_1.default.debug(`Injecting secret ${secretName} as environment variable '${envName}'.`);
                    core_1.default.exportVariable(envName, secretValue);
                }
                catch (error) {
                    core_1.default.setFailed(`Failed to fetch secret: '${secretName}'. Error: ${error}.`);
                }
            }
        }
        catch (error) {
            if (error instanceof Error)
                core_1.default.setFailed(error.message);
        }
    });
}
exports.run = run;
run();


/***/ }),

/***/ 729:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getSecretValue = exports.extractAlias = exports.transformToValidEnvName = void 0;
function transformToValidEnvName(secretName) {
    // Leading digits are invalid
    if (secretName.match(/^[0-9]/)) {
        secretName = "_".concat(secretName);
    }
    // Remove invalid characters
    return secretName.replace(/[^a-zA-Z0-9_]/g, "_").toUpperCase();
}
exports.transformToValidEnvName = transformToValidEnvName;
function extractAlias(input) {
    const parsedInput = input.split(",");
    if (parsedInput.length > 1) {
        const alias = parsedInput[0].trim();
        const secretName = parsedInput[1].trim();
        const validateEnvName = transformToValidEnvName(alias);
        if (alias !== validateEnvName) {
            throw new Error(`The alias '${alias}' is not a valid environment name. Please verify that it has uppercase letters, numbers, and underscore only.`);
        }
        return [alias, secretName];
    }
    return [transformToValidEnvName(input.trim()), input.trim()];
}
exports.extractAlias = extractAlias;
function getSecretValue(api, secretName) {
    return __awaiter(this, void 0, void 0, function* () {
        const secretResponse = yield api.accessSecretVersionByName({
            secretName: secretName,
            revision: "latest",
        });
        return secretResponse.data;
    });
}
exports.getSecretValue = getSecretValue;


/***/ }),

/***/ 351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(37));
const utils_1 = __nccwpck_require__(278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(278);
const os = __importStar(__nccwpck_require__(37));
const path = __importStar(__nccwpck_require__(17));
const oidc_utils_1 = __nccwpck_require__(41);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(147));
const os = __importStar(__nccwpck_require__(37));
const uuid_1 = __nccwpck_require__(840);
const utils_1 = __nccwpck_require__(278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 41:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(255);
const auth_1 = __nccwpck_require__(526);
const core_1 = __nccwpck_require__(186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(17));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(37);
const fs_1 = __nccwpck_require__(147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(685));
const https = __importStar(__nccwpck_require__(687));
const pm = __importStar(__nccwpck_require__(835));
const tunnel = __importStar(__nccwpck_require__(294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const reqHost = reqUrl.hostname;
    if (isLoopbackAddress(reqHost)) {
        return true;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperNoProxyItem === '*' ||
            upperReqHosts.some(x => x === upperNoProxyItem ||
                x.endsWith(`.${upperNoProxyItem}`) ||
                (upperNoProxyItem.startsWith('.') &&
                    x.endsWith(`${upperNoProxyItem}`)))) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
function isLoopbackAddress(host) {
    const hostLower = host.toLowerCase();
    return (hostLower === 'localhost' ||
        hostLower.startsWith('127.') ||
        hostLower.startsWith('[::1]') ||
        hostLower.startsWith('[0:0:0:0:0:0:0:1]'));
}
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(219);


/***/ }),

/***/ 219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(808);
var tls = __nccwpck_require__(404);
var http = __nccwpck_require__(685);
var https = __nccwpck_require__(687);
var events = __nccwpck_require__(361);
var assert = __nccwpck_require__(491);
var util = __nccwpck_require__(837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(628));

var _v2 = _interopRequireDefault(__nccwpck_require__(409));

var _v3 = _interopRequireDefault(__nccwpck_require__(122));

var _v4 = _interopRequireDefault(__nccwpck_require__(120));

var _nil = _interopRequireDefault(__nccwpck_require__(332));

var _version = _interopRequireDefault(__nccwpck_require__(595));

var _validate = _interopRequireDefault(__nccwpck_require__(900));

var _stringify = _interopRequireDefault(__nccwpck_require__(950));

var _parse = _interopRequireDefault(__nccwpck_require__(746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(998));

var _md = _interopRequireDefault(__nccwpck_require__(569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(950));

var _parse = _interopRequireDefault(__nccwpck_require__(746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(998));

var _sha = _interopRequireDefault(__nccwpck_require__(274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 37:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 701:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
let LevelResolver = /*#__PURE__*/function (LevelResolver) {
  LevelResolver[LevelResolver["silent"] = 0] = "silent";
  LevelResolver[LevelResolver["error"] = 1] = "error";
  LevelResolver[LevelResolver["warn"] = 2] = "warn";
  LevelResolver[LevelResolver["info"] = 3] = "info";
  LevelResolver[LevelResolver["debug"] = 4] = "debug";
  return LevelResolver;
}({});
const shouldLog = (currentLevel, level) => LevelResolver[level] <= currentLevel;

/**
 * A Logger using console output.
 *
 * @param logLevel - The logger level name
 * @param prefix - An optional logger message prefix
 * @param output - The output to print logs, using by default the global console object
 *
 * @internal
 */
class ConsoleLogger {
  constructor(logLevel, prefix = '', output = console) {
    this.logLevel = logLevel;
    this.prefix = prefix;
    this.output = output;
    this.level = LevelResolver[this.logLevel];
  }
  makeMethod(method) {
    return message => {
      if (shouldLog(this.level, method)) {
        this.output[method](this.prefix ? `${this.prefix} ${message}` : message);
      }
    };
  }
  debug = this.makeMethod('debug');
  error = this.makeMethod('error');
  info = this.makeMethod('info');
  warn = this.makeMethod('warn');
}

let sdkLogger = /*#__PURE__*/new ConsoleLogger('silent');

/**
 * Sets a logger to be used within the SDK.
 *
 * @param logger - The Logger instance
 *
 * @public
 */
const setLogger = logger => {
  sdkLogger = logger;
};

/**
 * Sets the logger to console logger with given logLevel (log is disabled by default).
 *
 * @param logLevel - The Log level (default to 'warn')
 * @param prefix - A Log message prefix (default to 'scaleway-sdk-js:')
 *
 * @public
 */
const enableConsoleLogger = (logLevel = 'warn', prefix = 'scaleway-sdk-js:') => setLogger(new ConsoleLogger(logLevel, prefix));

/**
 * Returns the active SDK logger.
 *
 * @internal
 */
const getLogger = () => sdkLogger;

/**
 * Adds an header to a request through an interceptor.
 *
 * @param key - The header key
 * @param value - The header value
 * @returns The Request interceptor
 *
 * @internal
 */
const addHeaderInterceptor = (key, value) => ({
  request
}) => {
  const clone = request.clone();
  if (value !== undefined) {
    clone.headers.append(key, value);
  }
  return clone;
};

/**
 * Adds asynchronously an header to a request through an interceptor.
 *
 * @param key - The header key
 * @param value - The header value as a Promise
 * @returns The Request interceptor
 *
 * @internal
 */
const addAsyncHeaderInterceptor = (key, getter) => async request => addHeaderInterceptor(key, await getter())(request);

const isAccessKeyRegex = /^SCW[A-Z0-9]{17}$/i;
const isRegionRegex = /^[a-z]{2}-[a-z]{3}$/i;
const isUUIDRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;
const isZoneRegex = /^[a-z]{2}-[a-z]{3}-[1-9]$/i;

/** Returns true if the given string has a valid UUID format. */
const isUUID = str => isUUIDRegex.test(str);

/** Returns true if the given string has a valid Scaleway access key format. */
const isAccessKey = str => isAccessKeyRegex.test(str);

/** Returns true if the given string has a valid Scaleway secret key format. */
const isSecretKey = str => isUUID(str);

/** Returns true if the given string has a valid Scaleway organization ID format. */
const isOrganizationId = str => isUUID(str);

/** Returns true if the given string has a valid Scaleway project ID format. */
const isProjectId = str => isUUID(str);

/** Returns true if the given string has a valid region format. */
const isRegion = str => isRegionRegex.test(str);

/** Returns true if the given string has a valid zone format. */
const isZone = str => isZoneRegex.test(str);

/** Returns true if the given string has a valid URL format and starts by `http(s):`. */
const isURL = str => {
  let url;
  try {
    url = new URL(str);
  } catch {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
};

/**
 * Holds access key and secret key.
 *
 * @public
 */

/**
 * Holds default values of a Scaleway profile.
 *
 * @public
 */

/**
 * Holds values of a Scaleway profile.
 *
 * @public
 */

/**
 * Verifies that the payload contains both the accessKey and the secretKey.
 *
 * @param obj - The secrets
 * @returns Whether the secrets are not empty.
 *
 * @internal
 */
const hasAuthenticationSecrets = obj => typeof obj.accessKey === 'string' && obj.accessKey !== '' && typeof obj.secretKey === 'string' && obj.secretKey !== '';

/**
 * Asserts the format of secrets.
 *
 * @param obj - The secrets
 * @returns Whether the secrets use a valid format
 *
 * @throws Error
 * Thrown if either the accessKey or the secretKey has en invalid format.
 *
 * @internal
 */
function assertValidAuthenticationSecrets(obj) {
  if (!(obj.accessKey && obj.secretKey)) {
    throw new Error(`Invalid secrets, accessKey & secretKey must be defined. See https://www.scaleway.com/en/docs/console/my-project/how-to/generate-api-key/`);
  }
  if (!isAccessKey(obj.accessKey)) {
    throw new Error(`Invalid access key format '${obj.accessKey}', expected SCWXXXXXXXXXXXXXXXXX format. See https://www.scaleway.com/en/docs/console/my-project/how-to/generate-api-key/`);
  }
  if (!isSecretKey(obj.secretKey)) {
    throw new Error(`Invalid secret key format '${obj.secretKey}', expected a UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx. See https://www.scaleway.com/en/docs/console/my-project/how-to/generate-api-key/`);
  }
}

const SESSION_HEADER_KEY = 'x-session-token';
const AUTH_HEADER_KEY = 'x-auth-token';
/**
 * Authenticates with a session token.
 *
 * @param getToken - The token accessor
 * @returns The request interceptor
 *
 * @deprecated Please use addAsyncHeaderInterceptor instead.
 *
 * @internal
 */
const authenticateWithSessionToken = getToken => addAsyncHeaderInterceptor(SESSION_HEADER_KEY, getToken);

/**
 * Authenticates with a secrets.
 *
 * @param getToken - The secrets
 * @returns The request interceptor
 *
 * @throws Error
 * Thrown if the secrets are invalid.
 *
 * @internal
 */
const authenticateWithSecrets = secrets => {
  assertValidAuthenticationSecrets(secrets);
  return addHeaderInterceptor(AUTH_HEADER_KEY, secrets.secretKey);
};

/**
 * Obfuscates a token.
 *
 * @param key - The token
 * @returns The obfuscated token
 *
 * @internal
 */
const obfuscateToken = key => `${key.substring(0, 5)}xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`;

/**
 * Obfuscates an UUID.
 *
 * @param key - The UUID
 * @returns The obfuscated UUID
 *
 * @internal
 */
const obfuscateUUID = key => `${key.substring(0, 8)}-xxxx-xxxx-xxxx-xxxxxxxxxxxx`;
/**
 * Obfuscates headers entry.
 *
 * @param array - The header entry
 * @returns The obfuscated entry
 *
 * @internal
 */
const obfuscateAuthHeadersEntry = ([name, value]) => {
  if (name === SESSION_HEADER_KEY) return [name, obfuscateToken(value)];
  if (name === AUTH_HEADER_KEY) return [name, obfuscateUUID(value)];
  return [name, value];
};

/**
 * A factory to build {@link Settings}.
 *
 * @public
 */

/**
 * Instantiates the SDK from a configuration {@link Profile}.
 *
 * @param profile - The profile
 * @returns A factory {@link ClientConfig}
 *
 * @remarks This method should be used in conjunction with the initializer `createAdvancedClient`.
 *
 * @public
 */
const withProfile = profile => settings => {
  const newSettings = {
    ...settings
  };
  if (profile.apiURL) {
    newSettings.apiURL = profile.apiURL;
  }
  if (profile.defaultOrganizationId) {
    newSettings.defaultOrganizationId = profile.defaultOrganizationId;
  }
  if (profile.defaultProjectId) {
    newSettings.defaultProjectId = profile.defaultProjectId;
  }
  if (profile.defaultRegion) {
    newSettings.defaultRegion = profile.defaultRegion;
  }
  if (profile.defaultZone) {
    newSettings.defaultZone = profile.defaultZone;
  }
  if (hasAuthenticationSecrets(profile)) {
    newSettings.interceptors = [{
      request: authenticateWithSecrets(profile)
    }, ...newSettings.interceptors];
  }
  return newSettings;
};

/**
 * Instantiates the SDK with a different HTTP client.
 *
 * @param httpClient - A fetch compatible HTTP client
 * @returns A factory {@link ClientConfig}
 *
 * @remarks This method should be used in conjunction with the initializer `createAdvancedClient`.
 *
 * @public
 */
const withHTTPClient = httpClient => settings => ({
  ...settings,
  httpClient
});

/**
 * Instantiates the SDK with a default page size.
 *
 * @param defaultPageSize - The default page size
 * @returns A factory {@link ClientConfig}
 *
 * @remarks This method should be used in conjunction with the initializer `createAdvancedClient`.
 *
 * @public
 */
const withDefaultPageSize = defaultPageSize => settings => ({
  ...settings,
  defaultPageSize
});

/**
 * Instantiates the SDK with a different default user agent.
 *
 * @param userAgent - The default user agent
 * @returns A factory {@link ClientConfig}
 *
 * @remarks This method should be used in conjunction with the initializer `createAdvancedClient`.
 *
 * @public
 */
const withUserAgent = userAgent => settings => ({
  ...settings,
  userAgent
});

/**
 * Instantiates the SDK with an additional user agent.
 *
 * @param userAgent - The suffix to append to default user agent
 * @returns A factory {@link ClientConfig}
 *
 * @remarks This method should be used in conjunction with the initializer `createAdvancedClient`.
 *
 * @public
 */
const withUserAgentSuffix = userAgent => settings => ({
  ...settings,
  userAgent: settings.userAgent ? `${settings.userAgent} ${userAgent}` : userAgent
});

/**
 * Instantiates the SDK with additional interceptors.
 *
 * @param interceptors - The additional {@link NetworkInterceptors} interceptors
 * @returns A factory {@link ClientConfig}
 *
 * @remarks
 * It doesn't override the existing interceptors, but instead push more to the list.
 * This method should be used in conjunction with the initializer `createAdvancedClient`.
 *
 * @example
 * ```
 * withAdditionalInterceptors([
 *   {
 *     request: ({ request }) => {
 *       console.log(`Do something with ${JSON.stringify(request)}`)
 *       return request
 *     },
 *     response: ({ response }) => {
 *       console.log(`Do something with ${JSON.stringify(response)}`)
 *       return response
 *     },
 *     responseError: async ({
 *       request,
 *       error,
 *     }: {
 *       request: Request
 *       error: unknown
 *     }) => {
 *       console.log(
 *         `Do something with ${JSON.stringify(request)} and ${JSON.stringify(
 *           error,
 *         )}`,
 *       )
 *       throw error // or return Promise.resolve(someData)
 *     },
 *   },
 * ])
 * ```
 *
 * @public
 */
const withAdditionalInterceptors = interceptors => settings => ({
  ...settings,
  interceptors: settings.interceptors.concat(interceptors)
});

/**
 * Instantiates the SDK with legacy interceptors.
 */
/* eslint-disable deprecation/deprecation */
const withLegacyInterceptors = () => settings => {
  if (!settings.requestInterceptors && !settings.responseInterceptors) {
    return settings;
  }
  const allInterceptors = settings.interceptors.concat((settings.requestInterceptors ?? []).map(obj => ({
    request: obj
  })), (settings.responseInterceptors ?? []).map(obj => ({
    response: obj
  })));
  return {
    ...settings,
    interceptors: allInterceptors
  };
};
/* eslint-enable deprecation/deprecation */

/**
 * Holds default values of settings.
 *
 * @public
 */

/**
 * Settings hold the values of all client options.
 *
 * @public
 */

/**
 * Validates the content of a {@link Settings} object.
 *
 * @throws Error
 * Thrown if {@link Settings} aren't valid.
 *
 * @internal
 */
const assertValidSettings = obj => {
  // Default Organization ID.
  if (obj.defaultOrganizationId !== undefined) {
    if (typeof obj.defaultOrganizationId !== 'string' || obj.defaultOrganizationId.length === 0) {
      throw new Error('Default organization ID cannot be empty');
    }
    if (!isOrganizationId(obj.defaultOrganizationId)) {
      throw new Error(`Invalid organization ID format '${obj.defaultOrganizationId}', expected a UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`);
    }
  }

  // Default Project ID.
  if (obj.defaultProjectId !== undefined) {
    if (typeof obj.defaultProjectId !== 'string' || obj.defaultProjectId.length === 0) {
      throw new Error('Default project ID cannot be empty');
    }
    if (!isProjectId(obj.defaultProjectId)) {
      throw new Error(`Invalid project ID format '${obj.defaultProjectId}', expected a UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`);
    }
  }

  // Default Region.
  if (obj.defaultRegion && !isRegion(obj.defaultRegion)) {
    throw new Error(`Invalid default region format '${obj.defaultRegion}'`);
  }

  // Default Zone.
  if (obj.defaultZone && !isZone(obj.defaultZone)) {
    throw new Error(`Invalid default zone format '${obj.defaultZone}'`);
  }

  // API URL.
  if (!isURL(obj.apiURL)) {
    throw new Error(`Invalid URL ${obj.apiURL}`);
  }
  if (obj.apiURL.endsWith('/')) {
    throw new Error(`Invalid URL ${obj.apiURL}: it should not have a trailing slash`);
  }

  // HTTP Client.
  if (typeof obj.httpClient !== typeof fetch) {
    throw new Error(`Invalid HTTP Client`);
  }

  // Default Page Size.
  if (obj.defaultPageSize !== undefined && (typeof obj.defaultPageSize !== 'number' || Number.isNaN(obj.defaultPageSize) || obj.defaultPageSize <= 0)) {
    throw new Error(`Invalid defaultPageSize ${obj.defaultPageSize}: it should be a number above 0`);
  }

  // User Agent.
  if (typeof obj.userAgent !== 'string') {
    throw new Error(`Invalid User-Agent`);
  }
};

const version = 'v1.10.1';
const userAgent = `scaleway-sdk-js/${version}`;

const isBrowser = () => typeof window !== 'undefined' && typeof window.document !== 'undefined';

/**
 * Composes request interceptors.
 *
 * @param interceptors - A list of request interceptors
 * @returns An async composed interceptor
 *
 * @internal
 */
const composeRequestInterceptors = interceptors => async request => interceptors.reduce(async (asyncResult, interceptor) => interceptor({
  request: await asyncResult
}), Promise.resolve(request));

/**
 * Composes response interceptors.
 *
 * @param interceptors - A list of response interceptors
 * @returns An async composed interceptor
 *
 * @internal
 */
const composeResponseInterceptors = interceptors => async response => interceptors.reduce(async (asyncResult, interceptor) => interceptor({
  response: await asyncResult
}), Promise.resolve(response));

/**
 * Compose response error interceptors.
 *
 * @internal
 */
const composeResponseErrorInterceptors = interceptors => async (request, error) => {
  let prevError = error;
  for (const interceptor of interceptors) {
    try {
      const res = await interceptor({
        request,
        error: prevError
      });
      return res;
    } catch (err) {
      prevError = err;
    }
  }
  throw prevError;
};

/**
 * Converts a string to PascalCase.
 *
 * @param str - The input string
 * @returns The string in PascalCase
 *
 * @internal
 */
const toPascalCase = str => str.replace(/\w+/g, word => `${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`);

/**
 * Converts a Headers entry to string.
 *
 * @param entry - The header entry as a string tuple
 * @returns A serialized string
 *
 * @internal
 */
const serializeHeadersEntry = ([name, value]) => `${toPascalCase(name)}: ${value}`;

/**
 * Converts Headers to safe to log strings (with obfuscated auth secrets).
 *
 * @param headers - The Headers
 * @returns Serialized headers strings
 *
 * @internal
 */
const serializeHeaders = headers => Array.from(headers.entries(), serializeHeadersEntry);

/**
 * Dumps a Request into a readable string.
 *
 * @param request - The request
 * @returns The readable string
 *
 * @internal
 */
const dumpRequest = async request => [`${request.method.toUpperCase()}: ${request.url}`, ...serializeHeaders(request.headers), await request.clone().text()].join('\r\n');

/**
 * Dumps a Response into a readable string.
 *
 * @param response - The response
 * @returns The readable string
 *
 * @internal
 */
const dumpResponse = async response => [`HTTP ${response.status} ${response.ok ? 'OK' : 'NOK'}`, ...serializeHeaders(response.headers), await response.clone().text()].join('\r\n');

/**
 * Mapper of an header entry.
 *
 * @internal
 */

/**
 * HTTP Request with obfuscated secrets.
 *
 * @internal
 */
class ObfuscatedRequest extends Request {
  constructor(request, obfuscate) {
    super(request);
    this.request = request;
    this.obfuscate = obfuscate;
  }
  get headers() {
    return new Headers(Array.from(this.request.headers, this.obfuscate));
  }
  clone() {
    return new ObfuscatedRequest(this.request, this.obfuscate);
  }
}

/**
 * Creates an interceptor to obfuscate the requests.
 *
 * @param obfuscate - The Header entries obfuscator mapper
 * @returns The obfuscated Request
 *
 * @internal
 */
const obfuscateInterceptor = obfuscate => ({
  request
}) => new ObfuscatedRequest(request, obfuscate);
const identity = ({
  request
}) => request;

/**
 * Creates an interceptor to log the requests.
 *
 * @param identifier - The request identifier
 * @param obfuscate - The obfuscation interceptor
 * @returns The interceptor
 *
 * @internal
 */
const logRequest = (identifier, obfuscate = identity) => async ({
  request
}) => {
  if (shouldLog(LevelResolver[getLogger().logLevel], 'debug')) {
    getLogger().debug(`--------------- Scaleway SDK REQUEST ${identifier} ---------------
${await dumpRequest(await obfuscate({
      request
    }))}
---------------------------------------------------------`);
  }
  return request;
};

/**
 * Creates an interceptor to log the responses.
 *
 * @param identifier - The request identifier
 * @returns The interceptor
 *
 * @internal
 */
const logResponse = identifier => async ({
  response
}) => {
  if (shouldLog(LevelResolver[getLogger().logLevel], 'debug')) {
    getLogger().debug(`--------------- Scaleway SDK RESPONSE ${identifier} ---------------
${await dumpResponse(response)}
---------------------------------------------------------`);
  }
  return response;
};

/**
 * Validates an object is of type Response without using `instanceof`.
 *
 * @remarks Check issue #509 for more context.
 *
 * @internal
 */
const isResponse = obj => obj !== null && obj !== undefined && typeof obj === 'object' && 'status' in obj && typeof obj.status === 'number' && 'statusText' in obj && typeof obj.statusText === 'string' && 'headers' in obj && typeof obj.headers === 'object' && 'body' in obj && typeof obj.body !== 'undefined';

/**
 * Validates an unknown object is a JSON Object.
 *
 * @internal
 */
const isJSONObject = obj => {
  const objT = typeof obj;
  return obj !== undefined && obj !== null && objT !== 'string' && objT !== 'number' && objT !== 'boolean' && !Array.isArray(obj) && objT === 'object';
};

/**
 * Verifies the object is a record of string to string[].
 *
 * @param obj - The object
 * @returns Whether the object is of the expected type
 *
 * @internal
 */
const isRecordOfStringArray = obj => {
  if (!isJSONObject(obj)) {
    return false;
  }
  for (const elt of Object.values(obj)) {
    if (!Array.isArray(elt) || Object.values(elt).find(x => typeof x !== 'string') !== undefined) {
      return false;
    }
  }
  return true;
};

/**
 * Builds the default message for {@link ScalewayError}.
 *
 * @param status - The response code
 * @param body - The response body
 * @returns The error message
 *
 * @internal
 */
const buildDefaultMessage = (status, body) => {
  const message = [`http error ${status}`];
  if (typeof body === 'string') {
    message.push(body);
  } else if (isJSONObject(body)) {
    if (typeof body.resource === 'string') {
      message.push(`resource ${body.resource}`);
    }
    if (typeof body.message === 'string') {
      message.push(body.message);
    }
    if (body.fields && isRecordOfStringArray(body.fields)) {
      message.push(Object.entries(body.fields).map(([name, list]) => `${name} (${list.join(', ')})`).join(', '));
    }
  }
  return message.join(': ');
};

/**
 * Scaleway error.
 *
 * @public
 */
class ScalewayError extends Error {
  /** The message originating from the payload. */

  constructor( /** The response status. */
  status, /** The response payload. */
  body, /** The augmented message. */
  message = buildDefaultMessage(status, body)) {
    super(message); // 'Error' breaks prototype chain here
    this.status = status;
    this.body = body;
    this.message = message;
    this.name = 'ScalewayError';
    this.rawMessage = typeof body === 'object' && typeof body.message === 'string' ? body.message : undefined;
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }

  static fromJSON(status, obj) {
    return new ScalewayError(status, obj);
  }
  toString() {
    return `${this.name}: ${this.message}`;
  }
}

/**
 * Details of an {@link InvalidArgumentsError} error.
 *
 * @public
 */

/**
 * Build the default message for {@link InvalidArgumentsError}.
 *
 * @param list - The list of {@link InvalidArgumentsErrorDetails}
 * @returns The error message
 *
 * @internal
 */
const buildMessage$5 = list => {
  const invalidArgs = list.reduce((acc, details) => {
    let readableReason = '';
    switch (details.reason) {
      case 'required':
        readableReason = `is required`;
        break;
      case 'format':
        readableReason = `is wrongly formatted`;
        break;
      case 'constraint':
        readableReason = `does not respect constraint`;
        break;
      default:
        readableReason = `is invalid for unexpected reason`;
        break;
    }
    if (details.helpMessage && details.helpMessage.length > 0) {
      readableReason = readableReason.concat(`, `, details.helpMessage);
    }
    acc.push(`${details.argumentName} ${readableReason}`);
    return acc;
  }, []);
  return `invalid argument(s): ${invalidArgs.join('; ')}`;
};

/**
 * InvalidArguments error happens when one or many fields are invalid in the request message.
 *
 * @public
 */
class InvalidArgumentsError extends ScalewayError {
  constructor(status, body, details) {
    super(status, body, buildMessage$5(details));
    this.status = status;
    this.body = body;
    this.details = details;
    this.name = 'InvalidArgumentsError';
  }
  static fromJSON(status, obj) {
    if (!Array.isArray(obj.details)) return null;
    return new InvalidArgumentsError(status, obj, obj.details.reduce((list, detail) => isJSONObject(detail) && typeof detail.argument_name === 'string' && typeof detail.reason === 'string' ? list.concat({
      argumentName: detail.argument_name,
      helpMessage: typeof detail.help_message === 'string' ? detail.help_message : undefined,
      reason: detail.reason
    }) : list, []));
  }
}

/**
 * Scope of an {@link QuotasExceededErrorDetails} error.
 *
 * @public
 */

/**
 * Details of an {@link QuotasExceededError} error.
 *
 * @public
 */

/**
 * Build the default message for {@link QuotasExceededError}.
 *
 * @param list - The list of {@link QuotasExceededErrorDetails}
 * @returns The error message
 *
 * @internal
 */
const buildMessage$4 = list => `quota(s) exceeded: ${list.map(details => {
  const message = `${details.resource} has reached its quota (${details.current}/${details.quota})`;
  return details.scope ? `${message} for ${details.scope.kind} '${details.scope.id}'` : message;
}).join('; ')}`;
const buildScope = detail => {
  if (typeof detail.organization_id === 'string' && detail.organization_id.length) {
    return {
      id: detail.organization_id,
      kind: 'organization'
    };
  }
  if (typeof detail.project_id === 'string' && detail.project_id.length) {
    return {
      id: detail.project_id,
      kind: 'project'
    };
  }
  return undefined;
};

/**
 * QuotasExceeded error happens when one or many resource exceed quotas during the creation of a resource.
 *
 * @public
 */
class QuotasExceededError extends ScalewayError {
  constructor(status, body, list) {
    super(status, body, buildMessage$4(list));
    this.status = status;
    this.body = body;
    this.list = list;
    this.name = 'QuotasExceededError';
  }
  static fromJSON(status, obj) {
    if (!Array.isArray(obj.details)) return null;
    return new QuotasExceededError(status, obj, obj.details.reduce((list, detail) => isJSONObject(detail) && typeof detail.resource === 'string' && typeof detail.quota === 'number' && typeof detail.current === 'number' ? list.concat({
      current: detail.current,
      quota: detail.quota,
      resource: detail.resource,
      scope: buildScope(detail)
    }) : list, []));
  }
}

/**
 * InvalidRequest error is only returned by the instance API.
 *
 * @public
 */
class InvalidRequestMapper {
  static fromJSON(status, obj) {
    if (typeof obj.message === 'string' && obj.message.toLowerCase().includes('quota exceeded for this resource')) {
      return new QuotasExceededError(status, obj, [{
        current: 0,
        quota: 0,
        resource: typeof obj.resource === 'string' ? obj.resource : ''
      }]);
    }
    const fields = obj.fields && isRecordOfStringArray(obj.fields) ? obj.fields : {};
    const fieldsMessages = Object.entries(fields);
    if (fieldsMessages.length) {
      return new InvalidArgumentsError(status, obj, fieldsMessages.map(([argumentName, messages]) => messages.map(helpMessage => ({
        argumentName,
        helpMessage,
        reason: 'constraint'
      }))).flat());
    }
    return new ScalewayError(status, obj);
  }
}

/**
 * ResourceNotFound error happens when getting a resource that does not exist anymore.
 *
 * @public
 */
class ResourceNotFoundError extends ScalewayError {
  constructor(status, body, resource, resourceId) {
    super(status, body, `resource ${resource} with ID ${resourceId} is not found`);
    this.status = status;
    this.body = body;
    this.resource = resource;
    this.resourceId = resourceId;
    this.name = 'ResourceNotFoundError';
  }
  static fromJSON(status, obj) {
    if (typeof obj.resource !== 'string' || typeof obj.resource_id !== 'string') {
      return null;
    }
    return new ResourceNotFoundError(status, obj, obj.resource, obj.resource_id);
  }
}

/**
 * UnknownResource error is only returned by the instance API.
 *
 * @public
 */
class UnknownResourceMapper {
  static fromJSON(status, obj) {
    // Split the message
    // Note: some errors uses ' and not "
    // Examples: `"111..." not found` or `Security Group '111...' not found`
    const messageParts = typeof obj.message === 'string' ? obj.message.split(/"|'/) : [];
    if (messageParts.length === 3 && isUUID(messageParts[1])) {
      return new ResourceNotFoundError(status, obj,
      // transform `Security group ` to `security_group`
      // `.replaceAll()` may be too recent to use yet.
      // that's why we're using `.split(' ').join('_')` for now.
      messageParts[0].trim().toLowerCase().split(' ').join('_'), messageParts[1]);
    }
    return new ScalewayError(status, obj);
  }
}

/**
 * AlreadyExists error is used when a resource already exists.
 *
 * @public
 */
class AlreadyExistsError extends ScalewayError {
  constructor(status, body, resource, resourceId, helpMessage) {
    super(status, body, `resource ${resource} with ID ${resourceId} already exists: ${helpMessage}`);
    this.status = status;
    this.body = body;
    this.resource = resource;
    this.resourceId = resourceId;
    this.helpMessage = helpMessage;
    this.name = 'AlreadyExistsError';
  }
  static fromJSON(status, obj) {
    if (typeof obj.resource !== 'string' || typeof obj.resource_id !== 'string' || typeof obj.help_message !== 'string') {
      return null;
    }
    return new AlreadyExistsError(status, obj, obj.resource, obj.resource_id, obj.help_message);
  }
}

/**
 * Build the default message for {@link DeniedAuthenticationError}.
 *
 * @param method - The authentication method
 * @param reason - The deny reason
 * @returns The error message
 *
 * @internal
 */
const buildMessage$3 = (method, reason) => {
  let reasonDesc;
  switch (reason) {
    case 'invalid_argument':
      reasonDesc = `invalid ${method} format or empty value`;
      break;
    case 'not_found':
      reasonDesc = `${method} does not exist`;
      break;
    case 'expired':
      reasonDesc = `${method} is expired`;
      break;
    default:
      reasonDesc = `unknown reason for ${method}`;
  }
  return `denied authentication: ${reasonDesc}`;
};

/**
 * DeniedAuthentication error is used by the API Gateway auth service to deny a request.
 *
 * @public
 */
class DeniedAuthenticationError extends ScalewayError {
  constructor(status, body, method, reason) {
    super(status, body, buildMessage$3(method, reason));
    this.status = status;
    this.body = body;
    this.method = method;
    this.reason = reason;
    this.name = 'DeniedAuthenticationError';
  }
  static fromJSON(status, obj) {
    if (typeof obj.method !== 'string' || typeof obj.reason !== 'string') {
      return null;
    }
    return new DeniedAuthenticationError(status, obj, obj.method, obj.reason);
  }
}

/**
 * OutOfStock error happens when stocks are empty for the resource.
 *
 * @public
 */
class OutOfStockError extends ScalewayError {
  constructor(status, body, resource) {
    super(status, body, `resource ${resource} is out of stock`);
    this.status = status;
    this.body = body;
    this.resource = resource;
    this.name = 'OutOfStockError';
  }
  static fromJSON(status, obj) {
    if (typeof obj.resource !== 'string') return null;
    return new OutOfStockError(status, obj, obj.resource);
  }
}

/**
 * Details of an {@link PermissionsDeniedError} error.
 *
 * @public
 */

/**
 * Build the default message for {@link PermissionsDeniedError}.
 *
 * @param list - The list of {@link PermissionsDeniedErrorDetails}
 * @returns The error message
 *
 * @internal
 */
const buildMessage$2 = list => `insufficient permissions: ${list.map(({
  action,
  resource
}) => `${action} ${resource}`).join('; ')}`;

/**
 * PermissionsDenied error happens when one or many permissions are not accorded to the user making the request.
 *
 * @public
 */
class PermissionsDeniedError extends ScalewayError {
  constructor(status, body, list) {
    super(status, body, buildMessage$2(list));
    this.status = status;
    this.body = body;
    this.list = list;
    this.name = 'PermissionsDeniedError';
  }
  static fromJSON(status, obj) {
    if (!Array.isArray(obj.details)) return null;
    return new PermissionsDeniedError(status, obj, obj.details.reduce((list, detail) => isJSONObject(detail) && typeof detail.resource === 'string' && typeof detail.action === 'string' ? list.concat({
      action: detail.action,
      resource: detail.resource
    }) : list, []));
  }
}

/**
 * Build the default message for {@link PreconditionFailedError}.
 *
 * @param precondition - The precondition
 * @param helpMessage - The message which should help the user to fix the root cause
 * @returns The error message
 *
 * @internal
 */
const buildMessage$1 = (precondition, helpMessage) => {
  let message = `precondition failed: ${precondition}`;
  if (typeof helpMessage === 'string' && helpMessage.length > 0) {
    message = message.concat(', ', helpMessage);
  }
  return message;
};

/**
 * PreconditionFailed error is used when a precondition is not respected.
 *
 * @public
 */
class PreconditionFailedError extends ScalewayError {
  constructor(status, body, precondition, helpMessage) {
    super(status, body, buildMessage$1(precondition, helpMessage));
    this.status = status;
    this.body = body;
    this.precondition = precondition;
    this.helpMessage = helpMessage;
    this.name = 'PreconditionFailedError';
  }
  static fromJSON(status, obj) {
    if (typeof obj.precondition !== 'string' || typeof obj.help_message !== 'string') {
      return null;
    }
    return new PreconditionFailedError(status, obj, obj.precondition, obj.help_message);
  }
}

/**
 * ResourceExpired error happens when trying to access a resource that has expired.
 *
 * @public
 */
class ResourceExpiredError extends ScalewayError {
  constructor(status, body, resource, resourceId, expiredSince) {
    super(status, body, `resource ${resource} with ID ${resourceId} expired since ${expiredSince.toISOString()}`);
    this.status = status;
    this.body = body;
    this.resource = resource;
    this.resourceId = resourceId;
    this.expiredSince = expiredSince;
    this.name = 'ResourceExpiredError';
  }
  static fromJSON(status, obj) {
    if (typeof obj.resource !== 'string' || typeof obj.resource_id !== 'string' || typeof obj.expired_since !== 'string') {
      return null;
    }
    return new ResourceExpiredError(status, obj, obj.resource, obj.resource_id, new Date(obj.expired_since));
  }
}

/**
 * ResourceLocked error happens when a resource is locked by trust and safety.
 *
 * @public
 */
class ResourceLockedError extends ScalewayError {
  constructor(status, body, resource, resourceId) {
    super(status, body, `resource ${resource} with ID ${resourceId} is locked`);
    this.status = status;
    this.body = body;
    this.resource = resource;
    this.resourceId = resourceId;
    this.name = 'ResourceLockedError';
  }
  static fromJSON(status, obj) {
    if (typeof obj.resource !== 'string' || typeof obj.resource_id !== 'string') {
      return null;
    }
    return new ResourceLockedError(status, obj, obj.resource, obj.resource_id);
  }
}

/**
 * Quota policy of {@link TooManyRequestsError}.
 *
 * @public
 */

/**
 * Build the default message for {@link TooManyRequestsError}.
 *
 * @internal
 */
const buildMessage = (helpMessage, limit, resetSeconds, resetAt) => {
  const details = [];
  if (limit) {
    if (limit.windowSeconds) {
      details.push(`quota is ${limit.quota} for ${limit.windowSeconds}s`);
    } else {
      details.push(`quota is ${limit.quota}`);
    }
  }
  if (resetSeconds) {
    details.push(`resets in ${resetSeconds}s`);
  } else if (resetAt) {
    details.push(`resets at ${resetAt.toISOString()}`);
  }
  let output = `too many requests`;
  if (details.length > 0) {
    output += ` (${details.join(', ')})`;
  }
  if (helpMessage.length > 0) {
    output += `: ${helpMessage}`;
  }
  return output;
};

/**
 * TooManyRequestsError error happens when fetching too many times a resource.
 *
 * @public
 */
class TooManyRequestsError extends ScalewayError {
  constructor(status, body, helpMessage, limit, /** The number of seconds until the quota resets */
  resetSeconds, /** The timestamp when the quota resets */
  resetAt) {
    super(status, body, buildMessage(helpMessage, limit, resetSeconds, resetAt));
    this.status = status;
    this.body = body;
    this.helpMessage = helpMessage;
    this.limit = limit;
    this.resetSeconds = resetSeconds;
    this.resetAt = resetAt;
    this.name = 'TooManyRequestsError';
  }
  static fromJSON(status, obj) {
    if (typeof obj.help_message !== 'string') return null;
    let limit;
    if (isJSONObject(obj.limit) && typeof obj.limit.quota === 'number') {
      limit = {
        quota: obj.limit.quota,
        windowSeconds: typeof obj.limit.window_seconds === 'number' ? obj.limit.window_seconds : undefined
      };
    }
    return new TooManyRequestsError(status, obj, obj.help_message, limit, typeof obj.reset_seconds === 'number' ? obj.reset_seconds : undefined, typeof obj.reset_at === 'string' ? new Date(obj.reset_at) : undefined);
  }
}

/**
 * TransientState error happens when trying to perform an action on a resource in a transient state.
 *
 * @public
 */
class TransientStateError extends ScalewayError {
  constructor(status, body, resource, resourceId, currentState) {
    super(status, body, `resource ${resource} with ID ${resourceId} is in a transient state: ${currentState}`);
    this.status = status;
    this.body = body;
    this.resource = resource;
    this.resourceId = resourceId;
    this.currentState = currentState;
    this.name = 'TransientStateError';
  }
  static fromJSON(status, obj) {
    if (typeof obj.resource !== 'string' || typeof obj.resource_id !== 'string' || typeof obj.current_state !== 'string') {
      return null;
    }
    return new TransientStateError(status, obj, obj.resource, obj.resource_id, obj.current_state);
  }
}

/**
 * Unmarshals a standard error from raw body.
 *
 * @param type - The error type
 * @param status - The status code
 * @param body - The error response
 * @returns The standard error if found
 *
 * @internal
 */
const unmarshalStandardError = (type, status, body) => {
  let error;
  switch (type) {
    case 'denied_authentication':
      error = DeniedAuthenticationError;
      break;
    case 'invalid_arguments':
      error = InvalidArgumentsError;
      break;
    case 'out_of_stock':
      error = OutOfStockError;
      break;
    case 'permissions_denied':
      error = PermissionsDeniedError;
      break;
    case 'precondition_failed':
      error = PreconditionFailedError;
      break;
    case 'quotas_exceeded':
      error = QuotasExceededError;
      break;
    case 'expired':
      error = ResourceExpiredError;
      break;
    case 'not_found':
      error = ResourceNotFoundError;
      break;
    case 'locked':
      error = ResourceLockedError;
      break;
    case 'transient_state':
      error = TransientStateError;
      break;
    case 'already_exists':
      error = AlreadyExistsError;
      break;
    case 'too_many_requests':
      error = TooManyRequestsError;
      break;
    default:
      return null;
  }
  return error.fromJSON(status, body);
};

/**
 * Unmarshals a non-standard error from raw body.
 *
 * @param type - The error type
 * @param status - The status code
 * @param body - The error response
 * @returns The non-standard error if found
 *
 * @internal
 */
const unmarshalNonStandardError = (type, status, body) => {
  switch (type) {
    case 'unknown_resource':
      return UnknownResourceMapper.fromJSON(status, body);
    case 'invalid_request_error':
      return InvalidRequestMapper.fromJSON(status, body);
    default:
      return null;
  }
};

/**
 * Parses Scaleway error from raw body.
 *
 * @param status - The status code
 * @param body - The error response
 * @returns The resolved error
 *
 * @internal
 */
const parseScalewayError = (status, body) => {
  const parsableError = typeof body.type === 'string' && (unmarshalStandardError(body.type, status, body) ?? unmarshalNonStandardError(body.type, status, body));
  return parsableError || new ScalewayError(status, body);
};

const X_TOTAL_COUNT_HEADER_KEY = 'x-total-count';
const TOTAL_COUNT_RES_KEY = 'total_count';

/**
 * Fixes the totalCount property for old APIs.
 *
 * @internal
 */
const fixLegacyTotalCount = (obj, headers) => {
  const headerVal = headers.get(X_TOTAL_COUNT_HEADER_KEY);
  if (!headerVal) {
    return obj;
  }
  const totalCount = parseInt(headerVal, 10);
  if (Number.isNaN(totalCount)) {
    return obj;
  }
  if (isJSONObject(obj) && !(TOTAL_COUNT_RES_KEY in obj)) {
    return Object.assign(obj, {
      [TOTAL_COUNT_RES_KEY]: totalCount
    });
  }
  return obj;
};

/**
 * Makes response parser.
 *
 * @param unmarshaller - The response payload unmarshaller
 * @returns An async converter of HTTP Response to desired result
 *
 * @throws {@link ScalewayError}
 * Thrown by the API if the request couldn't be completed.
 *
 * @throws TypeError
 * Thrown if the response parameter isn't of the expected type.
 *
 * @throws Error
 * JSON parsing could trigger an error.
 *
 * @internal
 */
const responseParser = (unmarshaller, responseType) => async response => {
  if (!isResponse(response)) {
    throw new TypeError('Invalid response object');
  }
  if (response.ok) {
    if (response.status === 204) return unmarshaller(undefined);
    const contentType = response.headers.get('Content-Type');
    try {
      if (responseType === 'json' && contentType === 'application/json') {
        return unmarshaller(fixLegacyTotalCount(await response.json(), response.headers));
      }
      if (responseType === 'blob') {
        return unmarshaller(await response.blob());
      }
      return unmarshaller(await response.text());
    } catch (err) {
      throw new ScalewayError(response.status, `could not parse '${contentType ?? ''}' response${err instanceof Error ? `: ${err.message}` : ''}`);
    }
  }
  const error = await response.clone().json().catch(() => response.text());
  if (isJSONObject(error)) throw parseScalewayError(response.status, error);
  throw new ScalewayError(response.status, typeof error === 'string' ? error : 'cannot read error response body');
};

/**
 * Builds Request from {@link ScwRequest} & {@link Settings}.
 *
 * @param request - A scaleway request
 * @param settings - The settings
 * @returns A fetch Request
 *
 * @internal
 */
const buildRequest = (request, settings) => {
  let {
    path
  } = request;
  if (request.urlParams instanceof URLSearchParams) {
    path = path.concat(`?${request.urlParams.toString()}`);
  }
  return new Request(`${settings.apiURL}${path}`, {
    body: request.body,
    headers: {
      Accept: 'application/json',
      ...( /* istanbul ignore next */!isBrowser() ? {
        'User-Agent': settings.userAgent
      } : {}),
      ...request.headers
    },
    method: request.method
  });
};
const asIs = response => response;
/**
 * Builds a resource fetcher.
 *
 * @param settings - The {@link Settings} object
 * @param httpClient - The HTTP client that should be used to call the API
 * @returns The fetcher
 *
 * @internal
 */
const buildFetcher = (settings, httpClient) => {
  let requestNumber = 0;
  const prepareRequest = requestId => composeRequestInterceptors([...settings.interceptors.map(obj => obj.request).filter(obj => obj), logRequest(requestId, obfuscateInterceptor(obfuscateAuthHeadersEntry))]);
  const prepareResponse = requestId => composeResponseInterceptors([...settings.interceptors.map(obj => obj.response).filter(obj => obj), logResponse(requestId)]);
  const prepareResponseErrors = () => composeResponseErrorInterceptors(settings.interceptors.map(obj => obj.responseError).filter(obj => obj));
  return async (request, unwrapper = asIs) => {
    const requestId = `${requestNumber += 1}`;
    const reqInterceptors = prepareRequest(requestId);
    const finalRequest = await reqInterceptors(buildRequest(request, settings));
    try {
      const response = await httpClient(finalRequest);
      const resInterceptors = prepareResponse(requestId);
      const finalResponse = await resInterceptors(response);
      const resUnmarshaller = responseParser(unwrapper, request.responseType ?? 'json');
      const unmarshaledResponse = await resUnmarshaller(finalResponse);
      return unmarshaledResponse;
    } catch (err) {
      const resErrorInterceptors = prepareResponseErrors();
      const handledError = await resErrorInterceptors(finalRequest, err);
      return unwrapper(handledError);
    }
  };
};

/** Default {@link Settings} values. */
const DEFAULT_SETTINGS = {
  apiURL: 'https://api.scaleway.com',
  httpClient: fetch,
  interceptors: [],
  userAgent
};

/**
 * Scaleway client.
 */

/**
 * Creates a Scaleway client with advanced options.
 * You can either use existing factories
 * (like `withProfile`, `withUserAgentSuffix`, etc)
 * or write your own using the interface `ClientConfig`.
 *
 * @example
 * Creates a client with factories:
 * ```
 * createAdvancedClient(
 *   (obj: Settings) => ({
 *     ...obj,
 *     defaultPageSize: 100 ,
 *     httpClient: myFetchWrapper,
 *   }),
 *   withUserAgentSuffix('bot-name/1.0'),
 * )
 * ```
 *
 * @throws Error
 * Thrown if the setup fails.
 *
 * @public
 */
const createAdvancedClient = (...configs) => {
  const settings = configs.concat([withLegacyInterceptors()]).reduce((currentSettings, config) => config(currentSettings), DEFAULT_SETTINGS);
  assertValidSettings(settings);
  getLogger().info(`init Scaleway SDK version ${version}`);
  return {
    fetch: buildFetcher(settings, settings.httpClient),
    settings
  };
};

/**
 * Creates a Scaleway client with a profile.
 *
 * @example
 * Creates a client with credentials & default values (see https://www.scaleway.com/en/docs/console/my-project/how-to/generate-api-key/):
 * ```
 * import { createClient } from '@scaleway/sdk'
 *
 * createClient({
 *   accessKey: 'SCWXXXXXXXXXXXXXXXXX',
 *   secretKey: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
 *   defaultProjectId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
 *   defaultRegion: 'fr-par',
 *   defaultZone: 'fr-par-1',
 * })
 * ```
 *
 * @example
 * Creates a client by loading values from the environment (see https://www.scaleway.com/en/docs/console/my-project/how-to/generate-api-key/#how-to-use-your-api-key)
 * or the config file created by CLI `scw init` (see https://www.scaleway.com/en/cli/):
 * ```
 * import { loadProfileFromConfigurationFile } from '@scaleway/configuration-loader'
 * import { createClient } from '@scaleway/sdk'
 *
 * createClient({
 *   ...await loadProfileFromConfigurationFile(),
 *   defaultZone: 'fr-par-3',
 * })
 * ```
 *
 * @throws Error
 * Thrown if the setup fails.
 *
 * @public
 */
const createClient = (profile = {}) => createAdvancedClient(withProfile(profile));

var index$t = /*#__PURE__*/Object.freeze({
  __proto__: null,
  AlreadyExistsError: AlreadyExistsError,
  DeniedAuthenticationError: DeniedAuthenticationError,
  InvalidArgumentsError: InvalidArgumentsError,
  OutOfStockError: OutOfStockError,
  PermissionsDeniedError: PermissionsDeniedError,
  PreconditionFailedError: PreconditionFailedError,
  QuotasExceededError: QuotasExceededError,
  ResourceExpiredError: ResourceExpiredError,
  ResourceLockedError: ResourceLockedError,
  ResourceNotFoundError: ResourceNotFoundError,
  ScalewayError: ScalewayError,
  TooManyRequestsError: TooManyRequestsError,
  TransientStateError: TransientStateError
});

/**
 * Sleep for a specified number of time.
 *
 * @param ms - The number of milliseconds
 * @returns The sleep promise
 *
 * @internal
 */
const sleep = ms => new Promise(resolve => {
  setTimeout(resolve, ms);
});

const DEFAULT_TIMEOUT_SECONDS = 300;
const DEFAULT_MIN_DELAY_SECONDS = 1;
const DEFAULT_MAX_DELAY_SECONDS = 30;

/**
 * Creates an exponential backoff interval strategy.
 *
 * @param minDelay - The minimum delay before the next try in seconds
 * @param maxDelay - The maximum delay before the next try in seconds
 * @returns An exponential backoff generator
 *
 * @internal
 */
function* createExponentialBackoffStrategy(minDelay, maxDelay) {
  if (minDelay < 1 || maxDelay < 1 || minDelay > maxDelay) {
    throw new Error('Waiter: minDelay must be >= 1 and maxDelay must be >= minDelay');
  }
  let attempt = 1;
  const ceiling = Math.log(maxDelay / minDelay) / Math.log(2) + 1;
  const randomInRange = (min, max) => min + Math.random() * (max - min);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    if (attempt > ceiling) {
      yield maxDelay;
    } else {
      yield randomInRange(minDelay, minDelay * 2 ** (attempt - 1));
    }
    attempt += 1;
  }
}

/**
 * Tries a specific logic several times until it succeeds, timeouts, or throws an exception.
 *
 * @param retry - The function to retry logic between each interval
 * @param strategy - A generated interval strategy iterator
 * @param timeout - The maximum time elapsed before timeout error
 *
 * @throws An timeout exception or error thrown by the logic being run
 *
 * @internal
 */
const tryAtIntervals = async (retry, strategy, timeout = DEFAULT_TIMEOUT_SECONDS) => {
  const timeoutTimestamp = Date.now() + timeout * 1000;
  let retryCount = 0;
  while (Date.now() <= timeoutTimestamp) {
    const delay = strategy.next(retryCount += 1).value * 1000;
    // Break if timeout has been reached
    if (timeoutTimestamp <= Date.now() + delay) break;
    // Wait before the next retry
    await sleep(delay);
    // Retry
    const {
      value,
      done
    } = await retry();
    if (done) return value;
  }
  throw new Error(`Timeout after ${timeout}s`);
};

/**
 * Represents the condition to stop waiting for a resource.
 *
 * @public
 */

/**
 * The options to wait until a resource is ready.
 *
 * @public
 */

/**
 * Fetches resource several times until an expected condition is reached, timeouts, or throws an exception.
 *
 * @param stop - The condition to stop waiting
 * @param fetcher - The method to retrieve resource
 * @param request - The resource request options
 * @param options - The retry strategy options
 * @param strategy - An optional custom strategy
 *
 * @returns A promise of resource
 *
 * @public
 */
const waitForResource = (stop, fetcher, request, options, strategy = createExponentialBackoffStrategy(options?.minDelay ?? DEFAULT_MIN_DELAY_SECONDS, options?.maxDelay ?? DEFAULT_MAX_DELAY_SECONDS)) => tryAtIntervals(async () => {
  const value = await fetcher(request);
  return {
    done: await stop(value),
    value
  };
}, strategy, options?.timeout);

/**
 * Abstract class to instantiate API from a {@link Client}.
 *
 * @internal
 */
let API$q = class API {
  constructor(client) {
    this.client = client;
  }
};

/**
 * Returns the parameter if it's valid as path parameter
 * (string and not empty, or number), else throws an exception.
 *
 * @param name - The parameter name
 * @param param - The parameter value
 * @returns The parameter value
 *
 * @throws TypeError
 * Thrown if the parameter is invalid.
 *
 * @internal
 */
function validatePathParam(name, param) {
  if (typeof param === 'string' && param.length > 0) return param;
  if (typeof param === 'number') return param.toString();
  throw new TypeError(`param ${name} cannot be empty in request`);
}

/**
 * Resolves the ideal parameter and value amongst an optional list.
 *
 * @param list - The list to be looking into
 * @param isRequired - If at least one "one-of" should be found, false by default
 * @returns The parameter and value
 *
 * @throws TypeError
 * Thrown if isRequired is true, and no value or default value is specified.
 *
 * @internal
 */
const resolveOneOf = (list, isRequired = false) => {
  const elt = list.find(obj => obj.value) || list.find(obj => obj.default);
  const value = elt?.value || elt?.default;
  if (value) return {
    [elt.param]: value
  };
  if (isRequired) {
    const keyList = list.map(obj => obj.param).join(' or ');
    throw new TypeError(`one of ${keyList} must be indicated in the request`);
  }
  return {};
};
/**
 * Filters defined parameters tuples and converts them to URLSearchParams.
 *
 * @param paramTuples - The key/value pairs
 * @returns URLSearchParams
 *
 * @internal
 */
const urlParams = (...paramTuples) => {
  const params = new URLSearchParams();
  for (const [key, value] of paramTuples) {
    if (typeof key === 'string' && value != null) {
      if (Array.isArray(value)) {
        for (const innerValue of value) {
          if (innerValue !== null) {
            params.append(key, innerValue instanceof Date ? innerValue.toISOString() : innerValue.toString());
          }
        }
      } else {
        params.append(key, value instanceof Date ? value.toISOString() : value.toString());
      }
    }
  }
  return params;
};

/**
 * Unmarshals data to Date object.
 *
 * @internal
 */
const unmarshalDate = data => {
  if (typeof data !== 'string') {
    return undefined;
  }
  const date = new Date(data);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return date;
};

/**
 * Unmarshals array of object.
 *
 * @internal
 */
const unmarshalArrayOfObject = (data, unmarshaller, emptyFallback = true) => {
  if (!Array.isArray(data)) {
    return emptyFallback ? [] : undefined;
  }
  return data.map(elt => unmarshaller(elt));
};

/**
 * Unmarshals map of object.
 *
 * @internal
 */
const unmarshalMapOfObject = (data, unmarshaller, emptyFallback = true) => {
  if (!data || typeof data !== 'object' || !(data instanceof Object) || Array.isArray(data)) {
    return emptyFallback ? {} : undefined;
  }
  return Object.entries(data).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: unmarshaller(value)
  }), {});
};

/**
 * Unmarshals {@link Money}
 *
 * @internal
 */
const unmarshalMoney = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Money' failed as data isn't a dictionary.`);
  }
  return {
    currencyCode: data.currency_code,
    nanos: data.nanos,
    units: data.units
  };
};

/**
 * Unmarshals {@link ServiceInfo}.
 *
 * @internal
 */
const unmarshalServiceInfo = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServiceInfo' failed as data isn't a dictionary.`);
  }
  return {
    description: data.description,
    documentationUrl: data.documentation_url,
    name: data.name,
    version: data.version
  };
};

/**
 * Unmarshals {@link ScwFile}.
 *
 * @internal
 */
const unmarshalScwFile = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ScwFile' failed as data isn't a dictionary.`);
  }
  return {
    content: data.content,
    contentType: data.content_type,
    name: data.name
  };
};

/**
 * Unmarshals {@link TimeSeriesPoint}
 *
 * @remarks To optimize the size of this message,
 * the JSON is compressed in an array instead of a dictionary.
 * Example: `["2019-08-08T15:00:00Z", 0.2]`.
 *
 * @internal
 */
const unmarshalTimeSeriesPoint = data => {
  if (!Array.isArray(data)) {
    throw new TypeError(`Unmarshalling the type 'TimeSeriesPoint' failed as data isn't an array.`);
  }
  return {
    timestamp: unmarshalDate(data[0]),
    value: data[1]
  };
};

/**
 * Unmarshals {@link TimeSeries}
 *
 * @internal
 */
const unmarshalTimeSeries = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'TimeSeries' failed as data isn't a dictionary.`);
  }
  return {
    metadata: data.metadata,
    name: data.name,
    points: unmarshalArrayOfObject(data.points, unmarshalTimeSeriesPoint)
  };
};

/**
 * Marshals {@link ScwFile}.
 *
 * @internal
 */
const marshalScwFile = obj => ({
  content: obj.content,
  content_type: obj.contentType,
  name: obj.name
});

/**
 * Marshals {@link Money}
 *
 * @internal
 */
const marshalMoney = obj => ({
  currency_code: obj.currencyCode,
  nanos: obj.nanos,
  units: obj.units
});

/**
 * Marshals {@link TimeSeriesPoint}
 *
 * @internal
 */
const marshalTimeSeriesPoint = obj => ({
  timestamp: obj.timestamp?.toISOString(),
  value: obj.value
});

/**
 * Marshals {@link TimeSeries}
 *
 * @internal
 */
const marshalTimeSeries = obj => ({
  metadata: obj.metadata,
  name: obj.name,
  points: obj.points.map(elt => marshalTimeSeriesPoint(elt))
});

const extract = key => result => result[key];
function* pages(key, fetcher, request, firstPage) {
  if (!Array.isArray(firstPage[key])) {
    throw new Error(`Property ${key} is not a list in paginated result`);
  }
  const getList = extract(key);
  let page = request.page || 1;
  if (page === 1) {
    yield Promise.resolve(getList(firstPage));
    page += 1;
  }
  const {
    length
  } = firstPage[key];
  if (!length) return;
  const {
    totalCount
  } = firstPage;
  while (page <= Math.floor((totalCount + length - 1) / length)) {
    yield fetcher({
      ...request,
      page
    }).then(getList);
    page += 1;
  }
}

/**
 * Fetches a paginated resource.
 *
 * @param key - The resource key of values list
 * @param fetcher - The method to retrieve paginated resources
 * @param request - A request with pagination options
 * @param initial - The first page
 * @returns An async generator of resources arrays
 */
async function* fetchPaginated(key, fetcher, request, initial = fetcher(request)) {
  yield* pages(key, fetcher, request, await initial);
}

/**
 * Fetches all paginated resource.
 *
 * @param key - The resource key of values list
 * @param fetcher - The method to retrieve paginated resources
 * @param request - A request with pagination options
 * @param initial - The first page
 * @returns A resources array Promise
 */
const fetchAll = async (key, fetcher, request, initial = fetcher(request)) => (await Promise.all(Array.from(pages(key, fetcher, request, await initial)))).flat();

/**
 * Enriches a listing method with helpers.
 *
 * @param key - The resource key of values list
 * @param fetcher - The method to retrieve paginated resources
 * @param request - A request with pagination options
 * @returns A resource Promise with the pagination helpers
 *
 * @internal
 */
const enrichForPagination = (key, fetcher, request) => {
  const firstPage = fetcher(request);
  return Object.assign(firstPage, {
    all: () => fetchAll(key, fetcher, request, firstPage),
    [Symbol.asyncIterator]: () => fetchPaginated(key, fetcher, request, firstPage)
  });
};

const ADJECTIVES = ['admiring', 'adoring', 'affectionate', 'agitated', 'amazing', 'angry', 'awesome', 'beautiful', 'blissful', 'bold', 'boring', 'brave', 'busy', 'charming', 'clever', 'cool', 'compassionate', 'competent', 'condescending', 'confident', 'cranky', 'crazy', 'dazzling', 'determined', 'distracted', 'dreamy', 'eager', 'ecstatic', 'elastic', 'elated', 'elegant', 'eloquent', 'epic', 'exciting', 'fervent', 'festive', 'flamboyant', 'focused', 'friendly', 'frosty', 'funny', 'gallant', 'gifted', 'goofy', 'gracious', 'great', 'happy', 'hardcore', 'heuristic', 'hopeful', 'hungry', 'infallible', 'inspiring', 'interesting', 'intelligent', 'jolly', 'jovial', 'keen', 'kind', 'laughing', 'loving', 'lucid', 'magical', 'mystifying', 'modest', 'musing', 'naughty', 'nervous', 'nice', 'nifty', 'nostalgic', 'objective', 'optimistic', 'peaceful', 'pedantic', 'pensive', 'practical', 'priceless', 'quirky', 'quizzical', 'recursing', 'relaxed', 'reverent', 'romantic', 'sad', 'serene', 'sharp', 'silly', 'sleepy', 'stoic', 'strange', 'stupefied', 'suspicious', 'sweet', 'tender', 'thirsty', 'trusting', 'unruffled', 'upbeat', 'vibrant', 'vigilant', 'vigorous', 'wizardly', 'wonderful', 'xenodochial', 'youthful', 'zealous', 'zen'];
const NAMES = ['albattani', 'allen', 'almeida', 'antonelli', 'agnesi', 'archimedes', 'ardinghelli', 'aryabhata', 'austin', 'babbage', 'banach', 'banzai', 'bardeen', 'bartik', 'bassi', 'beaver', 'bell', 'benz', 'bhabha', 'bhaskara', 'black', 'blackburn', 'blackwell', 'bohr', 'booth', 'borg', 'bose', 'bouman', 'boyd', 'brahmagupta', 'brattain', 'brown', 'buck', 'burnell', 'cannon', 'carson', 'cartwright', 'carver', 'cerf', 'chandrasekhar', 'chaplygin', 'chatelet', 'chatterjee', 'chebyshev', 'cohen', 'chaum', 'clarke', 'colden', 'cori', 'cray', 'curran', 'curie', 'darwin', 'davinci', 'dewdney', 'dhawan', 'diffie', 'dijkstra', 'dirac', 'driscoll', 'dubinsky', 'easley', 'edison', 'einstein', 'elbakyan', 'elgamal', 'elion', 'ellis', 'engelbart', 'euclid', 'euler', 'faraday', 'feistel', 'fermat', 'fermi', 'feynman', 'franklin', 'gagarin', 'galileo', 'galois', 'ganguly', 'gates', 'gauss', 'germain', 'goldberg', 'goldstine', 'goldwasser', 'golick', 'goodall', 'gould', 'greider', 'grothendieck', 'haibt', 'hamilton', 'haslett', 'hawking', 'hellman', 'heisenberg', 'hermann', 'herschel', 'hertz', 'heyrovsky', 'hodgkin', 'hofstadter', 'hoover', 'hopper', 'hugle', 'hypatia', 'ishizaka', 'jackson', 'jang', 'jemison', 'jennings', 'jepsen', 'johnson', 'joliot', 'jones', 'kalam', 'kapitsa', 'kare', 'keldysh', 'keller', 'kepler', 'khayyam', 'khorana', 'kilby', 'kirch', 'knuth', 'kowalevski', 'lalande', 'lamarr', 'lamport', 'leakey', 'leavitt', 'lederberg', 'lehmann', 'lewin', 'lichterman', 'liskov', 'lovelace', 'lumiere', 'mahavira', 'margulis', 'matsumoto', 'maxwell', 'mayer', 'mccarthy', 'mcclintock', 'mclaren', 'mclean', 'mcnulty', 'mendel', 'mendeleev', 'meitner', 'meninsky', 'merkle', 'mestorf', 'mirzakhani', 'montalcini', 'moore', 'morse', 'murdock', 'moser', 'napier', 'nash', 'neumann', 'newton', 'nightingale', 'nobel', 'noether', 'northcutt', 'noyce', 'panini', 'pare', 'pascal', 'pasteur', 'payne', 'perlman', 'pike', 'poincare', 'poitras', 'proskuriakova', 'ptolemy', 'raman', 'ramanujan', 'ride', 'ritchie', 'rhodes', 'robinson', 'roentgen', 'rosalind', 'rubin', 'saha', 'sammet', 'sanderson', 'satoshi', 'shamir', 'shannon', 'shaw', 'shirley', 'shockley', 'shtern', 'sinoussi', 'snyder', 'solomon', 'spence', 'stonebraker', 'sutherland', 'swanson', 'swartz', 'swirles', 'taussig', 'tereshkova', 'tesla', 'tharp', 'thompson', 'torvalds', 'tu', 'turing', 'varahamihira', 'vaughan', 'visvesvaraya', 'volhard', 'villani', 'wescoff', 'wilbur', 'wiles', 'williams', 'williamson', 'wilson', 'wing', 'wozniak', 'wright', 'wu', 'yalow', 'yonath', 'zhukovsky'];
const randomName = function () {
  let prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '-';
  const name = `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)] ?? ''}${separator}${NAMES[Math.floor(Math.random() * NAMES.length)] ?? ''}`;
  if (name === `boring${separator}wozniak`) {
    return randomName(prefix, separator);
  }
  return prefix.length > 0 ? `${prefix}${separator}${name}` : name;
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalProject = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Project' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    description: data.description,
    id: data.id,
    name: data.name,
    organizationId: data.organization_id,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalListProjectsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListProjectsResponse' failed as data isn't a dictionary.`);
  }
  return {
    projects: unmarshalArrayOfObject(data.projects, unmarshalProject),
    totalCount: data.total_count
  };
};
const marshalCreateProjectRequest = (request, defaults) => ({
  description: request.description,
  name: request.name || randomName('proj'),
  organization_id: request.organizationId ?? defaults.defaultOrganizationId
});
const marshalUpdateProjectRequest = (request, defaults) => ({
  description: request.description,
  name: request.name
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$m = {
  'Content-Type': 'application/json; charset=utf-8'
};

/**
 * Account API.
 *
 * User related data. This API allows you to manage projects.
 */
let API$p = class API extends API$q {
  /**
   * Create a new Project for an Organization. Generate a new Project for an
   * Organization, specifying its configuration including name and description.
   *
   * @param request - The request {@link CreateProjectRequest}
   * @returns A Promise of Project
   */
  createProject = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalCreateProjectRequest(request, this.client.settings)),
    headers: jsonContentHeaders$m,
    method: 'POST',
    path: `/account/v2/projects`
  }, unmarshalProject);
  pageOfListProjects = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/account/v2/projects`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId ?? this.client.settings.defaultOrganizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_ids', request.projectIds])
  }, unmarshalListProjectsResponse);

  /**
   * List all Projects of an Organization. List all Projects of an Organization.
   * The response will include the total number of Projects as well as their
   * associated Organizations, names and IDs. Other information include the
   * creation and update date of the Project.
   *
   * @param request - The request {@link ListProjectsRequest}
   * @returns A Promise of ListProjectsResponse
   */
  listProjects = (request = {}) => enrichForPagination('projects', this.pageOfListProjects, request);

  /**
   * Get an existing Project. Retrieve information about an existing Project,
   * specified by its Project ID. Its full details, including ID, name and
   * description, are returned in the response object.
   *
   * @param request - The request {@link GetProjectRequest}
   * @returns A Promise of Project
   */
  getProject = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/account/v2/projects/${validatePathParam('projectId', request.projectId ?? this.client.settings.defaultProjectId)}`
  }, unmarshalProject);

  /**
   * Delete an existing Project. Delete an existing Project, specified by its
   * Project ID. The Project needs to be empty (meaning there are no resources
   * left in it) to be deleted effectively. Note that deleting a Project is
   * permanent, and cannot be undone.
   *
   * @param request - The request {@link DeleteProjectRequest}
   */
  deleteProject = (request = {}) => this.client.fetch({
    method: 'DELETE',
    path: `/account/v2/projects/${validatePathParam('projectId', request.projectId ?? this.client.settings.defaultProjectId)}`
  });

  /**
   * Update Project. Update the parameters of an existing Project, specified by
   * its Project ID. These parameters include the name and description.
   *
   * @param request - The request {@link UpdateProjectRequest}
   * @returns A Promise of Project
   */
  updateProject = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalUpdateProjectRequest(request, this.client.settings)),
    headers: jsonContentHeaders$m,
    method: 'PATCH',
    path: `/account/v2/projects/${validatePathParam('projectId', request.projectId ?? this.client.settings.defaultProjectId)}`
  }, unmarshalProject);
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen$l = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API$p
});

var index$s = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v2: index_gen$l
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

/** Lists transient statutes of the enum {@link ServerStatus}. */
const SERVER_TRANSIENT_STATUSES$2 = ['starting', 'rebooting', 'updating', 'locking', 'unlocking', 'reinstalling'];

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalServerTypeCPU = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServerTypeCPU' failed as data isn't a dictionary.`);
  }
  return {
    coreCount: data.core_count,
    name: data.name
  };
};
const unmarshalServerTypeDisk = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServerTypeDisk' failed as data isn't a dictionary.`);
  }
  return {
    capacity: data.capacity,
    type: data.type
  };
};
const unmarshalServerTypeMemory = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServerTypeMemory' failed as data isn't a dictionary.`);
  }
  return {
    capacity: data.capacity,
    type: data.type
  };
};
const unmarshalOS$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'OS' failed as data isn't a dictionary.`);
  }
  return {
    compatibleServerTypes: data.compatible_server_types,
    id: data.id,
    imageUrl: data.image_url,
    label: data.label,
    name: data.name
  };
};
const unmarshalServer$2 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Server' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    deletableAt: unmarshalDate(data.deletable_at),
    id: data.id,
    ip: data.ip,
    name: data.name,
    organizationId: data.organization_id,
    projectId: data.project_id,
    status: data.status,
    type: data.type,
    updatedAt: unmarshalDate(data.updated_at),
    vncUrl: data.vnc_url,
    zone: data.zone
  };
};
const unmarshalServerType$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServerType' failed as data isn't a dictionary.`);
  }
  return {
    cpu: data.cpu ? unmarshalServerTypeCPU(data.cpu) : undefined,
    disk: data.disk ? unmarshalServerTypeDisk(data.disk) : undefined,
    memory: data.memory ? unmarshalServerTypeMemory(data.memory) : undefined,
    minimumLeaseDuration: data.minimum_lease_duration,
    name: data.name,
    stock: data.stock
  };
};
const unmarshalListOSResponse$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListOSResponse' failed as data isn't a dictionary.`);
  }
  return {
    os: unmarshalArrayOfObject(data.os, unmarshalOS$1),
    totalCount: data.total_count
  };
};
const unmarshalListServerTypesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListServerTypesResponse' failed as data isn't a dictionary.`);
  }
  return {
    serverTypes: unmarshalArrayOfObject(data.server_types, unmarshalServerType$1)
  };
};
const unmarshalListServersResponse$2 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListServersResponse' failed as data isn't a dictionary.`);
  }
  return {
    servers: unmarshalArrayOfObject(data.servers, unmarshalServer$2),
    totalCount: data.total_count
  };
};
const marshalCreateServerRequest$2 = (request, defaults) => ({
  name: request.name || randomName('as'),
  project_id: request.projectId ?? defaults.defaultProjectId,
  type: request.type
});
const marshalUpdateServerRequest$2 = (request, defaults) => ({
  name: request.name
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$l = {
  'Content-Type': 'application/json; charset=utf-8'
};

/**
 * Apple silicon API.
 *
 * Apple Mac mini as a service. Scaleway Apple silicon as-a-Service is built
 * using the latest generation of Apple Mac mini hardware (fifth generation).
 *
 * These dedicated Mac mini M1s are designed for developing, building, testing,
 * and signing applications for Apple devices, including iPhones, iPads, Mac
 * computers and much more.
 *
 * Get set to explore, learn and build on a dedicated Mac mini M1 with more
 * performance and speed than you ever thought possible.
 *
 * _Apple silicon as a Service comes with a minimum allocation period of 24
 * hours_*.
 *
 * Mac mini and macOS are trademarks of Apple Inc., registered in the U.S. and
 * other countries and regions. IOS is a trademark or registered trademark of
 * Cisco in the U.S. and other countries and is used by Apple under license.
 * Scaleway is not affiliated with Apple Inc.
 */
let API$o = class API extends API$q {
  /** Lists the available zones of the API. */
  static LOCALITIES = ['fr-par-3'];

  /**
   * List server types. List all technical details about Apple silicon server
   * types available in the specified zone. Since there is only one Availability
   * Zone for Apple silicon servers, the targeted value is `fr-par-3`.
   *
   * @param request - The request {@link ListServerTypesRequest}
   * @returns A Promise of ListServerTypesResponse
   */
  listServerTypes = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/apple-silicon/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/server-types`
  }, unmarshalListServerTypesResponse);

  /**
   * Get a server type. Get technical details (CPU, disk size etc.) of a server
   * type.
   *
   * @param request - The request {@link GetServerTypeRequest}
   * @returns A Promise of ServerType
   */
  getServerType = request => this.client.fetch({
    method: 'GET',
    path: `/apple-silicon/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/server-type/${validatePathParam('serverType', request.serverType)}`
  }, unmarshalServerType$1);

  /**
   * Create a server. Create a new server in the targeted zone, specifying its
   * configuration including name and type.
   *
   * @param request - The request {@link CreateServerRequest}
   * @returns A Promise of Server
   */
  createServer = request => this.client.fetch({
    body: JSON.stringify(marshalCreateServerRequest$2(request, this.client.settings)),
    headers: jsonContentHeaders$l,
    method: 'POST',
    path: `/apple-silicon/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers`
  }, unmarshalServer$2);
  pageOfListServers = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/apple-silicon/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers`,
    urlParams: urlParams(['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListServersResponse$2);

  /**
   * List all servers. List all servers in the specified zone. By default,
   * returned servers in the list are ordered by creation date in ascending
   * order, though this can be modified via the `order_by` field.
   *
   * @param request - The request {@link ListServersRequest}
   * @returns A Promise of ListServersResponse
   */
  listServers = (request = {}) => enrichForPagination('servers', this.pageOfListServers, request);
  pageOfListOS = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/apple-silicon/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/os`,
    urlParams: urlParams(['name', request.name], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['server_type', request.serverType])
  }, unmarshalListOSResponse$1);

  /**
   * List all Operating Systems (OS). List all Operating Systems (OS). The
   * response will include the total number of OS as well as their associated
   * IDs, names and labels.
   *
   * @param request - The request {@link ListOSRequest}
   * @returns A Promise of ListOSResponse
   */
  listOS = (request = {}) => enrichForPagination('os', this.pageOfListOS, request);

  /**
   * Get an Operating System (OS). Get an Operating System (OS). The response
   * will include the OS's unique ID as well as its name and label.
   *
   * @param request - The request {@link GetOSRequest}
   * @returns A Promise of OS
   */
  getOS = request => this.client.fetch({
    method: 'GET',
    path: `/apple-silicon/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/os/${validatePathParam('osId', request.osId)}`
  }, unmarshalOS$1);

  /**
   * Get a server. Retrieve information about an existing Apple silicon server,
   * specified by its server ID. Its full details, including name, status and IP
   * address, are returned in the response object.
   *
   * @param request - The request {@link GetServerRequest}
   * @returns A Promise of Server
   */
  getServer = request => this.client.fetch({
    method: 'GET',
    path: `/apple-silicon/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}`
  }, unmarshalServer$2);

  /**
   * Waits for {@link Server} to be in a final state.
   *
   * @param request - The request {@link GetServerRequest}
   * @param options - The waiting options
   * @returns A Promise of Server
   */
  waitForServer = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!SERVER_TRANSIENT_STATUSES$2.includes(res.status))), this.getServer, request, options);

  /**
   * Update a server. Update the parameters of an existing Apple silicon server,
   * specified by its server ID.
   *
   * @param request - The request {@link UpdateServerRequest}
   * @returns A Promise of Server
   */
  updateServer = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateServerRequest$2(request, this.client.settings)),
    headers: jsonContentHeaders$l,
    method: 'PATCH',
    path: `/apple-silicon/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}`
  }, unmarshalServer$2);

  /**
   * Delete a server. Delete an existing Apple silicon server, specified by its
   * server ID. Deleting a server is permanent, and cannot be undone. Note that
   * the minimum allocation period for Apple silicon-as-a-service is 24 hours,
   * meaning you cannot delete your server prior to that.
   *
   * @param request - The request {@link DeleteServerRequest}
   */
  deleteServer = request => this.client.fetch({
    method: 'DELETE',
    path: `/apple-silicon/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}`
  });

  /**
   * Reboot a server. Reboot an existing Apple silicon server, specified by its
   * server ID.
   *
   * @param request - The request {@link RebootServerRequest}
   * @returns A Promise of Server
   */
  rebootServer = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$l,
    method: 'POST',
    path: `/apple-silicon/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/reboot`
  }, unmarshalServer$2);

  /**
   * Reinstall a server. Reinstall an existing Apple silicon server (specified
   * by its server ID) from a new image (OS). All the data on the disk is
   * deleted and all configuration is reset to the defailt configuration values
   * of the image (OS).
   *
   * @param request - The request {@link ReinstallServerRequest}
   * @returns A Promise of Server
   */
  reinstallServer = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$l,
    method: 'POST',
    path: `/apple-silicon/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/reinstall`
  }, unmarshalServer$2);
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen$k = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API$o,
  SERVER_TRANSIENT_STATUSES: SERVER_TRANSIENT_STATUSES$2
});

var index$r = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1alpha1: index_gen$k
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

/** Lists transient statutes of the enum {@link ServerInstallStatus}. */
const SERVER_INSTALL_TRANSIENT_STATUSES = ['to_install', 'installing'];

/** Lists transient statutes of the enum {@link ServerPrivateNetworkStatus}. */
const SERVER_PRIVATE_NETWORK_TRANSIENT_STATUSES = ['attaching', 'detaching'];

/** Lists transient statutes of the enum {@link ServerStatus}. */
const SERVER_TRANSIENT_STATUSES$1 = ['delivering', 'stopping', 'starting', 'deleting', 'ordered', 'resetting'];

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalCPU = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'CPU' failed as data isn't a dictionary.`);
  }
  return {
    benchmark: data.benchmark,
    coreCount: data.core_count,
    frequency: data.frequency,
    name: data.name,
    threadCount: data.thread_count
  };
};
const unmarshalDisk = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Disk' failed as data isn't a dictionary.`);
  }
  return {
    capacity: data.capacity,
    type: data.type
  };
};
const unmarshalIP$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'IP' failed as data isn't a dictionary.`);
  }
  return {
    address: data.address,
    id: data.id,
    reverse: data.reverse,
    reverseStatus: data.reverse_status,
    reverseStatusMessage: data.reverse_status_message,
    version: data.version
  };
};
const unmarshalMemory = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Memory' failed as data isn't a dictionary.`);
  }
  return {
    capacity: data.capacity,
    frequency: data.frequency,
    isEcc: data.is_ecc,
    type: data.type
  };
};
const unmarshalOSOSField = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'OSOSField' failed as data isn't a dictionary.`);
  }
  return {
    defaultValue: data.default_value,
    editable: data.editable,
    required: data.required
  };
};
const unmarshalOfferOptionOffer = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'OfferOptionOffer' failed as data isn't a dictionary.`);
  }
  return {
    enabled: data.enabled,
    id: data.id,
    manageable: data.manageable,
    name: data.name,
    osId: data.os_id,
    price: data.price ? unmarshalMoney(data.price) : undefined,
    subscriptionPeriod: data.subscription_period
  };
};
const unmarshalPersistentMemory = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'PersistentMemory' failed as data isn't a dictionary.`);
  }
  return {
    capacity: data.capacity,
    frequency: data.frequency,
    type: data.type
  };
};
const unmarshalRaidController = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'RaidController' failed as data isn't a dictionary.`);
  }
  return {
    model: data.model,
    raidLevel: data.raid_level
  };
};
const unmarshalServerInstall = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServerInstall' failed as data isn't a dictionary.`);
  }
  return {
    hostname: data.hostname,
    osId: data.os_id,
    serviceUrl: data.service_url,
    serviceUser: data.service_user,
    sshKeyIds: data.ssh_key_ids,
    status: data.status,
    user: data.user
  };
};
const unmarshalServerOption = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServerOption' failed as data isn't a dictionary.`);
  }
  return {
    expiresAt: unmarshalDate(data.expires_at),
    id: data.id,
    manageable: data.manageable,
    name: data.name,
    status: data.status
  };
};
const unmarshalServerRescueServer = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServerRescueServer' failed as data isn't a dictionary.`);
  }
  return {
    password: data.password,
    user: data.user
  };
};
const unmarshalOS = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'OS' failed as data isn't a dictionary.`);
  }
  return {
    allowed: data.allowed,
    enabled: data.enabled,
    id: data.id,
    licenseRequired: data.license_required,
    logoUrl: data.logo_url,
    name: data.name,
    password: data.password ? unmarshalOSOSField(data.password) : undefined,
    servicePassword: data.service_password ? unmarshalOSOSField(data.service_password) : undefined,
    serviceUser: data.service_user ? unmarshalOSOSField(data.service_user) : undefined,
    ssh: data.ssh ? unmarshalOSOSField(data.ssh) : undefined,
    user: data.user ? unmarshalOSOSField(data.user) : undefined,
    version: data.version
  };
};
const unmarshalOffer$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Offer' failed as data isn't a dictionary.`);
  }
  return {
    bandwidth: data.bandwidth,
    commercialRange: data.commercial_range,
    cpus: unmarshalArrayOfObject(data.cpus, unmarshalCPU),
    disks: unmarshalArrayOfObject(data.disks, unmarshalDisk),
    enable: data.enable,
    fee: data.fee ? unmarshalMoney(data.fee) : undefined,
    id: data.id,
    incompatibleOsIds: data.incompatible_os_ids,
    memories: unmarshalArrayOfObject(data.memories, unmarshalMemory),
    name: data.name,
    operationPath: data.operation_path,
    options: unmarshalArrayOfObject(data.options, unmarshalOfferOptionOffer),
    persistentMemories: unmarshalArrayOfObject(data.persistent_memories, unmarshalPersistentMemory),
    pricePerHour: data.price_per_hour ? unmarshalMoney(data.price_per_hour) : undefined,
    pricePerMonth: data.price_per_month ? unmarshalMoney(data.price_per_month) : undefined,
    privateBandwidth: data.private_bandwidth,
    quotaName: data.quota_name,
    raidControllers: unmarshalArrayOfObject(data.raid_controllers, unmarshalRaidController),
    sharedBandwidth: data.shared_bandwidth,
    stock: data.stock,
    subscriptionPeriod: data.subscription_period,
    tags: data.tags
  };
};
const unmarshalOption = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Option' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    manageable: data.manageable,
    name: data.name
  };
};
const unmarshalServer$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Server' failed as data isn't a dictionary.`);
  }
  return {
    bootType: data.boot_type,
    createdAt: unmarshalDate(data.created_at),
    description: data.description,
    domain: data.domain,
    id: data.id,
    install: data.install ? unmarshalServerInstall(data.install) : undefined,
    ips: unmarshalArrayOfObject(data.ips, unmarshalIP$1),
    name: data.name,
    offerId: data.offer_id,
    offerName: data.offer_name,
    options: unmarshalArrayOfObject(data.options, unmarshalServerOption),
    organizationId: data.organization_id,
    pingStatus: data.ping_status,
    projectId: data.project_id,
    rescueServer: data.rescue_server ? unmarshalServerRescueServer(data.rescue_server) : undefined,
    status: data.status,
    tags: data.tags,
    updatedAt: unmarshalDate(data.updated_at),
    zone: data.zone
  };
};
const unmarshalServerEvent = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServerEvent' failed as data isn't a dictionary.`);
  }
  return {
    action: data.action,
    createdAt: unmarshalDate(data.created_at),
    id: data.id,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalServerPrivateNetwork = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServerPrivateNetwork' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    id: data.id,
    privateNetworkId: data.private_network_id,
    projectId: data.project_id,
    serverId: data.server_id,
    status: data.status,
    updatedAt: unmarshalDate(data.updated_at),
    vlan: data.vlan
  };
};
const unmarshalSetting = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Setting' failed as data isn't a dictionary.`);
  }
  return {
    enabled: data.enabled,
    id: data.id,
    projectId: data.project_id,
    type: data.type
  };
};
const unmarshalBMCAccess = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'BMCAccess' failed as data isn't a dictionary.`);
  }
  return {
    expiresAt: unmarshalDate(data.expires_at),
    login: data.login,
    password: data.password,
    url: data.url
  };
};
const unmarshalGetServerMetricsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetServerMetricsResponse' failed as data isn't a dictionary.`);
  }
  return {
    pings: data.pings ? unmarshalTimeSeries(data.pings) : undefined
  };
};
const unmarshalListOSResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListOSResponse' failed as data isn't a dictionary.`);
  }
  return {
    os: unmarshalArrayOfObject(data.os, unmarshalOS),
    totalCount: data.total_count
  };
};
const unmarshalListOffersResponse$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListOffersResponse' failed as data isn't a dictionary.`);
  }
  return {
    offers: unmarshalArrayOfObject(data.offers, unmarshalOffer$1),
    totalCount: data.total_count
  };
};
const unmarshalListOptionsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListOptionsResponse' failed as data isn't a dictionary.`);
  }
  return {
    options: unmarshalArrayOfObject(data.options, unmarshalOption),
    totalCount: data.total_count
  };
};
const unmarshalListServerEventsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListServerEventsResponse' failed as data isn't a dictionary.`);
  }
  return {
    events: unmarshalArrayOfObject(data.events, unmarshalServerEvent),
    totalCount: data.total_count
  };
};
const unmarshalListServerPrivateNetworksResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListServerPrivateNetworksResponse' failed as data isn't a dictionary.`);
  }
  return {
    serverPrivateNetworks: unmarshalArrayOfObject(data.server_private_networks, unmarshalServerPrivateNetwork),
    totalCount: data.total_count
  };
};
const unmarshalListServersResponse$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListServersResponse' failed as data isn't a dictionary.`);
  }
  return {
    servers: unmarshalArrayOfObject(data.servers, unmarshalServer$1),
    totalCount: data.total_count
  };
};
const unmarshalListSettingsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListSettingsResponse' failed as data isn't a dictionary.`);
  }
  return {
    settings: unmarshalArrayOfObject(data.settings, unmarshalSetting),
    totalCount: data.total_count
  };
};
const unmarshalSetServerPrivateNetworksResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SetServerPrivateNetworksResponse' failed as data isn't a dictionary.`);
  }
  return {
    serverPrivateNetworks: unmarshalArrayOfObject(data.server_private_networks, unmarshalServerPrivateNetwork)
  };
};
const marshalCreateServerRequestInstall = (request, defaults) => ({
  hostname: request.hostname,
  os_id: request.osId,
  password: request.password,
  service_password: request.servicePassword,
  service_user: request.serviceUser,
  ssh_key_ids: request.sshKeyIds,
  user: request.user
});
const marshalAddOptionServerRequest = (request, defaults) => ({
  expires_at: request.expiresAt
});
const marshalCreateServerRequest$1 = (request, defaults) => ({
  description: request.description,
  install: request.install ? marshalCreateServerRequestInstall(request.install) : undefined,
  name: request.name,
  offer_id: request.offerId,
  option_ids: request.optionIds,
  tags: request.tags,
  ...resolveOneOf([{
    default: defaults.defaultProjectId,
    param: 'project_id',
    value: request.projectId
  }, {
    default: defaults.defaultOrganizationId,
    param: 'organization_id',
    value: request.organizationId
  }])
});
const marshalInstallServerRequest = (request, defaults) => ({
  hostname: request.hostname,
  os_id: request.osId,
  password: request.password,
  service_password: request.servicePassword,
  service_user: request.serviceUser,
  ssh_key_ids: request.sshKeyIds,
  user: request.user
});
const marshalPrivateNetworkApiAddServerPrivateNetworkRequest = (request, defaults) => ({
  private_network_id: request.privateNetworkId
});
const marshalPrivateNetworkApiSetServerPrivateNetworksRequest = (request, defaults) => ({
  private_network_ids: request.privateNetworkIds
});
const marshalRebootServerRequest = (request, defaults) => ({
  boot_type: request.bootType ?? 'unknown_boot_type'
});
const marshalStartBMCAccessRequest = (request, defaults) => ({
  ip: request.ip
});
const marshalStartServerRequest = (request, defaults) => ({
  boot_type: request.bootType ?? 'unknown_boot_type'
});
const marshalUpdateIPRequest$1 = (request, defaults) => ({
  reverse: request.reverse
});
const marshalUpdateServerRequest$1 = (request, defaults) => ({
  description: request.description,
  name: request.name,
  tags: request.tags
});
const marshalUpdateSettingRequest = (request, defaults) => ({
  enabled: request.enabled
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$k = {
  'Content-Type': 'application/json; charset=utf-8'
};

/**
 * Elastic Metal API.
 *
 * This API allows to manage your Elastic Metal server. Elastic Metal API.
 */
let API$n = class API extends API$q {
  /** Lists the available zones of the API. */
  static LOCALITIES = ['fr-par-1', 'fr-par-2', 'nl-ams-1'];
  pageOfListServers = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers`,
    urlParams: urlParams(['name', request.name], ['option_id', request.optionId], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId], ['status', request.status], ['tags', request.tags])
  }, unmarshalListServersResponse$1);

  /**
   * List Elastic Metal servers for an Organization. List Elastic Metal servers
   * for a specific Organization.
   *
   * @param request - The request {@link ListServersRequest}
   * @returns A Promise of ListServersResponse
   */
  listServers = (request = {}) => enrichForPagination('servers', this.pageOfListServers, request);

  /**
   * Get a specific Elastic Metal server. Get full details of an existing
   * Elastic Metal server associated with the ID.
   *
   * @param request - The request {@link GetServerRequest}
   * @returns A Promise of Server
   */
  getServer = request => this.client.fetch({
    method: 'GET',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}`
  }, unmarshalServer$1);

  /**
   * Waits for {@link Server} to be in a final state.
   *
   * @param request - The request {@link GetServerRequest}
   * @param options - The waiting options
   * @returns A Promise of Server
   */
  waitForServer = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!SERVER_TRANSIENT_STATUSES$1.includes(res.status))), this.getServer, request, options);

  /**
   * Create an Elastic Metal server. Create a new Elastic Metal server. Once the
   * server is created, proceed with the [installation of an OS](#post-3e949e).
   *
   * @param request - The request {@link CreateServerRequest}
   * @returns A Promise of Server
   */
  createServer = request => this.client.fetch({
    body: JSON.stringify(marshalCreateServerRequest$1(request, this.client.settings)),
    headers: jsonContentHeaders$k,
    method: 'POST',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers`
  }, unmarshalServer$1);

  /**
   * Update an Elastic Metal server. Update the server associated with the ID.
   * You can update parameters such as the server's name, tags and description.
   * Any parameters left null in the request body are not updated.
   *
   * @param request - The request {@link UpdateServerRequest}
   * @returns A Promise of Server
   */
  updateServer = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateServerRequest$1(request, this.client.settings)),
    headers: jsonContentHeaders$k,
    method: 'PATCH',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}`
  }, unmarshalServer$1);

  /**
   * Install an Elastic Metal server. Install an Operating System (OS) on the
   * Elastic Metal server with a specific ID.
   *
   * @param request - The request {@link InstallServerRequest}
   * @returns A Promise of Server
   */
  installServer = request => this.client.fetch({
    body: JSON.stringify(marshalInstallServerRequest(request, this.client.settings)),
    headers: jsonContentHeaders$k,
    method: 'POST',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/install`
  }, unmarshalServer$1);

  /**
   * Return server metrics. Get the ping status of the server associated with
   * the ID.
   *
   * @param request - The request {@link GetServerMetricsRequest}
   * @returns A Promise of GetServerMetricsResponse
   */
  getServerMetrics = request => this.client.fetch({
    method: 'GET',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/metrics`
  }, unmarshalGetServerMetricsResponse);

  /**
   * Delete an Elastic Metal server. Delete the server associated with the ID.
   *
   * @param request - The request {@link DeleteServerRequest}
   * @returns A Promise of Server
   */
  deleteServer = request => this.client.fetch({
    method: 'DELETE',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}`
  }, unmarshalServer$1);

  /**
   * Reboot an Elastic Metal server. Reboot the Elastic Metal server associated
   * with the ID, use the `boot_type` `rescue` to reboot the server in rescue
   * mode.
   *
   * @param request - The request {@link RebootServerRequest}
   * @returns A Promise of Server
   */
  rebootServer = request => this.client.fetch({
    body: JSON.stringify(marshalRebootServerRequest(request, this.client.settings)),
    headers: jsonContentHeaders$k,
    method: 'POST',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/reboot`
  }, unmarshalServer$1);

  /**
   * Start an Elastic Metal server. Start the server associated with the ID.
   *
   * @param request - The request {@link StartServerRequest}
   * @returns A Promise of Server
   */
  startServer = request => this.client.fetch({
    body: JSON.stringify(marshalStartServerRequest(request, this.client.settings)),
    headers: jsonContentHeaders$k,
    method: 'POST',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/start`
  }, unmarshalServer$1);

  /**
   * Stop an Elastic Metal server. Stop the server associated with the ID. The
   * server remains allocated to your account and all data remains on the local
   * storage of the server.
   *
   * @param request - The request {@link StopServerRequest}
   * @returns A Promise of Server
   */
  stopServer = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$k,
    method: 'POST',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/stop`
  }, unmarshalServer$1);
  pageOfListServerEvents = request => this.client.fetch({
    method: 'GET',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/events`,
    urlParams: urlParams(['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListServerEventsResponse);

  /**
   * List server events. List event (i.e. start/stop/reboot) associated to the
   * server ID.
   *
   * @param request - The request {@link ListServerEventsRequest}
   * @returns A Promise of ListServerEventsResponse
   */
  listServerEvents = request => enrichForPagination('events', this.pageOfListServerEvents, request);

  /**
   * Start BMC access. Start BMC (Baseboard Management Controller) access
   * associated with the ID. The BMC (Baseboard Management Controller) access is
   * available one hour after the installation of the server. You need first to
   * create an option Remote Access. You will find the ID and the price with a
   * call to listOffers
   * (https://developers.scaleway.com/en/products/baremetal/api/#get-78db92).
   * Then add the option
   * https://developers.scaleway.com/en/products/baremetal/api/#post-b14abd.
   * After adding the BMC option, you need to Get Remote Access to get the
   * login/password
   * https://developers.scaleway.com/en/products/baremetal/api/#get-cefc0f. Do
   * not forget to delete the Option after use.
   *
   * @param request - The request {@link StartBMCAccessRequest}
   * @returns A Promise of BMCAccess
   */
  startBMCAccess = request => this.client.fetch({
    body: JSON.stringify(marshalStartBMCAccessRequest(request, this.client.settings)),
    headers: jsonContentHeaders$k,
    method: 'POST',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/bmc-access`
  }, unmarshalBMCAccess);

  /**
   * Get BMC access. Get the BMC (Baseboard Management Controller) access
   * associated with the ID, including the URL and login information needed to
   * connect.
   *
   * @param request - The request {@link GetBMCAccessRequest}
   * @returns A Promise of BMCAccess
   */
  getBMCAccess = request => this.client.fetch({
    method: 'GET',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/bmc-access`
  }, unmarshalBMCAccess);

  /**
   * Stop BMC access. Stop BMC (Baseboard Management Controller) access
   * associated with the ID.
   *
   * @param request - The request {@link StopBMCAccessRequest}
   */
  stopBMCAccess = request => this.client.fetch({
    method: 'DELETE',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/bmc-access`
  });

  /**
   * Update IP. Configure the IP address associated with the server ID and IP
   * ID. You can use this method to set a reverse DNS for an IP address.
   *
   * @param request - The request {@link UpdateIPRequest}
   * @returns A Promise of IP
   */
  updateIP = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateIPRequest$1(request, this.client.settings)),
    headers: jsonContentHeaders$k,
    method: 'PATCH',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/ips/${validatePathParam('ipId', request.ipId)}`
  }, unmarshalIP$1);

  /**
   * Add server option. Add an option, such as Private Networks, to a specific
   * server.
   *
   * @param request - The request {@link AddOptionServerRequest}
   * @returns A Promise of Server
   */
  addOptionServer = request => this.client.fetch({
    body: JSON.stringify(marshalAddOptionServerRequest(request, this.client.settings)),
    headers: jsonContentHeaders$k,
    method: 'POST',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/options/${validatePathParam('optionId', request.optionId)}`
  }, unmarshalServer$1);

  /**
   * Delete server option. Delete an option from a specific server.
   *
   * @param request - The request {@link DeleteOptionServerRequest}
   * @returns A Promise of Server
   */
  deleteOptionServer = request => this.client.fetch({
    method: 'DELETE',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/options/${validatePathParam('optionId', request.optionId)}`
  }, unmarshalServer$1);
  pageOfListOffers = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/offers`,
    urlParams: urlParams(['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['subscription_period', request.subscriptionPeriod ?? 'unknown_subscription_period'])
  }, unmarshalListOffersResponse$1);

  /**
   * List offers. List all available Elastic Metal server configurations.
   *
   * @param request - The request {@link ListOffersRequest}
   * @returns A Promise of ListOffersResponse
   */
  listOffers = (request = {}) => enrichForPagination('offers', this.pageOfListOffers, request);

  /**
   * Get offer. Get details of an offer identified by its offer ID.
   *
   * @param request - The request {@link GetOfferRequest}
   * @returns A Promise of Offer
   */
  getOffer = request => this.client.fetch({
    method: 'GET',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/offers/${validatePathParam('offerId', request.offerId)}`
  }, unmarshalOffer$1);

  /**
   * Get option. Return specific option for the ID.
   *
   * @param request - The request {@link GetOptionRequest}
   * @returns A Promise of Option
   */
  getOption = request => this.client.fetch({
    method: 'GET',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/options/${validatePathParam('optionId', request.optionId)}`
  }, unmarshalOption);
  pageOfListOptions = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/options`,
    urlParams: urlParams(['name', request.name], ['offer_id', request.offerId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListOptionsResponse);

  /**
   * List options. List all options matching with filters.
   *
   * @param request - The request {@link ListOptionsRequest}
   * @returns A Promise of ListOptionsResponse
   */
  listOptions = (request = {}) => enrichForPagination('options', this.pageOfListOptions, request);
  pageOfListSettings = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/settings`,
    urlParams: urlParams(['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId ?? this.client.settings.defaultProjectId])
  }, unmarshalListSettingsResponse);

  /**
   * List all settings. Return all settings for a Project ID.
   *
   * @param request - The request {@link ListSettingsRequest}
   * @returns A Promise of ListSettingsResponse
   */
  listSettings = (request = {}) => enrichForPagination('settings', this.pageOfListSettings, request);

  /**
   * Update setting. Update a setting for a Project ID (enable or disable).
   *
   * @param request - The request {@link UpdateSettingRequest}
   * @returns A Promise of Setting
   */
  updateSetting = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateSettingRequest(request, this.client.settings)),
    headers: jsonContentHeaders$k,
    method: 'PATCH',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/settings/${validatePathParam('settingId', request.settingId)}`
  }, unmarshalSetting);
  pageOfListOS = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/os`,
    urlParams: urlParams(['offer_id', request.offerId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListOSResponse);

  /**
   * List available OSes. List all OSes that are available for installation on
   * Elastic Metal servers.
   *
   * @param request - The request {@link ListOSRequest}
   * @returns A Promise of ListOSResponse
   */
  listOS = (request = {}) => enrichForPagination('os', this.pageOfListOS, request);

  /**
   * Get OS with an ID. Return the specific OS for the ID.
   *
   * @param request - The request {@link GetOSRequest}
   * @returns A Promise of OS
   */
  getOS = request => this.client.fetch({
    method: 'GET',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/os/${validatePathParam('osId', request.osId)}`
  }, unmarshalOS);
};

/** Elastic Metal Private Network API. */
class PrivateNetworkAPI extends API$q {
  /** Lists the available zones of the API. */
  static LOCALITIES = ['fr-par-2'];

  /**
   * Add a server to a Private Network.
   *
   * @param request - The request
   *   {@link PrivateNetworkApiAddServerPrivateNetworkRequest}
   * @returns A Promise of ServerPrivateNetwork
   */
  addServerPrivateNetwork = request => this.client.fetch({
    body: JSON.stringify(marshalPrivateNetworkApiAddServerPrivateNetworkRequest(request, this.client.settings)),
    headers: jsonContentHeaders$k,
    method: 'POST',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/private-networks`
  }, unmarshalServerPrivateNetwork);

  /**
   * Set multiple Private Networks on a server.
   *
   * @param request - The request
   *   {@link PrivateNetworkApiSetServerPrivateNetworksRequest}
   * @returns A Promise of SetServerPrivateNetworksResponse
   */
  setServerPrivateNetworks = request => this.client.fetch({
    body: JSON.stringify(marshalPrivateNetworkApiSetServerPrivateNetworksRequest(request, this.client.settings)),
    headers: jsonContentHeaders$k,
    method: 'PUT',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/private-networks`
  }, unmarshalSetServerPrivateNetworksResponse);
  pageOfListServerPrivateNetworks = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/server-private-networks`,
    urlParams: urlParams(['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['private_network_id', request.privateNetworkId], ['project_id', request.projectId], ['server_id', request.serverId])
  }, unmarshalListServerPrivateNetworksResponse);

  /**
   * List the Private Networks of a server.
   *
   * @param request - The request
   *   {@link PrivateNetworkApiListServerPrivateNetworksRequest}
   * @returns A Promise of ListServerPrivateNetworksResponse
   */
  listServerPrivateNetworks = (request = {}) => enrichForPagination('serverPrivateNetworks', this.pageOfListServerPrivateNetworks, request);

  /**
   * Delete a Private Network.
   *
   * @param request - The request
   *   {@link PrivateNetworkApiDeleteServerPrivateNetworkRequest}
   */
  deleteServerPrivateNetwork = request => this.client.fetch({
    method: 'DELETE',
    path: `/baremetal/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/private-networks/${validatePathParam('privateNetworkId', request.privateNetworkId)}`
  });
}

class BaremetalV1UtilsAPI extends API$n {
  /**
   * Waits for {@link ServerInstall} to be in a final state.
   *
   * @param request - The request {@link GetServerRequest}
   * @param options - The waiting options
   * @returns A Promise of ServerInstall
   */
  waitForServerInstall = (request, options) => tryAtIntervals(async () => {
    const value = await this.getServer(request).then(server => {
      if (!server.install) {
        throw new Error(`Server creation has not begun for server ${request.serverId}`);
      }
      return server.install;
    });
    return {
      done: !SERVER_INSTALL_TRANSIENT_STATUSES.includes(value.status),
      value
    };
  }, createExponentialBackoffStrategy(options?.minDelay ?? 1, options?.maxDelay ?? 30), options?.timeout);
}

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

const CreateServerRequest = {
  description: {
    maxLength: 255
  },
  name: {
    minLength: 1
  }
};
const CreateServerRequestInstall = {
  hostname: {
    maxLength: 255
  },
  password: {
    maxLength: 255
  },
  servicePassword: {
    maxLength: 255
  },
  serviceUser: {
    maxLength: 255
  },
  user: {
    maxLength: 255
  }
};
const InstallServerRequest = {
  hostname: {
    maxLength: 255
  },
  password: {
    maxLength: 255
  },
  servicePassword: {
    maxLength: 255
  },
  serviceUser: {
    maxLength: 255
  },
  user: {
    maxLength: 255
  }
};
const ListOSRequest = {
  page: {
    greaterThan: 0
  },
  pageSize: {
    greaterThan: 0,
    lessThanOrEqual: 100
  }
};
const ListOffersRequest = {
  page: {
    greaterThan: 0
  },
  pageSize: {
    greaterThan: 0,
    lessThanOrEqual: 100
  }
};
const ListOptionsRequest = {
  page: {
    greaterThan: 0
  },
  pageSize: {
    greaterThan: 0,
    lessThanOrEqual: 100
  }
};
const ListServerEventsRequest = {
  page: {
    greaterThan: 0
  },
  pageSize: {
    greaterThan: 0,
    lessThanOrEqual: 100
  }
};
const ListServersRequest = {
  page: {
    greaterThan: 0
  },
  pageSize: {
    greaterThan: 0,
    lessThanOrEqual: 100
  }
};
const ListSettingsRequest = {
  page: {
    greaterThan: 0
  },
  pageSize: {
    greaterThan: 0,
    lessThanOrEqual: 100
  }
};
const UpdateServerRequest = {
  description: {
    maxLength: 255
  },
  name: {
    maxLength: 255
  }
};

var validationRules_gen$4 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  CreateServerRequest: CreateServerRequest,
  CreateServerRequestInstall: CreateServerRequestInstall,
  InstallServerRequest: InstallServerRequest,
  ListOSRequest: ListOSRequest,
  ListOffersRequest: ListOffersRequest,
  ListOptionsRequest: ListOptionsRequest,
  ListServerEventsRequest: ListServerEventsRequest,
  ListServersRequest: ListServersRequest,
  ListSettingsRequest: ListSettingsRequest,
  UpdateServerRequest: UpdateServerRequest
});

var index$q = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: BaremetalV1UtilsAPI,
  PrivateNetworkAPI: PrivateNetworkAPI,
  SERVER_INSTALL_TRANSIENT_STATUSES: SERVER_INSTALL_TRANSIENT_STATUSES,
  SERVER_PRIVATE_NETWORK_TRANSIENT_STATUSES: SERVER_PRIVATE_NETWORK_TRANSIENT_STATUSES,
  SERVER_TRANSIENT_STATUSES: SERVER_TRANSIENT_STATUSES$1,
  ValidationRules: validationRules_gen$4
});

var index$p = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1: index$q
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalGetConsumptionResponseConsumption = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetConsumptionResponseConsumption' failed as data isn't a dictionary.`);
  }
  return {
    category: data.category,
    description: data.description,
    operationPath: data.operation_path,
    projectId: data.project_id,
    value: data.value ? unmarshalMoney(data.value) : undefined
  };
};
const unmarshalInvoice = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Invoice' failed as data isn't a dictionary.`);
  }
  return {
    dueDate: unmarshalDate(data.due_date),
    id: data.id,
    invoiceType: data.invoice_type,
    issuedDate: unmarshalDate(data.issued_date),
    number: data.number,
    startDate: unmarshalDate(data.start_date),
    totalTaxed: data.total_taxed ? unmarshalMoney(data.total_taxed) : undefined,
    totalUntaxed: data.total_untaxed ? unmarshalMoney(data.total_untaxed) : undefined
  };
};
const unmarshalGetConsumptionResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetConsumptionResponse' failed as data isn't a dictionary.`);
  }
  return {
    consumptions: unmarshalArrayOfObject(data.consumptions, unmarshalGetConsumptionResponseConsumption),
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalListInvoicesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListInvoicesResponse' failed as data isn't a dictionary.`);
  }
  return {
    invoices: unmarshalArrayOfObject(data.invoices, unmarshalInvoice),
    totalCount: data.total_count
  };
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
/**
 * Billing API.
 *
 * This API allows you to query your consumption. Billing API.
 */
let API$m = class API extends API$q {
  getConsumption = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/billing/v2alpha1/consumption`,
    urlParams: urlParams(['organization_id', request.organizationId ?? this.client.settings.defaultOrganizationId])
  }, unmarshalGetConsumptionResponse);
  pageOfListInvoices = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/billing/v2alpha1/invoices`,
    urlParams: urlParams(['invoice_type', request.invoiceType ?? 'unknown_type'], ['order_by', request.orderBy ?? 'invoice_number_desc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['started_after', request.startedAfter], ['started_before', request.startedBefore])
  }, unmarshalListInvoicesResponse);
  listInvoices = (request = {}) => enrichForPagination('invoices', this.pageOfListInvoices, request);
  downloadInvoice = request => this.client.fetch({
    method: 'GET',
    path: `/billing/v2alpha1/invoices/${validatePathParam('invoiceId', request.invoiceId)}/download`,
    urlParams: urlParams(['dl', 1], ['file_type', request.fileType ?? 'pdf']),
    responseType: 'blob'
  });
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen$j = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API$m
});

var index$o = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v2alpha1: index_gen$j
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

/** Lists transient statutes of the enum {@link CockpitStatus}. */
const COCKPIT_TRANSIENT_STATUSES = ['creating', 'deleting', 'updating'];

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalContactPointEmail = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ContactPointEmail' failed as data isn't a dictionary.`);
  }
  return {
    to: data.to
  };
};
const unmarshalTokenScopes = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'TokenScopes' failed as data isn't a dictionary.`);
  }
  return {
    queryLogs: data.query_logs,
    queryMetrics: data.query_metrics,
    setupAlerts: data.setup_alerts,
    setupLogsRules: data.setup_logs_rules,
    setupMetricsRules: data.setup_metrics_rules,
    writeLogs: data.write_logs,
    writeMetrics: data.write_metrics
  };
};
const unmarshalCockpitEndpoints = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'CockpitEndpoints' failed as data isn't a dictionary.`);
  }
  return {
    alertmanagerUrl: data.alertmanager_url,
    grafanaUrl: data.grafana_url,
    logsUrl: data.logs_url,
    metricsUrl: data.metrics_url
  };
};
const unmarshalContactPoint = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ContactPoint' failed as data isn't a dictionary.`);
  }
  return {
    email: data.email ? unmarshalContactPointEmail(data.email) : undefined
  };
};
const unmarshalGrafanaUser = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GrafanaUser' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    login: data.login,
    password: data.password,
    role: data.role
  };
};
const unmarshalPlan = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Plan' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    logsIngestionPrice: data.logs_ingestion_price,
    name: data.name,
    retentionLogsInterval: data.retention_logs_interval,
    retentionMetricsInterval: data.retention_metrics_interval,
    retentionPrice: data.retention_price,
    sampleIngestionPrice: data.sample_ingestion_price
  };
};
const unmarshalToken$2 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Token' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    id: data.id,
    name: data.name,
    projectId: data.project_id,
    scopes: data.scopes ? unmarshalTokenScopes(data.scopes) : undefined,
    secretKey: data.secret_key,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalCockpit = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Cockpit' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    endpoints: data.endpoints ? unmarshalCockpitEndpoints(data.endpoints) : undefined,
    managedAlertsEnabled: data.managed_alerts_enabled,
    plan: data.plan ? unmarshalPlan(data.plan) : undefined,
    projectId: data.project_id,
    status: data.status,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalCockpitMetrics = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'CockpitMetrics' failed as data isn't a dictionary.`);
  }
  return {
    timeseries: unmarshalArrayOfObject(data.timeseries, unmarshalTimeSeries)
  };
};
const unmarshalListContactPointsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListContactPointsResponse' failed as data isn't a dictionary.`);
  }
  return {
    contactPoints: unmarshalArrayOfObject(data.contact_points, unmarshalContactPoint),
    hasAdditionalContactPoints: data.has_additional_contact_points,
    hasAdditionalReceivers: data.has_additional_receivers,
    totalCount: data.total_count
  };
};
const unmarshalListGrafanaUsersResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListGrafanaUsersResponse' failed as data isn't a dictionary.`);
  }
  return {
    grafanaUsers: unmarshalArrayOfObject(data.grafana_users, unmarshalGrafanaUser),
    totalCount: data.total_count
  };
};
const unmarshalListPlansResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListPlansResponse' failed as data isn't a dictionary.`);
  }
  return {
    plans: unmarshalArrayOfObject(data.plans, unmarshalPlan),
    totalCount: data.total_count
  };
};
const unmarshalListTokensResponse$2 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListTokensResponse' failed as data isn't a dictionary.`);
  }
  return {
    tokens: unmarshalArrayOfObject(data.tokens, unmarshalToken$2),
    totalCount: data.total_count
  };
};
const unmarshalSelectPlanResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SelectPlanResponse' failed as data isn't a dictionary.`);
  }
  return {};
};
const marshalContactPointEmail = (request, defaults) => ({
  to: request.to
});
const marshalContactPoint = (request, defaults) => ({
  ...resolveOneOf([{
    param: 'email',
    value: request.email ? marshalContactPointEmail(request.email) : undefined
  }])
});
const marshalTokenScopes = (request, defaults) => ({
  query_logs: request.queryLogs,
  query_metrics: request.queryMetrics,
  setup_alerts: request.setupAlerts,
  setup_logs_rules: request.setupLogsRules,
  setup_metrics_rules: request.setupMetricsRules,
  write_logs: request.writeLogs,
  write_metrics: request.writeMetrics
});
const marshalActivateCockpitRequest = (request, defaults) => ({
  project_id: request.projectId ?? defaults.defaultProjectId
});
const marshalCreateContactPointRequest = (request, defaults) => ({
  contact_point: request.contactPoint ? marshalContactPoint(request.contactPoint) : undefined,
  project_id: request.projectId ?? defaults.defaultProjectId
});
const marshalCreateGrafanaUserRequest = (request, defaults) => ({
  login: request.login,
  project_id: request.projectId ?? defaults.defaultProjectId,
  role: request.role ?? 'unknown_role'
});
const marshalCreateTokenRequest$2 = (request, defaults) => ({
  name: request.name || randomName('token'),
  project_id: request.projectId ?? defaults.defaultProjectId,
  scopes: request.scopes ? marshalTokenScopes(request.scopes) : undefined
});
const marshalDeactivateCockpitRequest = (request, defaults) => ({
  project_id: request.projectId ?? defaults.defaultProjectId
});
const marshalDeleteContactPointRequest = (request, defaults) => ({
  contact_point: request.contactPoint ? marshalContactPoint(request.contactPoint) : undefined,
  project_id: request.projectId ?? defaults.defaultProjectId
});
const marshalDeleteGrafanaUserRequest = (request, defaults) => ({
  project_id: request.projectId ?? defaults.defaultProjectId
});
const marshalDisableManagedAlertsRequest = (request, defaults) => ({
  project_id: request.projectId ?? defaults.defaultProjectId
});
const marshalEnableManagedAlertsRequest = (request, defaults) => ({
  project_id: request.projectId ?? defaults.defaultProjectId
});
const marshalResetCockpitGrafanaRequest = (request, defaults) => ({
  project_id: request.projectId ?? defaults.defaultProjectId
});
const marshalResetGrafanaUserPasswordRequest = (request, defaults) => ({
  project_id: request.projectId ?? defaults.defaultProjectId
});
const marshalSelectPlanRequest = (request, defaults) => ({
  plan_id: request.planId,
  project_id: request.projectId ?? defaults.defaultProjectId
});
const marshalTriggerTestAlertRequest = (request, defaults) => ({
  project_id: request.projectId ?? defaults.defaultProjectId
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$j = {
  'Content-Type': 'application/json; charset=utf-8'
};

/**
 * Cockpit API.
 *
 * Cockpit API. Cockpit's API allows you to activate your Cockpit on your
 * Projects. Scaleway's Cockpit stores metrics and logs and provides a dedicated
 * Grafana for dashboarding to visualize them.
 */
let API$l = class API extends API$q {
  /**
   * Activate a Cockpit. Activate the Cockpit of the specified Project ID.
   *
   * @param request - The request {@link ActivateCockpitRequest}
   * @returns A Promise of Cockpit
   */
  activateCockpit = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalActivateCockpitRequest(request, this.client.settings)),
    headers: jsonContentHeaders$j,
    method: 'POST',
    path: `/cockpit/v1beta1/activate`
  }, unmarshalCockpit);

  /**
   * Get a Cockpit. Retrieve the Cockpit of the specified Project ID.
   *
   * @param request - The request {@link GetCockpitRequest}
   * @returns A Promise of Cockpit
   */
  getCockpit = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/cockpit/v1beta1/cockpit`,
    urlParams: urlParams(['project_id', request.projectId ?? this.client.settings.defaultProjectId])
  }, unmarshalCockpit);

  /**
   * Waits for {@link Cockpit} to be in a final state.
   *
   * @param request - The request {@link GetCockpitRequest}
   * @param options - The waiting options
   * @returns A Promise of Cockpit
   */
  waitForCockpit = (request = {}, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!COCKPIT_TRANSIENT_STATUSES.includes(res.status))), this.getCockpit, request, options);

  /**
   * Get Cockpit metrics. Get metrics from your Cockpit with the specified
   * Project ID.
   *
   * @param request - The request {@link GetCockpitMetricsRequest}
   * @returns A Promise of CockpitMetrics
   */
  getCockpitMetrics = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/cockpit/v1beta1/cockpit/metrics`,
    urlParams: urlParams(['end_date', request.endDate], ['metric_name', request.metricName], ['project_id', request.projectId ?? this.client.settings.defaultProjectId], ['start_date', request.startDate])
  }, unmarshalCockpitMetrics);

  /**
   * Deactivate a Cockpit. Deactivate the Cockpit of the specified Project ID.
   *
   * @param request - The request {@link DeactivateCockpitRequest}
   * @returns A Promise of Cockpit
   */
  deactivateCockpit = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalDeactivateCockpitRequest(request, this.client.settings)),
    headers: jsonContentHeaders$j,
    method: 'POST',
    path: `/cockpit/v1beta1/deactivate`
  }, unmarshalCockpit);

  /**
   * Reset a Grafana. Reset your Cockpit's Grafana associated with the specified
   * Project ID.
   *
   * @param request - The request {@link ResetCockpitGrafanaRequest}
   * @returns A Promise of Cockpit
   */
  resetCockpitGrafana = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalResetCockpitGrafanaRequest(request, this.client.settings)),
    headers: jsonContentHeaders$j,
    method: 'POST',
    path: `/cockpit/v1beta1/reset-grafana`
  }, unmarshalCockpit);

  /**
   * Create a token. Create a token associated with the specified Project ID.
   *
   * @param request - The request {@link CreateTokenRequest}
   * @returns A Promise of Token
   */
  createToken = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalCreateTokenRequest$2(request, this.client.settings)),
    headers: jsonContentHeaders$j,
    method: 'POST',
    path: `/cockpit/v1beta1/tokens`
  }, unmarshalToken$2);
  pageOfListTokens = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/cockpit/v1beta1/tokens`,
    urlParams: urlParams(['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId ?? this.client.settings.defaultProjectId])
  }, unmarshalListTokensResponse$2);

  /**
   * List tokens. Get a list of tokens associated with the specified Project ID.
   *
   * @param request - The request {@link ListTokensRequest}
   * @returns A Promise of ListTokensResponse
   */
  listTokens = (request = {}) => enrichForPagination('tokens', this.pageOfListTokens, request);

  /**
   * Get a token. Retrieve the token associated with the specified token ID.
   *
   * @param request - The request {@link GetTokenRequest}
   * @returns A Promise of Token
   */
  getToken = request => this.client.fetch({
    method: 'GET',
    path: `/cockpit/v1beta1/tokens/${validatePathParam('tokenId', request.tokenId)}`
  }, unmarshalToken$2);

  /**
   * Delete a token. Delete the token associated with the specified token ID.
   *
   * @param request - The request {@link DeleteTokenRequest}
   */
  deleteToken = request => this.client.fetch({
    method: 'DELETE',
    path: `/cockpit/v1beta1/tokens/${validatePathParam('tokenId', request.tokenId)}`
  });

  /**
   * Create a contact point. Create a contact point to receive alerts for the
   * default receiver.
   *
   * @param request - The request {@link CreateContactPointRequest}
   * @returns A Promise of ContactPoint
   */
  createContactPoint = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalCreateContactPointRequest(request, this.client.settings)),
    headers: jsonContentHeaders$j,
    method: 'POST',
    path: `/cockpit/v1beta1/contact-points`
  }, unmarshalContactPoint);
  pageOfListContactPoints = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/cockpit/v1beta1/contact-points`,
    urlParams: urlParams(['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId ?? this.client.settings.defaultProjectId])
  }, unmarshalListContactPointsResponse);

  /**
   * List contact points. Get a list of contact points for the Cockpit
   * associated with the specified Project ID.
   *
   * @param request - The request {@link ListContactPointsRequest}
   * @returns A Promise of ListContactPointsResponse
   */
  listContactPoints = (request = {}) => enrichForPagination('contactPoints', this.pageOfListContactPoints, request);

  /**
   * Delete an alert contact point. Delete a contact point for the default
   * receiver.
   *
   * @param request - The request {@link DeleteContactPointRequest}
   */
  deleteContactPoint = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalDeleteContactPointRequest(request, this.client.settings)),
    headers: jsonContentHeaders$j,
    method: 'POST',
    path: `/cockpit/v1beta1/delete-contact-point`
  });

  /**
   * Enable managed alerts. Enable the sending of managed alerts for the
   * specified Project's Cockpit.
   *
   * @param request - The request {@link EnableManagedAlertsRequest}
   */
  enableManagedAlerts = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalEnableManagedAlertsRequest(request, this.client.settings)),
    headers: jsonContentHeaders$j,
    method: 'POST',
    path: `/cockpit/v1beta1/enable-managed-alerts`
  });

  /**
   * Disable managed alerts. Disable the sending of managed alerts for the
   * specified Project's Cockpit.
   *
   * @param request - The request {@link DisableManagedAlertsRequest}
   */
  disableManagedAlerts = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalDisableManagedAlertsRequest(request, this.client.settings)),
    headers: jsonContentHeaders$j,
    method: 'POST',
    path: `/cockpit/v1beta1/disable-managed-alerts`
  });

  /**
   * Trigger a test alert. Trigger a test alert to all of the Cockpit's
   * receivers.
   *
   * @param request - The request {@link TriggerTestAlertRequest}
   */
  triggerTestAlert = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalTriggerTestAlertRequest(request, this.client.settings)),
    headers: jsonContentHeaders$j,
    method: 'POST',
    path: `/cockpit/v1beta1/trigger-test-alert`
  });

  /**
   * Create a Grafana user. Create a Grafana user for your Cockpit's Grafana
   * instance. Make sure you save the automatically-generated password and the
   * Grafana user ID.
   *
   * @param request - The request {@link CreateGrafanaUserRequest}
   * @returns A Promise of GrafanaUser
   */
  createGrafanaUser = request => this.client.fetch({
    body: JSON.stringify(marshalCreateGrafanaUserRequest(request, this.client.settings)),
    headers: jsonContentHeaders$j,
    method: 'POST',
    path: `/cockpit/v1beta1/grafana-users`
  }, unmarshalGrafanaUser);
  pageOfListGrafanaUsers = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/cockpit/v1beta1/grafana-users`,
    urlParams: urlParams(['order_by', request.orderBy ?? 'login_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId ?? this.client.settings.defaultProjectId])
  }, unmarshalListGrafanaUsersResponse);

  /**
   * List Grafana users. Get a list of Grafana users who are able to connect to
   * the Cockpit's Grafana instance.
   *
   * @param request - The request {@link ListGrafanaUsersRequest}
   * @returns A Promise of ListGrafanaUsersResponse
   */
  listGrafanaUsers = (request = {}) => enrichForPagination('grafanaUsers', this.pageOfListGrafanaUsers, request);

  /**
   * Delete a Grafana user. Delete a Grafana user from a Grafana instance,
   * specified by the Cockpit's Project ID and the Grafana user ID.
   *
   * @param request - The request {@link DeleteGrafanaUserRequest}
   */
  deleteGrafanaUser = request => this.client.fetch({
    body: JSON.stringify(marshalDeleteGrafanaUserRequest(request, this.client.settings)),
    headers: jsonContentHeaders$j,
    method: 'POST',
    path: `/cockpit/v1beta1/grafana-users/${validatePathParam('grafanaUserId', request.grafanaUserId)}/delete`
  });

  /**
   * Reset a Grafana user's password. Reset a Grafana user's password specified
   * by the Cockpit's Project ID and the Grafana user ID.
   *
   * @param request - The request {@link ResetGrafanaUserPasswordRequest}
   * @returns A Promise of GrafanaUser
   */
  resetGrafanaUserPassword = request => this.client.fetch({
    body: JSON.stringify(marshalResetGrafanaUserPasswordRequest(request, this.client.settings)),
    headers: jsonContentHeaders$j,
    method: 'POST',
    path: `/cockpit/v1beta1/grafana-users/${validatePathParam('grafanaUserId', request.grafanaUserId)}/reset-password`
  }, unmarshalGrafanaUser);
  pageOfListPlans = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/cockpit/v1beta1/plans`,
    urlParams: urlParams(['order_by', request.orderBy ?? 'name_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListPlansResponse);

  /**
   * List pricing plans. Get a list of all pricing plans available.
   *
   * @param request - The request {@link ListPlansRequest}
   * @returns A Promise of ListPlansResponse
   */
  listPlans = (request = {}) => enrichForPagination('plans', this.pageOfListPlans, request);

  /**
   * Select pricing plan. Select your chosen pricing plan for your Cockpit,
   * specifying the Cockpit's Project ID and the pricing plan's ID in the
   * request.
   *
   * @param request - The request {@link SelectPlanRequest}
   * @returns A Promise of SelectPlanResponse
   */
  selectPlan = request => this.client.fetch({
    body: JSON.stringify(marshalSelectPlanRequest(request, this.client.settings)),
    headers: jsonContentHeaders$j,
    method: 'POST',
    path: `/cockpit/v1beta1/select-plan`
  }, unmarshalSelectPlanResponse);
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen$i = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API$l,
  COCKPIT_TRANSIENT_STATUSES: COCKPIT_TRANSIENT_STATUSES
});

var index$n = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1beta1: index_gen$i
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

/** Lists transient statutes of the enum {@link ContainerStatus}. */
const CONTAINER_TRANSIENT_STATUSES = ['deleting', 'creating', 'pending'];

/** Lists transient statutes of the enum {@link CronStatus}. */
const CRON_TRANSIENT_STATUSES$1 = ['deleting', 'creating', 'pending'];

/** Lists transient statutes of the enum {@link DomainStatus}. */
const DOMAIN_TRANSIENT_STATUSES$3 = ['deleting', 'creating', 'pending'];

/** Lists transient statutes of the enum {@link NamespaceStatus}. */
const NAMESPACE_TRANSIENT_STATUSES$2 = ['deleting', 'creating', 'pending'];

/** Lists transient statutes of the enum {@link TokenStatus}. */
const TOKEN_TRANSIENT_STATUSES$1 = ['deleting', 'creating'];

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalSecretHashedValue$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SecretHashedValue' failed as data isn't a dictionary.`);
  }
  return {
    hashedValue: data.hashed_value,
    key: data.key
  };
};
const unmarshalContainer = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Container' failed as data isn't a dictionary.`);
  }
  return {
    cpuLimit: data.cpu_limit,
    description: data.description,
    domainName: data.domain_name,
    environmentVariables: data.environment_variables,
    errorMessage: data.error_message,
    httpOption: data.http_option,
    id: data.id,
    maxConcurrency: data.max_concurrency,
    maxScale: data.max_scale,
    memoryLimit: data.memory_limit,
    minScale: data.min_scale,
    name: data.name,
    namespaceId: data.namespace_id,
    port: data.port,
    privacy: data.privacy,
    protocol: data.protocol,
    region: data.region,
    registryImage: data.registry_image,
    secretEnvironmentVariables: unmarshalArrayOfObject(data.secret_environment_variables, unmarshalSecretHashedValue$1),
    status: data.status,
    timeout: data.timeout
  };
};
const unmarshalCron$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Cron' failed as data isn't a dictionary.`);
  }
  return {
    args: data.args,
    containerId: data.container_id,
    id: data.id,
    name: data.name,
    schedule: data.schedule,
    status: data.status
  };
};
const unmarshalDomain$3 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Domain' failed as data isn't a dictionary.`);
  }
  return {
    containerId: data.container_id,
    errorMessage: data.error_message,
    hostname: data.hostname,
    id: data.id,
    status: data.status,
    url: data.url
  };
};
const unmarshalLog$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Log' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    level: data.level,
    message: data.message,
    source: data.source,
    stream: data.stream,
    timestamp: unmarshalDate(data.timestamp)
  };
};
const unmarshalNamespace$3 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Namespace' failed as data isn't a dictionary.`);
  }
  return {
    description: data.description,
    environmentVariables: data.environment_variables,
    errorMessage: data.error_message,
    id: data.id,
    name: data.name,
    organizationId: data.organization_id,
    projectId: data.project_id,
    region: data.region,
    registryEndpoint: data.registry_endpoint,
    registryNamespaceId: data.registry_namespace_id,
    secretEnvironmentVariables: unmarshalArrayOfObject(data.secret_environment_variables, unmarshalSecretHashedValue$1),
    status: data.status
  };
};
const unmarshalToken$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Token' failed as data isn't a dictionary.`);
  }
  return {
    containerId: data.container_id,
    description: data.description,
    expiresAt: unmarshalDate(data.expires_at),
    id: data.id,
    namespaceId: data.namespace_id,
    publicKey: data.public_key,
    status: data.status,
    token: data.token
  };
};
const unmarshalListContainersResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListContainersResponse' failed as data isn't a dictionary.`);
  }
  return {
    containers: unmarshalArrayOfObject(data.containers, unmarshalContainer),
    totalCount: data.total_count
  };
};
const unmarshalListCronsResponse$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListCronsResponse' failed as data isn't a dictionary.`);
  }
  return {
    crons: unmarshalArrayOfObject(data.crons, unmarshalCron$1),
    totalCount: data.total_count
  };
};
const unmarshalListDomainsResponse$3 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListDomainsResponse' failed as data isn't a dictionary.`);
  }
  return {
    domains: unmarshalArrayOfObject(data.domains, unmarshalDomain$3),
    totalCount: data.total_count
  };
};
const unmarshalListLogsResponse$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListLogsResponse' failed as data isn't a dictionary.`);
  }
  return {
    logs: unmarshalArrayOfObject(data.logs, unmarshalLog$1),
    totalCount: data.total_count
  };
};
const unmarshalListNamespacesResponse$3 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListNamespacesResponse' failed as data isn't a dictionary.`);
  }
  return {
    namespaces: unmarshalArrayOfObject(data.namespaces, unmarshalNamespace$3),
    totalCount: data.total_count
  };
};
const unmarshalListTokensResponse$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListTokensResponse' failed as data isn't a dictionary.`);
  }
  return {
    tokens: unmarshalArrayOfObject(data.tokens, unmarshalToken$1),
    totalCount: data.total_count
  };
};
const marshalSecret$1 = (request, defaults) => ({
  key: request.key,
  value: request.value
});
const marshalCreateContainerRequest = (request, defaults) => ({
  cpu_limit: request.cpuLimit,
  description: request.description,
  environment_variables: request.environmentVariables,
  http_option: request.httpOption ?? 'unknown_http_option',
  max_concurrency: request.maxConcurrency,
  max_scale: request.maxScale,
  memory_limit: request.memoryLimit,
  min_scale: request.minScale,
  name: request.name,
  namespace_id: request.namespaceId,
  port: request.port,
  privacy: request.privacy ?? 'unknown_privacy',
  protocol: request.protocol ?? 'unknown_protocol',
  registry_image: request.registryImage,
  secret_environment_variables: request.secretEnvironmentVariables ? request.secretEnvironmentVariables.map(elt => marshalSecret$1(elt)) : undefined,
  timeout: request.timeout
});
const marshalCreateCronRequest$1 = (request, defaults) => ({
  args: request.args,
  container_id: request.containerId,
  name: request.name,
  schedule: request.schedule
});
const marshalCreateDomainRequest$2 = (request, defaults) => ({
  container_id: request.containerId,
  hostname: request.hostname
});
const marshalCreateNamespaceRequest$3 = (request, defaults) => ({
  description: request.description,
  environment_variables: request.environmentVariables,
  name: request.name || randomName('cns'),
  project_id: request.projectId ?? defaults.defaultProjectId,
  secret_environment_variables: request.secretEnvironmentVariables ? request.secretEnvironmentVariables.map(elt => marshalSecret$1(elt)) : undefined
});
const marshalCreateTokenRequest$1 = (request, defaults) => ({
  description: request.description,
  expires_at: request.expiresAt,
  ...resolveOneOf([{
    param: 'container_id',
    value: request.containerId
  }, {
    param: 'namespace_id',
    value: request.namespaceId
  }])
});
const marshalUpdateContainerRequest = (request, defaults) => ({
  cpu_limit: request.cpuLimit,
  description: request.description,
  environment_variables: request.environmentVariables,
  http_option: request.httpOption ?? 'unknown_http_option',
  max_concurrency: request.maxConcurrency,
  max_scale: request.maxScale,
  memory_limit: request.memoryLimit,
  min_scale: request.minScale,
  port: request.port,
  privacy: request.privacy ?? 'unknown_privacy',
  protocol: request.protocol ?? 'unknown_protocol',
  redeploy: request.redeploy,
  registry_image: request.registryImage,
  secret_environment_variables: request.secretEnvironmentVariables ? request.secretEnvironmentVariables.map(elt => marshalSecret$1(elt)) : undefined,
  timeout: request.timeout
});
const marshalUpdateCronRequest$1 = (request, defaults) => ({
  args: request.args,
  container_id: request.containerId,
  name: request.name,
  schedule: request.schedule
});
const marshalUpdateNamespaceRequest$3 = (request, defaults) => ({
  description: request.description,
  environment_variables: request.environmentVariables,
  secret_environment_variables: request.secretEnvironmentVariables ? request.secretEnvironmentVariables.map(elt => marshalSecret$1(elt)) : undefined
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$i = {
  'Content-Type': 'application/json; charset=utf-8'
};

/** Serverless Containers API. */
let API$k = class API extends API$q {
  /** Lists the available regions of the API. */
  static LOCALITIES = ['fr-par', 'nl-ams', 'pl-waw'];
  pageOfListNamespaces = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/namespaces`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListNamespacesResponse$3);

  /**
   * List all your namespaces. List all namespaces in a specified region.
   *
   * @param request - The request {@link ListNamespacesRequest}
   * @returns A Promise of ListNamespacesResponse
   */
  listNamespaces = (request = {}) => enrichForPagination('namespaces', this.pageOfListNamespaces, request);

  /**
   * Get a namespace. Get the namespace associated with the specified ID.
   *
   * @param request - The request {@link GetNamespaceRequest}
   * @returns A Promise of Namespace
   */
  getNamespace = request => this.client.fetch({
    method: 'GET',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/namespaces/${validatePathParam('namespaceId', request.namespaceId)}`
  }, unmarshalNamespace$3);

  /**
   * Waits for {@link Namespace} to be in a final state.
   *
   * @param request - The request {@link GetNamespaceRequest}
   * @param options - The waiting options
   * @returns A Promise of Namespace
   */
  waitForNamespace = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!NAMESPACE_TRANSIENT_STATUSES$2.includes(res.status))), this.getNamespace, request, options);

  /**
   * Create a new namespace. Create a new namespace in a specified region.
   *
   * @param request - The request {@link CreateNamespaceRequest}
   * @returns A Promise of Namespace
   */
  createNamespace = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalCreateNamespaceRequest$3(request, this.client.settings)),
    headers: jsonContentHeaders$i,
    method: 'POST',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/namespaces`
  }, unmarshalNamespace$3);

  /**
   * Update an existing namespace. Update the space associated with the
   * specified ID.
   *
   * @param request - The request {@link UpdateNamespaceRequest}
   * @returns A Promise of Namespace
   */
  updateNamespace = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateNamespaceRequest$3(request, this.client.settings)),
    headers: jsonContentHeaders$i,
    method: 'PATCH',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/namespaces/${validatePathParam('namespaceId', request.namespaceId)}`
  }, unmarshalNamespace$3);

  /**
   * Delete an existing namespace. Delete the namespace associated with the
   * specified ID.
   *
   * @param request - The request {@link DeleteNamespaceRequest}
   * @returns A Promise of Namespace
   */
  deleteNamespace = request => this.client.fetch({
    method: 'DELETE',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/namespaces/${validatePathParam('namespaceId', request.namespaceId)}`
  }, unmarshalNamespace$3);
  pageOfListContainers = request => this.client.fetch({
    method: 'GET',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/containers`,
    urlParams: urlParams(['name', request.name], ['namespace_id', request.namespaceId], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListContainersResponse);

  /**
   * List all your containers. List all containers for a specified region.
   *
   * @param request - The request {@link ListContainersRequest}
   * @returns A Promise of ListContainersResponse
   */
  listContainers = request => enrichForPagination('containers', this.pageOfListContainers, request);

  /**
   * Get a container. Get the container associated with the specified ID.
   *
   * @param request - The request {@link GetContainerRequest}
   * @returns A Promise of Container
   */
  getContainer = request => this.client.fetch({
    method: 'GET',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/containers/${validatePathParam('containerId', request.containerId)}`
  }, unmarshalContainer);

  /**
   * Waits for {@link Container} to be in a final state.
   *
   * @param request - The request {@link GetContainerRequest}
   * @param options - The waiting options
   * @returns A Promise of Container
   */
  waitForContainer = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!CONTAINER_TRANSIENT_STATUSES.includes(res.status))), this.getContainer, request, options);

  /**
   * Create a new container. Create a new container in the specified region.
   *
   * @param request - The request {@link CreateContainerRequest}
   * @returns A Promise of Container
   */
  createContainer = request => this.client.fetch({
    body: JSON.stringify(marshalCreateContainerRequest(request, this.client.settings)),
    headers: jsonContentHeaders$i,
    method: 'POST',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/containers`
  }, unmarshalContainer);

  /**
   * Update an existing container. Update the container associated with the
   * specified ID.
   *
   * @param request - The request {@link UpdateContainerRequest}
   * @returns A Promise of Container
   */
  updateContainer = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateContainerRequest(request, this.client.settings)),
    headers: jsonContentHeaders$i,
    method: 'PATCH',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/containers/${validatePathParam('containerId', request.containerId)}`
  }, unmarshalContainer);

  /**
   * Delete a container. Delete the container associated with the specified ID.
   *
   * @param request - The request {@link DeleteContainerRequest}
   * @returns A Promise of Container
   */
  deleteContainer = request => this.client.fetch({
    method: 'DELETE',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/containers/${validatePathParam('containerId', request.containerId)}`
  }, unmarshalContainer);

  /**
   * Deploy a container. Deploy a container associated with the specified ID.
   *
   * @param request - The request {@link DeployContainerRequest}
   * @returns A Promise of Container
   */
  deployContainer = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$i,
    method: 'POST',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/containers/${validatePathParam('containerId', request.containerId)}/deploy`
  }, unmarshalContainer);
  pageOfListCrons = request => this.client.fetch({
    method: 'GET',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/crons`,
    urlParams: urlParams(['container_id', request.containerId], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListCronsResponse$1);

  /**
   * List all your crons.
   *
   * @param request - The request {@link ListCronsRequest}
   * @returns A Promise of ListCronsResponse
   */
  listCrons = request => enrichForPagination('crons', this.pageOfListCrons, request);

  /**
   * Get a cron. Get the cron associated with the specified ID.
   *
   * @param request - The request {@link GetCronRequest}
   * @returns A Promise of Cron
   */
  getCron = request => this.client.fetch({
    method: 'GET',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/crons/${validatePathParam('cronId', request.cronId)}`
  }, unmarshalCron$1);

  /**
   * Waits for {@link Cron} to be in a final state.
   *
   * @param request - The request {@link GetCronRequest}
   * @param options - The waiting options
   * @returns A Promise of Cron
   */
  waitForCron = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!CRON_TRANSIENT_STATUSES$1.includes(res.status))), this.getCron, request, options);

  /**
   * Create a new cron.
   *
   * @param request - The request {@link CreateCronRequest}
   * @returns A Promise of Cron
   */
  createCron = request => this.client.fetch({
    body: JSON.stringify(marshalCreateCronRequest$1(request, this.client.settings)),
    headers: jsonContentHeaders$i,
    method: 'POST',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/crons`
  }, unmarshalCron$1);

  /**
   * Update an existing cron. Update the cron associated with the specified ID.
   *
   * @param request - The request {@link UpdateCronRequest}
   * @returns A Promise of Cron
   */
  updateCron = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateCronRequest$1(request, this.client.settings)),
    headers: jsonContentHeaders$i,
    method: 'PATCH',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/crons/${validatePathParam('cronId', request.cronId)}`
  }, unmarshalCron$1);

  /**
   * Delete an existing cron. Delete the cron associated with the specified ID.
   *
   * @param request - The request {@link DeleteCronRequest}
   * @returns A Promise of Cron
   */
  deleteCron = request => this.client.fetch({
    method: 'DELETE',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/crons/${validatePathParam('cronId', request.cronId)}`
  }, unmarshalCron$1);
  pageOfListLogs = request => this.client.fetch({
    method: 'GET',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/containers/${validatePathParam('containerId', request.containerId)}/logs`,
    urlParams: urlParams(['order_by', request.orderBy ?? 'timestamp_desc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListLogsResponse$1);

  /**
   * List your container logs. List the logs of the container with the specified
   * ID.
   *
   * @param request - The request {@link ListLogsRequest}
   * @returns A Promise of ListLogsResponse
   */
  listLogs = request => enrichForPagination('logs', this.pageOfListLogs, request);
  pageOfListDomains = request => this.client.fetch({
    method: 'GET',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/domains`,
    urlParams: urlParams(['container_id', request.containerId], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListDomainsResponse$3);

  /**
   * List all domain name bindings. List all domain name bindings in a specified
   * region.
   *
   * @param request - The request {@link ListDomainsRequest}
   * @returns A Promise of ListDomainsResponse
   */
  listDomains = request => enrichForPagination('domains', this.pageOfListDomains, request);

  /**
   * Get a domain name binding. Get a domain name binding for the container with
   * the specified ID.
   *
   * @param request - The request {@link GetDomainRequest}
   * @returns A Promise of Domain
   */
  getDomain = request => this.client.fetch({
    method: 'GET',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/domains/${validatePathParam('domainId', request.domainId)}`
  }, unmarshalDomain$3);

  /**
   * Waits for {@link Domain} to be in a final state.
   *
   * @param request - The request {@link GetDomainRequest}
   * @param options - The waiting options
   * @returns A Promise of Domain
   */
  waitForDomain = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!DOMAIN_TRANSIENT_STATUSES$3.includes(res.status))), this.getDomain, request, options);

  /**
   * Create a domain name binding. Create a domain name binding for the
   * container with the specified ID.
   *
   * @param request - The request {@link CreateDomainRequest}
   * @returns A Promise of Domain
   */
  createDomain = request => this.client.fetch({
    body: JSON.stringify(marshalCreateDomainRequest$2(request, this.client.settings)),
    headers: jsonContentHeaders$i,
    method: 'POST',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/domains`
  }, unmarshalDomain$3);

  /**
   * Delete a domain name binding. Delete the domain name binding with the
   * specific ID.
   *
   * @param request - The request {@link DeleteDomainRequest}
   * @returns A Promise of Domain
   */
  deleteDomain = request => this.client.fetch({
    method: 'DELETE',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/domains/${validatePathParam('domainId', request.domainId)}`
  }, unmarshalDomain$3);

  /**
   * @deprecated
   * @param request - The request {@link IssueJWTRequest}
   * @returns A Promise of Token
   */
  issueJWT = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/issue-jwt`,
    urlParams: urlParams(['expires_at', request.expiresAt], ...Object.entries(resolveOneOf([{
      param: 'container_id',
      value: request.containerId
    }, {
      param: 'namespace_id',
      value: request.namespaceId
    }])))
  }, unmarshalToken$1);

  /**
   * Create a new revocable token.
   *
   * @param request - The request {@link CreateTokenRequest}
   * @returns A Promise of Token
   */
  createToken = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalCreateTokenRequest$1(request, this.client.settings)),
    headers: jsonContentHeaders$i,
    method: 'POST',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/tokens`
  }, unmarshalToken$1);

  /**
   * Get a token. Get a token with a specified ID.
   *
   * @param request - The request {@link GetTokenRequest}
   * @returns A Promise of Token
   */
  getToken = request => this.client.fetch({
    method: 'GET',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/tokens/${validatePathParam('tokenId', request.tokenId)}`
  }, unmarshalToken$1);

  /**
   * Waits for {@link Token} to be in a final state.
   *
   * @param request - The request {@link GetTokenRequest}
   * @param options - The waiting options
   * @returns A Promise of Token
   */
  waitForToken = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!TOKEN_TRANSIENT_STATUSES$1.includes(res.status))), this.getToken, request, options);
  pageOfListTokens = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/tokens`,
    urlParams: urlParams(['container_id', request.containerId], ['namespace_id', request.namespaceId], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListTokensResponse$1);

  /**
   * List all tokens. List all tokens belonging to a specified Organization or
   * Project.
   *
   * @param request - The request {@link ListTokensRequest}
   * @returns A Promise of ListTokensResponse
   */
  listTokens = (request = {}) => enrichForPagination('tokens', this.pageOfListTokens, request);

  /**
   * Delete a token. Delete a token with a specified ID.
   *
   * @param request - The request {@link DeleteTokenRequest}
   * @returns A Promise of Token
   */
  deleteToken = request => this.client.fetch({
    method: 'DELETE',
    path: `/containers/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/tokens/${validatePathParam('tokenId', request.tokenId)}`
  }, unmarshalToken$1);
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen$h = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API$k,
  CONTAINER_TRANSIENT_STATUSES: CONTAINER_TRANSIENT_STATUSES,
  CRON_TRANSIENT_STATUSES: CRON_TRANSIENT_STATUSES$1,
  DOMAIN_TRANSIENT_STATUSES: DOMAIN_TRANSIENT_STATUSES$3,
  NAMESPACE_TRANSIENT_STATUSES: NAMESPACE_TRANSIENT_STATUSES$2,
  TOKEN_TRANSIENT_STATUSES: TOKEN_TRANSIENT_STATUSES$1
});

var index$m = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1beta1: index_gen$h
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

/** Lists transient statutes of the enum {@link DNSZoneStatus}. */
const DNS_ZONE_TRANSIENT_STATUSES = ['pending'];

/** Lists transient statutes of the enum {@link DomainFeatureStatus}. */
const DOMAIN_FEATURE_TRANSIENT_STATUSES = ['enabling', 'disabling'];

/**
 * Lists transient statutes of the enum
 * {@link DomainRegistrationStatusTransferStatus}.
 */
const DOMAIN_REGISTRATION_STATUS_TRANSFER_TRANSIENT_STATUSES = ['pending', 'processing'];

/** Lists transient statutes of the enum {@link DomainStatus}. */
const DOMAIN_TRANSIENT_STATUSES$2 = ['creating', 'renewing', 'xfering', 'expiring', 'updating', 'checking', 'deleting'];

/** Lists transient statutes of the enum {@link HostStatus}. */
const HOST_TRANSIENT_STATUSES = ['updating', 'deleting'];

/** Lists transient statutes of the enum {@link SSLCertificateStatus}. */
const SSL_CERTIFICATE_TRANSIENT_STATUSES = ['pending'];

/** Lists transient statutes of the enum {@link TaskStatus}. */
const TASK_TRANSIENT_STATUSES$1 = ['pending'];

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalDomainRecordGeoIPConfigMatch = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DomainRecordGeoIPConfigMatch' failed as data isn't a dictionary.`);
  }
  return {
    continents: data.continents,
    countries: data.countries,
    data: data.data
  };
};
const unmarshalDomainRecordViewConfigView = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DomainRecordViewConfigView' failed as data isn't a dictionary.`);
  }
  return {
    data: data.data,
    subnet: data.subnet
  };
};
const unmarshalDomainRecordWeightedConfigWeightedIP = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DomainRecordWeightedConfigWeightedIP' failed as data isn't a dictionary.`);
  }
  return {
    ip: data.ip,
    weight: data.weight
  };
};
const unmarshalContactExtensionFRAssociationInfo = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ContactExtensionFRAssociationInfo' failed as data isn't a dictionary.`);
  }
  return {
    publicationJo: unmarshalDate(data.publication_jo),
    publicationJoPage: data.publication_jo_page
  };
};
const unmarshalContactExtensionFRCodeAuthAfnicInfo = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ContactExtensionFRCodeAuthAfnicInfo' failed as data isn't a dictionary.`);
  }
  return {
    codeAuthAfnic: data.code_auth_afnic
  };
};
const unmarshalContactExtensionFRDunsInfo = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ContactExtensionFRDunsInfo' failed as data isn't a dictionary.`);
  }
  return {
    dunsId: data.duns_id,
    localId: data.local_id
  };
};
const unmarshalContactExtensionFRIndividualInfo = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ContactExtensionFRIndividualInfo' failed as data isn't a dictionary.`);
  }
  return {
    whoisOptIn: data.whois_opt_in
  };
};
const unmarshalContactExtensionFRTrademarkInfo = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ContactExtensionFRTrademarkInfo' failed as data isn't a dictionary.`);
  }
  return {
    trademarkInpi: data.trademark_inpi
  };
};
const unmarshalDSRecordPublicKey = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DSRecordPublicKey' failed as data isn't a dictionary.`);
  }
  return {
    key: data.key
  };
};
const unmarshalDomainRecordGeoIPConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DomainRecordGeoIPConfig' failed as data isn't a dictionary.`);
  }
  return {
    default: data.default,
    matches: unmarshalArrayOfObject(data.matches, unmarshalDomainRecordGeoIPConfigMatch)
  };
};
const unmarshalDomainRecordHTTPServiceConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DomainRecordHTTPServiceConfig' failed as data isn't a dictionary.`);
  }
  return {
    ips: data.ips,
    mustContain: data.must_contain,
    strategy: data.strategy,
    url: data.url,
    userAgent: data.user_agent
  };
};
const unmarshalDomainRecordViewConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DomainRecordViewConfig' failed as data isn't a dictionary.`);
  }
  return {
    views: unmarshalArrayOfObject(data.views, unmarshalDomainRecordViewConfigView)
  };
};
const unmarshalDomainRecordWeightedConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DomainRecordWeightedConfig' failed as data isn't a dictionary.`);
  }
  return {
    weightedIps: unmarshalArrayOfObject(data.weighted_ips, unmarshalDomainRecordWeightedConfigWeightedIP)
  };
};
const unmarshalContactExtensionEU = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ContactExtensionEU' failed as data isn't a dictionary.`);
  }
  return {
    europeanCitizenship: data.european_citizenship
  };
};
const unmarshalContactExtensionFR = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ContactExtensionFR' failed as data isn't a dictionary.`);
  }
  return {
    associationInfo: data.association_info ? unmarshalContactExtensionFRAssociationInfo(data.association_info) : undefined,
    codeAuthAfnicInfo: data.code_auth_afnic_info ? unmarshalContactExtensionFRCodeAuthAfnicInfo(data.code_auth_afnic_info) : undefined,
    dunsInfo: data.duns_info ? unmarshalContactExtensionFRDunsInfo(data.duns_info) : undefined,
    individualInfo: data.individual_info ? unmarshalContactExtensionFRIndividualInfo(data.individual_info) : undefined,
    mode: data.mode,
    trademarkInfo: data.trademark_info ? unmarshalContactExtensionFRTrademarkInfo(data.trademark_info) : undefined
  };
};
const unmarshalContactExtensionNL = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ContactExtensionNL' failed as data isn't a dictionary.`);
  }
  return {
    legalForm: data.legal_form,
    legalFormRegistrationNumber: data.legal_form_registration_number
  };
};
const unmarshalContactQuestion = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ContactQuestion' failed as data isn't a dictionary.`);
  }
  return {
    answer: data.answer,
    question: data.question
  };
};
const unmarshalDSRecordDigest = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DSRecordDigest' failed as data isn't a dictionary.`);
  }
  return {
    digest: data.digest,
    publicKey: data.public_key ? unmarshalDSRecordPublicKey(data.public_key) : undefined,
    type: data.type
  };
};
const unmarshalDomainRecord = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DomainRecord' failed as data isn't a dictionary.`);
  }
  return {
    comment: data.comment,
    data: data.data,
    geoIpConfig: data.geo_ip_config ? unmarshalDomainRecordGeoIPConfig(data.geo_ip_config) : undefined,
    httpServiceConfig: data.http_service_config ? unmarshalDomainRecordHTTPServiceConfig(data.http_service_config) : undefined,
    id: data.id,
    name: data.name,
    priority: data.priority,
    ttl: data.ttl,
    type: data.type,
    viewConfig: data.view_config ? unmarshalDomainRecordViewConfig(data.view_config) : undefined,
    weightedConfig: data.weighted_config ? unmarshalDomainRecordWeightedConfig(data.weighted_config) : undefined
  };
};
const unmarshalRecordIdentifier = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'RecordIdentifier' failed as data isn't a dictionary.`);
  }
  return {
    data: data.data,
    name: data.name,
    ttl: data.ttl,
    type: data.type
  };
};
const unmarshalTldOffer = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'TldOffer' failed as data isn't a dictionary.`);
  }
  return {
    action: data.action,
    operationPath: data.operation_path,
    price: data.price ? unmarshalMoney(data.price) : undefined
  };
};
const unmarshalContact = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Contact' failed as data isn't a dictionary.`);
  }
  return {
    addressLine1: data.address_line_1,
    addressLine2: data.address_line_2,
    city: data.city,
    companyIdentificationCode: data.company_identification_code,
    companyName: data.company_name,
    country: data.country,
    email: data.email,
    emailAlt: data.email_alt,
    emailStatus: data.email_status,
    extensionEu: data.extension_eu ? unmarshalContactExtensionEU(data.extension_eu) : undefined,
    extensionFr: data.extension_fr ? unmarshalContactExtensionFR(data.extension_fr) : undefined,
    extensionNl: data.extension_nl ? unmarshalContactExtensionNL(data.extension_nl) : undefined,
    faxNumber: data.fax_number,
    firstname: data.firstname,
    id: data.id,
    lang: data.lang,
    lastname: data.lastname,
    legalForm: data.legal_form,
    phoneNumber: data.phone_number,
    questions: unmarshalArrayOfObject(data.questions, unmarshalContactQuestion, false),
    resale: data.resale,
    state: data.state,
    vatIdentificationCode: data.vat_identification_code,
    whoisOptIn: data.whois_opt_in,
    zip: data.zip
  };
};
const unmarshalContactRolesRoles = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ContactRolesRoles' failed as data isn't a dictionary.`);
  }
  return {
    isAdministrative: data.is_administrative,
    isOwner: data.is_owner,
    isTechnical: data.is_technical
  };
};
const unmarshalDSRecord = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DSRecord' failed as data isn't a dictionary.`);
  }
  return {
    algorithm: data.algorithm,
    digest: data.digest ? unmarshalDSRecordDigest(data.digest) : undefined,
    keyId: data.key_id,
    publicKey: data.public_key ? unmarshalDSRecordPublicKey(data.public_key) : undefined
  };
};
const unmarshalDomainRegistrationStatusExternalDomain = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DomainRegistrationStatusExternalDomain' failed as data isn't a dictionary.`);
  }
  return {
    validationToken: data.validation_token
  };
};
const unmarshalDomainRegistrationStatusTransfer = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DomainRegistrationStatusTransfer' failed as data isn't a dictionary.`);
  }
  return {
    status: data.status,
    voteCurrentOwner: data.vote_current_owner,
    voteNewOwner: data.vote_new_owner
  };
};
const unmarshalRecordChangeAdd = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'RecordChangeAdd' failed as data isn't a dictionary.`);
  }
  return {
    records: unmarshalArrayOfObject(data.records, unmarshalDomainRecord)
  };
};
const unmarshalRecordChangeClear = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'RecordChangeClear' failed as data isn't a dictionary.`);
  }
  return {};
};
const unmarshalRecordChangeDelete = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'RecordChangeDelete' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    idFields: data.id_fields ? unmarshalRecordIdentifier(data.id_fields) : undefined
  };
};
const unmarshalRecordChangeSet = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'RecordChangeSet' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    idFields: data.id_fields ? unmarshalRecordIdentifier(data.id_fields) : undefined,
    records: unmarshalArrayOfObject(data.records, unmarshalDomainRecord)
  };
};
const unmarshalTld = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Tld' failed as data isn't a dictionary.`);
  }
  return {
    dnssecSupport: data.dnssec_support,
    durationInYearsMax: data.duration_in_years_max,
    durationInYearsMin: data.duration_in_years_min,
    idnSupport: data.idn_support,
    name: data.name,
    offers: unmarshalMapOfObject(data.offers, unmarshalTldOffer),
    specifications: data.specifications
  };
};
const unmarshalAvailableDomain = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'AvailableDomain' failed as data isn't a dictionary.`);
  }
  return {
    available: data.available,
    domain: data.domain,
    tld: data.tld ? unmarshalTld(data.tld) : undefined
  };
};
const unmarshalCheckContactsCompatibilityResponseContactCheckResult = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'CheckContactsCompatibilityResponseContactCheckResult' failed as data isn't a dictionary.`);
  }
  return {
    compatible: data.compatible,
    errorMessage: data.error_message
  };
};
const unmarshalContactRoles = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ContactRoles' failed as data isn't a dictionary.`);
  }
  return {
    contact: data.contact ? unmarshalContact(data.contact) : undefined,
    roles: unmarshalMapOfObject(data.roles, unmarshalContactRolesRoles)
  };
};
const unmarshalDNSZone = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DNSZone' failed as data isn't a dictionary.`);
  }
  return {
    domain: data.domain,
    message: data.message,
    ns: data.ns,
    nsDefault: data.ns_default,
    nsMaster: data.ns_master,
    projectId: data.project_id,
    status: data.status,
    subdomain: data.subdomain,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalDNSZoneVersion = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DNSZoneVersion' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    id: data.id
  };
};
const unmarshalDomainDNSSEC = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DomainDNSSEC' failed as data isn't a dictionary.`);
  }
  return {
    dsRecords: unmarshalArrayOfObject(data.ds_records, unmarshalDSRecord),
    status: data.status
  };
};
const unmarshalDomainSummary = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DomainSummary' failed as data isn't a dictionary.`);
  }
  return {
    autoRenewStatus: data.auto_renew_status,
    dnssecStatus: data.dnssec_status,
    domain: data.domain,
    eppCode: data.epp_code,
    expiredAt: unmarshalDate(data.expired_at),
    externalDomainRegistrationStatus: data.external_domain_registration_status ? unmarshalDomainRegistrationStatusExternalDomain(data.external_domain_registration_status) : undefined,
    isExternal: data.is_external,
    organizationId: data.organization_id,
    projectId: data.project_id,
    registrar: data.registrar,
    status: data.status,
    transferRegistrationStatus: data.transfer_registration_status ? unmarshalDomainRegistrationStatusTransfer(data.transfer_registration_status) : undefined,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalHost = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Host' failed as data isn't a dictionary.`);
  }
  return {
    domain: data.domain,
    ips: data.ips,
    name: data.name,
    status: data.status
  };
};
const unmarshalNameserver$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Nameserver' failed as data isn't a dictionary.`);
  }
  return {
    ip: data.ip,
    name: data.name
  };
};
const unmarshalRecordChange = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'RecordChange' failed as data isn't a dictionary.`);
  }
  return {
    add: data.add ? unmarshalRecordChangeAdd(data.add) : undefined,
    clear: data.clear ? unmarshalRecordChangeClear(data.clear) : undefined,
    delete: data.delete ? unmarshalRecordChangeDelete(data.delete) : undefined,
    set: data.set ? unmarshalRecordChangeSet(data.set) : undefined
  };
};
const unmarshalRenewableDomain = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'RenewableDomain' failed as data isn't a dictionary.`);
  }
  return {
    domain: data.domain,
    estimatedDeleteAt: unmarshalDate(data.estimated_delete_at),
    expiredAt: unmarshalDate(data.expired_at),
    limitRedemptionAt: unmarshalDate(data.limit_redemption_at),
    limitRenewAt: unmarshalDate(data.limit_renew_at),
    organizationId: data.organization_id,
    projectId: data.project_id,
    renewableDurationInYears: data.renewable_duration_in_years,
    status: data.status,
    tld: data.tld ? unmarshalTld(data.tld) : undefined
  };
};
const unmarshalSSLCertificate = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SSLCertificate' failed as data isn't a dictionary.`);
  }
  return {
    alternativeDnsZones: data.alternative_dns_zones,
    certificateChain: data.certificate_chain,
    createdAt: unmarshalDate(data.created_at),
    dnsZone: data.dns_zone,
    expiredAt: unmarshalDate(data.expired_at),
    privateKey: data.private_key,
    status: data.status
  };
};
const unmarshalTask$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Task' failed as data isn't a dictionary.`);
  }
  return {
    domain: data.domain,
    id: data.id,
    message: data.message,
    organizationId: data.organization_id,
    projectId: data.project_id,
    startedAt: unmarshalDate(data.started_at),
    status: data.status,
    type: data.type,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalCheckContactsCompatibilityResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'CheckContactsCompatibilityResponse' failed as data isn't a dictionary.`);
  }
  return {
    administrativeCheckResult: data.administrative_check_result ? unmarshalCheckContactsCompatibilityResponseContactCheckResult(data.administrative_check_result) : undefined,
    compatible: data.compatible,
    ownerCheckResult: data.owner_check_result ? unmarshalCheckContactsCompatibilityResponseContactCheckResult(data.owner_check_result) : undefined,
    technicalCheckResult: data.technical_check_result ? unmarshalCheckContactsCompatibilityResponseContactCheckResult(data.technical_check_result) : undefined
  };
};
const unmarshalClearDNSZoneRecordsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ClearDNSZoneRecordsResponse' failed as data isn't a dictionary.`);
  }
  return {};
};
const unmarshalDeleteDNSZoneResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DeleteDNSZoneResponse' failed as data isn't a dictionary.`);
  }
  return {};
};
const unmarshalDeleteExternalDomainResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DeleteExternalDomainResponse' failed as data isn't a dictionary.`);
  }
  return {};
};
const unmarshalDeleteSSLCertificateResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DeleteSSLCertificateResponse' failed as data isn't a dictionary.`);
  }
  return {};
};
const unmarshalDomain$2 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Domain' failed as data isn't a dictionary.`);
  }
  return {
    administrativeContact: data.administrative_contact ? unmarshalContact(data.administrative_contact) : undefined,
    autoRenewStatus: data.auto_renew_status,
    dnssec: data.dnssec ? unmarshalDomainDNSSEC(data.dnssec) : undefined,
    dnsZones: unmarshalArrayOfObject(data.dns_zones, unmarshalDNSZone),
    domain: data.domain,
    eppCode: data.epp_code,
    expiredAt: unmarshalDate(data.expired_at),
    externalDomainRegistrationStatus: data.external_domain_registration_status ? unmarshalDomainRegistrationStatusExternalDomain(data.external_domain_registration_status) : undefined,
    isExternal: data.is_external,
    organizationId: data.organization_id,
    ownerContact: data.owner_contact ? unmarshalContact(data.owner_contact) : undefined,
    projectId: data.project_id,
    registrar: data.registrar,
    status: data.status,
    technicalContact: data.technical_contact ? unmarshalContact(data.technical_contact) : undefined,
    tld: data.tld ? unmarshalTld(data.tld) : undefined,
    transferRegistrationStatus: data.transfer_registration_status ? unmarshalDomainRegistrationStatusTransfer(data.transfer_registration_status) : undefined,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalGetDNSZoneTsigKeyResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetDNSZoneTsigKeyResponse' failed as data isn't a dictionary.`);
  }
  return {
    algorithm: data.algorithm,
    key: data.key,
    name: data.name
  };
};
const unmarshalGetDNSZoneVersionDiffResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetDNSZoneVersionDiffResponse' failed as data isn't a dictionary.`);
  }
  return {
    changes: unmarshalArrayOfObject(data.changes, unmarshalRecordChange)
  };
};
const unmarshalGetDomainAuthCodeResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetDomainAuthCodeResponse' failed as data isn't a dictionary.`);
  }
  return {
    authCode: data.auth_code
  };
};
const unmarshalImportProviderDNSZoneResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ImportProviderDNSZoneResponse' failed as data isn't a dictionary.`);
  }
  return {
    records: unmarshalArrayOfObject(data.records, unmarshalDomainRecord)
  };
};
const unmarshalImportRawDNSZoneResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ImportRawDNSZoneResponse' failed as data isn't a dictionary.`);
  }
  return {
    records: unmarshalArrayOfObject(data.records, unmarshalDomainRecord)
  };
};
const unmarshalListContactsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListContactsResponse' failed as data isn't a dictionary.`);
  }
  return {
    contacts: unmarshalArrayOfObject(data.contacts, unmarshalContactRoles),
    totalCount: data.total_count
  };
};
const unmarshalListDNSZoneNameserversResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListDNSZoneNameserversResponse' failed as data isn't a dictionary.`);
  }
  return {
    ns: unmarshalArrayOfObject(data.ns, unmarshalNameserver$1)
  };
};
const unmarshalListDNSZoneRecordsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListDNSZoneRecordsResponse' failed as data isn't a dictionary.`);
  }
  return {
    records: unmarshalArrayOfObject(data.records, unmarshalDomainRecord),
    totalCount: data.total_count
  };
};
const unmarshalListDNSZoneVersionRecordsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListDNSZoneVersionRecordsResponse' failed as data isn't a dictionary.`);
  }
  return {
    records: unmarshalArrayOfObject(data.records, unmarshalDomainRecord),
    totalCount: data.total_count
  };
};
const unmarshalListDNSZoneVersionsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListDNSZoneVersionsResponse' failed as data isn't a dictionary.`);
  }
  return {
    totalCount: data.total_count,
    versions: unmarshalArrayOfObject(data.versions, unmarshalDNSZoneVersion)
  };
};
const unmarshalListDNSZonesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListDNSZonesResponse' failed as data isn't a dictionary.`);
  }
  return {
    dnsZones: unmarshalArrayOfObject(data.dns_zones, unmarshalDNSZone),
    totalCount: data.total_count
  };
};
const unmarshalListDomainHostsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListDomainHostsResponse' failed as data isn't a dictionary.`);
  }
  return {
    hosts: unmarshalArrayOfObject(data.hosts, unmarshalHost),
    totalCount: data.total_count
  };
};
const unmarshalListDomainsResponse$2 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListDomainsResponse' failed as data isn't a dictionary.`);
  }
  return {
    domains: unmarshalArrayOfObject(data.domains, unmarshalDomainSummary),
    totalCount: data.total_count
  };
};
const unmarshalListRenewableDomainsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListRenewableDomainsResponse' failed as data isn't a dictionary.`);
  }
  return {
    domains: unmarshalArrayOfObject(data.domains, unmarshalRenewableDomain),
    totalCount: data.total_count
  };
};
const unmarshalListSSLCertificatesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListSSLCertificatesResponse' failed as data isn't a dictionary.`);
  }
  return {
    certificates: unmarshalArrayOfObject(data.certificates, unmarshalSSLCertificate),
    totalCount: data.total_count
  };
};
const unmarshalListTasksResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListTasksResponse' failed as data isn't a dictionary.`);
  }
  return {
    tasks: unmarshalArrayOfObject(data.tasks, unmarshalTask$1),
    totalCount: data.total_count
  };
};
const unmarshalOrderResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'OrderResponse' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    domains: data.domains,
    organizationId: data.organization_id,
    projectId: data.project_id,
    taskId: data.task_id
  };
};
const unmarshalRefreshDNSZoneResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'RefreshDNSZoneResponse' failed as data isn't a dictionary.`);
  }
  return {
    dnsZones: unmarshalArrayOfObject(data.dns_zones, unmarshalDNSZone)
  };
};
const unmarshalRegisterExternalDomainResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'RegisterExternalDomainResponse' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    domain: data.domain,
    organizationId: data.organization_id,
    projectId: data.project_id,
    validationToken: data.validation_token
  };
};
const unmarshalRestoreDNSZoneVersionResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'RestoreDNSZoneVersionResponse' failed as data isn't a dictionary.`);
  }
  return {};
};
const unmarshalSearchAvailableDomainsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SearchAvailableDomainsResponse' failed as data isn't a dictionary.`);
  }
  return {
    availableDomains: unmarshalArrayOfObject(data.available_domains, unmarshalAvailableDomain)
  };
};
const unmarshalUpdateDNSZoneNameserversResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'UpdateDNSZoneNameserversResponse' failed as data isn't a dictionary.`);
  }
  return {
    ns: unmarshalArrayOfObject(data.ns, unmarshalNameserver$1)
  };
};
const unmarshalUpdateDNSZoneRecordsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'UpdateDNSZoneRecordsResponse' failed as data isn't a dictionary.`);
  }
  return {
    records: unmarshalArrayOfObject(data.records, unmarshalDomainRecord)
  };
};
const marshalDomainRecordGeoIPConfigMatch = (request, defaults) => ({
  continents: request.continents,
  countries: request.countries,
  data: request.data
});
const marshalDomainRecordViewConfigView = (request, defaults) => ({
  data: request.data,
  subnet: request.subnet
});
const marshalDomainRecordWeightedConfigWeightedIP = (request, defaults) => ({
  ip: request.ip,
  weight: request.weight
});
const marshalDomainRecordGeoIPConfig = (request, defaults) => ({
  default: request.default,
  matches: request.matches.map(elt => marshalDomainRecordGeoIPConfigMatch(elt))
});
const marshalDomainRecordHTTPServiceConfig = (request, defaults) => ({
  ips: request.ips,
  must_contain: request.mustContain,
  strategy: request.strategy,
  url: request.url,
  user_agent: request.userAgent
});
const marshalDomainRecordViewConfig = (request, defaults) => ({
  views: request.views.map(elt => marshalDomainRecordViewConfigView(elt))
});
const marshalDomainRecordWeightedConfig = (request, defaults) => ({
  weighted_ips: request.weightedIps.map(elt => marshalDomainRecordWeightedConfigWeightedIP(elt))
});
const marshalContactExtensionFRAssociationInfo = (request, defaults) => ({
  publication_jo: request.publicationJo,
  publication_jo_page: request.publicationJoPage
});
const marshalContactExtensionFRCodeAuthAfnicInfo = (request, defaults) => ({
  code_auth_afnic: request.codeAuthAfnic
});
const marshalContactExtensionFRDunsInfo = (request, defaults) => ({
  duns_id: request.dunsId,
  local_id: request.localId
});
const marshalContactExtensionFRIndividualInfo = (request, defaults) => ({
  whois_opt_in: request.whoisOptIn
});
const marshalContactExtensionFRTrademarkInfo = (request, defaults) => ({
  trademark_inpi: request.trademarkInpi
});
const marshalDSRecordPublicKey = (request, defaults) => ({
  key: request.key
});
const marshalDomainRecord = (request, defaults) => ({
  comment: request.comment,
  data: request.data,
  id: request.id,
  name: request.name,
  priority: request.priority,
  ttl: request.ttl,
  type: request.type,
  ...resolveOneOf([{
    param: 'geo_ip_config',
    value: request.geoIpConfig ? marshalDomainRecordGeoIPConfig(request.geoIpConfig) : undefined
  }, {
    param: 'http_service_config',
    value: request.httpServiceConfig ? marshalDomainRecordHTTPServiceConfig(request.httpServiceConfig) : undefined
  }, {
    param: 'weighted_config',
    value: request.weightedConfig ? marshalDomainRecordWeightedConfig(request.weightedConfig) : undefined
  }, {
    param: 'view_config',
    value: request.viewConfig ? marshalDomainRecordViewConfig(request.viewConfig) : undefined
  }])
});
const marshalRecordIdentifier = (request, defaults) => ({
  data: request.data,
  name: request.name,
  ttl: request.ttl,
  type: request.type
});
const marshalContactExtensionEU = (request, defaults) => ({
  european_citizenship: request.europeanCitizenship
});
const marshalContactExtensionFR = (request, defaults) => ({
  mode: request.mode,
  ...resolveOneOf([{
    param: 'individual_info',
    value: request.individualInfo ? marshalContactExtensionFRIndividualInfo(request.individualInfo) : undefined
  }, {
    param: 'duns_info',
    value: request.dunsInfo ? marshalContactExtensionFRDunsInfo(request.dunsInfo) : undefined
  }, {
    param: 'association_info',
    value: request.associationInfo ? marshalContactExtensionFRAssociationInfo(request.associationInfo) : undefined
  }, {
    param: 'trademark_info',
    value: request.trademarkInfo ? marshalContactExtensionFRTrademarkInfo(request.trademarkInfo) : undefined
  }, {
    param: 'code_auth_afnic_info',
    value: request.codeAuthAfnicInfo ? marshalContactExtensionFRCodeAuthAfnicInfo(request.codeAuthAfnicInfo) : undefined
  }])
});
const marshalContactExtensionNL = (request, defaults) => ({
  legal_form: request.legalForm,
  legal_form_registration_number: request.legalFormRegistrationNumber
});
const marshalContactQuestion = (request, defaults) => ({
  answer: request.answer,
  question: request.question
});
const marshalDSRecordDigest = (request, defaults) => ({
  digest: request.digest,
  public_key: request.publicKey ? marshalDSRecordPublicKey(request.publicKey) : undefined,
  type: request.type
});
const marshalImportRawDNSZoneRequestTsigKey = (request, defaults) => ({
  algorithm: request.algorithm,
  key: request.key,
  name: request.name
});
const marshalRecordChangeAdd = (request, defaults) => ({
  records: request.records.map(elt => marshalDomainRecord(elt))
});
const marshalRecordChangeClear = (request, defaults) => ({});
const marshalRecordChangeDelete = (request, defaults) => ({
  ...resolveOneOf([{
    param: 'id',
    value: request.id
  }, {
    param: 'id_fields',
    value: request.idFields ? marshalRecordIdentifier(request.idFields) : undefined
  }])
});
const marshalRecordChangeSet = (request, defaults) => ({
  records: request.records.map(elt => marshalDomainRecord(elt)),
  ...resolveOneOf([{
    param: 'id',
    value: request.id
  }, {
    param: 'id_fields',
    value: request.idFields ? marshalRecordIdentifier(request.idFields) : undefined
  }])
});
const marshalDSRecord = (request, defaults) => ({
  algorithm: request.algorithm,
  key_id: request.keyId,
  ...resolveOneOf([{
    param: 'digest',
    value: request.digest ? marshalDSRecordDigest(request.digest) : undefined
  }, {
    param: 'public_key',
    value: request.publicKey ? marshalDSRecordPublicKey(request.publicKey) : undefined
  }])
});
const marshalImportProviderDNSZoneRequestOnlineV1 = (request, defaults) => ({
  token: request.token
});
const marshalImportRawDNSZoneRequestAXFRSource = (request, defaults) => ({
  name_server: request.nameServer,
  tsig_key: request.tsigKey ? marshalImportRawDNSZoneRequestTsigKey(request.tsigKey) : undefined
});
const marshalImportRawDNSZoneRequestBindSource = (request, defaults) => ({
  content: request.content
});
const marshalNameserver = (request, defaults) => ({
  ip: request.ip,
  name: request.name
});
const marshalNewContact = (request, defaults) => ({
  address_line_1: request.addressLine1,
  address_line_2: request.addressLine2,
  city: request.city,
  company_identification_code: request.companyIdentificationCode,
  company_name: request.companyName,
  country: request.country,
  email: request.email,
  email_alt: request.emailAlt,
  extension_eu: request.extensionEu ? marshalContactExtensionEU(request.extensionEu) : undefined,
  extension_fr: request.extensionFr ? marshalContactExtensionFR(request.extensionFr) : undefined,
  extension_nl: request.extensionNl ? marshalContactExtensionNL(request.extensionNl) : undefined,
  fax_number: request.faxNumber,
  firstname: request.firstname,
  lang: request.lang,
  lastname: request.lastname,
  legal_form: request.legalForm,
  phone_number: request.phoneNumber,
  questions: request.questions ? request.questions.map(elt => marshalContactQuestion(elt)) : undefined,
  resale: request.resale,
  state: request.state,
  vat_identification_code: request.vatIdentificationCode,
  whois_opt_in: request.whoisOptIn,
  zip: request.zip
});
const marshalRecordChange = (request, defaults) => ({
  ...resolveOneOf([{
    param: 'add',
    value: request.add ? marshalRecordChangeAdd(request.add) : undefined
  }, {
    param: 'set',
    value: request.set ? marshalRecordChangeSet(request.set) : undefined
  }, {
    param: 'delete',
    value: request.delete ? marshalRecordChangeDelete(request.delete) : undefined
  }, {
    param: 'clear',
    value: request.clear ? marshalRecordChangeClear(request.clear) : undefined
  }])
});
const marshalTransferInDomainRequestTransferRequest = (request, defaults) => ({
  auth_code: request.authCode,
  domain: request.domain
});
const marshalUpdateContactRequestQuestion = (request, defaults) => ({
  answer: request.answer,
  question: request.question
});
const marshalCloneDNSZoneRequest = (request, defaults) => ({
  dest_dns_zone: request.destDnsZone,
  overwrite: request.overwrite,
  project_id: request.projectId
});
const marshalCreateDNSZoneRequest = (request, defaults) => ({
  domain: request.domain,
  project_id: request.projectId ?? defaults.defaultProjectId,
  subdomain: request.subdomain
});
const marshalCreateSSLCertificateRequest = (request, defaults) => ({
  alternative_dns_zones: request.alternativeDnsZones,
  dns_zone: request.dnsZone
});
const marshalImportProviderDNSZoneRequest = (request, defaults) => ({
  ...resolveOneOf([{
    param: 'online_v1',
    value: request.onlineV1 ? marshalImportProviderDNSZoneRequestOnlineV1(request.onlineV1) : undefined
  }])
});
const marshalImportRawDNSZoneRequest = (request, defaults) => ({
  content: request.content,
  format: request.format,
  project_id: request.projectId ?? defaults.defaultProjectId,
  ...resolveOneOf([{
    param: 'bind_source',
    value: request.bindSource ? marshalImportRawDNSZoneRequestBindSource(request.bindSource) : undefined
  }, {
    param: 'axfr_source',
    value: request.axfrSource ? marshalImportRawDNSZoneRequestAXFRSource(request.axfrSource) : undefined
  }])
});
const marshalRefreshDNSZoneRequest = (request, defaults) => ({
  recreate_dns_zone: request.recreateDnsZone,
  recreate_sub_dns_zone: request.recreateSubDnsZone
});
const marshalRegistrarApiBuyDomainsRequest = (request, defaults) => ({
  domains: request.domains,
  duration_in_years: request.durationInYears,
  project_id: request.projectId ?? defaults.defaultProjectId,
  ...resolveOneOf([{
    param: 'administrative_contact_id',
    value: request.administrativeContactId
  }, {
    param: 'administrative_contact',
    value: request.administrativeContact ? marshalNewContact(request.administrativeContact) : undefined
  }]),
  ...resolveOneOf([{
    param: 'owner_contact_id',
    value: request.ownerContactId
  }, {
    param: 'owner_contact',
    value: request.ownerContact ? marshalNewContact(request.ownerContact) : undefined
  }]),
  ...resolveOneOf([{
    param: 'technical_contact_id',
    value: request.technicalContactId
  }, {
    param: 'technical_contact',
    value: request.technicalContact ? marshalNewContact(request.technicalContact) : undefined
  }])
});
const marshalRegistrarApiCheckContactsCompatibilityRequest = (request, defaults) => ({
  domains: request.domains,
  tlds: request.tlds,
  ...resolveOneOf([{
    param: 'administrative_contact_id',
    value: request.administrativeContactId
  }, {
    param: 'administrative_contact',
    value: request.administrativeContact ? marshalNewContact(request.administrativeContact) : undefined
  }]),
  ...resolveOneOf([{
    param: 'owner_contact_id',
    value: request.ownerContactId
  }, {
    param: 'owner_contact',
    value: request.ownerContact ? marshalNewContact(request.ownerContact) : undefined
  }]),
  ...resolveOneOf([{
    param: 'technical_contact_id',
    value: request.technicalContactId
  }, {
    param: 'technical_contact',
    value: request.technicalContact ? marshalNewContact(request.technicalContact) : undefined
  }])
});
const marshalRegistrarApiCreateDomainHostRequest = (request, defaults) => ({
  ips: request.ips,
  name: request.name
});
const marshalRegistrarApiEnableDomainDNSSECRequest = (request, defaults) => ({
  ds_record: request.dsRecord ? marshalDSRecord(request.dsRecord) : undefined
});
const marshalRegistrarApiRegisterExternalDomainRequest = (request, defaults) => ({
  domain: request.domain,
  project_id: request.projectId ?? defaults.defaultProjectId
});
const marshalRegistrarApiRenewDomainsRequest = (request, defaults) => ({
  domains: request.domains,
  duration_in_years: request.durationInYears,
  force_late_renewal: request.forceLateRenewal
});
const marshalRegistrarApiTradeDomainRequest = (request, defaults) => ({
  project_id: request.projectId,
  ...resolveOneOf([{
    param: 'new_owner_contact_id',
    value: request.newOwnerContactId
  }, {
    param: 'new_owner_contact',
    value: request.newOwnerContact ? marshalNewContact(request.newOwnerContact) : undefined
  }])
});
const marshalRegistrarApiTransferInDomainRequest = (request, defaults) => ({
  domains: request.domains.map(elt => marshalTransferInDomainRequestTransferRequest(elt)),
  project_id: request.projectId ?? defaults.defaultProjectId,
  ...resolveOneOf([{
    param: 'administrative_contact_id',
    value: request.administrativeContactId
  }, {
    param: 'administrative_contact',
    value: request.administrativeContact ? marshalNewContact(request.administrativeContact) : undefined
  }]),
  ...resolveOneOf([{
    param: 'owner_contact_id',
    value: request.ownerContactId
  }, {
    param: 'owner_contact',
    value: request.ownerContact ? marshalNewContact(request.ownerContact) : undefined
  }]),
  ...resolveOneOf([{
    param: 'technical_contact_id',
    value: request.technicalContactId
  }, {
    param: 'technical_contact',
    value: request.technicalContact ? marshalNewContact(request.technicalContact) : undefined
  }])
});
const marshalRegistrarApiUpdateContactRequest = (request, defaults) => ({
  address_line_1: request.addressLine1,
  address_line_2: request.addressLine2,
  city: request.city,
  company_identification_code: request.companyIdentificationCode,
  country: request.country,
  email: request.email,
  email_alt: request.emailAlt,
  extension_eu: request.extensionEu ? marshalContactExtensionEU(request.extensionEu) : undefined,
  extension_fr: request.extensionFr ? marshalContactExtensionFR(request.extensionFr) : undefined,
  extension_nl: request.extensionNl ? marshalContactExtensionNL(request.extensionNl) : undefined,
  fax_number: request.faxNumber,
  lang: request.lang ?? 'unknown_language_code',
  phone_number: request.phoneNumber,
  questions: request.questions ? request.questions.map(elt => marshalUpdateContactRequestQuestion(elt)) : undefined,
  resale: request.resale,
  state: request.state,
  vat_identification_code: request.vatIdentificationCode,
  whois_opt_in: request.whoisOptIn,
  zip: request.zip
});
const marshalRegistrarApiUpdateDomainHostRequest = (request, defaults) => ({
  ips: request.ips
});
const marshalRegistrarApiUpdateDomainRequest = (request, defaults) => ({
  ...resolveOneOf([{
    param: 'administrative_contact_id',
    value: request.administrativeContactId
  }, {
    param: 'administrative_contact',
    value: request.administrativeContact ? marshalNewContact(request.administrativeContact) : undefined
  }]),
  ...resolveOneOf([{
    param: 'owner_contact_id',
    value: request.ownerContactId
  }, {
    param: 'owner_contact',
    value: request.ownerContact ? marshalNewContact(request.ownerContact) : undefined
  }]),
  ...resolveOneOf([{
    param: 'technical_contact_id',
    value: request.technicalContactId
  }, {
    param: 'technical_contact',
    value: request.technicalContact ? marshalNewContact(request.technicalContact) : undefined
  }])
});
const marshalUpdateDNSZoneNameserversRequest = (request, defaults) => ({
  ns: request.ns.map(elt => marshalNameserver(elt))
});
const marshalUpdateDNSZoneRecordsRequest = (request, defaults) => ({
  changes: request.changes.map(elt => marshalRecordChange(elt)),
  disallow_new_zone_creation: request.disallowNewZoneCreation,
  return_all_records: request.returnAllRecords,
  serial: request.serial
});
const marshalUpdateDNSZoneRequest = (request, defaults) => ({
  new_dns_zone: request.newDnsZone,
  project_id: request.projectId ?? defaults.defaultProjectId
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$h = {
  'Content-Type': 'application/json; charset=utf-8'
};

/**
 * Domains and DNS API.
 *
 * Domains and DNS API. Manage your domains, DNS zones and records with the
 * Domains and DNS API.
 */
let API$j = class API extends API$q {
  pageOfListDNSZones = request => this.client.fetch({
    method: 'GET',
    path: `/domain/v2beta1/dns-zones`,
    urlParams: urlParams(['dns_zone', request.dnsZone], ['domain', request.domain], ['order_by', request.orderBy ?? 'domain_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListDNSZonesResponse);

  /**
   * List DNS zones. Retrieve the list of DNS zones you can manage and filter
   * DNS zones associated with specific domain names.
   *
   * @param request - The request {@link ListDNSZonesRequest}
   * @returns A Promise of ListDNSZonesResponse
   */
  listDNSZones = request => enrichForPagination('dnsZones', this.pageOfListDNSZones, request);

  /**
   * Create a DNS zone. Create a new DNS zone specified by the domain name, the
   * subdomain and the Project ID.
   *
   * @param request - The request {@link CreateDNSZoneRequest}
   * @returns A Promise of DNSZone
   */
  createDNSZone = request => this.client.fetch({
    body: JSON.stringify(marshalCreateDNSZoneRequest(request, this.client.settings)),
    headers: jsonContentHeaders$h,
    method: 'POST',
    path: `/domain/v2beta1/dns-zones`
  }, unmarshalDNSZone);

  /**
   * Update a DNS zone. Update the name and/or the Organizations for a DNS zone.
   *
   * @param request - The request {@link UpdateDNSZoneRequest}
   * @returns A Promise of DNSZone
   */
  updateDNSZone = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateDNSZoneRequest(request, this.client.settings)),
    headers: jsonContentHeaders$h,
    method: 'PATCH',
    path: `/domain/v2beta1/dns-zones/${validatePathParam('dnsZone', request.dnsZone)}`
  }, unmarshalDNSZone);

  /**
   * Clone a DNS zone. Clone an existing DNS zone with all its records into a
   * new DNS zone.
   *
   * @param request - The request {@link CloneDNSZoneRequest}
   * @returns A Promise of DNSZone
   */
  cloneDNSZone = request => this.client.fetch({
    body: JSON.stringify(marshalCloneDNSZoneRequest(request, this.client.settings)),
    headers: jsonContentHeaders$h,
    method: 'POST',
    path: `/domain/v2beta1/dns-zones/${validatePathParam('dnsZone', request.dnsZone)}/clone`
  }, unmarshalDNSZone);

  /**
   * Delete a DNS zone. Delete a DNS zone and all its records.
   *
   * @param request - The request {@link DeleteDNSZoneRequest}
   * @returns A Promise of DeleteDNSZoneResponse
   */
  deleteDNSZone = request => this.client.fetch({
    method: 'DELETE',
    path: `/domain/v2beta1/dns-zones/${validatePathParam('dnsZone', request.dnsZone)}`,
    urlParams: urlParams(['project_id', request.projectId ?? this.client.settings.defaultProjectId])
  }, unmarshalDeleteDNSZoneResponse);
  pageOfListDNSZoneRecords = request => this.client.fetch({
    method: 'GET',
    path: `/domain/v2beta1/dns-zones/${validatePathParam('dnsZone', request.dnsZone)}/records`,
    urlParams: urlParams(['id', request.id], ['name', request.name], ['order_by', request.orderBy ?? 'name_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId], ['type', request.type ?? 'unknown'])
  }, unmarshalListDNSZoneRecordsResponse);

  /**
   * List records within a DNS zone. Retrieve a list of DNS records within a DNS
   * zone that has default name servers. You can filter records by type and
   * name.
   *
   * @param request - The request {@link ListDNSZoneRecordsRequest}
   * @returns A Promise of ListDNSZoneRecordsResponse
   */
  listDNSZoneRecords = request => enrichForPagination('records', this.pageOfListDNSZoneRecords, request);

  /**
   * Update records within a DNS zone. Update records within a DNS zone that has
   * default name servers and perform several actions on your records.
   *
   * Actions include:
   *
   * - Add: allows you to add a new record or add a new IP to an existing A
   *   record, for example
   * - Set: allows you to edit a record or edit an IP from an existing A record,
   *   for example
   * - Delete: allows you to delete a record or delete an IP from an existing A
   *   record, for example
   * - Clear: allows you to delete all records from a DNS zone
   *
   * All edits will be versioned.
   *
   * @param request - The request {@link UpdateDNSZoneRecordsRequest}
   * @returns A Promise of UpdateDNSZoneRecordsResponse
   */
  updateDNSZoneRecords = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateDNSZoneRecordsRequest(request, this.client.settings)),
    headers: jsonContentHeaders$h,
    method: 'PATCH',
    path: `/domain/v2beta1/dns-zones/${validatePathParam('dnsZone', request.dnsZone)}/records`
  }, unmarshalUpdateDNSZoneRecordsResponse);

  /**
   * List name servers within a DNS zone. Retrieve a list of name servers within
   * a DNS zone and their optional glue records.
   *
   * @param request - The request {@link ListDNSZoneNameserversRequest}
   * @returns A Promise of ListDNSZoneNameserversResponse
   */
  listDNSZoneNameservers = request => this.client.fetch({
    method: 'GET',
    path: `/domain/v2beta1/dns-zones/${validatePathParam('dnsZone', request.dnsZone)}/nameservers`,
    urlParams: urlParams(['project_id', request.projectId])
  }, unmarshalListDNSZoneNameserversResponse);

  /**
   * Update name servers within a DNS zone. Update name servers within a DNS
   * zone and set optional glue records.
   *
   * @param request - The request {@link UpdateDNSZoneNameserversRequest}
   * @returns A Promise of UpdateDNSZoneNameserversResponse
   */
  updateDNSZoneNameservers = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateDNSZoneNameserversRequest(request, this.client.settings)),
    headers: jsonContentHeaders$h,
    method: 'PUT',
    path: `/domain/v2beta1/dns-zones/${validatePathParam('dnsZone', request.dnsZone)}/nameservers`
  }, unmarshalUpdateDNSZoneNameserversResponse);

  /**
   * Clear records within a DNS zone. Delete all records within a DNS zone that
   * has default name servers.<br/> All edits will be versioned.
   *
   * @param request - The request {@link ClearDNSZoneRecordsRequest}
   * @returns A Promise of ClearDNSZoneRecordsResponse
   */
  clearDNSZoneRecords = request => this.client.fetch({
    method: 'DELETE',
    path: `/domain/v2beta1/dns-zones/${validatePathParam('dnsZone', request.dnsZone)}/records`
  }, unmarshalClearDNSZoneRecordsResponse);

  /**
   * Export a raw DNS zone. Export a DNS zone with default name servers, in a
   * specific format.
   *
   * @param request - The request {@link ExportRawDNSZoneRequest}
   * @returns A Promise of Blob
   */
  exportRawDNSZone = request => this.client.fetch({
    method: 'GET',
    path: `/domain/v2beta1/dns-zones/${validatePathParam('dnsZone', request.dnsZone)}/raw`,
    urlParams: urlParams(['dl', 1], ['format', request.format ?? 'unknown_raw_format']),
    responseType: 'blob'
  });

  /**
   * Import a raw DNS zone. Import and replace the format of records from a
   * given provider, with default name servers.
   *
   * @param request - The request {@link ImportRawDNSZoneRequest}
   * @returns A Promise of ImportRawDNSZoneResponse
   */
  importRawDNSZone = request => this.client.fetch({
    body: JSON.stringify(marshalImportRawDNSZoneRequest(request, this.client.settings)),
    headers: jsonContentHeaders$h,
    method: 'POST',
    path: `/domain/v2beta1/dns-zones/${validatePathParam('dnsZone', request.dnsZone)}/raw`
  }, unmarshalImportRawDNSZoneResponse);

  /**
   * Import a DNS zone from another provider. Import and replace the format of
   * records from a given provider, with default name servers.
   *
   * @param request - The request {@link ImportProviderDNSZoneRequest}
   * @returns A Promise of ImportProviderDNSZoneResponse
   */
  importProviderDNSZone = request => this.client.fetch({
    body: JSON.stringify(marshalImportProviderDNSZoneRequest(request, this.client.settings)),
    headers: jsonContentHeaders$h,
    method: 'POST',
    path: `/domain/v2beta1/dns-zones/${validatePathParam('dnsZone', request.dnsZone)}/import-provider`
  }, unmarshalImportProviderDNSZoneResponse);

  /**
   * Refresh a DNS zone. Refresh an SOA DNS zone to reload the records in the
   * DNS zone and update the SOA serial. You can recreate the given DNS zone and
   * its sub DNS zone if needed.
   *
   * @param request - The request {@link RefreshDNSZoneRequest}
   * @returns A Promise of RefreshDNSZoneResponse
   */
  refreshDNSZone = request => this.client.fetch({
    body: JSON.stringify(marshalRefreshDNSZoneRequest(request, this.client.settings)),
    headers: jsonContentHeaders$h,
    method: 'POST',
    path: `/domain/v2beta1/dns-zones/${validatePathParam('dnsZone', request.dnsZone)}/refresh`
  }, unmarshalRefreshDNSZoneResponse);
  pageOfListDNSZoneVersions = request => this.client.fetch({
    method: 'GET',
    path: `/domain/v2beta1/dns-zones/${validatePathParam('dnsZone', request.dnsZone)}/versions`,
    urlParams: urlParams(['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListDNSZoneVersionsResponse);

  /**
   * List versions of a DNS zone. Retrieve a list of a DNS zone's versions.<br/>
   * The maximum version count is 100. If the count reaches this limit, the
   * oldest version will be deleted after each new modification.
   *
   * @param request - The request {@link ListDNSZoneVersionsRequest}
   * @returns A Promise of ListDNSZoneVersionsResponse
   */
  listDNSZoneVersions = request => enrichForPagination('versions', this.pageOfListDNSZoneVersions, request);
  pageOfListDNSZoneVersionRecords = request => this.client.fetch({
    method: 'GET',
    path: `/domain/v2beta1/dns-zones/version/${validatePathParam('dnsZoneVersionId', request.dnsZoneVersionId)}`,
    urlParams: urlParams(['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListDNSZoneVersionRecordsResponse);

  /**
   * List records from a given version of a specific DNS zone. Retrieve a list
   * of records from a specific DNS zone version.
   *
   * @param request - The request {@link ListDNSZoneVersionRecordsRequest}
   * @returns A Promise of ListDNSZoneVersionRecordsResponse
   */
  listDNSZoneVersionRecords = request => enrichForPagination('records', this.pageOfListDNSZoneVersionRecords, request);

  /**
   * Access differences from a specific DNS zone version. Access a previous DNS
   * zone version to see the differences from another specific version.
   *
   * @param request - The request {@link GetDNSZoneVersionDiffRequest}
   * @returns A Promise of GetDNSZoneVersionDiffResponse
   */
  getDNSZoneVersionDiff = request => this.client.fetch({
    method: 'GET',
    path: `/domain/v2beta1/dns-zones/version/${validatePathParam('dnsZoneVersionId', request.dnsZoneVersionId)}/diff`
  }, unmarshalGetDNSZoneVersionDiffResponse);

  /**
   * Restore a DNS zone version. Restore and activate a version of a specific
   * DNS zone.
   *
   * @param request - The request {@link RestoreDNSZoneVersionRequest}
   * @returns A Promise of RestoreDNSZoneVersionResponse
   */
  restoreDNSZoneVersion = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$h,
    method: 'POST',
    path: `/domain/v2beta1/dns-zones/version/${validatePathParam('dnsZoneVersionId', request.dnsZoneVersionId)}/restore`
  }, unmarshalRestoreDNSZoneVersionResponse);

  /**
   * Get a DNS zone's TLS certificate. Get the DNS zone's TLS certificate. If
   * you do not have a certificate, the ouptut returns `no certificate found`.
   *
   * @param request - The request {@link GetSSLCertificateRequest}
   * @returns A Promise of SSLCertificate
   */
  getSSLCertificate = request => this.client.fetch({
    method: 'GET',
    path: `/domain/v2beta1/ssl-certificates/${validatePathParam('dnsZone', request.dnsZone)}`
  }, unmarshalSSLCertificate);

  /**
   * Waits for {@link SSLCertificate} to be in a final state.
   *
   * @param request - The request {@link GetSSLCertificateRequest}
   * @param options - The waiting options
   * @returns A Promise of SSLCertificate
   */
  waitForSSLCertificate = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!SSL_CERTIFICATE_TRANSIENT_STATUSES.includes(res.status))), this.getSSLCertificate, request, options);

  /**
   * Create or get the DNS zone's TLS certificate. Create a new TLS certificate
   * or retrieve information about an existing TLS certificate.
   *
   * @param request - The request {@link CreateSSLCertificateRequest}
   * @returns A Promise of SSLCertificate
   */
  createSSLCertificate = request => this.client.fetch({
    body: JSON.stringify(marshalCreateSSLCertificateRequest(request, this.client.settings)),
    headers: jsonContentHeaders$h,
    method: 'POST',
    path: `/domain/v2beta1/ssl-certificates`
  }, unmarshalSSLCertificate);
  pageOfListSSLCertificates = request => this.client.fetch({
    method: 'GET',
    path: `/domain/v2beta1/ssl-certificates`,
    urlParams: urlParams(['dns_zone', request.dnsZone], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListSSLCertificatesResponse);

  /**
   * List a user's TLS certificates. List all the TLS certificates a user has
   * created, specified by the user's Project ID and the DNS zone.
   *
   * @param request - The request {@link ListSSLCertificatesRequest}
   * @returns A Promise of ListSSLCertificatesResponse
   */
  listSSLCertificates = request => enrichForPagination('certificates', this.pageOfListSSLCertificates, request);

  /**
   * Delete a TLS certificate. Delete an existing TLS certificate specified by
   * its DNS zone. Deleting a TLS certificate is permanent and cannot be
   * undone.
   *
   * @param request - The request {@link DeleteSSLCertificateRequest}
   * @returns A Promise of DeleteSSLCertificateResponse
   */
  deleteSSLCertificate = request => this.client.fetch({
    method: 'DELETE',
    path: `/domain/v2beta1/ssl-certificates/${validatePathParam('dnsZone', request.dnsZone)}`
  }, unmarshalDeleteSSLCertificateResponse);

  /**
   * Get the DNS zone's TSIG key. Retrieve information about the TSIG key of a
   * given DNS zone to allow AXFR requests.
   *
   * @param request - The request {@link GetDNSZoneTsigKeyRequest}
   * @returns A Promise of GetDNSZoneTsigKeyResponse
   */
  getDNSZoneTsigKey = request => this.client.fetch({
    method: 'GET',
    path: `/domain/v2beta1/dns-zones/${validatePathParam('dnsZone', request.dnsZone)}/tsig-key`
  }, unmarshalGetDNSZoneTsigKeyResponse);

  /**
   * Delete the DNS zone's TSIG key. Delete an existing TSIG key specified by
   * its DNS zone. Deleting a TSIG key is permanent and cannot be undone.
   *
   * @param request - The request {@link DeleteDNSZoneTsigKeyRequest}
   */
  deleteDNSZoneTsigKey = request => this.client.fetch({
    method: 'DELETE',
    path: `/domain/v2beta1/dns-zones/${validatePathParam('dnsZone', request.dnsZone)}/tsig-key`
  });
};

/**
 * Domains and DNS - Registrar API.
 *
 * Domains and DNS - Registrar API. Manage your domains and contacts.
 */
class RegistrarAPI extends API$q {
  pageOfListTasks = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/domain/v2beta1/tasks`,
    urlParams: urlParams(['domain', request.domain], ['order_by', request.orderBy ?? 'domain_desc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId], ['statuses', request.statuses], ['types', request.types])
  }, unmarshalListTasksResponse);

  /**
   * List tasks. List all account tasks. You can filter the list by domain name.
   *
   * @param request - The request {@link RegistrarApiListTasksRequest}
   * @returns A Promise of ListTasksResponse
   */
  listTasks = (request = {}) => enrichForPagination('tasks', this.pageOfListTasks, request);

  /**
   * Buy one or more domains. Request the registration of domain names. You can
   * provide an already existing domain's contact or a new contact.
   *
   * @param request - The request {@link RegistrarApiBuyDomainsRequest}
   * @returns A Promise of OrderResponse
   */
  buyDomains = request => this.client.fetch({
    body: JSON.stringify(marshalRegistrarApiBuyDomainsRequest(request, this.client.settings)),
    headers: jsonContentHeaders$h,
    method: 'POST',
    path: `/domain/v2beta1/buy-domains`
  }, unmarshalOrderResponse);

  /**
   * Renew one or more domains. Request the renewal of domain names.
   *
   * @param request - The request {@link RegistrarApiRenewDomainsRequest}
   * @returns A Promise of OrderResponse
   */
  renewDomains = request => this.client.fetch({
    body: JSON.stringify(marshalRegistrarApiRenewDomainsRequest(request, this.client.settings)),
    headers: jsonContentHeaders$h,
    method: 'POST',
    path: `/domain/v2beta1/renew-domains`
  }, unmarshalOrderResponse);

  /**
   * Transfer a domain. Request the transfer from another registrar domain to
   * Scaleway.
   *
   * @param request - The request {@link RegistrarApiTransferInDomainRequest}
   * @returns A Promise of OrderResponse
   */
  transferInDomain = request => this.client.fetch({
    body: JSON.stringify(marshalRegistrarApiTransferInDomainRequest(request, this.client.settings)),
    headers: jsonContentHeaders$h,
    method: 'POST',
    path: `/domain/v2beta1/domains/transfer-domains`
  }, unmarshalOrderResponse);

  /**
   * Trade a domain contact. Request a trade for the contact owner.<br/> If an
   * `organization_id` is given, the change is from the current Scaleway account
   * to another Scaleway account.<br/> If no contact is given, the first contact
   * of the other Scaleway account is taken.<br/> If the other Scaleway account
   * has no contact. An error occurs.
   *
   * @param request - The request {@link RegistrarApiTradeDomainRequest}
   * @returns A Promise of OrderResponse
   */
  tradeDomain = request => this.client.fetch({
    body: JSON.stringify(marshalRegistrarApiTradeDomainRequest(request, this.client.settings)),
    headers: jsonContentHeaders$h,
    method: 'POST',
    path: `/domain/v2beta1/domains/${validatePathParam('domain', request.domain)}/trade`
  }, unmarshalOrderResponse);

  /**
   * Register an external domain. Request the registration of an external domain
   * name.
   *
   * @param request - The request
   *   {@link RegistrarApiRegisterExternalDomainRequest}
   * @returns A Promise of RegisterExternalDomainResponse
   */
  registerExternalDomain = request => this.client.fetch({
    body: JSON.stringify(marshalRegistrarApiRegisterExternalDomainRequest(request, this.client.settings)),
    headers: jsonContentHeaders$h,
    method: 'POST',
    path: `/domain/v2beta1/external-domains`
  }, unmarshalRegisterExternalDomainResponse);

  /**
   * Delete an external domain. Delete an external domain name.
   *
   * @param request - The request {@link RegistrarApiDeleteExternalDomainRequest}
   * @returns A Promise of DeleteExternalDomainResponse
   */
  deleteExternalDomain = request => this.client.fetch({
    method: 'DELETE',
    path: `/domain/v2beta1/external-domains/${validatePathParam('domain', request.domain)}`
  }, unmarshalDeleteExternalDomainResponse);

  /**
   * Check if contacts are compatible against a domain or a tld. Check if
   * contacts are compatible against a domain or a tld. If not, it will return
   * the information requiring a correction.
   *
   * @param request - The request
   *   {@link RegistrarApiCheckContactsCompatibilityRequest}
   * @returns A Promise of CheckContactsCompatibilityResponse
   */
  checkContactsCompatibility = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalRegistrarApiCheckContactsCompatibilityRequest(request, this.client.settings)),
    headers: jsonContentHeaders$h,
    method: 'POST',
    path: `/domain/v2beta1/check-contacts-compatibility`
  }, unmarshalCheckContactsCompatibilityResponse);
  pageOfListContacts = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/domain/v2beta1/contacts`,
    urlParams: urlParams(['domain', request.domain], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListContactsResponse);

  /**
   * List contacts. Return a list of contacts with their domains and roles. You
   * can filter the list by domain name.
   *
   * @param request - The request {@link RegistrarApiListContactsRequest}
   * @returns A Promise of ListContactsResponse
   */
  listContacts = (request = {}) => enrichForPagination('contacts', this.pageOfListContacts, request);

  /**
   * Get a contact. Return a contact details retrieved from the registrar using
   * a given contact ID.
   *
   * @param request - The request {@link RegistrarApiGetContactRequest}
   * @returns A Promise of Contact
   */
  getContact = request => this.client.fetch({
    method: 'GET',
    path: `/domain/v2beta1/contacts/${validatePathParam('contactId', request.contactId)}`
  }, unmarshalContact);

  /**
   * Update contact. You can edit the contact coordinates.
   *
   * @param request - The request {@link RegistrarApiUpdateContactRequest}
   * @returns A Promise of Contact
   */
  updateContact = request => this.client.fetch({
    body: JSON.stringify(marshalRegistrarApiUpdateContactRequest(request, this.client.settings)),
    headers: jsonContentHeaders$h,
    method: 'PATCH',
    path: `/domain/v2beta1/contacts/${validatePathParam('contactId', request.contactId)}`
  }, unmarshalContact);
  pageOfListDomains = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/domain/v2beta1/domains`,
    urlParams: urlParams(['domain', request.domain], ['is_external', request.isExternal], ['order_by', request.orderBy ?? 'domain_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId], ['registrar', request.registrar], ['status', request.status ?? 'status_unknown'])
  }, unmarshalListDomainsResponse$2);

  /**
   * List domains. Returns a list of domains owned by the user.
   *
   * @param request - The request {@link RegistrarApiListDomainsRequest}
   * @returns A Promise of ListDomainsResponse
   */
  listDomains = (request = {}) => enrichForPagination('domains', this.pageOfListDomains, request);
  pageOfListRenewableDomains = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/domain/v2beta1/renewable-domains`,
    urlParams: urlParams(['order_by', request.orderBy ?? 'domain_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListRenewableDomainsResponse);

  /**
   * List scaleway domains that can or not be renewed. Returns a list of domains
   * owned by the user with a renew status and if renewable, the maximum renew
   * duration in years.
   *
   * @param request - The request {@link RegistrarApiListRenewableDomainsRequest}
   * @returns A Promise of ListRenewableDomainsResponse
   */
  listRenewableDomains = (request = {}) => enrichForPagination('domains', this.pageOfListRenewableDomains, request);

  /**
   * Get domain. Returns a the domain with more informations.
   *
   * @param request - The request {@link RegistrarApiGetDomainRequest}
   * @returns A Promise of Domain
   */
  getDomain = request => this.client.fetch({
    method: 'GET',
    path: `/domain/v2beta1/domains/${validatePathParam('domain', request.domain)}`
  }, unmarshalDomain$2);

  /**
   * Waits for {@link Domain} to be in a final state.
   *
   * @param request - The request {@link GetDomainRequest}
   * @param options - The waiting options
   * @returns A Promise of Domain
   */
  waitForDomain = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!DOMAIN_TRANSIENT_STATUSES$2.includes(res.status))), this.getDomain, request, options);

  /**
   * Update a domain. Update the domain contacts or create a new one.<br/> If
   * you add the same contact for multiple roles. Only one ID will be created
   * and used for all of them.
   *
   * @param request - The request {@link RegistrarApiUpdateDomainRequest}
   * @returns A Promise of Domain
   */
  updateDomain = request => this.client.fetch({
    body: JSON.stringify(marshalRegistrarApiUpdateDomainRequest(request, this.client.settings)),
    headers: jsonContentHeaders$h,
    method: 'PATCH',
    path: `/domain/v2beta1/domains/${validatePathParam('domain', request.domain)}`
  }, unmarshalDomain$2);

  /**
   * Lock domain transfer. Lock domain transfer. A locked domain transfer can't
   * be transferred and the auth code can't be requested.
   *
   * @param request - The request {@link RegistrarApiLockDomainTransferRequest}
   * @returns A Promise of Domain
   */
  lockDomainTransfer = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$h,
    method: 'POST',
    path: `/domain/v2beta1/domains/${validatePathParam('domain', request.domain)}/lock-transfer`
  }, unmarshalDomain$2);

  /**
   * Unlock domain transfer. Unlock domain transfer. An unlocked domain can be
   * transferred and the auth code can be requested for this.
   *
   * @param request - The request {@link RegistrarApiUnlockDomainTransferRequest}
   * @returns A Promise of Domain
   */
  unlockDomainTransfer = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$h,
    method: 'POST',
    path: `/domain/v2beta1/domains/${validatePathParam('domain', request.domain)}/unlock-transfer`
  }, unmarshalDomain$2);

  /**
   * Enable domain auto renew.
   *
   * @param request - The request
   *   {@link RegistrarApiEnableDomainAutoRenewRequest}
   * @returns A Promise of Domain
   */
  enableDomainAutoRenew = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$h,
    method: 'POST',
    path: `/domain/v2beta1/domains/${validatePathParam('domain', request.domain)}/enable-auto-renew`
  }, unmarshalDomain$2);

  /**
   * Disable domain auto renew.
   *
   * @param request - The request
   *   {@link RegistrarApiDisableDomainAutoRenewRequest}
   * @returns A Promise of Domain
   */
  disableDomainAutoRenew = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$h,
    method: 'POST',
    path: `/domain/v2beta1/domains/${validatePathParam('domain', request.domain)}/disable-auto-renew`
  }, unmarshalDomain$2);

  /**
   * Return domain auth code. If possible, return the auth code for an unlocked
   * domain transfer, or an error if the domain is locked. Some TLD may have a
   * different procedure to retrieve the auth code, in that case, the
   * information is given in the message field.
   *
   * @param request - The request {@link RegistrarApiGetDomainAuthCodeRequest}
   * @returns A Promise of GetDomainAuthCodeResponse
   */
  getDomainAuthCode = request => this.client.fetch({
    method: 'GET',
    path: `/domain/v2beta1/domains/${validatePathParam('domain', request.domain)}/auth-code`
  }, unmarshalGetDomainAuthCodeResponse);

  /**
   * Update domain DNSSEC. If your domain has the default Scaleway NS and uses
   * another registrar, you have to update the DS record manually. For the
   * algorithm, here are the code numbers for each type:
   *
   * - 1: RSAMD5
   * - 2: DIFFIE_HELLMAN
   * - 3: DSA_SHA1
   * - 5: RSA_SHA1
   * - 6: DSA_NSEC3_SHA1
   * - 7: RSASHA1_NSEC3_SHA1
   * - 8: RSASHA256
   * - 10: RSASHA512
   * - 12: ECC_GOST
   * - 13: ECDSAP256SHA256
   * - 14: ECDSAP384SHA384
   *
   * And for the digest type:
   *
   * - 1: SHA_1
   * - 2: SHA_256
   * - 3: GOST_R_34_11_94
   * - 4: SHA_384
   *
   * @param request - The request {@link RegistrarApiEnableDomainDNSSECRequest}
   * @returns A Promise of Domain
   */
  enableDomainDNSSEC = request => this.client.fetch({
    body: JSON.stringify(marshalRegistrarApiEnableDomainDNSSECRequest(request, this.client.settings)),
    headers: jsonContentHeaders$h,
    method: 'POST',
    path: `/domain/v2beta1/domains/${validatePathParam('domain', request.domain)}/enable-dnssec`
  }, unmarshalDomain$2);

  /**
   * Disable domain DNSSEC.
   *
   * @param request - The request {@link RegistrarApiDisableDomainDNSSECRequest}
   * @returns A Promise of Domain
   */
  disableDomainDNSSEC = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$h,
    method: 'POST',
    path: `/domain/v2beta1/domains/${validatePathParam('domain', request.domain)}/disable-dnssec`
  }, unmarshalDomain$2);

  /**
   * Search available domains. Search a domain (or at maximum, 10 domains).
   *
   * If the TLD list is empty or not set the search returns the results from the
   * most popular TLDs.
   *
   * @param request - The request
   *   {@link RegistrarApiSearchAvailableDomainsRequest}
   * @returns A Promise of SearchAvailableDomainsResponse
   */
  searchAvailableDomains = request => this.client.fetch({
    method: 'GET',
    path: `/domain/v2beta1/search-domains`,
    urlParams: urlParams(['domains', request.domains], ['strict_search', request.strictSearch], ['tlds', request.tlds])
  }, unmarshalSearchAvailableDomainsResponse);

  /**
   * Create domain hostname with glue IPs.
   *
   * @param request - The request {@link RegistrarApiCreateDomainHostRequest}
   * @returns A Promise of Host
   */
  createDomainHost = request => this.client.fetch({
    body: JSON.stringify(marshalRegistrarApiCreateDomainHostRequest(request, this.client.settings)),
    headers: jsonContentHeaders$h,
    method: 'POST',
    path: `/domain/v2beta1/domains/${validatePathParam('domain', request.domain)}/hosts`
  }, unmarshalHost);
  pageOfListDomainHosts = request => this.client.fetch({
    method: 'GET',
    path: `/domain/v2beta1/domains/${validatePathParam('domain', request.domain)}/hosts`,
    urlParams: urlParams(['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListDomainHostsResponse);

  /**
   * List domain hostnames with they glue IPs.
   *
   * @param request - The request {@link RegistrarApiListDomainHostsRequest}
   * @returns A Promise of ListDomainHostsResponse
   */
  listDomainHosts = request => enrichForPagination('hosts', this.pageOfListDomainHosts, request);

  /**
   * Update domain hostname with glue IPs.
   *
   * @param request - The request {@link RegistrarApiUpdateDomainHostRequest}
   * @returns A Promise of Host
   */
  updateDomainHost = request => this.client.fetch({
    body: JSON.stringify(marshalRegistrarApiUpdateDomainHostRequest(request, this.client.settings)),
    headers: jsonContentHeaders$h,
    method: 'PATCH',
    path: `/domain/v2beta1/domains/${validatePathParam('domain', request.domain)}/hosts/${validatePathParam('name', request.name)}`
  }, unmarshalHost);

  /**
   * Delete domain hostname.
   *
   * @param request - The request {@link RegistrarApiDeleteDomainHostRequest}
   * @returns A Promise of Host
   */
  deleteDomainHost = request => this.client.fetch({
    method: 'DELETE',
    path: `/domain/v2beta1/domains/${validatePathParam('domain', request.domain)}/hosts/${validatePathParam('name', request.name)}`
  }, unmarshalHost);
}

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen$g = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API$j,
  DNS_ZONE_TRANSIENT_STATUSES: DNS_ZONE_TRANSIENT_STATUSES,
  DOMAIN_FEATURE_TRANSIENT_STATUSES: DOMAIN_FEATURE_TRANSIENT_STATUSES,
  DOMAIN_REGISTRATION_STATUS_TRANSFER_TRANSIENT_STATUSES: DOMAIN_REGISTRATION_STATUS_TRANSFER_TRANSIENT_STATUSES,
  DOMAIN_TRANSIENT_STATUSES: DOMAIN_TRANSIENT_STATUSES$2,
  HOST_TRANSIENT_STATUSES: HOST_TRANSIENT_STATUSES,
  RegistrarAPI: RegistrarAPI,
  SSL_CERTIFICATE_TRANSIENT_STATUSES: SSL_CERTIFICATE_TRANSIENT_STATUSES,
  TASK_TRANSIENT_STATUSES: TASK_TRANSIENT_STATUSES$1
});

var index$l = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v2beta1: index_gen$g
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

/** Lists transient statutes of the enum {@link FlexibleIPStatus}. */
const FLEXIBLE_IP_TRANSIENT_STATUSES = ['updating', 'detaching'];

/** Lists transient statutes of the enum {@link MACAddressStatus}. */
const MAC_ADDRESS_TRANSIENT_STATUSES = ['updating', 'deleting'];

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalMACAddress = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'MACAddress' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    id: data.id,
    macAddress: data.mac_address,
    macType: data.mac_type,
    status: data.status,
    updatedAt: unmarshalDate(data.updated_at),
    zone: data.zone
  };
};
const unmarshalFlexibleIP = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'FlexibleIP' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    description: data.description,
    id: data.id,
    ipAddress: data.ip_address,
    macAddress: data.mac_address ? unmarshalMACAddress(data.mac_address) : undefined,
    organizationId: data.organization_id,
    projectId: data.project_id,
    reverse: data.reverse,
    serverId: data.server_id,
    status: data.status,
    tags: data.tags,
    updatedAt: unmarshalDate(data.updated_at),
    zone: data.zone
  };
};
const unmarshalAttachFlexibleIPsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'AttachFlexibleIPsResponse' failed as data isn't a dictionary.`);
  }
  return {
    flexibleIps: unmarshalArrayOfObject(data.flexible_ips, unmarshalFlexibleIP),
    totalCount: data.total_count
  };
};
const unmarshalDetachFlexibleIPsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DetachFlexibleIPsResponse' failed as data isn't a dictionary.`);
  }
  return {
    flexibleIps: unmarshalArrayOfObject(data.flexible_ips, unmarshalFlexibleIP),
    totalCount: data.total_count
  };
};
const unmarshalListFlexibleIPsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListFlexibleIPsResponse' failed as data isn't a dictionary.`);
  }
  return {
    flexibleIps: unmarshalArrayOfObject(data.flexible_ips, unmarshalFlexibleIP),
    totalCount: data.total_count
  };
};
const marshalAttachFlexibleIPRequest = (request, defaults) => ({
  fips_ids: request.fipsIds,
  server_id: request.serverId
});
const marshalCreateFlexibleIPRequest = (request, defaults) => ({
  description: request.description,
  is_ipv6: request.isIpv6,
  project_id: request.projectId ?? defaults.defaultProjectId,
  reverse: request.reverse,
  server_id: request.serverId,
  tags: request.tags
});
const marshalDetachFlexibleIPRequest = (request, defaults) => ({
  fips_ids: request.fipsIds
});
const marshalDuplicateMACAddrRequest = (request, defaults) => ({
  duplicate_from_fip_id: request.duplicateFromFipId
});
const marshalGenerateMACAddrRequest = (request, defaults) => ({
  mac_type: request.macType
});
const marshalMoveMACAddrRequest = (request, defaults) => ({
  dst_fip_id: request.dstFipId
});
const marshalUpdateFlexibleIPRequest = (request, defaults) => ({
  description: request.description,
  reverse: request.reverse,
  tags: request.tags
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$g = {
  'Content-Type': 'application/json; charset=utf-8'
};

/** Elastic Metal - Flexible IP API. */
let API$i = class API extends API$q {
  /** Lists the available zones of the API. */
  static LOCALITIES = ['fr-par-1', 'fr-par-2', 'nl-ams-1'];

  /**
   * Create a new flexible IP. Generate a new flexible IP within a given zone,
   * specifying its configuration including Project ID and description.
   *
   * @param request - The request {@link CreateFlexibleIPRequest}
   * @returns A Promise of FlexibleIP
   */
  createFlexibleIP = request => this.client.fetch({
    body: JSON.stringify(marshalCreateFlexibleIPRequest(request, this.client.settings)),
    headers: jsonContentHeaders$g,
    method: 'POST',
    path: `/flexible-ip/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/fips`
  }, unmarshalFlexibleIP);

  /**
   * Get an existing flexible IP. Retrieve information about an existing
   * flexible IP, specified by its ID and zone. Its full details, including
   * Project ID, description and status, are returned in the response object.
   *
   * @param request - The request {@link GetFlexibleIPRequest}
   * @returns A Promise of FlexibleIP
   */
  getFlexibleIP = request => this.client.fetch({
    method: 'GET',
    path: `/flexible-ip/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/fips/${validatePathParam('fipId', request.fipId)}`
  }, unmarshalFlexibleIP);

  /**
   * Waits for {@link FlexibleIP} to be in a final state.
   *
   * @param request - The request {@link GetFlexibleIPRequest}
   * @param options - The waiting options
   * @returns A Promise of FlexibleIP
   */
  waitForFlexibleIP = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!FLEXIBLE_IP_TRANSIENT_STATUSES.includes(res.status))), this.getFlexibleIP, request, options);
  pageOfListFlexibleIPs = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/flexible-ip/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/fips`,
    urlParams: urlParams(['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId], ['server_ids', request.serverIds], ['status', request.status], ['tags', request.tags])
  }, unmarshalListFlexibleIPsResponse);

  /**
   * List flexible IPs. List all flexible IPs within a given zone.
   *
   * @param request - The request {@link ListFlexibleIPsRequest}
   * @returns A Promise of ListFlexibleIPsResponse
   */
  listFlexibleIPs = (request = {}) => enrichForPagination('flexibleIps', this.pageOfListFlexibleIPs, request);

  /**
   * Update an existing flexible IP. Update the parameters of an existing
   * flexible IP, specified by its ID and zone. These parameters include tags
   * and description.
   *
   * @param request - The request {@link UpdateFlexibleIPRequest}
   * @returns A Promise of FlexibleIP
   */
  updateFlexibleIP = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateFlexibleIPRequest(request, this.client.settings)),
    headers: jsonContentHeaders$g,
    method: 'PATCH',
    path: `/flexible-ip/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/fips/${validatePathParam('fipId', request.fipId)}`
  }, unmarshalFlexibleIP);

  /**
   * Delete an existing flexible IP. Delete an existing flexible IP, specified
   * by its ID and zone. Note that deleting a flexible IP is permanent and
   * cannot be undone.
   *
   * @param request - The request {@link DeleteFlexibleIPRequest}
   */
  deleteFlexibleIP = request => this.client.fetch({
    method: 'DELETE',
    path: `/flexible-ip/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/fips/${validatePathParam('fipId', request.fipId)}`
  });

  /**
   * Attach an existing flexible IP to a server. Attach an existing flexible IP
   * to a specified Elastic Metal server.
   *
   * @param request - The request {@link AttachFlexibleIPRequest}
   * @returns A Promise of AttachFlexibleIPsResponse
   */
  attachFlexibleIP = request => this.client.fetch({
    body: JSON.stringify(marshalAttachFlexibleIPRequest(request, this.client.settings)),
    headers: jsonContentHeaders$g,
    method: 'POST',
    path: `/flexible-ip/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/fips/attach`
  }, unmarshalAttachFlexibleIPsResponse);

  /**
   * Detach an existing flexible IP from a server. Detach an existing flexible
   * IP from a specified Elastic Metal server.
   *
   * @param request - The request {@link DetachFlexibleIPRequest}
   * @returns A Promise of DetachFlexibleIPsResponse
   */
  detachFlexibleIP = request => this.client.fetch({
    body: JSON.stringify(marshalDetachFlexibleIPRequest(request, this.client.settings)),
    headers: jsonContentHeaders$g,
    method: 'POST',
    path: `/flexible-ip/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/fips/detach`
  }, unmarshalDetachFlexibleIPsResponse);

  /**
   * Generate a virtual MAC address on an existing flexible IP. Generate a
   * virtual MAC (Media Access Control) address on an existing flexible IP.
   *
   * @param request - The request {@link GenerateMACAddrRequest}
   * @returns A Promise of FlexibleIP
   */
  generateMACAddr = request => this.client.fetch({
    body: JSON.stringify(marshalGenerateMACAddrRequest(request, this.client.settings)),
    headers: jsonContentHeaders$g,
    method: 'POST',
    path: `/flexible-ip/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/fips/${validatePathParam('fipId', request.fipId)}/mac`
  }, unmarshalFlexibleIP);

  /**
   * Duplicate a virtual MAC address to another flexible IP. Duplicate a virtual
   * MAC address from a given flexible IP to another flexible IP attached to the
   * same server.
   *
   * @param request - The request {@link DuplicateMACAddrRequest}
   * @returns A Promise of FlexibleIP
   */
  duplicateMACAddr = request => this.client.fetch({
    body: JSON.stringify(marshalDuplicateMACAddrRequest(request, this.client.settings)),
    headers: jsonContentHeaders$g,
    method: 'POST',
    path: `/flexible-ip/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/fips/${validatePathParam('fipId', request.fipId)}/mac/duplicate`
  }, unmarshalFlexibleIP);

  /**
   * Relocate an existing virtual MAC address to a different flexible IP.
   * Relocate a virtual MAC (Media Access Control) address from an existing
   * flexible IP to a different flexible IP.
   *
   * @param request - The request {@link MoveMACAddrRequest}
   * @returns A Promise of FlexibleIP
   */
  moveMACAddr = request => this.client.fetch({
    body: JSON.stringify(marshalMoveMACAddrRequest(request, this.client.settings)),
    headers: jsonContentHeaders$g,
    method: 'POST',
    path: `/flexible-ip/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/fips/${validatePathParam('fipId', request.fipId)}/mac/move`
  }, unmarshalFlexibleIP);

  /**
   * Detach a given virtual MAC address from an existing flexible IP. Detach a
   * given MAC (Media Access Control) address from an existing flexible IP.
   *
   * @param request - The request {@link DeleteMACAddrRequest}
   */
  deleteMACAddr = request => this.client.fetch({
    method: 'DELETE',
    path: `/flexible-ip/v1alpha1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/fips/${validatePathParam('fipId', request.fipId)}/mac`
  });
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

const ListFlexibleIPsRequest = {
  page: {
    greaterThan: 0
  },
  pageSize: {
    greaterThan: 0,
    lessThanOrEqual: 100
  }
};

var validationRules_gen$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ListFlexibleIPsRequest: ListFlexibleIPsRequest
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen$f = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API$i,
  FLEXIBLE_IP_TRANSIENT_STATUSES: FLEXIBLE_IP_TRANSIENT_STATUSES,
  MAC_ADDRESS_TRANSIENT_STATUSES: MAC_ADDRESS_TRANSIENT_STATUSES,
  ValidationRules: validationRules_gen$3
});

var index$k = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1alpha1: index_gen$f
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

/** Lists transient statutes of the enum {@link CronStatus}. */
const CRON_TRANSIENT_STATUSES = ['deleting', 'creating', 'pending'];

/** Lists transient statutes of the enum {@link DomainStatus}. */
const DOMAIN_TRANSIENT_STATUSES$1 = ['deleting', 'creating', 'pending'];

/** Lists transient statutes of the enum {@link FunctionStatus}. */
const FUNCTION_TRANSIENT_STATUSES = ['deleting', 'creating', 'pending'];

/** Lists transient statutes of the enum {@link NamespaceStatus}. */
const NAMESPACE_TRANSIENT_STATUSES$1 = ['deleting', 'creating', 'pending'];

/** Lists transient statutes of the enum {@link TokenStatus}. */
const TOKEN_TRANSIENT_STATUSES = ['deleting', 'creating'];

/** Lists transient statutes of the enum {@link TriggerStatus}. */
const TRIGGER_TRANSIENT_STATUSES = ['deleting', 'creating', 'pending'];

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalSecretHashedValue = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SecretHashedValue' failed as data isn't a dictionary.`);
  }
  return {
    hashedValue: data.hashed_value,
    key: data.key
  };
};
const unmarshalTriggerMnqNatsClientConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'TriggerMnqNatsClientConfig' failed as data isn't a dictionary.`);
  }
  return {
    mnqCredentialId: data.mnq_credential_id,
    mnqNamespaceId: data.mnq_namespace_id,
    mnqProjectId: data.mnq_project_id,
    mnqRegion: data.mnq_region,
    subject: data.subject
  };
};
const unmarshalTriggerMnqSqsClientConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'TriggerMnqSqsClientConfig' failed as data isn't a dictionary.`);
  }
  return {
    mnqCredentialId: data.mnq_credential_id,
    mnqNamespaceId: data.mnq_namespace_id,
    mnqProjectId: data.mnq_project_id,
    mnqRegion: data.mnq_region,
    queue: data.queue
  };
};
const unmarshalTriggerSqsClientConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'TriggerSqsClientConfig' failed as data isn't a dictionary.`);
  }
  return {
    accessKey: data.access_key,
    endpoint: data.endpoint,
    queueUrl: data.queue_url,
    secretKey: data.secret_key
  };
};
const unmarshalCron = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Cron' failed as data isn't a dictionary.`);
  }
  return {
    args: data.args,
    functionId: data.function_id,
    id: data.id,
    name: data.name,
    schedule: data.schedule,
    status: data.status
  };
};
const unmarshalDomain$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Domain' failed as data isn't a dictionary.`);
  }
  return {
    errorMessage: data.error_message,
    functionId: data.function_id,
    hostname: data.hostname,
    id: data.id,
    status: data.status,
    url: data.url
  };
};
const unmarshalFunction = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Function' failed as data isn't a dictionary.`);
  }
  return {
    buildMessage: data.build_message,
    cpuLimit: data.cpu_limit,
    description: data.description,
    domainName: data.domain_name,
    environmentVariables: data.environment_variables,
    errorMessage: data.error_message,
    handler: data.handler,
    httpOption: data.http_option,
    id: data.id,
    maxScale: data.max_scale,
    memoryLimit: data.memory_limit,
    minScale: data.min_scale,
    name: data.name,
    namespaceId: data.namespace_id,
    privacy: data.privacy,
    region: data.region,
    runtime: data.runtime,
    runtimeMessage: data.runtime_message,
    secretEnvironmentVariables: unmarshalArrayOfObject(data.secret_environment_variables, unmarshalSecretHashedValue),
    status: data.status,
    timeout: data.timeout
  };
};
const unmarshalLog = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Log' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    level: data.level,
    message: data.message,
    source: data.source,
    stream: data.stream,
    timestamp: unmarshalDate(data.timestamp)
  };
};
const unmarshalNamespace$2 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Namespace' failed as data isn't a dictionary.`);
  }
  return {
    description: data.description,
    environmentVariables: data.environment_variables,
    errorMessage: data.error_message,
    id: data.id,
    name: data.name,
    organizationId: data.organization_id,
    projectId: data.project_id,
    region: data.region,
    registryEndpoint: data.registry_endpoint,
    registryNamespaceId: data.registry_namespace_id,
    secretEnvironmentVariables: unmarshalArrayOfObject(data.secret_environment_variables, unmarshalSecretHashedValue),
    status: data.status
  };
};
const unmarshalRuntime = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Runtime' failed as data isn't a dictionary.`);
  }
  return {
    codeSample: data.code_sample,
    defaultHandler: data.default_handler,
    extension: data.extension,
    implementation: data.implementation,
    language: data.language,
    logoUrl: data.logo_url,
    name: data.name,
    status: data.status,
    statusMessage: data.status_message,
    version: data.version
  };
};
const unmarshalToken = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Token' failed as data isn't a dictionary.`);
  }
  return {
    description: data.description,
    expiresAt: unmarshalDate(data.expires_at),
    functionId: data.function_id,
    id: data.id,
    namespaceId: data.namespace_id,
    publicKey: data.public_key,
    status: data.status,
    token: data.token
  };
};
const unmarshalTrigger = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Trigger' failed as data isn't a dictionary.`);
  }
  return {
    description: data.description,
    errorMessage: data.error_message,
    functionId: data.function_id,
    id: data.id,
    inputType: data.input_type,
    name: data.name,
    scwNatsConfig: data.scw_nats_config ? unmarshalTriggerMnqNatsClientConfig(data.scw_nats_config) : undefined,
    scwSqsConfig: data.scw_sqs_config ? unmarshalTriggerMnqSqsClientConfig(data.scw_sqs_config) : undefined,
    sqsConfig: data.sqs_config ? unmarshalTriggerSqsClientConfig(data.sqs_config) : undefined,
    status: data.status
  };
};
const unmarshalDownloadURL = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DownloadURL' failed as data isn't a dictionary.`);
  }
  return {
    headers: data.headers,
    url: data.url
  };
};
const unmarshalListCronsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListCronsResponse' failed as data isn't a dictionary.`);
  }
  return {
    crons: unmarshalArrayOfObject(data.crons, unmarshalCron),
    totalCount: data.total_count
  };
};
const unmarshalListDomainsResponse$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListDomainsResponse' failed as data isn't a dictionary.`);
  }
  return {
    domains: unmarshalArrayOfObject(data.domains, unmarshalDomain$1),
    totalCount: data.total_count
  };
};
const unmarshalListFunctionRuntimesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListFunctionRuntimesResponse' failed as data isn't a dictionary.`);
  }
  return {
    runtimes: unmarshalArrayOfObject(data.runtimes, unmarshalRuntime),
    totalCount: data.total_count
  };
};
const unmarshalListFunctionsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListFunctionsResponse' failed as data isn't a dictionary.`);
  }
  return {
    functions: unmarshalArrayOfObject(data.functions, unmarshalFunction),
    totalCount: data.total_count
  };
};
const unmarshalListLogsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListLogsResponse' failed as data isn't a dictionary.`);
  }
  return {
    logs: unmarshalArrayOfObject(data.logs, unmarshalLog),
    totalCount: data.total_count
  };
};
const unmarshalListNamespacesResponse$2 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListNamespacesResponse' failed as data isn't a dictionary.`);
  }
  return {
    namespaces: unmarshalArrayOfObject(data.namespaces, unmarshalNamespace$2),
    totalCount: data.total_count
  };
};
const unmarshalListTokensResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListTokensResponse' failed as data isn't a dictionary.`);
  }
  return {
    tokens: unmarshalArrayOfObject(data.tokens, unmarshalToken),
    totalCount: data.total_count
  };
};
const unmarshalListTriggersResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListTriggersResponse' failed as data isn't a dictionary.`);
  }
  return {
    totalCount: data.total_count,
    triggers: unmarshalArrayOfObject(data.triggers, unmarshalTrigger)
  };
};
const unmarshalUploadURL = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'UploadURL' failed as data isn't a dictionary.`);
  }
  return {
    headers: data.headers,
    url: data.url
  };
};
const marshalCreateTriggerRequestMnqNatsClientConfig = (request, defaults) => ({
  mnq_namespace_id: request.mnqNamespaceId,
  mnq_project_id: request.mnqProjectId,
  mnq_region: request.mnqRegion,
  subject: request.subject
});
const marshalCreateTriggerRequestMnqSqsClientConfig = (request, defaults) => ({
  mnq_namespace_id: request.mnqNamespaceId,
  mnq_project_id: request.mnqProjectId,
  mnq_region: request.mnqRegion,
  queue: request.queue
});
const marshalCreateTriggerRequestSqsClientConfig = (request, defaults) => ({
  access_key: request.accessKey,
  endpoint: request.endpoint,
  queue_url: request.queueUrl,
  secret_key: request.secretKey
});
const marshalSecret = (request, defaults) => ({
  key: request.key,
  value: request.value
});
const marshalUpdateTriggerRequestSqsClientConfig = (request, defaults) => ({
  access_key: request.accessKey,
  secret_key: request.secretKey
});
const marshalCreateCronRequest = (request, defaults) => ({
  args: request.args,
  function_id: request.functionId,
  name: request.name,
  schedule: request.schedule
});
const marshalCreateDomainRequest$1 = (request, defaults) => ({
  function_id: request.functionId,
  hostname: request.hostname
});
const marshalCreateFunctionRequest = (request, defaults) => ({
  description: request.description,
  environment_variables: request.environmentVariables,
  handler: request.handler,
  http_option: request.httpOption ?? 'unknown_http_option',
  max_scale: request.maxScale,
  memory_limit: request.memoryLimit,
  min_scale: request.minScale,
  name: request.name || randomName('fn'),
  namespace_id: request.namespaceId,
  privacy: request.privacy ?? 'unknown_privacy',
  runtime: request.runtime ?? 'unknown_runtime',
  secret_environment_variables: request.secretEnvironmentVariables ? request.secretEnvironmentVariables.map(elt => marshalSecret(elt)) : undefined,
  timeout: request.timeout
});
const marshalCreateNamespaceRequest$2 = (request, defaults) => ({
  description: request.description,
  environment_variables: request.environmentVariables,
  name: request.name || randomName('ns'),
  project_id: request.projectId ?? defaults.defaultProjectId,
  secret_environment_variables: request.secretEnvironmentVariables ? request.secretEnvironmentVariables.map(elt => marshalSecret(elt)) : undefined
});
const marshalCreateTokenRequest = (request, defaults) => ({
  description: request.description,
  expires_at: request.expiresAt,
  ...resolveOneOf([{
    param: 'function_id',
    value: request.functionId
  }, {
    param: 'namespace_id',
    value: request.namespaceId
  }])
});
const marshalCreateTriggerRequest = (request, defaults) => ({
  description: request.description,
  function_id: request.functionId,
  name: request.name,
  ...resolveOneOf([{
    param: 'scw_sqs_config',
    value: request.scwSqsConfig ? marshalCreateTriggerRequestMnqSqsClientConfig(request.scwSqsConfig) : undefined
  }, {
    param: 'sqs_config',
    value: request.sqsConfig ? marshalCreateTriggerRequestSqsClientConfig(request.sqsConfig) : undefined
  }, {
    param: 'scw_nats_config',
    value: request.scwNatsConfig ? marshalCreateTriggerRequestMnqNatsClientConfig(request.scwNatsConfig) : undefined
  }])
});
const marshalUpdateCronRequest = (request, defaults) => ({
  args: request.args,
  function_id: request.functionId,
  name: request.name,
  schedule: request.schedule
});
const marshalUpdateFunctionRequest = (request, defaults) => ({
  description: request.description,
  environment_variables: request.environmentVariables,
  handler: request.handler,
  http_option: request.httpOption ?? 'unknown_http_option',
  max_scale: request.maxScale,
  memory_limit: request.memoryLimit,
  min_scale: request.minScale,
  privacy: request.privacy ?? 'unknown_privacy',
  redeploy: request.redeploy,
  runtime: request.runtime ?? 'unknown_runtime',
  secret_environment_variables: request.secretEnvironmentVariables ? request.secretEnvironmentVariables.map(elt => marshalSecret(elt)) : undefined,
  timeout: request.timeout
});
const marshalUpdateNamespaceRequest$2 = (request, defaults) => ({
  description: request.description,
  environment_variables: request.environmentVariables,
  secret_environment_variables: request.secretEnvironmentVariables ? request.secretEnvironmentVariables.map(elt => marshalSecret(elt)) : undefined
});
const marshalUpdateTriggerRequest = (request, defaults) => ({
  description: request.description,
  name: request.name,
  ...resolveOneOf([{
    param: 'sqs_config',
    value: request.sqsConfig ? marshalUpdateTriggerRequestSqsClientConfig(request.sqsConfig) : undefined
  }])
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$f = {
  'Content-Type': 'application/json; charset=utf-8'
};

/** Serverless Functions API. */
let API$h = class API extends API$q {
  /** Lists the available regions of the API. */
  static LOCALITIES = ['fr-par', 'nl-ams', 'pl-waw'];
  pageOfListNamespaces = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/namespaces`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListNamespacesResponse$2);

  /**
   * List all your namespaces. List all existing namespaces in the specified
   * region.
   *
   * @param request - The request {@link ListNamespacesRequest}
   * @returns A Promise of ListNamespacesResponse
   */
  listNamespaces = (request = {}) => enrichForPagination('namespaces', this.pageOfListNamespaces, request);

  /**
   * Get a namespace. Get the namespace associated with the specified ID.
   *
   * @param request - The request {@link GetNamespaceRequest}
   * @returns A Promise of Namespace
   */
  getNamespace = request => this.client.fetch({
    method: 'GET',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/namespaces/${validatePathParam('namespaceId', request.namespaceId)}`
  }, unmarshalNamespace$2);

  /**
   * Waits for {@link Namespace} to be in a final state.
   *
   * @param request - The request {@link GetNamespaceRequest}
   * @param options - The waiting options
   * @returns A Promise of Namespace
   */
  waitForNamespace = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!NAMESPACE_TRANSIENT_STATUSES$1.includes(res.status))), this.getNamespace, request, options);

  /**
   * Create a new namespace. Create a new namespace in a specified Organization
   * or Proejct.
   *
   * @param request - The request {@link CreateNamespaceRequest}
   * @returns A Promise of Namespace
   */
  createNamespace = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalCreateNamespaceRequest$2(request, this.client.settings)),
    headers: jsonContentHeaders$f,
    method: 'POST',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/namespaces`
  }, unmarshalNamespace$2);

  /**
   * Update an existing namespace. Update the namespace associated with the
   * specified ID.
   *
   * @param request - The request {@link UpdateNamespaceRequest}
   * @returns A Promise of Namespace
   */
  updateNamespace = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateNamespaceRequest$2(request, this.client.settings)),
    headers: jsonContentHeaders$f,
    method: 'PATCH',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/namespaces/${validatePathParam('namespaceId', request.namespaceId)}`
  }, unmarshalNamespace$2);

  /**
   * Delete an existing namespace. Delete the namespace associated with the
   * specified ID.
   *
   * @param request - The request {@link DeleteNamespaceRequest}
   * @returns A Promise of Namespace
   */
  deleteNamespace = request => this.client.fetch({
    method: 'DELETE',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/namespaces/${validatePathParam('namespaceId', request.namespaceId)}`
  }, unmarshalNamespace$2);
  pageOfListFunctions = request => this.client.fetch({
    method: 'GET',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/functions`,
    urlParams: urlParams(['name', request.name], ['namespace_id', request.namespaceId], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListFunctionsResponse);

  /**
   * List all your functions.
   *
   * @param request - The request {@link ListFunctionsRequest}
   * @returns A Promise of ListFunctionsResponse
   */
  listFunctions = request => enrichForPagination('functions', this.pageOfListFunctions, request);

  /**
   * Get a function. Get the function associated with the specified ID.
   *
   * @param request - The request {@link GetFunctionRequest}
   * @returns A Promise of Function
   */
  getFunction = request => this.client.fetch({
    method: 'GET',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/functions/${validatePathParam('functionId', request.functionId)}`
  }, unmarshalFunction);

  /**
   * Waits for {@link Function} to be in a final state.
   *
   * @param request - The request {@link GetFunctionRequest}
   * @param options - The waiting options
   * @returns A Promise of Function
   */
  waitForFunction = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!FUNCTION_TRANSIENT_STATUSES.includes(res.status))), this.getFunction, request, options);

  /**
   * Create a new function. Create a new function in the specified region for a
   * specified Organization or Project.
   *
   * @param request - The request {@link CreateFunctionRequest}
   * @returns A Promise of Function
   */
  createFunction = request => this.client.fetch({
    body: JSON.stringify(marshalCreateFunctionRequest(request, this.client.settings)),
    headers: jsonContentHeaders$f,
    method: 'POST',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/functions`
  }, unmarshalFunction);

  /**
   * Update an existing function. Update the function associated with the
   * specified ID.
   *
   * @param request - The request {@link UpdateFunctionRequest}
   * @returns A Promise of Function
   */
  updateFunction = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateFunctionRequest(request, this.client.settings)),
    headers: jsonContentHeaders$f,
    method: 'PATCH',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/functions/${validatePathParam('functionId', request.functionId)}`
  }, unmarshalFunction);

  /**
   * Delete a function. Delete the function associated with the specified ID.
   *
   * @param request - The request {@link DeleteFunctionRequest}
   * @returns A Promise of Function
   */
  deleteFunction = request => this.client.fetch({
    method: 'DELETE',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/functions/${validatePathParam('functionId', request.functionId)}`
  }, unmarshalFunction);

  /**
   * Deploy a function. Deploy a function associated with the specified ID.
   *
   * @param request - The request {@link DeployFunctionRequest}
   * @returns A Promise of Function
   */
  deployFunction = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$f,
    method: 'POST',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/functions/${validatePathParam('functionId', request.functionId)}/deploy`
  }, unmarshalFunction);

  /**
   * List function runtimes. List available function runtimes.
   *
   * @param request - The request {@link ListFunctionRuntimesRequest}
   * @returns A Promise of ListFunctionRuntimesResponse
   */
  listFunctionRuntimes = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/runtimes`
  }, unmarshalListFunctionRuntimesResponse);

  /**
   * Get an upload URL of a function. Get an upload URL of a function associated
   * with the specified ID.
   *
   * @param request - The request {@link GetFunctionUploadURLRequest}
   * @returns A Promise of UploadURL
   */
  getFunctionUploadURL = request => this.client.fetch({
    method: 'GET',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/functions/${validatePathParam('functionId', request.functionId)}/upload-url`,
    urlParams: urlParams(['content_length', request.contentLength])
  }, unmarshalUploadURL);

  /**
   * Get a download URL of a function. Get a download URL for a function
   * associated with the specified ID.
   *
   * @param request - The request {@link GetFunctionDownloadURLRequest}
   * @returns A Promise of DownloadURL
   */
  getFunctionDownloadURL = request => this.client.fetch({
    method: 'GET',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/functions/${validatePathParam('functionId', request.functionId)}/download-url`
  }, unmarshalDownloadURL);
  pageOfListCrons = request => this.client.fetch({
    method: 'GET',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/crons`,
    urlParams: urlParams(['function_id', request.functionId], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListCronsResponse);

  /**
   * List all crons. List all the cronjobs in a specified region.
   *
   * @param request - The request {@link ListCronsRequest}
   * @returns A Promise of ListCronsResponse
   */
  listCrons = request => enrichForPagination('crons', this.pageOfListCrons, request);

  /**
   * Get a cron. Get the cron associated with the specified ID.
   *
   * @param request - The request {@link GetCronRequest}
   * @returns A Promise of Cron
   */
  getCron = request => this.client.fetch({
    method: 'GET',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/crons/${validatePathParam('cronId', request.cronId)}`
  }, unmarshalCron);

  /**
   * Waits for {@link Cron} to be in a final state.
   *
   * @param request - The request {@link GetCronRequest}
   * @param options - The waiting options
   * @returns A Promise of Cron
   */
  waitForCron = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!CRON_TRANSIENT_STATUSES.includes(res.status))), this.getCron, request, options);

  /**
   * Create a new cron. Create a new cronjob for a function with the specified
   * ID.
   *
   * @param request - The request {@link CreateCronRequest}
   * @returns A Promise of Cron
   */
  createCron = request => this.client.fetch({
    body: JSON.stringify(marshalCreateCronRequest(request, this.client.settings)),
    headers: jsonContentHeaders$f,
    method: 'POST',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/crons`
  }, unmarshalCron);

  /**
   * Update an existing cron. Update the cron associated with the specified ID.
   *
   * @param request - The request {@link UpdateCronRequest}
   * @returns A Promise of Cron
   */
  updateCron = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateCronRequest(request, this.client.settings)),
    headers: jsonContentHeaders$f,
    method: 'PATCH',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/crons/${validatePathParam('cronId', request.cronId)}`
  }, unmarshalCron);

  /**
   * Delete an existing cron. Delete the cron associated with the specified ID.
   *
   * @param request - The request {@link DeleteCronRequest}
   * @returns A Promise of Cron
   */
  deleteCron = request => this.client.fetch({
    method: 'DELETE',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/crons/${validatePathParam('cronId', request.cronId)}`
  }, unmarshalCron);
  pageOfListLogs = request => this.client.fetch({
    method: 'GET',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/functions/${validatePathParam('functionId', request.functionId)}/logs`,
    urlParams: urlParams(['order_by', request.orderBy ?? 'timestamp_desc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListLogsResponse);

  /**
   * List application logs. List the application logs of the function with the
   * specified ID.
   *
   * @param request - The request {@link ListLogsRequest}
   * @returns A Promise of ListLogsResponse
   */
  listLogs = request => enrichForPagination('logs', this.pageOfListLogs, request);
  pageOfListDomains = request => this.client.fetch({
    method: 'GET',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/domains`,
    urlParams: urlParams(['function_id', request.functionId], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListDomainsResponse$1);

  /**
   * List all domain name bindings. List all domain name bindings in a specified
   * region.
   *
   * @param request - The request {@link ListDomainsRequest}
   * @returns A Promise of ListDomainsResponse
   */
  listDomains = request => enrichForPagination('domains', this.pageOfListDomains, request);

  /**
   * Get a domain name binding. Get a domain name binding for the function with
   * the specified ID.
   *
   * @param request - The request {@link GetDomainRequest}
   * @returns A Promise of Domain
   */
  getDomain = request => this.client.fetch({
    method: 'GET',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/domains/${validatePathParam('domainId', request.domainId)}`
  }, unmarshalDomain$1);

  /**
   * Waits for {@link Domain} to be in a final state.
   *
   * @param request - The request {@link GetDomainRequest}
   * @param options - The waiting options
   * @returns A Promise of Domain
   */
  waitForDomain = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!DOMAIN_TRANSIENT_STATUSES$1.includes(res.status))), this.getDomain, request, options);

  /**
   * Create a domain name binding. Create a domain name binding for the function
   * with the specified ID.
   *
   * @param request - The request {@link CreateDomainRequest}
   * @returns A Promise of Domain
   */
  createDomain = request => this.client.fetch({
    body: JSON.stringify(marshalCreateDomainRequest$1(request, this.client.settings)),
    headers: jsonContentHeaders$f,
    method: 'POST',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/domains`
  }, unmarshalDomain$1);

  /**
   * Delete a domain name binding. Delete a domain name binding for the function
   * with the specified ID.
   *
   * @param request - The request {@link DeleteDomainRequest}
   * @returns A Promise of Domain
   */
  deleteDomain = request => this.client.fetch({
    method: 'DELETE',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/domains/${validatePathParam('domainId', request.domainId)}`
  }, unmarshalDomain$1);

  /**
   * @deprecated
   * @param request - The request {@link IssueJWTRequest}
   * @returns A Promise of Token
   */
  issueJWT = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/issue-jwt`,
    urlParams: urlParams(['expires_at', request.expiresAt], ...Object.entries(resolveOneOf([{
      param: 'function_id',
      value: request.functionId
    }, {
      param: 'namespace_id',
      value: request.namespaceId
    }])))
  }, unmarshalToken);

  /**
   * Create a new revocable token.
   *
   * @param request - The request {@link CreateTokenRequest}
   * @returns A Promise of Token
   */
  createToken = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalCreateTokenRequest(request, this.client.settings)),
    headers: jsonContentHeaders$f,
    method: 'POST',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/tokens`
  }, unmarshalToken);

  /**
   * Get a token.
   *
   * @param request - The request {@link GetTokenRequest}
   * @returns A Promise of Token
   */
  getToken = request => this.client.fetch({
    method: 'GET',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/tokens/${validatePathParam('tokenId', request.tokenId)}`
  }, unmarshalToken);

  /**
   * Waits for {@link Token} to be in a final state.
   *
   * @param request - The request {@link GetTokenRequest}
   * @param options - The waiting options
   * @returns A Promise of Token
   */
  waitForToken = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!TOKEN_TRANSIENT_STATUSES.includes(res.status))), this.getToken, request, options);
  pageOfListTokens = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/tokens`,
    urlParams: urlParams(['function_id', request.functionId], ['namespace_id', request.namespaceId], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListTokensResponse);

  /**
   * List all tokens.
   *
   * @param request - The request {@link ListTokensRequest}
   * @returns A Promise of ListTokensResponse
   */
  listTokens = (request = {}) => enrichForPagination('tokens', this.pageOfListTokens, request);

  /**
   * Delete a token.
   *
   * @param request - The request {@link DeleteTokenRequest}
   * @returns A Promise of Token
   */
  deleteToken = request => this.client.fetch({
    method: 'DELETE',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/tokens/${validatePathParam('tokenId', request.tokenId)}`
  }, unmarshalToken);
  createTrigger = request => this.client.fetch({
    body: JSON.stringify(marshalCreateTriggerRequest(request, this.client.settings)),
    headers: jsonContentHeaders$f,
    method: 'POST',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/triggers`
  }, unmarshalTrigger);
  getTrigger = request => this.client.fetch({
    method: 'GET',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/triggers/${validatePathParam('triggerId', request.triggerId)}`
  }, unmarshalTrigger);

  /**
   * Waits for {@link Trigger} to be in a final state.
   *
   * @param request - The request {@link GetTriggerRequest}
   * @param options - The waiting options
   * @returns A Promise of Trigger
   */
  waitForTrigger = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!TRIGGER_TRANSIENT_STATUSES.includes(res.status))), this.getTrigger, request, options);
  pageOfListTriggers = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/triggers`,
    urlParams: urlParams(['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ...Object.entries(resolveOneOf([{
      default: this.client.settings.defaultProjectId,
      param: 'project_id',
      value: request.projectId
    }, {
      param: 'function_id',
      value: request.functionId
    }, {
      param: 'namespace_id',
      value: request.namespaceId
    }])))
  }, unmarshalListTriggersResponse);
  listTriggers = (request = {}) => enrichForPagination('triggers', this.pageOfListTriggers, request);
  updateTrigger = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateTriggerRequest(request, this.client.settings)),
    headers: jsonContentHeaders$f,
    method: 'PATCH',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/triggers/${validatePathParam('triggerId', request.triggerId)}`
  }, unmarshalTrigger);
  deleteTrigger = request => this.client.fetch({
    method: 'DELETE',
    path: `/functions/v1beta1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/triggers/${validatePathParam('triggerId', request.triggerId)}`
  }, unmarshalTrigger);
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen$e = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API$h,
  CRON_TRANSIENT_STATUSES: CRON_TRANSIENT_STATUSES,
  DOMAIN_TRANSIENT_STATUSES: DOMAIN_TRANSIENT_STATUSES$1,
  FUNCTION_TRANSIENT_STATUSES: FUNCTION_TRANSIENT_STATUSES,
  NAMESPACE_TRANSIENT_STATUSES: NAMESPACE_TRANSIENT_STATUSES$1,
  TOKEN_TRANSIENT_STATUSES: TOKEN_TRANSIENT_STATUSES,
  TRIGGER_TRANSIENT_STATUSES: TRIGGER_TRANSIENT_STATUSES
});

var index$j = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1beta1: index_gen$e
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalAPIKey = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'APIKey' failed as data isn't a dictionary.`);
  }
  return {
    accessKey: data.access_key,
    applicationId: data.application_id,
    createdAt: unmarshalDate(data.created_at),
    creationIp: data.creation_ip,
    defaultProjectId: data.default_project_id,
    description: data.description,
    editable: data.editable,
    expiresAt: unmarshalDate(data.expires_at),
    secretKey: data.secret_key,
    updatedAt: unmarshalDate(data.updated_at),
    userId: data.user_id
  };
};
const unmarshalApplication = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Application' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    description: data.description,
    editable: data.editable,
    id: data.id,
    name: data.name,
    nbApiKeys: data.nb_api_keys,
    organizationId: data.organization_id,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalGroup = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Group' failed as data isn't a dictionary.`);
  }
  return {
    applicationIds: data.application_ids,
    createdAt: unmarshalDate(data.created_at),
    description: data.description,
    id: data.id,
    name: data.name,
    organizationId: data.organization_id,
    updatedAt: unmarshalDate(data.updated_at),
    userIds: data.user_ids
  };
};
const unmarshalJWT = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'JWT' failed as data isn't a dictionary.`);
  }
  return {
    audienceId: data.audience_id,
    createdAt: unmarshalDate(data.created_at),
    expiresAt: unmarshalDate(data.expires_at),
    ip: data.ip,
    issuerId: data.issuer_id,
    jti: data.jti,
    updatedAt: unmarshalDate(data.updated_at),
    userAgent: data.user_agent
  };
};
const unmarshalPermissionSet = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'PermissionSet' failed as data isn't a dictionary.`);
  }
  return {
    categories: data.categories,
    description: data.description,
    id: data.id,
    name: data.name,
    scopeType: data.scope_type
  };
};
const unmarshalPolicy = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Policy' failed as data isn't a dictionary.`);
  }
  return {
    applicationId: data.application_id,
    createdAt: unmarshalDate(data.created_at),
    description: data.description,
    editable: data.editable,
    groupId: data.group_id,
    id: data.id,
    name: data.name,
    nbPermissionSets: data.nb_permission_sets,
    nbRules: data.nb_rules,
    nbScopes: data.nb_scopes,
    noPrincipal: data.no_principal,
    organizationId: data.organization_id,
    updatedAt: unmarshalDate(data.updated_at),
    userId: data.user_id
  };
};
const unmarshalQuotum = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Quotum' failed as data isn't a dictionary.`);
  }
  return {
    limit: data.limit,
    name: data.name,
    unlimited: data.unlimited
  };
};
const unmarshalRule = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Rule' failed as data isn't a dictionary.`);
  }
  return {
    accountRootUserId: data.account_root_user_id,
    id: data.id,
    organizationId: data.organization_id,
    permissionSetNames: data.permission_set_names,
    permissionSetsScopeType: data.permission_sets_scope_type,
    projectIds: data.project_ids
  };
};
const unmarshalSSHKey = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SSHKey' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    disabled: data.disabled,
    fingerprint: data.fingerprint,
    id: data.id,
    name: data.name,
    organizationId: data.organization_id,
    projectId: data.project_id,
    publicKey: data.public_key,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalUser$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'User' failed as data isn't a dictionary.`);
  }
  return {
    accountRootUserId: data.account_root_user_id,
    createdAt: unmarshalDate(data.created_at),
    deletable: data.deletable,
    email: data.email,
    id: data.id,
    lastLoginAt: unmarshalDate(data.last_login_at),
    mfa: data.mfa,
    organizationId: data.organization_id,
    status: data.status,
    twoFactorEnabled: data.two_factor_enabled,
    type: data.type,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalListAPIKeysResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListAPIKeysResponse' failed as data isn't a dictionary.`);
  }
  return {
    apiKeys: unmarshalArrayOfObject(data.api_keys, unmarshalAPIKey),
    totalCount: data.total_count
  };
};
const unmarshalListApplicationsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListApplicationsResponse' failed as data isn't a dictionary.`);
  }
  return {
    applications: unmarshalArrayOfObject(data.applications, unmarshalApplication),
    totalCount: data.total_count
  };
};
const unmarshalListGroupsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListGroupsResponse' failed as data isn't a dictionary.`);
  }
  return {
    groups: unmarshalArrayOfObject(data.groups, unmarshalGroup),
    totalCount: data.total_count
  };
};
const unmarshalListJWTsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListJWTsResponse' failed as data isn't a dictionary.`);
  }
  return {
    jwts: unmarshalArrayOfObject(data.jwts, unmarshalJWT),
    totalCount: data.total_count
  };
};
const unmarshalListPermissionSetsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListPermissionSetsResponse' failed as data isn't a dictionary.`);
  }
  return {
    permissionSets: unmarshalArrayOfObject(data.permission_sets, unmarshalPermissionSet),
    totalCount: data.total_count
  };
};
const unmarshalListPoliciesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListPoliciesResponse' failed as data isn't a dictionary.`);
  }
  return {
    policies: unmarshalArrayOfObject(data.policies, unmarshalPolicy),
    totalCount: data.total_count
  };
};
const unmarshalListQuotaResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListQuotaResponse' failed as data isn't a dictionary.`);
  }
  return {
    quota: unmarshalArrayOfObject(data.quota, unmarshalQuotum),
    totalCount: data.total_count
  };
};
const unmarshalListRulesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListRulesResponse' failed as data isn't a dictionary.`);
  }
  return {
    rules: unmarshalArrayOfObject(data.rules, unmarshalRule),
    totalCount: data.total_count
  };
};
const unmarshalListSSHKeysResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListSSHKeysResponse' failed as data isn't a dictionary.`);
  }
  return {
    sshKeys: unmarshalArrayOfObject(data.ssh_keys, unmarshalSSHKey),
    totalCount: data.total_count
  };
};
const unmarshalListUsersResponse$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListUsersResponse' failed as data isn't a dictionary.`);
  }
  return {
    totalCount: data.total_count,
    users: unmarshalArrayOfObject(data.users, unmarshalUser$1)
  };
};
const unmarshalSetRulesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SetRulesResponse' failed as data isn't a dictionary.`);
  }
  return {
    rules: unmarshalArrayOfObject(data.rules, unmarshalRule)
  };
};
const marshalRuleSpecs = (request, defaults) => ({
  permission_set_names: request.permissionSetNames,
  ...resolveOneOf([{
    param: 'project_ids',
    value: request.projectIds
  }, {
    param: 'organization_id',
    value: request.organizationId
  }])
});
const marshalAddGroupMemberRequest = (request, defaults) => ({
  ...resolveOneOf([{
    param: 'user_id',
    value: request.userId
  }, {
    param: 'application_id',
    value: request.applicationId
  }])
});
const marshalCreateAPIKeyRequest = (request, defaults) => ({
  default_project_id: request.defaultProjectId,
  description: request.description,
  expires_at: request.expiresAt,
  ...resolveOneOf([{
    param: 'application_id',
    value: request.applicationId
  }, {
    param: 'user_id',
    value: request.userId
  }])
});
const marshalCreateApplicationRequest = (request, defaults) => ({
  description: request.description,
  name: request.name || randomName('app'),
  organization_id: request.organizationId ?? defaults.defaultOrganizationId
});
const marshalCreateGroupRequest = (request, defaults) => ({
  description: request.description,
  name: request.name || randomName('grp'),
  organization_id: request.organizationId ?? defaults.defaultOrganizationId
});
const marshalCreatePolicyRequest = (request, defaults) => ({
  description: request.description,
  name: request.name || randomName('pol'),
  organization_id: request.organizationId ?? defaults.defaultOrganizationId,
  rules: request.rules ? request.rules.map(elt => marshalRuleSpecs(elt)) : undefined,
  ...resolveOneOf([{
    param: 'user_id',
    value: request.userId
  }, {
    param: 'group_id',
    value: request.groupId
  }, {
    param: 'application_id',
    value: request.applicationId
  }, {
    param: 'no_principal',
    value: request.noPrincipal
  }])
});
const marshalCreateSSHKeyRequest = (request, defaults) => ({
  name: request.name || randomName('key'),
  project_id: request.projectId ?? defaults.defaultProjectId,
  public_key: request.publicKey
});
const marshalRemoveGroupMemberRequest = (request, defaults) => ({
  ...resolveOneOf([{
    param: 'user_id',
    value: request.userId
  }, {
    param: 'application_id',
    value: request.applicationId
  }])
});
const marshalSetGroupMembersRequest = (request, defaults) => ({
  application_ids: request.applicationIds,
  user_ids: request.userIds
});
const marshalSetRulesRequest = (request, defaults) => ({
  policy_id: request.policyId,
  rules: request.rules.map(elt => marshalRuleSpecs(elt))
});
const marshalUpdateAPIKeyRequest = (request, defaults) => ({
  default_project_id: request.defaultProjectId,
  description: request.description
});
const marshalUpdateApplicationRequest = (request, defaults) => ({
  description: request.description,
  name: request.name
});
const marshalUpdateGroupRequest = (request, defaults) => ({
  description: request.description,
  name: request.name
});
const marshalUpdatePolicyRequest = (request, defaults) => ({
  description: request.description,
  name: request.name,
  ...resolveOneOf([{
    param: 'user_id',
    value: request.userId
  }, {
    param: 'group_id',
    value: request.groupId
  }, {
    param: 'application_id',
    value: request.applicationId
  }, {
    param: 'no_principal',
    value: request.noPrincipal
  }])
});
const marshalUpdateSSHKeyRequest = (request, defaults) => ({
  disabled: request.disabled,
  name: request.name
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$e = {
  'Content-Type': 'application/json; charset=utf-8'
};

/** IAM API. */
let API$g = class API extends API$q {
  pageOfListSSHKeys = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/iam/v1alpha1/ssh-keys`,
    urlParams: urlParams(['disabled', request.disabled], ['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListSSHKeysResponse);

  /**
   * List SSH keys. List SSH keys. By default, the SSH keys listed are ordered
   * by creation date in ascending order. This can be modified via the
   * `order_by` field. You can define additional parameters for your query such
   * as `organization_id`, `name`, `project_id` and `disabled`.
   *
   * @param request - The request {@link ListSSHKeysRequest}
   * @returns A Promise of ListSSHKeysResponse
   */
  listSSHKeys = (request = {}) => enrichForPagination('sshKeys', this.pageOfListSSHKeys, request);

  /**
   * Create an SSH key. Add a new SSH key to a Scaleway Project. You must
   * specify the `name`, `public_key` and `project_id`.
   *
   * @param request - The request {@link CreateSSHKeyRequest}
   * @returns A Promise of SSHKey
   */
  createSSHKey = request => this.client.fetch({
    body: JSON.stringify(marshalCreateSSHKeyRequest(request, this.client.settings)),
    headers: jsonContentHeaders$e,
    method: 'POST',
    path: `/iam/v1alpha1/ssh-keys`
  }, unmarshalSSHKey);

  /**
   * Get an SSH key. Retrieve information about a given SSH key, specified by
   * the `ssh_key_id` parameter. The SSH key's full details, including `id`,
   * `name`, `public_key`, and `project_id` are returned in the response.
   *
   * @param request - The request {@link GetSSHKeyRequest}
   * @returns A Promise of SSHKey
   */
  getSSHKey = request => this.client.fetch({
    method: 'GET',
    path: `/iam/v1alpha1/ssh-keys/${validatePathParam('sshKeyId', request.sshKeyId)}`
  }, unmarshalSSHKey);

  /**
   * Update an SSH key. Update the parameters of an SSH key, including `name`
   * and `disable`.
   *
   * @param request - The request {@link UpdateSSHKeyRequest}
   * @returns A Promise of SSHKey
   */
  updateSSHKey = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateSSHKeyRequest(request, this.client.settings)),
    headers: jsonContentHeaders$e,
    method: 'PATCH',
    path: `/iam/v1alpha1/ssh-keys/${validatePathParam('sshKeyId', request.sshKeyId)}`
  }, unmarshalSSHKey);

  /**
   * Delete an SSH key. Delete a given SSH key, specified by the `ssh_key_id`.
   * Deleting an SSH is permanent, and cannot be undone. Note that you might
   * need to update any configurations that used the SSH key.
   *
   * @param request - The request {@link DeleteSSHKeyRequest}
   */
  deleteSSHKey = request => this.client.fetch({
    method: 'DELETE',
    path: `/iam/v1alpha1/ssh-keys/${validatePathParam('sshKeyId', request.sshKeyId)}`
  });
  pageOfListUsers = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/iam/v1alpha1/users`,
    urlParams: urlParams(['mfa', request.mfa], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId ?? this.client.settings.defaultOrganizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['user_ids', request.userIds])
  }, unmarshalListUsersResponse$1);

  /**
   * List users of an Organization. List the users of an Organization. By
   * default, the users listed are ordered by creation date in ascending order.
   * This can be modified via the `order_by` field. You must define the
   * `organization_id` in the query path of your request. You can also define
   * additional parameters for your query such as `user_ids`.
   *
   * @param request - The request {@link ListUsersRequest}
   * @returns A Promise of ListUsersResponse
   */
  listUsers = (request = {}) => enrichForPagination('users', this.pageOfListUsers, request);

  /**
   * Get a given user. Retrieve information about a user, specified by the
   * `user_id` parameter. The user's full details, including `id`, `email`,
   * `organization_id`, `status` and `mfa` are returned in the response.
   *
   * @param request - The request {@link GetUserRequest}
   * @returns A Promise of User
   */
  getUser = request => this.client.fetch({
    method: 'GET',
    path: `/iam/v1alpha1/users/${validatePathParam('userId', request.userId)}`
  }, unmarshalUser$1);

  /**
   * Delete a guest user from an Organization. Remove a user from an
   * Organization in which they are a guest. You must define the `user_id` in
   * your request. Note that removing a user from an Organization automatically
   * deletes their API keys, and any policies directly attached to them become
   * orphaned.
   *
   * @param request - The request {@link DeleteUserRequest}
   */
  deleteUser = request => this.client.fetch({
    method: 'DELETE',
    path: `/iam/v1alpha1/users/${validatePathParam('userId', request.userId)}`
  });
  pageOfListApplications = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/iam/v1alpha1/applications`,
    urlParams: urlParams(['application_ids', request.applicationIds], ['editable', request.editable], ['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId ?? this.client.settings.defaultOrganizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListApplicationsResponse);

  /**
   * List applications of an Organization. List the applications of an
   * Organization. By default, the applications listed are ordered by creation
   * date in ascending order. This can be modified via the `order_by` field. You
   * must define the `organization_id` in the query path of your request. You
   * can also define additional parameters for your query such as
   * `application_ids`.
   *
   * @param request - The request {@link ListApplicationsRequest}
   * @returns A Promise of ListApplicationsResponse
   */
  listApplications = (request = {}) => enrichForPagination('applications', this.pageOfListApplications, request);

  /**
   * Create a new application. Create a new application. You must define the
   * `name` parameter in the request.
   *
   * @param request - The request {@link CreateApplicationRequest}
   * @returns A Promise of Application
   */
  createApplication = request => this.client.fetch({
    body: JSON.stringify(marshalCreateApplicationRequest(request, this.client.settings)),
    headers: jsonContentHeaders$e,
    method: 'POST',
    path: `/iam/v1alpha1/applications`
  }, unmarshalApplication);

  /**
   * Get a given application. Retrieve information about an application,
   * specified by the `application_id` parameter. The application's full
   * details, including `id`, `email`, `organization_id`, `status` and
   * `two_factor_enabled` are returned in the response.
   *
   * @param request - The request {@link GetApplicationRequest}
   * @returns A Promise of Application
   */
  getApplication = request => this.client.fetch({
    method: 'GET',
    path: `/iam/v1alpha1/applications/${validatePathParam('applicationId', request.applicationId)}`
  }, unmarshalApplication);

  /**
   * Update an application. Update the parameters of an application, including
   * `name` and `description`.
   *
   * @param request - The request {@link UpdateApplicationRequest}
   * @returns A Promise of Application
   */
  updateApplication = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateApplicationRequest(request, this.client.settings)),
    headers: jsonContentHeaders$e,
    method: 'PATCH',
    path: `/iam/v1alpha1/applications/${validatePathParam('applicationId', request.applicationId)}`
  }, unmarshalApplication);

  /**
   * Delete an application. Delete an application. Note that this action is
   * irreversible and will automatically delete the application's API keys.
   * Policies attached to users and applications via this group will no longer
   * apply.
   *
   * @param request - The request {@link DeleteApplicationRequest}
   */
  deleteApplication = request => this.client.fetch({
    method: 'DELETE',
    path: `/iam/v1alpha1/applications/${validatePathParam('applicationId', request.applicationId)}`
  });
  pageOfListGroups = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/iam/v1alpha1/groups`,
    urlParams: urlParams(['application_ids', request.applicationIds], ['group_ids', request.groupIds], ['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['user_ids', request.userIds])
  }, unmarshalListGroupsResponse);

  /**
   * List groups. List groups. By default, the groups listed are ordered by
   * creation date in ascending order. This can be modified via the `order_by`
   * field. You can define additional parameters to filter your query. Use
   * `user_ids` or `application_ids` to list all groups certain users or
   * applications belong to.
   *
   * @param request - The request {@link ListGroupsRequest}
   * @returns A Promise of ListGroupsResponse
   */
  listGroups = (request = {}) => enrichForPagination('groups', this.pageOfListGroups, request);

  /**
   * Create a group. Create a new group. You must define the `name` and
   * `organization_id` parameters in the request.
   *
   * @param request - The request {@link CreateGroupRequest}
   * @returns A Promise of Group
   */
  createGroup = request => this.client.fetch({
    body: JSON.stringify(marshalCreateGroupRequest(request, this.client.settings)),
    headers: jsonContentHeaders$e,
    method: 'POST',
    path: `/iam/v1alpha1/groups`
  }, unmarshalGroup);

  /**
   * Get a group. Retrive information about a given group, specified by the
   * `group_id` parameter. The group's full details, including `user_ids` and
   * `application_ids` are returned in the response.
   *
   * @param request - The request {@link GetGroupRequest}
   * @returns A Promise of Group
   */
  getGroup = request => this.client.fetch({
    method: 'GET',
    path: `/iam/v1alpha1/groups/${validatePathParam('groupId', request.groupId)}`
  }, unmarshalGroup);

  /**
   * Update a group. Update the parameters of group, including `name` and
   * `description`.
   *
   * @param request - The request {@link UpdateGroupRequest}
   * @returns A Promise of Group
   */
  updateGroup = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateGroupRequest(request, this.client.settings)),
    headers: jsonContentHeaders$e,
    method: 'PATCH',
    path: `/iam/v1alpha1/groups/${validatePathParam('groupId', request.groupId)}`
  }, unmarshalGroup);

  /**
   * Overwrite users and applications of a group. Overwrite users and
   * applications configuration in a group. Any information that you add using
   * this command will overwrite the previous configuration.
   *
   * @param request - The request {@link SetGroupMembersRequest}
   * @returns A Promise of Group
   */
  setGroupMembers = request => this.client.fetch({
    body: JSON.stringify(marshalSetGroupMembersRequest(request, this.client.settings)),
    headers: jsonContentHeaders$e,
    method: 'PUT',
    path: `/iam/v1alpha1/groups/${validatePathParam('groupId', request.groupId)}/members`
  }, unmarshalGroup);

  /**
   * Add a user or an application to a group. Add a user or an application to a
   * group. You can specify a `user_id` and and `application_id` in the body of
   * your request. Note that you can only add one of each per request.
   *
   * @param request - The request {@link AddGroupMemberRequest}
   * @returns A Promise of Group
   */
  addGroupMember = request => this.client.fetch({
    body: JSON.stringify(marshalAddGroupMemberRequest(request, this.client.settings)),
    headers: jsonContentHeaders$e,
    method: 'POST',
    path: `/iam/v1alpha1/groups/${validatePathParam('groupId', request.groupId)}/add-member`
  }, unmarshalGroup);

  /**
   * Remove a user or an application from a group. Remove a user or an
   * application from a group. You can specify a `user_id` and and
   * `application_id` in the body of your request. Note that you can only remove
   * one of each per request. Removing a user from a group means that any
   * permissions given to them via the group (i.e. from an attached policy) will
   * no longer apply. Be sure you want to remove these permissions from the user
   * before proceeding.
   *
   * @param request - The request {@link RemoveGroupMemberRequest}
   * @returns A Promise of Group
   */
  removeGroupMember = request => this.client.fetch({
    body: JSON.stringify(marshalRemoveGroupMemberRequest(request, this.client.settings)),
    headers: jsonContentHeaders$e,
    method: 'POST',
    path: `/iam/v1alpha1/groups/${validatePathParam('groupId', request.groupId)}/remove-member`
  }, unmarshalGroup);

  /**
   * Delete a group. Delete a group. Note that this action is irreversible and
   * could delete permissions for group members. Policies attached to users and
   * applications via this group will no longer apply.
   *
   * @param request - The request {@link DeleteGroupRequest}
   */
  deleteGroup = request => this.client.fetch({
    method: 'DELETE',
    path: `/iam/v1alpha1/groups/${validatePathParam('groupId', request.groupId)}`
  });
  pageOfListPolicies = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/iam/v1alpha1/policies`,
    urlParams: urlParams(['application_ids', request.applicationIds], ['editable', request.editable], ['group_ids', request.groupIds], ['no_principal', request.noPrincipal], ['order_by', request.orderBy ?? 'policy_name_asc'], ['organization_id', request.organizationId ?? this.client.settings.defaultOrganizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['policy_name', request.policyName], ['user_ids', request.userIds])
  }, unmarshalListPoliciesResponse);

  /**
   * List policies of an Organization. List the policies of an Organization. By
   * default, the policies listed are ordered by creation date in ascending
   * order. This can be modified via the `order_by` field. You must define the
   * `organization_id` in the query path of your request. You can also define
   * additional parameters to filter your query, such as `user_ids`,
   * `groups_ids`, `application_ids`, and `policy_name`.
   *
   * @param request - The request {@link ListPoliciesRequest}
   * @returns A Promise of ListPoliciesResponse
   */
  listPolicies = (request = {}) => enrichForPagination('policies', this.pageOfListPolicies, request);

  /**
   * Create a new policy. Create a new application. You must define the `name`
   * parameter in the request. You can specify parameters such as `user_id`,
   * `groups_id`, `application_id`, `no_principal`, `rules` and its child
   * attributes.
   *
   * @param request - The request {@link CreatePolicyRequest}
   * @returns A Promise of Policy
   */
  createPolicy = request => this.client.fetch({
    body: JSON.stringify(marshalCreatePolicyRequest(request, this.client.settings)),
    headers: jsonContentHeaders$e,
    method: 'POST',
    path: `/iam/v1alpha1/policies`
  }, unmarshalPolicy);

  /**
   * Get an existing policy. Retrieve information about a policy, speficified by
   * the `policy_id` parameter. The policy's full details, including `id`,
   * `name`, `organization_id`, `nb_rules` and `nb_scopes`, `nb_permission_sets`
   * are returned in the response.
   *
   * @param request - The request {@link GetPolicyRequest}
   * @returns A Promise of Policy
   */
  getPolicy = request => this.client.fetch({
    method: 'GET',
    path: `/iam/v1alpha1/policies/${validatePathParam('policyId', request.policyId)}`
  }, unmarshalPolicy);

  /**
   * Update an existing policy. Update the parameters of a policy, including
   * `name`, `description`, `user_id`, `group_id`, `application_id` and
   * `no_principal`.
   *
   * @param request - The request {@link UpdatePolicyRequest}
   * @returns A Promise of Policy
   */
  updatePolicy = request => this.client.fetch({
    body: JSON.stringify(marshalUpdatePolicyRequest(request, this.client.settings)),
    headers: jsonContentHeaders$e,
    method: 'PATCH',
    path: `/iam/v1alpha1/policies/${validatePathParam('policyId', request.policyId)}`
  }, unmarshalPolicy);

  /**
   * Delete a policy. Delete a policy. You must define specify the `policy_id`
   * parameter in your request. Note that when deleting a policy, all
   * permissions it gives to its principal (user, group or application) will be
   * revoked.
   *
   * @param request - The request {@link DeletePolicyRequest}
   */
  deletePolicy = request => this.client.fetch({
    method: 'DELETE',
    path: `/iam/v1alpha1/policies/${validatePathParam('policyId', request.policyId)}`
  });

  /**
   * Clone a policy. Clone a policy. You must define specify the `policy_id`
   * parameter in your request.
   *
   * @param request - The request {@link ClonePolicyRequest}
   * @returns A Promise of Policy
   */
  clonePolicy = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$e,
    method: 'POST',
    path: `/iam/v1alpha1/policies/${validatePathParam('policyId', request.policyId)}/clone`
  }, unmarshalPolicy);

  /**
   * Set rules of a given policy. Overwrite the rules of a given policy. Any
   * information that you add using this command will overwrite the previous
   * configuration. If you include some of the rules you already had in your
   * previous configuration in your new one, but you change their order, the new
   * order of display will apply. While policy rules are ordered, they have no
   * impact on the access logic of IAM because rules are allow-only.
   *
   * @param request - The request {@link SetRulesRequest}
   * @returns A Promise of SetRulesResponse
   */
  setRules = request => this.client.fetch({
    body: JSON.stringify(marshalSetRulesRequest(request, this.client.settings)),
    headers: jsonContentHeaders$e,
    method: 'PUT',
    path: `/iam/v1alpha1/rules`
  }, unmarshalSetRulesResponse);
  pageOfListRules = request => this.client.fetch({
    method: 'GET',
    path: `/iam/v1alpha1/rules`,
    urlParams: urlParams(['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['policy_id', request.policyId])
  }, unmarshalListRulesResponse);

  /**
   * List rules of a given policy. List the rules of a given policy. By default,
   * the rules listed are ordered by creation date in ascending order. This can
   * be modified via the `order_by` field. You must define the `policy_id` in
   * the query path of your request.
   *
   * @param request - The request {@link ListRulesRequest}
   * @returns A Promise of ListRulesResponse
   */
  listRules = request => enrichForPagination('rules', this.pageOfListRules, request);
  pageOfListPermissionSets = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/iam/v1alpha1/permission-sets`,
    urlParams: urlParams(['order_by', request.orderBy ?? 'name_asc'], ['organization_id', request.organizationId ?? this.client.settings.defaultOrganizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListPermissionSetsResponse);

  /**
   * List permission sets. List permission sets available for given
   * Organization. You must define the `organization_id` in the query path of
   * your request.
   *
   * @param request - The request {@link ListPermissionSetsRequest}
   * @returns A Promise of ListPermissionSetsResponse
   */
  listPermissionSets = (request = {}) => enrichForPagination('permissionSets', this.pageOfListPermissionSets, request);
  pageOfListAPIKeys = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/iam/v1alpha1/api-keys`,
    urlParams: urlParams(['access_key', request.accessKey], ['bearer_id', request.bearerId], ['bearer_type', request.bearerType ?? 'unknown_bearer_type'], ['description', request.description], ['editable', request.editable], ['expired', request.expired], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId ?? this.client.settings.defaultOrganizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ...Object.entries(resolveOneOf([{
      param: 'application_id',
      value: request.applicationId
    }, {
      param: 'user_id',
      value: request.userId
    }])))
  }, unmarshalListAPIKeysResponse);

  /**
   * List API keys. List API keys. By default, the API keys listed are ordered
   * by creation date in ascending order. This can be modified via the
   * `order_by` field. You can define additional parameters for your query such
   * as `editable`, `expired`, `access_key` and `bearer_id`.
   *
   * @param request - The request {@link ListAPIKeysRequest}
   * @returns A Promise of ListAPIKeysResponse
   */
  listAPIKeys = (request = {}) => enrichForPagination('apiKeys', this.pageOfListAPIKeys, request);

  /**
   * Create an API key. Create an API key. You must specify the `application_id`
   * or the `user_id` and the description. You can also specify the
   * `default_project_id` which is the Project ID of your preferred Project, to
   * use with Object Storage. The `access_key` and `secret_key` values are
   * returned in the response. Note that he secret key is only showed once. Make
   * sure that you copy and store both keys somewhere safe.
   *
   * @param request - The request {@link CreateAPIKeyRequest}
   * @returns A Promise of APIKey
   */
  createAPIKey = request => this.client.fetch({
    body: JSON.stringify(marshalCreateAPIKeyRequest(request, this.client.settings)),
    headers: jsonContentHeaders$e,
    method: 'POST',
    path: `/iam/v1alpha1/api-keys`
  }, unmarshalAPIKey);

  /**
   * Get an API key. Retrive information about an API key, specified by the
   * `access_key` parameter. The API key's details, including either the
   * `user_id` or `application_id` of its bearer are returned in the response.
   * Note that the string value for the `secret_key` is nullable, and therefore
   * is not displayed in the response. The `secret_key` value is only displayed
   * upon API key creation.
   *
   * @param request - The request {@link GetAPIKeyRequest}
   * @returns A Promise of APIKey
   */
  getAPIKey = request => this.client.fetch({
    method: 'GET',
    path: `/iam/v1alpha1/api-keys/${validatePathParam('accessKey', request.accessKey)}`
  }, unmarshalAPIKey);

  /**
   * Update an API key. Update the parameters of an API key, including
   * `default_project_id` and `description`.
   *
   * @param request - The request {@link UpdateAPIKeyRequest}
   * @returns A Promise of APIKey
   */
  updateAPIKey = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateAPIKeyRequest(request, this.client.settings)),
    headers: jsonContentHeaders$e,
    method: 'PATCH',
    path: `/iam/v1alpha1/api-keys/${validatePathParam('accessKey', request.accessKey)}`
  }, unmarshalAPIKey);

  /**
   * Delete an API key. Delete an API key. Note that this action is irreversible
   * and cannot be undone. Make sure you update any configurations using the API
   * keys you delete.
   *
   * @param request - The request {@link DeleteAPIKeyRequest}
   */
  deleteAPIKey = request => this.client.fetch({
    method: 'DELETE',
    path: `/iam/v1alpha1/api-keys/${validatePathParam('accessKey', request.accessKey)}`
  });
  pageOfListQuota = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/iam/v1alpha1/quota`,
    urlParams: urlParams(['order_by', request.orderBy ?? 'name_asc'], ['organization_id', request.organizationId ?? this.client.settings.defaultOrganizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListQuotaResponse);

  /**
   * List all quotas in the Organization. List all product and features quota
   * for an Organization, with their associated limits. By default, the quota
   * listed are ordered by creation date in ascending order. This can be
   * modified via the `order_by` field. You must define the `organization_id` in
   * the query path of your request.
   *
   * @param request - The request {@link ListQuotaRequest}
   * @returns A Promise of ListQuotaResponse
   */
  listQuota = (request = {}) => enrichForPagination('quota', this.pageOfListQuota, request);

  /**
   * Get a quota in the Organization. Retrieve information about a resource
   * quota, speficified by the `quotum_name` parameter. The quota's `limit`, or
   * whether it is unlimited, is returned in the response.
   *
   * @param request - The request {@link GetQuotumRequest}
   * @returns A Promise of Quotum
   */
  getQuotum = request => this.client.fetch({
    method: 'GET',
    path: `/iam/v1alpha1/quota/${validatePathParam('quotumName', request.quotumName)}`,
    urlParams: urlParams(['organization_id', request.organizationId ?? this.client.settings.defaultOrganizationId])
  }, unmarshalQuotum);
  pageOfListJWTs = request => this.client.fetch({
    method: 'GET',
    path: `/iam/v1alpha1/jwts`,
    urlParams: urlParams(['audience_id', request.audienceId], ['expired', request.expired], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListJWTsResponse);

  /**
   * List JWTs.
   *
   * @param request - The request {@link ListJWTsRequest}
   * @returns A Promise of ListJWTsResponse
   */
  listJWTs = request => enrichForPagination('jwts', this.pageOfListJWTs, request);

  /**
   * Get a JWT.
   *
   * @param request - The request {@link GetJWTRequest}
   * @returns A Promise of JWT
   */
  getJWT = request => this.client.fetch({
    method: 'GET',
    path: `/iam/v1alpha1/jwts/${validatePathParam('jti', request.jti)}`
  }, unmarshalJWT);

  /**
   * Delete a JWT.
   *
   * @param request - The request {@link DeleteJWTRequest}
   */
  deleteJWT = request => this.client.fetch({
    method: 'DELETE',
    path: `/iam/v1alpha1/jwts/${validatePathParam('jti', request.jti)}`
  });
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

const CreateAPIKeyRequest = {
  description: {
    ignoreEmpty: true,
    maxLength: 200
  }
};
const CreateApplicationRequest = {
  description: {
    ignoreEmpty: true,
    maxLength: 200
  },
  name: {
    maxLength: 64,
    minLength: 1,
    pattern: /^[a-zA-Z0-9\(\)\._\- ]+$/
  }
};
const CreateGroupRequest = {
  description: {
    ignoreEmpty: true,
    maxLength: 200
  },
  name: {
    maxLength: 64,
    minLength: 1,
    pattern: /^[a-zA-Z0-9\(\)\._\- ]+$/
  }
};
const CreatePolicyRequest = {
  description: {
    ignoreEmpty: true,
    maxLength: 200
  },
  name: {
    maxLength: 64,
    minLength: 1,
    pattern: /^[a-zA-Z0-9\(\)\._\- ]+$/
  }
};
const CreateSSHKeyRequest = {
  name: {
    ignoreEmpty: true,
    maxLength: 1000
  },
  publicKey: {
    maxLength: 65000,
    minLength: 1
  }
};
const GetQuotumRequest = {
  quotumName: {
    minLength: 1
  }
};
const ListAPIKeysRequest = {
  description: {
    maxLength: 200
  },
  page: {
    greaterThan: 0
  },
  pageSize: {
    greaterThanOrEqual: 1,
    lessThanOrEqual: 100
  }
};
const ListApplicationsRequest = {
  name: {
    maxLength: 64,
    minLength: 1,
    pattern: /^[a-zA-Z0-9\(\)\._\- ]+$/
  },
  page: {
    greaterThan: 0
  },
  pageSize: {
    greaterThanOrEqual: 1,
    lessThanOrEqual: 100
  }
};
const ListGroupsRequest = {
  name: {
    minLength: 1
  },
  page: {
    greaterThan: 0
  },
  pageSize: {
    greaterThanOrEqual: 1,
    lessThanOrEqual: 100
  }
};
const ListJWTsRequest = {
  page: {
    greaterThan: 0
  },
  pageSize: {
    greaterThanOrEqual: 1,
    lessThanOrEqual: 100
  }
};
const ListPermissionSetsRequest = {
  page: {
    greaterThan: 0
  },
  pageSize: {
    greaterThanOrEqual: 1,
    lessThanOrEqual: 100
  }
};
const ListPoliciesRequest = {
  page: {
    greaterThan: 0
  },
  pageSize: {
    greaterThanOrEqual: 1,
    lessThanOrEqual: 100
  },
  policyName: {
    minLength: 1
  }
};
const ListQuotaRequest = {
  page: {
    greaterThan: 0
  },
  pageSize: {
    greaterThanOrEqual: 1,
    lessThanOrEqual: 100
  }
};
const ListRulesRequest = {
  page: {
    greaterThan: 0
  },
  pageSize: {
    greaterThanOrEqual: 1,
    lessThanOrEqual: 100
  }
};
const ListSSHKeysRequest = {
  name: {
    maxLength: 1000,
    minLength: 1
  },
  page: {
    greaterThan: 0
  },
  pageSize: {
    greaterThanOrEqual: 1,
    lessThanOrEqual: 100
  }
};
const ListUsersRequest = {
  page: {
    greaterThan: 0
  },
  pageSize: {
    greaterThanOrEqual: 1,
    lessThanOrEqual: 100
  }
};
const UpdateAPIKeyRequest = {
  description: {
    maxLength: 200
  }
};
const UpdateApplicationRequest = {
  description: {
    maxLength: 200
  },
  name: {
    maxLength: 64,
    minLength: 1,
    pattern: /^[a-zA-Z0-9\(\)\._\- ]+$/
  }
};
const UpdateGroupRequest = {
  description: {
    maxLength: 200
  },
  name: {
    maxLength: 64,
    minLength: 1,
    pattern: /^[a-zA-Z0-9\(\)\._\- ]+$/
  }
};
const UpdatePolicyRequest = {
  description: {
    maxLength: 200
  },
  name: {
    maxLength: 64,
    minLength: 1,
    pattern: /^[a-zA-Z0-9\(\)\._\- ]+$/
  }
};
const UpdateSSHKeyRequest = {
  name: {
    maxLength: 1000
  }
};

var validationRules_gen$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  CreateAPIKeyRequest: CreateAPIKeyRequest,
  CreateApplicationRequest: CreateApplicationRequest,
  CreateGroupRequest: CreateGroupRequest,
  CreatePolicyRequest: CreatePolicyRequest,
  CreateSSHKeyRequest: CreateSSHKeyRequest,
  GetQuotumRequest: GetQuotumRequest,
  ListAPIKeysRequest: ListAPIKeysRequest,
  ListApplicationsRequest: ListApplicationsRequest,
  ListGroupsRequest: ListGroupsRequest,
  ListJWTsRequest: ListJWTsRequest,
  ListPermissionSetsRequest: ListPermissionSetsRequest,
  ListPoliciesRequest: ListPoliciesRequest,
  ListQuotaRequest: ListQuotaRequest,
  ListRulesRequest: ListRulesRequest,
  ListSSHKeysRequest: ListSSHKeysRequest,
  ListUsersRequest: ListUsersRequest,
  UpdateAPIKeyRequest: UpdateAPIKeyRequest,
  UpdateApplicationRequest: UpdateApplicationRequest,
  UpdateGroupRequest: UpdateGroupRequest,
  UpdatePolicyRequest: UpdatePolicyRequest,
  UpdateSSHKeyRequest: UpdateSSHKeyRequest
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen$d = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API$g,
  ValidationRules: validationRules_gen$2
});

var index$i = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1alpha1: index_gen$d
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalServerSummary = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServerSummary' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    name: data.name
  };
};
const unmarshalBootscript = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Bootscript' failed as data isn't a dictionary.`);
  }
  return {
    arch: data.arch,
    bootcmdargs: data.bootcmdargs,
    default: data.default,
    dtb: data.dtb,
    id: data.id,
    initrd: data.initrd,
    kernel: data.kernel,
    organization: data.organization,
    project: data.project,
    public: data.public,
    title: data.title,
    zone: data.zone
  };
};
const unmarshalServerTypeNetworkInterface = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServerTypeNetworkInterface' failed as data isn't a dictionary.`);
  }
  return {
    internalBandwidth: data.internal_bandwidth,
    internetBandwidth: data.internet_bandwidth
  };
};
const unmarshalServerTypeVolumeConstraintSizes = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServerTypeVolumeConstraintSizes' failed as data isn't a dictionary.`);
  }
  return {
    maxSize: data.max_size,
    minSize: data.min_size
  };
};
const unmarshalVolume$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Volume' failed as data isn't a dictionary.`);
  }
  return {
    creationDate: unmarshalDate(data.creation_date),
    exportUri: data.export_uri,
    id: data.id,
    modificationDate: unmarshalDate(data.modification_date),
    name: data.name,
    organization: data.organization,
    project: data.project,
    server: data.server ? unmarshalServerSummary(data.server) : undefined,
    size: data.size,
    state: data.state,
    tags: data.tags,
    volumeType: data.volume_type,
    zone: data.zone
  };
};
const unmarshalVolumeSummary = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'VolumeSummary' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    name: data.name,
    size: data.size,
    volumeType: data.volume_type
  };
};
const unmarshalImage$3 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Image' failed as data isn't a dictionary.`);
  }
  return {
    arch: data.arch,
    creationDate: unmarshalDate(data.creation_date),
    defaultBootscript: data.default_bootscript ? unmarshalBootscript(data.default_bootscript) : undefined,
    extraVolumes: unmarshalMapOfObject(data.extra_volumes, unmarshalVolume$1),
    fromServer: data.from_server,
    id: data.id,
    modificationDate: unmarshalDate(data.modification_date),
    name: data.name,
    organization: data.organization,
    project: data.project,
    public: data.public,
    rootVolume: data.root_volume ? unmarshalVolumeSummary(data.root_volume) : undefined,
    state: data.state,
    tags: data.tags,
    zone: data.zone
  };
};
const unmarshalPlacementGroup = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'PlacementGroup' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    name: data.name,
    organization: data.organization,
    policyMode: data.policy_mode,
    policyRespected: data.policy_respected,
    policyType: data.policy_type,
    project: data.project,
    tags: data.tags,
    zone: data.zone
  };
};
const unmarshalPrivateNIC = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'PrivateNIC' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    macAddress: data.mac_address,
    privateNetworkId: data.private_network_id,
    serverId: data.server_id,
    state: data.state,
    tags: data.tags
  };
};
const unmarshalSecurityGroupSummary = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SecurityGroupSummary' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    name: data.name
  };
};
const unmarshalServerIp = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServerIp' failed as data isn't a dictionary.`);
  }
  return {
    address: data.address,
    dynamic: data.dynamic,
    id: data.id
  };
};
const unmarshalServerIpv6 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServerIpv6' failed as data isn't a dictionary.`);
  }
  return {
    address: data.address,
    gateway: data.gateway,
    netmask: data.netmask
  };
};
const unmarshalServerLocation = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServerLocation' failed as data isn't a dictionary.`);
  }
  return {
    clusterId: data.cluster_id,
    hypervisorId: data.hypervisor_id,
    nodeId: data.node_id,
    platformId: data.platform_id,
    zoneId: data.zone_id
  };
};
const unmarshalServerMaintenance = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServerMaintenance' failed as data isn't a dictionary.`);
  }
  return {
    reason: data.reason
  };
};
const unmarshalServerTypeCapabilities = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServerTypeCapabilities' failed as data isn't a dictionary.`);
  }
  return {
    blockStorage: data.block_storage,
    bootTypes: data.boot_types
  };
};
const unmarshalServerTypeNetwork = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServerTypeNetwork' failed as data isn't a dictionary.`);
  }
  return {
    interfaces: unmarshalArrayOfObject(data.interfaces, unmarshalServerTypeNetworkInterface),
    ipv6Support: data.ipv6_support,
    sumInternalBandwidth: data.sum_internal_bandwidth,
    sumInternetBandwidth: data.sum_internet_bandwidth
  };
};
const unmarshalServerTypeVolumeConstraintsByType = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServerTypeVolumeConstraintsByType' failed as data isn't a dictionary.`);
  }
  return {
    lSsd: data.l_ssd ? unmarshalServerTypeVolumeConstraintSizes(data.l_ssd) : undefined
  };
};
const unmarshalSnapshotBaseVolume = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SnapshotBaseVolume' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    name: data.name
  };
};
const unmarshalVolumeServer = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'VolumeServer' failed as data isn't a dictionary.`);
  }
  return {
    boot: data.boot,
    creationDate: unmarshalDate(data.creation_date),
    exportUri: data.export_uri,
    id: data.id,
    modificationDate: unmarshalDate(data.modification_date),
    name: data.name,
    organization: data.organization,
    project: data.project,
    server: data.server ? unmarshalServerSummary(data.server) : undefined,
    size: data.size,
    state: data.state,
    volumeType: data.volume_type,
    zone: data.zone
  };
};
const unmarshalVolumeTypeCapabilities = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'VolumeTypeCapabilities' failed as data isn't a dictionary.`);
  }
  return {
    snapshot: data.snapshot
  };
};
const unmarshalVolumeTypeConstraints = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'VolumeTypeConstraints' failed as data isn't a dictionary.`);
  }
  return {
    max: data.max,
    min: data.min
  };
};
const unmarshalDashboard = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Dashboard' failed as data isn't a dictionary.`);
  }
  return {
    imagesCount: data.images_count,
    ipsCount: data.ips_count,
    ipsUnused: data.ips_unused,
    placementGroupsCount: data.placement_groups_count,
    privateNicsCount: data.private_nics_count,
    runningServersCount: data.running_servers_count,
    securityGroupsCount: data.security_groups_count,
    serversByTypes: data.servers_by_types,
    serversCount: data.servers_count,
    snapshotsCount: data.snapshots_count,
    volumesBSsdCount: data.volumes_b_ssd_count,
    volumesBSsdTotalSize: data.volumes_b_ssd_total_size,
    volumesCount: data.volumes_count,
    volumesLSsdCount: data.volumes_l_ssd_count,
    volumesLSsdTotalSize: data.volumes_l_ssd_total_size
  };
};
const unmarshalGetServerTypesAvailabilityResponseAvailability = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetServerTypesAvailabilityResponseAvailability' failed as data isn't a dictionary.`);
  }
  return {
    availability: data.availability
  };
};
const unmarshalIp$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Ip' failed as data isn't a dictionary.`);
  }
  return {
    address: data.address,
    id: data.id,
    organization: data.organization,
    project: data.project,
    reverse: data.reverse,
    server: data.server ? unmarshalServerSummary(data.server) : undefined,
    tags: data.tags,
    zone: data.zone
  };
};
const unmarshalPlacementGroupServer = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'PlacementGroupServer' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    name: data.name,
    policyRespected: data.policy_respected
  };
};
const unmarshalSecurityGroup = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SecurityGroup' failed as data isn't a dictionary.`);
  }
  return {
    creationDate: unmarshalDate(data.creation_date),
    description: data.description,
    enableDefaultSecurity: data.enable_default_security,
    id: data.id,
    inboundDefaultPolicy: data.inbound_default_policy,
    modificationDate: unmarshalDate(data.modification_date),
    name: data.name,
    organization: data.organization,
    organizationDefault: data.organization_default,
    outboundDefaultPolicy: data.outbound_default_policy,
    project: data.project,
    projectDefault: data.project_default,
    servers: unmarshalArrayOfObject(data.servers, unmarshalServerSummary),
    state: data.state,
    stateful: data.stateful,
    tags: data.tags,
    zone: data.zone
  };
};
const unmarshalSecurityGroupRule = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SecurityGroupRule' failed as data isn't a dictionary.`);
  }
  return {
    action: data.action,
    destPortFrom: data.dest_port_from,
    destPortTo: data.dest_port_to,
    direction: data.direction,
    editable: data.editable,
    id: data.id,
    ipRange: data.ip_range,
    position: data.position,
    protocol: data.protocol,
    zone: data.zone
  };
};
const unmarshalServer = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Server' failed as data isn't a dictionary.`);
  }
  return {
    allowedActions: data.allowed_actions,
    arch: data.arch,
    bootscript: data.bootscript ? unmarshalBootscript(data.bootscript) : undefined,
    bootType: data.boot_type,
    commercialType: data.commercial_type,
    creationDate: unmarshalDate(data.creation_date),
    dynamicIpRequired: data.dynamic_ip_required,
    enableIpv6: data.enable_ipv6,
    hostname: data.hostname,
    id: data.id,
    image: data.image ? unmarshalImage$3(data.image) : undefined,
    ipv6: data.ipv6 ? unmarshalServerIpv6(data.ipv6) : undefined,
    location: data.location ? unmarshalServerLocation(data.location) : undefined,
    maintenances: unmarshalArrayOfObject(data.maintenances, unmarshalServerMaintenance),
    modificationDate: unmarshalDate(data.modification_date),
    name: data.name,
    organization: data.organization,
    placementGroup: data.placement_group ? unmarshalPlacementGroup(data.placement_group) : undefined,
    privateIp: data.private_ip,
    privateNics: unmarshalArrayOfObject(data.private_nics, unmarshalPrivateNIC),
    project: data.project,
    protected: data.protected,
    publicIp: data.public_ip ? unmarshalServerIp(data.public_ip) : undefined,
    securityGroup: data.security_group ? unmarshalSecurityGroupSummary(data.security_group) : undefined,
    state: data.state,
    stateDetail: data.state_detail,
    tags: data.tags,
    volumes: unmarshalMapOfObject(data.volumes, unmarshalVolumeServer),
    zone: data.zone
  };
};
const unmarshalServerType = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServerType' failed as data isn't a dictionary.`);
  }
  return {
    altNames: data.alt_names,
    arch: data.arch,
    baremetal: data.baremetal,
    capabilities: data.capabilities ? unmarshalServerTypeCapabilities(data.capabilities) : undefined,
    gpu: data.gpu,
    hourlyPrice: data.hourly_price,
    monthlyPrice: data.monthly_price,
    ncpus: data.ncpus,
    network: data.network ? unmarshalServerTypeNetwork(data.network) : undefined,
    perVolumeConstraint: data.per_volume_constraint ? unmarshalServerTypeVolumeConstraintsByType(data.per_volume_constraint) : undefined,
    ram: data.ram,
    volumesConstraint: data.volumes_constraint ? unmarshalServerTypeVolumeConstraintSizes(data.volumes_constraint) : undefined
  };
};
const unmarshalSnapshot$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Snapshot' failed as data isn't a dictionary.`);
  }
  return {
    baseVolume: data.base_volume ? unmarshalSnapshotBaseVolume(data.base_volume) : undefined,
    creationDate: unmarshalDate(data.creation_date),
    errorReason: data.error_reason,
    id: data.id,
    modificationDate: unmarshalDate(data.modification_date),
    name: data.name,
    organization: data.organization,
    project: data.project,
    size: data.size,
    state: data.state,
    tags: data.tags,
    volumeType: data.volume_type,
    zone: data.zone
  };
};
const unmarshalTask = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Task' failed as data isn't a dictionary.`);
  }
  return {
    description: data.description,
    hrefFrom: data.href_from,
    hrefResult: data.href_result,
    id: data.id,
    progress: data.progress,
    startedAt: unmarshalDate(data.started_at),
    status: data.status,
    terminatedAt: unmarshalDate(data.terminated_at),
    zone: data.zone
  };
};
const unmarshalVolumeType = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'VolumeType' failed as data isn't a dictionary.`);
  }
  return {
    capabilities: data.capabilities ? unmarshalVolumeTypeCapabilities(data.capabilities) : undefined,
    constraints: data.constraints ? unmarshalVolumeTypeConstraints(data.constraints) : undefined,
    displayName: data.display_name
  };
};
const unmarshalCreateImageResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'CreateImageResponse' failed as data isn't a dictionary.`);
  }
  return {
    image: data.image ? unmarshalImage$3(data.image) : undefined
  };
};
const unmarshalCreateIpResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'CreateIpResponse' failed as data isn't a dictionary.`);
  }
  return {
    ip: data.ip ? unmarshalIp$1(data.ip) : undefined
  };
};
const unmarshalCreatePlacementGroupResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'CreatePlacementGroupResponse' failed as data isn't a dictionary.`);
  }
  return {
    placementGroup: data.placement_group ? unmarshalPlacementGroup(data.placement_group) : undefined
  };
};
const unmarshalCreatePrivateNICResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'CreatePrivateNICResponse' failed as data isn't a dictionary.`);
  }
  return {
    privateNic: data.private_nic ? unmarshalPrivateNIC(data.private_nic) : undefined
  };
};
const unmarshalCreateSecurityGroupResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'CreateSecurityGroupResponse' failed as data isn't a dictionary.`);
  }
  return {
    securityGroup: data.security_group ? unmarshalSecurityGroup(data.security_group) : undefined
  };
};
const unmarshalCreateSecurityGroupRuleResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'CreateSecurityGroupRuleResponse' failed as data isn't a dictionary.`);
  }
  return {
    rule: data.rule ? unmarshalSecurityGroupRule(data.rule) : undefined
  };
};
const unmarshalCreateServerResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'CreateServerResponse' failed as data isn't a dictionary.`);
  }
  return {
    server: data.server ? unmarshalServer(data.server) : undefined
  };
};
const unmarshalCreateSnapshotResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'CreateSnapshotResponse' failed as data isn't a dictionary.`);
  }
  return {
    snapshot: data.snapshot ? unmarshalSnapshot$1(data.snapshot) : undefined,
    task: data.task ? unmarshalTask(data.task) : undefined
  };
};
const unmarshalCreateVolumeResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'CreateVolumeResponse' failed as data isn't a dictionary.`);
  }
  return {
    volume: data.volume ? unmarshalVolume$1(data.volume) : undefined
  };
};
const unmarshalExportSnapshotResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ExportSnapshotResponse' failed as data isn't a dictionary.`);
  }
  return {
    task: data.task ? unmarshalTask(data.task) : undefined
  };
};
const unmarshalGetBootscriptResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetBootscriptResponse' failed as data isn't a dictionary.`);
  }
  return {
    bootscript: data.bootscript ? unmarshalBootscript(data.bootscript) : undefined
  };
};
const unmarshalGetDashboardResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetDashboardResponse' failed as data isn't a dictionary.`);
  }
  return {
    dashboard: data.dashboard ? unmarshalDashboard(data.dashboard) : undefined
  };
};
const unmarshalGetImageResponse$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetImageResponse' failed as data isn't a dictionary.`);
  }
  return {
    image: data.image ? unmarshalImage$3(data.image) : undefined
  };
};
const unmarshalGetIpResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetIpResponse' failed as data isn't a dictionary.`);
  }
  return {
    ip: data.ip ? unmarshalIp$1(data.ip) : undefined
  };
};
const unmarshalGetPlacementGroupResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetPlacementGroupResponse' failed as data isn't a dictionary.`);
  }
  return {
    placementGroup: data.placement_group ? unmarshalPlacementGroup(data.placement_group) : undefined
  };
};
const unmarshalGetPlacementGroupServersResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetPlacementGroupServersResponse' failed as data isn't a dictionary.`);
  }
  return {
    servers: unmarshalArrayOfObject(data.servers, unmarshalPlacementGroupServer)
  };
};
const unmarshalGetPrivateNICResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetPrivateNICResponse' failed as data isn't a dictionary.`);
  }
  return {
    privateNic: data.private_nic ? unmarshalPrivateNIC(data.private_nic) : undefined
  };
};
const unmarshalGetSecurityGroupResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetSecurityGroupResponse' failed as data isn't a dictionary.`);
  }
  return {
    securityGroup: data.security_group ? unmarshalSecurityGroup(data.security_group) : undefined
  };
};
const unmarshalGetSecurityGroupRuleResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetSecurityGroupRuleResponse' failed as data isn't a dictionary.`);
  }
  return {
    rule: data.rule ? unmarshalSecurityGroupRule(data.rule) : undefined
  };
};
const unmarshalGetServerResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetServerResponse' failed as data isn't a dictionary.`);
  }
  return {
    server: data.server ? unmarshalServer(data.server) : undefined
  };
};
const unmarshalGetServerTypesAvailabilityResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetServerTypesAvailabilityResponse' failed as data isn't a dictionary.`);
  }
  return {
    servers: unmarshalMapOfObject(data.servers, unmarshalGetServerTypesAvailabilityResponseAvailability)
  };
};
const unmarshalGetSnapshotResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetSnapshotResponse' failed as data isn't a dictionary.`);
  }
  return {
    snapshot: data.snapshot ? unmarshalSnapshot$1(data.snapshot) : undefined
  };
};
const unmarshalGetVolumeResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetVolumeResponse' failed as data isn't a dictionary.`);
  }
  return {
    volume: data.volume ? unmarshalVolume$1(data.volume) : undefined
  };
};
const unmarshalListBootscriptsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListBootscriptsResponse' failed as data isn't a dictionary.`);
  }
  return {
    bootscripts: unmarshalArrayOfObject(data.bootscripts, unmarshalBootscript),
    totalCount: data.total_count
  };
};
const unmarshalListImagesResponse$3 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListImagesResponse' failed as data isn't a dictionary.`);
  }
  return {
    images: unmarshalArrayOfObject(data.images, unmarshalImage$3),
    totalCount: data.total_count
  };
};
const unmarshalListIpsResponse$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListIpsResponse' failed as data isn't a dictionary.`);
  }
  return {
    ips: unmarshalArrayOfObject(data.ips, unmarshalIp$1),
    totalCount: data.total_count
  };
};
const unmarshalListPlacementGroupsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListPlacementGroupsResponse' failed as data isn't a dictionary.`);
  }
  return {
    placementGroups: unmarshalArrayOfObject(data.placement_groups, unmarshalPlacementGroup),
    totalCount: data.total_count
  };
};
const unmarshalListPrivateNICsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListPrivateNICsResponse' failed as data isn't a dictionary.`);
  }
  return {
    privateNics: unmarshalArrayOfObject(data.private_nics, unmarshalPrivateNIC),
    totalCount: data.total_count
  };
};
const unmarshalListSecurityGroupRulesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListSecurityGroupRulesResponse' failed as data isn't a dictionary.`);
  }
  return {
    rules: unmarshalArrayOfObject(data.rules, unmarshalSecurityGroupRule),
    totalCount: data.total_count
  };
};
const unmarshalListSecurityGroupsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListSecurityGroupsResponse' failed as data isn't a dictionary.`);
  }
  return {
    securityGroups: unmarshalArrayOfObject(data.security_groups, unmarshalSecurityGroup),
    totalCount: data.total_count
  };
};
const unmarshalListServerActionsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListServerActionsResponse' failed as data isn't a dictionary.`);
  }
  return {
    actions: data.actions
  };
};
const unmarshalListServerUserDataResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListServerUserDataResponse' failed as data isn't a dictionary.`);
  }
  return {
    userData: data.user_data
  };
};
const unmarshalListServersResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListServersResponse' failed as data isn't a dictionary.`);
  }
  return {
    servers: unmarshalArrayOfObject(data.servers, unmarshalServer),
    totalCount: data.total_count
  };
};
const unmarshalListServersTypesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListServersTypesResponse' failed as data isn't a dictionary.`);
  }
  return {
    servers: unmarshalMapOfObject(data.servers, unmarshalServerType),
    totalCount: data.total_count
  };
};
const unmarshalListSnapshotsResponse$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListSnapshotsResponse' failed as data isn't a dictionary.`);
  }
  return {
    snapshots: unmarshalArrayOfObject(data.snapshots, unmarshalSnapshot$1),
    totalCount: data.total_count
  };
};
const unmarshalListVolumesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListVolumesResponse' failed as data isn't a dictionary.`);
  }
  return {
    totalCount: data.total_count,
    volumes: unmarshalArrayOfObject(data.volumes, unmarshalVolume$1)
  };
};
const unmarshalListVolumesTypesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListVolumesTypesResponse' failed as data isn't a dictionary.`);
  }
  return {
    totalCount: data.total_count,
    volumes: unmarshalMapOfObject(data.volumes, unmarshalVolumeType)
  };
};
const unmarshalServerActionResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ServerActionResponse' failed as data isn't a dictionary.`);
  }
  return {
    task: data.task ? unmarshalTask(data.task) : undefined
  };
};
const unmarshalSetImageResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SetImageResponse' failed as data isn't a dictionary.`);
  }
  return {
    image: data.image ? unmarshalImage$3(data.image) : undefined
  };
};
const unmarshalSetPlacementGroupResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SetPlacementGroupResponse' failed as data isn't a dictionary.`);
  }
  return {
    placementGroup: data.placement_group ? unmarshalPlacementGroup(data.placement_group) : undefined
  };
};
const unmarshalSetPlacementGroupServersResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SetPlacementGroupServersResponse' failed as data isn't a dictionary.`);
  }
  return {
    servers: unmarshalArrayOfObject(data.servers, unmarshalPlacementGroupServer)
  };
};
const unmarshalSetSecurityGroupResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SetSecurityGroupResponse' failed as data isn't a dictionary.`);
  }
  return {
    securityGroup: data.security_group ? unmarshalSecurityGroup(data.security_group) : undefined
  };
};
const unmarshalSetSecurityGroupRuleResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SetSecurityGroupRuleResponse' failed as data isn't a dictionary.`);
  }
  return {
    rule: data.rule ? unmarshalSecurityGroupRule(data.rule) : undefined
  };
};
const unmarshalSetSecurityGroupRulesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SetSecurityGroupRulesResponse' failed as data isn't a dictionary.`);
  }
  return {
    rules: unmarshalArrayOfObject(data.rules, unmarshalSecurityGroupRule)
  };
};
const unmarshalSetServerResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SetServerResponse' failed as data isn't a dictionary.`);
  }
  return {
    server: data.server ? unmarshalServer(data.server) : undefined
  };
};
const unmarshalSetSnapshotResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SetSnapshotResponse' failed as data isn't a dictionary.`);
  }
  return {
    snapshot: data.snapshot ? unmarshalSnapshot$1(data.snapshot) : undefined
  };
};
const unmarshalUpdateIpResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'UpdateIpResponse' failed as data isn't a dictionary.`);
  }
  return {
    ip: data.ip ? unmarshalIp$1(data.ip) : undefined
  };
};
const unmarshalUpdatePlacementGroupResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'UpdatePlacementGroupResponse' failed as data isn't a dictionary.`);
  }
  return {
    placementGroup: data.placement_group ? unmarshalPlacementGroup(data.placement_group) : undefined
  };
};
const unmarshalUpdatePlacementGroupServersResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'UpdatePlacementGroupServersResponse' failed as data isn't a dictionary.`);
  }
  return {
    servers: unmarshalArrayOfObject(data.servers, unmarshalPlacementGroupServer)
  };
};
const unmarshalUpdateServerResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'UpdateServerResponse' failed as data isn't a dictionary.`);
  }
  return {
    server: data.server ? unmarshalServer(data.server) : undefined
  };
};
const unmarshalUpdateVolumeResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'UpdateVolumeResponse' failed as data isn't a dictionary.`);
  }
  return {
    volume: data.volume ? unmarshalVolume$1(data.volume) : undefined
  };
};
const marshalServerSummary$1 = (request, defaults) => ({
  id: request.id,
  name: request.name
});
const marshalBootscript$1 = (request, defaults) => ({
  arch: request.arch,
  bootcmdargs: request.bootcmdargs,
  default: request.default,
  dtb: request.dtb,
  id: request.id,
  initrd: request.initrd,
  kernel: request.kernel,
  organization: request.organization,
  project: request.project,
  public: request.public,
  title: request.title,
  zone: request.zone
});
const marshalVolume$1 = (request, defaults) => ({
  creation_date: request.creationDate,
  export_uri: request.exportUri,
  id: request.id,
  modification_date: request.modificationDate,
  name: request.name,
  organization: request.organization,
  project: request.project,
  server: request.server ? marshalServerSummary$1(request.server) : undefined,
  size: request.size,
  state: request.state,
  tags: request.tags,
  volume_type: request.volumeType,
  zone: request.zone
});
const marshalVolumeSummary$1 = (request, defaults) => ({
  id: request.id,
  name: request.name,
  size: request.size,
  volume_type: request.volumeType
});
const marshalImage = (request, defaults) => ({
  arch: request.arch,
  creation_date: request.creationDate,
  default_bootscript: request.defaultBootscript ? marshalBootscript$1(request.defaultBootscript) : undefined,
  extra_volumes: Object.entries(request.extraVolumes).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: marshalVolume$1(value)
  }), {}),
  from_server: request.fromServer,
  id: request.id,
  modification_date: request.modificationDate,
  name: request.name,
  organization: request.organization,
  project: request.project,
  public: request.public,
  root_volume: request.rootVolume ? marshalVolumeSummary$1(request.rootVolume) : undefined,
  state: request.state,
  tags: request.tags,
  zone: request.zone
});
const marshalPlacementGroup = (request, defaults) => ({
  id: request.id,
  name: request.name,
  organization: request.organization,
  policy_mode: request.policyMode,
  policy_respected: request.policyRespected,
  policy_type: request.policyType,
  project: request.project,
  tags: request.tags,
  zone: request.zone
});
const marshalPrivateNIC = (request, defaults) => ({
  id: request.id,
  mac_address: request.macAddress,
  private_network_id: request.privateNetworkId,
  server_id: request.serverId,
  state: request.state,
  tags: request.tags
});
const marshalSecurityGroupSummary = (request, defaults) => ({
  id: request.id,
  name: request.name
});
const marshalSecurityGroupTemplate = (request, defaults) => ({
  id: request.id,
  name: request.name
});
const marshalServerActionRequestVolumeBackupTemplate = (request, defaults) => ({
  volume_type: request.volumeType
});
const marshalServerIp = (request, defaults) => ({
  address: request.address,
  dynamic: request.dynamic,
  id: request.id
});
const marshalServerIpv6 = (request, defaults) => ({
  address: request.address,
  gateway: request.gateway,
  netmask: request.netmask
});
const marshalServerLocation = (request, defaults) => ({
  cluster_id: request.clusterId,
  hypervisor_id: request.hypervisorId,
  node_id: request.nodeId,
  platform_id: request.platformId,
  zone_id: request.zoneId
});
const marshalServerMaintenance = (request, defaults) => ({
  reason: request.reason
});
const marshalSetSecurityGroupRulesRequestRule = (request, defaults) => ({
  action: request.action,
  dest_port_from: request.destPortFrom,
  dest_port_to: request.destPortTo,
  direction: request.direction,
  editable: request.editable,
  id: request.id,
  ip_range: request.ipRange,
  position: request.position,
  protocol: request.protocol,
  zone: request.zone
});
const marshalSnapshotBaseVolume = (request, defaults) => ({
  id: request.id,
  name: request.name
});
const marshalVolumeServerTemplate = (request, defaults) => ({
  base_snapshot: request.baseSnapshot,
  boot: request.boot,
  id: request.id,
  name: request.name,
  organization: request.organization,
  project: request.project,
  size: request.size,
  volume_type: request.volumeType
});
const marshalVolumeTemplate = (request, defaults) => ({
  id: request.id,
  name: request.name,
  size: request.size,
  volume_type: request.volumeType,
  ...resolveOneOf([{
    param: 'project',
    value: request.project
  }, {
    param: 'organization',
    value: request.organization
  }])
});
const marshalCreateImageRequest = (request, defaults) => ({
  arch: request.arch,
  default_bootscript: request.defaultBootscript,
  extra_volumes: request.extraVolumes ? Object.entries(request.extraVolumes).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: marshalVolumeTemplate(value)
  }), {}) : undefined,
  name: request.name || randomName('img'),
  public: request.public,
  root_volume: request.rootVolume,
  tags: request.tags,
  ...resolveOneOf([{
    default: defaults.defaultProjectId,
    param: 'project',
    value: request.project
  }, {
    default: defaults.defaultOrganizationId,
    param: 'organization',
    value: request.organization
  }])
});
const marshalCreateIpRequest$1 = (request, defaults) => ({
  server: request.server,
  tags: request.tags,
  ...resolveOneOf([{
    default: defaults.defaultProjectId,
    param: 'project',
    value: request.project
  }, {
    default: defaults.defaultOrganizationId,
    param: 'organization',
    value: request.organization
  }])
});
const marshalCreatePlacementGroupRequest = (request, defaults) => ({
  name: request.name || randomName('pg'),
  policy_mode: request.policyMode ?? 'optional',
  policy_type: request.policyType ?? 'max_availability',
  tags: request.tags,
  ...resolveOneOf([{
    default: defaults.defaultProjectId,
    param: 'project',
    value: request.project
  }, {
    default: defaults.defaultOrganizationId,
    param: 'organization',
    value: request.organization
  }])
});
const marshalCreatePrivateNICRequest = (request, defaults) => ({
  private_network_id: request.privateNetworkId,
  tags: request.tags
});
const marshalCreateSecurityGroupRequest = (request, defaults) => ({
  description: request.description,
  enable_default_security: request.enableDefaultSecurity,
  inbound_default_policy: request.inboundDefaultPolicy ?? 'accept',
  name: request.name || randomName('sg'),
  outbound_default_policy: request.outboundDefaultPolicy ?? 'accept',
  stateful: request.stateful,
  tags: request.tags,
  ...resolveOneOf([{
    param: 'organization_default',
    value: request.organizationDefault
  }, {
    param: 'project_default',
    value: request.projectDefault
  }]),
  ...resolveOneOf([{
    default: defaults.defaultProjectId,
    param: 'project',
    value: request.project
  }, {
    default: defaults.defaultOrganizationId,
    param: 'organization',
    value: request.organization
  }])
});
const marshalCreateSecurityGroupRuleRequest = (request, defaults) => ({
  action: request.action,
  dest_port_from: request.destPortFrom,
  dest_port_to: request.destPortTo,
  direction: request.direction,
  editable: request.editable,
  ip_range: request.ipRange,
  position: request.position,
  protocol: request.protocol
});
const marshalCreateServerRequest = (request, defaults) => ({
  boot_type: request.bootType,
  bootscript: request.bootscript,
  commercial_type: request.commercialType,
  dynamic_ip_required: request.dynamicIpRequired,
  enable_ipv6: request.enableIpv6,
  image: request.image,
  name: request.name || randomName('srv'),
  placement_group: request.placementGroup,
  public_ip: request.publicIp,
  security_group: request.securityGroup,
  tags: request.tags,
  volumes: request.volumes ? Object.entries(request.volumes).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: marshalVolumeServerTemplate(value)
  }), {}) : undefined,
  ...resolveOneOf([{
    default: defaults.defaultProjectId,
    param: 'project',
    value: request.project
  }, {
    default: defaults.defaultOrganizationId,
    param: 'organization',
    value: request.organization
  }])
});
const marshalCreateSnapshotRequest$1 = (request, defaults) => ({
  bucket: request.bucket,
  key: request.key,
  name: request.name || randomName('snp'),
  size: request.size,
  tags: request.tags,
  volume_id: request.volumeId,
  volume_type: request.volumeType ?? 'unknown_volume_type',
  ...resolveOneOf([{
    default: defaults.defaultProjectId,
    param: 'project',
    value: request.project
  }, {
    default: defaults.defaultOrganizationId,
    param: 'organization',
    value: request.organization
  }])
});
const marshalCreateVolumeRequest = (request, defaults) => ({
  name: request.name || randomName('vol'),
  tags: request.tags,
  volume_type: request.volumeType ?? 'l_ssd',
  ...resolveOneOf([{
    default: defaults.defaultProjectId,
    param: 'project',
    value: request.project
  }, {
    default: defaults.defaultOrganizationId,
    param: 'organization',
    value: request.organization
  }]),
  ...resolveOneOf([{
    param: 'size',
    value: request.size
  }, {
    param: 'base_volume',
    value: request.baseVolume
  }, {
    param: 'base_snapshot',
    value: request.baseSnapshot
  }])
});
const marshalExportSnapshotRequest = (request, defaults) => ({
  bucket: request.bucket,
  key: request.key
});
const marshalServerActionRequest = (request, defaults) => ({
  action: request.action ?? 'poweron',
  name: request.name,
  volumes: request.volumes ? Object.entries(request.volumes).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: marshalServerActionRequestVolumeBackupTemplate(value)
  }), {}) : undefined
});
const marshalSetImageRequest = (request, defaults) => ({
  arch: request.arch,
  creation_date: request.creationDate,
  default_bootscript: request.defaultBootscript ? marshalBootscript$1(request.defaultBootscript) : undefined,
  extra_volumes: request.extraVolumes ? Object.entries(request.extraVolumes).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: marshalVolume$1(value)
  }), {}) : undefined,
  from_server: request.fromServer,
  modification_date: request.modificationDate,
  name: request.name,
  organization: request.organization,
  project: request.project,
  public: request.public,
  root_volume: request.rootVolume ? marshalVolumeSummary$1(request.rootVolume) : undefined,
  state: request.state,
  tags: request.tags
});
const marshalSetPlacementGroupRequest = (request, defaults) => ({
  name: request.name,
  organization: request.organization,
  policy_mode: request.policyMode,
  policy_type: request.policyType,
  project: request.project,
  tags: request.tags
});
const marshalSetPlacementGroupServersRequest = (request, defaults) => ({
  servers: request.servers
});
const marshalSetSecurityGroupRequest = (request, defaults) => ({
  creation_date: request.creationDate,
  description: request.description,
  enable_default_security: request.enableDefaultSecurity,
  inbound_default_policy: request.inboundDefaultPolicy,
  modification_date: request.modificationDate,
  name: request.name,
  organization: request.organization,
  organization_default: request.organizationDefault,
  outbound_default_policy: request.outboundDefaultPolicy,
  project: request.project,
  project_default: request.projectDefault,
  servers: request.servers ? request.servers.map(elt => marshalServerSummary$1(elt)) : undefined,
  stateful: request.stateful,
  tags: request.tags
});
const marshalSetSecurityGroupRuleRequest = (request, defaults) => ({
  action: request.action,
  dest_port_from: request.destPortFrom,
  dest_port_to: request.destPortTo,
  direction: request.direction,
  editable: request.editable,
  id: request.id,
  ip_range: request.ipRange,
  position: request.position,
  protocol: request.protocol
});
const marshalSetSecurityGroupRulesRequest = (request, defaults) => ({
  rules: request.rules ? request.rules.map(elt => marshalSetSecurityGroupRulesRequestRule(elt)) : undefined
});
const marshalSetServerRequest = (request, defaults) => ({
  allowed_actions: request.allowedActions,
  arch: request.arch,
  boot_type: request.bootType,
  bootscript: request.bootscript ? marshalBootscript$1(request.bootscript) : undefined,
  commercial_type: request.commercialType,
  creation_date: request.creationDate,
  dynamic_ip_required: request.dynamicIpRequired,
  enable_ipv6: request.enableIpv6,
  hostname: request.hostname,
  image: request.image ? marshalImage(request.image) : undefined,
  ipv6: request.ipv6 ? marshalServerIpv6(request.ipv6) : undefined,
  location: request.location ? marshalServerLocation(request.location) : undefined,
  maintenances: request.maintenances ? request.maintenances.map(elt => marshalServerMaintenance(elt)) : undefined,
  modification_date: request.modificationDate,
  name: request.name,
  organization: request.organization,
  placement_group: request.placementGroup ? marshalPlacementGroup(request.placementGroup) : undefined,
  private_ip: request.privateIp,
  private_nics: request.privateNics ? request.privateNics.map(elt => marshalPrivateNIC(elt)) : undefined,
  project: request.project,
  protected: request.protected,
  public_ip: request.publicIp ? marshalServerIp(request.publicIp) : undefined,
  security_group: request.securityGroup ? marshalSecurityGroupSummary(request.securityGroup) : undefined,
  state: request.state,
  state_detail: request.stateDetail,
  tags: request.tags,
  volumes: request.volumes ? Object.entries(request.volumes).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: marshalVolume$1(value)
  }), {}) : undefined
});
const marshalSetSnapshotRequest = (request, defaults) => ({
  base_volume: request.baseVolume ? marshalSnapshotBaseVolume(request.baseVolume) : undefined,
  creation_date: request.creationDate,
  id: request.id,
  modification_date: request.modificationDate,
  name: request.name,
  organization: request.organization,
  project: request.project,
  size: request.size,
  state: request.state,
  tags: request.tags,
  volume_type: request.volumeType
});
const marshalUpdateIpRequest$1 = (request, defaults) => ({
  reverse: request.reverse,
  server: request.server,
  tags: request.tags
});
const marshalUpdatePlacementGroupRequest = (request, defaults) => ({
  name: request.name,
  policy_mode: request.policyMode,
  policy_type: request.policyType,
  tags: request.tags
});
const marshalUpdatePlacementGroupServersRequest = (request, defaults) => ({
  servers: request.servers
});
const marshalUpdatePrivateNICRequest = (request, defaults) => ({
  tags: request.tags
});
const marshalUpdateServerRequest = (request, defaults) => ({
  boot_type: request.bootType,
  bootscript: request.bootscript,
  dynamic_ip_required: request.dynamicIpRequired,
  enable_ipv6: request.enableIpv6,
  name: request.name,
  placement_group: request.placementGroup,
  private_nics: request.privateNics ? request.privateNics.map(elt => marshalPrivateNIC(elt)) : undefined,
  protected: request.protected,
  security_group: request.securityGroup ? marshalSecurityGroupTemplate(request.securityGroup) : undefined,
  tags: request.tags,
  volumes: request.volumes ? Object.entries(request.volumes).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: marshalVolumeServerTemplate(value)
  }), {}) : undefined
});
const marshalUpdateVolumeRequest = (request, defaults) => ({
  name: request.name,
  size: request.size,
  tags: request.tags
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$d = {
  'Content-Type': 'application/json; charset=utf-8'
};

/** Instance API. */
let API$f = class API extends API$q {
  /** Lists the available zones of the API. */
  static LOCALITIES = ['fr-par-1', 'fr-par-2', 'fr-par-3', 'nl-ams-1', 'nl-ams-2', 'pl-waw-1', 'pl-waw-2'];

  /**
   * Get availability. Get availability for all Instance types.
   *
   * @param request - The request {@link GetServerTypesAvailabilityRequest}
   * @returns A Promise of GetServerTypesAvailabilityResponse
   */
  getServerTypesAvailability = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/products/servers/availability`,
    urlParams: urlParams(['page', request.page], ['per_page', request.perPage ?? this.client.settings.defaultPageSize])
  }, unmarshalGetServerTypesAvailabilityResponse);

  /**
   * List Instance types. List available Instance types and their technical
   * details.
   *
   * @param request - The request {@link ListServersTypesRequest}
   * @returns A Promise of ListServersTypesResponse
   */
  listServersTypes = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/products/servers`,
    urlParams: urlParams(['page', request.page], ['per_page', request.perPage ?? this.client.settings.defaultPageSize])
  }, unmarshalListServersTypesResponse);

  /**
   * List volume types. List all volume types and their technical details.
   *
   * @param request - The request {@link ListVolumesTypesRequest}
   * @returns A Promise of ListVolumesTypesResponse
   */
  listVolumesTypes = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/products/volumes`,
    urlParams: urlParams(['page', request.page], ['per_page', request.perPage ?? this.client.settings.defaultPageSize])
  }, unmarshalListVolumesTypesResponse);
  pageOfListServers = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers`,
    urlParams: urlParams(['commercial_type', request.commercialType], ['name', request.name], ['order', request.order], ['organization', request.organization], ['page', request.page], ['per_page', request.perPage ?? this.client.settings.defaultPageSize], ['private_ip', request.privateIp], ['private_network', request.privateNetwork], ['project', request.project], ['state', request.state], ['tags', request.tags && request.tags.length > 0 ? request.tags.join(',') : undefined], ['without_ip', request.withoutIp])
  }, unmarshalListServersResponse);

  /**
   * List all Instances. List all Instances in a specified Availability Zone,
   * e.g. `fr-par-1`.
   *
   * @param request - The request {@link ListServersRequest}
   * @returns A Promise of ListServersResponse
   */
  listServers = (request = {}) => enrichForPagination('servers', this.pageOfListServers, request);
  _createServer = request => this.client.fetch({
    body: JSON.stringify(marshalCreateServerRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'POST',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers`
  }, unmarshalCreateServerResponse);

  /**
   * Delete an Instance. Delete the Instance with the specified ID.
   *
   * @param request - The request {@link DeleteServerRequest}
   */
  deleteServer = request => this.client.fetch({
    method: 'DELETE',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}`
  });

  /**
   * Get an Instance. Get the details of a specified Instance.
   *
   * @param request - The request {@link GetServerRequest}
   * @returns A Promise of GetServerResponse
   */
  getServer = request => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}`
  }, unmarshalGetServerResponse);
  _setServer = request => this.client.fetch({
    body: JSON.stringify(marshalSetServerRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'PUT',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('id', request.id)}`
  }, unmarshalSetServerResponse);
  _updateServer = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateServerRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'PATCH',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}`
  }, unmarshalUpdateServerResponse);

  /**
   * List Instance actions. List all actions (e.g. power on, power off, reboot)
   * that can currently be performed on an Instance.
   *
   * @param request - The request {@link ListServerActionsRequest}
   * @returns A Promise of ListServerActionsResponse
   */
  listServerActions = request => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/action`
  }, unmarshalListServerActionsResponse);

  /**
   * Perform action. Perform an action on an Instance. Available actions are:
   * `poweron`: Start a stopped Instance. `poweroff`: Fully stop the Instance
   * and release the hypervisor slot. `stop_in_place`: Stop the Instance, but
   * keep the slot on the hypervisor. `reboot`: Stop the instance and restart
   * it. `backup`: Create an image with all the volumes of an Instance.
   * `terminate`: Delete the Instance along with all attached volumes.
   *
   * Keep in mind that terminating an Instance will result in the deletion of
   * all attached volumes, including local and block storage. If you want to
   * preserve your local volumes, you should use the `archive` action instead of
   * `terminate`. Similarly, if you want to keep your block storage volumes, you
   * must first detach them before issuing the `terminate` command. For more
   * information, read the [Volumes](#path-volumes-list-volumes) documentation.
   *
   * @param request - The request {@link ServerActionRequest}
   * @returns A Promise of ServerActionResponse
   */
  serverAction = request => this.client.fetch({
    body: JSON.stringify(marshalServerActionRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'POST',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/action`
  }, unmarshalServerActionResponse);

  /**
   * List user data. List all user data keys registered on a specified Instance.
   *
   * @param request - The request {@link ListServerUserDataRequest}
   * @returns A Promise of ListServerUserDataResponse
   */
  listServerUserData = request => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/user_data`
  }, unmarshalListServerUserDataResponse);

  /**
   * Delete user data. Delete the specified key from an Instance's user data.
   *
   * @param request - The request {@link DeleteServerUserDataRequest}
   */
  deleteServerUserData = request => this.client.fetch({
    method: 'DELETE',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/user_data/${validatePathParam('key', request.key)}`
  });
  pageOfListImages = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/images`,
    urlParams: urlParams(['arch', request.arch], ['name', request.name], ['organization', request.organization], ['page', request.page], ['per_page', request.perPage ?? this.client.settings.defaultPageSize], ['project', request.project], ['public', request.public], ['tags', request.tags])
  }, unmarshalListImagesResponse$3);

  /**
   * List Instance images. List all existing Instance images.
   *
   * @param request - The request {@link ListImagesRequest}
   * @returns A Promise of ListImagesResponse
   */
  listImages = (request = {}) => enrichForPagination('images', this.pageOfListImages, request);

  /**
   * Get an Instance image. Get details of an image with the specified ID.
   *
   * @param request - The request {@link GetImageRequest}
   * @returns A Promise of GetImageResponse
   */
  getImage = request => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/images/${validatePathParam('imageId', request.imageId)}`
  }, unmarshalGetImageResponse$1);

  /**
   * Create an Instance image. Create an Instance image from the specified
   * snapshot ID.
   *
   * @param request - The request {@link CreateImageRequest}
   * @returns A Promise of CreateImageResponse
   */
  createImage = request => this.client.fetch({
    body: JSON.stringify(marshalCreateImageRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'POST',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/images`
  }, unmarshalCreateImageResponse);
  _setImage = request => this.client.fetch({
    body: JSON.stringify(marshalSetImageRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'PUT',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/images/${validatePathParam('id', request.id)}`
  }, unmarshalSetImageResponse);

  /**
   * Delete an Instance image. Delete the image with the specified ID.
   *
   * @param request - The request {@link DeleteImageRequest}
   */
  deleteImage = request => this.client.fetch({
    method: 'DELETE',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/images/${validatePathParam('imageId', request.imageId)}`
  });
  pageOfListSnapshots = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/snapshots`,
    urlParams: urlParams(['name', request.name], ['organization', request.organization], ['page', request.page], ['per_page', request.perPage ?? this.client.settings.defaultPageSize], ['project', request.project], ['tags', request.tags])
  }, unmarshalListSnapshotsResponse$1);

  /**
   * List snapshots. List all snapshots of an Organization in a specified
   * Availability Zone.
   *
   * @param request - The request {@link ListSnapshotsRequest}
   * @returns A Promise of ListSnapshotsResponse
   */
  listSnapshots = (request = {}) => enrichForPagination('snapshots', this.pageOfListSnapshots, request);

  /**
   * Create a snapshot from a specified volume or from a QCOW2 file. Create a
   * snapshot from a specified volume or from a QCOW2 file in a specified
   * Availability Zone.
   *
   * @param request - The request {@link CreateSnapshotRequest}
   * @returns A Promise of CreateSnapshotResponse
   */
  createSnapshot = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalCreateSnapshotRequest$1(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'POST',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/snapshots`
  }, unmarshalCreateSnapshotResponse);

  /**
   * Get a snapshot. Get details of a snapshot with the specified ID.
   *
   * @param request - The request {@link GetSnapshotRequest}
   * @returns A Promise of GetSnapshotResponse
   */
  getSnapshot = request => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/snapshots/${validatePathParam('snapshotId', request.snapshotId)}`
  }, unmarshalGetSnapshotResponse);
  _setSnapshot = request => this.client.fetch({
    body: JSON.stringify(marshalSetSnapshotRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'PUT',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/snapshots/${validatePathParam('snapshotId', request.snapshotId)}`
  }, unmarshalSetSnapshotResponse);

  /**
   * Delete a snapshot. Delete the snapshot with the specified ID.
   *
   * @param request - The request {@link DeleteSnapshotRequest}
   */
  deleteSnapshot = request => this.client.fetch({
    method: 'DELETE',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/snapshots/${validatePathParam('snapshotId', request.snapshotId)}`
  });

  /**
   * Export a snapshot. Export a snapshot to a specified S3 bucket in the same
   * region.
   *
   * @param request - The request {@link ExportSnapshotRequest}
   * @returns A Promise of ExportSnapshotResponse
   */
  exportSnapshot = request => this.client.fetch({
    body: JSON.stringify(marshalExportSnapshotRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'POST',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/snapshots/${validatePathParam('snapshotId', request.snapshotId)}/export`
  }, unmarshalExportSnapshotResponse);
  pageOfListVolumes = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/volumes`,
    urlParams: urlParams(['name', request.name], ['organization', request.organization], ['page', request.page], ['per_page', request.perPage ?? this.client.settings.defaultPageSize], ['project', request.project], ['tags', request.tags && request.tags.length > 0 ? request.tags.join(',') : undefined], ['volume_type', request.volumeType])
  }, unmarshalListVolumesResponse);

  /**
   * List volumes. List volumes in the specified Availability Zone. You can
   * filter the output by volume type.
   *
   * @param request - The request {@link ListVolumesRequest}
   * @returns A Promise of ListVolumesResponse
   */
  listVolumes = (request = {}) => enrichForPagination('volumes', this.pageOfListVolumes, request);

  /**
   * Create a volume. Create a volume of a specified type in an Availability
   * Zone.
   *
   * @param request - The request {@link CreateVolumeRequest}
   * @returns A Promise of CreateVolumeResponse
   */
  createVolume = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalCreateVolumeRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'POST',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/volumes`
  }, unmarshalCreateVolumeResponse);

  /**
   * Get a volume. Get details of a volume with the specified ID.
   *
   * @param request - The request {@link GetVolumeRequest}
   * @returns A Promise of GetVolumeResponse
   */
  getVolume = request => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/volumes/${validatePathParam('volumeId', request.volumeId)}`
  }, unmarshalGetVolumeResponse);

  /**
   * Update a volume. Replace the name and/or size properties of a volume
   * specified by its ID, with the specified value(s). Any volume name can be
   * changed, however only `b_ssd` volumes can currently be increased in size.
   *
   * @param request - The request {@link UpdateVolumeRequest}
   * @returns A Promise of UpdateVolumeResponse
   */
  updateVolume = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateVolumeRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'PATCH',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/volumes/${validatePathParam('volumeId', request.volumeId)}`
  }, unmarshalUpdateVolumeResponse);

  /**
   * Delete a volume. Delete the volume with the specified ID.
   *
   * @param request - The request {@link DeleteVolumeRequest}
   */
  deleteVolume = request => this.client.fetch({
    method: 'DELETE',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/volumes/${validatePathParam('volumeId', request.volumeId)}`
  });
  pageOfListSecurityGroups = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/security_groups`,
    urlParams: urlParams(['name', request.name], ['organization', request.organization], ['page', request.page], ['per_page', request.perPage ?? this.client.settings.defaultPageSize], ['project', request.project], ['project_default', request.projectDefault], ['tags', request.tags && request.tags.length > 0 ? request.tags.join(',') : undefined])
  }, unmarshalListSecurityGroupsResponse);

  /**
   * List security groups. List all existing security groups.
   *
   * @param request - The request {@link ListSecurityGroupsRequest}
   * @returns A Promise of ListSecurityGroupsResponse
   */
  listSecurityGroups = (request = {}) => enrichForPagination('securityGroups', this.pageOfListSecurityGroups, request);

  /**
   * Create a security group. Create a security group with a specified name and
   * description.
   *
   * @param request - The request {@link CreateSecurityGroupRequest}
   * @returns A Promise of CreateSecurityGroupResponse
   */
  createSecurityGroup = request => this.client.fetch({
    body: JSON.stringify(marshalCreateSecurityGroupRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'POST',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/security_groups`
  }, unmarshalCreateSecurityGroupResponse);

  /**
   * Get a security group. Get the details of a security group with the
   * specified ID.
   *
   * @param request - The request {@link GetSecurityGroupRequest}
   * @returns A Promise of GetSecurityGroupResponse
   */
  getSecurityGroup = request => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/security_groups/${validatePathParam('securityGroupId', request.securityGroupId)}`
  }, unmarshalGetSecurityGroupResponse);

  /**
   * Delete a security group. Delete a security group with the specified ID.
   *
   * @param request - The request {@link DeleteSecurityGroupRequest}
   */
  deleteSecurityGroup = request => this.client.fetch({
    method: 'DELETE',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/security_groups/${validatePathParam('securityGroupId', request.securityGroupId)}`
  });
  _setSecurityGroup = request => this.client.fetch({
    body: JSON.stringify(marshalSetSecurityGroupRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'PUT',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/security_groups/${validatePathParam('id', request.id)}`
  }, unmarshalSetSecurityGroupResponse);

  /**
   * Get default rules. Lists the default rules applied to all the security
   * groups.
   *
   * @param request - The request {@link ListDefaultSecurityGroupRulesRequest}
   * @returns A Promise of ListSecurityGroupRulesResponse
   */
  listDefaultSecurityGroupRules = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/security_groups/default/rules`
  }, unmarshalListSecurityGroupRulesResponse);
  pageOfListSecurityGroupRules = request => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/security_groups/${validatePathParam('securityGroupId', request.securityGroupId)}/rules`,
    urlParams: urlParams(['page', request.page], ['per_page', request.perPage ?? this.client.settings.defaultPageSize])
  }, unmarshalListSecurityGroupRulesResponse);

  /**
   * List rules. List the rules of the a specified security group ID.
   *
   * @param request - The request {@link ListSecurityGroupRulesRequest}
   * @returns A Promise of ListSecurityGroupRulesResponse
   */
  listSecurityGroupRules = request => enrichForPagination('rules', this.pageOfListSecurityGroupRules, request);

  /**
   * Create rule. Create a rule in the specified security group ID.
   *
   * @param request - The request {@link CreateSecurityGroupRuleRequest}
   * @returns A Promise of CreateSecurityGroupRuleResponse
   */
  createSecurityGroupRule = request => this.client.fetch({
    body: JSON.stringify(marshalCreateSecurityGroupRuleRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'POST',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/security_groups/${validatePathParam('securityGroupId', request.securityGroupId)}/rules`
  }, unmarshalCreateSecurityGroupRuleResponse);

  /**
   * Update all the rules of a security group. Replaces the existing rules of
   * the security group with the rules provided. This endpoint supports the
   * update of existing rules, creation of new rules and deletion of existing
   * rules when they are not passed in the request.
   *
   * @param request - The request {@link SetSecurityGroupRulesRequest}
   * @returns A Promise of SetSecurityGroupRulesResponse
   */
  setSecurityGroupRules = request => this.client.fetch({
    body: JSON.stringify(marshalSetSecurityGroupRulesRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'PUT',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/security_groups/${validatePathParam('securityGroupId', request.securityGroupId)}/rules`
  }, unmarshalSetSecurityGroupRulesResponse);

  /**
   * Delete rule. Delete a security group rule with the specified ID.
   *
   * @param request - The request {@link DeleteSecurityGroupRuleRequest}
   */
  deleteSecurityGroupRule = request => this.client.fetch({
    method: 'DELETE',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/security_groups/${validatePathParam('securityGroupId', request.securityGroupId)}/rules/${validatePathParam('securityGroupRuleId', request.securityGroupRuleId)}`
  });

  /**
   * Get rule. Get details of a security group rule with the specified ID.
   *
   * @param request - The request {@link GetSecurityGroupRuleRequest}
   * @returns A Promise of GetSecurityGroupRuleResponse
   */
  getSecurityGroupRule = request => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/security_groups/${validatePathParam('securityGroupId', request.securityGroupId)}/rules/${validatePathParam('securityGroupRuleId', request.securityGroupRuleId)}`
  }, unmarshalGetSecurityGroupRuleResponse);
  _setSecurityGroupRule = request => this.client.fetch({
    body: JSON.stringify(marshalSetSecurityGroupRuleRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'PUT',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/security_groups/${validatePathParam('securityGroupId', request.securityGroupId)}/rules/${validatePathParam('securityGroupRuleId', request.securityGroupRuleId)}`
  }, unmarshalSetSecurityGroupRuleResponse);
  pageOfListPlacementGroups = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/placement_groups`,
    urlParams: urlParams(['name', request.name], ['organization', request.organization], ['page', request.page], ['per_page', request.perPage ?? this.client.settings.defaultPageSize], ['project', request.project], ['tags', request.tags && request.tags.length > 0 ? request.tags.join(',') : undefined])
  }, unmarshalListPlacementGroupsResponse);

  /**
   * List placement groups. List all placement groups in a specified
   * Availability Zone.
   *
   * @param request - The request {@link ListPlacementGroupsRequest}
   * @returns A Promise of ListPlacementGroupsResponse
   */
  listPlacementGroups = (request = {}) => enrichForPagination('placementGroups', this.pageOfListPlacementGroups, request);

  /**
   * Create a placement group. Create a new placement group in a specified
   * Availability Zone.
   *
   * @param request - The request {@link CreatePlacementGroupRequest}
   * @returns A Promise of CreatePlacementGroupResponse
   */
  createPlacementGroup = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalCreatePlacementGroupRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'POST',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/placement_groups`
  }, unmarshalCreatePlacementGroupResponse);

  /**
   * Get a placement group. Get the specified placement group.
   *
   * @param request - The request {@link GetPlacementGroupRequest}
   * @returns A Promise of GetPlacementGroupResponse
   */
  getPlacementGroup = request => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/placement_groups/${validatePathParam('placementGroupId', request.placementGroupId)}`
  }, unmarshalGetPlacementGroupResponse);

  /**
   * Set placement group. Set all parameters of the specified placement group.
   *
   * @param request - The request {@link SetPlacementGroupRequest}
   * @returns A Promise of SetPlacementGroupResponse
   */
  setPlacementGroup = request => this.client.fetch({
    body: JSON.stringify(marshalSetPlacementGroupRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'PUT',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/placement_groups/${validatePathParam('placementGroupId', request.placementGroupId)}`
  }, unmarshalSetPlacementGroupResponse);

  /**
   * Update a placement group. Update one or more parameter of the specified
   * placement group.
   *
   * @param request - The request {@link UpdatePlacementGroupRequest}
   * @returns A Promise of UpdatePlacementGroupResponse
   */
  updatePlacementGroup = request => this.client.fetch({
    body: JSON.stringify(marshalUpdatePlacementGroupRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'PATCH',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/placement_groups/${validatePathParam('placementGroupId', request.placementGroupId)}`
  }, unmarshalUpdatePlacementGroupResponse);

  /**
   * Delete the specified placement group.
   *
   * @param request - The request {@link DeletePlacementGroupRequest}
   */
  deletePlacementGroup = request => this.client.fetch({
    method: 'DELETE',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/placement_groups/${validatePathParam('placementGroupId', request.placementGroupId)}`
  });

  /**
   * Get placement group servers. Get all Instances belonging to the specified
   * placement group.
   *
   * @param request - The request {@link GetPlacementGroupServersRequest}
   * @returns A Promise of GetPlacementGroupServersResponse
   */
  getPlacementGroupServers = request => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/placement_groups/${validatePathParam('placementGroupId', request.placementGroupId)}/servers`
  }, unmarshalGetPlacementGroupServersResponse);

  /**
   * Set placement group servers. Set all Instances belonging to the specified
   * placement group.
   *
   * @param request - The request {@link SetPlacementGroupServersRequest}
   * @returns A Promise of SetPlacementGroupServersResponse
   */
  setPlacementGroupServers = request => this.client.fetch({
    body: JSON.stringify(marshalSetPlacementGroupServersRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'PUT',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/placement_groups/${validatePathParam('placementGroupId', request.placementGroupId)}/servers`
  }, unmarshalSetPlacementGroupServersResponse);

  /**
   * Update placement group servers. Update all Instances belonging to the
   * specified placement group.
   *
   * @param request - The request {@link UpdatePlacementGroupServersRequest}
   * @returns A Promise of UpdatePlacementGroupServersResponse
   */
  updatePlacementGroupServers = request => this.client.fetch({
    body: JSON.stringify(marshalUpdatePlacementGroupServersRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'PATCH',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/placement_groups/${validatePathParam('placementGroupId', request.placementGroupId)}/servers`
  }, unmarshalUpdatePlacementGroupServersResponse);
  pageOfListIps = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/ips`,
    urlParams: urlParams(['name', request.name], ['organization', request.organization], ['page', request.page], ['per_page', request.perPage ?? this.client.settings.defaultPageSize], ['project', request.project], ['tags', request.tags && request.tags.length > 0 ? request.tags.join(',') : undefined])
  }, unmarshalListIpsResponse$1);

  /**
   * List all flexible IPs. List all flexible IPs in a specified zone.
   *
   * @param request - The request {@link ListIpsRequest}
   * @returns A Promise of ListIpsResponse
   */
  listIps = (request = {}) => enrichForPagination('ips', this.pageOfListIps, request);

  /**
   * Reserve a flexible IP. Reserve a flexible IP and attach it to the specified
   * Instance.
   *
   * @param request - The request {@link CreateIpRequest}
   * @returns A Promise of CreateIpResponse
   */
  createIp = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalCreateIpRequest$1(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'POST',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/ips`
  }, unmarshalCreateIpResponse);

  /**
   * Get a flexible IP. Get details of an IP with the specified ID or address.
   *
   * @param request - The request {@link GetIpRequest}
   * @returns A Promise of GetIpResponse
   */
  getIp = request => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/ips/${validatePathParam('ip', request.ip)}`
  }, unmarshalGetIpResponse);

  /**
   * Update a flexible IP. Update a flexible IP in the specified zone with the
   * specified ID.
   *
   * @param request - The request {@link UpdateIpRequest}
   * @returns A Promise of UpdateIpResponse
   */
  updateIp = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateIpRequest$1(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'PATCH',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/ips/${validatePathParam('ip', request.ip)}`
  }, unmarshalUpdateIpResponse);

  /**
   * Delete a flexible IP. Delete the IP with the specified ID.
   *
   * @param request - The request {@link DeleteIpRequest}
   */
  deleteIp = request => this.client.fetch({
    method: 'DELETE',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/ips/${validatePathParam('ip', request.ip)}`
  });
  pageOfListPrivateNICs = request => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/private_nics`,
    urlParams: urlParams(['page', request.page], ['per_page', request.perPage ?? this.client.settings.defaultPageSize], ['tags', request.tags && request.tags.length > 0 ? request.tags.join(',') : undefined])
  }, unmarshalListPrivateNICsResponse);

  /**
   * List all private NICs. List all private NICs of a specified Instance.
   *
   * @param request - The request {@link ListPrivateNICsRequest}
   * @returns A Promise of ListPrivateNICsResponse
   */
  listPrivateNICs = request => enrichForPagination('privateNics', this.pageOfListPrivateNICs, request);

  /**
   * Create a private NIC connecting an Instance to a Private Network.
   *
   * @param request - The request {@link CreatePrivateNICRequest}
   * @returns A Promise of CreatePrivateNICResponse
   */
  createPrivateNIC = request => this.client.fetch({
    body: JSON.stringify(marshalCreatePrivateNICRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'POST',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/private_nics`
  }, unmarshalCreatePrivateNICResponse);

  /**
   * Get a private NIC. Get private NIC properties.
   *
   * @param request - The request {@link GetPrivateNICRequest}
   * @returns A Promise of GetPrivateNICResponse
   */
  getPrivateNIC = request => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/private_nics/${validatePathParam('privateNicId', request.privateNicId)}`
  }, unmarshalGetPrivateNICResponse);

  /**
   * Update a private NIC. Update one or more parameter(s) of a specified
   * private NIC.
   *
   * @param request - The request {@link UpdatePrivateNICRequest}
   * @returns A Promise of PrivateNIC
   */
  updatePrivateNIC = request => this.client.fetch({
    body: JSON.stringify(marshalUpdatePrivateNICRequest(request, this.client.settings)),
    headers: jsonContentHeaders$d,
    method: 'PATCH',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/private_nics/${validatePathParam('privateNicId', request.privateNicId)}`
  }, unmarshalPrivateNIC);

  /**
   * Delete a private NIC.
   *
   * @param request - The request {@link DeletePrivateNICRequest}
   */
  deletePrivateNIC = request => this.client.fetch({
    method: 'DELETE',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/private_nics/${validatePathParam('privateNicId', request.privateNicId)}`
  });
  pageOfListBootscripts = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/bootscripts`,
    urlParams: urlParams(['arch', request.arch], ['default', request.default], ['page', request.page], ['per_page', request.perPage ?? this.client.settings.defaultPageSize], ['public', request.public], ['title', request.title])
  }, unmarshalListBootscriptsResponse);

  /**
   * List bootscripts.
   *
   * @deprecated
   * @param request - The request {@link ListBootscriptsRequest}
   * @returns A Promise of ListBootscriptsResponse
   */
  listBootscripts = (request = {}) => enrichForPagination('bootscripts', this.pageOfListBootscripts, request);

  /**
   * Get bootscripts. Get details of a bootscript with the specified ID.
   *
   * @deprecated
   * @param request - The request {@link GetBootscriptRequest}
   * @returns A Promise of GetBootscriptResponse
   */
  getBootscript = request => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/bootscripts/${validatePathParam('bootscriptId', request.bootscriptId)}`
  }, unmarshalGetBootscriptResponse);
  getDashboard = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/dashboard`,
    urlParams: urlParams(['organization', request.organization], ['project', request.project])
  }, unmarshalGetDashboardResponse);
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

/** Lists transient statutes of the enum {@link ImageState}. */
const IMAGE_TRANSIENT_STATUSES$1 = ['creating'];

/** Lists transient statutes of the enum {@link PrivateNICState}. */
const PRIVATE_NIC_TRANSIENT_STATUSES = ['syncing'];

/** Lists transient statutes of the enum {@link SecurityGroupState}. */
const SECURITY_GROUP_TRANSIENT_STATUSES = ['syncing'];

/** Lists transient statutes of the enum {@link ServerState}. */
const SERVER_TRANSIENT_STATUSES = ['starting', 'stopping'];

/** Lists transient statutes of the enum {@link SnapshotState}. */
const SNAPSHOT_TRANSIENT_STATUSES$1 = ['snapshotting', 'importing', 'exporting'];

/** Lists transient statutes of the enum {@link TaskStatus}. */
const TASK_TRANSIENT_STATUSES = ['pending', 'started', 'retry'];

/** Lists transient statutes of the enum {@link VolumeServerState}. */
const VOLUME_SERVER_TRANSIENT_STATUSES = ['snapshotting', 'fetching', 'resizing', 'saving', 'hotsyncing'];

/** Lists transient statutes of the enum {@link VolumeState}. */
const VOLUME_TRANSIENT_STATUSES = ['snapshotting', 'fetching', 'resizing', 'saving', 'hotsyncing'];

const marshalVolumeSummary = (request, defaults) => ({
  id: request.id,
  name: request.name,
  size: request.size,
  volume_type: request.volumeType
});
const marshalServerSummary = (request, defaults) => ({
  id: request.id,
  name: request.name
});
const marshalBootscript = (request, defaults) => ({
  arch: request.arch,
  bootcmdargs: request.bootcmdargs,
  default: request.default,
  dtb: request.dtb,
  id: request.id,
  initrd: request.initrd,
  kernel: request.kernel,
  organization: request.organization,
  project: request.project,
  public: request.public,
  title: request.title,
  zone: request.zone
});
const marshalVolume = (request, defaults) => ({
  creation_date: request.creationDate,
  export_uri: request.exportUri,
  id: request.id,
  modification_date: request.modificationDate,
  name: request.name,
  organization: request.organization,
  project: request.project,
  server: request.server ? marshalServerSummary(request.server) : undefined,
  size: request.size,
  state: request.state,
  tags: request.tags,
  volume_type: request.volumeType,
  zone: request.zone
});
const marshalSetImageRequestWithID = (request, defaults) => ({
  arch: request.arch,
  creation_date: request.creationDate,
  default_bootscript: request.defaultBootscript ? marshalBootscript(request.defaultBootscript) : undefined,
  extra_volumes: request.extraVolumes ? Object.entries(request.extraVolumes).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: marshalVolume(value)
  }), {}) : undefined,
  from_server: request.fromServer,
  modification_date: request.modificationDate,
  id: request.id,
  name: request.name,
  organization: request.organization,
  project: request.project,
  public: request.public,
  root_volume: request.rootVolume ? marshalVolumeSummary(request.rootVolume) : undefined,
  state: request.state,
  tags: request.tags
});

const validateNotUndefined = obj => {
  if (obj === undefined) throw new TypeError(`object was found undefined`);
  return obj;
};
class InstanceV1UtilsAPI extends API$f {
  /**
   * Waits for {@link Image} to be in a final state.
   *
   * @param request - The request {@link GetImageRequest}
   * @param options - The waiting options
   * @returns A Promise of Image
   */
  waitForImage = (request, options) => tryAtIntervals(async () => {
    const value = await this.getImage(request).then(res => res.image);
    return {
      done: !IMAGE_TRANSIENT_STATUSES$1.includes(value.state),
      value
    };
  }, createExponentialBackoffStrategy(options?.minDelay ?? 1, options?.maxDelay ?? 30), options?.timeout);

  /**
   * Waits for {@link PrivateNIC} to be in a final state.
   *
   * @param request - The request {@link GetPrivateNICRequest}
   * @param options - The waiting options
   * @returns A Promise of PrivateNIC
   */
  waitForPrivateNIC = (request, options) => tryAtIntervals(async () => {
    const value = await this.getPrivateNIC(request).then(res => res.privateNic);
    return {
      done: !PRIVATE_NIC_TRANSIENT_STATUSES.includes(value.state),
      value
    };
  }, createExponentialBackoffStrategy(options?.minDelay ?? 1, options?.maxDelay ?? 30), options?.timeout);

  /**
   * Waits for {@link Server} to be in a final state.
   *
   * @param request - The request {@link GetServerRequest}
   * @param options - The waiting options
   * @returns A Promise of Server
   */
  waitForServer = (request, options) => tryAtIntervals(async () => {
    const value = await this.getServer(request).then(res => res.server);
    return {
      done: !SERVER_TRANSIENT_STATUSES.includes(value.state),
      value
    };
  }, createExponentialBackoffStrategy(options?.minDelay ?? 1, options?.maxDelay ?? 30), options?.timeout);

  /**
   * Waits for {@link Server} to be in a final state.
   *
   * @param request - The request {@link GetServerRequest}
   * @param options - The waiting options
   * @returns A Promise of Server
   */
  waitForSnapshot = (request, options) => tryAtIntervals(async () => {
    const value = await this.getSnapshot(request).then(res => res.snapshot);
    return {
      done: !SNAPSHOT_TRANSIENT_STATUSES$1.includes(value.state),
      value
    };
  }, createExponentialBackoffStrategy(options?.minDelay ?? 1, options?.maxDelay ?? 30), options?.timeout);

  /**
   * Waits for {@link Volume} to be in a final state.
   *
   * @param request - The request {@link GetVolumeRequest}
   * @param options - The waiting options
   * @returns A Promise of Volume
   */
  waitForVolume = (request, options) => tryAtIntervals(async () => {
    const value = await this.getVolume(request).then(res => res.volume);
    return {
      done: !VOLUME_TRANSIENT_STATUSES.includes(value.state),
      value
    };
  }, createExponentialBackoffStrategy(options?.minDelay ?? 1, options?.maxDelay ?? 30), options?.timeout);

  /**
   * Updates a snapshot.
   *
   * @param request - The request {@link UpdateSnapshotRequest}
   * @returns A Promise of UpdateSnapshotResponse
   */
  updateSnapshot = request => this.getSnapshot(request).then(res => validateNotUndefined(res.snapshot)).then(snapshot => this._setSnapshot({
    ...snapshot,
    name: request.name ?? snapshot.name,
    snapshotId: snapshot.id
  })).then(res => ({
    snapshot: res.snapshot
  }));

  /**
   * Updates a security group.
   *
   * @param request - The request {@link UpdateSecurityGroupRequest}
   * @returns A Promise of UpdateSecurityGroupResponse
   */
  updateSecurityGroup = request => this.getSecurityGroup({
    securityGroupId: request.securityGroupId,
    zone: request.zone
  }).then(res => validateNotUndefined(res.securityGroup)).then(securityGroup => this._setSecurityGroup({
    creationDate: securityGroup.creationDate,
    description: request.description ?? securityGroup.description,
    enableDefaultSecurity: request.enableDefaultSecurity ?? securityGroup.enableDefaultSecurity,
    id: securityGroup.id,
    inboundDefaultPolicy: request.inboundDefaultPolicy ?? securityGroup.inboundDefaultPolicy,
    modificationDate: securityGroup.modificationDate,
    name: request.name ?? securityGroup.name,
    organization: securityGroup.organization,
    organizationDefault: request.organizationDefault ?? securityGroup.organizationDefault,
    outboundDefaultPolicy: request.outboundDefaultPolicy ?? securityGroup.outboundDefaultPolicy,
    project: securityGroup.project,
    projectDefault: request.projectDefault ?? securityGroup.projectDefault,
    servers: securityGroup.servers,
    stateful: request.stateful ?? securityGroup.stateful,
    zone: request.zone
  })).then(res => ({
    securityGroup: res.securityGroup
  }));

  /**
   * Updates a security group rule.
   *
   * @param request - The request {@link UpdateSecurityGroupRuleRequest}
   * @returns A Promise of UpdateSecurityGroupRuleResponse
   */
  updateSecurityGroupRule = request => this.getSecurityGroupRule({
    securityGroupId: request.securityGroupId,
    securityGroupRuleId: request.securityGroupRuleId,
    zone: request.zone
  }).then(res => validateNotUndefined(res.rule)).then(rule => {
    let sReq = {
      action: request.action ?? rule.action,
      destPortFrom: rule.destPortFrom,
      destPortTo: rule.destPortTo,
      direction: request.direction ?? rule.direction,
      editable: rule.editable,
      id: request.securityGroupRuleId,
      ipRange: request.ipRange ?? rule.ipRange,
      position: request.position ?? rule.position,
      protocol: request.protocol ?? rule.protocol,
      securityGroupId: request.securityGroupId,
      securityGroupRuleId: request.securityGroupRuleId
    };
    if (request.destPortFrom) {
      sReq = {
        ...sReq,
        destPortFrom: request.destPortFrom > 0 ? request.destPortFrom : undefined
      };
    }
    if (request.destPortTo) {
      sReq = {
        ...sReq,
        destPortTo: request.destPortTo > 0 ? request.destPortTo : undefined
      };
    }
    if (sReq.destPortFrom && sReq.destPortTo && sReq.destPortFrom === sReq.destPortTo) {
      sReq = {
        ...sReq,
        destPortTo: undefined
      };
    }
    // When we use ICMP protocol portFrom and portTo should be set to nil
    if (request.protocol === 'ICMP') {
      sReq = {
        ...sReq,
        destPortFrom: undefined,
        destPortTo: undefined
      };
    }
    return this._setSecurityGroupRule(sReq);
  }).then(res => ({
    rule: res.rule
  }));

  /**
   * Updates a server.
   *
   * @param request - The request {@link UpdateServerRequest}
   * @returns A Promise of UpdateServerResponse
   */
  updateServer = request => this._updateServer(request);

  /**
   * Creates a server.
   *
   * @param request - The request {@link CreateServerRequest}
   * @returns A Promise of CreateServerResponse
   */
  createServer = request => this._createServer(request);

  /**
   * Starts an action and wait for the server to be in the correct "terminal
   * state" expected by this action.
   *
   * @param request - The request {@link ServerActionRequest}
   * @returns A Promise of Server
   */
  serverActionAndWait = async (request, options) => {
    const finalServer = await this.serverAction(request).then(() => this.waitForServer({
      serverId: request.serverId,
      zone: request.zone
    }, options));

    // Check the action was properly executed.
    let expectedState;
    switch (request.action) {
      case 'poweron':
      case 'reboot':
        expectedState = 'running';
        break;
      case 'poweroff':
        expectedState = 'stopped';
        break;
      case 'stop_in_place':
        expectedState = 'stopped in place';
        break;
    }
    if (expectedState && finalServer.state !== expectedState) {
      throw new Error(`expected state ${expectedState} but found ${finalServer.state}: ${finalServer.stateDetail}`);
    }
    return finalServer;
  };

  /**
   * Attaches a volume to a server.
   *
   * @param request - The request {@link AttachVolumeRequest}
   * @returns A Promise of AttachVolumeResponse
   */
  attachVolume = async request => {
    const volumes = await this.getServer({
      serverId: request.serverId,
      zone: request.zone
    }).then(res => validateNotUndefined(res.server?.volumes));
    const newVolumes = {};
    for (const [key, server] of Object.entries(volumes)) {
      newVolumes[key] = {
        id: server.id,
        name: server.name
      };
    }

    // We loop through all the possible volume keys (0 to len(volumes))
    // to find a non existing key and assign it to the requested volume.
    // A key should always be found. However we return an error if no keys were found.
    let found = false;
    const volumesLength = Object.keys(volumes).length;
    for (let index = 0; index <= volumesLength; index += 1) {
      const key = index.toString();
      if (!(key in newVolumes)) {
        newVolumes[key] = {
          id: request.volumeId,
          name: request.volumeId // name is ignored on this PATCH
        };

        found = true;
        break;
      }
    }
    if (!found) {
      throw new Error(`could not find key to attach volume ${request.volumeId}`);
    }

    // Update server
    return this.updateServer({
      serverId: request.serverId,
      volumes: newVolumes,
      zone: request.zone
    }).then(obj => obj);
  };

  /**
   * Detaches a volume from a server.
   *
   * @param request - The request {@link DetachVolumeRequest}
   * @returns A Promise of DetachVolumeResponse
   */
  detachVolume = async request => {
    // Get server and related volumes.
    const server = await this.getVolume({
      volumeId: request.volumeId,
      zone: request.zone
    }).then(res => validateNotUndefined(res.volume?.server?.id)).then(serverId => this.getServer({
      serverId,
      zone: request.zone
    })).then(res => validateNotUndefined(res.server));

    // Remove volume.
    const newVolumes = {};
    for (const [key, volume] of Object.entries(server.volumes)) {
      if (volume.id !== request.volumeId) {
        newVolumes[key] = {
          id: volume.id,
          name: volume.name
        };
      }
    }

    // Update server.
    return this.updateServer({
      serverId: server.id,
      volumes: newVolumes,
      zone: request.zone
    }).then(obj => obj);
  };

  /**
   * Updates an image.
   *
   * @param request - The request {@link UpdateImageRequest}
   * @returns A Promise of UpdateImageResponse
   */
  updateImage = request => this.getImage({
    zone: request.zone,
    imageId: request.imageId
  }).then(res => validateNotUndefined(res.image)).then(image => ({
    ...image,
    name: request.name ?? image.name,
    tags: request.tags ?? image.tags,
    id: image.id
  })).then(imageReq => this.client.fetch({
    body: JSON.stringify(marshalSetImageRequestWithID(imageReq, this.client.settings)),
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    method: 'PUT',
    path: `/instance/v1/zones/${validatePathParam('zone', imageReq.zone)}/images/${validatePathParam('id', imageReq.id)}`
  }, unmarshalSetImageResponse)).then(res => ({
    image: res.image
  }));

  /**
   * Get the content of a user data on a server for the given key.
   *
   * @param request - The request {@link GetServerUserDataRequest}
   * @returns The content of the key
   */
  getServerUserData = request => this.client.fetch({
    method: 'GET',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/user_data/${validatePathParam('key', request.key)}`
  });

  /**
   * Sets the content of a user data on a server for the given key.
   *
   * @param request - The request {@link SetServerUserDataRequest}
   */
  setServerUserData = request => this.client.fetch({
    body: request.content,
    headers: {
      'Content-Type': 'text/plain'
    },
    method: 'PATCH',
    path: `/instance/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/servers/${validatePathParam('serverId', request.serverId)}/user_data/${validatePathParam('key', request.key)}`
  });
}

var index$h = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: InstanceV1UtilsAPI,
  IMAGE_TRANSIENT_STATUSES: IMAGE_TRANSIENT_STATUSES$1,
  PRIVATE_NIC_TRANSIENT_STATUSES: PRIVATE_NIC_TRANSIENT_STATUSES,
  SECURITY_GROUP_TRANSIENT_STATUSES: SECURITY_GROUP_TRANSIENT_STATUSES,
  SERVER_TRANSIENT_STATUSES: SERVER_TRANSIENT_STATUSES,
  SNAPSHOT_TRANSIENT_STATUSES: SNAPSHOT_TRANSIENT_STATUSES$1,
  TASK_TRANSIENT_STATUSES: TASK_TRANSIENT_STATUSES,
  VOLUME_SERVER_TRANSIENT_STATUSES: VOLUME_SERVER_TRANSIENT_STATUSES,
  VOLUME_TRANSIENT_STATUSES: VOLUME_TRANSIENT_STATUSES
});

var index$g = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1: index$h
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

/** Lists transient statutes of the enum {@link HubStatus}. */
const HUB_TRANSIENT_STATUSES = ['enabling', 'disabling'];

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalDeviceMessageFiltersRule = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DeviceMessageFiltersRule' failed as data isn't a dictionary.`);
  }
  return {
    policy: data.policy,
    topics: data.topics
  };
};
const unmarshalDeviceMessageFilters = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DeviceMessageFilters' failed as data isn't a dictionary.`);
  }
  return {
    publish: data.publish ? unmarshalDeviceMessageFiltersRule(data.publish) : undefined,
    subscribe: data.subscribe ? unmarshalDeviceMessageFiltersRule(data.subscribe) : undefined
  };
};
const unmarshalHubTwinsGraphiteConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'HubTwinsGraphiteConfig' failed as data isn't a dictionary.`);
  }
  return {
    pushUri: data.push_uri
  };
};
const unmarshalCertificate$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Certificate' failed as data isn't a dictionary.`);
  }
  return {
    crt: data.crt,
    key: data.key
  };
};
const unmarshalDevice = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Device' failed as data isn't a dictionary.`);
  }
  return {
    allowInsecure: data.allow_insecure,
    allowMultipleConnections: data.allow_multiple_connections,
    createdAt: unmarshalDate(data.created_at),
    description: data.description,
    hasCustomCertificate: data.has_custom_certificate,
    hubId: data.hub_id,
    id: data.id,
    isConnected: data.is_connected,
    lastActivityAt: unmarshalDate(data.last_activity_at),
    messageFilters: data.message_filters ? unmarshalDeviceMessageFilters(data.message_filters) : undefined,
    name: data.name,
    status: data.status,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalHub = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Hub' failed as data isn't a dictionary.`);
  }
  return {
    connectedDeviceCount: data.connected_device_count,
    createdAt: unmarshalDate(data.created_at),
    deviceCount: data.device_count,
    disableEvents: data.disable_events,
    enabled: data.enabled,
    enableDeviceAutoProvisioning: data.enable_device_auto_provisioning,
    endpoint: data.endpoint,
    eventsTopicPrefix: data.events_topic_prefix,
    hasCustomCa: data.has_custom_ca,
    id: data.id,
    name: data.name,
    organizationId: data.organization_id,
    productPlan: data.product_plan,
    projectId: data.project_id,
    region: data.region,
    status: data.status,
    twinsGraphiteConfig: data.twins_graphite_config ? unmarshalHubTwinsGraphiteConfig(data.twins_graphite_config) : undefined,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalListTwinDocumentsResponseDocumentSummary = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListTwinDocumentsResponseDocumentSummary' failed as data isn't a dictionary.`);
  }
  return {
    documentName: data.document_name
  };
};
const unmarshalNetwork = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Network' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    endpoint: data.endpoint,
    hubId: data.hub_id,
    id: data.id,
    name: data.name,
    topicPrefix: data.topic_prefix,
    type: data.type
  };
};
const unmarshalRouteDatabaseConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'RouteDatabaseConfig' failed as data isn't a dictionary.`);
  }
  return {
    dbname: data.dbname,
    engine: data.engine,
    host: data.host,
    password: data.password,
    port: data.port,
    query: data.query,
    username: data.username
  };
};
const unmarshalRouteRestConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'RouteRestConfig' failed as data isn't a dictionary.`);
  }
  return {
    headers: data.headers,
    uri: data.uri,
    verb: data.verb
  };
};
const unmarshalRouteS3Config = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'RouteS3Config' failed as data isn't a dictionary.`);
  }
  return {
    bucketName: data.bucket_name,
    bucketRegion: data.bucket_region,
    objectPrefix: data.object_prefix,
    strategy: data.strategy
  };
};
const unmarshalRouteSummary = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'RouteSummary' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    hubId: data.hub_id,
    id: data.id,
    name: data.name,
    topic: data.topic,
    type: data.type,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalCreateDeviceResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'CreateDeviceResponse' failed as data isn't a dictionary.`);
  }
  return {
    certificate: data.certificate ? unmarshalCertificate$1(data.certificate) : undefined,
    device: data.device ? unmarshalDevice(data.device) : undefined
  };
};
const unmarshalCreateNetworkResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'CreateNetworkResponse' failed as data isn't a dictionary.`);
  }
  return {
    network: data.network ? unmarshalNetwork(data.network) : undefined,
    secret: data.secret
  };
};
const unmarshalGetDeviceCertificateResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetDeviceCertificateResponse' failed as data isn't a dictionary.`);
  }
  return {
    certificatePem: data.certificate_pem,
    device: data.device ? unmarshalDevice(data.device) : undefined
  };
};
const unmarshalGetDeviceMetricsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetDeviceMetricsResponse' failed as data isn't a dictionary.`);
  }
  return {
    metrics: unmarshalArrayOfObject(data.metrics, unmarshalTimeSeries)
  };
};
const unmarshalGetHubCAResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetHubCAResponse' failed as data isn't a dictionary.`);
  }
  return {
    caCertPem: data.ca_cert_pem
  };
};
const unmarshalGetHubMetricsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetHubMetricsResponse' failed as data isn't a dictionary.`);
  }
  return {
    metrics: unmarshalArrayOfObject(data.metrics, unmarshalTimeSeries)
  };
};
const unmarshalListDevicesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListDevicesResponse' failed as data isn't a dictionary.`);
  }
  return {
    devices: unmarshalArrayOfObject(data.devices, unmarshalDevice),
    totalCount: data.total_count
  };
};
const unmarshalListHubsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListHubsResponse' failed as data isn't a dictionary.`);
  }
  return {
    hubs: unmarshalArrayOfObject(data.hubs, unmarshalHub),
    totalCount: data.total_count
  };
};
const unmarshalListNetworksResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListNetworksResponse' failed as data isn't a dictionary.`);
  }
  return {
    networks: unmarshalArrayOfObject(data.networks, unmarshalNetwork),
    totalCount: data.total_count
  };
};
const unmarshalListRoutesResponse$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListRoutesResponse' failed as data isn't a dictionary.`);
  }
  return {
    routes: unmarshalArrayOfObject(data.routes, unmarshalRouteSummary),
    totalCount: data.total_count
  };
};
const unmarshalListTwinDocumentsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListTwinDocumentsResponse' failed as data isn't a dictionary.`);
  }
  return {
    documents: unmarshalArrayOfObject(data.documents, unmarshalListTwinDocumentsResponseDocumentSummary)
  };
};
const unmarshalRenewDeviceCertificateResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'RenewDeviceCertificateResponse' failed as data isn't a dictionary.`);
  }
  return {
    certificate: data.certificate ? unmarshalCertificate$1(data.certificate) : undefined,
    device: data.device ? unmarshalDevice(data.device) : undefined
  };
};
const unmarshalRoute$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Route' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    dbConfig: data.db_config ? unmarshalRouteDatabaseConfig(data.db_config) : undefined,
    hubId: data.hub_id,
    id: data.id,
    name: data.name,
    restConfig: data.rest_config ? unmarshalRouteRestConfig(data.rest_config) : undefined,
    s3Config: data.s3_config ? unmarshalRouteS3Config(data.s3_config) : undefined,
    topic: data.topic,
    type: data.type,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalSetDeviceCertificateResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SetDeviceCertificateResponse' failed as data isn't a dictionary.`);
  }
  return {
    certificatePem: data.certificate_pem,
    device: data.device ? unmarshalDevice(data.device) : undefined
  };
};
const unmarshalTwinDocument = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'TwinDocument' failed as data isn't a dictionary.`);
  }
  return {
    data: data.data,
    documentName: data.document_name,
    twinId: data.twin_id,
    version: data.version
  };
};
const marshalDeviceMessageFiltersRule = (request, defaults) => ({
  policy: request.policy,
  topics: request.topics
});
const marshalCreateRouteRequestDatabaseConfig = (request, defaults) => ({
  dbname: request.dbname,
  engine: request.engine,
  host: request.host,
  password: request.password,
  port: request.port,
  query: request.query,
  username: request.username
});
const marshalCreateRouteRequestRestConfig = (request, defaults) => ({
  headers: request.headers,
  uri: request.uri,
  verb: request.verb
});
const marshalCreateRouteRequestS3Config = (request, defaults) => ({
  bucket_name: request.bucketName,
  bucket_region: request.bucketRegion,
  object_prefix: request.objectPrefix,
  strategy: request.strategy
});
const marshalDeviceMessageFilters = (request, defaults) => ({
  publish: request.publish ? marshalDeviceMessageFiltersRule(request.publish) : undefined,
  subscribe: request.subscribe ? marshalDeviceMessageFiltersRule(request.subscribe) : undefined
});
const marshalHubTwinsGraphiteConfig = (request, defaults) => ({
  push_uri: request.pushUri
});
const marshalUpdateRouteRequestDatabaseConfig = (request, defaults) => ({
  dbname: request.dbname,
  engine: request.engine,
  host: request.host,
  password: request.password,
  port: request.port,
  query: request.query,
  username: request.username
});
const marshalUpdateRouteRequestRestConfig = (request, defaults) => ({
  headers: request.headers,
  uri: request.uri,
  verb: request.verb
});
const marshalUpdateRouteRequestS3Config = (request, defaults) => ({
  bucket_name: request.bucketName,
  bucket_region: request.bucketRegion,
  object_prefix: request.objectPrefix,
  strategy: request.strategy
});
const marshalCreateDeviceRequest = (request, defaults) => ({
  allow_insecure: request.allowInsecure,
  allow_multiple_connections: request.allowMultipleConnections,
  description: request.description,
  hub_id: request.hubId,
  message_filters: request.messageFilters ? marshalDeviceMessageFilters(request.messageFilters) : undefined,
  name: request.name || randomName('device')
});
const marshalCreateHubRequest = (request, defaults) => ({
  disable_events: request.disableEvents,
  events_topic_prefix: request.eventsTopicPrefix,
  name: request.name || randomName('hub'),
  product_plan: request.productPlan,
  project_id: request.projectId ?? defaults.defaultProjectId,
  ...resolveOneOf([{
    param: 'twins_graphite_config',
    value: request.twinsGraphiteConfig ? marshalHubTwinsGraphiteConfig(request.twinsGraphiteConfig) : undefined
  }])
});
const marshalCreateNetworkRequest = (request, defaults) => ({
  hub_id: request.hubId,
  name: request.name || randomName('network'),
  topic_prefix: request.topicPrefix,
  type: request.type
});
const marshalCreateRouteRequest$1 = (request, defaults) => ({
  hub_id: request.hubId,
  name: request.name || randomName('route'),
  topic: request.topic,
  ...resolveOneOf([{
    param: 's3_config',
    value: request.s3Config ? marshalCreateRouteRequestS3Config(request.s3Config) : undefined
  }, {
    param: 'db_config',
    value: request.dbConfig ? marshalCreateRouteRequestDatabaseConfig(request.dbConfig) : undefined
  }, {
    param: 'rest_config',
    value: request.restConfig ? marshalCreateRouteRequestRestConfig(request.restConfig) : undefined
  }])
});
const marshalPatchTwinDocumentRequest = (request, defaults) => ({
  data: request.data,
  version: request.version
});
const marshalPutTwinDocumentRequest = (request, defaults) => ({
  data: request.data,
  version: request.version
});
const marshalSetDeviceCertificateRequest = (request, defaults) => ({
  certificate_pem: request.certificatePem
});
const marshalSetHubCARequest = (request, defaults) => ({
  ca_cert_pem: request.caCertPem,
  challenge_cert_pem: request.challengeCertPem
});
const marshalUpdateDeviceRequest = (request, defaults) => ({
  allow_insecure: request.allowInsecure,
  allow_multiple_connections: request.allowMultipleConnections,
  description: request.description,
  hub_id: request.hubId,
  message_filters: request.messageFilters ? marshalDeviceMessageFilters(request.messageFilters) : undefined
});
const marshalUpdateHubRequest = (request, defaults) => ({
  disable_events: request.disableEvents,
  enable_device_auto_provisioning: request.enableDeviceAutoProvisioning,
  events_topic_prefix: request.eventsTopicPrefix,
  name: request.name,
  product_plan: request.productPlan ?? 'plan_unknown',
  ...resolveOneOf([{
    param: 'twins_graphite_config',
    value: request.twinsGraphiteConfig ? marshalHubTwinsGraphiteConfig(request.twinsGraphiteConfig) : undefined
  }])
});
const marshalUpdateRouteRequest$1 = (request, defaults) => ({
  name: request.name,
  topic: request.topic,
  ...resolveOneOf([{
    param: 's3_config',
    value: request.s3Config ? marshalUpdateRouteRequestS3Config(request.s3Config) : undefined
  }, {
    param: 'db_config',
    value: request.dbConfig ? marshalUpdateRouteRequestDatabaseConfig(request.dbConfig) : undefined
  }, {
    param: 'rest_config',
    value: request.restConfig ? marshalUpdateRouteRequestRestConfig(request.restConfig) : undefined
  }])
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$c = {
  'Content-Type': 'application/json; charset=utf-8'
};

/**
 * IoT Hub API.
 *
 * This API allows you to manage IoT hubs and devices. IoT Hub API.
 */
let API$e = class API extends API$q {
  /** Lists the available regions of the API. */
  static LOCALITIES = ['fr-par'];
  pageOfListHubs = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/hubs`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'name_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListHubsResponse);

  /**
   * List hubs. List all Hubs in the specified zone. By default, returned Hubs
   * are ordered by creation date in ascending order, though this can be
   * modified via the `order_by` field.
   *
   * @param request - The request {@link ListHubsRequest}
   * @returns A Promise of ListHubsResponse
   */
  listHubs = (request = {}) => enrichForPagination('hubs', this.pageOfListHubs, request);

  /**
   * Create a hub. Create a new Hub in the targeted region, specifying its
   * configuration including name and product plan.
   *
   * @param request - The request {@link CreateHubRequest}
   * @returns A Promise of Hub
   */
  createHub = request => this.client.fetch({
    body: JSON.stringify(marshalCreateHubRequest(request, this.client.settings)),
    headers: jsonContentHeaders$c,
    method: 'POST',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/hubs`
  }, unmarshalHub);

  /**
   * Get a hub. Retrieve information about an existing IoT Hub, specified by its
   * Hub ID. Its full details, including name, status and endpoint, are returned
   * in the response object.
   *
   * @param request - The request {@link GetHubRequest}
   * @returns A Promise of Hub
   */
  getHub = request => this.client.fetch({
    method: 'GET',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/hubs/${validatePathParam('hubId', request.hubId)}`
  }, unmarshalHub);

  /**
   * Waits for {@link Hub} to be in a final state.
   *
   * @param request - The request {@link GetHubRequest}
   * @param options - The waiting options
   * @returns A Promise of Hub
   */
  waitForHub = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!HUB_TRANSIENT_STATUSES.includes(res.status))), this.getHub, request, options);

  /**
   * Update a hub. Update the parameters of an existing IoT Hub, specified by
   * its Hub ID.
   *
   * @param request - The request {@link UpdateHubRequest}
   * @returns A Promise of Hub
   */
  updateHub = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateHubRequest(request, this.client.settings)),
    headers: jsonContentHeaders$c,
    method: 'PATCH',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/hubs/${validatePathParam('hubId', request.hubId)}`
  }, unmarshalHub);

  /**
   * Enable a hub. Enable an existing IoT Hub, specified by its Hub ID.
   *
   * @param request - The request {@link EnableHubRequest}
   * @returns A Promise of Hub
   */
  enableHub = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$c,
    method: 'POST',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/hubs/${validatePathParam('hubId', request.hubId)}/enable`
  }, unmarshalHub);

  /**
   * Disable a hub. Disable an existing IoT Hub, specified by its Hub ID.
   *
   * @param request - The request {@link DisableHubRequest}
   * @returns A Promise of Hub
   */
  disableHub = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$c,
    method: 'POST',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/hubs/${validatePathParam('hubId', request.hubId)}/disable`
  }, unmarshalHub);

  /**
   * Delete a hub. Delete an existing IoT Hub, specified by its Hub ID. Deleting
   * a Hub is permanent, and cannot be undone.
   *
   * @param request - The request {@link DeleteHubRequest}
   */
  deleteHub = request => this.client.fetch({
    method: 'DELETE',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/hubs/${validatePathParam('hubId', request.hubId)}`,
    urlParams: urlParams(['delete_devices', request.deleteDevices])
  });

  /**
   * Get a hub's metrics. Get the metrics of an existing IoT Hub, specified by
   * its Hub ID.
   *
   * @deprecated
   * @param request - The request {@link GetHubMetricsRequest}
   * @returns A Promise of GetHubMetricsResponse
   */
  getHubMetrics = request => this.client.fetch({
    method: 'GET',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/hubs/${validatePathParam('hubId', request.hubId)}/metrics`,
    urlParams: urlParams(['start_date', request.startDate])
  }, unmarshalGetHubMetricsResponse);

  /**
   * Set the certificate authority of a hub. Set a particular PEM-encoded
   * certificate, specified by the Hub ID.
   *
   * @param request - The request {@link SetHubCARequest}
   * @returns A Promise of Hub
   */
  setHubCA = request => this.client.fetch({
    body: JSON.stringify(marshalSetHubCARequest(request, this.client.settings)),
    headers: jsonContentHeaders$c,
    method: 'POST',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/hubs/${validatePathParam('hubId', request.hubId)}/ca`
  }, unmarshalHub);

  /**
   * Get the certificate authority of a hub. Get information for a particular
   * PEM-encoded certificate, specified by the Hub ID.
   *
   * @param request - The request {@link GetHubCARequest}
   * @returns A Promise of GetHubCAResponse
   */
  getHubCA = request => this.client.fetch({
    method: 'GET',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/hubs/${validatePathParam('hubId', request.hubId)}/ca`
  }, unmarshalGetHubCAResponse);
  pageOfListDevices = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/devices`,
    urlParams: urlParams(['allow_insecure', request.allowInsecure], ['hub_id', request.hubId], ['name', request.name], ['order_by', request.orderBy ?? 'name_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['status', request.status ?? 'unknown'])
  }, unmarshalListDevicesResponse);

  /**
   * List devices. List all devices in the specified region. By default,
   * returned devices are ordered by creation date in ascending order, though
   * this can be modified via the `order_by` field.
   *
   * @param request - The request {@link ListDevicesRequest}
   * @returns A Promise of ListDevicesResponse
   */
  listDevices = (request = {}) => enrichForPagination('devices', this.pageOfListDevices, request);

  /**
   * Add a device. Attach a device to a given Hub.
   *
   * @param request - The request {@link CreateDeviceRequest}
   * @returns A Promise of CreateDeviceResponse
   */
  createDevice = request => this.client.fetch({
    body: JSON.stringify(marshalCreateDeviceRequest(request, this.client.settings)),
    headers: jsonContentHeaders$c,
    method: 'POST',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/devices`
  }, unmarshalCreateDeviceResponse);

  /**
   * Get a device. Retrieve information about an existing device, specified by
   * its device ID. Its full details, including name, status and ID, are
   * returned in the response object.
   *
   * @param request - The request {@link GetDeviceRequest}
   * @returns A Promise of Device
   */
  getDevice = request => this.client.fetch({
    method: 'GET',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/devices/${validatePathParam('deviceId', request.deviceId)}`
  }, unmarshalDevice);

  /**
   * Update a device. Update the parameters of an existing device, specified by
   * its device ID.
   *
   * @param request - The request {@link UpdateDeviceRequest}
   * @returns A Promise of Device
   */
  updateDevice = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateDeviceRequest(request, this.client.settings)),
    headers: jsonContentHeaders$c,
    method: 'PATCH',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/devices/${validatePathParam('deviceId', request.deviceId)}`
  }, unmarshalDevice);

  /**
   * Enable a device. Enable a specific device, specified by its device ID.
   *
   * @param request - The request {@link EnableDeviceRequest}
   * @returns A Promise of Device
   */
  enableDevice = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$c,
    method: 'POST',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/devices/${validatePathParam('deviceId', request.deviceId)}/enable`
  }, unmarshalDevice);

  /**
   * Disable a device. Disable an existing device, specified by its device ID.
   *
   * @param request - The request {@link DisableDeviceRequest}
   * @returns A Promise of Device
   */
  disableDevice = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$c,
    method: 'POST',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/devices/${validatePathParam('deviceId', request.deviceId)}/disable`
  }, unmarshalDevice);

  /**
   * Renew a device certificate. Renew the certificate of an existing device,
   * specified by its device ID.
   *
   * @param request - The request {@link RenewDeviceCertificateRequest}
   * @returns A Promise of RenewDeviceCertificateResponse
   */
  renewDeviceCertificate = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$c,
    method: 'POST',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/devices/${validatePathParam('deviceId', request.deviceId)}/renew-certificate`
  }, unmarshalRenewDeviceCertificateResponse);

  /**
   * Set a custom certificate on a device. Switch the existing certificate of a
   * given device with an EM-encoded custom certificate.
   *
   * @param request - The request {@link SetDeviceCertificateRequest}
   * @returns A Promise of SetDeviceCertificateResponse
   */
  setDeviceCertificate = request => this.client.fetch({
    body: JSON.stringify(marshalSetDeviceCertificateRequest(request, this.client.settings)),
    headers: jsonContentHeaders$c,
    method: 'PUT',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/devices/${validatePathParam('deviceId', request.deviceId)}/certificate`
  }, unmarshalSetDeviceCertificateResponse);

  /**
   * Get a device's certificate. Get information for a particular PEM-encoded
   * certificate, specified by the device ID. The response returns full details
   * of the device, including its type of certificate.
   *
   * @param request - The request {@link GetDeviceCertificateRequest}
   * @returns A Promise of GetDeviceCertificateResponse
   */
  getDeviceCertificate = request => this.client.fetch({
    method: 'GET',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/devices/${validatePathParam('deviceId', request.deviceId)}/certificate`
  }, unmarshalGetDeviceCertificateResponse);

  /**
   * Remove a device. Remove a specific device from the specific Hub it is
   * attached to.
   *
   * @param request - The request {@link DeleteDeviceRequest}
   */
  deleteDevice = request => this.client.fetch({
    method: 'DELETE',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/devices/${validatePathParam('deviceId', request.deviceId)}`
  });

  /**
   * Get a device's metrics. Get the metrics of an existing device, specified by
   * its device ID.
   *
   * @deprecated
   * @param request - The request {@link GetDeviceMetricsRequest}
   * @returns A Promise of GetDeviceMetricsResponse
   */
  getDeviceMetrics = request => this.client.fetch({
    method: 'GET',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/devices/${validatePathParam('deviceId', request.deviceId)}/metrics`,
    urlParams: urlParams(['start_date', request.startDate])
  }, unmarshalGetDeviceMetricsResponse);
  pageOfListRoutes = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/routes`,
    urlParams: urlParams(['hub_id', request.hubId], ['name', request.name], ['order_by', request.orderBy ?? 'name_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListRoutesResponse$1);

  /**
   * List routes. List all routes in the specified region. By default, returned
   * routes are ordered by creation date in ascending order, though this can be
   * modified via the `order_by` field.
   *
   * @param request - The request {@link ListRoutesRequest}
   * @returns A Promise of ListRoutesResponse
   */
  listRoutes = (request = {}) => enrichForPagination('routes', this.pageOfListRoutes, request);

  /**
   * Create a route. Multiple kinds of routes can be created, such as:
   *
   * - Database Route Create a route that will record subscribed MQTT messages
   *   into your database. <b>You need to manage the database by yourself</b>.
   * - REST Route. Create a route that will call a REST API on received subscribed
   *   MQTT messages.
   * - S3 Routes. Create a route that will put subscribed MQTT messages into an S3
   *   bucket. You need to create the bucket yourself and grant write access.
   *   Granting can be done with s3cmd (`s3cmd setacl s3://&lt;my-bucket&gt;
   *   --acl-grant=write:555c69c3-87d0-4bf8-80f1-99a2f757d031:555c69c3-87d0-4bf8-80f1-99a2f757d031`).
   *
   * @param request - The request {@link CreateRouteRequest}
   * @returns A Promise of Route
   */
  createRoute = request => this.client.fetch({
    body: JSON.stringify(marshalCreateRouteRequest$1(request, this.client.settings)),
    headers: jsonContentHeaders$c,
    method: 'POST',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/routes`
  }, unmarshalRoute$1);

  /**
   * Update a route. Update the parameters of an existing route, specified by
   * its route ID.
   *
   * @param request - The request {@link UpdateRouteRequest}
   * @returns A Promise of Route
   */
  updateRoute = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateRouteRequest$1(request, this.client.settings)),
    headers: jsonContentHeaders$c,
    method: 'PATCH',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/routes/${validatePathParam('routeId', request.routeId)}`
  }, unmarshalRoute$1);

  /**
   * Get a route. Get information for a particular route, specified by the route
   * ID. The response returns full details of the route, including its type, the
   * topic it subscribes to and its configuration.
   *
   * @param request - The request {@link GetRouteRequest}
   * @returns A Promise of Route
   */
  getRoute = request => this.client.fetch({
    method: 'GET',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/routes/${validatePathParam('routeId', request.routeId)}`
  }, unmarshalRoute$1);

  /**
   * Delete a route. Delete an existing route, specified by its route ID.
   * Deleting a route is permanent, and cannot be undone.
   *
   * @param request - The request {@link DeleteRouteRequest}
   */
  deleteRoute = request => this.client.fetch({
    method: 'DELETE',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/routes/${validatePathParam('routeId', request.routeId)}`
  });
  pageOfListNetworks = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/networks`,
    urlParams: urlParams(['hub_id', request.hubId], ['name', request.name], ['order_by', request.orderBy ?? 'name_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['topic_prefix', request.topicPrefix])
  }, unmarshalListNetworksResponse);

  /**
   * List the networks.
   *
   * @param request - The request {@link ListNetworksRequest}
   * @returns A Promise of ListNetworksResponse
   */
  listNetworks = (request = {}) => enrichForPagination('networks', this.pageOfListNetworks, request);

  /**
   * Create a new network. Create a new network for an existing hub. Beside the
   * default network, you can add networks for different data providers.
   * Possible network types are Sigfox and REST.
   *
   * @param request - The request {@link CreateNetworkRequest}
   * @returns A Promise of CreateNetworkResponse
   */
  createNetwork = request => this.client.fetch({
    body: JSON.stringify(marshalCreateNetworkRequest(request, this.client.settings)),
    headers: jsonContentHeaders$c,
    method: 'POST',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/networks`
  }, unmarshalCreateNetworkResponse);

  /**
   * Retrieve a specific network. Retrieve an existing network, specified by its
   * network ID. The response returns full details of the network, including its
   * type, the topic prefix and its endpoint.
   *
   * @param request - The request {@link GetNetworkRequest}
   * @returns A Promise of Network
   */
  getNetwork = request => this.client.fetch({
    method: 'GET',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/networks/${validatePathParam('networkId', request.networkId)}`
  }, unmarshalNetwork);

  /**
   * Delete a Network. Delete an existing network, specified by its network ID.
   * Deleting a network is permanent, and cannot be undone.
   *
   * @param request - The request {@link DeleteNetworkRequest}
   */
  deleteNetwork = request => this.client.fetch({
    method: 'DELETE',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/networks/${validatePathParam('networkId', request.networkId)}`
  });

  /**
   * BETA - Get a Cloud Twin Document.
   *
   * @param request - The request {@link GetTwinDocumentRequest}
   * @returns A Promise of TwinDocument
   */
  getTwinDocument = request => this.client.fetch({
    method: 'GET',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/twins/${validatePathParam('twinId', request.twinId)}/documents/${validatePathParam('documentName', request.documentName)}`
  }, unmarshalTwinDocument);

  /**
   * BETA - Update a Cloud Twin Document.
   *
   * @param request - The request {@link PutTwinDocumentRequest}
   * @returns A Promise of TwinDocument
   */
  putTwinDocument = request => this.client.fetch({
    body: JSON.stringify(marshalPutTwinDocumentRequest(request, this.client.settings)),
    headers: jsonContentHeaders$c,
    method: 'PUT',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/twins/${validatePathParam('twinId', request.twinId)}/documents/${validatePathParam('documentName', request.documentName)}`
  }, unmarshalTwinDocument);

  /**
   * BETA - Patch a Cloud Twin Document.
   *
   * @param request - The request {@link PatchTwinDocumentRequest}
   * @returns A Promise of TwinDocument
   */
  patchTwinDocument = request => this.client.fetch({
    body: JSON.stringify(marshalPatchTwinDocumentRequest(request, this.client.settings)),
    headers: jsonContentHeaders$c,
    method: 'PATCH',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/twins/${validatePathParam('twinId', request.twinId)}/documents/${validatePathParam('documentName', request.documentName)}`
  }, unmarshalTwinDocument);

  /**
   * BETA - Delete a Cloud Twin Document.
   *
   * @param request - The request {@link DeleteTwinDocumentRequest}
   */
  deleteTwinDocument = request => this.client.fetch({
    method: 'DELETE',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/twins/${validatePathParam('twinId', request.twinId)}/documents/${validatePathParam('documentName', request.documentName)}`
  });

  /**
   * BETA - List the documents of a Cloud Twin.
   *
   * @param request - The request {@link ListTwinDocumentsRequest}
   * @returns A Promise of ListTwinDocumentsResponse
   */
  listTwinDocuments = request => this.client.fetch({
    method: 'GET',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/twins/${validatePathParam('twinId', request.twinId)}`
  }, unmarshalListTwinDocumentsResponse);

  /**
   * BETA - Delete all the documents of a Cloud Twin.
   *
   * @param request - The request {@link DeleteTwinDocumentsRequest}
   */
  deleteTwinDocuments = request => this.client.fetch({
    method: 'DELETE',
    path: `/iot/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/twins/${validatePathParam('twinId', request.twinId)}`
  });
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen$c = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API$e,
  HUB_TRANSIENT_STATUSES: HUB_TRANSIENT_STATUSES
});

var index$f = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1: index_gen$c
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

/** Lists transient statutes of the enum {@link ClusterStatus}. */
const CLUSTER_TRANSIENT_STATUSES$1 = ['creating', 'deleting', 'updating'];

/** Lists transient statutes of the enum {@link NodeStatus}. */
const NODE_TRANSIENT_STATUSES = ['creating', 'deleting', 'rebooting', 'upgrading', 'starting', 'registering'];

/** Lists transient statutes of the enum {@link PoolStatus}. */
const POOL_TRANSIENT_STATUSES = ['deleting', 'scaling', 'upgrading'];

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalMaintenanceWindow = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'MaintenanceWindow' failed as data isn't a dictionary.`);
  }
  return {
    day: data.day,
    startHour: data.start_hour
  };
};
const unmarshalClusterAutoUpgrade = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ClusterAutoUpgrade' failed as data isn't a dictionary.`);
  }
  return {
    enabled: data.enabled,
    maintenanceWindow: data.maintenance_window ? unmarshalMaintenanceWindow(data.maintenance_window) : undefined
  };
};
const unmarshalClusterAutoscalerConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ClusterAutoscalerConfig' failed as data isn't a dictionary.`);
  }
  return {
    balanceSimilarNodeGroups: data.balance_similar_node_groups,
    estimator: data.estimator,
    expander: data.expander,
    expendablePodsPriorityCutoff: data.expendable_pods_priority_cutoff,
    ignoreDaemonsetsUtilization: data.ignore_daemonsets_utilization,
    maxGracefulTerminationSec: data.max_graceful_termination_sec,
    scaleDownDelayAfterAdd: data.scale_down_delay_after_add,
    scaleDownDisabled: data.scale_down_disabled,
    scaleDownUnneededTime: data.scale_down_unneeded_time,
    scaleDownUtilizationThreshold: data.scale_down_utilization_threshold
  };
};
const unmarshalClusterOpenIDConnectConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ClusterOpenIDConnectConfig' failed as data isn't a dictionary.`);
  }
  return {
    clientId: data.client_id,
    groupsClaim: data.groups_claim,
    groupsPrefix: data.groups_prefix,
    issuerUrl: data.issuer_url,
    requiredClaim: data.required_claim,
    usernameClaim: data.username_claim,
    usernamePrefix: data.username_prefix
  };
};
const unmarshalPoolUpgradePolicy = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'PoolUpgradePolicy' failed as data isn't a dictionary.`);
  }
  return {
    maxSurge: data.max_surge,
    maxUnavailable: data.max_unavailable
  };
};
const unmarshalCluster$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Cluster' failed as data isn't a dictionary.`);
  }
  return {
    admissionPlugins: data.admission_plugins,
    apiserverCertSans: data.apiserver_cert_sans,
    autoscalerConfig: data.autoscaler_config ? unmarshalClusterAutoscalerConfig(data.autoscaler_config) : undefined,
    autoUpgrade: data.auto_upgrade ? unmarshalClusterAutoUpgrade(data.auto_upgrade) : undefined,
    clusterUrl: data.cluster_url,
    cni: data.cni,
    createdAt: unmarshalDate(data.created_at),
    dashboardEnabled: data.dashboard_enabled,
    description: data.description,
    dnsWildcard: data.dns_wildcard,
    featureGates: data.feature_gates,
    id: data.id,
    ingress: data.ingress,
    name: data.name,
    openIdConnectConfig: data.open_id_connect_config ? unmarshalClusterOpenIDConnectConfig(data.open_id_connect_config) : undefined,
    organizationId: data.organization_id,
    privateNetworkId: data.private_network_id,
    projectId: data.project_id,
    region: data.region,
    status: data.status,
    tags: data.tags,
    type: data.type,
    updatedAt: unmarshalDate(data.updated_at),
    upgradeAvailable: data.upgrade_available,
    version: data.version
  };
};
const unmarshalNode = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Node' failed as data isn't a dictionary.`);
  }
  return {
    clusterId: data.cluster_id,
    conditions: data.conditions,
    createdAt: unmarshalDate(data.created_at),
    errorMessage: data.error_message,
    id: data.id,
    name: data.name,
    poolId: data.pool_id,
    providerId: data.provider_id,
    publicIpV4: data.public_ip_v4,
    publicIpV6: data.public_ip_v6,
    region: data.region,
    status: data.status,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalPool = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Pool' failed as data isn't a dictionary.`);
  }
  return {
    autohealing: data.autohealing,
    autoscaling: data.autoscaling,
    clusterId: data.cluster_id,
    containerRuntime: data.container_runtime,
    createdAt: unmarshalDate(data.created_at),
    id: data.id,
    kubeletArgs: data.kubelet_args,
    maxSize: data.max_size,
    minSize: data.min_size,
    name: data.name,
    nodeType: data.node_type,
    placementGroupId: data.placement_group_id,
    region: data.region,
    rootVolumeSize: data.root_volume_size,
    rootVolumeType: data.root_volume_type,
    size: data.size,
    status: data.status,
    tags: data.tags,
    updatedAt: unmarshalDate(data.updated_at),
    upgradePolicy: data.upgrade_policy ? unmarshalPoolUpgradePolicy(data.upgrade_policy) : undefined,
    version: data.version,
    zone: data.zone
  };
};
const unmarshalVersion$2 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Version' failed as data isn't a dictionary.`);
  }
  return {
    availableAdmissionPlugins: data.available_admission_plugins,
    availableCnis: data.available_cnis,
    availableContainerRuntimes: data.available_container_runtimes,
    availableFeatureGates: data.available_feature_gates,
    availableIngresses: data.available_ingresses,
    availableKubeletArgs: data.available_kubelet_args,
    label: data.label,
    name: data.name,
    region: data.region
  };
};
const unmarshalExternalNode = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ExternalNode' failed as data isn't a dictionary.`);
  }
  return {
    clusterCa: data.cluster_ca,
    clusterUrl: data.cluster_url,
    clusterVersion: data.cluster_version,
    id: data.id,
    kubeletConfig: data.kubelet_config,
    kubeToken: data.kube_token,
    name: data.name
  };
};
const unmarshalListClusterAvailableVersionsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListClusterAvailableVersionsResponse' failed as data isn't a dictionary.`);
  }
  return {
    versions: unmarshalArrayOfObject(data.versions, unmarshalVersion$2)
  };
};
const unmarshalListClustersResponse$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListClustersResponse' failed as data isn't a dictionary.`);
  }
  return {
    clusters: unmarshalArrayOfObject(data.clusters, unmarshalCluster$1),
    totalCount: data.total_count
  };
};
const unmarshalListNodesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListNodesResponse' failed as data isn't a dictionary.`);
  }
  return {
    nodes: unmarshalArrayOfObject(data.nodes, unmarshalNode),
    totalCount: data.total_count
  };
};
const unmarshalListPoolsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListPoolsResponse' failed as data isn't a dictionary.`);
  }
  return {
    pools: unmarshalArrayOfObject(data.pools, unmarshalPool),
    totalCount: data.total_count
  };
};
const unmarshalListVersionsResponse$2 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListVersionsResponse' failed as data isn't a dictionary.`);
  }
  return {
    versions: unmarshalArrayOfObject(data.versions, unmarshalVersion$2)
  };
};
const marshalCreateClusterRequestPoolConfigUpgradePolicy = (request, defaults) => ({
  max_surge: request.maxSurge,
  max_unavailable: request.maxUnavailable
});
const marshalMaintenanceWindow = (request, defaults) => ({
  day: request.day,
  start_hour: request.startHour
});
const marshalCreateClusterRequestAutoUpgrade = (request, defaults) => ({
  enable: request.enable,
  maintenance_window: request.maintenanceWindow ? marshalMaintenanceWindow(request.maintenanceWindow) : undefined
});
const marshalCreateClusterRequestAutoscalerConfig = (request, defaults) => ({
  balance_similar_node_groups: request.balanceSimilarNodeGroups,
  estimator: request.estimator,
  expander: request.expander,
  expendable_pods_priority_cutoff: request.expendablePodsPriorityCutoff,
  ignore_daemonsets_utilization: request.ignoreDaemonsetsUtilization,
  max_graceful_termination_sec: request.maxGracefulTerminationSec,
  scale_down_delay_after_add: request.scaleDownDelayAfterAdd,
  scale_down_disabled: request.scaleDownDisabled,
  scale_down_unneeded_time: request.scaleDownUnneededTime,
  scale_down_utilization_threshold: request.scaleDownUtilizationThreshold
});
const marshalCreateClusterRequestOpenIDConnectConfig = (request, defaults) => ({
  client_id: request.clientId,
  groups_claim: request.groupsClaim,
  groups_prefix: request.groupsPrefix,
  issuer_url: request.issuerUrl,
  required_claim: request.requiredClaim,
  username_claim: request.usernameClaim,
  username_prefix: request.usernamePrefix
});
const marshalCreateClusterRequestPoolConfig = (request, defaults) => ({
  autohealing: request.autohealing,
  autoscaling: request.autoscaling,
  container_runtime: request.containerRuntime,
  kubelet_args: request.kubeletArgs,
  max_size: request.maxSize,
  min_size: request.minSize,
  name: request.name,
  node_type: request.nodeType,
  placement_group_id: request.placementGroupId,
  root_volume_size: request.rootVolumeSize,
  root_volume_type: request.rootVolumeType,
  size: request.size,
  tags: request.tags,
  upgrade_policy: request.upgradePolicy ? marshalCreateClusterRequestPoolConfigUpgradePolicy(request.upgradePolicy) : undefined,
  zone: request.zone
});
const marshalCreatePoolRequestUpgradePolicy = (request, defaults) => ({
  max_surge: request.maxSurge,
  max_unavailable: request.maxUnavailable
});
const marshalUpdateClusterRequestAutoUpgrade = (request, defaults) => ({
  enable: request.enable,
  maintenance_window: request.maintenanceWindow ? marshalMaintenanceWindow(request.maintenanceWindow) : undefined
});
const marshalUpdateClusterRequestAutoscalerConfig = (request, defaults) => ({
  balance_similar_node_groups: request.balanceSimilarNodeGroups,
  estimator: request.estimator,
  expander: request.expander,
  expendable_pods_priority_cutoff: request.expendablePodsPriorityCutoff,
  ignore_daemonsets_utilization: request.ignoreDaemonsetsUtilization,
  max_graceful_termination_sec: request.maxGracefulTerminationSec,
  scale_down_delay_after_add: request.scaleDownDelayAfterAdd,
  scale_down_disabled: request.scaleDownDisabled,
  scale_down_unneeded_time: request.scaleDownUnneededTime,
  scale_down_utilization_threshold: request.scaleDownUtilizationThreshold
});
const marshalUpdateClusterRequestOpenIDConnectConfig = (request, defaults) => ({
  client_id: request.clientId,
  groups_claim: request.groupsClaim,
  groups_prefix: request.groupsPrefix,
  issuer_url: request.issuerUrl,
  required_claim: request.requiredClaim,
  username_claim: request.usernameClaim,
  username_prefix: request.usernamePrefix
});
const marshalUpdatePoolRequestUpgradePolicy = (request, defaults) => ({
  max_surge: request.maxSurge,
  max_unavailable: request.maxUnavailable
});
const marshalCreateClusterRequest$1 = (request, defaults) => ({
  admission_plugins: request.admissionPlugins,
  apiserver_cert_sans: request.apiserverCertSans,
  auto_upgrade: request.autoUpgrade ? marshalCreateClusterRequestAutoUpgrade(request.autoUpgrade) : undefined,
  autoscaler_config: request.autoscalerConfig ? marshalCreateClusterRequestAutoscalerConfig(request.autoscalerConfig) : undefined,
  cni: request.cni,
  description: request.description,
  enable_dashboard: request.enableDashboard,
  feature_gates: request.featureGates,
  ingress: request.ingress,
  name: request.name || randomName('k8s'),
  open_id_connect_config: request.openIdConnectConfig ? marshalCreateClusterRequestOpenIDConnectConfig(request.openIdConnectConfig) : undefined,
  pools: request.pools ? request.pools.map(elt => marshalCreateClusterRequestPoolConfig(elt)) : undefined,
  private_network_id: request.privateNetworkId,
  tags: request.tags,
  type: request.type,
  version: request.version,
  ...resolveOneOf([{
    default: defaults.defaultProjectId,
    param: 'project_id',
    value: request.projectId
  }, {
    default: defaults.defaultOrganizationId,
    param: 'organization_id',
    value: request.organizationId
  }])
});
const marshalCreatePoolRequest = (request, defaults) => ({
  autohealing: request.autohealing,
  autoscaling: request.autoscaling,
  container_runtime: request.containerRuntime ?? 'unknown_runtime',
  kubelet_args: request.kubeletArgs,
  max_size: request.maxSize,
  min_size: request.minSize,
  name: request.name || randomName('pool'),
  node_type: request.nodeType,
  placement_group_id: request.placementGroupId,
  root_volume_size: request.rootVolumeSize,
  root_volume_type: request.rootVolumeType ?? 'default_volume_type',
  size: request.size,
  tags: request.tags,
  upgrade_policy: request.upgradePolicy ? marshalCreatePoolRequestUpgradePolicy(request.upgradePolicy) : undefined,
  zone: request.zone ?? defaults.defaultZone
});
const marshalSetClusterTypeRequest = (request, defaults) => ({
  type: request.type
});
const marshalUpdateClusterRequest$1 = (request, defaults) => ({
  admission_plugins: request.admissionPlugins,
  apiserver_cert_sans: request.apiserverCertSans,
  auto_upgrade: request.autoUpgrade ? marshalUpdateClusterRequestAutoUpgrade(request.autoUpgrade) : undefined,
  autoscaler_config: request.autoscalerConfig ? marshalUpdateClusterRequestAutoscalerConfig(request.autoscalerConfig) : undefined,
  description: request.description,
  enable_dashboard: request.enableDashboard,
  feature_gates: request.featureGates,
  ingress: request.ingress,
  name: request.name,
  open_id_connect_config: request.openIdConnectConfig ? marshalUpdateClusterRequestOpenIDConnectConfig(request.openIdConnectConfig) : undefined,
  tags: request.tags
});
const marshalUpdatePoolRequest = (request, defaults) => ({
  autohealing: request.autohealing,
  autoscaling: request.autoscaling,
  kubelet_args: request.kubeletArgs,
  max_size: request.maxSize,
  min_size: request.minSize,
  size: request.size,
  tags: request.tags,
  upgrade_policy: request.upgradePolicy ? marshalUpdatePoolRequestUpgradePolicy(request.upgradePolicy) : undefined
});
const marshalUpgradeClusterRequest = (request, defaults) => ({
  upgrade_pools: request.upgradePools,
  version: request.version
});
const marshalUpgradePoolRequest = (request, defaults) => ({
  version: request.version
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$b = {
  'Content-Type': 'application/json; charset=utf-8'
};

/** Kubernetes API. */
let API$d = class API extends API$q {
  /** Lists the available regions of the API. */
  static LOCALITIES = ['fr-par', 'nl-ams', 'pl-waw'];
  pageOfListClusters = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/clusters`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId], ['status', request.status ?? 'unknown'], ['type', request.type])
  }, unmarshalListClustersResponse$1);

  /**
   * List Clusters. List all existing Kubernetes clusters in a specific region.
   *
   * @param request - The request {@link ListClustersRequest}
   * @returns A Promise of ListClustersResponse
   */
  listClusters = (request = {}) => enrichForPagination('clusters', this.pageOfListClusters, request);

  /**
   * Create a new Cluster. Create a new Kubernetes cluster in a Scaleway region.
   *
   * @param request - The request {@link CreateClusterRequest}
   * @returns A Promise of Cluster
   */
  createCluster = request => this.client.fetch({
    body: JSON.stringify(marshalCreateClusterRequest$1(request, this.client.settings)),
    headers: jsonContentHeaders$b,
    method: 'POST',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/clusters`
  }, unmarshalCluster$1);

  /**
   * Get a Cluster. Retrieve information about a specific Kubernetes cluster.
   *
   * @param request - The request {@link GetClusterRequest}
   * @returns A Promise of Cluster
   */
  getCluster = request => this.client.fetch({
    method: 'GET',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/clusters/${validatePathParam('clusterId', request.clusterId)}`
  }, unmarshalCluster$1);

  /**
   * Waits for {@link Cluster} to be in a final state.
   *
   * @param request - The request {@link GetClusterRequest}
   * @param options - The waiting options
   * @returns A Promise of Cluster
   */
  waitForCluster = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!CLUSTER_TRANSIENT_STATUSES$1.includes(res.status))), this.getCluster, request, options);

  /**
   * Update a Cluster. Update information on a specific Kubernetes cluster. You
   * can update details such as its name, description, tags and configuration.
   * To upgrade a cluster, you will need to use the dedicated endpoint.
   *
   * @param request - The request {@link UpdateClusterRequest}
   * @returns A Promise of Cluster
   */
  updateCluster = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateClusterRequest$1(request, this.client.settings)),
    headers: jsonContentHeaders$b,
    method: 'PATCH',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/clusters/${validatePathParam('clusterId', request.clusterId)}`
  }, unmarshalCluster$1);

  /**
   * Delete a Cluster. Delete a specific Kubernetes cluster and all its
   * associated pools and nodes. Note that this method will not delete any Load
   * Balancer or Block Volume that are associated with the cluster.
   *
   * @param request - The request {@link DeleteClusterRequest}
   * @returns A Promise of Cluster
   */
  deleteCluster = request => this.client.fetch({
    method: 'DELETE',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/clusters/${validatePathParam('clusterId', request.clusterId)}`,
    urlParams: urlParams(['with_additional_resources', request.withAdditionalResources])
  }, unmarshalCluster$1);

  /**
   * Upgrade a Cluster. Upgrade a specific Kubernetes cluster and possibly its
   * associated pools to a specific and supported Kubernetes version.
   *
   * @param request - The request {@link UpgradeClusterRequest}
   * @returns A Promise of Cluster
   */
  upgradeCluster = request => this.client.fetch({
    body: JSON.stringify(marshalUpgradeClusterRequest(request, this.client.settings)),
    headers: jsonContentHeaders$b,
    method: 'POST',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/clusters/${validatePathParam('clusterId', request.clusterId)}/upgrade`
  }, unmarshalCluster$1);

  /**
   * Change the Cluster type. Change the type of a specific Kubernetes cluster.
   *
   * @param request - The request {@link SetClusterTypeRequest}
   * @returns A Promise of Cluster
   */
  setClusterType = request => this.client.fetch({
    body: JSON.stringify(marshalSetClusterTypeRequest(request, this.client.settings)),
    headers: jsonContentHeaders$b,
    method: 'POST',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/clusters/${validatePathParam('clusterId', request.clusterId)}/set-type`
  }, unmarshalCluster$1);

  /**
   * List available versions for a Cluster. List the versions that a specific
   * Kubernetes cluster is allowed to upgrade to. Results will include every
   * patch version greater than the current patch, as well as one minor version
   * ahead of the current version. Any upgrade skipping a minor version will not
   * work.
   *
   * @param request - The request {@link ListClusterAvailableVersionsRequest}
   * @returns A Promise of ListClusterAvailableVersionsResponse
   */
  listClusterAvailableVersions = request => this.client.fetch({
    method: 'GET',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/clusters/${validatePathParam('clusterId', request.clusterId)}/available-versions`
  }, unmarshalListClusterAvailableVersionsResponse);
  _getClusterKubeConfig = request => this.client.fetch({
    method: 'GET',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/clusters/${validatePathParam('clusterId', request.clusterId)}/kubeconfig`,
    urlParams: urlParams(['dl', 1]),
    responseType: 'blob'
  });

  /**
   * Reset the admin token of a Cluster. Reset the admin token for a specific
   * Kubernetes cluster. This will revoke the old admin token (which will not be
   * usable afterwards) and create a new one. Note that you will need to
   * download kubeconfig again to keep interacting with the cluster.
   *
   * @param request - The request {@link ResetClusterAdminTokenRequest}
   */
  resetClusterAdminToken = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$b,
    method: 'POST',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/clusters/${validatePathParam('clusterId', request.clusterId)}/reset-admin-token`
  });
  pageOfListPools = request => this.client.fetch({
    method: 'GET',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/clusters/${validatePathParam('clusterId', request.clusterId)}/pools`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['status', request.status ?? 'unknown'])
  }, unmarshalListPoolsResponse);

  /**
   * List Pools in a Cluster. List all the existing pools for a specific
   * Kubernetes cluster.
   *
   * @param request - The request {@link ListPoolsRequest}
   * @returns A Promise of ListPoolsResponse
   */
  listPools = request => enrichForPagination('pools', this.pageOfListPools, request);

  /**
   * Create a new Pool in a Cluster. Create a new pool in a specific Kubernetes
   * cluster.
   *
   * @param request - The request {@link CreatePoolRequest}
   * @returns A Promise of Pool
   */
  createPool = request => this.client.fetch({
    body: JSON.stringify(marshalCreatePoolRequest(request, this.client.settings)),
    headers: jsonContentHeaders$b,
    method: 'POST',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/clusters/${validatePathParam('clusterId', request.clusterId)}/pools`
  }, unmarshalPool);

  /**
   * Get a Pool in a Cluster. Retrieve details about a specific pool in a
   * Kubernetes cluster.
   *
   * @param request - The request {@link GetPoolRequest}
   * @returns A Promise of Pool
   */
  getPool = request => this.client.fetch({
    method: 'GET',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/pools/${validatePathParam('poolId', request.poolId)}`
  }, unmarshalPool);

  /**
   * Waits for {@link Pool} to be in a final state.
   *
   * @param request - The request {@link GetPoolRequest}
   * @param options - The waiting options
   * @returns A Promise of Pool
   */
  waitForPool = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!POOL_TRANSIENT_STATUSES.includes(res.status))), this.getPool, request, options);

  /**
   * Upgrade a Pool in a Cluster. Upgrade the Kubernetes version of a specific
   * pool. Note that it only works if the targeted version matches the cluster's
   * version.
   *
   * @param request - The request {@link UpgradePoolRequest}
   * @returns A Promise of Pool
   */
  upgradePool = request => this.client.fetch({
    body: JSON.stringify(marshalUpgradePoolRequest(request, this.client.settings)),
    headers: jsonContentHeaders$b,
    method: 'POST',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/pools/${validatePathParam('poolId', request.poolId)}/upgrade`
  }, unmarshalPool);

  /**
   * Update a Pool in a Cluster. Update the attributes of a specific pool, such
   * as its desired size, autoscaling settings, and tags.
   *
   * @param request - The request {@link UpdatePoolRequest}
   * @returns A Promise of Pool
   */
  updatePool = request => this.client.fetch({
    body: JSON.stringify(marshalUpdatePoolRequest(request, this.client.settings)),
    headers: jsonContentHeaders$b,
    method: 'PATCH',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/pools/${validatePathParam('poolId', request.poolId)}`
  }, unmarshalPool);

  /**
   * Delete a Pool in a Cluster. Delete a specific pool from a cluster. Note
   * that all the pool's nodes will also be deleted.
   *
   * @param request - The request {@link DeletePoolRequest}
   * @returns A Promise of Pool
   */
  deletePool = request => this.client.fetch({
    method: 'DELETE',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/pools/${validatePathParam('poolId', request.poolId)}`
  }, unmarshalPool);

  /**
   * Create a Kosmos node. Retrieve metadata for a Kosmos node. This method is
   * not intended to be called by end users but rather programmatically by the
   * kapsule-node-agent.
   *
   * @param request - The request {@link CreateExternalNodeRequest}
   * @returns A Promise of ExternalNode
   */
  createExternalNode = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$b,
    method: 'POST',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/pools/${validatePathParam('poolId', request.poolId)}/external-nodes`
  }, unmarshalExternalNode);
  pageOfListNodes = request => this.client.fetch({
    method: 'GET',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/clusters/${validatePathParam('clusterId', request.clusterId)}/nodes`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['pool_id', request.poolId], ['status', request.status ?? 'unknown'])
  }, unmarshalListNodesResponse);

  /**
   * List Nodes in a Cluster. List all the existing nodes for a specific
   * Kubernetes cluster.
   *
   * @param request - The request {@link ListNodesRequest}
   * @returns A Promise of ListNodesResponse
   */
  listNodes = request => enrichForPagination('nodes', this.pageOfListNodes, request);

  /**
   * Get a Node in a Cluster. Retrieve details about a specific Kubernetes Node.
   *
   * @param request - The request {@link GetNodeRequest}
   * @returns A Promise of Node
   */
  getNode = request => this.client.fetch({
    method: 'GET',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/nodes/${validatePathParam('nodeId', request.nodeId)}`
  }, unmarshalNode);

  /**
   * Waits for {@link Node} to be in a final state.
   *
   * @param request - The request {@link GetNodeRequest}
   * @param options - The waiting options
   * @returns A Promise of Node
   */
  waitForNode = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!NODE_TRANSIENT_STATUSES.includes(res.status))), this.getNode, request, options);

  /**
   * Replace a Node in a Cluster. Replace a specific Node. The node will first
   * be cordoned (scheduling will be disabled on it). The existing pods on the
   * node will then be drained and rescheduled onto another schedulable node.
   * Note that when there is not enough space to reschedule all the pods (such
   * as in a one-node cluster), disruption of your applications can be
   * expected.
   *
   * @deprecated
   * @param request - The request {@link ReplaceNodeRequest}
   * @returns A Promise of Node
   */
  replaceNode = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$b,
    method: 'POST',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/nodes/${validatePathParam('nodeId', request.nodeId)}/replace`
  }, unmarshalNode);

  /**
   * Reboot a Node in a Cluster. Reboot a specific Node. The node will first be
   * cordoned (scheduling will be disabled on it). The existing pods on the node
   * will then be drained and rescheduled onto another schedulable node. Note
   * that when there is not enough space to reschedule all the pods (such as in
   * a one-node cluster), disruption of your applications can be expected.
   *
   * @param request - The request {@link RebootNodeRequest}
   * @returns A Promise of Node
   */
  rebootNode = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$b,
    method: 'POST',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/nodes/${validatePathParam('nodeId', request.nodeId)}/reboot`
  }, unmarshalNode);

  /**
   * Delete a Node in a Cluster. Delete a specific Node. Note that when there is
   * not enough space to reschedule all the pods (such as in a one-node
   * cluster), disruption of your applications can be expected.
   *
   * @param request - The request {@link DeleteNodeRequest}
   * @returns A Promise of Node
   */
  deleteNode = request => this.client.fetch({
    method: 'DELETE',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/nodes/${validatePathParam('nodeId', request.nodeId)}`,
    urlParams: urlParams(['replace', request.replace], ['skip_drain', request.skipDrain])
  }, unmarshalNode);

  /**
   * List all available Versions. List all available versions for the creation
   * of a new Kubernetes cluster.
   *
   * @param request - The request {@link ListVersionsRequest}
   * @returns A Promise of ListVersionsResponse
   */
  listVersions = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/versions`
  }, unmarshalListVersionsResponse$2);

  /**
   * Get a Version. Retrieve a specific Kubernetes version and its details.
   *
   * @param request - The request {@link GetVersionRequest}
   * @returns A Promise of Version
   */
  getVersion = request => this.client.fetch({
    method: 'GET',
    path: `/k8s/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/versions/${validatePathParam('versionName', request.versionName)}`
  }, unmarshalVersion$2);
};

class K8SUtilsAPI extends API$d {
  /**
   * Get configuration of a kube cluster.
   *
   * @param request - The request {@link GetClusterKubeConfigRequest}
   * @returns A Promise of Blob
   */
  getClusterKubeConfig = request => this._getClusterKubeConfig(request);
}

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

const CreateClusterRequest = {
  name: {
    minLength: 1
  }
};
const CreateClusterRequestAutoscalerConfig = {
  scaleDownUtilizationThreshold: {
    greaterThan: 0,
    lessThan: 1
  }
};
const CreateClusterRequestOpenIDConnectConfig = {
  clientId: {
    minLength: 1
  },
  groupsPrefix: {
    minLength: 1
  },
  usernameClaim: {
    minLength: 1
  },
  usernamePrefix: {
    minLength: 1
  }
};
const CreateClusterRequestPoolConfig = {
  name: {
    minLength: 1
  }
};
const CreatePoolRequest = {
  name: {
    minLength: 1
  }
};
const ListClustersRequest = {
  name: {
    minLength: 1
  },
  page: {
    greaterThan: 0
  },
  pageSize: {
    greaterThan: 0,
    lessThanOrEqual: 100
  }
};
const ListNodesRequest = {
  name: {
    minLength: 1
  },
  page: {
    greaterThan: 0
  },
  pageSize: {
    greaterThan: 0,
    lessThanOrEqual: 100
  }
};
const ListPoolsRequest = {
  name: {
    minLength: 1
  },
  page: {
    greaterThan: 0
  },
  pageSize: {
    greaterThan: 0,
    lessThanOrEqual: 100
  }
};
const MaintenanceWindow = {
  startHour: {
    lessThanOrEqual: 23
  }
};
const UpdateClusterRequest = {
  name: {
    minLength: 1
  }
};
const UpdateClusterRequestAutoscalerConfig = {
  scaleDownUtilizationThreshold: {
    greaterThan: 0,
    lessThan: 1
  }
};

var validationRules_gen$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  CreateClusterRequest: CreateClusterRequest,
  CreateClusterRequestAutoscalerConfig: CreateClusterRequestAutoscalerConfig,
  CreateClusterRequestOpenIDConnectConfig: CreateClusterRequestOpenIDConnectConfig,
  CreateClusterRequestPoolConfig: CreateClusterRequestPoolConfig,
  CreatePoolRequest: CreatePoolRequest,
  ListClustersRequest: ListClustersRequest,
  ListNodesRequest: ListNodesRequest,
  ListPoolsRequest: ListPoolsRequest,
  MaintenanceWindow: MaintenanceWindow,
  UpdateClusterRequest: UpdateClusterRequest,
  UpdateClusterRequestAutoscalerConfig: UpdateClusterRequestAutoscalerConfig
});

var index$e = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: K8SUtilsAPI,
  CLUSTER_TRANSIENT_STATUSES: CLUSTER_TRANSIENT_STATUSES$1,
  NODE_TRANSIENT_STATUSES: NODE_TRANSIENT_STATUSES,
  POOL_TRANSIENT_STATUSES: POOL_TRANSIENT_STATUSES,
  ValidationRules: validationRules_gen$1
});

var index$d = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1: index$e
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

/** Lists transient statutes of the enum {@link CertificateStatus}. */
const CERTIFICATE_TRANSIENT_STATUSES = ['pending'];

/** Lists transient statutes of the enum {@link InstanceStatus}. */
const INSTANCE_TRANSIENT_STATUSES$1 = ['pending', 'migrating'];

/** Lists transient statutes of the enum {@link LbStatus}. */
const LB_TRANSIENT_STATUSES = ['pending', 'migrating', 'to_create', 'creating', 'to_delete', 'deleting'];

/** Lists transient statutes of the enum {@link PrivateNetworkStatus}. */
const PRIVATE_NETWORK_TRANSIENT_STATUSES = ['pending'];

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalSubscriberEmailConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SubscriberEmailConfig' failed as data isn't a dictionary.`);
  }
  return {
    email: data.email
  };
};
const unmarshalSubscriberWebhookConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SubscriberWebhookConfig' failed as data isn't a dictionary.`);
  }
  return {
    uri: data.uri
  };
};
const unmarshalHealthCheckHttpConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'HealthCheckHttpConfig' failed as data isn't a dictionary.`);
  }
  return {
    code: data.code,
    hostHeader: data.host_header,
    method: data.method,
    uri: data.uri
  };
};
const unmarshalHealthCheckHttpsConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'HealthCheckHttpsConfig' failed as data isn't a dictionary.`);
  }
  return {
    code: data.code,
    hostHeader: data.host_header,
    method: data.method,
    sni: data.sni,
    uri: data.uri
  };
};
const unmarshalHealthCheckLdapConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'HealthCheckLdapConfig' failed as data isn't a dictionary.`);
  }
  return {};
};
const unmarshalHealthCheckMysqlConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'HealthCheckMysqlConfig' failed as data isn't a dictionary.`);
  }
  return {
    user: data.user
  };
};
const unmarshalHealthCheckPgsqlConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'HealthCheckPgsqlConfig' failed as data isn't a dictionary.`);
  }
  return {
    user: data.user
  };
};
const unmarshalHealthCheckRedisConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'HealthCheckRedisConfig' failed as data isn't a dictionary.`);
  }
  return {};
};
const unmarshalHealthCheckTcpConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'HealthCheckTcpConfig' failed as data isn't a dictionary.`);
  }
  return {};
};
const unmarshalInstance$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Instance' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    id: data.id,
    ipAddress: data.ip_address,
    region: data.region,
    status: data.status,
    updatedAt: unmarshalDate(data.updated_at),
    zone: data.zone
  };
};
const unmarshalIp = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Ip' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    ipAddress: data.ip_address,
    lbId: data.lb_id,
    organizationId: data.organization_id,
    projectId: data.project_id,
    region: data.region,
    reverse: data.reverse,
    zone: data.zone
  };
};
const unmarshalSubscriber = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Subscriber' failed as data isn't a dictionary.`);
  }
  return {
    emailConfig: data.email_config ? unmarshalSubscriberEmailConfig(data.email_config) : undefined,
    id: data.id,
    name: data.name,
    webhookConfig: data.webhook_config ? unmarshalSubscriberWebhookConfig(data.webhook_config) : undefined
  };
};
const unmarshalHealthCheck = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'HealthCheck' failed as data isn't a dictionary.`);
  }
  return {
    checkDelay: data.check_delay,
    checkMaxRetries: data.check_max_retries,
    checkSendProxy: data.check_send_proxy,
    checkTimeout: data.check_timeout,
    httpConfig: data.http_config ? unmarshalHealthCheckHttpConfig(data.http_config) : undefined,
    httpsConfig: data.https_config ? unmarshalHealthCheckHttpsConfig(data.https_config) : undefined,
    ldapConfig: data.ldap_config ? unmarshalHealthCheckLdapConfig(data.ldap_config) : undefined,
    mysqlConfig: data.mysql_config ? unmarshalHealthCheckMysqlConfig(data.mysql_config) : undefined,
    pgsqlConfig: data.pgsql_config ? unmarshalHealthCheckPgsqlConfig(data.pgsql_config) : undefined,
    port: data.port,
    redisConfig: data.redis_config ? unmarshalHealthCheckRedisConfig(data.redis_config) : undefined,
    tcpConfig: data.tcp_config ? unmarshalHealthCheckTcpConfig(data.tcp_config) : undefined,
    transientCheckDelay: data.transient_check_delay
  };
};
const unmarshalLb = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Lb' failed as data isn't a dictionary.`);
  }
  return {
    backendCount: data.backend_count,
    createdAt: unmarshalDate(data.created_at),
    description: data.description,
    frontendCount: data.frontend_count,
    id: data.id,
    instances: unmarshalArrayOfObject(data.instances, unmarshalInstance$1),
    ip: unmarshalArrayOfObject(data.ip, unmarshalIp),
    name: data.name,
    organizationId: data.organization_id,
    privateNetworkCount: data.private_network_count,
    projectId: data.project_id,
    region: data.region,
    routeCount: data.route_count,
    sslCompatibilityLevel: data.ssl_compatibility_level,
    status: data.status,
    subscriber: data.subscriber ? unmarshalSubscriber(data.subscriber) : undefined,
    tags: data.tags,
    type: data.type,
    updatedAt: unmarshalDate(data.updated_at),
    zone: data.zone
  };
};
const unmarshalAclActionRedirect = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'AclActionRedirect' failed as data isn't a dictionary.`);
  }
  return {
    code: data.code,
    target: data.target,
    type: data.type
  };
};
const unmarshalBackend = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Backend' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    failoverHost: data.failover_host,
    forwardPort: data.forward_port,
    forwardPortAlgorithm: data.forward_port_algorithm,
    forwardProtocol: data.forward_protocol,
    healthCheck: data.health_check ? unmarshalHealthCheck(data.health_check) : undefined,
    id: data.id,
    ignoreSslServerVerify: data.ignore_ssl_server_verify,
    lb: data.lb ? unmarshalLb(data.lb) : undefined,
    maxConnections: data.max_connections,
    maxRetries: data.max_retries,
    name: data.name,
    onMarkedDownAction: data.on_marked_down_action,
    pool: data.pool,
    proxyProtocol: data.proxy_protocol,
    redispatchAttemptCount: data.redispatch_attempt_count,
    sendProxyV2: data.send_proxy_v2,
    sslBridging: data.ssl_bridging,
    stickySessions: data.sticky_sessions,
    stickySessionsCookieName: data.sticky_sessions_cookie_name,
    timeoutConnect: data.timeout_connect,
    timeoutQueue: data.timeout_queue,
    timeoutServer: data.timeout_server,
    timeoutTunnel: data.timeout_tunnel,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalCertificate = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Certificate' failed as data isn't a dictionary.`);
  }
  return {
    commonName: data.common_name,
    createdAt: unmarshalDate(data.created_at),
    fingerprint: data.fingerprint,
    id: data.id,
    lb: data.lb ? unmarshalLb(data.lb) : undefined,
    name: data.name,
    notValidAfter: unmarshalDate(data.not_valid_after),
    notValidBefore: unmarshalDate(data.not_valid_before),
    status: data.status,
    statusDetails: data.status_details,
    subjectAlternativeName: data.subject_alternative_name,
    type: data.type,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalAclAction = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'AclAction' failed as data isn't a dictionary.`);
  }
  return {
    redirect: data.redirect ? unmarshalAclActionRedirect(data.redirect) : undefined,
    type: data.type
  };
};
const unmarshalAclMatch = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'AclMatch' failed as data isn't a dictionary.`);
  }
  return {
    httpFilter: data.http_filter,
    httpFilterOption: data.http_filter_option,
    httpFilterValue: data.http_filter_value,
    invert: data.invert,
    ipSubnet: data.ip_subnet
  };
};
const unmarshalFrontend = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Frontend' failed as data isn't a dictionary.`);
  }
  return {
    backend: data.backend ? unmarshalBackend(data.backend) : undefined,
    certificate: data.certificate ? unmarshalCertificate(data.certificate) : undefined,
    certificateIds: data.certificate_ids,
    createdAt: unmarshalDate(data.created_at),
    enableHttp3: data.enable_http3,
    id: data.id,
    inboundPort: data.inbound_port,
    lb: data.lb ? unmarshalLb(data.lb) : undefined,
    name: data.name,
    timeoutClient: data.timeout_client,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalPrivateNetworkDHCPConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'PrivateNetworkDHCPConfig' failed as data isn't a dictionary.`);
  }
  return {};
};
const unmarshalPrivateNetworkIpamConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'PrivateNetworkIpamConfig' failed as data isn't a dictionary.`);
  }
  return {};
};
const unmarshalPrivateNetworkStaticConfig = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'PrivateNetworkStaticConfig' failed as data isn't a dictionary.`);
  }
  return {
    ipAddress: data.ip_address
  };
};
const unmarshalRouteMatch = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'RouteMatch' failed as data isn't a dictionary.`);
  }
  return {
    hostHeader: data.host_header,
    sni: data.sni
  };
};
const unmarshalAcl = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Acl' failed as data isn't a dictionary.`);
  }
  return {
    action: data.action ? unmarshalAclAction(data.action) : undefined,
    createdAt: unmarshalDate(data.created_at),
    description: data.description,
    frontend: data.frontend ? unmarshalFrontend(data.frontend) : undefined,
    id: data.id,
    index: data.index,
    match: data.match ? unmarshalAclMatch(data.match) : undefined,
    name: data.name,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalBackendServerStats = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'BackendServerStats' failed as data isn't a dictionary.`);
  }
  return {
    backendId: data.backend_id,
    instanceId: data.instance_id,
    ip: data.ip,
    lastHealthCheckStatus: data.last_health_check_status,
    serverState: data.server_state,
    serverStateChangedAt: unmarshalDate(data.server_state_changed_at)
  };
};
const unmarshalLbType = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'LbType' failed as data isn't a dictionary.`);
  }
  return {
    description: data.description,
    name: data.name,
    region: data.region,
    stockStatus: data.stock_status,
    zone: data.zone
  };
};
const unmarshalPrivateNetwork$2 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'PrivateNetwork' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    dhcpConfig: data.dhcp_config ? unmarshalPrivateNetworkDHCPConfig(data.dhcp_config) : undefined,
    ipamConfig: data.ipam_config ? unmarshalPrivateNetworkIpamConfig(data.ipam_config) : undefined,
    lb: data.lb ? unmarshalLb(data.lb) : undefined,
    privateNetworkId: data.private_network_id,
    staticConfig: data.static_config ? unmarshalPrivateNetworkStaticConfig(data.static_config) : undefined,
    status: data.status,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalRoute = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Route' failed as data isn't a dictionary.`);
  }
  return {
    backendId: data.backend_id,
    createdAt: unmarshalDate(data.created_at),
    frontendId: data.frontend_id,
    id: data.id,
    match: data.match ? unmarshalRouteMatch(data.match) : undefined,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalLbStats = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'LbStats' failed as data isn't a dictionary.`);
  }
  return {
    backendServersStats: unmarshalArrayOfObject(data.backend_servers_stats, unmarshalBackendServerStats)
  };
};
const unmarshalListAclResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListAclResponse' failed as data isn't a dictionary.`);
  }
  return {
    acls: unmarshalArrayOfObject(data.acls, unmarshalAcl),
    totalCount: data.total_count
  };
};
const unmarshalListBackendStatsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListBackendStatsResponse' failed as data isn't a dictionary.`);
  }
  return {
    backendServersStats: unmarshalArrayOfObject(data.backend_servers_stats, unmarshalBackendServerStats),
    totalCount: data.total_count
  };
};
const unmarshalListBackendsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListBackendsResponse' failed as data isn't a dictionary.`);
  }
  return {
    backends: unmarshalArrayOfObject(data.backends, unmarshalBackend),
    totalCount: data.total_count
  };
};
const unmarshalListCertificatesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListCertificatesResponse' failed as data isn't a dictionary.`);
  }
  return {
    certificates: unmarshalArrayOfObject(data.certificates, unmarshalCertificate),
    totalCount: data.total_count
  };
};
const unmarshalListFrontendsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListFrontendsResponse' failed as data isn't a dictionary.`);
  }
  return {
    frontends: unmarshalArrayOfObject(data.frontends, unmarshalFrontend),
    totalCount: data.total_count
  };
};
const unmarshalListIpsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListIpsResponse' failed as data isn't a dictionary.`);
  }
  return {
    ips: unmarshalArrayOfObject(data.ips, unmarshalIp),
    totalCount: data.total_count
  };
};
const unmarshalListLbPrivateNetworksResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListLbPrivateNetworksResponse' failed as data isn't a dictionary.`);
  }
  return {
    privateNetwork: unmarshalArrayOfObject(data.private_network, unmarshalPrivateNetwork$2),
    totalCount: data.total_count
  };
};
const unmarshalListLbTypesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListLbTypesResponse' failed as data isn't a dictionary.`);
  }
  return {
    lbTypes: unmarshalArrayOfObject(data.lb_types, unmarshalLbType),
    totalCount: data.total_count
  };
};
const unmarshalListLbsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListLbsResponse' failed as data isn't a dictionary.`);
  }
  return {
    lbs: unmarshalArrayOfObject(data.lbs, unmarshalLb),
    totalCount: data.total_count
  };
};
const unmarshalListRoutesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListRoutesResponse' failed as data isn't a dictionary.`);
  }
  return {
    routes: unmarshalArrayOfObject(data.routes, unmarshalRoute),
    totalCount: data.total_count
  };
};
const unmarshalListSubscriberResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListSubscriberResponse' failed as data isn't a dictionary.`);
  }
  return {
    subscribers: unmarshalArrayOfObject(data.subscribers, unmarshalSubscriber),
    totalCount: data.total_count
  };
};
const unmarshalSetAclsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SetAclsResponse' failed as data isn't a dictionary.`);
  }
  return {
    acls: unmarshalArrayOfObject(data.acls, unmarshalAcl),
    totalCount: data.total_count
  };
};
const marshalAclActionRedirect = (request, defaults) => ({
  code: request.code,
  target: request.target,
  type: request.type
});
const marshalAclAction = (request, defaults) => ({
  redirect: request.redirect ? marshalAclActionRedirect(request.redirect) : undefined,
  type: request.type
});
const marshalAclMatch = (request, defaults) => ({
  http_filter: request.httpFilter,
  http_filter_option: request.httpFilterOption,
  http_filter_value: request.httpFilterValue,
  invert: request.invert,
  ip_subnet: request.ipSubnet
});
const marshalHealthCheckHttpConfig = (request, defaults) => ({
  code: request.code,
  host_header: request.hostHeader,
  method: request.method,
  uri: request.uri
});
const marshalHealthCheckHttpsConfig = (request, defaults) => ({
  code: request.code,
  host_header: request.hostHeader,
  method: request.method,
  sni: request.sni,
  uri: request.uri
});
const marshalHealthCheckLdapConfig = (request, defaults) => ({});
const marshalHealthCheckMysqlConfig = (request, defaults) => ({
  user: request.user
});
const marshalHealthCheckPgsqlConfig = (request, defaults) => ({
  user: request.user
});
const marshalHealthCheckRedisConfig = (request, defaults) => ({});
const marshalHealthCheckTcpConfig = (request, defaults) => ({});
const marshalAclSpec = (request, defaults) => ({
  action: marshalAclAction(request.action),
  description: request.description,
  index: request.index,
  match: request.match ? marshalAclMatch(request.match) : undefined,
  name: request.name
});
const marshalCreateCertificateRequestCustomCertificate = (request, defaults) => ({
  certificate_chain: request.certificateChain
});
const marshalCreateCertificateRequestLetsencryptConfig = (request, defaults) => ({
  common_name: request.commonName,
  subject_alternative_name: request.subjectAlternativeName
});
const marshalHealthCheck = (request, defaults) => ({
  check_delay: request.checkDelay,
  check_max_retries: request.checkMaxRetries,
  check_send_proxy: request.checkSendProxy,
  check_timeout: request.checkTimeout,
  port: request.port,
  transient_check_delay: request.transientCheckDelay,
  ...resolveOneOf([{
    param: 'tcp_config',
    value: request.tcpConfig ? marshalHealthCheckTcpConfig(request.tcpConfig) : undefined
  }, {
    param: 'mysql_config',
    value: request.mysqlConfig ? marshalHealthCheckMysqlConfig(request.mysqlConfig) : undefined
  }, {
    param: 'pgsql_config',
    value: request.pgsqlConfig ? marshalHealthCheckPgsqlConfig(request.pgsqlConfig) : undefined
  }, {
    param: 'ldap_config',
    value: request.ldapConfig ? marshalHealthCheckLdapConfig(request.ldapConfig) : undefined
  }, {
    param: 'redis_config',
    value: request.redisConfig ? marshalHealthCheckRedisConfig(request.redisConfig) : undefined
  }, {
    param: 'http_config',
    value: request.httpConfig ? marshalHealthCheckHttpConfig(request.httpConfig) : undefined
  }, {
    param: 'https_config',
    value: request.httpsConfig ? marshalHealthCheckHttpsConfig(request.httpsConfig) : undefined
  }])
});
const marshalPrivateNetworkDHCPConfig = (request, defaults) => ({});
const marshalPrivateNetworkIpamConfig = (request, defaults) => ({});
const marshalPrivateNetworkStaticConfig = (request, defaults) => ({
  ip_address: request.ipAddress
});
const marshalRouteMatch = (request, defaults) => ({
  ...resolveOneOf([{
    param: 'sni',
    value: request.sni
  }, {
    param: 'host_header',
    value: request.hostHeader
  }])
});
const marshalSubscriberEmailConfig = (request, defaults) => ({
  email: request.email
});
const marshalSubscriberWebhookConfig = (request, defaults) => ({
  uri: request.uri
});
const marshalAddBackendServersRequest = (request, defaults) => ({
  server_ip: request.serverIp
});
const marshalAttachPrivateNetworkRequest = (request, defaults) => ({
  ...resolveOneOf([{
    param: 'static_config',
    value: request.staticConfig ? marshalPrivateNetworkStaticConfig(request.staticConfig) : undefined
  }, {
    param: 'dhcp_config',
    value: request.dhcpConfig ? marshalPrivateNetworkDHCPConfig(request.dhcpConfig) : undefined
  }, {
    param: 'ipam_config',
    value: request.ipamConfig ? marshalPrivateNetworkIpamConfig(request.ipamConfig) : undefined
  }])
});
const marshalCreateAclRequest = (request, defaults) => ({
  action: marshalAclAction(request.action),
  description: request.description,
  index: request.index,
  match: request.match ? marshalAclMatch(request.match) : undefined,
  name: request.name || randomName('acl')
});
const marshalCreateBackendRequest = (request, defaults) => ({
  failover_host: request.failoverHost,
  forward_port: request.forwardPort,
  forward_port_algorithm: request.forwardPortAlgorithm,
  forward_protocol: request.forwardProtocol,
  health_check: marshalHealthCheck(request.healthCheck),
  ignore_ssl_server_verify: request.ignoreSslServerVerify,
  max_connections: request.maxConnections,
  max_retries: request.maxRetries,
  name: request.name || randomName('lbb'),
  on_marked_down_action: request.onMarkedDownAction ?? 'on_marked_down_action_none',
  proxy_protocol: request.proxyProtocol ?? 'proxy_protocol_unknown',
  redispatch_attempt_count: request.redispatchAttemptCount,
  send_proxy_v2: request.sendProxyV2,
  server_ip: request.serverIp,
  ssl_bridging: request.sslBridging,
  sticky_sessions: request.stickySessions,
  sticky_sessions_cookie_name: request.stickySessionsCookieName,
  timeout_connect: request.timeoutConnect,
  timeout_queue: request.timeoutQueue,
  timeout_server: request.timeoutServer,
  timeout_tunnel: request.timeoutTunnel
});
const marshalCreateCertificateRequest = (request, defaults) => ({
  name: request.name || randomName('certificate'),
  ...resolveOneOf([{
    param: 'letsencrypt',
    value: request.letsencrypt ? marshalCreateCertificateRequestLetsencryptConfig(request.letsencrypt) : undefined
  }, {
    param: 'custom_certificate',
    value: request.customCertificate ? marshalCreateCertificateRequestCustomCertificate(request.customCertificate) : undefined
  }], true)
});
const marshalCreateFrontendRequest = (request, defaults) => ({
  backend_id: request.backendId,
  certificate_id: request.certificateId,
  certificate_ids: request.certificateIds,
  enable_http3: request.enableHttp3,
  inbound_port: request.inboundPort,
  name: request.name || randomName('lbf'),
  timeout_client: request.timeoutClient
});
const marshalCreateIpRequest = (request, defaults) => ({
  reverse: request.reverse,
  ...resolveOneOf([{
    default: defaults.defaultProjectId,
    param: 'project_id',
    value: request.projectId
  }, {
    default: defaults.defaultOrganizationId,
    param: 'organization_id',
    value: request.organizationId
  }])
});
const marshalCreateLbRequest = (request, defaults) => ({
  description: request.description,
  ip_id: request.ipId,
  name: request.name || randomName('lb'),
  ssl_compatibility_level: request.sslCompatibilityLevel ?? 'ssl_compatibility_level_unknown',
  tags: request.tags,
  type: request.type,
  ...resolveOneOf([{
    default: defaults.defaultProjectId,
    param: 'project_id',
    value: request.projectId
  }, {
    default: defaults.defaultOrganizationId,
    param: 'organization_id',
    value: request.organizationId
  }])
});
const marshalCreateRouteRequest = (request, defaults) => ({
  backend_id: request.backendId,
  frontend_id: request.frontendId,
  match: request.match ? marshalRouteMatch(request.match) : undefined
});
const marshalCreateSubscriberRequest = (request, defaults) => ({
  name: request.name,
  ...resolveOneOf([{
    default: defaults.defaultProjectId,
    param: 'project_id',
    value: request.projectId
  }, {
    default: defaults.defaultOrganizationId,
    param: 'organization_id',
    value: request.organizationId
  }]),
  ...resolveOneOf([{
    param: 'email_config',
    value: request.emailConfig ? marshalSubscriberEmailConfig(request.emailConfig) : undefined
  }, {
    param: 'webhook_config',
    value: request.webhookConfig ? marshalSubscriberWebhookConfig(request.webhookConfig) : undefined
  }])
});
const marshalMigrateLbRequest = (request, defaults) => ({
  type: request.type
});
const marshalRemoveBackendServersRequest = (request, defaults) => ({
  server_ip: request.serverIp
});
const marshalSetBackendServersRequest = (request, defaults) => ({
  server_ip: request.serverIp
});
const marshalSubscribeToLbRequest = (request, defaults) => ({
  subscriber_id: request.subscriberId
});
const marshalUpdateAclRequest = (request, defaults) => ({
  action: marshalAclAction(request.action),
  description: request.description,
  index: request.index,
  match: request.match ? marshalAclMatch(request.match) : undefined,
  name: request.name
});
const marshalUpdateBackendRequest = (request, defaults) => ({
  failover_host: request.failoverHost,
  forward_port: request.forwardPort,
  forward_port_algorithm: request.forwardPortAlgorithm,
  forward_protocol: request.forwardProtocol,
  ignore_ssl_server_verify: request.ignoreSslServerVerify,
  max_connections: request.maxConnections,
  max_retries: request.maxRetries,
  name: request.name,
  on_marked_down_action: request.onMarkedDownAction ?? 'on_marked_down_action_none',
  proxy_protocol: request.proxyProtocol ?? 'proxy_protocol_unknown',
  redispatch_attempt_count: request.redispatchAttemptCount,
  send_proxy_v2: request.sendProxyV2,
  ssl_bridging: request.sslBridging,
  sticky_sessions: request.stickySessions,
  sticky_sessions_cookie_name: request.stickySessionsCookieName,
  timeout_connect: request.timeoutConnect,
  timeout_queue: request.timeoutQueue,
  timeout_server: request.timeoutServer,
  timeout_tunnel: request.timeoutTunnel
});
const marshalUpdateCertificateRequest = (request, defaults) => ({
  name: request.name
});
const marshalUpdateFrontendRequest = (request, defaults) => ({
  backend_id: request.backendId,
  certificate_id: request.certificateId,
  certificate_ids: request.certificateIds,
  enable_http3: request.enableHttp3,
  inbound_port: request.inboundPort,
  name: request.name,
  timeout_client: request.timeoutClient
});
const marshalUpdateHealthCheckRequest = (request, defaults) => ({
  check_delay: request.checkDelay,
  check_max_retries: request.checkMaxRetries,
  check_send_proxy: request.checkSendProxy,
  check_timeout: request.checkTimeout,
  port: request.port,
  transient_check_delay: request.transientCheckDelay,
  ...resolveOneOf([{
    param: 'tcp_config',
    value: request.tcpConfig ? marshalHealthCheckTcpConfig(request.tcpConfig) : undefined
  }, {
    param: 'mysql_config',
    value: request.mysqlConfig ? marshalHealthCheckMysqlConfig(request.mysqlConfig) : undefined
  }, {
    param: 'pgsql_config',
    value: request.pgsqlConfig ? marshalHealthCheckPgsqlConfig(request.pgsqlConfig) : undefined
  }, {
    param: 'ldap_config',
    value: request.ldapConfig ? marshalHealthCheckLdapConfig(request.ldapConfig) : undefined
  }, {
    param: 'redis_config',
    value: request.redisConfig ? marshalHealthCheckRedisConfig(request.redisConfig) : undefined
  }, {
    param: 'http_config',
    value: request.httpConfig ? marshalHealthCheckHttpConfig(request.httpConfig) : undefined
  }, {
    param: 'https_config',
    value: request.httpsConfig ? marshalHealthCheckHttpsConfig(request.httpsConfig) : undefined
  }])
});
const marshalUpdateIpRequest = (request, defaults) => ({
  reverse: request.reverse
});
const marshalUpdateLbRequest = (request, defaults) => ({
  description: request.description,
  name: request.name,
  ssl_compatibility_level: request.sslCompatibilityLevel ?? 'ssl_compatibility_level_unknown',
  tags: request.tags
});
const marshalUpdateRouteRequest = (request, defaults) => ({
  backend_id: request.backendId,
  match: request.match ? marshalRouteMatch(request.match) : undefined
});
const marshalUpdateSubscriberRequest = (request, defaults) => ({
  name: request.name,
  ...resolveOneOf([{
    param: 'email_config',
    value: request.emailConfig ? marshalSubscriberEmailConfig(request.emailConfig) : undefined
  }, {
    param: 'webhook_config',
    value: request.webhookConfig ? marshalSubscriberWebhookConfig(request.webhookConfig) : undefined
  }])
});
const marshalZonedApiAddBackendServersRequest = (request, defaults) => ({
  server_ip: request.serverIp
});
const marshalZonedApiAttachPrivateNetworkRequest = (request, defaults) => ({
  ...resolveOneOf([{
    param: 'static_config',
    value: request.staticConfig ? marshalPrivateNetworkStaticConfig(request.staticConfig) : undefined
  }, {
    param: 'dhcp_config',
    value: request.dhcpConfig ? marshalPrivateNetworkDHCPConfig(request.dhcpConfig) : undefined
  }, {
    param: 'ipam_config',
    value: request.ipamConfig ? marshalPrivateNetworkIpamConfig(request.ipamConfig) : undefined
  }])
});
const marshalZonedApiCreateAclRequest = (request, defaults) => ({
  action: marshalAclAction(request.action),
  description: request.description,
  index: request.index,
  match: request.match ? marshalAclMatch(request.match) : undefined,
  name: request.name || randomName('acl')
});
const marshalZonedApiCreateBackendRequest = (request, defaults) => ({
  failover_host: request.failoverHost,
  forward_port: request.forwardPort,
  forward_port_algorithm: request.forwardPortAlgorithm,
  forward_protocol: request.forwardProtocol,
  health_check: marshalHealthCheck(request.healthCheck),
  ignore_ssl_server_verify: request.ignoreSslServerVerify,
  max_connections: request.maxConnections,
  max_retries: request.maxRetries,
  name: request.name || randomName('lbb'),
  on_marked_down_action: request.onMarkedDownAction ?? 'on_marked_down_action_none',
  proxy_protocol: request.proxyProtocol ?? 'proxy_protocol_unknown',
  redispatch_attempt_count: request.redispatchAttemptCount,
  send_proxy_v2: request.sendProxyV2,
  server_ip: request.serverIp,
  ssl_bridging: request.sslBridging,
  sticky_sessions: request.stickySessions,
  sticky_sessions_cookie_name: request.stickySessionsCookieName,
  timeout_connect: request.timeoutConnect,
  timeout_queue: request.timeoutQueue,
  timeout_server: request.timeoutServer,
  timeout_tunnel: request.timeoutTunnel
});
const marshalZonedApiCreateCertificateRequest = (request, defaults) => ({
  name: request.name || randomName('certificate'),
  ...resolveOneOf([{
    param: 'letsencrypt',
    value: request.letsencrypt ? marshalCreateCertificateRequestLetsencryptConfig(request.letsencrypt) : undefined
  }, {
    param: 'custom_certificate',
    value: request.customCertificate ? marshalCreateCertificateRequestCustomCertificate(request.customCertificate) : undefined
  }], true)
});
const marshalZonedApiCreateFrontendRequest = (request, defaults) => ({
  backend_id: request.backendId,
  certificate_id: request.certificateId,
  certificate_ids: request.certificateIds,
  enable_http3: request.enableHttp3,
  inbound_port: request.inboundPort,
  name: request.name || randomName('lbf'),
  timeout_client: request.timeoutClient
});
const marshalZonedApiCreateIpRequest = (request, defaults) => ({
  reverse: request.reverse,
  ...resolveOneOf([{
    default: defaults.defaultProjectId,
    param: 'project_id',
    value: request.projectId
  }, {
    default: defaults.defaultOrganizationId,
    param: 'organization_id',
    value: request.organizationId
  }])
});
const marshalZonedApiCreateLbRequest = (request, defaults) => ({
  description: request.description,
  ip_id: request.ipId,
  name: request.name || randomName('lb'),
  ssl_compatibility_level: request.sslCompatibilityLevel ?? 'ssl_compatibility_level_unknown',
  tags: request.tags,
  type: request.type,
  ...resolveOneOf([{
    default: defaults.defaultProjectId,
    param: 'project_id',
    value: request.projectId
  }, {
    default: defaults.defaultOrganizationId,
    param: 'organization_id',
    value: request.organizationId
  }])
});
const marshalZonedApiCreateRouteRequest = (request, defaults) => ({
  backend_id: request.backendId,
  frontend_id: request.frontendId,
  match: request.match ? marshalRouteMatch(request.match) : undefined
});
const marshalZonedApiCreateSubscriberRequest = (request, defaults) => ({
  name: request.name,
  ...resolveOneOf([{
    default: defaults.defaultProjectId,
    param: 'project_id',
    value: request.projectId
  }, {
    default: defaults.defaultOrganizationId,
    param: 'organization_id',
    value: request.organizationId
  }]),
  ...resolveOneOf([{
    param: 'email_config',
    value: request.emailConfig ? marshalSubscriberEmailConfig(request.emailConfig) : undefined
  }, {
    param: 'webhook_config',
    value: request.webhookConfig ? marshalSubscriberWebhookConfig(request.webhookConfig) : undefined
  }])
});
const marshalZonedApiMigrateLbRequest = (request, defaults) => ({
  type: request.type
});
const marshalZonedApiRemoveBackendServersRequest = (request, defaults) => ({
  server_ip: request.serverIp
});
const marshalZonedApiSetAclsRequest = (request, defaults) => ({
  acls: request.acls.map(elt => marshalAclSpec(elt))
});
const marshalZonedApiSetBackendServersRequest = (request, defaults) => ({
  server_ip: request.serverIp
});
const marshalZonedApiSubscribeToLbRequest = (request, defaults) => ({
  subscriber_id: request.subscriberId
});
const marshalZonedApiUpdateAclRequest = (request, defaults) => ({
  action: marshalAclAction(request.action),
  description: request.description,
  index: request.index,
  match: request.match ? marshalAclMatch(request.match) : undefined,
  name: request.name
});
const marshalZonedApiUpdateBackendRequest = (request, defaults) => ({
  failover_host: request.failoverHost,
  forward_port: request.forwardPort,
  forward_port_algorithm: request.forwardPortAlgorithm,
  forward_protocol: request.forwardProtocol,
  ignore_ssl_server_verify: request.ignoreSslServerVerify,
  max_connections: request.maxConnections,
  max_retries: request.maxRetries,
  name: request.name,
  on_marked_down_action: request.onMarkedDownAction ?? 'on_marked_down_action_none',
  proxy_protocol: request.proxyProtocol ?? 'proxy_protocol_unknown',
  redispatch_attempt_count: request.redispatchAttemptCount,
  send_proxy_v2: request.sendProxyV2,
  ssl_bridging: request.sslBridging,
  sticky_sessions: request.stickySessions,
  sticky_sessions_cookie_name: request.stickySessionsCookieName,
  timeout_connect: request.timeoutConnect,
  timeout_queue: request.timeoutQueue,
  timeout_server: request.timeoutServer,
  timeout_tunnel: request.timeoutTunnel
});
const marshalZonedApiUpdateCertificateRequest = (request, defaults) => ({
  name: request.name
});
const marshalZonedApiUpdateFrontendRequest = (request, defaults) => ({
  backend_id: request.backendId,
  certificate_id: request.certificateId,
  certificate_ids: request.certificateIds,
  enable_http3: request.enableHttp3,
  inbound_port: request.inboundPort,
  name: request.name,
  timeout_client: request.timeoutClient
});
const marshalZonedApiUpdateHealthCheckRequest = (request, defaults) => ({
  check_delay: request.checkDelay,
  check_max_retries: request.checkMaxRetries,
  check_send_proxy: request.checkSendProxy,
  check_timeout: request.checkTimeout,
  port: request.port,
  transient_check_delay: request.transientCheckDelay,
  ...resolveOneOf([{
    param: 'tcp_config',
    value: request.tcpConfig ? marshalHealthCheckTcpConfig(request.tcpConfig) : undefined
  }, {
    param: 'mysql_config',
    value: request.mysqlConfig ? marshalHealthCheckMysqlConfig(request.mysqlConfig) : undefined
  }, {
    param: 'pgsql_config',
    value: request.pgsqlConfig ? marshalHealthCheckPgsqlConfig(request.pgsqlConfig) : undefined
  }, {
    param: 'ldap_config',
    value: request.ldapConfig ? marshalHealthCheckLdapConfig(request.ldapConfig) : undefined
  }, {
    param: 'redis_config',
    value: request.redisConfig ? marshalHealthCheckRedisConfig(request.redisConfig) : undefined
  }, {
    param: 'http_config',
    value: request.httpConfig ? marshalHealthCheckHttpConfig(request.httpConfig) : undefined
  }, {
    param: 'https_config',
    value: request.httpsConfig ? marshalHealthCheckHttpsConfig(request.httpsConfig) : undefined
  }])
});
const marshalZonedApiUpdateIpRequest = (request, defaults) => ({
  reverse: request.reverse
});
const marshalZonedApiUpdateLbRequest = (request, defaults) => ({
  description: request.description,
  name: request.name,
  ssl_compatibility_level: request.sslCompatibilityLevel ?? 'ssl_compatibility_level_unknown',
  tags: request.tags
});
const marshalZonedApiUpdateRouteRequest = (request, defaults) => ({
  backend_id: request.backendId,
  match: request.match ? marshalRouteMatch(request.match) : undefined
});
const marshalZonedApiUpdateSubscriberRequest = (request, defaults) => ({
  name: request.name,
  ...resolveOneOf([{
    param: 'email_config',
    value: request.emailConfig ? marshalSubscriberEmailConfig(request.emailConfig) : undefined
  }, {
    param: 'webhook_config',
    value: request.webhookConfig ? marshalSubscriberWebhookConfig(request.webhookConfig) : undefined
  }])
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$a = {
  'Content-Type': 'application/json; charset=utf-8'
};

/**
 * Load balancer API.
 *
 * This API allows you to manage your load balancer service. Load balancer API.
 */
let API$c = class API extends API$q {
  /** Lists the available regions of the API. */
  static LOCALITIES = ['fr-par', 'nl-ams', 'pl-waw'];
  pageOfListLbs = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/lbs`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListLbsResponse);

  /**
   * List load balancers.
   *
   * @param request - The request {@link ListLbsRequest}
   * @returns A Promise of ListLbsResponse
   */
  listLbs = (request = {}) => enrichForPagination('lbs', this.pageOfListLbs, request);

  /**
   * Create a load balancer.
   *
   * @param request - The request {@link CreateLbRequest}
   * @returns A Promise of Lb
   */
  createLb = request => this.client.fetch({
    body: JSON.stringify(marshalCreateLbRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/lbs`
  }, unmarshalLb);

  /**
   * Get a load balancer.
   *
   * @param request - The request {@link GetLbRequest}
   * @returns A Promise of Lb
   */
  getLb = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/lbs/${validatePathParam('lbId', request.lbId)}`
  }, unmarshalLb);

  /**
   * Waits for {@link Lb} to be in a final state.
   *
   * @param request - The request {@link GetLbRequest}
   * @param options - The waiting options
   * @returns A Promise of Lb
   */
  waitForLb = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!LB_TRANSIENT_STATUSES.includes(res.status))), this.getLb, request, options);

  /**
   * Update a load balancer.
   *
   * @param request - The request {@link UpdateLbRequest}
   * @returns A Promise of Lb
   */
  updateLb = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateLbRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'PUT',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/lbs/${validatePathParam('lbId', request.lbId)}`
  }, unmarshalLb);

  /**
   * Delete a load balancer.
   *
   * @param request - The request {@link DeleteLbRequest}
   */
  deleteLb = request => this.client.fetch({
    method: 'DELETE',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/lbs/${validatePathParam('lbId', request.lbId)}`,
    urlParams: urlParams(['release_ip', request.releaseIp])
  });

  /**
   * Migrate a load balancer.
   *
   * @param request - The request {@link MigrateLbRequest}
   * @returns A Promise of Lb
   */
  migrateLb = request => this.client.fetch({
    body: JSON.stringify(marshalMigrateLbRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/lbs/${validatePathParam('lbId', request.lbId)}/migrate`
  }, unmarshalLb);
  pageOfListIPs = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/ips`,
    urlParams: urlParams(['ip_address', request.ipAddress], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListIpsResponse);

  /**
   * List IPs.
   *
   * @param request - The request {@link ListIPsRequest}
   * @returns A Promise of ListIpsResponse
   */
  listIPs = (request = {}) => enrichForPagination('ips', this.pageOfListIPs, request);

  /**
   * Create an IP.
   *
   * @param request - The request {@link CreateIpRequest}
   * @returns A Promise of Ip
   */
  createIp = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalCreateIpRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/ips`
  }, unmarshalIp);

  /**
   * Get an IP.
   *
   * @param request - The request {@link GetIpRequest}
   * @returns A Promise of Ip
   */
  getIp = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/ips/${validatePathParam('ipId', request.ipId)}`
  }, unmarshalIp);

  /**
   * Delete an IP.
   *
   * @param request - The request {@link ReleaseIpRequest}
   */
  releaseIp = request => this.client.fetch({
    method: 'DELETE',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/ips/${validatePathParam('ipId', request.ipId)}`
  });

  /**
   * Update an IP.
   *
   * @param request - The request {@link UpdateIpRequest}
   * @returns A Promise of Ip
   */
  updateIp = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateIpRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'PATCH',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/ips/${validatePathParam('ipId', request.ipId)}`
  }, unmarshalIp);
  pageOfListBackends = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/lbs/${validatePathParam('lbId', request.lbId)}/backends`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListBackendsResponse);

  /**
   * List backends in a given load balancer.
   *
   * @param request - The request {@link ListBackendsRequest}
   * @returns A Promise of ListBackendsResponse
   */
  listBackends = request => enrichForPagination('backends', this.pageOfListBackends, request);

  /**
   * Create a backend in a given load balancer.
   *
   * @param request - The request {@link CreateBackendRequest}
   * @returns A Promise of Backend
   */
  createBackend = request => this.client.fetch({
    body: JSON.stringify(marshalCreateBackendRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/lbs/${validatePathParam('lbId', request.lbId)}/backends`
  }, unmarshalBackend);

  /**
   * Get a backend in a given load balancer.
   *
   * @param request - The request {@link GetBackendRequest}
   * @returns A Promise of Backend
   */
  getBackend = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/backends/${validatePathParam('backendId', request.backendId)}`
  }, unmarshalBackend);

  /**
   * Update a backend in a given load balancer.
   *
   * @param request - The request {@link UpdateBackendRequest}
   * @returns A Promise of Backend
   */
  updateBackend = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateBackendRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'PUT',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/backends/${validatePathParam('backendId', request.backendId)}`
  }, unmarshalBackend);

  /**
   * Delete a backend in a given load balancer.
   *
   * @param request - The request {@link DeleteBackendRequest}
   */
  deleteBackend = request => this.client.fetch({
    method: 'DELETE',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/backends/${validatePathParam('backendId', request.backendId)}`
  });

  /**
   * Add a set of servers in a given backend.
   *
   * @param request - The request {@link AddBackendServersRequest}
   * @returns A Promise of Backend
   */
  addBackendServers = request => this.client.fetch({
    body: JSON.stringify(marshalAddBackendServersRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/backends/${validatePathParam('backendId', request.backendId)}/servers`
  }, unmarshalBackend);

  /**
   * Remove a set of servers for a given backend.
   *
   * @param request - The request {@link RemoveBackendServersRequest}
   * @returns A Promise of Backend
   */
  removeBackendServers = request => this.client.fetch({
    body: JSON.stringify(marshalRemoveBackendServersRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'DELETE',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/backends/${validatePathParam('backendId', request.backendId)}/servers`
  }, unmarshalBackend);

  /**
   * Define all servers in a given backend.
   *
   * @param request - The request {@link SetBackendServersRequest}
   * @returns A Promise of Backend
   */
  setBackendServers = request => this.client.fetch({
    body: JSON.stringify(marshalSetBackendServersRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'PUT',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/backends/${validatePathParam('backendId', request.backendId)}/servers`
  }, unmarshalBackend);

  /**
   * Update an health check for a given backend.
   *
   * @param request - The request {@link UpdateHealthCheckRequest}
   * @returns A Promise of HealthCheck
   */
  updateHealthCheck = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateHealthCheckRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'PUT',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/backends/${validatePathParam('backendId', request.backendId)}/healthcheck`
  }, unmarshalHealthCheck);
  pageOfListFrontends = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/lbs/${validatePathParam('lbId', request.lbId)}/frontends`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListFrontendsResponse);

  /**
   * List frontends in a given load balancer.
   *
   * @param request - The request {@link ListFrontendsRequest}
   * @returns A Promise of ListFrontendsResponse
   */
  listFrontends = request => enrichForPagination('frontends', this.pageOfListFrontends, request);

  /**
   * Create a frontend in a given load balancer.
   *
   * @param request - The request {@link CreateFrontendRequest}
   * @returns A Promise of Frontend
   */
  createFrontend = request => this.client.fetch({
    body: JSON.stringify(marshalCreateFrontendRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/lbs/${validatePathParam('lbId', request.lbId)}/frontends`
  }, unmarshalFrontend);

  /**
   * Get a frontend.
   *
   * @param request - The request {@link GetFrontendRequest}
   * @returns A Promise of Frontend
   */
  getFrontend = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/frontends/${validatePathParam('frontendId', request.frontendId)}`
  }, unmarshalFrontend);

  /**
   * Update a frontend.
   *
   * @param request - The request {@link UpdateFrontendRequest}
   * @returns A Promise of Frontend
   */
  updateFrontend = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateFrontendRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'PUT',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/frontends/${validatePathParam('frontendId', request.frontendId)}`
  }, unmarshalFrontend);

  /**
   * Delete a frontend.
   *
   * @param request - The request {@link DeleteFrontendRequest}
   */
  deleteFrontend = request => this.client.fetch({
    method: 'DELETE',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/frontends/${validatePathParam('frontendId', request.frontendId)}`
  });
  pageOfListRoutes = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/routes`,
    urlParams: urlParams(['frontend_id', request.frontendId], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListRoutesResponse);

  /**
   * List all backend redirections.
   *
   * @param request - The request {@link ListRoutesRequest}
   * @returns A Promise of ListRoutesResponse
   */
  listRoutes = (request = {}) => enrichForPagination('routes', this.pageOfListRoutes, request);

  /**
   * Create a backend redirection.
   *
   * @param request - The request {@link CreateRouteRequest}
   * @returns A Promise of Route
   */
  createRoute = request => this.client.fetch({
    body: JSON.stringify(marshalCreateRouteRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/routes`
  }, unmarshalRoute);

  /**
   * Get single backend redirection.
   *
   * @param request - The request {@link GetRouteRequest}
   * @returns A Promise of Route
   */
  getRoute = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/routes/${validatePathParam('routeId', request.routeId)}`
  }, unmarshalRoute);

  /**
   * Edit a backend redirection.
   *
   * @param request - The request {@link UpdateRouteRequest}
   * @returns A Promise of Route
   */
  updateRoute = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateRouteRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'PUT',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/routes/${validatePathParam('routeId', request.routeId)}`
  }, unmarshalRoute);

  /**
   * Delete a backend redirection.
   *
   * @param request - The request {@link DeleteRouteRequest}
   */
  deleteRoute = request => this.client.fetch({
    method: 'DELETE',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/routes/${validatePathParam('routeId', request.routeId)}`
  });

  /**
   * Get usage statistics of a given load balancer.
   *
   * @deprecated
   * @param request - The request {@link GetLbStatsRequest}
   * @returns A Promise of LbStats
   */
  getLbStats = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/lbs/${validatePathParam('lbId', request.lbId)}/stats`
  }, unmarshalLbStats);
  pageOfListBackendStats = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/lbs/${validatePathParam('lbId', request.lbId)}/backend-stats`,
    urlParams: urlParams(['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListBackendStatsResponse);
  listBackendStats = request => enrichForPagination('backendServersStats', this.pageOfListBackendStats, request);
  pageOfListAcls = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/frontends/${validatePathParam('frontendId', request.frontendId)}/acls`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListAclResponse);

  /**
   * List ACL for a given frontend.
   *
   * @param request - The request {@link ListAclsRequest}
   * @returns A Promise of ListAclResponse
   */
  listAcls = request => enrichForPagination('acls', this.pageOfListAcls, request);

  /**
   * Create an ACL for a given frontend.
   *
   * @param request - The request {@link CreateAclRequest}
   * @returns A Promise of Acl
   */
  createAcl = request => this.client.fetch({
    body: JSON.stringify(marshalCreateAclRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/frontends/${validatePathParam('frontendId', request.frontendId)}/acls`
  }, unmarshalAcl);

  /**
   * Get an ACL.
   *
   * @param request - The request {@link GetAclRequest}
   * @returns A Promise of Acl
   */
  getAcl = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/acls/${validatePathParam('aclId', request.aclId)}`
  }, unmarshalAcl);

  /**
   * Update an ACL.
   *
   * @param request - The request {@link UpdateAclRequest}
   * @returns A Promise of Acl
   */
  updateAcl = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateAclRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'PUT',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/acls/${validatePathParam('aclId', request.aclId)}`
  }, unmarshalAcl);

  /**
   * Delete an ACL.
   *
   * @param request - The request {@link DeleteAclRequest}
   */
  deleteAcl = request => this.client.fetch({
    method: 'DELETE',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/acls/${validatePathParam('aclId', request.aclId)}`
  });

  /**
   * Create a TLS certificate. Generate a new TLS certificate using Let's
   * Encrypt or import your certificate.
   *
   * @param request - The request {@link CreateCertificateRequest}
   * @returns A Promise of Certificate
   */
  createCertificate = request => this.client.fetch({
    body: JSON.stringify(marshalCreateCertificateRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/lbs/${validatePathParam('lbId', request.lbId)}/certificates`
  }, unmarshalCertificate);
  pageOfListCertificates = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/lbs/${validatePathParam('lbId', request.lbId)}/certificates`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListCertificatesResponse);

  /**
   * List all TLS certificates on a given load balancer.
   *
   * @param request - The request {@link ListCertificatesRequest}
   * @returns A Promise of ListCertificatesResponse
   */
  listCertificates = request => enrichForPagination('certificates', this.pageOfListCertificates, request);

  /**
   * Get a TLS certificate.
   *
   * @param request - The request {@link GetCertificateRequest}
   * @returns A Promise of Certificate
   */
  getCertificate = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/certificates/${validatePathParam('certificateId', request.certificateId)}`
  }, unmarshalCertificate);

  /**
   * Waits for {@link Certificate} to be in a final state.
   *
   * @param request - The request {@link GetCertificateRequest}
   * @param options - The waiting options
   * @returns A Promise of Certificate
   */
  waitForCertificate = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!CERTIFICATE_TRANSIENT_STATUSES.includes(res.status))), this.getCertificate, request, options);

  /**
   * Update a TLS certificate.
   *
   * @param request - The request {@link UpdateCertificateRequest}
   * @returns A Promise of Certificate
   */
  updateCertificate = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateCertificateRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'PUT',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/certificates/${validatePathParam('certificateId', request.certificateId)}`
  }, unmarshalCertificate);

  /**
   * Delete a TLS certificate.
   *
   * @param request - The request {@link DeleteCertificateRequest}
   */
  deleteCertificate = request => this.client.fetch({
    method: 'DELETE',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/certificates/${validatePathParam('certificateId', request.certificateId)}`
  });
  pageOfListLbTypes = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/lb-types`,
    urlParams: urlParams(['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListLbTypesResponse);

  /**
   * List all load balancer offer type.
   *
   * @param request - The request {@link ListLbTypesRequest}
   * @returns A Promise of ListLbTypesResponse
   */
  listLbTypes = (request = {}) => enrichForPagination('lbTypes', this.pageOfListLbTypes, request);

  /**
   * Create a subscriber, webhook or email.
   *
   * @param request - The request {@link CreateSubscriberRequest}
   * @returns A Promise of Subscriber
   */
  createSubscriber = request => this.client.fetch({
    body: JSON.stringify(marshalCreateSubscriberRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/subscribers`
  }, unmarshalSubscriber);

  /**
   * Get a subscriber.
   *
   * @param request - The request {@link GetSubscriberRequest}
   * @returns A Promise of Subscriber
   */
  getSubscriber = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/subscribers/${validatePathParam('subscriberId', request.subscriberId)}`
  }, unmarshalSubscriber);
  pageOfListSubscriber = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/subscribers`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListSubscriberResponse);

  /**
   * List all subscriber.
   *
   * @param request - The request {@link ListSubscriberRequest}
   * @returns A Promise of ListSubscriberResponse
   */
  listSubscriber = request => enrichForPagination('subscribers', this.pageOfListSubscriber, request);

  /**
   * Update a subscriber.
   *
   * @param request - The request {@link UpdateSubscriberRequest}
   * @returns A Promise of Subscriber
   */
  updateSubscriber = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateSubscriberRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'PUT',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/subscribers/${validatePathParam('subscriberId', request.subscriberId)}`
  }, unmarshalSubscriber);

  /**
   * Delete a subscriber.
   *
   * @param request - The request {@link DeleteSubscriberRequest}
   */
  deleteSubscriber = request => this.client.fetch({
    method: 'DELETE',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/lb/subscriber/${validatePathParam('subscriberId', request.subscriberId)}`
  });

  /**
   * Subscribe a subscriber to a given load balancer.
   *
   * @param request - The request {@link SubscribeToLbRequest}
   * @returns A Promise of Lb
   */
  subscribeToLb = request => this.client.fetch({
    body: JSON.stringify(marshalSubscribeToLbRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/lb/${validatePathParam('lbId', request.lbId)}/subscribe`
  }, unmarshalLb);

  /**
   * Unsubscribe a subscriber from a given load balancer.
   *
   * @param request - The request {@link UnsubscribeFromLbRequest}
   * @returns A Promise of Lb
   */
  unsubscribeFromLb = request => this.client.fetch({
    method: 'DELETE',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/lb/${validatePathParam('lbId', request.lbId)}/unsubscribe`
  }, unmarshalLb);
  pageOfListLbPrivateNetworks = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/lbs/${validatePathParam('lbId', request.lbId)}/private-networks`,
    urlParams: urlParams(['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListLbPrivateNetworksResponse);

  /**
   * List attached private network of load balancer.
   *
   * @param request - The request {@link ListLbPrivateNetworksRequest}
   * @returns A Promise of ListLbPrivateNetworksResponse
   */
  listLbPrivateNetworks = request => enrichForPagination('privateNetwork', this.pageOfListLbPrivateNetworks, request);

  /**
   * Add load balancer on instance private network.
   *
   * @param request - The request {@link AttachPrivateNetworkRequest}
   * @returns A Promise of PrivateNetwork
   */
  attachPrivateNetwork = request => this.client.fetch({
    body: JSON.stringify(marshalAttachPrivateNetworkRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/lbs/${validatePathParam('lbId', request.lbId)}/private-networks/${validatePathParam('privateNetworkId', request.privateNetworkId)}/attach`
  }, unmarshalPrivateNetwork$2);

  /**
   * Remove load balancer of private network.
   *
   * @param request - The request {@link DetachPrivateNetworkRequest}
   */
  detachPrivateNetwork = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/lbs/${validatePathParam('lbId', request.lbId)}/private-networks/${validatePathParam('privateNetworkId', request.privateNetworkId)}/detach`
  });
};

/**
 * Load Balancer API.
 *
 * This API allows you to manage your Scaleway Load Balancer services. Load
 * Balancer API.
 */
class ZonedAPI extends API$q {
  /** Lists the available zones of the API. */
  static LOCALITIES = ['fr-par-1', 'fr-par-2', 'nl-ams-1', 'nl-ams-2', 'pl-waw-1', 'pl-waw-2'];
  pageOfListLbs = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/lbs`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListLbsResponse);

  /**
   * List Load Balancers. List all Load Balancers in the specified zone, for a
   * Scaleway Organization or Scaleway Project. By default, the Load Balancers
   * returned in the list are ordered by creation date in ascending order,
   * though this can be modified via the `order_by` field.
   *
   * @param request - The request {@link ZonedApiListLbsRequest}
   * @returns A Promise of ListLbsResponse
   */
  listLbs = (request = {}) => enrichForPagination('lbs', this.pageOfListLbs, request);

  /**
   * Create a Load Balancer. Create a new Load Balancer. Note that the Load
   * Balancer will be created without frontends or backends; these must be
   * created separately via the dedicated endpoints.
   *
   * @param request - The request {@link ZonedApiCreateLbRequest}
   * @returns A Promise of Lb
   */
  createLb = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiCreateLbRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/lbs`
  }, unmarshalLb);

  /**
   * Get a Load Balancer. Retrieve information about an existing Load Balancer,
   * specified by its Load Balancer ID. Its full details, including name, status
   * and IP address, are returned in the response object.
   *
   * @param request - The request {@link ZonedApiGetLbRequest}
   * @returns A Promise of Lb
   */
  getLb = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/lbs/${validatePathParam('lbId', request.lbId)}`
  }, unmarshalLb);

  /**
   * Waits for {@link Lb} to be in a final state.
   *
   * @param request - The request {@link GetLbRequest}
   * @param options - The waiting options
   * @returns A Promise of Lb
   */
  waitForLb = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!LB_TRANSIENT_STATUSES.includes(res.status))), this.getLb, request, options);

  /**
   * Update a Load Balancer. Update the parameters of an existing Load Balancer,
   * specified by its Load Balancer ID. Note that the request type is PUT and
   * not PATCH. You must set all parameters.
   *
   * @param request - The request {@link ZonedApiUpdateLbRequest}
   * @returns A Promise of Lb
   */
  updateLb = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiUpdateLbRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'PUT',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/lbs/${validatePathParam('lbId', request.lbId)}`
  }, unmarshalLb);

  /**
   * Delete a Load Balancer. Delete an existing Load Balancer, specified by its
   * Load Balancer ID. Deleting a Load Balancer is permanent, and cannot be
   * undone. The Load Balancer's flexible IP address can either be deleted with
   * the Load Balancer, or kept in your account for future use.
   *
   * @param request - The request {@link ZonedApiDeleteLbRequest}
   */
  deleteLb = request => this.client.fetch({
    method: 'DELETE',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/lbs/${validatePathParam('lbId', request.lbId)}`,
    urlParams: urlParams(['release_ip', request.releaseIp])
  });

  /**
   * Migrate a Load Balancer. Migrate an existing Load Balancer from one
   * commercial type to another. Allows you to scale your Load Balancer up or
   * down in terms of bandwidth or multi-cloud provision.
   *
   * @param request - The request {@link ZonedApiMigrateLbRequest}
   * @returns A Promise of Lb
   */
  migrateLb = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiMigrateLbRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/lbs/${validatePathParam('lbId', request.lbId)}/migrate`
  }, unmarshalLb);
  pageOfListIPs = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/ips`,
    urlParams: urlParams(['ip_address', request.ipAddress], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListIpsResponse);

  /**
   * List IP addresses. List the Load Balancer flexible IP addresses held in the
   * account (filtered by Organization ID or Project ID). It is also possible to
   * search for a specific IP address.
   *
   * @param request - The request {@link ZonedApiListIPsRequest}
   * @returns A Promise of ListIpsResponse
   */
  listIPs = (request = {}) => enrichForPagination('ips', this.pageOfListIPs, request);

  /**
   * Create an IP address. Create a new Load Balancer flexible IP address, in
   * the specified Scaleway Project. This can be attached to new Load Balancers
   * created in the future.
   *
   * @param request - The request {@link ZonedApiCreateIpRequest}
   * @returns A Promise of Ip
   */
  createIp = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalZonedApiCreateIpRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/ips`
  }, unmarshalIp);

  /**
   * Get an IP address. Retrieve the full details of a Load Balancer flexible IP
   * address.
   *
   * @param request - The request {@link ZonedApiGetIpRequest}
   * @returns A Promise of Ip
   */
  getIp = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/ips/${validatePathParam('ipId', request.ipId)}`
  }, unmarshalIp);

  /**
   * Delete an IP address. Delete a Load Balancer flexible IP address. This
   * action is irreversible, and cannot be undone.
   *
   * @param request - The request {@link ZonedApiReleaseIpRequest}
   */
  releaseIp = request => this.client.fetch({
    method: 'DELETE',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/ips/${validatePathParam('ipId', request.ipId)}`
  });

  /**
   * Update an IP address. Update the reverse DNS of a Load Balancer flexible IP
   * address.
   *
   * @param request - The request {@link ZonedApiUpdateIpRequest}
   * @returns A Promise of Ip
   */
  updateIp = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiUpdateIpRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'PATCH',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/ips/${validatePathParam('ipId', request.ipId)}`
  }, unmarshalIp);
  pageOfListBackends = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/lbs/${validatePathParam('lbId', request.lbId)}/backends`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListBackendsResponse);

  /**
   * List the backends of a given Load Balancer. List all the backends of a Load
   * Balancer, specified by its Load Balancer ID. By default, results are
   * returned in ascending order by the creation date of each backend. The
   * response is an array of backend objects, containing full details of each
   * one including their configuration parameters such as protocol, port and
   * forwarding algorithm.
   *
   * @param request - The request {@link ZonedApiListBackendsRequest}
   * @returns A Promise of ListBackendsResponse
   */
  listBackends = request => enrichForPagination('backends', this.pageOfListBackends, request);

  /**
   * Create a backend for a given Load Balancer. Create a new backend for a
   * given Load Balancer, specifying its full configuration including protocol,
   * port and forwarding algorithm.
   *
   * @param request - The request {@link ZonedApiCreateBackendRequest}
   * @returns A Promise of Backend
   */
  createBackend = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiCreateBackendRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/lbs/${validatePathParam('lbId', request.lbId)}/backends`
  }, unmarshalBackend);

  /**
   * Get a backend of a given Load Balancer. Get the full details of a given
   * backend, specified by its backend ID. The response contains the backend's
   * full configuration parameters including protocol, port and forwarding
   * algorithm.
   *
   * @param request - The request {@link ZonedApiGetBackendRequest}
   * @returns A Promise of Backend
   */
  getBackend = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/backends/${validatePathParam('backendId', request.backendId)}`
  }, unmarshalBackend);

  /**
   * Update a backend of a given Load Balancer. Update a backend of a given Load
   * Balancer, specified by its backend ID. Note that the request type is PUT
   * and not PATCH. You must set all parameters.
   *
   * @param request - The request {@link ZonedApiUpdateBackendRequest}
   * @returns A Promise of Backend
   */
  updateBackend = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiUpdateBackendRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'PUT',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/backends/${validatePathParam('backendId', request.backendId)}`
  }, unmarshalBackend);

  /**
   * Delete a backend of a given Load Balancer. Delete a backend of a given Load
   * Balancer, specified by its backend ID. This action is irreversible and
   * cannot be undone.
   *
   * @param request - The request {@link ZonedApiDeleteBackendRequest}
   */
  deleteBackend = request => this.client.fetch({
    method: 'DELETE',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/backends/${validatePathParam('backendId', request.backendId)}`
  });

  /**
   * Add a set of backend servers to a given backend. For a given backend
   * specified by its backend ID, add a set of backend servers (identified by
   * their IP addresses) it should forward traffic to. These will be appended to
   * any existing set of backend servers for this backend.
   *
   * @param request - The request {@link ZonedApiAddBackendServersRequest}
   * @returns A Promise of Backend
   */
  addBackendServers = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiAddBackendServersRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/backends/${validatePathParam('backendId', request.backendId)}/servers`
  }, unmarshalBackend);

  /**
   * Remove a set of servers for a given backend. For a given backend specified
   * by its backend ID, remove the specified backend servers (identified by
   * their IP addresses) so that it no longer forwards traffic to them.
   *
   * @param request - The request {@link ZonedApiRemoveBackendServersRequest}
   * @returns A Promise of Backend
   */
  removeBackendServers = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiRemoveBackendServersRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'DELETE',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/backends/${validatePathParam('backendId', request.backendId)}/servers`
  }, unmarshalBackend);

  /**
   * Define all backend servers for a given backend. For a given backend
   * specified by its backend ID, define the set of backend servers (identified
   * by their IP addresses) that it should forward traffic to. Any existing
   * backend servers configured for this backend will be removed.
   *
   * @param request - The request {@link ZonedApiSetBackendServersRequest}
   * @returns A Promise of Backend
   */
  setBackendServers = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiSetBackendServersRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'PUT',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/backends/${validatePathParam('backendId', request.backendId)}/servers`
  }, unmarshalBackend);

  /**
   * Update a health check for a given backend. Update the configuration of the
   * health check performed by a given backend to verify the health of its
   * backend servers, identified by its backend ID. Note that the request type
   * is PUT and not PATCH. You must set all parameters.
   *
   * @param request - The request {@link ZonedApiUpdateHealthCheckRequest}
   * @returns A Promise of HealthCheck
   */
  updateHealthCheck = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiUpdateHealthCheckRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'PUT',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/backends/${validatePathParam('backendId', request.backendId)}/healthcheck`
  }, unmarshalHealthCheck);
  pageOfListFrontends = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/lbs/${validatePathParam('lbId', request.lbId)}/frontends`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListFrontendsResponse);

  /**
   * List frontends of a given Load Balancer. List all the frontends of a Load
   * Balancer, specified by its Load Balancer ID. By default, results are
   * returned in ascending order by the creation date of each frontend. The
   * response is an array of frontend objects, containing full details of each
   * one including the port they listen on and the backend they are attached
   * to.
   *
   * @param request - The request {@link ZonedApiListFrontendsRequest}
   * @returns A Promise of ListFrontendsResponse
   */
  listFrontends = request => enrichForPagination('frontends', this.pageOfListFrontends, request);

  /**
   * Create a frontend in a given Load Balancer. Create a new frontend for a
   * given Load Balancer, specifying its configuration including the port it
   * should listen on and the backend to attach it to.
   *
   * @param request - The request {@link ZonedApiCreateFrontendRequest}
   * @returns A Promise of Frontend
   */
  createFrontend = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiCreateFrontendRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/lbs/${validatePathParam('lbId', request.lbId)}/frontends`
  }, unmarshalFrontend);

  /**
   * Get a frontend. Get the full details of a given frontend, specified by its
   * frontend ID. The response contains the frontend's full configuration
   * parameters including the backend it is attached to, the port it listens on,
   * and any certificates it has.
   *
   * @param request - The request {@link ZonedApiGetFrontendRequest}
   * @returns A Promise of Frontend
   */
  getFrontend = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/frontends/${validatePathParam('frontendId', request.frontendId)}`
  }, unmarshalFrontend);

  /**
   * Update a frontend. Update a given frontend, specified by its frontend ID.
   * You can update configuration parameters including its name and the port it
   * listens on. Note that the request type is PUT and not PATCH. You must set
   * all parameters.
   *
   * @param request - The request {@link ZonedApiUpdateFrontendRequest}
   * @returns A Promise of Frontend
   */
  updateFrontend = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiUpdateFrontendRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'PUT',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/frontends/${validatePathParam('frontendId', request.frontendId)}`
  }, unmarshalFrontend);

  /**
   * Delete a frontend. Delete a given frontend, specified by its frontend ID.
   * This action is irreversible and cannot be undone.
   *
   * @param request - The request {@link ZonedApiDeleteFrontendRequest}
   */
  deleteFrontend = request => this.client.fetch({
    method: 'DELETE',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/frontends/${validatePathParam('frontendId', request.frontendId)}`
  });
  pageOfListRoutes = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/routes`,
    urlParams: urlParams(['frontend_id', request.frontendId], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListRoutesResponse);

  /**
   * List all routes. List all routes for a given frontend. The response is an
   * array of routes, each one with a specified backend to direct to if a
   * certain condition is matched (based on the value of the SNI field or HTTP
   * Host header).
   *
   * @param request - The request {@link ZonedApiListRoutesRequest}
   * @returns A Promise of ListRoutesResponse
   */
  listRoutes = (request = {}) => enrichForPagination('routes', this.pageOfListRoutes, request);

  /**
   * Create a route. Create a new route on a given frontend. To configure a
   * route, specify the backend to direct to if a certain condition is matched
   * (based on the value of the SNI field or HTTP Host header).
   *
   * @param request - The request {@link ZonedApiCreateRouteRequest}
   * @returns A Promise of Route
   */
  createRoute = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiCreateRouteRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/routes`
  }, unmarshalRoute);

  /**
   * Get a route. Retrieve information about an existing route, specified by its
   * route ID. Its full details, origin frontend, target backend and match
   * condition, are returned in the response object.
   *
   * @param request - The request {@link ZonedApiGetRouteRequest}
   * @returns A Promise of Route
   */
  getRoute = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/routes/${validatePathParam('routeId', request.routeId)}`
  }, unmarshalRoute);

  /**
   * Update a route. Update the configuration of an existing route, specified by
   * its route ID.
   *
   * @param request - The request {@link ZonedApiUpdateRouteRequest}
   * @returns A Promise of Route
   */
  updateRoute = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiUpdateRouteRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'PUT',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/routes/${validatePathParam('routeId', request.routeId)}`
  }, unmarshalRoute);

  /**
   * Delete a route. Delete an existing route, specified by its route ID.
   * Deleting a route is permanent, and cannot be undone.
   *
   * @param request - The request {@link ZonedApiDeleteRouteRequest}
   */
  deleteRoute = request => this.client.fetch({
    method: 'DELETE',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/routes/${validatePathParam('routeId', request.routeId)}`
  });

  /**
   * Get usage statistics of a given Load Balancer.
   *
   * @deprecated
   * @param request - The request {@link ZonedApiGetLbStatsRequest}
   * @returns A Promise of LbStats
   */
  getLbStats = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/lbs/${validatePathParam('lbId', request.lbId)}/stats`
  }, unmarshalLbStats);
  pageOfListBackendStats = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/lbs/${validatePathParam('lbId', request.lbId)}/backend-stats`,
    urlParams: urlParams(['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListBackendStatsResponse);

  /**
   * List backend server statistics. List information about your backend
   * servers, including their state and the result of their last health check.
   *
   * @param request - The request {@link ZonedApiListBackendStatsRequest}
   * @returns A Promise of ListBackendStatsResponse
   */
  listBackendStats = request => enrichForPagination('backendServersStats', this.pageOfListBackendStats, request);
  pageOfListAcls = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/frontends/${validatePathParam('frontendId', request.frontendId)}/acls`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListAclResponse);

  /**
   * List ACLs for a given frontend. List the ACLs for a given frontend,
   * specified by its frontend ID. The response is an array of ACL objects, each
   * one representing an ACL that denies or allows traffic based on certain
   * conditions.
   *
   * @param request - The request {@link ZonedApiListAclsRequest}
   * @returns A Promise of ListAclResponse
   */
  listAcls = request => enrichForPagination('acls', this.pageOfListAcls, request);

  /**
   * Create an ACL for a given frontend. Create a new ACL for a given frontend.
   * Each ACL must have a name, an action to perform (allow or deny), and a
   * match rule (the action is carried out when the incoming traffic matches the
   * rule).
   *
   * @param request - The request {@link ZonedApiCreateAclRequest}
   * @returns A Promise of Acl
   */
  createAcl = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiCreateAclRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/frontends/${validatePathParam('frontendId', request.frontendId)}/acls`
  }, unmarshalAcl);

  /**
   * Get an ACL. Get information for a particular ACL, specified by its ACL ID.
   * The response returns full details of the ACL, including its name, action,
   * match rule and frontend.
   *
   * @param request - The request {@link ZonedApiGetAclRequest}
   * @returns A Promise of Acl
   */
  getAcl = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/acls/${validatePathParam('aclId', request.aclId)}`
  }, unmarshalAcl);

  /**
   * Update an ACL. Update a particular ACL, specified by its ACL ID. You can
   * update details including its name, action and match rule.
   *
   * @param request - The request {@link ZonedApiUpdateAclRequest}
   * @returns A Promise of Acl
   */
  updateAcl = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiUpdateAclRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'PUT',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/acls/${validatePathParam('aclId', request.aclId)}`
  }, unmarshalAcl);

  /**
   * Delete an ACL. Delete an ACL, specified by its ACL ID. Deleting an ACL is
   * irreversible and cannot be undone.
   *
   * @param request - The request {@link ZonedApiDeleteAclRequest}
   */
  deleteAcl = request => this.client.fetch({
    method: 'DELETE',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/acls/${validatePathParam('aclId', request.aclId)}`
  });

  /**
   * Define all ACLs for a given frontend. For a given frontend specified by its
   * frontend ID, define and add the complete set of ACLS for that frontend. Any
   * existing ACLs on this frontend will be removed.
   *
   * @param request - The request {@link ZonedApiSetAclsRequest}
   * @returns A Promise of SetAclsResponse
   */
  setAcls = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiSetAclsRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'PUT',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/frontends/${validatePathParam('frontendId', request.frontendId)}/acls`
  }, unmarshalSetAclsResponse);

  /**
   * Create an SSL/TLS certificate. Generate a new SSL/TLS certificate for a
   * given Load Balancer. You can choose to create a Let's Encrypt certificate,
   * or import a custom certificate.
   *
   * @param request - The request {@link ZonedApiCreateCertificateRequest}
   * @returns A Promise of Certificate
   */
  createCertificate = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiCreateCertificateRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/lbs/${validatePathParam('lbId', request.lbId)}/certificates`
  }, unmarshalCertificate);
  pageOfListCertificates = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/lbs/${validatePathParam('lbId', request.lbId)}/certificates`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListCertificatesResponse);

  /**
   * List all SSL/TLS certificates on a given Load Balancer. List all the
   * SSL/TLS certificates on a given Load Balancer. The response is an array of
   * certificate objects, which are by default listed in ascending order of
   * creation date.
   *
   * @param request - The request {@link ZonedApiListCertificatesRequest}
   * @returns A Promise of ListCertificatesResponse
   */
  listCertificates = request => enrichForPagination('certificates', this.pageOfListCertificates, request);

  /**
   * Get an SSL/TLS certificate. Get information for a particular SSL/TLS
   * certificate, specified by its certificate ID. The response returns full
   * details of the certificate, including its type, main domain name, and
   * alternative domain names.
   *
   * @param request - The request {@link ZonedApiGetCertificateRequest}
   * @returns A Promise of Certificate
   */
  getCertificate = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/certificates/${validatePathParam('certificateId', request.certificateId)}`
  }, unmarshalCertificate);

  /**
   * Waits for {@link Certificate} to be in a final state.
   *
   * @param request - The request {@link GetCertificateRequest}
   * @param options - The waiting options
   * @returns A Promise of Certificate
   */
  waitForCertificate = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!CERTIFICATE_TRANSIENT_STATUSES.includes(res.status))), this.getCertificate, request, options);

  /**
   * Update an SSL/TLS certificate. Update the name of a particular SSL/TLS
   * certificate, specified by its certificate ID.
   *
   * @param request - The request {@link ZonedApiUpdateCertificateRequest}
   * @returns A Promise of Certificate
   */
  updateCertificate = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiUpdateCertificateRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'PUT',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/certificates/${validatePathParam('certificateId', request.certificateId)}`
  }, unmarshalCertificate);

  /**
   * Delete an SSL/TLS certificate. Delete an SSL/TLS certificate, specified by
   * its certificate ID. Deleting a certificate is irreversible and cannot be
   * undone.
   *
   * @param request - The request {@link ZonedApiDeleteCertificateRequest}
   */
  deleteCertificate = request => this.client.fetch({
    method: 'DELETE',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/certificates/${validatePathParam('certificateId', request.certificateId)}`
  });
  pageOfListLbTypes = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/lb-types`,
    urlParams: urlParams(['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListLbTypesResponse);

  /**
   * List all Load Balancer offer types. List all the different commercial Load
   * Balancer types. The response includes an array of offer types, each with a
   * name, description, and information about its stock availability.
   *
   * @param request - The request {@link ZonedApiListLbTypesRequest}
   * @returns A Promise of ListLbTypesResponse
   */
  listLbTypes = (request = {}) => enrichForPagination('lbTypes', this.pageOfListLbTypes, request);

  /**
   * Create a subscriber. Create a new subscriber, either with an email
   * configuration or a webhook configuration, for a specified Scaleway
   * Project.
   *
   * @param request - The request {@link ZonedApiCreateSubscriberRequest}
   * @returns A Promise of Subscriber
   */
  createSubscriber = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiCreateSubscriberRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/subscribers`
  }, unmarshalSubscriber);

  /**
   * Get a subscriber. Retrieve information about an existing subscriber,
   * specified by its subscriber ID. Its full details, including name and
   * email/webhook configuration, are returned in the response object.
   *
   * @param request - The request {@link ZonedApiGetSubscriberRequest}
   * @returns A Promise of Subscriber
   */
  getSubscriber = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/subscribers/${validatePathParam('subscriberId', request.subscriberId)}`
  }, unmarshalSubscriber);
  pageOfListSubscriber = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/subscribers`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListSubscriberResponse);

  /**
   * List all subscribers. List all subscribers to Load Balancer alerts. By
   * default, returns all subscribers to Load Balancer alerts for the
   * Organization associated with the authentication token used for the
   * request.
   *
   * @param request - The request {@link ZonedApiListSubscriberRequest}
   * @returns A Promise of ListSubscriberResponse
   */
  listSubscriber = request => enrichForPagination('subscribers', this.pageOfListSubscriber, request);

  /**
   * Update a subscriber. Update the parameters of a given subscriber (e.g.
   * name, webhook configuration, email configuration), specified by its
   * subscriber ID.
   *
   * @param request - The request {@link ZonedApiUpdateSubscriberRequest}
   * @returns A Promise of Subscriber
   */
  updateSubscriber = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiUpdateSubscriberRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'PUT',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/subscribers/${validatePathParam('subscriberId', request.subscriberId)}`
  }, unmarshalSubscriber);

  /**
   * Delete a subscriber. Delete an existing subscriber, specified by its
   * subscriber ID. Deleting a subscriber is permanent, and cannot be undone.
   *
   * @param request - The request {@link ZonedApiDeleteSubscriberRequest}
   */
  deleteSubscriber = request => this.client.fetch({
    method: 'DELETE',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/lb/subscription/${validatePathParam('subscriberId', request.subscriberId)}`
  });

  /**
   * Subscribe a subscriber to alerts for a given Load Balancer. Subscribe an
   * existing subscriber to alerts for a given Load Balancer.
   *
   * @param request - The request {@link ZonedApiSubscribeToLbRequest}
   * @returns A Promise of Lb
   */
  subscribeToLb = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiSubscribeToLbRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/lb/${validatePathParam('lbId', request.lbId)}/subscribe`
  }, unmarshalLb);

  /**
   * Unsubscribe a subscriber from alerts for a given Load Balancer. Unsubscribe
   * a subscriber from alerts for a given Load Balancer. The subscriber is not
   * deleted, and can be resubscribed in the future if necessary.
   *
   * @param request - The request {@link ZonedApiUnsubscribeFromLbRequest}
   * @returns A Promise of Lb
   */
  unsubscribeFromLb = request => this.client.fetch({
    method: 'DELETE',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/lb/${validatePathParam('lbId', request.lbId)}/unsubscribe`
  }, unmarshalLb);
  pageOfListLbPrivateNetworks = request => this.client.fetch({
    method: 'GET',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/lbs/${validatePathParam('lbId', request.lbId)}/private-networks`,
    urlParams: urlParams(['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListLbPrivateNetworksResponse);

  /**
   * List Private Networks attached to a Load Balancer. List the Private
   * Networks attached to a given Load Balancer, specified by its Load Balancer
   * ID. The response is an array of Private Network objects, giving information
   * including the status, configuration, name and creation date of each Private
   * Network.
   *
   * @param request - The request {@link ZonedApiListLbPrivateNetworksRequest}
   * @returns A Promise of ListLbPrivateNetworksResponse
   */
  listLbPrivateNetworks = request => enrichForPagination('privateNetwork', this.pageOfListLbPrivateNetworks, request);

  /**
   * Attach a Load Balancer to a Private Network. Attach a specified Load
   * Balancer to a specified Private Network, defining a static or DHCP
   * configuration for the Load Balancer on the network.
   *
   * @param request - The request {@link ZonedApiAttachPrivateNetworkRequest}
   * @returns A Promise of PrivateNetwork
   */
  attachPrivateNetwork = request => this.client.fetch({
    body: JSON.stringify(marshalZonedApiAttachPrivateNetworkRequest(request, this.client.settings)),
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/lbs/${validatePathParam('lbId', request.lbId)}/private-networks/${validatePathParam('privateNetworkId', request.privateNetworkId)}/attach`
  }, unmarshalPrivateNetwork$2);

  /**
   * Detach Load Balancer from Private Network. Detach a specified Load Balancer
   * from a specified Private Network.
   *
   * @param request - The request {@link ZonedApiDetachPrivateNetworkRequest}
   */
  detachPrivateNetwork = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$a,
    method: 'POST',
    path: `/lb/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/lbs/${validatePathParam('lbId', request.lbId)}/private-networks/${validatePathParam('privateNetworkId', request.privateNetworkId)}/detach`
  });
}

class LbV1UtilsAPI extends API$c {
  /**
   * Waits for all private networks of a load balancer to be in a final state.
   *
   * @param request - The request {@link WaitForLbPrivateNetworksRequest}
   * @param options - The waiting options
   * @returns A Promise of ListLbPrivateNetworksResponse
   */
  waitForLbPrivateNetworks = (request, options) => tryAtIntervals(async () => {
    const value = await this.listLbPrivateNetworks({
      lbId: request.lbId,
      region: request.region
    }).all().then(list => ({
      privateNetwork: list,
      totalCount: list.length
    }));
    return {
      done: value.privateNetwork.find(elt => PRIVATE_NETWORK_TRANSIENT_STATUSES.includes(elt.status)) === undefined,
      value
    };
  }, createExponentialBackoffStrategy(options?.minDelay ?? 1, options?.maxDelay ?? 30), options?.timeout);

  /**
   * Waits for all instances of a load balancer to be in a final state.
   *
   * @param request - The request {@link GetLbRequest}
   * @param options - The waiting options
   * @returns A Promise of Lb
   */
  waitForLbInstances = (request, options) => tryAtIntervals(async () => {
    const value = await this.getLb(request);
    return {
      done: !LB_TRANSIENT_STATUSES.includes(value.status) && value.instances.find(elt => INSTANCE_TRANSIENT_STATUSES$1.includes(elt.status)) === undefined,
      value
    };
  }, createExponentialBackoffStrategy(options?.minDelay ?? 1, options?.maxDelay ?? 30), options?.timeout);
}
class LbZonedV1UtilsAPI extends ZonedAPI {
  /**
   * Waits for all private networks of a (zoned) load balancer to be in a final
   * state.
   *
   * @param request - The request {@link ZonedWaitForLbPrivateNetworksRequest}
   * @param options - The waiting options
   * @returns A Promise of ListLbPrivateNetworksResponse
   */
  waitForLbPrivateNetworks = (request, options) => tryAtIntervals(async () => {
    const value = await this.listLbPrivateNetworks({
      lbId: request.lbId,
      zone: request.zone
    }).all().then(list => ({
      privateNetwork: list,
      totalCount: list.length
    }));
    return {
      done: value.privateNetwork.find(elt => PRIVATE_NETWORK_TRANSIENT_STATUSES.includes(elt.status)) === undefined,
      value
    };
  }, createExponentialBackoffStrategy(options?.minDelay ?? 1, options?.maxDelay ?? 30), options?.timeout);

  /**
   * Waits for all instances of a (zoned) load balancer to be in a final state.
   *
   * @param request - The request {@link GetLbRequest}
   * @param options - The waiting options
   * @returns A Promise of Lb
   */
  waitForLbInstances = (request, options) => tryAtIntervals(async () => {
    const value = await this.getLb(request);
    return {
      done: !LB_TRANSIENT_STATUSES.includes(value.status) && value.instances.find(elt => INSTANCE_TRANSIENT_STATUSES$1.includes(elt.status)) === undefined,
      value
    };
  }, createExponentialBackoffStrategy(options?.minDelay ?? 1, options?.maxDelay ?? 30), options?.timeout);
}

var index$c = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: LbV1UtilsAPI,
  CERTIFICATE_TRANSIENT_STATUSES: CERTIFICATE_TRANSIENT_STATUSES,
  INSTANCE_TRANSIENT_STATUSES: INSTANCE_TRANSIENT_STATUSES$1,
  LB_TRANSIENT_STATUSES: LB_TRANSIENT_STATUSES,
  PRIVATE_NETWORK_TRANSIENT_STATUSES: PRIVATE_NETWORK_TRANSIENT_STATUSES,
  ZonedAPI: LbZonedV1UtilsAPI
});

var index$b = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1: index$c
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalLocalImage$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'LocalImage' failed as data isn't a dictionary.`);
  }
  return {
    arch: data.arch,
    compatibleCommercialTypes: data.compatible_commercial_types,
    id: data.id,
    zone: data.zone
  };
};
const unmarshalOrganization = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Organization' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    name: data.name
  };
};
const unmarshalVersion$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Version' failed as data isn't a dictionary.`);
  }
  return {
    creationDate: unmarshalDate(data.creation_date),
    id: data.id,
    localImages: unmarshalArrayOfObject(data.local_images, unmarshalLocalImage$1),
    modificationDate: unmarshalDate(data.modification_date),
    name: data.name
  };
};
const unmarshalImage$2 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Image' failed as data isn't a dictionary.`);
  }
  return {
    categories: data.categories,
    creationDate: unmarshalDate(data.creation_date),
    currentPublicVersion: data.current_public_version,
    description: data.description,
    id: data.id,
    label: data.label,
    logo: data.logo,
    modificationDate: unmarshalDate(data.modification_date),
    name: data.name,
    organization: data.organization ? unmarshalOrganization(data.organization) : undefined,
    validUntil: unmarshalDate(data.valid_until),
    versions: unmarshalArrayOfObject(data.versions, unmarshalVersion$1)
  };
};
const unmarshalGetImageResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetImageResponse' failed as data isn't a dictionary.`);
  }
  return {
    image: data.image ? unmarshalImage$2(data.image) : undefined
  };
};
const unmarshalGetVersionResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GetVersionResponse' failed as data isn't a dictionary.`);
  }
  return {
    version: data.version ? unmarshalVersion$1(data.version) : undefined
  };
};
const unmarshalListImagesResponse$2 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListImagesResponse' failed as data isn't a dictionary.`);
  }
  return {
    images: unmarshalArrayOfObject(data.images, unmarshalImage$2),
    totalCount: data.total_count
  };
};
const unmarshalListVersionsResponse$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListVersionsResponse' failed as data isn't a dictionary.`);
  }
  return {
    totalCount: data.total_count,
    versions: unmarshalArrayOfObject(data.versions, unmarshalVersion$1)
  };
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
/** Marketplace API. */
let API$b = class API extends API$q {
  pageOfListImages = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/marketplace/v1/images`,
    urlParams: urlParams(['page', request.page], ['per_page', request.perPage ?? this.client.settings.defaultPageSize])
  }, unmarshalListImagesResponse$2);

  /**
   * List marketplace images.
   *
   * @param request - The request {@link ListImagesRequest}
   * @returns A Promise of ListImagesResponse
   */
  listImages = (request = {}) => enrichForPagination('images', this.pageOfListImages, request);

  /**
   * Get a specific marketplace image.
   *
   * @param request - The request {@link GetImageRequest}
   * @returns A Promise of GetImageResponse
   */
  getImage = request => this.client.fetch({
    method: 'GET',
    path: `/marketplace/v1/images/${validatePathParam('imageId', request.imageId)}`
  }, unmarshalGetImageResponse);
  listVersions = request => this.client.fetch({
    method: 'GET',
    path: `/marketplace/v1/images/${validatePathParam('imageId', request.imageId)}/versions`
  }, unmarshalListVersionsResponse$1);
  getVersion = request => this.client.fetch({
    method: 'GET',
    path: `/marketplace/v1/images/${validatePathParam('imageId', request.imageId)}/versions/${validatePathParam('versionId', request.versionId)}`
  }, unmarshalGetVersionResponse);
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen$b = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API$b
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalCategory = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Category' failed as data isn't a dictionary.`);
  }
  return {
    description: data.description,
    id: data.id,
    name: data.name
  };
};
const unmarshalImage$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Image' failed as data isn't a dictionary.`);
  }
  return {
    categories: data.categories,
    createdAt: unmarshalDate(data.created_at),
    description: data.description,
    id: data.id,
    label: data.label,
    logo: data.logo,
    name: data.name,
    updatedAt: unmarshalDate(data.updated_at),
    validUntil: unmarshalDate(data.valid_until)
  };
};
const unmarshalLocalImage = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'LocalImage' failed as data isn't a dictionary.`);
  }
  return {
    arch: data.arch,
    compatibleCommercialTypes: data.compatible_commercial_types,
    id: data.id,
    label: data.label,
    zone: data.zone
  };
};
const unmarshalVersion = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Version' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    id: data.id,
    name: data.name,
    publishedAt: unmarshalDate(data.published_at),
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalListCategoriesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListCategoriesResponse' failed as data isn't a dictionary.`);
  }
  return {
    categories: unmarshalArrayOfObject(data.categories, unmarshalCategory),
    totalCount: data.total_count
  };
};
const unmarshalListImagesResponse$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListImagesResponse' failed as data isn't a dictionary.`);
  }
  return {
    images: unmarshalArrayOfObject(data.images, unmarshalImage$1),
    totalCount: data.total_count
  };
};
const unmarshalListLocalImagesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListLocalImagesResponse' failed as data isn't a dictionary.`);
  }
  return {
    localImages: unmarshalArrayOfObject(data.local_images, unmarshalLocalImage),
    totalCount: data.total_count
  };
};
const unmarshalListVersionsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListVersionsResponse' failed as data isn't a dictionary.`);
  }
  return {
    totalCount: data.total_count,
    versions: unmarshalArrayOfObject(data.versions, unmarshalVersion)
  };
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
/** Marketplace API. */
let API$a = class API extends API$q {
  pageOfListImages = request => this.client.fetch({
    method: 'GET',
    path: `/marketplace/v2/images`,
    urlParams: urlParams(['arch', request.arch], ['category', request.category], ['include_eol', request.includeEol], ['order_by', request.orderBy ?? 'name_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListImagesResponse$1);

  /**
   * List marketplace images. List all available images on the marketplace,
   * their UUID, CPU architecture and description.
   *
   * @param request - The request {@link ListImagesRequest}
   * @returns A Promise of ListImagesResponse
   */
  listImages = request => enrichForPagination('images', this.pageOfListImages, request);

  /**
   * Get a specific marketplace image. Get detailed information about a
   * marketplace image, specified by its `image_id` (UUID format).
   *
   * @param request - The request {@link GetImageRequest}
   * @returns A Promise of Image
   */
  getImage = request => this.client.fetch({
    method: 'GET',
    path: `/marketplace/v2/images/${validatePathParam('imageId', request.imageId)}`
  }, unmarshalImage$1);
  pageOfListVersions = request => this.client.fetch({
    method: 'GET',
    path: `/marketplace/v2/versions`,
    urlParams: urlParams(['image_id', request.imageId], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListVersionsResponse);

  /**
   * List versions of an Image. Get a list of all available version of an image,
   * specified by its `image_id` (UUID format).
   *
   * @param request - The request {@link ListVersionsRequest}
   * @returns A Promise of ListVersionsResponse
   */
  listVersions = request => enrichForPagination('versions', this.pageOfListVersions, request);

  /**
   * Get a specific image version. Get information such as the name, creation
   * date, last update and published date for an image version specified by its
   * `version_id` (UUID format).
   *
   * @param request - The request {@link GetVersionRequest}
   * @returns A Promise of Version
   */
  getVersion = request => this.client.fetch({
    method: 'GET',
    path: `/marketplace/v2/versions/${validatePathParam('versionId', request.versionId)}`
  }, unmarshalVersion);
  pageOfListLocalImages = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/marketplace/v2/local-images`,
    urlParams: urlParams(['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['zone', request.zone ?? this.client.settings.defaultZone], ...Object.entries(resolveOneOf([{
      param: 'image_id',
      value: request.imageId
    }, {
      param: 'version_id',
      value: request.versionId
    }, {
      param: 'image_label',
      value: request.imageLabel
    }])))
  }, unmarshalListLocalImagesResponse);

  /**
   * List local images from a specific image or version. List information about
   * local images in a specific Availability Zone, specified by its `image_id`
   * (UUID format), `version_id` (UUID format) or `image_label`. Only one of
   * these three parameters may be set.
   *
   * @param request - The request {@link ListLocalImagesRequest}
   * @returns A Promise of ListLocalImagesResponse
   */
  listLocalImages = (request = {}) => enrichForPagination('localImages', this.pageOfListLocalImages, request);

  /**
   * Get a specific local image by ID. Get detailed information about a local
   * image, including compatible commercial types, supported architecture,
   * labels and the Availability Zone of the image, specified by its
   * `local_image_id` (UUID format).
   *
   * @param request - The request {@link GetLocalImageRequest}
   * @returns A Promise of LocalImage
   */
  getLocalImage = request => this.client.fetch({
    method: 'GET',
    path: `/marketplace/v2/local-images/${validatePathParam('localImageId', request.localImageId)}`
  }, unmarshalLocalImage);
  pageOfListCategories = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/marketplace/v2/categories`,
    urlParams: urlParams(['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListCategoriesResponse);

  /**
   * List existing image categories. Get a list of all existing categories. The
   * output can be paginated.
   *
   * @param request - The request {@link ListCategoriesRequest}
   * @returns A Promise of ListCategoriesResponse
   */
  listCategories = (request = {}) => enrichForPagination('categories', this.pageOfListCategories, request);

  /**
   * Get a specific category. Get information about a specific category of the
   * marketplace catalog, specified by its `category_id` (UUID format).
   *
   * @param request - The request {@link GetCategoryRequest}
   * @returns A Promise of Category
   */
  getCategory = request => this.client.fetch({
    method: 'GET',
    path: `/marketplace/v2/categories/${validatePathParam('categoryId', request.categoryId)}`
  }, unmarshalCategory);
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen$a = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API$a
});

var index$a = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1: index_gen$b,
  v2: index_gen$a
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalPermissions = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Permissions' failed as data isn't a dictionary.`);
  }
  return {
    canManage: data.can_manage,
    canPublish: data.can_publish,
    canReceive: data.can_receive
  };
};
const unmarshalCredentialSummarySQSSNSCreds = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'CredentialSummarySQSSNSCreds' failed as data isn't a dictionary.`);
  }
  return {
    accessKey: data.access_key,
    permissions: data.permissions ? unmarshalPermissions(data.permissions) : undefined
  };
};
const unmarshalCredentialNATSCredsFile = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'CredentialNATSCredsFile' failed as data isn't a dictionary.`);
  }
  return {
    content: data.content
  };
};
const unmarshalCredentialSQSSNSCreds = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'CredentialSQSSNSCreds' failed as data isn't a dictionary.`);
  }
  return {
    accessKey: data.access_key,
    permissions: data.permissions ? unmarshalPermissions(data.permissions) : undefined,
    secretKey: data.secret_key
  };
};
const unmarshalCredentialSummary = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'CredentialSummary' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    name: data.name,
    namespaceId: data.namespace_id,
    protocol: data.protocol,
    sqsSnsCredentials: data.sqs_sns_credentials ? unmarshalCredentialSummarySQSSNSCreds(data.sqs_sns_credentials) : undefined
  };
};
const unmarshalNamespace$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Namespace' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    endpoint: data.endpoint,
    id: data.id,
    name: data.name,
    projectId: data.project_id,
    protocol: data.protocol,
    region: data.region,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalCredential = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Credential' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    name: data.name,
    namespaceId: data.namespace_id,
    natsCredentials: data.nats_credentials ? unmarshalCredentialNATSCredsFile(data.nats_credentials) : undefined,
    protocol: data.protocol,
    sqsSnsCredentials: data.sqs_sns_credentials ? unmarshalCredentialSQSSNSCreds(data.sqs_sns_credentials) : undefined
  };
};
const unmarshalListCredentialsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListCredentialsResponse' failed as data isn't a dictionary.`);
  }
  return {
    credentials: unmarshalArrayOfObject(data.credentials, unmarshalCredentialSummary),
    totalCount: data.total_count
  };
};
const unmarshalListNamespacesResponse$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListNamespacesResponse' failed as data isn't a dictionary.`);
  }
  return {
    namespaces: unmarshalArrayOfObject(data.namespaces, unmarshalNamespace$1),
    totalCount: data.total_count
  };
};
const marshalPermissions = (request, defaults) => ({
  can_manage: request.canManage,
  can_publish: request.canPublish,
  can_receive: request.canReceive
});
const marshalCreateCredentialRequest = (request, defaults) => ({
  name: request.name || randomName('mnq'),
  namespace_id: request.namespaceId,
  permissions: request.permissions ? marshalPermissions(request.permissions) : undefined
});
const marshalCreateNamespaceRequest$1 = (request, defaults) => ({
  name: request.name || randomName('mnq'),
  project_id: request.projectId ?? defaults.defaultProjectId,
  protocol: request.protocol
});
const marshalUpdateCredentialRequest = (request, defaults) => ({
  name: request.name,
  permissions: request.permissions ? marshalPermissions(request.permissions) : undefined
});
const marshalUpdateNamespaceRequest$1 = (request, defaults) => ({
  name: request.name,
  namespace_id: request.namespaceId
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$9 = {
  'Content-Type': 'application/json; charset=utf-8'
};

/**
 * Messaging and Queuing API.
 *
 * This API allows you to manage Scaleway Messaging and Queueing brokers.
 * Messaging and Queuing API.
 */
let API$9 = class API extends API$q {
  /** Lists the available regions of the API. */
  static LOCALITIES = ['fr-par'];
  pageOfListNamespaces = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/mnq/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/namespaces`,
    urlParams: urlParams(['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListNamespacesResponse$1);

  /**
   * List namespaces. List all Messaging and Queuing namespaces in the specified
   * region, for a Scaleway Organization or Project. By default, the namespaces
   * returned in the list are ordered by creation date in ascending order,
   * though this can be modified via the `order_by` field.
   *
   * @param request - The request {@link ListNamespacesRequest}
   * @returns A Promise of ListNamespacesResponse
   */
  listNamespaces = (request = {}) => enrichForPagination('namespaces', this.pageOfListNamespaces, request);

  /**
   * Create a namespace. Create a Messaging and Queuing namespace, set to the
   * desired protocol.
   *
   * @param request - The request {@link CreateNamespaceRequest}
   * @returns A Promise of Namespace
   */
  createNamespace = request => this.client.fetch({
    body: JSON.stringify(marshalCreateNamespaceRequest$1(request, this.client.settings)),
    headers: jsonContentHeaders$9,
    method: 'POST',
    path: `/mnq/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/namespaces`
  }, unmarshalNamespace$1);

  /**
   * Update the name of a namespace. Update the name of a Messaging and Queuing
   * namespace, specified by its namespace ID.
   *
   * @param request - The request {@link UpdateNamespaceRequest}
   * @returns A Promise of Namespace
   */
  updateNamespace = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateNamespaceRequest$1(request, this.client.settings)),
    headers: jsonContentHeaders$9,
    method: 'PATCH',
    path: `/mnq/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/namespaces`
  }, unmarshalNamespace$1);

  /**
   * Get a namespace. Retrieve information about an existing Messaging and
   * Queuing namespace, identified by its namespace ID. Its full details,
   * including name, endpoint and protocol, are returned in the response.
   *
   * @param request - The request {@link GetNamespaceRequest}
   * @returns A Promise of Namespace
   */
  getNamespace = request => this.client.fetch({
    method: 'GET',
    path: `/mnq/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/namespaces/${validatePathParam('namespaceId', request.namespaceId)}`
  }, unmarshalNamespace$1);

  /**
   * Delete a namespace. Delete a Messaging and Queuing namespace, specified by
   * its namespace ID. Note that deleting a namespace is irreversible, and any
   * URLs, credentials and queued messages belonging to this namespace will also
   * be deleted.
   *
   * @param request - The request {@link DeleteNamespaceRequest}
   */
  deleteNamespace = request => this.client.fetch({
    method: 'DELETE',
    path: `/mnq/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/namespaces/${validatePathParam('namespaceId', request.namespaceId)}`
  });

  /**
   * Create credentials. Create a set of credentials for a Messaging and Queuing
   * namespace, specified by its namespace ID. If creating credentials for a
   * NATS namespace, the `permissions` object must not be included in the
   * request. If creating credentials for an SQS/SNS namespace, the
   * `permissions` object is required, with all three of its child attributes.
   *
   * @param request - The request {@link CreateCredentialRequest}
   * @returns A Promise of Credential
   */
  createCredential = request => this.client.fetch({
    body: JSON.stringify(marshalCreateCredentialRequest(request, this.client.settings)),
    headers: jsonContentHeaders$9,
    method: 'POST',
    path: `/mnq/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/credentials`
  }, unmarshalCredential);

  /**
   * Delete credentials. Delete a set of credentials, specified by their
   * credential ID. Deleting credentials is irreversible and cannot be undone.
   * The credentials can no longer be used to access the namespace.
   *
   * @param request - The request {@link DeleteCredentialRequest}
   */
  deleteCredential = request => this.client.fetch({
    method: 'DELETE',
    path: `/mnq/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/credentials/${validatePathParam('credentialId', request.credentialId)}`
  });
  pageOfListCredentials = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/mnq/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/credentials`,
    urlParams: urlParams(['namespace_id', request.namespaceId], ['order_by', request.orderBy ?? 'id_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListCredentialsResponse);

  /**
   * List credentials. List existing credentials in the specified region. The
   * response contains only the metadata for the credentials, not the
   * credentials themselves (for this, use **Get Credentials**).
   *
   * @param request - The request {@link ListCredentialsRequest}
   * @returns A Promise of ListCredentialsResponse
   */
  listCredentials = (request = {}) => enrichForPagination('credentials', this.pageOfListCredentials, request);

  /**
   * Update credentials. Update a set of credentials. You can update the
   * credentials' name, or (in the case of SQS/SNS credentials only) their
   * permissions. To update the name of NATS credentials, do not include the
   * `permissions` object in your request.
   *
   * @param request - The request {@link UpdateCredentialRequest}
   * @returns A Promise of Credential
   */
  updateCredential = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateCredentialRequest(request, this.client.settings)),
    headers: jsonContentHeaders$9,
    method: 'PATCH',
    path: `/mnq/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/credentials/${validatePathParam('credentialId', request.credentialId)}`
  }, unmarshalCredential);

  /**
   * Get credentials. Retrieve an existing set of credentials, identified by the
   * `credential_id`. The credentials themselves, as well as their metadata
   * (protocol, namespace ID etc), are returned in the response.
   *
   * @param request - The request {@link GetCredentialRequest}
   * @returns A Promise of Credential
   */
  getCredential = request => this.client.fetch({
    method: 'GET',
    path: `/mnq/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/credentials/${validatePathParam('credentialId', request.credentialId)}`
  }, unmarshalCredential);
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen$9 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API$9
});

var index$9 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1alpha1: index_gen$9
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

/** Lists transient statutes of the enum {@link DatabaseBackupStatus}. */
const DATABASE_BACKUP_TRANSIENT_STATUSES = ['creating', 'restoring', 'deleting', 'exporting'];

/** Lists transient statutes of the enum {@link InstanceLogStatus}. */
const INSTANCE_LOG_TRANSIENT_STATUSES = ['creating'];

/** Lists transient statutes of the enum {@link InstanceStatus}. */
const INSTANCE_TRANSIENT_STATUSES = ['provisioning', 'configuring', 'deleting', 'autohealing', 'initializing', 'backuping', 'snapshotting', 'restarting'];

/** Lists transient statutes of the enum {@link MaintenanceStatus}. */
const MAINTENANCE_TRANSIENT_STATUSES = ['pending'];

/** Lists transient statutes of the enum {@link ReadReplicaStatus}. */
const READ_REPLICA_TRANSIENT_STATUSES = ['provisioning', 'initializing', 'deleting', 'configuring'];

/** Lists transient statutes of the enum {@link SnapshotStatus}. */
const SNAPSHOT_TRANSIENT_STATUSES = ['creating', 'restoring', 'deleting'];

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalEndpointDirectAccessDetails = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'EndpointDirectAccessDetails' failed as data isn't a dictionary.`);
  }
  return {};
};
const unmarshalEndpointLoadBalancerDetails = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'EndpointLoadBalancerDetails' failed as data isn't a dictionary.`);
  }
  return {};
};
const unmarshalEndpointPrivateNetworkDetails = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'EndpointPrivateNetworkDetails' failed as data isn't a dictionary.`);
  }
  return {
    privateNetworkId: data.private_network_id,
    serviceIp: data.service_ip,
    zone: data.zone
  };
};
const unmarshalEndpoint$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Endpoint' failed as data isn't a dictionary.`);
  }
  return {
    directAccess: data.direct_access ? unmarshalEndpointDirectAccessDetails(data.direct_access) : undefined,
    hostname: data.hostname,
    id: data.id,
    ip: data.ip,
    loadBalancer: data.load_balancer ? unmarshalEndpointLoadBalancerDetails(data.load_balancer) : undefined,
    name: data.name,
    port: data.port,
    privateNetwork: data.private_network ? unmarshalEndpointPrivateNetworkDetails(data.private_network) : undefined
  };
};
const unmarshalEngineSetting = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'EngineSetting' failed as data isn't a dictionary.`);
  }
  return {
    defaultValue: data.default_value,
    description: data.description,
    floatMax: data.float_max,
    floatMin: data.float_min,
    hotConfigurable: data.hot_configurable,
    intMax: data.int_max,
    intMin: data.int_min,
    name: data.name,
    propertyType: data.property_type,
    stringConstraint: data.string_constraint,
    unit: data.unit
  };
};
const unmarshalBackupSchedule = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'BackupSchedule' failed as data isn't a dictionary.`);
  }
  return {
    disabled: data.disabled,
    frequency: data.frequency,
    retention: data.retention
  };
};
const unmarshalEngineVersion = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'EngineVersion' failed as data isn't a dictionary.`);
  }
  return {
    availableInitSettings: unmarshalArrayOfObject(data.available_init_settings, unmarshalEngineSetting),
    availableSettings: unmarshalArrayOfObject(data.available_settings, unmarshalEngineSetting),
    beta: data.beta,
    disabled: data.disabled,
    endOfLife: unmarshalDate(data.end_of_life),
    name: data.name,
    version: data.version
  };
};
const unmarshalInstanceSetting = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'InstanceSetting' failed as data isn't a dictionary.`);
  }
  return {
    name: data.name,
    value: data.value
  };
};
const unmarshalLogsPolicy = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'LogsPolicy' failed as data isn't a dictionary.`);
  }
  return {
    maxAgeRetention: data.max_age_retention,
    totalDiskRetention: data.total_disk_retention
  };
};
const unmarshalMaintenance = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Maintenance' failed as data isn't a dictionary.`);
  }
  return {
    closedAt: unmarshalDate(data.closed_at),
    reason: data.reason,
    startsAt: unmarshalDate(data.starts_at),
    status: data.status,
    stopsAt: unmarshalDate(data.stops_at)
  };
};
const unmarshalNodeTypeVolumeConstraintSizes = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'NodeTypeVolumeConstraintSizes' failed as data isn't a dictionary.`);
  }
  return {
    maxSize: data.max_size,
    minSize: data.min_size
  };
};
const unmarshalNodeTypeVolumeType = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'NodeTypeVolumeType' failed as data isn't a dictionary.`);
  }
  return {
    chunkSize: data.chunk_size,
    description: data.description,
    maxSize: data.max_size,
    minSize: data.min_size,
    type: data.type
  };
};
const unmarshalReadReplica = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ReadReplica' failed as data isn't a dictionary.`);
  }
  return {
    endpoints: unmarshalArrayOfObject(data.endpoints, unmarshalEndpoint$1),
    id: data.id,
    region: data.region,
    status: data.status
  };
};
const unmarshalUpgradableVersion = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'UpgradableVersion' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    minorVersion: data.minor_version,
    name: data.name,
    version: data.version
  };
};
const unmarshalVolume = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Volume' failed as data isn't a dictionary.`);
  }
  return {
    size: data.size,
    type: data.type
  };
};
const unmarshalACLRule$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ACLRule' failed as data isn't a dictionary.`);
  }
  return {
    action: data.action,
    description: data.description,
    direction: data.direction,
    ip: data.ip,
    port: data.port,
    protocol: data.protocol
  };
};
const unmarshalDatabase = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Database' failed as data isn't a dictionary.`);
  }
  return {
    managed: data.managed,
    name: data.name,
    owner: data.owner,
    size: data.size
  };
};
const unmarshalDatabaseBackup = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DatabaseBackup' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    databaseName: data.database_name,
    downloadUrl: data.download_url,
    downloadUrlExpiresAt: unmarshalDate(data.download_url_expires_at),
    expiresAt: unmarshalDate(data.expires_at),
    id: data.id,
    instanceId: data.instance_id,
    instanceName: data.instance_name,
    name: data.name,
    region: data.region,
    sameRegion: data.same_region,
    size: data.size,
    status: data.status,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalDatabaseEngine = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DatabaseEngine' failed as data isn't a dictionary.`);
  }
  return {
    logoUrl: data.logo_url,
    name: data.name,
    region: data.region,
    versions: unmarshalArrayOfObject(data.versions, unmarshalEngineVersion)
  };
};
const unmarshalInstance = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Instance' failed as data isn't a dictionary.`);
  }
  return {
    backupSameRegion: data.backup_same_region,
    backupSchedule: data.backup_schedule ? unmarshalBackupSchedule(data.backup_schedule) : undefined,
    createdAt: unmarshalDate(data.created_at),
    endpoint: data.endpoint ? unmarshalEndpoint$1(data.endpoint) : undefined,
    endpoints: unmarshalArrayOfObject(data.endpoints, unmarshalEndpoint$1),
    engine: data.engine,
    id: data.id,
    initSettings: unmarshalArrayOfObject(data.init_settings, unmarshalInstanceSetting),
    isHaCluster: data.is_ha_cluster,
    logsPolicy: data.logs_policy ? unmarshalLogsPolicy(data.logs_policy) : undefined,
    maintenances: unmarshalArrayOfObject(data.maintenances, unmarshalMaintenance),
    name: data.name,
    nodeType: data.node_type,
    organizationId: data.organization_id,
    projectId: data.project_id,
    readReplicas: unmarshalArrayOfObject(data.read_replicas, unmarshalReadReplica),
    region: data.region,
    settings: unmarshalArrayOfObject(data.settings, unmarshalInstanceSetting),
    status: data.status,
    tags: data.tags,
    upgradableVersion: unmarshalArrayOfObject(data.upgradable_version, unmarshalUpgradableVersion),
    volume: data.volume ? unmarshalVolume(data.volume) : undefined
  };
};
const unmarshalInstanceLog = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'InstanceLog' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    downloadUrl: data.download_url,
    expiresAt: unmarshalDate(data.expires_at),
    id: data.id,
    nodeName: data.node_name,
    region: data.region,
    status: data.status
  };
};
const unmarshalListInstanceLogsDetailsResponseInstanceLogDetail = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListInstanceLogsDetailsResponseInstanceLogDetail' failed as data isn't a dictionary.`);
  }
  return {
    logName: data.log_name,
    size: data.size
  };
};
const unmarshalNodeType$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'NodeType' failed as data isn't a dictionary.`);
  }
  return {
    availableVolumeTypes: unmarshalArrayOfObject(data.available_volume_types, unmarshalNodeTypeVolumeType),
    beta: data.beta,
    description: data.description,
    disabled: data.disabled,
    generation: data.generation,
    isBssdCompatible: data.is_bssd_compatible,
    isHaRequired: data.is_ha_required,
    memory: data.memory,
    name: data.name,
    region: data.region,
    stockStatus: data.stock_status,
    vcpus: data.vcpus,
    volumeConstraint: data.volume_constraint ? unmarshalNodeTypeVolumeConstraintSizes(data.volume_constraint) : undefined
  };
};
const unmarshalPrivilege = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Privilege' failed as data isn't a dictionary.`);
  }
  return {
    databaseName: data.database_name,
    permission: data.permission,
    userName: data.user_name
  };
};
const unmarshalSnapshot = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Snapshot' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    expiresAt: unmarshalDate(data.expires_at),
    id: data.id,
    instanceId: data.instance_id,
    instanceName: data.instance_name,
    name: data.name,
    nodeType: data.node_type,
    region: data.region,
    size: data.size,
    status: data.status,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalUser = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'User' failed as data isn't a dictionary.`);
  }
  return {
    isAdmin: data.is_admin,
    name: data.name
  };
};
const unmarshalAddInstanceACLRulesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'AddInstanceACLRulesResponse' failed as data isn't a dictionary.`);
  }
  return {
    rules: unmarshalArrayOfObject(data.rules, unmarshalACLRule$1)
  };
};
const unmarshalAddInstanceSettingsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'AddInstanceSettingsResponse' failed as data isn't a dictionary.`);
  }
  return {
    settings: unmarshalArrayOfObject(data.settings, unmarshalInstanceSetting)
  };
};
const unmarshalDeleteInstanceACLRulesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DeleteInstanceACLRulesResponse' failed as data isn't a dictionary.`);
  }
  return {
    rules: unmarshalArrayOfObject(data.rules, unmarshalACLRule$1)
  };
};
const unmarshalDeleteInstanceSettingsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DeleteInstanceSettingsResponse' failed as data isn't a dictionary.`);
  }
  return {
    settings: unmarshalArrayOfObject(data.settings, unmarshalInstanceSetting)
  };
};
const unmarshalInstanceMetrics = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'InstanceMetrics' failed as data isn't a dictionary.`);
  }
  return {
    timeseries: unmarshalArrayOfObject(data.timeseries, unmarshalTimeSeries)
  };
};
const unmarshalListDatabaseBackupsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListDatabaseBackupsResponse' failed as data isn't a dictionary.`);
  }
  return {
    databaseBackups: unmarshalArrayOfObject(data.database_backups, unmarshalDatabaseBackup),
    totalCount: data.total_count
  };
};
const unmarshalListDatabaseEnginesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListDatabaseEnginesResponse' failed as data isn't a dictionary.`);
  }
  return {
    engines: unmarshalArrayOfObject(data.engines, unmarshalDatabaseEngine),
    totalCount: data.total_count
  };
};
const unmarshalListDatabasesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListDatabasesResponse' failed as data isn't a dictionary.`);
  }
  return {
    databases: unmarshalArrayOfObject(data.databases, unmarshalDatabase),
    totalCount: data.total_count
  };
};
const unmarshalListInstanceACLRulesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListInstanceACLRulesResponse' failed as data isn't a dictionary.`);
  }
  return {
    rules: unmarshalArrayOfObject(data.rules, unmarshalACLRule$1),
    totalCount: data.total_count
  };
};
const unmarshalListInstanceLogsDetailsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListInstanceLogsDetailsResponse' failed as data isn't a dictionary.`);
  }
  return {
    details: unmarshalArrayOfObject(data.details, unmarshalListInstanceLogsDetailsResponseInstanceLogDetail)
  };
};
const unmarshalListInstanceLogsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListInstanceLogsResponse' failed as data isn't a dictionary.`);
  }
  return {
    instanceLogs: unmarshalArrayOfObject(data.instance_logs, unmarshalInstanceLog)
  };
};
const unmarshalListInstancesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListInstancesResponse' failed as data isn't a dictionary.`);
  }
  return {
    instances: unmarshalArrayOfObject(data.instances, unmarshalInstance),
    totalCount: data.total_count
  };
};
const unmarshalListNodeTypesResponse$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListNodeTypesResponse' failed as data isn't a dictionary.`);
  }
  return {
    nodeTypes: unmarshalArrayOfObject(data.node_types, unmarshalNodeType$1),
    totalCount: data.total_count
  };
};
const unmarshalListPrivilegesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListPrivilegesResponse' failed as data isn't a dictionary.`);
  }
  return {
    privileges: unmarshalArrayOfObject(data.privileges, unmarshalPrivilege),
    totalCount: data.total_count
  };
};
const unmarshalListSnapshotsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListSnapshotsResponse' failed as data isn't a dictionary.`);
  }
  return {
    snapshots: unmarshalArrayOfObject(data.snapshots, unmarshalSnapshot),
    totalCount: data.total_count
  };
};
const unmarshalListUsersResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListUsersResponse' failed as data isn't a dictionary.`);
  }
  return {
    totalCount: data.total_count,
    users: unmarshalArrayOfObject(data.users, unmarshalUser)
  };
};
const unmarshalPrepareInstanceLogsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'PrepareInstanceLogsResponse' failed as data isn't a dictionary.`);
  }
  return {
    instanceLogs: unmarshalArrayOfObject(data.instance_logs, unmarshalInstanceLog)
  };
};
const unmarshalSetInstanceACLRulesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SetInstanceACLRulesResponse' failed as data isn't a dictionary.`);
  }
  return {
    rules: unmarshalArrayOfObject(data.rules, unmarshalACLRule$1)
  };
};
const unmarshalSetInstanceSettingsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SetInstanceSettingsResponse' failed as data isn't a dictionary.`);
  }
  return {
    settings: unmarshalArrayOfObject(data.settings, unmarshalInstanceSetting)
  };
};
const marshalEndpointSpecPrivateNetworkIpamConfig = (request, defaults) => ({});
const marshalReadReplicaEndpointSpecPrivateNetworkIpamConfig = (request, defaults) => ({});
const marshalEndpointSpecLoadBalancer = (request, defaults) => ({});
const marshalEndpointSpecPrivateNetwork = (request, defaults) => ({
  private_network_id: request.privateNetworkId,
  ...resolveOneOf([{
    param: 'service_ip',
    value: request.serviceIp
  }, {
    param: 'ipam_config',
    value: request.ipamConfig ? marshalEndpointSpecPrivateNetworkIpamConfig(request.ipamConfig) : undefined
  }])
});
const marshalReadReplicaEndpointSpecDirectAccess = (request, defaults) => ({});
const marshalReadReplicaEndpointSpecPrivateNetwork = (request, defaults) => ({
  private_network_id: request.privateNetworkId,
  ...resolveOneOf([{
    param: 'service_ip',
    value: request.serviceIp
  }, {
    param: 'ipam_config',
    value: request.ipamConfig ? marshalReadReplicaEndpointSpecPrivateNetworkIpamConfig(request.ipamConfig) : undefined
  }])
});
const marshalACLRuleRequest = (request, defaults) => ({
  description: request.description,
  ip: request.ip
});
const marshalEndpointSpec$1 = (request, defaults) => ({
  ...resolveOneOf([{
    param: 'load_balancer',
    value: request.loadBalancer ? marshalEndpointSpecLoadBalancer(request.loadBalancer) : undefined
  }, {
    param: 'private_network',
    value: request.privateNetwork ? marshalEndpointSpecPrivateNetwork(request.privateNetwork) : undefined
  }])
});
const marshalInstanceSetting = (request, defaults) => ({
  name: request.name,
  value: request.value
});
const marshalLogsPolicy = (request, defaults) => ({
  max_age_retention: request.maxAgeRetention,
  total_disk_retention: request.totalDiskRetention
});
const marshalReadReplicaEndpointSpec = (request, defaults) => ({
  ...resolveOneOf([{
    param: 'direct_access',
    value: request.directAccess ? marshalReadReplicaEndpointSpecDirectAccess(request.directAccess) : undefined
  }, {
    param: 'private_network',
    value: request.privateNetwork ? marshalReadReplicaEndpointSpecPrivateNetwork(request.privateNetwork) : undefined
  }])
});
const marshalAddInstanceACLRulesRequest = (request, defaults) => ({
  rules: request.rules.map(elt => marshalACLRuleRequest(elt))
});
const marshalAddInstanceSettingsRequest = (request, defaults) => ({
  settings: request.settings.map(elt => marshalInstanceSetting(elt))
});
const marshalCloneInstanceRequest = (request, defaults) => ({
  name: request.name,
  node_type: request.nodeType
});
const marshalCreateDatabaseBackupRequest = (request, defaults) => ({
  database_name: request.databaseName,
  expires_at: request.expiresAt,
  instance_id: request.instanceId,
  name: request.name || randomName('bkp')
});
const marshalCreateDatabaseRequest = (request, defaults) => ({
  name: request.name
});
const marshalCreateEndpointRequest = (request, defaults) => ({
  endpoint_spec: request.endpointSpec ? marshalEndpointSpec$1(request.endpointSpec) : undefined
});
const marshalCreateInstanceFromSnapshotRequest = (request, defaults) => ({
  instance_name: request.instanceName,
  is_ha_cluster: request.isHaCluster,
  node_type: request.nodeType
});
const marshalCreateInstanceRequest = (request, defaults) => ({
  backup_same_region: request.backupSameRegion,
  disable_backup: request.disableBackup,
  engine: request.engine,
  init_endpoints: request.initEndpoints ? request.initEndpoints.map(elt => marshalEndpointSpec$1(elt)) : undefined,
  init_settings: request.initSettings ? request.initSettings.map(elt => marshalInstanceSetting(elt)) : undefined,
  is_ha_cluster: request.isHaCluster,
  name: request.name || randomName('ins'),
  node_type: request.nodeType,
  password: request.password,
  tags: request.tags,
  user_name: request.userName,
  volume_size: request.volumeSize,
  volume_type: request.volumeType ?? 'lssd',
  ...resolveOneOf([{
    default: defaults.defaultProjectId,
    param: 'project_id',
    value: request.projectId
  }, {
    default: defaults.defaultOrganizationId,
    param: 'organization_id',
    value: request.organizationId
  }])
});
const marshalCreateReadReplicaEndpointRequest = (request, defaults) => ({
  endpoint_spec: request.endpointSpec.map(elt => marshalReadReplicaEndpointSpec(elt))
});
const marshalCreateReadReplicaRequest = (request, defaults) => ({
  endpoint_spec: request.endpointSpec ? request.endpointSpec.map(elt => marshalReadReplicaEndpointSpec(elt)) : undefined,
  instance_id: request.instanceId
});
const marshalCreateSnapshotRequest = (request, defaults) => ({
  expires_at: request.expiresAt,
  name: request.name || randomName('snp')
});
const marshalCreateUserRequest = (request, defaults) => ({
  is_admin: request.isAdmin,
  name: request.name,
  password: request.password
});
const marshalDeleteInstanceACLRulesRequest = (request, defaults) => ({
  acl_rule_ips: request.aclRuleIps
});
const marshalDeleteInstanceSettingsRequest = (request, defaults) => ({
  setting_names: request.settingNames
});
const marshalMigrateEndpointRequest = (request, defaults) => ({
  instance_id: request.instanceId
});
const marshalPrepareInstanceLogsRequest = (request, defaults) => ({
  end_date: request.endDate,
  start_date: request.startDate
});
const marshalPurgeInstanceLogsRequest = (request, defaults) => ({
  log_name: request.logName
});
const marshalRestoreDatabaseBackupRequest = (request, defaults) => ({
  database_name: request.databaseName,
  instance_id: request.instanceId
});
const marshalSetInstanceACLRulesRequest = (request, defaults) => ({
  rules: request.rules.map(elt => marshalACLRuleRequest(elt))
});
const marshalSetInstanceSettingsRequest = (request, defaults) => ({
  settings: request.settings.map(elt => marshalInstanceSetting(elt))
});
const marshalSetPrivilegeRequest = (request, defaults) => ({
  database_name: request.databaseName,
  permission: request.permission ?? 'readonly',
  user_name: request.userName
});
const marshalUpdateDatabaseBackupRequest = (request, defaults) => ({
  expires_at: request.expiresAt,
  name: request.name
});
const marshalUpdateInstanceRequest = (request, defaults) => ({
  backup_same_region: request.backupSameRegion,
  backup_schedule_frequency: request.backupScheduleFrequency,
  backup_schedule_retention: request.backupScheduleRetention,
  is_backup_schedule_disabled: request.isBackupScheduleDisabled,
  logs_policy: request.logsPolicy ? marshalLogsPolicy(request.logsPolicy) : undefined,
  name: request.name,
  tags: request.tags
});
const marshalUpdateSnapshotRequest = (request, defaults) => ({
  expires_at: request.expiresAt,
  name: request.name
});
const marshalUpdateUserRequest = (request, defaults) => ({
  is_admin: request.isAdmin,
  password: request.password
});
const marshalUpgradeInstanceRequest = (request, defaults) => ({
  ...resolveOneOf([{
    param: 'node_type',
    value: request.nodeType
  }, {
    param: 'enable_ha',
    value: request.enableHa
  }, {
    param: 'volume_size',
    value: request.volumeSize
  }, {
    param: 'volume_type',
    value: request.volumeType
  }, {
    param: 'upgradable_version_id',
    value: request.upgradableVersionId
  }])
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$8 = {
  'Content-Type': 'application/json; charset=utf-8'
};

/** Managed Database for PostgreSQL and MySQL API. */
let API$8 = class API extends API$q {
  /** Lists the available regions of the API. */
  static LOCALITIES = ['fr-par', 'nl-ams', 'pl-waw'];
  pageOfListDatabaseEngines = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/database-engines`,
    urlParams: urlParams(['name', request.name], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['version', request.version])
  }, unmarshalListDatabaseEnginesResponse);

  /**
   * List available database engines. List the PostgreSQL and MySQL database
   * engines available at Scaleway.
   *
   * @param request - The request {@link ListDatabaseEnginesRequest}
   * @returns A Promise of ListDatabaseEnginesResponse
   */
  listDatabaseEngines = (request = {}) => enrichForPagination('engines', this.pageOfListDatabaseEngines, request);
  pageOfListNodeTypes = request => this.client.fetch({
    method: 'GET',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/node-types`,
    urlParams: urlParams(['include_disabled_types', request.includeDisabledTypes], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListNodeTypesResponse$1);

  /**
   * List available node types. List all available node types. By default, the
   * node types returned in the list are ordered by creation date in ascending
   * order, though this can be modified via the `order_by` field.
   *
   * @param request - The request {@link ListNodeTypesRequest}
   * @returns A Promise of ListNodeTypesResponse
   */
  listNodeTypes = request => enrichForPagination('nodeTypes', this.pageOfListNodeTypes, request);
  pageOfListDatabaseBackups = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/backups`,
    urlParams: urlParams(['instance_id', request.instanceId], ['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListDatabaseBackupsResponse);

  /**
   * List database backups. List all backups in a specified region, for a given
   * Scaleway Organization or Scaleway Project. By default, the backups listed
   * are ordered by creation date in ascending order. This can be modified via
   * the `order_by` field.
   *
   * @param request - The request {@link ListDatabaseBackupsRequest}
   * @returns A Promise of ListDatabaseBackupsResponse
   */
  listDatabaseBackups = (request = {}) => enrichForPagination('databaseBackups', this.pageOfListDatabaseBackups, request);

  /**
   * Create a database backup. Create a new backup. You must set the
   * `instance_id`, `database_name`, `name` and `expires_at` parameters.
   *
   * @param request - The request {@link CreateDatabaseBackupRequest}
   * @returns A Promise of DatabaseBackup
   */
  createDatabaseBackup = request => this.client.fetch({
    body: JSON.stringify(marshalCreateDatabaseBackupRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'POST',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/backups`
  }, unmarshalDatabaseBackup);

  /**
   * Get a database backup. Retrieve information about a given backup, specified
   * by its database backup ID and region. Full details about the backup, like
   * size, URL and expiration date, are returned in the response.
   *
   * @param request - The request {@link GetDatabaseBackupRequest}
   * @returns A Promise of DatabaseBackup
   */
  getDatabaseBackup = request => this.client.fetch({
    method: 'GET',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/backups/${validatePathParam('databaseBackupId', request.databaseBackupId)}`
  }, unmarshalDatabaseBackup);

  /**
   * Waits for {@link DatabaseBackup} to be in a final state.
   *
   * @param request - The request {@link GetDatabaseBackupRequest}
   * @param options - The waiting options
   * @returns A Promise of DatabaseBackup
   */
  waitForDatabaseBackup = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!DATABASE_BACKUP_TRANSIENT_STATUSES.includes(res.status))), this.getDatabaseBackup, request, options);

  /**
   * Update a database backup. Update the parameters of a backup, including name
   * and expiration date.
   *
   * @param request - The request {@link UpdateDatabaseBackupRequest}
   * @returns A Promise of DatabaseBackup
   */
  updateDatabaseBackup = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateDatabaseBackupRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'PATCH',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/backups/${validatePathParam('databaseBackupId', request.databaseBackupId)}`
  }, unmarshalDatabaseBackup);

  /**
   * Delete a database backup. Delete a backup, specified by its database backup
   * ID and region. Deleting a backup is permanent, and cannot be undone.
   *
   * @param request - The request {@link DeleteDatabaseBackupRequest}
   * @returns A Promise of DatabaseBackup
   */
  deleteDatabaseBackup = request => this.client.fetch({
    method: 'DELETE',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/backups/${validatePathParam('databaseBackupId', request.databaseBackupId)}`
  }, unmarshalDatabaseBackup);

  /**
   * Restore a database backup. Launch the process of restoring database backup.
   * You must specify the `instance_id` of the Database Instance of destination,
   * where the backup will be restored. Note that large database backups can
   * take up to several hours to restore.
   *
   * @param request - The request {@link RestoreDatabaseBackupRequest}
   * @returns A Promise of DatabaseBackup
   */
  restoreDatabaseBackup = request => this.client.fetch({
    body: JSON.stringify(marshalRestoreDatabaseBackupRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'POST',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/backups/${validatePathParam('databaseBackupId', request.databaseBackupId)}/restore`
  }, unmarshalDatabaseBackup);

  /**
   * Export a database backup. Export a backup, specified by the
   * `database_backup_id` and the `region` parameters. The download URL is
   * returned in the response.
   *
   * @param request - The request {@link ExportDatabaseBackupRequest}
   * @returns A Promise of DatabaseBackup
   */
  exportDatabaseBackup = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$8,
    method: 'POST',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/backups/${validatePathParam('databaseBackupId', request.databaseBackupId)}/export`
  }, unmarshalDatabaseBackup);

  /**
   * Upgrade a Database Instance. Upgrade your current Database Instance
   * specifications like node type, high availability, volume, or the database
   * engine version. Note that upon upgrade the `enable_ha` parameter can only
   * be set to `true`.
   *
   * @param request - The request {@link UpgradeInstanceRequest}
   * @returns A Promise of Instance
   */
  upgradeInstance = request => this.client.fetch({
    body: JSON.stringify(marshalUpgradeInstanceRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'POST',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/upgrade`
  }, unmarshalInstance);
  pageOfListInstances = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId], ['tags', request.tags])
  }, unmarshalListInstancesResponse);

  /**
   * List Database Instances. List all Database Instances in the specified
   * region, for a given Scaleway Organization or Scaleway Project. By default,
   * the Database Instances returned in the list are ordered by creation date in
   * ascending order, though this can be modified via the order_by field. You
   * can define additional parameters for your query, such as `tags` and `name`.
   * For the `name` parameter, the value you include will be checked against the
   * whole name string to see if it includes the string you put in the
   * parameter.
   *
   * @param request - The request {@link ListInstancesRequest}
   * @returns A Promise of ListInstancesResponse
   */
  listInstances = (request = {}) => enrichForPagination('instances', this.pageOfListInstances, request);

  /**
   * Get a Database Instance. Retrieve information about a given Database
   * Instance, specified by the `region` and `instance_id` parameters. Its full
   * details, including name, status, IP address and port, are returned in the
   * response object.
   *
   * @param request - The request {@link GetInstanceRequest}
   * @returns A Promise of Instance
   */
  getInstance = request => this.client.fetch({
    method: 'GET',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}`
  }, unmarshalInstance);

  /**
   * Waits for {@link Instance} to be in a final state.
   *
   * @param request - The request {@link GetInstanceRequest}
   * @param options - The waiting options
   * @returns A Promise of Instance
   */
  waitForInstance = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!INSTANCE_TRANSIENT_STATUSES.includes(res.status))), this.getInstance, request, options);

  /**
   * Create a Database Instance. Create a new Database Instance. You must set
   * the `engine`, `user_name`, `password` and `node_type` parameters.
   * Optionally, you can specify the volume type and size.
   *
   * @param request - The request {@link CreateInstanceRequest}
   * @returns A Promise of Instance
   */
  createInstance = request => this.client.fetch({
    body: JSON.stringify(marshalCreateInstanceRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'POST',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances`
  }, unmarshalInstance);

  /**
   * Update a Database Instance. Update the parameters of a Database Instance,
   * including name, tags and backup schedule details.
   *
   * @param request - The request {@link UpdateInstanceRequest}
   * @returns A Promise of Instance
   */
  updateInstance = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateInstanceRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'PATCH',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}`
  }, unmarshalInstance);

  /**
   * Delete a Database Instance. Delete a given Database Instance, specified by
   * the `region` and `instance_id` parameters. Deleting a Database Instance is
   * permanent, and cannot be undone. Note that upon deletion all your data will
   * be lost.
   *
   * @param request - The request {@link DeleteInstanceRequest}
   * @returns A Promise of Instance
   */
  deleteInstance = request => this.client.fetch({
    method: 'DELETE',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}`
  }, unmarshalInstance);

  /**
   * Clone a Database Instance. Clone a given Database Instance, specified by
   * the `region` and `instance_id` parameters. The clone feature allows you to
   * create a new Database Instance from an existing one. The clone includes all
   * existing databases, users and permissions. You can create a clone on a
   * Database Instance bigger than your current one.
   *
   * @param request - The request {@link CloneInstanceRequest}
   * @returns A Promise of Instance
   */
  cloneInstance = request => this.client.fetch({
    body: JSON.stringify(marshalCloneInstanceRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'POST',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/clone`
  }, unmarshalInstance);

  /**
   * Restart Database Instance. Restart a given Database Instance, specified by
   * the `region` and `instance_id` parameters. The status of the Database
   * Instance returned in the response.
   *
   * @param request - The request {@link RestartInstanceRequest}
   * @returns A Promise of Instance
   */
  restartInstance = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$8,
    method: 'POST',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/restart`
  }, unmarshalInstance);

  /**
   * Get the TLS certificate of a Database Instance. Retrieve information about
   * the TLS certificate of a given Database Instance. Details like name and
   * content are returned in the response.
   *
   * @param request - The request {@link GetInstanceCertificateRequest}
   * @returns A Promise of Blob
   */
  getInstanceCertificate = request => this.client.fetch({
    method: 'GET',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/certificate`,
    urlParams: urlParams(['dl', 1]),
    responseType: 'blob'
  });

  /**
   * Renew the TLS certificate of a Database Instance. Renew a TLS for a
   * Database Instance. Renewing a certificate means that you will not be able
   * to connect to your Database Instance using the previous certificate. You
   * will also need to download and update the new certificate for all database
   * clients.
   *
   * @param request - The request {@link RenewInstanceCertificateRequest}
   */
  renewInstanceCertificate = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$8,
    method: 'POST',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/renew-certificate`
  });

  /**
   * Get Database Instance metrics. Retrieve the time series metrics of a given
   * Database Instance. You can define the period from which to retrieve metrics
   * by specifying the `start_date` and `end_date`.
   *
   * @param request - The request {@link GetInstanceMetricsRequest}
   * @returns A Promise of InstanceMetrics
   */
  getInstanceMetrics = request => this.client.fetch({
    method: 'GET',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/metrics`,
    urlParams: urlParams(['end_date', request.endDate], ['metric_name', request.metricName], ['start_date', request.startDate])
  }, unmarshalInstanceMetrics);

  /**
   * Create a Read Replica. Create a new Read Replica of a Database Instance.
   * You must specify the `region` and the `instance_id`. You can only create a
   * maximum of 3 Read Replicas per Database Instance.
   *
   * @param request - The request {@link CreateReadReplicaRequest}
   * @returns A Promise of ReadReplica
   */
  createReadReplica = request => this.client.fetch({
    body: JSON.stringify(marshalCreateReadReplicaRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'POST',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/read-replicas`
  }, unmarshalReadReplica);

  /**
   * Get a Read Replica. Retrieve information about a Database Instance Read
   * Replica. Full details about the Read Replica, like `endpoints`, `status`
   * and `region` are returned in the response.
   *
   * @param request - The request {@link GetReadReplicaRequest}
   * @returns A Promise of ReadReplica
   */
  getReadReplica = request => this.client.fetch({
    method: 'GET',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/read-replicas/${validatePathParam('readReplicaId', request.readReplicaId)}`
  }, unmarshalReadReplica);

  /**
   * Waits for {@link ReadReplica} to be in a final state.
   *
   * @param request - The request {@link GetReadReplicaRequest}
   * @param options - The waiting options
   * @returns A Promise of ReadReplica
   */
  waitForReadReplica = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!READ_REPLICA_TRANSIENT_STATUSES.includes(res.status))), this.getReadReplica, request, options);

  /**
   * Delete a Read Replica. Delete a Read Replica of a Database Instance. You
   * must specify the `region` and `read_replica_id` parameters of the Read
   * Replica you want to delete.
   *
   * @param request - The request {@link DeleteReadReplicaRequest}
   * @returns A Promise of ReadReplica
   */
  deleteReadReplica = request => this.client.fetch({
    method: 'DELETE',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/read-replicas/${validatePathParam('readReplicaId', request.readReplicaId)}`
  }, unmarshalReadReplica);

  /**
   * Resync a Read Replica. When you resync a Read Replica, first it is reset,
   * then its data is resynchronized from the primary node. Your Read Replica
   * remains unavailable during the resync process. The duration of this process
   * is proportional to the size of your Database Instance. The configured
   * endpoints do not change.
   *
   * @param request - The request {@link ResetReadReplicaRequest}
   * @returns A Promise of ReadReplica
   */
  resetReadReplica = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$8,
    method: 'POST',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/read-replicas/${validatePathParam('readReplicaId', request.readReplicaId)}/reset`
  }, unmarshalReadReplica);

  /**
   * Create an endpoint for a Read Replica. Create a new endpoint for a Read
   * Replica. Read Replicas can have at most one direct access and one Private
   * Network endpoint.
   *
   * @param request - The request {@link CreateReadReplicaEndpointRequest}
   * @returns A Promise of ReadReplica
   */
  createReadReplicaEndpoint = request => this.client.fetch({
    body: JSON.stringify(marshalCreateReadReplicaEndpointRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'POST',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/read-replicas/${validatePathParam('readReplicaId', request.readReplicaId)}/endpoints`
  }, unmarshalReadReplica);

  /**
   * Prepare logs of a Database Instance. Prepare your Database Instance logs.
   * You can define the `start_date` and `end_date` parameters for your query.
   * The download URL is returned in the response. Logs are recorded from 00h00
   * to 23h59 and then aggregated in a `.log` file once a day. Therefore, even
   * if you specify a timeframe from which you want to get the logs, you will
   * receive logs from the full 24 hours.
   *
   * @param request - The request {@link PrepareInstanceLogsRequest}
   * @returns A Promise of PrepareInstanceLogsResponse
   */
  prepareInstanceLogs = request => this.client.fetch({
    body: JSON.stringify(marshalPrepareInstanceLogsRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'POST',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/prepare-logs`
  }, unmarshalPrepareInstanceLogsResponse);

  /**
   * List available logs of a Database Instance. List the available logs of a
   * Database Instance. By default, the logs returned in the list are ordered by
   * creation date in ascending order, though this can be modified via the
   * order_by field.
   *
   * @param request - The request {@link ListInstanceLogsRequest}
   * @returns A Promise of ListInstanceLogsResponse
   */
  listInstanceLogs = request => this.client.fetch({
    method: 'GET',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/logs`,
    urlParams: urlParams(['order_by', request.orderBy ?? 'created_at_asc'])
  }, unmarshalListInstanceLogsResponse);

  /**
   * Get given logs of a Database Instance. Retrieve information about the logs
   * of a Database Instance. Specify the `instance_log_id` and `region` in your
   * request to get information such as `download_url`, `status`, `expires_at`
   * and `created_at` about your logs in the response.
   *
   * @param request - The request {@link GetInstanceLogRequest}
   * @returns A Promise of InstanceLog
   */
  getInstanceLog = request => this.client.fetch({
    method: 'GET',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/logs/${validatePathParam('instanceLogId', request.instanceLogId)}`
  }, unmarshalInstanceLog);

  /**
   * Waits for {@link InstanceLog} to be in a final state.
   *
   * @param request - The request {@link GetInstanceLogRequest}
   * @param options - The waiting options
   * @returns A Promise of InstanceLog
   */
  waitForInstanceLog = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!INSTANCE_LOG_TRANSIENT_STATUSES.includes(res.status))), this.getInstanceLog, request, options);

  /**
   * Purge remote Database Instance logs. Purge a given remote log from a
   * Database Instance. You can specify the `log_name` of the log you wish to
   * clean from your Database Instance.
   *
   * @param request - The request {@link PurgeInstanceLogsRequest}
   */
  purgeInstanceLogs = request => this.client.fetch({
    body: JSON.stringify(marshalPurgeInstanceLogsRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'POST',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/purge-logs`
  });

  /**
   * List remote Database Instance logs details. List remote log details. By
   * default, the details returned in the list are ordered by creation date in
   * ascending order, though this can be modified via the order_by field.
   *
   * @param request - The request {@link ListInstanceLogsDetailsRequest}
   * @returns A Promise of ListInstanceLogsDetailsResponse
   */
  listInstanceLogsDetails = request => this.client.fetch({
    method: 'GET',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/logs-details`
  }, unmarshalListInstanceLogsDetailsResponse);

  /**
   * Add Database Instance advanced settings. Add an advanced setting to a
   * Database Instance. You must set the `name` and the `value` of each
   * setting.
   *
   * @param request - The request {@link AddInstanceSettingsRequest}
   * @returns A Promise of AddInstanceSettingsResponse
   */
  addInstanceSettings = request => this.client.fetch({
    body: JSON.stringify(marshalAddInstanceSettingsRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'POST',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/settings`
  }, unmarshalAddInstanceSettingsResponse);

  /**
   * Delete Database Instance advanced settings. Delete an advanced setting in a
   * Database Instance. You must specify the names of the settings you want to
   * delete in the request.
   *
   * @param request - The request {@link DeleteInstanceSettingsRequest}
   * @returns A Promise of DeleteInstanceSettingsResponse
   */
  deleteInstanceSettings = request => this.client.fetch({
    body: JSON.stringify(marshalDeleteInstanceSettingsRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'DELETE',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/settings`
  }, unmarshalDeleteInstanceSettingsResponse);

  /**
   * Set Database Instance advanced settings. Update an advanced setting for a
   * Database Instance. Settings added upon database engine initalization can
   * only be defined once, and cannot, therefore, be updated.
   *
   * @param request - The request {@link SetInstanceSettingsRequest}
   * @returns A Promise of SetInstanceSettingsResponse
   */
  setInstanceSettings = request => this.client.fetch({
    body: JSON.stringify(marshalSetInstanceSettingsRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'PUT',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/settings`
  }, unmarshalSetInstanceSettingsResponse);
  pageOfListInstanceACLRules = request => this.client.fetch({
    method: 'GET',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/acls`,
    urlParams: urlParams(['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListInstanceACLRulesResponse);

  /**
   * List ACL rules of a Database Instance. List the ACL rules for a given
   * Database Instance. The response is an array of ACL objects, each one
   * representing an ACL that denies, allows or redirects traffic based on
   * certain conditions.
   *
   * @param request - The request {@link ListInstanceACLRulesRequest}
   * @returns A Promise of ListInstanceACLRulesResponse
   */
  listInstanceACLRules = request => enrichForPagination('rules', this.pageOfListInstanceACLRules, request);

  /**
   * Add an ACL rule to a Database Instance. Add an additional ACL rule to a
   * Database Instance.
   *
   * @param request - The request {@link AddInstanceACLRulesRequest}
   * @returns A Promise of AddInstanceACLRulesResponse
   */
  addInstanceACLRules = request => this.client.fetch({
    body: JSON.stringify(marshalAddInstanceACLRulesRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'POST',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/acls`
  }, unmarshalAddInstanceACLRulesResponse);

  /**
   * Set ACL rules for a Database Instance. Replace all the ACL rules of a
   * Database Instance.
   *
   * @param request - The request {@link SetInstanceACLRulesRequest}
   * @returns A Promise of SetInstanceACLRulesResponse
   */
  setInstanceACLRules = request => this.client.fetch({
    body: JSON.stringify(marshalSetInstanceACLRulesRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'PUT',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/acls`
  }, unmarshalSetInstanceACLRulesResponse);

  /**
   * Delete ACL rules of a Database Instance. Delete one or more ACL rules of a
   * Database Instance.
   *
   * @param request - The request {@link DeleteInstanceACLRulesRequest}
   * @returns A Promise of DeleteInstanceACLRulesResponse
   */
  deleteInstanceACLRules = request => this.client.fetch({
    body: JSON.stringify(marshalDeleteInstanceACLRulesRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'DELETE',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/acls`
  }, unmarshalDeleteInstanceACLRulesResponse);
  pageOfListUsers = request => this.client.fetch({
    method: 'GET',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/users`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'name_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListUsersResponse);

  /**
   * List users of a Database Instance. List all users of a given Database
   * Instance. By default, the users returned in the list are ordered by
   * creation date in ascending order, though this can be modified via the
   * order_by field.
   *
   * @param request - The request {@link ListUsersRequest}
   * @returns A Promise of ListUsersResponse
   */
  listUsers = request => enrichForPagination('users', this.pageOfListUsers, request);

  /**
   * Create a user for a Database Instance. Create a new user for a Database
   * Instance. You must define the `name`, `password` and `is_admin`
   * parameters.
   *
   * @param request - The request {@link CreateUserRequest}
   * @returns A Promise of User
   */
  createUser = request => this.client.fetch({
    body: JSON.stringify(marshalCreateUserRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'POST',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/users`
  }, unmarshalUser);

  /**
   * Update a user on a Database Instance. Update the parameters of a user on a
   * Database Instance. You can update the `password` and `is_admin` parameters,
   * but you cannot change the name of the user.
   *
   * @param request - The request {@link UpdateUserRequest}
   * @returns A Promise of User
   */
  updateUser = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateUserRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'PATCH',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/users/${validatePathParam('name', request.name)}`
  }, unmarshalUser);

  /**
   * Delete a user on a Database Instance. Delete a given user on a Database
   * Instance. You must specify, in the endpoint, the `region`, `instance_id`
   * and `name` parameters of the user you want to delete.
   *
   * @param request - The request {@link DeleteUserRequest}
   */
  deleteUser = request => this.client.fetch({
    method: 'DELETE',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/users/${validatePathParam('name', request.name)}`
  });
  pageOfListDatabases = request => this.client.fetch({
    method: 'GET',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/databases`,
    urlParams: urlParams(['managed', request.managed], ['name', request.name], ['order_by', request.orderBy ?? 'name_asc'], ['owner', request.owner], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListDatabasesResponse);

  /**
   * List databases in a Database Instance. List all databases of a given
   * Database Instance. By default, the databases returned in the list are
   * ordered by creation date in ascending order, though this can be modified
   * via the order_by field. You can define additional parameters for your
   * query, such as `name`, `managed` and `owner`.
   *
   * @param request - The request {@link ListDatabasesRequest}
   * @returns A Promise of ListDatabasesResponse
   */
  listDatabases = request => enrichForPagination('databases', this.pageOfListDatabases, request);

  /**
   * Create a database in a Database Instance. Create a new database. You must
   * define the `name` parameter in the request.
   *
   * @param request - The request {@link CreateDatabaseRequest}
   * @returns A Promise of Database
   */
  createDatabase = request => this.client.fetch({
    body: JSON.stringify(marshalCreateDatabaseRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'POST',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/databases`
  }, unmarshalDatabase);

  /**
   * Delete a database in a Database Instance. Delete a given database on a
   * Database Instance. You must specify, in the endpoint, the `region`,
   * `instance_id` and `name` parameters of the database you want to delete.
   *
   * @param request - The request {@link DeleteDatabaseRequest}
   */
  deleteDatabase = request => this.client.fetch({
    method: 'DELETE',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/databases/${validatePathParam('name', request.name)}`
  });
  pageOfListPrivileges = request => this.client.fetch({
    method: 'GET',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/privileges`,
    urlParams: urlParams(['database_name', request.databaseName], ['order_by', request.orderBy ?? 'user_name_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['user_name', request.userName])
  }, unmarshalListPrivilegesResponse);

  /**
   * List user privileges for a database. List privileges of a user on a
   * database. By default, the details returned in the list are ordered by
   * creation date in ascending order, though this can be modified via the
   * order_by field. You can define additional parameters for your query, such
   * as `database_name` and `user_name`.
   *
   * @param request - The request {@link ListPrivilegesRequest}
   * @returns A Promise of ListPrivilegesResponse
   */
  listPrivileges = request => enrichForPagination('privileges', this.pageOfListPrivileges, request);

  /**
   * Set user privileges for a database. Set the privileges of a user on a
   * database. You must define `database_name`, `user_name` and `permission` in
   * the request body.
   *
   * @param request - The request {@link SetPrivilegeRequest}
   * @returns A Promise of Privilege
   */
  setPrivilege = request => this.client.fetch({
    body: JSON.stringify(marshalSetPrivilegeRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'PUT',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/privileges`
  }, unmarshalPrivilege);
  pageOfListSnapshots = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/snapshots`,
    urlParams: urlParams(['instance_id', request.instanceId], ['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListSnapshotsResponse);

  /**
   * List snapshots. List snapshots. You can include the `instance_id` or
   * `project_id` in your query to get the list of snapshots for specific
   * Database Instances and/or Projects. By default, the details returned in the
   * list are ordered by creation date in ascending order, though this can be
   * modified via the `order_by` field.
   *
   * @param request - The request {@link ListSnapshotsRequest}
   * @returns A Promise of ListSnapshotsResponse
   */
  listSnapshots = (request = {}) => enrichForPagination('snapshots', this.pageOfListSnapshots, request);

  /**
   * Get a Database Instance snapshot. Retrieve information about a given
   * snapshot, specified by its `snapshot_id` and `region`. Full details about
   * the snapshot, like size and expiration date, are returned in the response.
   *
   * @param request - The request {@link GetSnapshotRequest}
   * @returns A Promise of Snapshot
   */
  getSnapshot = request => this.client.fetch({
    method: 'GET',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/snapshots/${validatePathParam('snapshotId', request.snapshotId)}`
  }, unmarshalSnapshot);

  /**
   * Waits for {@link Snapshot} to be in a final state.
   *
   * @param request - The request {@link GetSnapshotRequest}
   * @param options - The waiting options
   * @returns A Promise of Snapshot
   */
  waitForSnapshot = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!SNAPSHOT_TRANSIENT_STATUSES.includes(res.status))), this.getSnapshot, request, options);

  /**
   * Create a Database Instance snapshot. Create a new snapshot of a Database
   * Instance. You must define the `name` parameter in the request.
   *
   * @param request - The request {@link CreateSnapshotRequest}
   * @returns A Promise of Snapshot
   */
  createSnapshot = request => this.client.fetch({
    body: JSON.stringify(marshalCreateSnapshotRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'POST',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/snapshots`
  }, unmarshalSnapshot);

  /**
   * Update a Database Instance snapshot. Update the parameters of a snapshot of
   * a Database Instance. You can update the `name` and `expires_at`
   * parameters.
   *
   * @param request - The request {@link UpdateSnapshotRequest}
   * @returns A Promise of Snapshot
   */
  updateSnapshot = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateSnapshotRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'PATCH',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/snapshots/${validatePathParam('snapshotId', request.snapshotId)}`
  }, unmarshalSnapshot);

  /**
   * Delete a Database Instance snapshot. Delete a given snapshot of a Database
   * Instance. You must specify, in the endpoint, the `region` and `snapshot_id`
   * parameters of the snapshot you want to delete.
   *
   * @param request - The request {@link DeleteSnapshotRequest}
   * @returns A Promise of Snapshot
   */
  deleteSnapshot = request => this.client.fetch({
    method: 'DELETE',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/snapshots/${validatePathParam('snapshotId', request.snapshotId)}`
  }, unmarshalSnapshot);

  /**
   * Create a new Database Instance from a snapshot. Restore a snapshot. When
   * you restore a snapshot, a new Instance is created and billed to your
   * account. Note that is possible to select a larger node type for your new
   * Database Instance. However, the Block volume size will be the same as the
   * size of the restored snapshot. All Instance settings will be restored if
   * you chose a node type with the same or more memory size than the initial
   * Instance. Settings will be reset to the default if your node type has less
   * memory.
   *
   * @param request - The request {@link CreateInstanceFromSnapshotRequest}
   * @returns A Promise of Instance
   */
  createInstanceFromSnapshot = request => this.client.fetch({
    body: JSON.stringify(marshalCreateInstanceFromSnapshotRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'POST',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/snapshots/${validatePathParam('snapshotId', request.snapshotId)}/create-instance`
  }, unmarshalInstance);

  /**
   * Create a new Database Instance endpoint. Create a new endpoint for a
   * Database Instance. You can add `load_balancer` and `private_network`
   * specifications to the body of the request. Note that this action replaces
   * your current endpoint, which means you might need to update any environment
   * configurations that point to the old endpoint.
   *
   * @param request - The request {@link CreateEndpointRequest}
   * @returns A Promise of Endpoint
   */
  createEndpoint = request => this.client.fetch({
    body: JSON.stringify(marshalCreateEndpointRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'POST',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/instances/${validatePathParam('instanceId', request.instanceId)}/endpoints`
  }, unmarshalEndpoint$1);

  /**
   * Delete a Database Instance endpoint. Delete the endpoint of a Database
   * Instance. You must specify the `region` and `endpoint_id` parameters of the
   * endpoint you want to delete. Note that might need to update any environment
   * configurations that point to the deleted endpoint.
   *
   * @param request - The request {@link DeleteEndpointRequest}
   */
  deleteEndpoint = request => this.client.fetch({
    method: 'DELETE',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/endpoints/${validatePathParam('endpointId', request.endpointId)}`
  });

  /**
   * Get a Database Instance endpoint. Retrieve information about a Database
   * Instance endpoint. Full details about the endpoint, like `ip`, `port`,
   * `private_network` and `load_balancer` specifications are returned in the
   * response.
   *
   * @param request - The request {@link GetEndpointRequest}
   * @returns A Promise of Endpoint
   */
  getEndpoint = request => this.client.fetch({
    method: 'GET',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/endpoints/${validatePathParam('endpointId', request.endpointId)}`
  }, unmarshalEndpoint$1);

  /**
   * Migrate an existing instance endpoint to another instance.
   *
   * @param request - The request {@link MigrateEndpointRequest}
   * @returns A Promise of Endpoint
   */
  migrateEndpoint = request => this.client.fetch({
    body: JSON.stringify(marshalMigrateEndpointRequest(request, this.client.settings)),
    headers: jsonContentHeaders$8,
    method: 'POST',
    path: `/rdb/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/endpoints/${validatePathParam('endpointId', request.endpointId)}/migrate`
  }, unmarshalEndpoint$1);
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen$8 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API$8,
  DATABASE_BACKUP_TRANSIENT_STATUSES: DATABASE_BACKUP_TRANSIENT_STATUSES,
  INSTANCE_LOG_TRANSIENT_STATUSES: INSTANCE_LOG_TRANSIENT_STATUSES,
  INSTANCE_TRANSIENT_STATUSES: INSTANCE_TRANSIENT_STATUSES,
  MAINTENANCE_TRANSIENT_STATUSES: MAINTENANCE_TRANSIENT_STATUSES,
  READ_REPLICA_TRANSIENT_STATUSES: READ_REPLICA_TRANSIENT_STATUSES,
  SNAPSHOT_TRANSIENT_STATUSES: SNAPSHOT_TRANSIENT_STATUSES
});

var index$8 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1: index_gen$8
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

/** Lists transient statutes of the enum {@link ClusterStatus}. */
const CLUSTER_TRANSIENT_STATUSES = ['provisioning', 'configuring', 'deleting', 'autohealing', 'initializing'];

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalPrivateNetwork$1 = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'PrivateNetwork' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    serviceIps: data.service_ips,
    zone: data.zone
  };
};
const unmarshalPublicNetwork = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'PublicNetwork' failed as data isn't a dictionary.`);
  }
  return {};
};
const unmarshalACLRule = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ACLRule' failed as data isn't a dictionary.`);
  }
  return {
    description: data.description,
    id: data.id,
    ipCidr: data.ip_cidr
  };
};
const unmarshalAvailableClusterSetting = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'AvailableClusterSetting' failed as data isn't a dictionary.`);
  }
  return {
    defaultValue: data.default_value,
    deprecated: data.deprecated,
    description: data.description,
    maxValue: data.max_value,
    minValue: data.min_value,
    name: data.name,
    regex: data.regex,
    type: data.type
  };
};
const unmarshalClusterSetting = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ClusterSetting' failed as data isn't a dictionary.`);
  }
  return {
    name: data.name,
    value: data.value
  };
};
const unmarshalEndpoint = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Endpoint' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    ips: data.ips,
    port: data.port,
    privateNetwork: data.private_network ? unmarshalPrivateNetwork$1(data.private_network) : undefined,
    publicNetwork: data.public_network ? unmarshalPublicNetwork(data.public_network) : undefined
  };
};
const unmarshalCluster = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Cluster' failed as data isn't a dictionary.`);
  }
  return {
    aclRules: unmarshalArrayOfObject(data.acl_rules, unmarshalACLRule),
    clusterSettings: unmarshalArrayOfObject(data.cluster_settings, unmarshalClusterSetting),
    clusterSize: data.cluster_size,
    createdAt: unmarshalDate(data.created_at),
    endpoints: unmarshalArrayOfObject(data.endpoints, unmarshalEndpoint),
    id: data.id,
    name: data.name,
    nodeType: data.node_type,
    projectId: data.project_id,
    status: data.status,
    tags: data.tags,
    tlsEnabled: data.tls_enabled,
    updatedAt: unmarshalDate(data.updated_at),
    upgradableVersions: data.upgradable_versions,
    userName: data.user_name,
    version: data.version,
    zone: data.zone
  };
};
const unmarshalClusterVersion = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ClusterVersion' failed as data isn't a dictionary.`);
  }
  return {
    availableSettings: unmarshalArrayOfObject(data.available_settings, unmarshalAvailableClusterSetting),
    endOfLifeAt: unmarshalDate(data.end_of_life_at),
    logoUrl: data.logo_url,
    version: data.version,
    zone: data.zone
  };
};
const unmarshalNodeType = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'NodeType' failed as data isn't a dictionary.`);
  }
  return {
    beta: data.beta,
    description: data.description,
    disabled: data.disabled,
    memory: data.memory,
    name: data.name,
    stockStatus: data.stock_status,
    vcpus: data.vcpus,
    zone: data.zone
  };
};
const unmarshalAddAclRulesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'AddAclRulesResponse' failed as data isn't a dictionary.`);
  }
  return {
    aclRules: unmarshalArrayOfObject(data.acl_rules, unmarshalACLRule),
    totalCount: data.total_count
  };
};
const unmarshalAddEndpointsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'AddEndpointsResponse' failed as data isn't a dictionary.`);
  }
  return {
    endpoints: unmarshalArrayOfObject(data.endpoints, unmarshalEndpoint),
    totalCount: data.total_count
  };
};
const unmarshalClusterMetricsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ClusterMetricsResponse' failed as data isn't a dictionary.`);
  }
  return {
    timeseries: unmarshalArrayOfObject(data.timeseries, unmarshalTimeSeries)
  };
};
const unmarshalClusterSettingsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ClusterSettingsResponse' failed as data isn't a dictionary.`);
  }
  return {
    settings: unmarshalArrayOfObject(data.settings, unmarshalClusterSetting)
  };
};
const unmarshalListClusterVersionsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListClusterVersionsResponse' failed as data isn't a dictionary.`);
  }
  return {
    totalCount: data.total_count,
    versions: unmarshalArrayOfObject(data.versions, unmarshalClusterVersion)
  };
};
const unmarshalListClustersResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListClustersResponse' failed as data isn't a dictionary.`);
  }
  return {
    clusters: unmarshalArrayOfObject(data.clusters, unmarshalCluster),
    totalCount: data.total_count
  };
};
const unmarshalListNodeTypesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListNodeTypesResponse' failed as data isn't a dictionary.`);
  }
  return {
    nodeTypes: unmarshalArrayOfObject(data.node_types, unmarshalNodeType),
    totalCount: data.total_count
  };
};
const unmarshalSetAclRulesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SetAclRulesResponse' failed as data isn't a dictionary.`);
  }
  return {
    aclRules: unmarshalArrayOfObject(data.acl_rules, unmarshalACLRule)
  };
};
const unmarshalSetEndpointsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SetEndpointsResponse' failed as data isn't a dictionary.`);
  }
  return {
    endpoints: unmarshalArrayOfObject(data.endpoints, unmarshalEndpoint)
  };
};
const marshalEndpointSpecPrivateNetworkSpecIpamConfig = (request, defaults) => ({});
const marshalEndpointSpecPrivateNetworkSpec = (request, defaults) => ({
  id: request.id,
  ipam_config: request.ipamConfig ? marshalEndpointSpecPrivateNetworkSpecIpamConfig(request.ipamConfig) : undefined,
  service_ips: request.serviceIps
});
const marshalEndpointSpecPublicNetworkSpec = (request, defaults) => ({});
const marshalACLRuleSpec = (request, defaults) => ({
  description: request.description,
  ip_cidr: request.ipCidr
});
const marshalClusterSetting = (request, defaults) => ({
  name: request.name,
  value: request.value
});
const marshalEndpointSpec = (request, defaults) => ({
  ...resolveOneOf([{
    param: 'private_network',
    value: request.privateNetwork ? marshalEndpointSpecPrivateNetworkSpec(request.privateNetwork) : undefined
  }, {
    param: 'public_network',
    value: request.publicNetwork ? marshalEndpointSpecPublicNetworkSpec(request.publicNetwork) : undefined
  }])
});
const marshalAddAclRulesRequest = (request, defaults) => ({
  acl_rules: request.aclRules.map(elt => marshalACLRuleSpec(elt))
});
const marshalAddClusterSettingsRequest = (request, defaults) => ({
  settings: request.settings.map(elt => marshalClusterSetting(elt))
});
const marshalAddEndpointsRequest = (request, defaults) => ({
  endpoints: request.endpoints.map(elt => marshalEndpointSpec(elt))
});
const marshalCreateClusterRequest = (request, defaults) => ({
  acl_rules: request.aclRules ? request.aclRules.map(elt => marshalACLRuleSpec(elt)) : undefined,
  cluster_settings: request.clusterSettings ? request.clusterSettings.map(elt => marshalClusterSetting(elt)) : undefined,
  cluster_size: request.clusterSize,
  endpoints: request.endpoints ? request.endpoints.map(elt => marshalEndpointSpec(elt)) : undefined,
  name: request.name || randomName('ins'),
  node_type: request.nodeType,
  password: request.password,
  project_id: request.projectId ?? defaults.defaultProjectId,
  tags: request.tags,
  tls_enabled: request.tlsEnabled,
  user_name: request.userName,
  version: request.version
});
const marshalMigrateClusterRequest = (request, defaults) => ({
  ...resolveOneOf([{
    param: 'version',
    value: request.version
  }, {
    param: 'node_type',
    value: request.nodeType
  }, {
    param: 'cluster_size',
    value: request.clusterSize
  }])
});
const marshalSetAclRulesRequest = (request, defaults) => ({
  acl_rules: request.aclRules.map(elt => marshalACLRuleSpec(elt))
});
const marshalSetClusterSettingsRequest = (request, defaults) => ({
  settings: request.settings.map(elt => marshalClusterSetting(elt))
});
const marshalSetEndpointsRequest = (request, defaults) => ({
  endpoints: request.endpoints.map(elt => marshalEndpointSpec(elt))
});
const marshalUpdateClusterRequest = (request, defaults) => ({
  name: request.name,
  password: request.password,
  tags: request.tags,
  user_name: request.userName
});
const marshalUpdateEndpointRequest = (request, defaults) => ({
  ...resolveOneOf([{
    param: 'private_network',
    value: request.privateNetwork ? marshalEndpointSpecPrivateNetworkSpec(request.privateNetwork) : undefined
  }, {
    param: 'public_network',
    value: request.publicNetwork ? marshalEndpointSpecPublicNetworkSpec(request.publicNetwork) : undefined
  }])
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$7 = {
  'Content-Type': 'application/json; charset=utf-8'
};

/** Managed Database for Redis™ API. */
let API$7 = class API extends API$q {
  /** Lists the available zones of the API. */
  static LOCALITIES = ['fr-par-1', 'fr-par-2', 'nl-ams-1', 'nl-ams-2', 'pl-waw-1', 'pl-waw-2'];

  /**
   * Create a Redis™ Database Instance. Create a new Redis™ Database Instance
   * (Redis™ cluster). You must set the `zone`, `project_id`, `version`,
   * `node_type`, `user_name` and `password` parameters. Optionally you can
   * define `acl_rules`, `endpoints`, `tls_enabled` and `cluster_settings`.
   *
   * @param request - The request {@link CreateClusterRequest}
   * @returns A Promise of Cluster
   */
  createCluster = request => this.client.fetch({
    body: JSON.stringify(marshalCreateClusterRequest(request, this.client.settings)),
    headers: jsonContentHeaders$7,
    method: 'POST',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/clusters`
  }, unmarshalCluster);

  /**
   * Update a Redis™ Database Instance. Update the parameters of a Redis™
   * Database Instance (Redis™ cluster), including `name`, `tags`, `user_name`
   * and `password`.
   *
   * @param request - The request {@link UpdateClusterRequest}
   * @returns A Promise of Cluster
   */
  updateCluster = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateClusterRequest(request, this.client.settings)),
    headers: jsonContentHeaders$7,
    method: 'PATCH',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/clusters/${validatePathParam('clusterId', request.clusterId)}`
  }, unmarshalCluster);

  /**
   * Get a Redis™ Database Instance. Retrieve information about a Redis™
   * Database Instance (Redis™ cluster). Specify the `cluster_id` and `region`
   * in your request to get information such as `id`, `status`, `version`,
   * `tls_enabled`, `cluster_settings`, `upgradable_versions` and `endpoints`
   * about your cluster in the response.
   *
   * @param request - The request {@link GetClusterRequest}
   * @returns A Promise of Cluster
   */
  getCluster = request => this.client.fetch({
    method: 'GET',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/clusters/${validatePathParam('clusterId', request.clusterId)}`
  }, unmarshalCluster);

  /**
   * Waits for {@link Cluster} to be in a final state.
   *
   * @param request - The request {@link GetClusterRequest}
   * @param options - The waiting options
   * @returns A Promise of Cluster
   */
  waitForCluster = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!CLUSTER_TRANSIENT_STATUSES.includes(res.status))), this.getCluster, request, options);
  pageOfListClusters = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/clusters`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId], ['tags', request.tags], ['version', request.version])
  }, unmarshalListClustersResponse);

  /**
   * List Redis™ Database Instances. List all Redis™ Database Instances (Redis™
   * cluster) in the specified zone. By default, the Database Instances returned
   * in the list are ordered by creation date in ascending order, though this
   * can be modified via the order_by field. You can define additional
   * parameters for your query, such as `tags`, `name`, `organization_id` and
   * `version`.
   *
   * @param request - The request {@link ListClustersRequest}
   * @returns A Promise of ListClustersResponse
   */
  listClusters = (request = {}) => enrichForPagination('clusters', this.pageOfListClusters, request);

  /**
   * Scale up a Redis™ Database Instance. Upgrade your standalone Redis™
   * Database Instance node, either by upgrading to a bigger node type (vertical
   * scaling) or by adding more nodes to your Database Instance to increase your
   * number of endpoints and distribute cache (horizontal scaling). Note that
   * scaling horizontally your Redis™ Database Instance will not renew its TLS
   * certificate. In order to refresh the TLS certificate, you must use the
   * Renew TLS certificate endpoint.
   *
   * @param request - The request {@link MigrateClusterRequest}
   * @returns A Promise of Cluster
   */
  migrateCluster = request => this.client.fetch({
    body: JSON.stringify(marshalMigrateClusterRequest(request, this.client.settings)),
    headers: jsonContentHeaders$7,
    method: 'POST',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/clusters/${validatePathParam('clusterId', request.clusterId)}/migrate`
  }, unmarshalCluster);

  /**
   * Delete a Redis™ Database Instance. Delete a Redis™ Database Instance
   * (Redis™ cluster), specified by the `region` and `cluster_id` parameters.
   * Deleting a Database Instance is permanent, and cannot be undone. Note that
   * upon deletion all your data will be lost.
   *
   * @param request - The request {@link DeleteClusterRequest}
   * @returns A Promise of Cluster
   */
  deleteCluster = request => this.client.fetch({
    method: 'DELETE',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/clusters/${validatePathParam('clusterId', request.clusterId)}`
  }, unmarshalCluster);

  /**
   * Get metrics of a Redis™ Database Instance. Retrieve the metrics of a Redis™
   * Database Instance (Redis™ cluster). You can define the period from which to
   * retrieve metrics by specifying the `start_date` and `end_date`.
   *
   * @param request - The request {@link GetClusterMetricsRequest}
   * @returns A Promise of ClusterMetricsResponse
   */
  getClusterMetrics = request => this.client.fetch({
    method: 'GET',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/clusters/${validatePathParam('clusterId', request.clusterId)}/metrics`,
    urlParams: urlParams(['end_at', request.endAt], ['metric_name', request.metricName], ['start_at', request.startAt])
  }, unmarshalClusterMetricsResponse);
  pageOfListNodeTypes = request => this.client.fetch({
    method: 'GET',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/node-types`,
    urlParams: urlParams(['include_disabled_types', request.includeDisabledTypes], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListNodeTypesResponse);

  /**
   * List available node types. List all available node types. By default, the
   * node types returned in the list are ordered by creation date in ascending
   * order, though this can be modified via the `order_by` field.
   *
   * @param request - The request {@link ListNodeTypesRequest}
   * @returns A Promise of ListNodeTypesResponse
   */
  listNodeTypes = request => enrichForPagination('nodeTypes', this.pageOfListNodeTypes, request);
  pageOfListClusterVersions = request => this.client.fetch({
    method: 'GET',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/cluster-versions`,
    urlParams: urlParams(['include_beta', request.includeBeta], ['include_deprecated', request.includeDeprecated], ['include_disabled', request.includeDisabled], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['version', request.version])
  }, unmarshalListClusterVersionsResponse);

  /**
   * List available Redis™ versions. List the Redis™ database engine versions
   * available. You can define additional parameters for your query, such as
   * `include_disabled`, `include_beta`, `include_deprecated` and `version`.
   *
   * @param request - The request {@link ListClusterVersionsRequest}
   * @returns A Promise of ListClusterVersionsResponse
   */
  listClusterVersions = request => enrichForPagination('versions', this.pageOfListClusterVersions, request);

  /**
   * Get the TLS certificate of a cluster. Retrieve information about the TLS
   * certificate of a Redis™ Database Instance (Redis™ cluster). Details like
   * name and content are returned in the response.
   *
   * @param request - The request {@link GetClusterCertificateRequest}
   * @returns A Promise of Blob
   */
  getClusterCertificate = request => this.client.fetch({
    method: 'GET',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/clusters/${validatePathParam('clusterId', request.clusterId)}/certificate`,
    urlParams: urlParams(['dl', 1]),
    responseType: 'blob'
  });

  /**
   * Renew the TLS certificate of a cluster. Renew a TLS certificate for a
   * Redis™ Database Instance (Redis™ cluster). Renewing a certificate means
   * that you will not be able to connect to your Database Instance using the
   * previous certificate. You will also need to download and update the new
   * certificate for all database clients.
   *
   * @param request - The request {@link RenewClusterCertificateRequest}
   * @returns A Promise of Cluster
   */
  renewClusterCertificate = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$7,
    method: 'POST',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/clusters/${validatePathParam('clusterId', request.clusterId)}/renew-certificate`
  }, unmarshalCluster);

  /**
   * Add advanced settings. Add an advanced setting to a Redis™ Database
   * Instance (Redis™ cluster). You must set the `name` and the `value` of each
   * setting.
   *
   * @param request - The request {@link AddClusterSettingsRequest}
   * @returns A Promise of ClusterSettingsResponse
   */
  addClusterSettings = request => this.client.fetch({
    body: JSON.stringify(marshalAddClusterSettingsRequest(request, this.client.settings)),
    headers: jsonContentHeaders$7,
    method: 'POST',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/clusters/${validatePathParam('clusterId', request.clusterId)}/settings`
  }, unmarshalClusterSettingsResponse);

  /**
   * Delete advanced setting. Delete an advanced setting in a Redis™ Database
   * Instance (Redis™ cluster). You must specify the names of the settings you
   * want to delete in the request body.
   *
   * @param request - The request {@link DeleteClusterSettingRequest}
   * @returns A Promise of Cluster
   */
  deleteClusterSetting = request => this.client.fetch({
    method: 'DELETE',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/clusters/${validatePathParam('clusterId', request.clusterId)}/settings/${validatePathParam('settingName', request.settingName)}`
  }, unmarshalCluster);

  /**
   * Set advanced settings. Update an advanced setting for a Redis™ Database
   * Instance (Redis™ cluster). Settings added upon database engine
   * initalization can only be defined once, and cannot, therefore, be updated.
   *
   * @param request - The request {@link SetClusterSettingsRequest}
   * @returns A Promise of ClusterSettingsResponse
   */
  setClusterSettings = request => this.client.fetch({
    body: JSON.stringify(marshalSetClusterSettingsRequest(request, this.client.settings)),
    headers: jsonContentHeaders$7,
    method: 'PUT',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/clusters/${validatePathParam('clusterId', request.clusterId)}/settings`
  }, unmarshalClusterSettingsResponse);

  /**
   * Set ACL rules for a cluster. Replace all the ACL rules of a Redis™ Database
   * Instance (Redis™ cluster).
   *
   * @param request - The request {@link SetAclRulesRequest}
   * @returns A Promise of SetAclRulesResponse
   */
  setAclRules = request => this.client.fetch({
    body: JSON.stringify(marshalSetAclRulesRequest(request, this.client.settings)),
    headers: jsonContentHeaders$7,
    method: 'PUT',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/clusters/${validatePathParam('clusterId', request.clusterId)}/acls`
  }, unmarshalSetAclRulesResponse);

  /**
   * Add ACL rules for a cluster. Add an additional ACL rule to a Redis™
   * Database Instance (Redis™ cluster).
   *
   * @param request - The request {@link AddAclRulesRequest}
   * @returns A Promise of AddAclRulesResponse
   */
  addAclRules = request => this.client.fetch({
    body: JSON.stringify(marshalAddAclRulesRequest(request, this.client.settings)),
    headers: jsonContentHeaders$7,
    method: 'POST',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/clusters/${validatePathParam('clusterId', request.clusterId)}/acls`
  }, unmarshalAddAclRulesResponse);

  /**
   * Delete an ACL rule for a cluster. Delete an ACL rule of a Redis™ Database
   * Instance (Redis™ cluster). You must specify the `acl_id` of the rule you
   * want to delete in your request.
   *
   * @param request - The request {@link DeleteAclRuleRequest}
   * @returns A Promise of Cluster
   */
  deleteAclRule = request => this.client.fetch({
    method: 'DELETE',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/acls/${validatePathParam('aclId', request.aclId)}`
  }, unmarshalCluster);

  /**
   * Get an ACL rule. Retrieve information about an ACL rule of a Redis™
   * Database Instance (Redis™ cluster). You must specify the `acl_id` of the
   * rule in your request.
   *
   * @param request - The request {@link GetAclRuleRequest}
   * @returns A Promise of ACLRule
   */
  getAclRule = request => this.client.fetch({
    method: 'GET',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/acls/${validatePathParam('aclId', request.aclId)}`
  }, unmarshalACLRule);

  /**
   * Set endpoints for a cluster. Update an endpoint for a Redis™ Database
   * Instance (Redis™ cluster). You must specify the `cluster_id` and the
   * `endpoints` parameters in your request.
   *
   * @param request - The request {@link SetEndpointsRequest}
   * @returns A Promise of SetEndpointsResponse
   */
  setEndpoints = request => this.client.fetch({
    body: JSON.stringify(marshalSetEndpointsRequest(request, this.client.settings)),
    headers: jsonContentHeaders$7,
    method: 'PUT',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/clusters/${validatePathParam('clusterId', request.clusterId)}/endpoints`
  }, unmarshalSetEndpointsResponse);

  /**
   * Add endpoints for a cluster. Add a new endpoint for a Redis™ Database
   * Instance (Redis™ cluster). You can add `private_network` or
   * `public_network` specifications to the body of the request.
   *
   * @param request - The request {@link AddEndpointsRequest}
   * @returns A Promise of AddEndpointsResponse
   */
  addEndpoints = request => this.client.fetch({
    body: JSON.stringify(marshalAddEndpointsRequest(request, this.client.settings)),
    headers: jsonContentHeaders$7,
    method: 'POST',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/clusters/${validatePathParam('clusterId', request.clusterId)}/endpoints`
  }, unmarshalAddEndpointsResponse);

  /**
   * Delete an endpoint for a cluster. Delete the endpoint of a Redis™ Database
   * Instance (Redis™ cluster). You must specify the `region` and `endpoint_id`
   * parameters of the endpoint you want to delete. Note that might need to
   * update any environment configurations that point to the deleted endpoint.
   *
   * @param request - The request {@link DeleteEndpointRequest}
   * @returns A Promise of Cluster
   */
  deleteEndpoint = request => this.client.fetch({
    method: 'DELETE',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/endpoints/${validatePathParam('endpointId', request.endpointId)}`
  }, unmarshalCluster);

  /**
   * Get an endpoint. Retrieve information about a Redis™ Database Instance
   * (Redis™ cluster) endpoint. Full details about the endpoint, like `ips`,
   * `port`, `private_network` and `public_network` specifications are returned
   * in the response.
   *
   * @param request - The request {@link GetEndpointRequest}
   * @returns A Promise of Endpoint
   */
  getEndpoint = request => this.client.fetch({
    method: 'GET',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/endpoints/${validatePathParam('endpointId', request.endpointId)}`
  }, unmarshalEndpoint);

  /**
   * Update an endpoint. Update information about a Redis™ Database Instance
   * (Redis™ cluster) endpoint. Full details about the endpoint, like `ips`,
   * `port`, `private_network` and `public_network` specifications are returned
   * in the response.
   *
   * @param request - The request {@link UpdateEndpointRequest}
   * @returns A Promise of Endpoint
   */
  updateEndpoint = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateEndpointRequest(request, this.client.settings)),
    headers: jsonContentHeaders$7,
    method: 'PATCH',
    path: `/redis/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/endpoints/${validatePathParam('endpointId', request.endpointId)}`
  }, unmarshalEndpoint);
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API$7,
  CLUSTER_TRANSIENT_STATUSES: CLUSTER_TRANSIENT_STATUSES
});

var index$7 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1: index_gen$7
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

/** Lists transient statutes of the enum {@link ImageStatus}. */
const IMAGE_TRANSIENT_STATUSES = ['deleting'];

/** Lists transient statutes of the enum {@link NamespaceStatus}. */
const NAMESPACE_TRANSIENT_STATUSES = ['deleting'];

/** Lists transient statutes of the enum {@link TagStatus}. */
const TAG_TRANSIENT_STATUSES = ['deleting'];

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalImage = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Image' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    id: data.id,
    name: data.name,
    namespaceId: data.namespace_id,
    size: data.size,
    status: data.status,
    statusMessage: data.status_message,
    tags: data.tags,
    updatedAt: unmarshalDate(data.updated_at),
    visibility: data.visibility
  };
};
const unmarshalNamespace = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Namespace' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    description: data.description,
    endpoint: data.endpoint,
    id: data.id,
    imageCount: data.image_count,
    isPublic: data.is_public,
    name: data.name,
    organizationId: data.organization_id,
    projectId: data.project_id,
    region: data.region,
    size: data.size,
    status: data.status,
    statusMessage: data.status_message,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalTag = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Tag' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    digest: data.digest,
    id: data.id,
    imageId: data.image_id,
    name: data.name,
    status: data.status,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalListImagesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListImagesResponse' failed as data isn't a dictionary.`);
  }
  return {
    images: unmarshalArrayOfObject(data.images, unmarshalImage),
    totalCount: data.total_count
  };
};
const unmarshalListNamespacesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListNamespacesResponse' failed as data isn't a dictionary.`);
  }
  return {
    namespaces: unmarshalArrayOfObject(data.namespaces, unmarshalNamespace),
    totalCount: data.total_count
  };
};
const unmarshalListTagsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListTagsResponse' failed as data isn't a dictionary.`);
  }
  return {
    tags: unmarshalArrayOfObject(data.tags, unmarshalTag),
    totalCount: data.total_count
  };
};
const marshalCreateNamespaceRequest = (request, defaults) => ({
  description: request.description,
  is_public: request.isPublic,
  name: request.name || randomName('ns'),
  ...resolveOneOf([{
    default: defaults.defaultProjectId,
    param: 'project_id',
    value: request.projectId
  }, {
    default: defaults.defaultOrganizationId,
    param: 'organization_id',
    value: request.organizationId
  }])
});
const marshalUpdateImageRequest = (request, defaults) => ({
  visibility: request.visibility ?? 'visibility_unknown'
});
const marshalUpdateNamespaceRequest = (request, defaults) => ({
  description: request.description,
  is_public: request.isPublic
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$6 = {
  'Content-Type': 'application/json; charset=utf-8'
};

/** Container Registry API. */
let API$6 = class API extends API$q {
  /** Lists the available regions of the API. */
  static LOCALITIES = ['fr-par', 'nl-ams', 'pl-waw'];
  pageOfListNamespaces = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/registry/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/namespaces`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListNamespacesResponse);

  /**
   * List namespaces. List all namespaces in a specified region. By default, the
   * namespaces listed are ordered by creation date in ascending order. This can
   * be modified via the order_by field. You can also define additional
   * parameters for your query, such as the `instance_id` and `project_id`
   * parameters.
   *
   * @param request - The request {@link ListNamespacesRequest}
   * @returns A Promise of ListNamespacesResponse
   */
  listNamespaces = (request = {}) => enrichForPagination('namespaces', this.pageOfListNamespaces, request);

  /**
   * Get a namespace. Retrieve information about a given namespace, specified by
   * its `namespace_id` and region. Full details about the namespace, such as
   * `description`, `project_id`, `status`, `endpoint`, `is_public`, `size`, and
   * `image_count` are returned in the response.
   *
   * @param request - The request {@link GetNamespaceRequest}
   * @returns A Promise of Namespace
   */
  getNamespace = request => this.client.fetch({
    method: 'GET',
    path: `/registry/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/namespaces/${validatePathParam('namespaceId', request.namespaceId)}`
  }, unmarshalNamespace);

  /**
   * Waits for {@link Namespace} to be in a final state.
   *
   * @param request - The request {@link GetNamespaceRequest}
   * @param options - The waiting options
   * @returns A Promise of Namespace
   */
  waitForNamespace = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!NAMESPACE_TRANSIENT_STATUSES.includes(res.status))), this.getNamespace, request, options);

  /**
   * Create a namespace. Create a new Container Registry namespace. You must
   * specify the namespace name and region in which you want it to be created.
   * Optionally, you can specify the `project_id` and `is_public` in the request
   * payload.
   *
   * @param request - The request {@link CreateNamespaceRequest}
   * @returns A Promise of Namespace
   */
  createNamespace = request => this.client.fetch({
    body: JSON.stringify(marshalCreateNamespaceRequest(request, this.client.settings)),
    headers: jsonContentHeaders$6,
    method: 'POST',
    path: `/registry/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/namespaces`
  }, unmarshalNamespace);

  /**
   * Update a namespace. Update the parameters of a given namespace, specified
   * by its `namespace_id` and `region`. You can update the `description` and
   * `is_public` parameters.
   *
   * @param request - The request {@link UpdateNamespaceRequest}
   * @returns A Promise of Namespace
   */
  updateNamespace = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateNamespaceRequest(request, this.client.settings)),
    headers: jsonContentHeaders$6,
    method: 'PATCH',
    path: `/registry/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/namespaces/${validatePathParam('namespaceId', request.namespaceId)}`
  }, unmarshalNamespace);

  /**
   * Delete a namespace. Delete a given namespace. You must specify, in the
   * endpoint, the `region` and `namespace_id` parameters of the namespace you
   * want to delete.
   *
   * @param request - The request {@link DeleteNamespaceRequest}
   * @returns A Promise of Namespace
   */
  deleteNamespace = request => this.client.fetch({
    method: 'DELETE',
    path: `/registry/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/namespaces/${validatePathParam('namespaceId', request.namespaceId)}`
  }, unmarshalNamespace);
  pageOfListImages = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/registry/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/images`,
    urlParams: urlParams(['name', request.name], ['namespace_id', request.namespaceId], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListImagesResponse);

  /**
   * List images. List all images in a specified region. By default, the images
   * listed are ordered by creation date in ascending order. This can be
   * modified via the order_by field. You can also define additional parameters
   * for your query, such as the `namespace_id` and `project_id` parameters.
   *
   * @param request - The request {@link ListImagesRequest}
   * @returns A Promise of ListImagesResponse
   */
  listImages = (request = {}) => enrichForPagination('images', this.pageOfListImages, request);

  /**
   * Get an image. Retrieve information about a given container image, specified
   * by its `image_id` and region. Full details about the image, such as `name`,
   * `namespace_id`, `status`, `visibility`, and `size` are returned in the
   * response.
   *
   * @param request - The request {@link GetImageRequest}
   * @returns A Promise of Image
   */
  getImage = request => this.client.fetch({
    method: 'GET',
    path: `/registry/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/images/${validatePathParam('imageId', request.imageId)}`
  }, unmarshalImage);

  /**
   * Waits for {@link Image} to be in a final state.
   *
   * @param request - The request {@link GetImageRequest}
   * @param options - The waiting options
   * @returns A Promise of Image
   */
  waitForImage = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!IMAGE_TRANSIENT_STATUSES.includes(res.status))), this.getImage, request, options);

  /**
   * Update an image. Update the parameters of a given image, specified by its
   * `image_id` and `region`. You can update the `visibility` parameter.
   *
   * @param request - The request {@link UpdateImageRequest}
   * @returns A Promise of Image
   */
  updateImage = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateImageRequest(request, this.client.settings)),
    headers: jsonContentHeaders$6,
    method: 'PATCH',
    path: `/registry/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/images/${validatePathParam('imageId', request.imageId)}`
  }, unmarshalImage);

  /**
   * Delete an image. Delete a given image. You must specify, in the endpoint,
   * the `region` and `image_id` parameters of the image you want to delete.
   *
   * @param request - The request {@link DeleteImageRequest}
   * @returns A Promise of Image
   */
  deleteImage = request => this.client.fetch({
    method: 'DELETE',
    path: `/registry/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/images/${validatePathParam('imageId', request.imageId)}`
  }, unmarshalImage);
  pageOfListTags = request => this.client.fetch({
    method: 'GET',
    path: `/registry/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/images/${validatePathParam('imageId', request.imageId)}/tags`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize])
  }, unmarshalListTagsResponse);

  /**
   * List tags. List all tags for a given image, specified by region. By
   * default, the tags listed are ordered by creation date in ascending order.
   * This can be modified via the order_by field. You can also define additional
   * parameters for your query, such as the `name`.
   *
   * @param request - The request {@link ListTagsRequest}
   * @returns A Promise of ListTagsResponse
   */
  listTags = request => enrichForPagination('tags', this.pageOfListTags, request);

  /**
   * Get a tag. Retrieve information about a given image tag, specified by its
   * `tag_id` and region. Full details about the tag, such as `name`,
   * `image_id`, `status`, and `digest` are returned in the response.
   *
   * @param request - The request {@link GetTagRequest}
   * @returns A Promise of Tag
   */
  getTag = request => this.client.fetch({
    method: 'GET',
    path: `/registry/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/tags/${validatePathParam('tagId', request.tagId)}`
  }, unmarshalTag);

  /**
   * Waits for {@link Tag} to be in a final state.
   *
   * @param request - The request {@link GetTagRequest}
   * @param options - The waiting options
   * @returns A Promise of Tag
   */
  waitForTag = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!TAG_TRANSIENT_STATUSES.includes(res.status))), this.getTag, request, options);

  /**
   * Delete a tag. Delete a given image tag. You must specify, in the endpoint,
   * the `region` and `tag_id` parameters of the tag you want to delete.
   *
   * @param request - The request {@link DeleteTagRequest}
   * @returns A Promise of Tag
   */
  deleteTag = request => this.client.fetch({
    method: 'DELETE',
    path: `/registry/v1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/tags/${validatePathParam('tagId', request.tagId)}`,
    urlParams: urlParams(['force', request.force])
  }, unmarshalTag);
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen$6 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API$6,
  IMAGE_TRANSIENT_STATUSES: IMAGE_TRANSIENT_STATUSES,
  NAMESPACE_TRANSIENT_STATUSES: NAMESPACE_TRANSIENT_STATUSES,
  TAG_TRANSIENT_STATUSES: TAG_TRANSIENT_STATUSES
});

var index$6 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1: index_gen$6
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalSecret = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Secret' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    description: data.description,
    id: data.id,
    isManaged: data.is_managed,
    name: data.name,
    projectId: data.project_id,
    region: data.region,
    status: data.status,
    tags: data.tags,
    updatedAt: unmarshalDate(data.updated_at),
    versionCount: data.version_count
  };
};
const unmarshalSecretVersion = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SecretVersion' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    description: data.description,
    isLatest: data.is_latest,
    revision: data.revision,
    secretId: data.secret_id,
    status: data.status,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalAccessSecretVersionResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'AccessSecretVersionResponse' failed as data isn't a dictionary.`);
  }
  return {
    data: data.data,
    dataCrc32: data.data_crc32,
    revision: data.revision,
    secretId: data.secret_id
  };
};
const unmarshalListSecretVersionsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListSecretVersionsResponse' failed as data isn't a dictionary.`);
  }
  return {
    totalCount: data.total_count,
    versions: unmarshalArrayOfObject(data.versions, unmarshalSecretVersion)
  };
};
const unmarshalListSecretsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListSecretsResponse' failed as data isn't a dictionary.`);
  }
  return {
    secrets: unmarshalArrayOfObject(data.secrets, unmarshalSecret),
    totalCount: data.total_count
  };
};
const marshalPasswordGenerationParams = (request, defaults) => ({
  additional_chars: request.additionalChars,
  length: request.length,
  no_digits: request.noDigits,
  no_lowercase_letters: request.noLowercaseLetters,
  no_uppercase_letters: request.noUppercaseLetters
});
const marshalAddSecretOwnerRequest = (request, defaults) => ({
  product_name: request.productName
});
const marshalCreateSecretRequest = (request, defaults) => ({
  description: request.description,
  name: request.name,
  project_id: request.projectId ?? defaults.defaultProjectId,
  tags: request.tags
});
const marshalCreateSecretVersionRequest = (request, defaults) => ({
  data: request.data,
  data_crc32: request.dataCrc32,
  description: request.description,
  disable_previous: request.disablePrevious,
  ...resolveOneOf([{
    param: 'password_generation',
    value: request.passwordGeneration ? marshalPasswordGenerationParams(request.passwordGeneration) : undefined
  }])
});
const marshalUpdateSecretRequest = (request, defaults) => ({
  description: request.description,
  name: request.name,
  tags: request.tags
});
const marshalUpdateSecretVersionRequest = (request, defaults) => ({
  description: request.description
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$5 = {
  'Content-Type': 'application/json; charset=utf-8'
};

/**
 * Secret Manager API.
 *
 * Secret Manager API. This API allows you to conveniently store, access and
 * share sensitive data.
 */
let API$5 = class API extends API$q {
  /** Lists the available regions of the API. */
  static LOCALITIES = ['fr-par'];

  /**
   * Create a secret. You must sepcify the `region` to create a secret.
   *
   * @param request - The request {@link CreateSecretRequest}
   * @returns A Promise of Secret
   */
  createSecret = request => this.client.fetch({
    body: JSON.stringify(marshalCreateSecretRequest(request, this.client.settings)),
    headers: jsonContentHeaders$5,
    method: 'POST',
    path: `/secret-manager/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/secrets`
  }, unmarshalSecret);

  /**
   * Get metadata using the secret's name. Retrieve the metadata of a secret
   * specified by the `region` and the `secret_name` parameters.
   *
   * @param request - The request {@link GetSecretRequest}
   * @returns A Promise of Secret
   */
  getSecret = request => this.client.fetch({
    method: 'GET',
    path: `/secret-manager/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/secrets/${validatePathParam('secretId', request.secretId)}`
  }, unmarshalSecret);

  /**
   * Get metadata using the secret's ID. Retrieve the metadata of a secret
   * specified by the `region` and the `secret_id` parameters.
   *
   * @param request - The request {@link GetSecretByNameRequest}
   * @returns A Promise of Secret
   */
  getSecretByName = request => this.client.fetch({
    method: 'GET',
    path: `/secret-manager/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/secrets-by-name/${validatePathParam('secretName', request.secretName)}`
  }, unmarshalSecret);

  /**
   * Update metadata of a secret. Edit a secret's metadata such as name, tag(s)
   * and description. The secret to update is specified by the `secret_id` and
   * `region` parameters.
   *
   * @param request - The request {@link UpdateSecretRequest}
   * @returns A Promise of Secret
   */
  updateSecret = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateSecretRequest(request, this.client.settings)),
    headers: jsonContentHeaders$5,
    method: 'PATCH',
    path: `/secret-manager/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/secrets/${validatePathParam('secretId', request.secretId)}`
  }, unmarshalSecret);
  pageOfListSecrets = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/secret-manager/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/secrets`,
    urlParams: urlParams(['is_managed', request.isManaged], ['name', request.name], ['order_by', request.orderBy ?? 'name_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId], ['tags', request.tags])
  }, unmarshalListSecretsResponse);

  /**
   * List secrets. Retrieve the list of secrets created within an Organization
   * and/or Project. You must specify either the `organization_id` or the
   * `project_id` and the `region`.
   *
   * @param request - The request {@link ListSecretsRequest}
   * @returns A Promise of ListSecretsResponse
   */
  listSecrets = (request = {}) => enrichForPagination('secrets', this.pageOfListSecrets, request);

  /**
   * Delete a secret. Delete a given secret specified by the `region` and
   * `secret_id` parameters.
   *
   * @param request - The request {@link DeleteSecretRequest}
   */
  deleteSecret = request => this.client.fetch({
    method: 'DELETE',
    path: `/secret-manager/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/secrets/${validatePathParam('secretId', request.secretId)}`
  });

  /**
   * Allow a product to use the secret.
   *
   * @param request - The request {@link AddSecretOwnerRequest}
   */
  addSecretOwner = request => this.client.fetch({
    body: JSON.stringify(marshalAddSecretOwnerRequest(request, this.client.settings)),
    headers: jsonContentHeaders$5,
    method: 'POST',
    path: `/secret-manager/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/secrets/${validatePathParam('secretId', request.secretId)}/add-owner`
  });

  /**
   * Create a version. Create a version of a given secret specified by the
   * `region` and `secret_id` parameters.
   *
   * @param request - The request {@link CreateSecretVersionRequest}
   * @returns A Promise of SecretVersion
   */
  createSecretVersion = request => this.client.fetch({
    body: JSON.stringify(marshalCreateSecretVersionRequest(request, this.client.settings)),
    headers: jsonContentHeaders$5,
    method: 'POST',
    path: `/secret-manager/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/secrets/${validatePathParam('secretId', request.secretId)}/versions`
  }, unmarshalSecretVersion);

  /**
   * Get metadata of a secret's version using the secret's ID. Retrieve the
   * metadata of a secret's given version specified by the `region`, `secret_id`
   * and `revision` parameters.
   *
   * @param request - The request {@link GetSecretVersionRequest}
   * @returns A Promise of SecretVersion
   */
  getSecretVersion = request => this.client.fetch({
    method: 'GET',
    path: `/secret-manager/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/secrets/${validatePathParam('secretId', request.secretId)}/versions/${validatePathParam('revision', request.revision)}`
  }, unmarshalSecretVersion);

  /**
   * Get metadata of a secret's version using the secret's name. Retrieve the
   * metadata of a secret's given version specified by the `region`,
   * `secret_name` and `revision` parameters.
   *
   * @param request - The request {@link GetSecretVersionByNameRequest}
   * @returns A Promise of SecretVersion
   */
  getSecretVersionByName = request => this.client.fetch({
    method: 'GET',
    path: `/secret-manager/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/secrets-by-name/${validatePathParam('secretName', request.secretName)}/versions/${validatePathParam('revision', request.revision)}`
  }, unmarshalSecretVersion);

  /**
   * Update metadata of a version. Edit the metadata of a secret's given
   * version, specified by the `region`, `secret_id` and `revision` parameters.
   *
   * @param request - The request {@link UpdateSecretVersionRequest}
   * @returns A Promise of SecretVersion
   */
  updateSecretVersion = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateSecretVersionRequest(request, this.client.settings)),
    headers: jsonContentHeaders$5,
    method: 'PATCH',
    path: `/secret-manager/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/secrets/${validatePathParam('secretId', request.secretId)}/versions/${validatePathParam('revision', request.revision)}`
  }, unmarshalSecretVersion);
  pageOfListSecretVersions = request => this.client.fetch({
    method: 'GET',
    path: `/secret-manager/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/secrets/${validatePathParam('secretId', request.secretId)}/versions`,
    urlParams: urlParams(['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['status', request.status])
  }, unmarshalListSecretVersionsResponse);

  /**
   * List versions of a secret using the secret's ID. Retrieve the list of a
   * given secret's versions specified by the `secret_id` and `region`
   * parameters.
   *
   * @param request - The request {@link ListSecretVersionsRequest}
   * @returns A Promise of ListSecretVersionsResponse
   */
  listSecretVersions = request => enrichForPagination('versions', this.pageOfListSecretVersions, request);
  pageOfListSecretVersionsByName = request => this.client.fetch({
    method: 'GET',
    path: `/secret-manager/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/secrets-by-name/${validatePathParam('secretName', request.secretName)}/versions`,
    urlParams: urlParams(['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['status', request.status])
  }, unmarshalListSecretVersionsResponse);

  /**
   * List versions of a secret using the secret's name. Retrieve the list of a
   * given secret's versions specified by the `secret_name` and `region`
   * parameters.
   *
   * @param request - The request {@link ListSecretVersionsByNameRequest}
   * @returns A Promise of ListSecretVersionsResponse
   */
  listSecretVersionsByName = request => enrichForPagination('versions', this.pageOfListSecretVersionsByName, request);

  /**
   * Enable a version. Make a specific version accessible. You must specify the
   * `region`, `secret_id` and `revision` parameters.
   *
   * @param request - The request {@link EnableSecretVersionRequest}
   * @returns A Promise of SecretVersion
   */
  enableSecretVersion = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$5,
    method: 'POST',
    path: `/secret-manager/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/secrets/${validatePathParam('secretId', request.secretId)}/versions/${validatePathParam('revision', request.revision)}/enable`
  }, unmarshalSecretVersion);

  /**
   * Disable a version. Make a specific version inaccessible. You must specify
   * the `region`, `secret_id` and `revision` parameters.
   *
   * @param request - The request {@link DisableSecretVersionRequest}
   * @returns A Promise of SecretVersion
   */
  disableSecretVersion = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$5,
    method: 'POST',
    path: `/secret-manager/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/secrets/${validatePathParam('secretId', request.secretId)}/versions/${validatePathParam('revision', request.revision)}/disable`
  }, unmarshalSecretVersion);

  /**
   * Access a secret's version using the secret's ID. Access sensitive data in a
   * secret's version specified by the `region`, `secret_id` and `revision`
   * parameters.
   *
   * @param request - The request {@link AccessSecretVersionRequest}
   * @returns A Promise of AccessSecretVersionResponse
   */
  accessSecretVersion = request => this.client.fetch({
    method: 'GET',
    path: `/secret-manager/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/secrets/${validatePathParam('secretId', request.secretId)}/versions/${validatePathParam('revision', request.revision)}/access`
  }, unmarshalAccessSecretVersionResponse);

  /**
   * Access a secret's version using the secret's name. Access sensitive data in
   * a secret's version specified by the `region`, `secret_name` and `revision`
   * parameters.
   *
   * @param request - The request {@link AccessSecretVersionByNameRequest}
   * @returns A Promise of AccessSecretVersionResponse
   */
  accessSecretVersionByName = request => this.client.fetch({
    method: 'GET',
    path: `/secret-manager/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/secrets-by-name/${validatePathParam('secretName', request.secretName)}/versions/${validatePathParam('revision', request.revision)}/access`
  }, unmarshalAccessSecretVersionResponse);

  /**
   * Delete a version. Delete a secret's version and the sensitive data
   * contained in it. Deleting a version is permanent and cannot be undone.
   *
   * @param request - The request {@link DestroySecretVersionRequest}
   * @returns A Promise of SecretVersion
   */
  destroySecretVersion = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$5,
    method: 'POST',
    path: `/secret-manager/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/secrets/${validatePathParam('secretId', request.secretId)}/versions/${validatePathParam('revision', request.revision)}/destroy`
  }, unmarshalSecretVersion);
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API$5
});

var index$5 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1alpha1: index_gen$5
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

/** Lists transient statutes of the enum {@link HumanStatus}. */
const HUMAN_TRANSIENT_STATUSES = ['running'];

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalHuman = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Human' failed as data isn't a dictionary.`);
  }
  return {
    altitudeInMeter: data.altitude_in_meter,
    altitudeInMillimeter: data.altitude_in_millimeter,
    createdAt: unmarshalDate(data.created_at),
    eyesColor: data.eyes_color,
    fingersCount: data.fingers_count,
    hairCount: data.hair_count,
    height: data.height,
    id: data.id,
    isHappy: data.is_happy,
    name: data.name,
    organizationId: data.organization_id,
    projectId: data.project_id,
    shoeSize: data.shoe_size,
    status: data.status,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalListHumansResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListHumansResponse' failed as data isn't a dictionary.`);
  }
  return {
    humans: unmarshalArrayOfObject(data.humans, unmarshalHuman),
    totalCount: data.total_count
  };
};
const unmarshalRegisterResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'RegisterResponse' failed as data isn't a dictionary.`);
  }
  return {
    accessKey: data.access_key,
    secretKey: data.secret_key
  };
};
const marshalCreateHumanRequest = (request, defaults) => ({
  altitude_in_meter: request.altitudeInMeter,
  altitude_in_millimeter: request.altitudeInMillimeter,
  eyes_color: request.eyesColor ?? 'unknown',
  fingers_count: request.fingersCount,
  hair_count: request.hairCount,
  height: request.height,
  is_happy: request.isHappy,
  name: request.name,
  shoe_size: request.shoeSize,
  ...resolveOneOf([{
    default: defaults.defaultProjectId,
    param: 'project_id',
    value: request.projectId
  }, {
    default: defaults.defaultOrganizationId,
    param: 'organization_id',
    value: request.organizationId
  }])
});
const marshalRegisterRequest = (request, defaults) => ({
  username: request.username
});
const marshalUpdateHumanRequest = (request, defaults) => ({
  altitude_in_meter: request.altitudeInMeter,
  altitude_in_millimeter: request.altitudeInMillimeter,
  eyes_color: request.eyesColor ?? 'unknown',
  fingers_count: request.fingersCount,
  hair_count: request.hairCount,
  height: request.height,
  is_happy: request.isHappy,
  name: request.name,
  shoe_size: request.shoeSize
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$4 = {
  'Content-Type': 'application/json; charset=utf-8'
};

/**
 * Fake API.
 *
 * No Auth Service for end-to-end testing. Test is a fake service that aim to
 * manage fake humans. It is used for internal and public end-to-end tests.
 *
 * This service don't use the Scaleway authentication service but a fake one. It
 * allows to use this test service publicly without requiring a Scaleway
 * account.
 *
 * First, you need to register a user with `scw test human register` to get an
 * access-key. Then, you can use other test commands by setting the
 * SCW_SECRET_KEY env variable.
 */
let API$4 = class API extends API$q {
  /**
   * Register a user. Register a human and return a access-key and a secret-key
   * that must be used in all other commands.
   *
   * Hint: you can use other test commands by setting the SCW_SECRET_KEY env
   * variable.
   *
   * @param request - The request {@link RegisterRequest}
   * @returns A Promise of RegisterResponse
   */
  register = request => this.client.fetch({
    body: JSON.stringify(marshalRegisterRequest(request, this.client.settings)),
    headers: jsonContentHeaders$4,
    method: 'POST',
    path: `/test/v1/register`
  }, unmarshalRegisterResponse);
  pageOfListHumans = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/test/v1/humans`,
    urlParams: urlParams(['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListHumansResponse);

  /**
   * List all your humans.
   *
   * @param request - The request {@link ListHumansRequest}
   * @returns A Promise of ListHumansResponse
   */
  listHumans = (request = {}) => enrichForPagination('humans', this.pageOfListHumans, request);

  /**
   * Get human details. Get the human details associated with the given id.
   *
   * @param request - The request {@link GetHumanRequest}
   * @returns A Promise of Human
   */
  getHuman = request => this.client.fetch({
    method: 'GET',
    path: `/test/v1/humans/${validatePathParam('humanId', request.humanId)}`
  }, unmarshalHuman);

  /**
   * Waits for {@link Human} to be in a final state.
   *
   * @param request - The request {@link GetHumanRequest}
   * @param options - The waiting options
   * @returns A Promise of Human
   */
  waitForHuman = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!HUMAN_TRANSIENT_STATUSES.includes(res.status))), this.getHuman, request, options);

  /**
   * Create a new human.
   *
   * @param request - The request {@link CreateHumanRequest}
   * @returns A Promise of Human
   */
  createHuman = request => this.client.fetch({
    body: JSON.stringify(marshalCreateHumanRequest(request, this.client.settings)),
    headers: jsonContentHeaders$4,
    method: 'POST',
    path: `/test/v1/humans`
  }, unmarshalHuman);

  /**
   * Update an existing human. Update the human associated with the given id.
   *
   * @param request - The request {@link UpdateHumanRequest}
   * @returns A Promise of Human
   */
  updateHuman = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateHumanRequest(request, this.client.settings)),
    headers: jsonContentHeaders$4,
    method: 'PATCH',
    path: `/test/v1/humans/${validatePathParam('humanId', request.humanId)}`
  }, unmarshalHuman);

  /**
   * Delete an existing human. Delete the human associated with the given id.
   *
   * @param request - The request {@link DeleteHumanRequest}
   * @returns A Promise of Human
   */
  deleteHuman = request => this.client.fetch({
    method: 'DELETE',
    path: `/test/v1/humans/${validatePathParam('humanId', request.humanId)}`
  }, unmarshalHuman);

  /**
   * Start a 1h running for the given human. Start a one hour running for the
   * given human.
   *
   * @param request - The request {@link RunHumanRequest}
   * @returns A Promise of Human
   */
  runHuman = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$4,
    method: 'POST',
    path: `/test/v1/humans/${validatePathParam('humanId', request.humanId)}/run`
  }, unmarshalHuman);

  /**
   * Make a human smoke.
   *
   * @deprecated
   * @param request - The request {@link SmokeHumanRequest}
   * @returns A Promise of Human
   */
  smokeHuman = (request = {}) => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$4,
    method: 'POST',
    path: `/test/v1/humans/${validatePathParam('humanId', request.humanId)}/smoke`
  }, unmarshalHuman);
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen$4 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API$4,
  HUMAN_TRANSIENT_STATUSES: HUMAN_TRANSIENT_STATUSES
});

var index$4 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1: index_gen$4
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

/** Lists transient statutes of the enum {@link DomainStatus}. */
const DOMAIN_TRANSIENT_STATUSES = ['pending'];

/** Lists transient statutes of the enum {@link EmailStatus}. */
const EMAIL_TRANSIENT_STATUSES = ['new', 'sending'];

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalDomainStatistics = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DomainStatistics' failed as data isn't a dictionary.`);
  }
  return {
    canceledCount: data.canceled_count,
    failedCount: data.failed_count,
    sentCount: data.sent_count,
    totalCount: data.total_count
  };
};
const unmarshalEmailTry = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'EmailTry' failed as data isn't a dictionary.`);
  }
  return {
    code: data.code,
    message: data.message,
    rank: data.rank,
    triedAt: unmarshalDate(data.tried_at)
  };
};
const unmarshalDomain = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Domain' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    dkimConfig: data.dkim_config,
    id: data.id,
    lastError: data.last_error,
    lastValidAt: unmarshalDate(data.last_valid_at),
    name: data.name,
    nextCheckAt: unmarshalDate(data.next_check_at),
    organizationId: data.organization_id,
    projectId: data.project_id,
    region: data.region,
    revokedAt: unmarshalDate(data.revoked_at),
    spfConfig: data.spf_config,
    statistics: data.statistics ? unmarshalDomainStatistics(data.statistics) : undefined,
    status: data.status
  };
};
const unmarshalEmail = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Email' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    id: data.id,
    lastTries: unmarshalArrayOfObject(data.last_tries, unmarshalEmailTry),
    mailFrom: data.mail_from,
    messageId: data.message_id,
    projectId: data.project_id,
    rcptTo: data.rcpt_to,
    rcptType: data.rcpt_type,
    status: data.status,
    statusDetails: data.status_details,
    subject: data.subject,
    tryCount: data.try_count,
    updatedAt: unmarshalDate(data.updated_at)
  };
};
const unmarshalCreateEmailResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'CreateEmailResponse' failed as data isn't a dictionary.`);
  }
  return {
    emails: unmarshalArrayOfObject(data.emails, unmarshalEmail)
  };
};
const unmarshalListDomainsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListDomainsResponse' failed as data isn't a dictionary.`);
  }
  return {
    domains: unmarshalArrayOfObject(data.domains, unmarshalDomain),
    totalCount: data.total_count
  };
};
const unmarshalListEmailsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListEmailsResponse' failed as data isn't a dictionary.`);
  }
  return {
    emails: unmarshalArrayOfObject(data.emails, unmarshalEmail),
    totalCount: data.total_count
  };
};
const unmarshalStatistics = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Statistics' failed as data isn't a dictionary.`);
  }
  return {
    canceledCount: data.canceled_count,
    failedCount: data.failed_count,
    newCount: data.new_count,
    sendingCount: data.sending_count,
    sentCount: data.sent_count,
    totalCount: data.total_count
  };
};
const marshalCreateEmailRequestAddress = (request, defaults) => ({
  email: request.email,
  name: request.name
});
const marshalCreateEmailRequestAttachment = (request, defaults) => ({
  content: request.content,
  name: request.name,
  type: request.type
});
const marshalCreateDomainRequest = (request, defaults) => ({
  accept_tos: request.acceptTos,
  domain_name: request.domainName,
  project_id: request.projectId ?? defaults.defaultProjectId
});
const marshalCreateEmailRequest = (request, defaults) => ({
  attachments: request.attachments ? request.attachments.map(elt => marshalCreateEmailRequestAttachment(elt)) : undefined,
  bcc: request.bcc ? request.bcc.map(elt => marshalCreateEmailRequestAddress(elt)) : undefined,
  cc: request.cc ? request.cc.map(elt => marshalCreateEmailRequestAddress(elt)) : undefined,
  from: request.from ? marshalCreateEmailRequestAddress(request.from) : undefined,
  html: request.html,
  project_id: request.projectId ?? defaults.defaultProjectId,
  send_before: request.sendBefore,
  subject: request.subject,
  text: request.text,
  to: request.to ? request.to.map(elt => marshalCreateEmailRequestAddress(elt)) : undefined
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$3 = {
  'Content-Type': 'application/json; charset=utf-8'
};

/** Transactional Email API. */
let API$3 = class API extends API$q {
  /** Lists the available regions of the API. */
  static LOCALITIES = ['fr-par'];

  /**
   * Send an email. You must specify the `region`, the sender and the
   * recipient's information and the `project_id` to send an email from a
   * checked domain. The subject of the email must contain at least 6
   * characters.
   *
   * @param request - The request {@link CreateEmailRequest}
   * @returns A Promise of CreateEmailResponse
   */
  createEmail = request => this.client.fetch({
    body: JSON.stringify(marshalCreateEmailRequest(request, this.client.settings)),
    headers: jsonContentHeaders$3,
    method: 'POST',
    path: `/transactional-email/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/emails`
  }, unmarshalCreateEmailResponse);

  /**
   * Get an email. Retrieve information about a specific email using the
   * `email_id` and `region` parameters.
   *
   * @param request - The request {@link GetEmailRequest}
   * @returns A Promise of Email
   */
  getEmail = request => this.client.fetch({
    method: 'GET',
    path: `/transactional-email/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/emails/${validatePathParam('emailId', request.emailId)}`
  }, unmarshalEmail);

  /**
   * Waits for {@link Email} to be in a final state.
   *
   * @param request - The request {@link GetEmailRequest}
   * @param options - The waiting options
   * @returns A Promise of Email
   */
  waitForEmail = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!EMAIL_TRANSIENT_STATUSES.includes(res.status))), this.getEmail, request, options);
  pageOfListEmails = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/transactional-email/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/emails`,
    urlParams: urlParams(['domain_id', request.domainId], ['mail_from', request.mailFrom], ['mail_to', request.mailTo], ['message_id', request.messageId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId], ['since', request.since], ['statuses', request.statuses], ['subject', request.subject], ['until', request.until])
  }, unmarshalListEmailsResponse);

  /**
   * List emails. Retrieve the list of emails sent from a specific domain or for
   * a specific Project or Organization. You must specify the `region`.
   *
   * @param request - The request {@link ListEmailsRequest}
   * @returns A Promise of ListEmailsResponse
   */
  listEmails = (request = {}) => enrichForPagination('emails', this.pageOfListEmails, request);

  /**
   * Email statuses. Get information on your emails' statuses.
   *
   * @param request - The request {@link GetStatisticsRequest}
   * @returns A Promise of Statistics
   */
  getStatistics = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/transactional-email/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/statistics`,
    urlParams: urlParams(['domain_id', request.domainId], ['mail_from', request.mailFrom], ['project_id', request.projectId], ['since', request.since], ['until', request.until])
  }, unmarshalStatistics);

  /**
   * Cancel an email. You can cancel the sending of an email if it has not been
   * sent yet. You must specify the `region` and the `email_id` of the email you
   * want to cancel.
   *
   * @param request - The request {@link CancelEmailRequest}
   * @returns A Promise of Email
   */
  cancelEmail = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$3,
    method: 'POST',
    path: `/transactional-email/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/emails/${validatePathParam('emailId', request.emailId)}/cancel`
  }, unmarshalEmail);

  /**
   * Register a domain in a project. You must specify the `region`, `project_id`
   * and `domain_name` to register a domain in a specific Project.
   *
   * @param request - The request {@link CreateDomainRequest}
   * @returns A Promise of Domain
   */
  createDomain = request => this.client.fetch({
    body: JSON.stringify(marshalCreateDomainRequest(request, this.client.settings)),
    headers: jsonContentHeaders$3,
    method: 'POST',
    path: `/transactional-email/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/domains`
  }, unmarshalDomain);

  /**
   * Get information about a domain. Retrieve information about a specific
   * domain using the `region` and `domain_id` parameters.
   *
   * @param request - The request {@link GetDomainRequest}
   * @returns A Promise of Domain
   */
  getDomain = request => this.client.fetch({
    method: 'GET',
    path: `/transactional-email/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/domains/${validatePathParam('domainId', request.domainId)}`
  }, unmarshalDomain);

  /**
   * Waits for {@link Domain} to be in a final state.
   *
   * @param request - The request {@link GetDomainRequest}
   * @param options - The waiting options
   * @returns A Promise of Domain
   */
  waitForDomain = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!DOMAIN_TRANSIENT_STATUSES.includes(res.status))), this.getDomain, request, options);
  pageOfListDomains = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/transactional-email/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/domains`,
    urlParams: urlParams(['name', request.name], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId], ['status', request.status])
  }, unmarshalListDomainsResponse);

  /**
   * List domains. Retrieve domains in a specific project or in a specific
   * Organization using the `region` parameter.
   *
   * @param request - The request {@link ListDomainsRequest}
   * @returns A Promise of ListDomainsResponse
   */
  listDomains = (request = {}) => enrichForPagination('domains', this.pageOfListDomains, request);

  /**
   * Delete a domain. You must specify the domain you want to delete by the
   * `region` and `domain_id`. Deleting a domain is permanent and cannot be
   * undone.
   *
   * @param request - The request {@link RevokeDomainRequest}
   * @returns A Promise of Domain
   */
  revokeDomain = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$3,
    method: 'POST',
    path: `/transactional-email/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/domains/${validatePathParam('domainId', request.domainId)}/revoke`
  }, unmarshalDomain);

  /**
   * Domain DNS check. Perform an immediate DNS check of a domain using the
   * `region` and `domain_id` parameters.
   *
   * @param request - The request {@link CheckDomainRequest}
   * @returns A Promise of Domain
   */
  checkDomain = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$3,
    method: 'POST',
    path: `/transactional-email/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/domains/${validatePathParam('domainId', request.domainId)}/check`
  }, unmarshalDomain);
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API$3,
  DOMAIN_TRANSIENT_STATUSES: DOMAIN_TRANSIENT_STATUSES,
  EMAIL_TRANSIENT_STATUSES: EMAIL_TRANSIENT_STATUSES
});

var index$3 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1alpha1: index_gen$3
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalPrivateNetwork = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'PrivateNetwork' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    id: data.id,
    name: data.name,
    organizationId: data.organization_id,
    projectId: data.project_id,
    subnets: data.subnets,
    tags: data.tags,
    updatedAt: unmarshalDate(data.updated_at),
    zone: data.zone
  };
};
const unmarshalListPrivateNetworksResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListPrivateNetworksResponse' failed as data isn't a dictionary.`);
  }
  return {
    privateNetworks: unmarshalArrayOfObject(data.private_networks, unmarshalPrivateNetwork),
    totalCount: data.total_count
  };
};
const marshalCreatePrivateNetworkRequest = (request, defaults) => ({
  name: request.name || randomName('pn'),
  project_id: request.projectId ?? defaults.defaultProjectId,
  subnets: request.subnets,
  tags: request.tags
});
const marshalUpdatePrivateNetworkRequest = (request, defaults) => ({
  name: request.name,
  subnets: request.subnets,
  tags: request.tags
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$2 = {
  'Content-Type': 'application/json; charset=utf-8'
};

/** VPC API. */
let API$2 = class API extends API$q {
  /** Lists the available zones of the API. */
  static LOCALITIES = ['fr-par-1', 'fr-par-2', 'fr-par-3', 'nl-ams-1', 'nl-ams-2', 'pl-waw-1', 'pl-waw-2'];
  pageOfListPrivateNetworks = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/vpc/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/private-networks`,
    urlParams: urlParams(['include_regional', request.includeRegional], ['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['private_network_ids', request.privateNetworkIds], ['project_id', request.projectId], ['tags', request.tags])
  }, unmarshalListPrivateNetworksResponse);

  /**
   * List Private Networks. List existing Private Networks in a specified
   * Availability Zone. By default, the Private Networks returned in the list
   * are ordered by creation date in ascending order, though this can be
   * modified via the order_by field.
   *
   * @param request - The request {@link ListPrivateNetworksRequest}
   * @returns A Promise of ListPrivateNetworksResponse
   */
  listPrivateNetworks = (request = {}) => enrichForPagination('privateNetworks', this.pageOfListPrivateNetworks, request);

  /**
   * Create a Private Network. Create a new Private Network. Once created, you
   * can attach Scaleway resources in the same Availability Zone.
   *
   * @param request - The request {@link CreatePrivateNetworkRequest}
   * @returns A Promise of PrivateNetwork
   */
  createPrivateNetwork = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalCreatePrivateNetworkRequest(request, this.client.settings)),
    headers: jsonContentHeaders$2,
    method: 'POST',
    path: `/vpc/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/private-networks`
  }, unmarshalPrivateNetwork);

  /**
   * Get a Private Network. Retrieve information about an existing Private
   * Network, specified by its Private Network ID. Its full details are returned
   * in the response object.
   *
   * @param request - The request {@link GetPrivateNetworkRequest}
   * @returns A Promise of PrivateNetwork
   */
  getPrivateNetwork = request => this.client.fetch({
    method: 'GET',
    path: `/vpc/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/private-networks/${validatePathParam('privateNetworkId', request.privateNetworkId)}`
  }, unmarshalPrivateNetwork);

  /**
   * Update Private Network. Update parameters (such as name or tags) of an
   * existing Private Network, specified by its Private Network ID.
   *
   * @param request - The request {@link UpdatePrivateNetworkRequest}
   * @returns A Promise of PrivateNetwork
   */
  updatePrivateNetwork = request => this.client.fetch({
    body: JSON.stringify(marshalUpdatePrivateNetworkRequest(request, this.client.settings)),
    headers: jsonContentHeaders$2,
    method: 'PATCH',
    path: `/vpc/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/private-networks/${validatePathParam('privateNetworkId', request.privateNetworkId)}`
  }, unmarshalPrivateNetwork);

  /**
   * Delete a Private Network. Delete an existing Private Network. Note that you
   * must first detach all resources from the network, in order to delete it.
   *
   * @param request - The request {@link DeletePrivateNetworkRequest}
   */
  deletePrivateNetwork = request => this.client.fetch({
    method: 'DELETE',
    path: `/vpc/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/private-networks/${validatePathParam('privateNetworkId', request.privateNetworkId)}`
  });
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API$2
});

var index$2 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1: index_gen$2
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

/** Lists transient statutes of the enum {@link GatewayNetworkStatus}. */
const GATEWAY_NETWORK_TRANSIENT_STATUSES = ['attaching', 'configuring', 'detaching'];

/** Lists transient statutes of the enum {@link GatewayStatus}. */
const GATEWAY_TRANSIENT_STATUSES = ['allocating', 'configuring', 'stopping', 'deleting'];

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalDHCP = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DHCP' failed as data isn't a dictionary.`);
  }
  return {
    address: data.address,
    createdAt: unmarshalDate(data.created_at),
    dnsLocalName: data.dns_local_name,
    dnsSearch: data.dns_search,
    dnsServersOverride: data.dns_servers_override,
    enableDynamic: data.enable_dynamic,
    id: data.id,
    organizationId: data.organization_id,
    poolHigh: data.pool_high,
    poolLow: data.pool_low,
    projectId: data.project_id,
    pushDefaultRoute: data.push_default_route,
    pushDnsServer: data.push_dns_server,
    rebindTimer: data.rebind_timer,
    renewTimer: data.renew_timer,
    subnet: data.subnet,
    updatedAt: unmarshalDate(data.updated_at),
    validLifetime: data.valid_lifetime,
    zone: data.zone
  };
};
const unmarshalGatewayNetwork = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GatewayNetwork' failed as data isn't a dictionary.`);
  }
  return {
    address: data.address,
    createdAt: unmarshalDate(data.created_at),
    dhcp: data.dhcp ? unmarshalDHCP(data.dhcp) : undefined,
    enableDhcp: data.enable_dhcp,
    enableMasquerade: data.enable_masquerade,
    gatewayId: data.gateway_id,
    id: data.id,
    macAddress: data.mac_address,
    privateNetworkId: data.private_network_id,
    status: data.status,
    updatedAt: unmarshalDate(data.updated_at),
    zone: data.zone
  };
};
const unmarshalGatewayType = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'GatewayType' failed as data isn't a dictionary.`);
  }
  return {
    bandwidth: data.bandwidth,
    name: data.name,
    zone: data.zone
  };
};
const unmarshalIP = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'IP' failed as data isn't a dictionary.`);
  }
  return {
    address: data.address,
    createdAt: unmarshalDate(data.created_at),
    gatewayId: data.gateway_id,
    id: data.id,
    organizationId: data.organization_id,
    projectId: data.project_id,
    reverse: data.reverse,
    tags: data.tags,
    updatedAt: unmarshalDate(data.updated_at),
    zone: data.zone
  };
};
const unmarshalDHCPEntry = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DHCPEntry' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    gatewayNetworkId: data.gateway_network_id,
    hostname: data.hostname,
    id: data.id,
    ipAddress: data.ip_address,
    macAddress: data.mac_address,
    type: data.type,
    updatedAt: unmarshalDate(data.updated_at),
    zone: data.zone
  };
};
const unmarshalGateway = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Gateway' failed as data isn't a dictionary.`);
  }
  return {
    bastionEnabled: data.bastion_enabled,
    bastionPort: data.bastion_port,
    canUpgradeTo: data.can_upgrade_to,
    createdAt: unmarshalDate(data.created_at),
    gatewayNetworks: unmarshalArrayOfObject(data.gateway_networks, unmarshalGatewayNetwork),
    id: data.id,
    ip: data.ip ? unmarshalIP(data.ip) : undefined,
    name: data.name,
    organizationId: data.organization_id,
    projectId: data.project_id,
    smtpEnabled: data.smtp_enabled,
    status: data.status,
    tags: data.tags,
    type: data.type ? unmarshalGatewayType(data.type) : undefined,
    updatedAt: unmarshalDate(data.updated_at),
    upstreamDnsServers: data.upstream_dns_servers,
    version: data.version,
    zone: data.zone
  };
};
const unmarshalPATRule = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'PATRule' failed as data isn't a dictionary.`);
  }
  return {
    createdAt: unmarshalDate(data.created_at),
    gatewayId: data.gateway_id,
    id: data.id,
    privateIp: data.private_ip,
    privatePort: data.private_port,
    protocol: data.protocol,
    publicPort: data.public_port,
    updatedAt: unmarshalDate(data.updated_at),
    zone: data.zone
  };
};
const unmarshalListDHCPEntriesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListDHCPEntriesResponse' failed as data isn't a dictionary.`);
  }
  return {
    dhcpEntries: unmarshalArrayOfObject(data.dhcp_entries, unmarshalDHCPEntry),
    totalCount: data.total_count
  };
};
const unmarshalListDHCPsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListDHCPsResponse' failed as data isn't a dictionary.`);
  }
  return {
    dhcps: unmarshalArrayOfObject(data.dhcps, unmarshalDHCP),
    totalCount: data.total_count
  };
};
const unmarshalListGatewayNetworksResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListGatewayNetworksResponse' failed as data isn't a dictionary.`);
  }
  return {
    gatewayNetworks: unmarshalArrayOfObject(data.gateway_networks, unmarshalGatewayNetwork),
    totalCount: data.total_count
  };
};
const unmarshalListGatewayTypesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListGatewayTypesResponse' failed as data isn't a dictionary.`);
  }
  return {
    types: unmarshalArrayOfObject(data.types, unmarshalGatewayType)
  };
};
const unmarshalListGatewaysResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListGatewaysResponse' failed as data isn't a dictionary.`);
  }
  return {
    gateways: unmarshalArrayOfObject(data.gateways, unmarshalGateway),
    totalCount: data.total_count
  };
};
const unmarshalListIPsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListIPsResponse' failed as data isn't a dictionary.`);
  }
  return {
    ips: unmarshalArrayOfObject(data.ips, unmarshalIP),
    totalCount: data.total_count
  };
};
const unmarshalListPATRulesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListPATRulesResponse' failed as data isn't a dictionary.`);
  }
  return {
    patRules: unmarshalArrayOfObject(data.pat_rules, unmarshalPATRule),
    totalCount: data.total_count
  };
};
const unmarshalSetDHCPEntriesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SetDHCPEntriesResponse' failed as data isn't a dictionary.`);
  }
  return {
    dhcpEntries: unmarshalArrayOfObject(data.dhcp_entries, unmarshalDHCPEntry)
  };
};
const unmarshalSetPATRulesResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'SetPATRulesResponse' failed as data isn't a dictionary.`);
  }
  return {
    patRules: unmarshalArrayOfObject(data.pat_rules, unmarshalPATRule)
  };
};
const marshalCreateDHCPRequest = (request, defaults) => ({
  address: request.address,
  dns_local_name: request.dnsLocalName,
  dns_search: request.dnsSearch,
  dns_servers_override: request.dnsServersOverride,
  enable_dynamic: request.enableDynamic,
  pool_high: request.poolHigh,
  pool_low: request.poolLow,
  project_id: request.projectId ?? defaults.defaultProjectId,
  push_default_route: request.pushDefaultRoute,
  push_dns_server: request.pushDnsServer,
  rebind_timer: request.rebindTimer,
  renew_timer: request.renewTimer,
  subnet: request.subnet,
  valid_lifetime: request.validLifetime
});
const marshalSetDHCPEntriesRequestEntry = (request, defaults) => ({
  ip_address: request.ipAddress,
  mac_address: request.macAddress
});
const marshalSetPATRulesRequestRule = (request, defaults) => ({
  private_ip: request.privateIp,
  private_port: request.privatePort,
  protocol: request.protocol,
  public_port: request.publicPort
});
const marshalCreateDHCPEntryRequest = (request, defaults) => ({
  gateway_network_id: request.gatewayNetworkId,
  ip_address: request.ipAddress,
  mac_address: request.macAddress
});
const marshalCreateGatewayNetworkRequest = (request, defaults) => ({
  enable_dhcp: request.enableDhcp,
  enable_masquerade: request.enableMasquerade,
  gateway_id: request.gatewayId,
  private_network_id: request.privateNetworkId,
  ...resolveOneOf([{
    param: 'dhcp_id',
    value: request.dhcpId
  }, {
    param: 'dhcp',
    value: request.dhcp ? marshalCreateDHCPRequest(request.dhcp, defaults) : undefined
  }, {
    param: 'address',
    value: request.address
  }])
});
const marshalCreateGatewayRequest = (request, defaults) => ({
  bastion_port: request.bastionPort,
  enable_bastion: request.enableBastion,
  enable_smtp: request.enableSmtp,
  ip_id: request.ipId,
  name: request.name || randomName('gw'),
  project_id: request.projectId ?? defaults.defaultProjectId,
  tags: request.tags,
  type: request.type,
  upstream_dns_servers: request.upstreamDnsServers
});
const marshalCreateIPRequest = (request, defaults) => ({
  project_id: request.projectId ?? defaults.defaultProjectId,
  tags: request.tags
});
const marshalCreatePATRuleRequest = (request, defaults) => ({
  gateway_id: request.gatewayId,
  private_ip: request.privateIp,
  private_port: request.privatePort,
  protocol: request.protocol ?? 'unknown',
  public_port: request.publicPort
});
const marshalSetDHCPEntriesRequest = (request, defaults) => ({
  dhcp_entries: request.dhcpEntries ? request.dhcpEntries.map(elt => marshalSetDHCPEntriesRequestEntry(elt)) : undefined,
  gateway_network_id: request.gatewayNetworkId
});
const marshalSetPATRulesRequest = (request, defaults) => ({
  gateway_id: request.gatewayId,
  pat_rules: request.patRules.map(elt => marshalSetPATRulesRequestRule(elt))
});
const marshalUpdateDHCPEntryRequest = (request, defaults) => ({
  ip_address: request.ipAddress
});
const marshalUpdateDHCPRequest = (request, defaults) => ({
  address: request.address,
  dns_local_name: request.dnsLocalName,
  dns_search: request.dnsSearch,
  dns_servers_override: request.dnsServersOverride,
  enable_dynamic: request.enableDynamic,
  pool_high: request.poolHigh,
  pool_low: request.poolLow,
  push_default_route: request.pushDefaultRoute,
  push_dns_server: request.pushDnsServer,
  rebind_timer: request.rebindTimer,
  renew_timer: request.renewTimer,
  subnet: request.subnet,
  valid_lifetime: request.validLifetime
});
const marshalUpdateGatewayNetworkRequest = (request, defaults) => ({
  enable_dhcp: request.enableDhcp,
  enable_masquerade: request.enableMasquerade,
  ...resolveOneOf([{
    param: 'dhcp_id',
    value: request.dhcpId
  }, {
    param: 'address',
    value: request.address
  }])
});
const marshalUpdateGatewayRequest = (request, defaults) => ({
  bastion_port: request.bastionPort,
  enable_bastion: request.enableBastion,
  enable_smtp: request.enableSmtp,
  name: request.name,
  tags: request.tags,
  upstream_dns_servers: request.upstreamDnsServers
});
const marshalUpdateIPRequest = (request, defaults) => ({
  gateway_id: request.gatewayId,
  reverse: request.reverse,
  tags: request.tags
});
const marshalUpdatePATRuleRequest = (request, defaults) => ({
  private_ip: request.privateIp,
  private_port: request.privatePort,
  protocol: request.protocol ?? 'unknown',
  public_port: request.publicPort
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders$1 = {
  'Content-Type': 'application/json; charset=utf-8'
};

/** Public Gateways API. */
let API$1 = class API extends API$q {
  /** Lists the available zones of the API. */
  static LOCALITIES = ['fr-par-1', 'fr-par-2', 'nl-ams-1', 'nl-ams-2', 'pl-waw-1', 'pl-waw-2'];
  pageOfListGateways = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/gateways`,
    urlParams: urlParams(['name', request.name], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['private_network_id', request.privateNetworkId], ['project_id', request.projectId], ['status', request.status ?? 'unknown'], ['tags', request.tags], ['type', request.type])
  }, unmarshalListGatewaysResponse);

  /**
   * List Public Gateways. List Public Gateways in a given Scaleway Organization
   * or Project. By default, results are displayed in ascending order of
   * creation date.
   *
   * @param request - The request {@link ListGatewaysRequest}
   * @returns A Promise of ListGatewaysResponse
   */
  listGateways = (request = {}) => enrichForPagination('gateways', this.pageOfListGateways, request);

  /**
   * Get a Public Gateway. Get details of a Public Gateway, specified by its
   * gateway ID. The response object contains full details of the gateway,
   * including its **name**, **type**, **status** and more.
   *
   * @param request - The request {@link GetGatewayRequest}
   * @returns A Promise of Gateway
   */
  getGateway = request => this.client.fetch({
    method: 'GET',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/gateways/${validatePathParam('gatewayId', request.gatewayId)}`
  }, unmarshalGateway);

  /**
   * Waits for {@link Gateway} to be in a final state.
   *
   * @param request - The request {@link GetGatewayRequest}
   * @param options - The waiting options
   * @returns A Promise of Gateway
   */
  waitForGateway = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!GATEWAY_TRANSIENT_STATUSES.includes(res.status))), this.getGateway, request, options);

  /**
   * Create a Public Gateway. Create a new Public Gateway in the specified
   * Scaleway Project, defining its **name**, **type** and other configuration
   * details such as whether to enable SSH bastion.
   *
   * @param request - The request {@link CreateGatewayRequest}
   * @returns A Promise of Gateway
   */
  createGateway = request => this.client.fetch({
    body: JSON.stringify(marshalCreateGatewayRequest(request, this.client.settings)),
    headers: jsonContentHeaders$1,
    method: 'POST',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/gateways`
  }, unmarshalGateway);

  /**
   * Update a Public Gateway. Update the parameters of an existing Public
   * Gateway, for example, its **name**, **tags**, **SSH bastion
   * configuration**, and **DNS servers**.
   *
   * @param request - The request {@link UpdateGatewayRequest}
   * @returns A Promise of Gateway
   */
  updateGateway = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateGatewayRequest(request, this.client.settings)),
    headers: jsonContentHeaders$1,
    method: 'PATCH',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/gateways/${validatePathParam('gatewayId', request.gatewayId)}`
  }, unmarshalGateway);

  /**
   * Delete a Public Gateway. Delete an existing Public Gateway, specified by
   * its gateway ID. This action is irreversible.
   *
   * @param request - The request {@link DeleteGatewayRequest}
   */
  deleteGateway = request => this.client.fetch({
    method: 'DELETE',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/gateways/${validatePathParam('gatewayId', request.gatewayId)}`,
    urlParams: urlParams(['cleanup_dhcp', request.cleanupDhcp])
  });

  /**
   * Upgrade a Public Gateway to the latest version. Upgrade a given Public
   * Gateway to the newest software version. This applies the latest bugfixes
   * and features to your Public Gateway, but its service will be interrupted
   * during the update.
   *
   * @param request - The request {@link UpgradeGatewayRequest}
   * @returns A Promise of Gateway
   */
  upgradeGateway = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$1,
    method: 'POST',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/gateways/${validatePathParam('gatewayId', request.gatewayId)}/upgrade`
  }, unmarshalGateway);
  pageOfListGatewayNetworks = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/gateway-networks`,
    urlParams: urlParams(['dhcp_id', request.dhcpId], ['enable_masquerade', request.enableMasquerade], ['gateway_id', request.gatewayId], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['private_network_id', request.privateNetworkId], ['status', request.status ?? 'unknown'])
  }, unmarshalListGatewayNetworksResponse);

  /**
   * List Public Gateway connections to Private Networks. List the connections
   * between Public Gateways and Private Networks (a connection = a
   * GatewayNetwork). You can choose to filter by `gateway-id` to list all
   * Private Networks attached to the specified Public Gateway, or by
   * `private_network_id` to list all Public Gateways attached to the specified
   * Private Network. Other query parameters are also available. The result is
   * an array of GatewayNetwork objects, each giving details of the connection
   * between a given Public Gateway and a given Private Network.
   *
   * @param request - The request {@link ListGatewayNetworksRequest}
   * @returns A Promise of ListGatewayNetworksResponse
   */
  listGatewayNetworks = (request = {}) => enrichForPagination('gatewayNetworks', this.pageOfListGatewayNetworks, request);

  /**
   * Get a Public Gateway connection to a Private Network. Get details of a
   * given connection between a Public Gateway and a Private Network (this
   * connection = a GatewayNetwork), specified by its `gateway_network_id`. The
   * response object contains details of the connection including the IDs of the
   * Public Gateway and Private Network, the dates the connection was
   * created/updated and its configuration settings.
   *
   * @param request - The request {@link GetGatewayNetworkRequest}
   * @returns A Promise of GatewayNetwork
   */
  getGatewayNetwork = request => this.client.fetch({
    method: 'GET',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/gateway-networks/${validatePathParam('gatewayNetworkId', request.gatewayNetworkId)}`
  }, unmarshalGatewayNetwork);

  /**
   * Waits for {@link GatewayNetwork} to be in a final state.
   *
   * @param request - The request {@link GetGatewayNetworkRequest}
   * @param options - The waiting options
   * @returns A Promise of GatewayNetwork
   */
  waitForGatewayNetwork = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!GATEWAY_NETWORK_TRANSIENT_STATUSES.includes(res.status))), this.getGatewayNetwork, request, options);

  /**
   * Attach a Public Gateway to a Private Network. Attach a specific Public
   * Gateway to a specific Private Network (create a GatewayNetwork). You can
   * configure parameters for the connection including DHCP settings, whether to
   * enable masquerade (dynamic NAT), and more.
   *
   * @param request - The request {@link CreateGatewayNetworkRequest}
   * @returns A Promise of GatewayNetwork
   */
  createGatewayNetwork = request => this.client.fetch({
    body: JSON.stringify(marshalCreateGatewayNetworkRequest(request, this.client.settings)),
    headers: jsonContentHeaders$1,
    method: 'POST',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/gateway-networks`
  }, unmarshalGatewayNetwork);

  /**
   * Update a Public Gateway's connection to a Private Network. Update the
   * configuration parameters of a connection between a given Public Gateway and
   * Private Network (the connection = a GatewayNetwork). Updatable parameters
   * include DHCP settings and whether to enable traffic masquerade (dynamic
   * NAT).
   *
   * @param request - The request {@link UpdateGatewayNetworkRequest}
   * @returns A Promise of GatewayNetwork
   */
  updateGatewayNetwork = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateGatewayNetworkRequest(request, this.client.settings)),
    headers: jsonContentHeaders$1,
    method: 'PATCH',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/gateway-networks/${validatePathParam('gatewayNetworkId', request.gatewayNetworkId)}`
  }, unmarshalGatewayNetwork);

  /**
   * Detach a Public Gateway from a Private Network. Detach a given Public
   * Gateway from a given Private Network, i.e. delete a GatewayNetwork
   * specified by a gateway_network_id.
   *
   * @param request - The request {@link DeleteGatewayNetworkRequest}
   */
  deleteGatewayNetwork = request => this.client.fetch({
    method: 'DELETE',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/gateway-networks/${validatePathParam('gatewayNetworkId', request.gatewayNetworkId)}`,
    urlParams: urlParams(['cleanup_dhcp', request.cleanupDhcp])
  });
  pageOfListDHCPs = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/dhcps`,
    urlParams: urlParams(['address', request.address], ['has_address', request.hasAddress], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId])
  }, unmarshalListDHCPsResponse);

  /**
   * List DHCP configurations. List DHCP configurations, optionally filtering by
   * Organization, Project, Public Gateway IP address or more. The response is
   * an array of DHCP configuration objects, each identified by a DHCP ID and
   * containing configuration settings for the assignment of IP addresses to
   * devices on a Private Network attached to a Public Gateway. Note that the
   * response does not contain the IDs of any Private Network / Public Gateway
   * the configuration is attached to. Use the `List Public Gateway connections
   * to Private Networks` method for that purpose, filtering on DHCP ID.
   *
   * @param request - The request {@link ListDHCPsRequest}
   * @returns A Promise of ListDHCPsResponse
   */
  listDHCPs = (request = {}) => enrichForPagination('dhcps', this.pageOfListDHCPs, request);

  /**
   * Get a DHCP configuration. Get a DHCP configuration object, identified by
   * its DHCP ID. The response object contains configuration settings for the
   * assignment of IP addresses to devices on a Private Network attached to a
   * Public Gateway. Note that the response does not contain the IDs of any
   * Private Network / Public Gateway the configuration is attached to. Use the
   * `List Public Gateway connections to Private Networks` method for that
   * purpose, filtering on DHCP ID.
   *
   * @param request - The request {@link GetDHCPRequest}
   * @returns A Promise of DHCP
   */
  getDHCP = request => this.client.fetch({
    method: 'GET',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/dhcps/${validatePathParam('dhcpId', request.dhcpId)}`
  }, unmarshalDHCP);

  /**
   * Create a DHCP configuration. Create a new DHCP configuration object,
   * containing settings for the assignment of IP addresses to devices on a
   * Private Network attached to a Public Gateway. The response object includes
   * the ID of the DHCP configuration object. You can use this ID as part of a
   * call to `Create a Public Gateway connection to a Private Network` or
   * `Update a Public Gateway connection to a Private Network` to directly apply
   * this DHCP configuration.
   *
   * @param request - The request {@link CreateDHCPRequest}
   * @returns A Promise of DHCP
   */
  createDHCP = request => this.client.fetch({
    body: JSON.stringify(marshalCreateDHCPRequest(request, this.client.settings)),
    headers: jsonContentHeaders$1,
    method: 'POST',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/dhcps`
  }, unmarshalDHCP);

  /**
   * Update a DHCP configuration. Update a DHCP configuration object, identified
   * by its DHCP ID.
   *
   * @param request - The request {@link UpdateDHCPRequest}
   * @returns A Promise of DHCP
   */
  updateDHCP = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateDHCPRequest(request, this.client.settings)),
    headers: jsonContentHeaders$1,
    method: 'PATCH',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/dhcps/${validatePathParam('dhcpId', request.dhcpId)}`
  }, unmarshalDHCP);

  /**
   * Delete a DHCP configuration. Delete a DHCP configuration object, identified
   * by its DHCP ID. Note that you cannot delete a DHCP configuration object
   * that is currently being used by a Gateway Network.
   *
   * @param request - The request {@link DeleteDHCPRequest}
   */
  deleteDHCP = request => this.client.fetch({
    method: 'DELETE',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/dhcps/${validatePathParam('dhcpId', request.dhcpId)}`
  });
  pageOfListDHCPEntries = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/dhcp-entries`,
    urlParams: urlParams(['gateway_network_id', request.gatewayNetworkId], ['hostname', request.hostname], ['ip_address', request.ipAddress], ['mac_address', request.macAddress], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['type', request.type ?? 'unknown'])
  }, unmarshalListDHCPEntriesResponse);

  /**
   * List DHCP entries. List DHCP entries, whether dynamically assigned and/or
   * statically reserved. DHCP entries can be filtered by the Gateway Network
   * they are on, their MAC address, IP address, type or hostname.
   *
   * @param request - The request {@link ListDHCPEntriesRequest}
   * @returns A Promise of ListDHCPEntriesResponse
   */
  listDHCPEntries = (request = {}) => enrichForPagination('dhcpEntries', this.pageOfListDHCPEntries, request);

  /**
   * Get a DHCP entry. Get a DHCP entry, specified by its DHCP entry ID.
   *
   * @param request - The request {@link GetDHCPEntryRequest}
   * @returns A Promise of DHCPEntry
   */
  getDHCPEntry = request => this.client.fetch({
    method: 'GET',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/dhcp-entries/${validatePathParam('dhcpEntryId', request.dhcpEntryId)}`
  }, unmarshalDHCPEntry);

  /**
   * Create a DHCP entry. Create a static DHCP reservation, specifying the
   * Gateway Network for the reservation, the MAC address of the target device
   * and the IP address to assign this device. The response is a DHCP entry
   * object, confirming the ID and configuration details of the static DHCP
   * reservation.
   *
   * @param request - The request {@link CreateDHCPEntryRequest}
   * @returns A Promise of DHCPEntry
   */
  createDHCPEntry = request => this.client.fetch({
    body: JSON.stringify(marshalCreateDHCPEntryRequest(request, this.client.settings)),
    headers: jsonContentHeaders$1,
    method: 'POST',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/dhcp-entries`
  }, unmarshalDHCPEntry);

  /**
   * Update a DHCP entry. Update the IP address for a DHCP entry, specified by
   * its DHCP entry ID. You can update an existing DHCP entry of any type
   * (`reservation` (static), `lease` (dynamic) or `unknown`), but in manually
   * updating the IP address the entry will necessarily be of type `reservation`
   * after the update.
   *
   * @param request - The request {@link UpdateDHCPEntryRequest}
   * @returns A Promise of DHCPEntry
   */
  updateDHCPEntry = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateDHCPEntryRequest(request, this.client.settings)),
    headers: jsonContentHeaders$1,
    method: 'PATCH',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/dhcp-entries/${validatePathParam('dhcpEntryId', request.dhcpEntryId)}`
  }, unmarshalDHCPEntry);

  /**
   * Set all DHCP reservations on a Gateway Network. Set the list of DHCP
   * reservations attached to a Gateway Network. Reservations are identified by
   * their MAC address, and will sync the current DHCP entry list to the given
   * list, creating, updating or deleting DHCP entries accordingly.
   *
   * @param request - The request {@link SetDHCPEntriesRequest}
   * @returns A Promise of SetDHCPEntriesResponse
   */
  setDHCPEntries = request => this.client.fetch({
    body: JSON.stringify(marshalSetDHCPEntriesRequest(request, this.client.settings)),
    headers: jsonContentHeaders$1,
    method: 'PUT',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/dhcp-entries`
  }, unmarshalSetDHCPEntriesResponse);

  /**
   * Delete a DHCP entry. Delete a static DHCP reservation, identified by its
   * DHCP entry ID. Note that you cannot delete DHCP entries of type `lease`,
   * these are deleted automatically when their time-to-live expires.
   *
   * @param request - The request {@link DeleteDHCPEntryRequest}
   */
  deleteDHCPEntry = request => this.client.fetch({
    method: 'DELETE',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/dhcp-entries/${validatePathParam('dhcpEntryId', request.dhcpEntryId)}`
  });
  pageOfListPATRules = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/pat-rules`,
    urlParams: urlParams(['gateway_id', request.gatewayId], ['order_by', request.orderBy ?? 'created_at_asc'], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['private_ip', request.privateIp], ['protocol', request.protocol ?? 'unknown'])
  }, unmarshalListPATRulesResponse);

  /**
   * List PAT rules. List PAT rules. You can filter by gateway ID to list all
   * PAT rules for a particular gateway, or filter for PAT rules targeting a
   * specific IP address or using a specific protocol.
   *
   * @param request - The request {@link ListPATRulesRequest}
   * @returns A Promise of ListPATRulesResponse
   */
  listPATRules = (request = {}) => enrichForPagination('patRules', this.pageOfListPATRules, request);

  /**
   * Get a PAT rule. Get a PAT rule, specified by its PAT rule ID. The response
   * object gives full details of the PAT rule, including the Public Gateway it
   * belongs to and the configuration settings in terms of public / private
   * ports, private IP and protocol.
   *
   * @param request - The request {@link GetPATRuleRequest}
   * @returns A Promise of PATRule
   */
  getPATRule = request => this.client.fetch({
    method: 'GET',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/pat-rules/${validatePathParam('patRuleId', request.patRuleId)}`
  }, unmarshalPATRule);

  /**
   * Create a PAT rule. Create a new PAT rule on a specified Public Gateway,
   * defining the protocol to use, public port to listen on, and private port /
   * IP address to map to.
   *
   * @param request - The request {@link CreatePATRuleRequest}
   * @returns A Promise of PATRule
   */
  createPATRule = request => this.client.fetch({
    body: JSON.stringify(marshalCreatePATRuleRequest(request, this.client.settings)),
    headers: jsonContentHeaders$1,
    method: 'POST',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/pat-rules`
  }, unmarshalPATRule);

  /**
   * Update a PAT rule. Update a PAT rule, specified by its PAT rule ID.
   * Configuration settings including private/public port, private IP address
   * and protocol can all be updated.
   *
   * @param request - The request {@link UpdatePATRuleRequest}
   * @returns A Promise of PATRule
   */
  updatePATRule = request => this.client.fetch({
    body: JSON.stringify(marshalUpdatePATRuleRequest(request, this.client.settings)),
    headers: jsonContentHeaders$1,
    method: 'PATCH',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/pat-rules/${validatePathParam('patRuleId', request.patRuleId)}`
  }, unmarshalPATRule);

  /**
   * Set all PAT rules. Set a definitive list of PAT rules attached to a Public
   * Gateway. Each rule is identified by its public port and protocol. This will
   * sync the current PAT rule list on the gateway with the new list, creating,
   * updating or deleting PAT rules accordingly.
   *
   * @param request - The request {@link SetPATRulesRequest}
   * @returns A Promise of SetPATRulesResponse
   */
  setPATRules = request => this.client.fetch({
    body: JSON.stringify(marshalSetPATRulesRequest(request, this.client.settings)),
    headers: jsonContentHeaders$1,
    method: 'PUT',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/pat-rules`
  }, unmarshalSetPATRulesResponse);

  /**
   * Delete a PAT rule. Delete a PAT rule, identified by its PAT rule ID. This
   * action is irreversible.
   *
   * @param request - The request {@link DeletePATRuleRequest}
   */
  deletePATRule = request => this.client.fetch({
    method: 'DELETE',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/pat-rules/${validatePathParam('patRuleId', request.patRuleId)}`
  });

  /**
   * List Public Gateway types. List the different Public Gateway commercial
   * offer types available at Scaleway. The response is an array of objects
   * describing the name and technical details of each available gateway type.
   *
   * @param request - The request {@link ListGatewayTypesRequest}
   * @returns A Promise of ListGatewayTypesResponse
   */
  listGatewayTypes = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/gateway-types`
  }, unmarshalListGatewayTypesResponse);
  pageOfListIPs = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/ips`,
    urlParams: urlParams(['is_free', request.isFree], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId], ['reverse', request.reverse], ['tags', request.tags])
  }, unmarshalListIPsResponse);

  /**
   * List IPs. List Public Gateway flexible IP addresses. A number of filter
   * options are available for limiting results in the response.
   *
   * @param request - The request {@link ListIPsRequest}
   * @returns A Promise of ListIPsResponse
   */
  listIPs = (request = {}) => enrichForPagination('ips', this.pageOfListIPs, request);

  /**
   * Get an IP. Get details of a Public Gateway flexible IP address, identified
   * by its IP ID. The response object contains information including which (if
   * any) Public Gateway using this IP address, the reverse and various other
   * metadata.
   *
   * @param request - The request {@link GetIPRequest}
   * @returns A Promise of IP
   */
  getIP = request => this.client.fetch({
    method: 'GET',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/ips/${validatePathParam('ipId', request.ipId)}`
  }, unmarshalIP);

  /**
   * Reserve an IP. Create (reserve) a new flexible IP address that can be used
   * for a Public Gateway in a specified Scaleway Project.
   *
   * @param request - The request {@link CreateIPRequest}
   * @returns A Promise of IP
   */
  createIP = (request = {}) => this.client.fetch({
    body: JSON.stringify(marshalCreateIPRequest(request, this.client.settings)),
    headers: jsonContentHeaders$1,
    method: 'POST',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/ips`
  }, unmarshalIP);

  /**
   * Update an IP. Update details of an existing flexible IP address, including
   * its tags, reverse and the Public Gateway it is assigned to.
   *
   * @param request - The request {@link UpdateIPRequest}
   * @returns A Promise of IP
   */
  updateIP = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateIPRequest(request, this.client.settings)),
    headers: jsonContentHeaders$1,
    method: 'PATCH',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/ips/${validatePathParam('ipId', request.ipId)}`
  }, unmarshalIP);

  /**
   * Delete an IP. Delete a flexible IP address from your account. This action
   * is irreversible.
   *
   * @param request - The request {@link DeleteIPRequest}
   */
  deleteIP = request => this.client.fetch({
    method: 'DELETE',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/ips/${validatePathParam('ipId', request.ipId)}`
  });

  /**
   * Refresh a Public Gateway's SSH keys. Refresh the SSH keys of a given Public
   * Gateway, specified by its gateway ID. This adds any new SSH keys in the
   * gateway's Scaleway Project to the gateway itself.
   *
   * @param request - The request {@link RefreshSSHKeysRequest}
   * @returns A Promise of Gateway
   */
  refreshSSHKeys = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders$1,
    method: 'POST',
    path: `/vpc-gw/v1/zones/${validatePathParam('zone', request.zone ?? this.client.settings.defaultZone)}/gateways/${validatePathParam('gatewayId', request.gatewayId)}/refresh-ssh-keys`
  }, unmarshalGateway);
};

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API$1,
  GATEWAY_NETWORK_TRANSIENT_STATUSES: GATEWAY_NETWORK_TRANSIENT_STATUSES,
  GATEWAY_TRANSIENT_STATUSES: GATEWAY_TRANSIENT_STATUSES
});

var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1: index_gen$1
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

/** Lists transient statutes of the enum {@link HostingStatus}. */
const HOSTING_TRANSIENT_STATUSES = ['delivering', 'deleting'];

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const unmarshalHostingCpanelUrls = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'HostingCpanelUrls' failed as data isn't a dictionary.`);
  }
  return {
    dashboard: data.dashboard,
    webmail: data.webmail
  };
};
const unmarshalHostingOption = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'HostingOption' failed as data isn't a dictionary.`);
  }
  return {
    id: data.id,
    name: data.name
  };
};
const unmarshalOfferProduct = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'OfferProduct' failed as data isn't a dictionary.`);
  }
  return {
    databasesQuota: data.databases_quota,
    emailAccountsQuota: data.email_accounts_quota,
    emailStorageQuota: data.email_storage_quota,
    hostingStorageQuota: data.hosting_storage_quota,
    name: data.name,
    option: data.option,
    ram: data.ram,
    supportIncluded: data.support_included,
    vCpu: data.v_cpu
  };
};
const unmarshalDnsRecord = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DnsRecord' failed as data isn't a dictionary.`);
  }
  return {
    name: data.name,
    priority: data.priority,
    status: data.status,
    ttl: data.ttl,
    type: data.type,
    value: data.value
  };
};
const unmarshalHosting = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Hosting' failed as data isn't a dictionary.`);
  }
  return {
    cpanelUrls: data.cpanel_urls ? unmarshalHostingCpanelUrls(data.cpanel_urls) : undefined,
    createdAt: unmarshalDate(data.created_at),
    dnsStatus: data.dns_status,
    domain: data.domain,
    id: data.id,
    offerId: data.offer_id,
    offerName: data.offer_name,
    options: unmarshalArrayOfObject(data.options, unmarshalHostingOption),
    organizationId: data.organization_id,
    platformHostname: data.platform_hostname,
    platformNumber: data.platform_number,
    projectId: data.project_id,
    region: data.region,
    status: data.status,
    tags: data.tags,
    updatedAt: unmarshalDate(data.updated_at),
    username: data.username
  };
};
const unmarshalNameserver = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Nameserver' failed as data isn't a dictionary.`);
  }
  return {
    hostname: data.hostname,
    isDefault: data.is_default,
    status: data.status
  };
};
const unmarshalOffer = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'Offer' failed as data isn't a dictionary.`);
  }
  return {
    available: data.available,
    billingOperationPath: data.billing_operation_path,
    id: data.id,
    price: data.price ? unmarshalMoney(data.price) : undefined,
    product: data.product ? unmarshalOfferProduct(data.product) : undefined,
    quotaWarnings: data.quota_warnings
  };
};
const unmarshalDnsRecords = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'DnsRecords' failed as data isn't a dictionary.`);
  }
  return {
    nameServers: unmarshalArrayOfObject(data.name_servers, unmarshalNameserver),
    records: unmarshalArrayOfObject(data.records, unmarshalDnsRecord),
    status: data.status
  };
};
const unmarshalListHostingsResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListHostingsResponse' failed as data isn't a dictionary.`);
  }
  return {
    hostings: unmarshalArrayOfObject(data.hostings, unmarshalHosting),
    totalCount: data.total_count
  };
};
const unmarshalListOffersResponse = data => {
  if (!isJSONObject(data)) {
    throw new TypeError(`Unmarshalling the type 'ListOffersResponse' failed as data isn't a dictionary.`);
  }
  return {
    offers: unmarshalArrayOfObject(data.offers, unmarshalOffer)
  };
};
const marshalCreateHostingRequest = (request, defaults) => ({
  domain: request.domain,
  email: request.email,
  offer_id: request.offerId,
  option_ids: request.optionIds,
  project_id: request.projectId ?? defaults.defaultProjectId,
  tags: request.tags
});
const marshalUpdateHostingRequest = (request, defaults) => ({
  email: request.email,
  offer_id: request.offerId,
  option_ids: request.optionIds,
  tags: request.tags
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.
const jsonContentHeaders = {
  'Content-Type': 'application/json; charset=utf-8'
};

/** Web Hosting API. */
class API extends API$q {
  /** Lists the available regions of the API. */
  static LOCALITIES = ['fr-par'];

  /**
   * Order a Web Hosting plan. Order a Web Hosting plan, specifying the offer
   * type required via the `offer_id` parameter.
   *
   * @param request - The request {@link CreateHostingRequest}
   * @returns A Promise of Hosting
   */
  createHosting = request => this.client.fetch({
    body: JSON.stringify(marshalCreateHostingRequest(request, this.client.settings)),
    headers: jsonContentHeaders,
    method: 'POST',
    path: `/webhosting/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/hostings`
  }, unmarshalHosting);
  pageOfListHostings = (request = {}) => this.client.fetch({
    method: 'GET',
    path: `/webhosting/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/hostings`,
    urlParams: urlParams(['domain', request.domain], ['order_by', request.orderBy ?? 'created_at_asc'], ['organization_id', request.organizationId], ['page', request.page], ['page_size', request.pageSize ?? this.client.settings.defaultPageSize], ['project_id', request.projectId], ['statuses', request.statuses], ['tags', request.tags])
  }, unmarshalListHostingsResponse);

  /**
   * List all Web Hosting plans. List all of your existing Web Hosting plans.
   * Various filters are available to limit the results, including filtering by
   * domain, status, tag and Project ID.
   *
   * @param request - The request {@link ListHostingsRequest}
   * @returns A Promise of ListHostingsResponse
   */
  listHostings = (request = {}) => enrichForPagination('hostings', this.pageOfListHostings, request);

  /**
   * Get a Web Hosting plan. Get the details of one of your existing Web Hosting
   * plans, specified by its `hosting_id`.
   *
   * @param request - The request {@link GetHostingRequest}
   * @returns A Promise of Hosting
   */
  getHosting = request => this.client.fetch({
    method: 'GET',
    path: `/webhosting/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/hostings/${validatePathParam('hostingId', request.hostingId)}`
  }, unmarshalHosting);

  /**
   * Waits for {@link Hosting} to be in a final state.
   *
   * @param request - The request {@link GetHostingRequest}
   * @param options - The waiting options
   * @returns A Promise of Hosting
   */
  waitForHosting = (request, options) => waitForResource(options?.stop ?? (res => Promise.resolve(!HOSTING_TRANSIENT_STATUSES.includes(res.status))), this.getHosting, request, options);

  /**
   * Update a Web Hosting plan. Update the details of one of your existing Web
   * Hosting plans, specified by its `hosting_id`. You can update parameters
   * including the contact email address, tags, options and offer.
   *
   * @param request - The request {@link UpdateHostingRequest}
   * @returns A Promise of Hosting
   */
  updateHosting = request => this.client.fetch({
    body: JSON.stringify(marshalUpdateHostingRequest(request, this.client.settings)),
    headers: jsonContentHeaders,
    method: 'PATCH',
    path: `/webhosting/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/hostings/${validatePathParam('hostingId', request.hostingId)}`
  }, unmarshalHosting);

  /**
   * Delete a Web Hosting plan. Delete a Web Hosting plan, specified by its
   * `hosting_id`. Note that deletion is not immediate: it will take place at
   * the end of the calendar month, after which time your Web Hosting plan and
   * all its data (files and emails) will be irreversibly lost.
   *
   * @param request - The request {@link DeleteHostingRequest}
   * @returns A Promise of Hosting
   */
  deleteHosting = request => this.client.fetch({
    method: 'DELETE',
    path: `/webhosting/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/hostings/${validatePathParam('hostingId', request.hostingId)}`
  }, unmarshalHosting);

  /**
   * Restore a Web Hosting plan. When you [delete a Web Hosting
   * plan](#path-hostings-delete-a-hosting), definitive deletion does not take
   * place until the end of the calendar month. In the time between initiating
   * the deletion, and definitive deletion at the end of the month, you can
   * choose to **restore** the Web Hosting plan, using this endpoint and
   * specifying its `hosting_id`.
   *
   * @param request - The request {@link RestoreHostingRequest}
   * @returns A Promise of Hosting
   */
  restoreHosting = request => this.client.fetch({
    body: '{}',
    headers: jsonContentHeaders,
    method: 'POST',
    path: `/webhosting/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/hostings/${validatePathParam('hostingId', request.hostingId)}/restore`
  }, unmarshalHosting);

  /**
   * Get DNS records. Get the set of DNS records of a specified domain
   * associated with a Web Hosting plan.
   *
   * @param request - The request {@link GetDomainDnsRecordsRequest}
   * @returns A Promise of DnsRecords
   */
  getDomainDnsRecords = request => this.client.fetch({
    method: 'GET',
    path: `/webhosting/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/domains/${validatePathParam('domain', request.domain)}/dns-records`
  }, unmarshalDnsRecords);

  /**
   * List all offers. List the different Web Hosting offers, and their options,
   * available to order from Scaleway.
   *
   * @param request - The request {@link ListOffersRequest}
   * @returns A Promise of ListOffersResponse
   */
  listOffers = request => this.client.fetch({
    method: 'GET',
    path: `/webhosting/v1alpha1/regions/${validatePathParam('region', request.region ?? this.client.settings.defaultRegion)}/offers`,
    urlParams: urlParams(['hosting_id', request.hostingId], ['only_options', request.onlyOptions], ['order_by', request.orderBy ?? 'price_asc'], ['without_options', request.withoutOptions])
  }, unmarshalListOffersResponse);
}

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

const ListHostingsRequest = {
  page: {
    greaterThan: 0
  },
  pageSize: {
    greaterThan: 0,
    lessThanOrEqual: 100
  }
};

var validationRules_gen = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ListHostingsRequest: ListHostingsRequest
});

// This file was automatically generated. DO NOT EDIT.
// If you have any remark or suggestion do not hesitate to open an issue.

var index_gen = /*#__PURE__*/Object.freeze({
  __proto__: null,
  API: API,
  HOSTING_TRANSIENT_STATUSES: HOSTING_TRANSIENT_STATUSES,
  ValidationRules: validationRules_gen
});

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  v1alpha1: index_gen
});

exports.API = API$q;
exports.Account = index$s;
exports.AppleSilicon = index$r;
exports.BareMetal = index$p;
exports.Billing = index$o;
exports.Cockpit = index$n;
exports.Container = index$m;
exports.Domain = index$l;
exports.Errors = index$t;
exports.FlexibleIP = index$k;
exports.Function = index$j;
exports.IAM = index$i;
exports.IOT = index$f;
exports.Instance = index$g;
exports.K8S = index$d;
exports.LB = index$b;
exports.MNQ = index$9;
exports.Marketplace = index$a;
exports.RDB = index$8;
exports.Redis = index$7;
exports.Registry = index$6;
exports.Secret = index$5;
exports.Test = index$4;
exports.TransactionalEmail = index$3;
exports.VPC = index$2;
exports.VPCGW = index$1;
exports.Webhosting = index;
exports.addAsyncHeaderInterceptor = addAsyncHeaderInterceptor;
exports.authenticateWithSessionToken = authenticateWithSessionToken;
exports.createAdvancedClient = createAdvancedClient;
exports.createClient = createClient;
exports.enableConsoleLogger = enableConsoleLogger;
exports.enrichForPagination = enrichForPagination;
exports.isJSONObject = isJSONObject;
exports.marshalMoney = marshalMoney;
exports.marshalScwFile = marshalScwFile;
exports.marshalTimeSeries = marshalTimeSeries;
exports.resolveOneOf = resolveOneOf;
exports.setLogger = setLogger;
exports.unmarshalArrayOfObject = unmarshalArrayOfObject;
exports.unmarshalDate = unmarshalDate;
exports.unmarshalMapOfObject = unmarshalMapOfObject;
exports.unmarshalMoney = unmarshalMoney;
exports.unmarshalScwFile = unmarshalScwFile;
exports.unmarshalServiceInfo = unmarshalServiceInfo;
exports.unmarshalTimeSeries = unmarshalTimeSeries;
exports.unmarshalTimeSeriesPoint = unmarshalTimeSeriesPoint;
exports.urlParams = urlParams;
exports.validatePathParam = validatePathParam;
exports.waitForResource = waitForResource;
exports.withAdditionalInterceptors = withAdditionalInterceptors;
exports.withDefaultPageSize = withDefaultPageSize;
exports.withHTTPClient = withHTTPClient;
exports.withProfile = withProfile;
exports.withUserAgent = withUserAgent;
exports.withUserAgentSuffix = withUserAgentSuffix;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(283);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map