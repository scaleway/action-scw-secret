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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecretValue = exports.splitNameAndPath = exports.extractAlias = exports.transformToValidEnvName = void 0;
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
    let secretRef = input.trim();
    let secretPath = "/";
    let alias = transformToValidEnvName(secretRef);
    let secretName = secretRef;
    if (parsedInput.length > 1) {
        alias = parsedInput[0].trim();
        secretRef = parsedInput[1].trim();
        secretName = secretRef;
        const validateEnvName = transformToValidEnvName(alias);
        if (alias !== validateEnvName) {
            throw new Error(`The alias '${alias}' is not a valid environment name. Please verify that it has uppercase letters, numbers, and underscore only.`);
        }
    }
    if (secretRef.startsWith("/")) {
        [secretName, secretPath] = splitNameAndPath(secretRef);
        if (parsedInput.length == 1) {
            alias = transformToValidEnvName(secretName);
        }
    }
    return [alias, { name: secretName, path: secretPath }];
}
exports.extractAlias = extractAlias;
function splitNameAndPath(ref) {
    const s = ref.split("/");
    const name = s[s.length - 1];
    let path = "/";
    if (s.length > 2) {
        path = s.slice(0, s.length - 1).join("/");
    }
    return [name, path];
}
exports.splitNameAndPath = splitNameAndPath;
function getSecretValue(api, secret) {
    return __awaiter(this, void 0, void 0, function* () {
        const secretList = yield api.listSecrets({
            name: secret.name,
            path: secret.path,
            page: 1,
            pageSize: 1,
        });
        if (secretList.totalCount < 1) {
            throw new Error(`No secret found with '${secret.name}' name and '${secret.path}' path`);
        }
        const secretResponse = yield api.accessSecretVersion({
            secretId: secretList.secrets[0].id,
            revision: "latest_enabled",
        });
        return Buffer.from(secretResponse.data, "base64").toString("binary");
    });
}
exports.getSecretValue = getSecretValue;
