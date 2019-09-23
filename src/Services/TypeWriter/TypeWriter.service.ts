export default class TypeWriterService {
  public static getMistakeCharacter(character: string): string {
    const keyboard = ["qwertyuiop[", "asdfghjkl;", "zxcvbnm,"];
    const uppercase = character.toUpperCase() === character;
    const isLetter =
      "abcdefghijklmnopqrstuvwxyz".indexOf(character.toLowerCase()) !== -1;

    if (isLetter) {
      /*With a 90% chance, if the character is uppercase, make the
        mistake character the lowercase version of the uppercase.
        If it's lowercase, reverse the probability.*/
      const chanceOfCaseMistake = uppercase ? 0.9 : 0.1;
      if (Math.random() <= chanceOfCaseMistake) {
        return uppercase ? character.toLowerCase() : character.toUpperCase();
      }
      //Otherwise make a big finger mistake
      keyboard.forEach(keyRow => {
        const index = keyRow.indexOf(character.toLowerCase());
        if (index !== -1) {
          switch (index) {
            case 0:
              return keyRow[1];

            case keyRow.length - 1:
              return keyRow.length - 2;

            default:
              return Math.random() <= 0.5
                ? keyRow[index - 1]
                : keyRow[index + 1];
          }
        }
      });
    }

    //Handle special characters
    //TODO: this doesn't handle ' ' (space) very well... or at all.
    const specialCharacters = ["1234567890-=", "p[]\\", "l;'", "m,./"];
    const specialCharactersShift = ["!@#$%^&*()_+", "P{}|", 'L:"', "M<>?"];

    for (let i = 0; i < specialCharactersShift.length; i++) {
      const shiftedIndex = specialCharactersShift[i].indexOf(character);
      if (shiftedIndex !== -1) {
        //It's shifted, so with a 90% chance, make a shift mistake.  Otherwise, big finger mistake.
        if (Math.random() <= 0.9) {
          return specialCharacters[i][shiftedIndex];
        }
        switch (shiftedIndex) {
          case 0:
            return specialCharactersShift[i][1];

          case specialCharactersShift[i].length - 1:
            return specialCharactersShift[i][
              specialCharactersShift[i].length - 2
            ];

          default:
            return Math.random() <= 0.5
              ? specialCharactersShift[i][shiftedIndex - 1]
              : specialCharactersShift[i][shiftedIndex + 1];
        }
      }
    }

    for (let i = 0; i < specialCharacters.length; i++) {
      const index = specialCharactersShift[i].indexOf(character);
      if (index !== -1) {
        //It's not shifted, so with a 10% chance, make a shift mistake.  Otherwise, big finger mistake.
        if (Math.random() <= 0.1) {
          return specialCharactersShift[i][index];
        }
        switch (index) {
          case 0:
            return specialCharactersShift[i][1];

          case specialCharactersShift[i].length - 1:
            return specialCharactersShift[i][
              specialCharactersShift[i].length - 2
            ];

          default:
            return Math.random() <= 0.5
              ? specialCharactersShift[i][index - 1]
              : specialCharactersShift[i][index + 1];
        }
      }
    }
    //As a default, just return the given character.
    return character;
  }
}
