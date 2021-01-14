from pymongo.encryption import Algorithm

from config import Config


def encrypt_field(data):
    return Config.DB_ENCRYPT_CLIENT.encrypt(
        data,
        Algorithm.AEAD_AES_256_CBC_HMAC_SHA_512_Random,
        key_alt_name='EPv2_key'
    )
