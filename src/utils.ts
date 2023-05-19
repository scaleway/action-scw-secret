import core from "@actions/core";
import { Secret } from "@scaleway/sdk";

export function transformToValidEnvName(secretName: string): string {
  // Leading digits are invalid
  if (secretName.match(/^[0-9]/)) {
    secretName = "_".concat(secretName);
  }

  // Remove invalid characters
  return secretName.replace(/[^a-zA-Z0-9_]/g, "_").toUpperCase();
}

export function extractAlias(input: string): [string, string] {
  const parsedInput = input.split(",");

  if (parsedInput.length > 1) {
    const alias = parsedInput[0].trim();
    const secretName = parsedInput[1].trim();

    const validateEnvName = transformToValidEnvName(alias);
    if (alias !== validateEnvName) {
      throw new Error(
        `The alias '${alias}' is not a valid environment name. Please verify that it has uppercase letters, numbers, and underscore only.`
      );
    }

    return [alias, secretName];
  }

  return [transformToValidEnvName(input.trim()), input.trim()];
}

export async function getSecretValue(
  api: Secret.v1alpha1.API,
  secretName: string
): Promise<string> {
  const secretResponse = await api.accessSecretVersionByName({
    secretName: secretName,
    revision: "latest",
  });

  return secretResponse.data;
}
