/*
Source: https://gist.github.com/elado/69fa611d84305dea4b38801880743928
Originally shared by rogirnall.

📌 Usage:
1. Open your browser's Developer Console on the Amex offer page.
2. Paste and run this script.
3. It will automatically click all "Add to Card" buttons one at a time, with a small random delay.
*/
// Create an array of all buttons with title 'Add to Card'
const btns = Array.from(document.querySelectorAll("button[title='Add to Card']"));

// Define a recursive function to click buttons one by one with random delay
const clickNext = () => {
  // Pop a button from the array
  const b = btns.pop();

  // If no more buttons left, log completion and return
  if (!b) {
    console.log("✅ All offers have been added!");
    return;
  }

  // Click the current button
  b.click();

  // Log which button was clicked using its ARIA label
  console.log("Clicked: " + b.getAttribute("aria-label"));

  // Wait for a random time (800ms to ~2300ms) before clicking the next one
  setTimeout(clickNext, 1500 * Math.random() + 800);
};

// Start the clicking loop
clickNext();
