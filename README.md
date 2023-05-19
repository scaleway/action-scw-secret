# Scaleway Secret Manager get secrets action

This action retrives secrets from Scaleway Secret Manager and inject them as environment variables.

## Inputs

### `secrets-names`

**Required** One or more secret names to retrieve.

### `access-key`

**Required** Scaleway access key.

### `secret-key`

**Required** Scaleway secret key.

### `default-project-id`

Scaleway default project ID.

### `default-organization-id`

Scaleway default organization ID.

### `default-region`

Scaleway default region (default: fr-par).

### `default-zone`

Scaleway default zone (default: fr-par-1).

## Example usage

```yaml
uses: luxifer/scw-secret-manager-get-secrets@v1
with:
  secret-names: |
    my-secret
    MY_SECOND_SECRET,m-other-secret
  access-key: "${secret.SCW_ACCESS}"
  secret-key: "${secret.SCW_SECRET_KEY}"
```
