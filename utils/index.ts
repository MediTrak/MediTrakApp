import AsyncStorage from '@react-native-async-storage/async-storage';

const checkImageURL = (url: string) => {
  if (!url) return false
  else {
    const pattern = new RegExp('^https?:\\/\\/.+\\.(png|jpg|jpeg|bmp|gif|webp)$', 'i');
    return pattern.test(url);
  }
};

const avatarLetters = (inputString: string | undefined) => {
  const words = inputString?.split(' '); // Split the string into words
  const firstLetters = words?.map(word => word.charAt(0)); // Extract the first letter of each word
  return firstLetters?.join(''); // Join the first letters back together
}

type Hospital = {
  label: string;
  value: string;
};

// An array of hospital names with type Hospital
const hospitalNames: Hospital[] = [
  { label: "Mount Sinai Hospital", value: "Mount Sinai Hospital" },
  { label: "Tee Medical Center", value: "Tee Medical Center" },
  { label: "Eko Hospital", value: "Eko Hospital" },
  { label: "Ever Care Hospital", value: "Ever Care Hospital" },
  { label: "Ikeja General Hospital", value: "Ikeja General Hospital" },
  { label: "St. John's Hospital", value: "St. John's Hospital" },
  { label: "Unity Medical Center", value: "Unity Medical Center" },
  { label: "Royal Infirmary", value: "Royal Infirmary" },
  { label: "City General Hospital", value: "City General Hospital" },
  { label: "Sunrise Healthcare", value: "Sunrise Healthcare" },
];

const validateEmail = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};


const checkPasswordStrength = (password: string) => {

  const passwordSpecialChars = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;

  // Define criteria for password strength
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = passwordSpecialChars.test(password);

  // Calculate the total score based on criteria
  let score = 0;
  if (password.length >= minLength) score++;
  if (hasUpperCase) score++;
  if (hasLowerCase) score++;
  if (hasNumbers) score++;
  if (hasSpecialChars) score++;

  // Determine the strength based on the score
  if (score === 5) {
    return 'Strong';
  // } else if (score >= 3) {
  //   return 'Moderate';
  } else {
    return 'Weak';
  }
}

const storeLaunchData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

const getLaunchData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // saving error
  }
};

function extractTimeFromDate(dateString: Date) {
  const dateObject = new Date(dateString);

  // Get hours and minutes
  const hours = dateObject.getUTCHours();
  const minutes = dateObject.getUTCMinutes();

  // Format the time
  const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

  return formattedTime;
}


export {
  checkImageURL,
  avatarLetters,
  validateEmail,
  checkPasswordStrength,
  hospitalNames,
  storeLaunchData,
  getLaunchData,
  extractTimeFromDate,
};