import { Secret } from "@scaleway/sdk";

export type Secret = {
  name: string;
  path: string;
}

export function transformToValidEnvName(secretName: string): string {
  // Leading digits are invalid
  if (secretName.match(/^[0-9]/)) {
    secretName = "_".concat(secretName);
  }

  // Remove invalid characters
  return secretName.replace(/[^a-zA-Z0-9_]/g, "_").toUpperCase();
}

export function extractAlias(input: string): [string, Secret] {
  const parsedInput = input.split(",");
  let secretRef = input.trim()
  let secretPath = "/"
  let alias = transformToValidEnvName(secretRef)
  let secretName = secretRef

  if (parsedInput.length > 1) {
    alias = parsedInput[0].trim();
    secretRef = parsedInput[1].trim();
    secretName = secretRef;

    const validateEnvName = transformToValidEnvName(alias);
    if (alias !== validateEnvName) {
      throw new Error(
        `The alias '${alias}' is not a valid environment name. Please verify that it has uppercase letters, numbers, and underscore only.`
      );
    }
  }

  if (secretRef.startsWith("/")) {
    [secretName, secretPath] = splitNameAndPath(secretRef)
    if (parsedInput.length == 1) {
      alias = transformToValidEnvName(secretName)
    }
  }

  return [alias, { name: secretName, path: secretPath }];
}

export function splitNameAndPath(ref: string): [string, string] {
  const s = ref.split("/")
  const name = s[s.length - 1]
  let path = "/"
  if (s.length > 2) {
    path = s.slice(0, s.length - 1).join("/")
  }

  return [name, path]
}

export async function getSecretValue(
  api: Secret.v1alpha1.API,
  secret: Secret
): Promise<string> {

  const secretList = await api.listSecrets({
    name: secret.name,
    path: secret.path,
    page: 1,
    pageSize: 1
  })

  if (secretList.totalCount < 1) {
    throw new Error(`No secret found with '${secret.name}' name and '${secret.path}' path`)
  }

  const secretResponse = await api.accessSecretVersion({
    secretId: secretList.secrets[0].id,
    revision: "latest_enabled"
  })

  return Buffer.from(secretResponse.data, "base64").toString("binary");
}
