module.exports = {
    LATEST_SYSTEM_VERSION: '0230',
    MINIMUN_SYSTEM_VERSION: '0209',
    PID_SORT_LIST = '0123456789',
    VALID_CLIENT_ID_SECRET_PAIRS: {
        // 'Key' is the client ID, 'Value' is the client secret
        'a2efa818a34fa16b8afbc8a74eba3eda': 'c91cdb5658bd4954ade78533a339cf9a'
    },
    REGEX: {
        HEADER_FORMATS: {
            DEVICE_ID: /^\d{10}$/g,
            REGION: /^\d+$/g,
            SYSTEM_VERSION: /^\d+$/g,
        }
    },
    REGION_CODES_NUM: {
        '4': 'EUR',
        '2': 'US'
    },
    REGION_CODES_STR: {
        EUR: 4,
        US: 2
    }
}