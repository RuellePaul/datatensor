from base64 import b64decode

from pymongo import errors, MongoClient
from pymongo.encryption import ClientEncryption
from pymongo.encryption_options import AutoEncryptionOpts


def encrypt_init(host, db_name=None, key=None, setup=False):
    if not key:
        raise KeyError('Invalid key for DB encryption')
    master_key = b64decode(key)
    kms_providers = {'local': {'key': master_key}}

    key_vault_namespace = 'encryption_datatensor.__pymongoVault'
    key_vault_db_name, key_vault_coll_name = key_vault_namespace.split('.', 1)

    auto_encryption_opts = AutoEncryptionOpts(
        kms_providers, key_vault_namespace, bypass_auto_encryption=True)

    client = MongoClient(host=host, auto_encryption_opts=auto_encryption_opts)

    key_vault = client[key_vault_db_name][key_vault_coll_name]
    key_vault.create_index(
        'keyAltNames',
        unique=True,
        partialFilterExpression={'keyAltNames': {'$exists': True}})

    client_encryption = ClientEncryption(
        kms_providers,
        key_vault_namespace,
        client,
        client.codec_options)

    if setup:
        try:
            client_encryption.create_data_key(
                'local', key_alt_names=['datatensor_key'])
        except errors.EncryptionError as e:
            if e.cause.code == 11000:  # DuplicateKeyError
                pass
        return

    client = client[db_name]
    return client_encryption, client
