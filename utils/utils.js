const morseCode = {
  '.-': 'A',
  '-...': 'B',
  '-.-.': 'C',
  '-..': 'D',
  '.': 'E',
  '..-.': 'F',
  '--.': 'G',
  '....': 'H',
  '..': 'I',
  '.---': 'J',
  '-.-': 'K',
  '.-..': 'L',
  '--': 'M',
  '-.': 'N',
  '---': 'O',
  '.--.': 'P',
  '--.-': 'Q',
  '.-.': 'R',
  '...': 'S',
  '-': 'T',
  '..-': 'U',
  '...-': 'V',
  '.--': 'W',
  '-..-': 'X',
  '-.--': 'Y',
  '--..': 'Z',
  '-----': '0',
  '.----': '1',
  '..---': '2',
  '...--': '3',
  '....-': '4',
  '.....': '5',
  '-....': '6',
  '--...': '7',
  '---..': '8',
  '----.': '9',
};

function decodeMorse(morseString) {
  return morseString
    .split(' ')
    .map((symbol) => morseCode[symbol] || '')
    .join('');
}

function createUser(socketID, userName) {
  const user = {};
  user.id = socketID;
  user.name = userName;
  user.role = generateRole(userName);
  user.joined = false;
  user.room = { id: socketID, name: userName };
  user.invitedUserID = '';

  return user;
}

function generateRole(username) {
  const name = username.toLowerCase();
  if (name.includes('newby')) {
    return 'newby';
  }
  return 'new';
}

module.exports = { createUser, decodeMorse };
