const polishalphabet = [
    'A', 'Ą', 'B', 'C', 'Ć', 'D', 'E', 'Ę', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'Ł', 'M',
    'N', 'Ń', 'O', 'Ó', 'P', 'R', 'S', 'Ś', 'T', 'Q', 'U', 'W', 'V','Y','X', 'Z', 'Ź', 'Ż'
];

let globalMatrix = null; // Global variable to store the matrix

const validateKey = (key) => {
    const upperKey = key.toUpperCase();
    for (const char of upperKey) {
        if (!polishalphabet.includes(char) && char!='X') {
            return false;
        }
    }
    return true;
};

const createMatrix = (key) => {
    key = key.toUpperCase().replace(/J/g, 'I');
    const uniqueChars = Array.from(new Set(key + polishalphabet.join('')));
    const matrix = [];
    for (let i = 0; i < 6; i++) {
        matrix.push(uniqueChars.slice(i * 6, (i + 1) * 6));
    }
    return matrix;
};

const getPosition = (char, matrix) => {
    for (let row = 0; row < matrix.length; row++) {
        const col = matrix[row].indexOf(char);
        if (col !== -1) {
            return { row, col };
        }
    }
    return null;
};

const createDigraphs = (text) => {
    let cleanedText = text.toUpperCase().replace(/J/g, 'I');
    let digraphs = [];
    for (let i = 0; i < cleanedText.length; i += 2) {
        let firstChar = cleanedText[i];
        let secondChar = cleanedText[i + 1] || 'X';
        if (firstChar === secondChar) {
            secondChar = 'X';
            i--;
        }
        digraphs.push(firstChar + secondChar);
    }
    return digraphs;
};

const encryptDigraphs = (digraphs, matrix) => {
    let encrypted = '';
    digraphs.forEach(digraph => {
        const [firstChar, secondChar] = digraph;
        const pos1 = getPosition(firstChar, matrix);
        const pos2 = getPosition(secondChar, matrix);
        if (pos1.row === pos2.row) {
            encrypted += matrix[pos1.row][(pos1.col + 1) % 6] + matrix[pos2.row][(pos2.col + 1) % 6];
        } else if (pos1.col === pos2.col) {
            encrypted += matrix[(pos1.row + 1) % 6][pos1.col] + matrix[(pos2.row + 1) % 6][pos2.col];
        } else {
            encrypted += matrix[pos1.row][pos2.col] + matrix[pos2.row][pos1.col];
        }
    });
    return encrypted;
};

const decryptDigraphs = (digraphs, matrix) => {
    let decrypted = '';
    digraphs.forEach(digraph => {
        const [firstChar, secondChar] = digraph;
        const pos1 = getPosition(firstChar, matrix);
        const pos2 = getPosition(secondChar, matrix);
        if (pos1.row === pos2.row) {
            decrypted += matrix[pos1.row][(pos1.col + 5) % 6] + matrix[pos2.row][(pos2.col + 5) % 6];
        } else if (pos1.col === pos2.col) {
            decrypted += matrix[(pos1.row + 5) % 6][pos1.col] + matrix[(pos2.row + 5) % 6][pos2.col];
        } else {
            decrypted += matrix[pos1.row][pos2.col] + matrix[pos2.row][pos1.col];
        }
    });
    return decrypted;
};


function encrypt() {
    const inputText = document.getElementById('encryptText').value;
    if (!inputText) {
        alert('Please enter text to encrypt.');
        return;
    }
    if(validateKey(inputText))
    {
    let textToEncrypt = inputText;
    if (textToEncrypt.length % 2 !== 0) {
        textToEncrypt += 'X'; // Append 'X' if the length of the text is odd
    }
    globalMatrix = createMatrix(textToEncrypt); // Store the matrix in the global variable
    const digraphs = createDigraphs(textToEncrypt);
    const encryptedText = encryptDigraphs(digraphs, globalMatrix);

    document.getElementById('decryptText').value = encryptedText;
    }
    else
    {
        alert('Please enter proprer text to encrypt.');
        return;
    }
}

function decrypt() {
    const inputText = document.getElementById('decryptText').value;
    if (!inputText) {
        alert('Please enter text to decrypt.');
        return;
    }
    if(validateKey(inputText))
    {
    if (!globalMatrix) {
        alert('Matrix not initialized. Please encrypt some text first.');
        return;
    }
    const digraphs = inputText.match(/.{1,2}/g);
    let decryptedText = decryptDigraphs(digraphs, globalMatrix);
    if (decryptedText.endsWith('X')) {
        decryptedText = decryptedText.slice(0, -1); // Remove 'X' if it was added during encryption
    }

    document.getElementById('encryptText').value = decryptedText;
    }
    else
    {
        alert('Please enter proprer text to decrypt.');
        return;
    }
}
function refreshPage() {
            location.reload();
        }
window.onload = () => {
    console.log('Page loaded, ready for encryption.');
};
