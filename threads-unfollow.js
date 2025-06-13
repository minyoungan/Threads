/**
 * This script first clicks on the "Following" tab, then automatically scrolls
 * through the entire list, collecting all usernames. Finally, it iterates
 * through the collected list and prints each username to the console.
 */

// --- CONFIGURATION ---
// Selector for the "Following" tab button.
const FOLLOWING_TAB_SELECTOR = 'div[aria-label="Following"]';
// Selector for the scrollable container div.
const SCROLL_CONTAINER_SELECTOR = 'div.xb57i2i';
// Selector for the links that contain the usernames.
const USERNAME_LINK_SELECTOR = 'a[href^="/@"]';
// Time between scrolls in milliseconds (e.g., 2000ms = 2 seconds).
const SCROLL_INTERVAL_MS = 2000;
// How many times to check for the end of the list before stopping.
const STABILITY_CHECKS = 3;


// --- SCRIPT LOGIC (No changes needed below) ---
const uniqueUsernames = new Set();
let scrollIntervalId;
let lastUserCount = -1;
let staleCheckCount = 0;

// Function to find all username links and add them to our list.
function extractUsernames() {
    const userLinks = document.querySelectorAll(USERNAME_LINK_SELECTOR);
    userLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            const username = href.substring(1); // from "/@username" to "@username"
            uniqueUsernames.add(username);
        }
    });
}

// Function to stop the process and print the results.
function finishAndPrintUsernames() {
    clearInterval(scrollIntervalId); // Stop the scrolling.
    
    extractUsernames(); // Perform one final extraction.

    const followersArray = Array.from(uniqueUsernames);
    
    console.log(`\n--- Printing ${followersArray.length} Following Usernames ---`);
    
    // Iterate and log each username to the console.
    followersArray.forEach(username => {
        console.log(`@${username}`);
    });

    console.log(`--- Finished printing all usernames. ---`);
}

// The main loop that scrolls and gathers data.
function performScrollAndGather() {
    const scrollableElement = document.querySelector(SCROLL_CONTAINER_SELECTOR);
    if (!scrollableElement) {
        console.error('ERROR: Could not find the scrollable element. The website layout may have changed.');
        clearInterval(scrollIntervalId);
        return;
    }

    // 1. Extract usernames currently visible.
    extractUsernames();
    const currentUserCount = uniqueUsernames.size;
    console.log(`Collected ${currentUserCount} unique usernames...`);

    // 2. Check if the list has stopped growing.
    if (currentUserCount === lastUserCount) {
        staleCheckCount++;
        console.log(`List size unchanged. Stability check ${staleCheckCount} of ${STABILITY_CHECKS}.`);
    } else {
        staleCheckCount = 0; // Reset counter if new users were found.
    }
    lastUserCount = currentUserCount;

    if (staleCheckCount >= STABILITY_CHECKS) {
        console.log('Reached the end of the "Following" list.');
        finishAndPrintUsernames();
        return;
    }
    
    // 3. Scroll down to load more accounts.
    scrollableElement.scrollTo(0, scrollableElement.scrollHeight);
}

// --- SCRIPT EXECUTION START ---
function startScraping() {
    const followingTab = document.querySelector(FOLLOWING_TAB_SELECTOR);
    if (!followingTab) {
        console.error('ERROR: Could not find the "Following" tab. Make sure the followers/following pop-up is open.');
        return;
    }
    
    console.log('Clicking the "Following" tab...');
    followingTab.click();

    // Wait a moment for the content to load after the click.
    setTimeout(() => {
        console.log('Starting to scroll and gather usernames...');
        console.log('To stop manually, type "clearInterval(scrollIntervalId);" and press Enter.');
        scrollIntervalId = setInterval(performScrollAndGather, SCROLL_INTERVAL_MS);
    }, 3000); // 3-second delay to ensure the list loads.
}

startScraping();
