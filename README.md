# Scaleway Secret Manager GitHub Action

This action retrives secrets from Scaleway Secret Manager and inject them as environment variables.

## Inputs

### `secrets-names`

**Required** One or more secret names to retrieve.

Format:
- `secret-name`: Will fetch `secret-name` latest version and export its value to `SECRET_NAME`
- `MY_ENV_VAR,secret-name`: Will fetch `secret-name` latest version and export its value to `MY_ENV_VAR`

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
uses: scaleway/action-scw-secret@v0
with:
  secret-names: |
    my-secret
    MY_SECOND_SECRET,my-other-secret
  access-key: ${{ secrets.SCW_ACCESS_KEY }}
  secret-key: ${{ secrets.SCW_SECRET_KEY }}
  default-project-id: ${{ secrets.SCW_DEFAULT_PROJECT_ID }}
  default-organization-id: ${{ secrets.SCW_DEFAULT_ORGANIZATION_ID }}
```
