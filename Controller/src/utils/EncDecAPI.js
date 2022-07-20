const EncDecAPI = {

    str_rot13: (msg) => {
        let a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let b = "nopqrstuvwxyzabcdefghijklmNOPQRSTUVWXYZABCDEFGHIJKLM";

        return msg.replace(/[a-z]/gi, (c) => b[a.indexOf(c)]);
    },
    
    base64_decode: (str) => {

        return Buffer(str, 'base64').toString('utf8');
    },

    base64_encode: (str) => {

        return Buffer.from(str).toString('base64');
    },

    decryptor: (str) => {
        
        return EncDecAPI.base64_decode(EncDecAPI.str_rot13(EncDecAPI.base64_decode(EncDecAPI.base64_decode(EncDecAPI.base64_decode(EncDecAPI.str_rot13(EncDecAPI.base64_decode(EncDecAPI.base64_decode(EncDecAPI.base64_decode(str)))))))));
    },

    encryptor: (str) => {
        return EncDecAPI.base64_encode(EncDecAPI.base64_encode(EncDecAPI.base64_encode(EncDecAPI.str_rot13(EncDecAPI.base64_encode(EncDecAPI.base64_encode(EncDecAPI.base64_encode(EncDecAPI.str_rot13(EncDecAPI.base64_encode(str)))))))));
    }
    
}

export default EncDecAPI;