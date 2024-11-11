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

// Function to click all like buttons with lazy scrolling and random pauses
async function clickAllLikeButtons() {
    let totalClicked = 0;
    let lastScrollHeight = 0;

    for (let iteration = 0; iteration < 1000; iteration++) {
        console.log(`Starting iteration ${iteration + 1}`);

        // Select all SVG elements with aria-label "Like"
        const likeButtons = document.querySelectorAll('svg[aria-label="Like"]');
        
        for (const button of likeButtons) {
            // Find the closest clickable parent div
            const clickableParent = button.closest('div[role="button"]') || button.closest('div');
            if (clickableParent && !clickableParent.dataset.clicked) {
                // Scroll the button into view
                clickableParent.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await sleep(500); // Wait for scroll to complete

                // Click the button if it's visible
                if (clickableParent.getBoundingClientRect().top >= 0 && clickableParent.getBoundingClientRect().bottom <= window.innerHeight) {
                    clickableParent.click();
                    clickableParent.dataset.clicked = 'true';
                    totalClicked++;

                    console.log(`Clicked ${totalClicked} like buttons.`);

                    // Random pause between 1 and 3 seconds
                    await sleep(getRandomInt(1000, 3000));
                }
            }
        }

        // Scroll down smoothly
        await smoothScroll(500);

        // Wait for 20 seconds after scrolling
        console.log("Waiting 20 seconds for new content to load...");
        await sleep(20000);

        // Check if new content has loaded
        if (document.body.scrollHeight === lastScrollHeight) {
            console.log("No new content loaded. Continuing to scroll...");
        } else {
            console.log("New content loaded.");
        }
        lastScrollHeight = document.body.scrollHeight;

        // Check if we've reached the end of the page
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            console.log("Reached end of page. Waiting for new content...");
            await sleep(20000); // Wait additional 20 seconds at the bottom of the page
            if (document.body.scrollHeight === lastScrollHeight) {
                console.log("No new content loaded at the bottom. Ending script.");
                break;
            }
        }
    }

    console.log(`Completed. Total liked: ${totalClicked} buttons.`);
}

// Execute the function
clickAllLikeButtons();
