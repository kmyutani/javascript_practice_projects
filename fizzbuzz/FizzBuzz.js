var numFizzBuzz = 15;

for (let step = 1; step < numFizzBuzz; step++) {
    if (step % 3 === 0 && step % 5 === 0) {
        console.log("FizzBuzz")
    } else if (step % 3 === 0) {
        console.log("Fizz")
    } else if (step % 5 === 0) {
        console.log("Buzz")
    } else {
        console.log(step)
    }
}

