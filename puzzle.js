var fnames = ['Elliot', 'George', 'Harvey', 'John', 'Michael'],
    lnames = ['Almond', 'Bixby', 'Crawford', 'Grace', 'Maxwell'],
    departments = ['Customer Service', 'Engineering', 'Finance', 'Manufacturing', 'Marketing'],
    oses = ['Apple', 'Windows'];

var allOptions = [];
for (var a = 0; a < fnames.length; a++) {
  for (var b = 0; b < lnames.length; b++) {
    for (var c = 0; c < departments.length; c++) {
      for (var d = 0; d < oses.length; d++) {
        var option = {
          fname: fnames[a],
          lname: lnames[b],
          dept: departments[c],
          os: oses[d]
        };

        // we can exclude some options initially
        if (validOption(option)) {
          allOptions.push(option);
        }
      }
    }
  }
}

console.log(allOptions.length + " total option objects");
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

// every permutation
var count = 0;
for (var a = 0; a < allOptions.length; a++) {
  for (var b = 0; b < allOptions.length; b++) {
    for (var c = 0; c < allOptions.length; c++) {
      for (var d = 0; d < allOptions.length; d++) {
        for (var e = 0; e < allOptions.length; e++) {
          // use an array for each possibility, with the indexes representing days of the week
          var possibility = [allOptions[a], allOptions[b], allOptions[c], allOptions[d], allOptions[e]];

          if (validPermutation(possibility)) {
            console.log(formatPermutation(possibility));
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
          }
          count++;
        }
      }
    }
  }
}

console.log(count + " total option combinations");

function validOption(o) {
  // "John's last name wasn't Crawford"
  if (o.fname == 'John' && o.lname == 'Crawford') return false;

  // "John worked in Customer Service"
  if (o.fname == 'John' && o.dept != 'Customer Service') return false;

  // "Mr Grace didn't work in manufacturing"
  if (o.lname == 'Grace' && o.dept == 'Manufacturing') return false;

  // "Mr Maxwell's Apple computer"
  if (o.lname == 'Maxwell' && o.os != 'Apple') return false;

  // "Elliot's Windows computer"
  if (o.fname == 'Elliot' && o.os != 'Windows') return false;

  // "computer in marketing, which was not Harvey's"
  if (o.dept == 'Marketing' && o.fname == 'Harvey') return false;

  // "Mr Crawford, whose first name wasn't Elliot"
  if (o.lname == 'Crawford' && o.fname == 'Elliot') return false;

  // "Mr Crawford did not work in engineering"
  if (o.lname == 'Crawford' && o.dept == 'Engineering') return false;

  // "Michael did not work in marketing"
  if (o.fname == 'Michael' && o.dept == 'Marketing') return false;

  // "engineering computer was not George Bixby"
  if (o.dept == 'Engineering' && o.fname == 'George') return false;

  // "George Bixby"
  if (o.fname == 'George' && o.lname != 'Bixby') return false;

  // Rule #1: "Harvey" cannot be "Mr Almond"
  if (o.fname == 'Harvey' && o.lname == 'Almond') return false;

  // Rule #1: "Mr Almond" cannot be in finance
  if (o.lname == 'Almond' && o.dept == 'Finance') return false;

  // Rule #1: "Harvey" cannot be in finance
  if (o.fname == 'Harvey' && o.dept == 'Finance') return false;

  return true;
}

// there should be 2 Apple users and 3 Windows users
function correctOSCount(arr) {
  var windowsCount = 0,
      appleCount = 0;

  for (var i = 0; i < arr.length; i++) {
    if (arr[i].os == 'Windows') windowsCount++;
    if (arr[i].os == 'Apple') appleCount++;
  };

  return (windowsCount == 3 && appleCount == 2);
}

// "The Windows users were finance, Mr Almond, and Harvey"
function rule1(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].dept == 'Finance' && arr[i].os != 'Windows') return false;
    if (arr[i].lname == 'Almond' && arr[i].os != 'Windows') return false;
    if (arr[i].fname == 'Harvey' && arr[i].os != 'Windows') return false;
  }

  return true;
}

// "Wednesday belonged to an Apple user"
function rule2(arr) {
  return (arr[2].os == 'Apple');
}

function rule4(arr) {
  var maxwellIdx = false;
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].lname == 'Maxwell') maxwellIdx = i;
  }

  // Maxwell's computer could only be taken on Wed or Thurs
  if (maxwellIdx != 2 && maxwellIdx != 3) return false;

  // Maxwell's computer was taken the day before Elliot's computer
  if (arr[maxwellIdx + 1].fname != 'Elliot') return false;

  // Maxwell's computer was taken two days after marketing's computer
  if (arr[maxwellIdx - 2].dept != 'Marketing') return false;

  return true;
}

function rule6(arr) {
  // "Michael's computer was taken on Tuesday"
  if (arr[1].fname != 'Michael') return false;

  // "Engineering computer was taken on Friday"
  if (arr[4].dept != 'Engineering') return false;

  return true;
}

function hasRepeatVals(arr, k) {
  var o = {};
  for (var i = 0; i < arr.length; i++) {
    var val = arr[i][k];
    if (o[val]) return true;
    o[val] = true;
  }
  return false;
}

function containsDupes(arr) {
  if (hasRepeatVals(arr, "fname")) return true;
  if (hasRepeatVals(arr, "lname")) return true;
  if (hasRepeatVals(arr, "dept")) return true;

  return false;
}

function validPermutation(arr) {
  if (! rule2(arr)) return false;
  if (! rule6(arr)) return false;
  if (! correctOSCount(arr)) return false;
  if (! rule1(arr)) return false;
  if (! rule4(arr)) return false;
  if (containsDupes(arr)) return false;

  return true;
}

function formatPermutation(arr) {
  var str =
  'Mon: ' + arr[0].fname + ' ' + arr[0].lname + ', ' + arr[0].dept + ', ' + arr[0].os + '\n' +
  'Tue: ' + arr[1].fname + ' ' + arr[1].lname + ', ' + arr[1].dept + ', ' + arr[1].os + '\n' +
  'Wed: ' + arr[2].fname + ' ' + arr[2].lname + ', ' + arr[2].dept + ', ' + arr[2].os + '\n' +
  'Thu: ' + arr[3].fname + ' ' + arr[3].lname + ', ' + arr[3].dept + ', ' + arr[3].os + '\n' +
  'Fri: ' + arr[4].fname + ' ' + arr[4].lname + ', ' + arr[4].dept + ', ' + arr[4].os;

  return str;
}
