function rgbNum(escapeTime) {
  if (escapeTime <= 2) {
    // pin all escape times less than 3 to black
    return [0, 0, 0];
  } else if (escapeTime === iterations) {
    // normally this would be white, but that's too much white, so override
    return [0, 25, 0];
  }

  let redNum, greenNum, blueNum;
  let rgbIncrements = Math.floor(iterations / 7);
  let caseNum = Math.floor(escapeTime / rgbIncrements);
  let remainNum = escapeTime % rgbIncrements;

  switch (caseNum) {
    case 0:
      redNum = 0;
      greenNum = Math.floor(256 / rgbIncrements) * remainNum;
      blueNum = 0;
      break;
    case 1:
      redNum = 0;
      greenNum = 255;
      blueNum = Math.floor(256 / rgbIncrements) * remainNum;
      break;
    case 2:
      redNum = Math.floor(256 / rgbIncrements) * remainNum;
      greenNum = 255;
      blueNum = 255;
      break;
    case 3:
      redNum = Math.floor(256 / rgbIncrements) * remainNum;
      greenNum = 0;
      blueNum = 255;
      break;
    case 4:
      redNum = 255;
      greenNum = Math.floor(256 / rgbIncrements) * remainNum;
      blueNum = 255;
      break;
    case 5:
      redNum = 255;
      greenNum = Math.floor(256 / rgbIncrements) * remainNum;
      blueNum = 0
      break;
    case 6:
      redNum = 255;
      greenNum = 255;
      blueNum = Math.floor(256 / rgbIncrements) * remainNum;
  }

  return [redNum, greenNum, blueNum];
}
