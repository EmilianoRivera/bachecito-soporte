import CryptoJS from 'crypto-js';

const password = process.env.NEXT_PUBLIC_CIF;

// Cifrar datos
export function enc(data) {
    const plaintext = JSON.stringify(data);
    const ciphertext = CryptoJS.AES.encrypt(plaintext, password).toString();
    return ciphertext;    
}    

// Descifrar datos
export function desc(ciphertext) {
    const decryptedBytes = CryptoJS.AES.decrypt(ciphertext, password);
    const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
}
