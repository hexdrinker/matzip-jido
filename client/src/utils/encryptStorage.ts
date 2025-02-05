import EncryptStorage from 'react-native-encrypted-storage';

const setEncryptStorage = async <T>(key: string, value: T) => {
  await EncryptStorage.setItem(key, JSON.stringify(value));
};

const getEncryptStorage = async (key: string) => {
  const storedData = await EncryptStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : null;
};

const removeEncryptStorage = async (key: string) => {
  const storedData = await EncryptStorage.getItem(key);
  if (storedData) {
    EncryptStorage.removeItem(key);
  }
};

export {setEncryptStorage, getEncryptStorage, removeEncryptStorage};
