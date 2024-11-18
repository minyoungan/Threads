// Function to sleep for a given number of milliseconds
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to get a random number between min and max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to scroll smoothly
async function smoothScroll(pixelsToScroll) {
    const scrollStep = 50;
    const scrollDelay = 20;
    const totalSteps = Math.ceil(pixelsToScroll / scrollStep);

    for (let i = 0; i < totalSteps; i++) {
        window.scrollBy(0, scrollStep);
        await sleep(scrollDelay);
    }
}

// Function to perform lazy loading
async function lazyLoad(times) {
    for (let i = 0; i < times; i++) {
        console.log(`Lazy loading... (${i + 1}/${times})`);
        await smoothScroll(1000); // Scroll down 1000 pixels
        await sleep(5000); // Wait 5 seconds for new content to load
    }
}

// Function to like all buttons that are not already liked
async function likeAllButtons() {
    let totalClicked = 0;

    // Select all SVG elements with aria-label "Like"
    const likeButtons = document.querySelectorAll('svg[aria-label="Like"]');

    for (const button of likeButtons) {
        // Find the closest clickable parent div
        const clickableParent = button.closest('div[role="button"]') || button.closest('div');
        if (clickableParent && !clickableParent.dataset.clicked) {
            // Scroll the button into view
            clickableParent.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await sleep(1000); // Wait for scroll to complete

            // Click the button if it's visible
            if (clickableParent.getBoundingClientRect().top >= 0 && clickableParent.getBoundingClientRect().bottom <= window.innerHeight) {
                clickableParent.click();
                clickableParent.dataset.clicked = 'true';
                totalClicked++;

                console.log(`Clicked ${totalClicked} like buttons.`);

                // Random pause between 0.5 and 3 seconds
                await sleep(getRandomInt(500, 3000));
            }
        }
    }

    console.log(`Completed liking. Total clicked: ${totalClicked}`);
}

// Main function to execute the lazy loading and liking process indefinitely
async function clickAllLikeButtonsIndefinitely() {
    while (true) {
        console.log("Starting lazy loading...");
        await lazyLoad(10); // Perform lazy loading 10 times

        console.log("Starting to like buttons...");
        await likeAllButtons(); // Like all the like buttons not already clicked

        console.log("Cycle completed. Restarting the process...");
    }
}

// Execute the infinite loop function
clickAllLikeButtonsIndefinitely();
