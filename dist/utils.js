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
        return Buffer.from(secretResponse.data, "base64").toString("binary");
    });
}
exports.getSecretValue = getSecretValue;
