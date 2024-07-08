import { db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const extractCityAndCountry = (url: string): { city: string; country: string } | null => {
  const regex = /\/place\/([^\/]+),([^\/]+)\/@/;
  const match = url.match(regex);
  if (match && match.length >= 3) {
    const city = decodeURIComponent(match[1].replace(/\+/g, ' '));
    const country = decodeURIComponent(match[2].replace(/\+/g, ' '));
    return { city, country };
  }
  
  return null;
};

const storeData = async (userId: string, city: string, country: string) => {
  try {
    await setDoc(doc(db, 'users', userId), { city, country }, { merge: true });
    console.log('Data stored successfully');
  } catch (error) {
    console.error('Error storing data: ', error);
  }
};

const extractAndStore = async (userId: string, url: string) => {
  const data = extractCityAndCountry(url);
  if (data) {
    try {
      await storeData(userId, data.city, data.country);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log('Invalid URL format');
  }
};

(async () => {
  const userId = 'exson';
  const url = 'https://www.google.com/maps/place/Meenambakkam,+Chennai,+Tamil+Nadu,+India+600114/@12.9801823,80.1734136,15z/data=!4m6!3m5!1s0x3a525e0305be150f:0x2b99b7504f8f7512!8m2!3d12.9828816!4d80.177393!16s%2Fg%2F11bw49lm21?entry=ttu';
  await extractAndStore(userId, url);
})();
