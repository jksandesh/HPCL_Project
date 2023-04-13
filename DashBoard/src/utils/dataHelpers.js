
export const ensure0xInHex = (hexString) => {
    return hexString.startsWith("0x") ? hexString : "0x" + hexString;
};

export const ensureNo0xInHex = (hexString) => {
    return hexString.startsWith("0x") ? hexString.substr(2) : hexString;
};
