// 2. Selectors based on the HTML you provided.
const FOLLOWING_TAB_SELECTOR = 'div[aria-label="Following"]';
const SCROLL_CONTAINER_SELECTOR = 'div.xb57i2i';

// 3. Delays to make the script behave more like a human (values are in milliseconds).
const SCROLL_INTERVAL_MS = 2500; // Time between each scroll down.
const UNFOLLOW_DELAY_MS = 4000;  // Time between each unfollow action. Increase if you encounter issues.


// --- SCRIPT LOGIC (No changes needed below) ---

// Helper function to create a delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Process the raw follower data into a clean Set for fast lookups.
function getFollowersSet(data) {
    const followersSet = new Set();
    data.followers.forEach(follower => {
        // Clean the username: remove leading '@' and anything after a '/'
        let cleanName = follower.startsWith('@') ? follower.substring(1) : follower;
        if (cleanName.includes('/')) {
            cleanName = cleanName.split('/')[0];
        }
        followersSet.add(cleanName);
    });
    console.log(`Created a list of ${followersSet.size} followers to keep.`);
    return followersSet;
}

// Main function to orchestrate the entire process
async function startUnfollowProcess() {
    console.log('--- Starting Unfollow Process ---');
    const followersToKeep = getFollowersSet(followersData);

    // 1. Click the 'Following' tab
    const followingTab = document.querySelector(FOLLOWING_TAB_SELECTOR);
    if (!followingTab) {
        console.error('ERROR: Could not find the "Following" tab. Is the pop-up open?');
        return;
    }
    console.log('Switching to the "Following" tab...');
    followingTab.click();
    await sleep(3000); // Wait for tab content to load

    // 2. Scroll to the bottom of the "Following" list
    console.log('Scrolling to the end of your "Following" list to load all users...');
    const scrollableElement = document.querySelector(SCROLL_CONTAINER_SELECTOR);
    if (!scrollableElement) {
        console.error('ERROR: Could not find the scrollable container. The website may have updated.');
        return;
    }

    let lastHeight = 0;
    let stableCount = 0;
    while (stableCount < 3) {
        scrollableElement.scrollTo(0, scrollableElement.scrollHeight);
        await sleep(SCROLL_INTERVAL_MS);
        let newHeight = scrollableElement.scrollHeight;
        if (newHeight === lastHeight) {
            stableCount++;
            console.log(`Scroll height stable. Check ${stableCount} of 3...`);
        } else {
            stableCount = 0;
        }
        lastHeight = newHeight;
    }
    console.log('Finished scrolling. All "Following" users should be loaded.');

    // 3. Identify users to unfollow
    console.log('Identifying users to unfollow...');
    const usersToUnfollow = [];
    const allFollowingLinks = document.querySelectorAll('a[href^="/@"]');
    
    const allFollowingUsernames = new Set();
    allFollowingLinks.forEach(link => {
        const href = link.getAttribute('href');
        let username = href.substring(2); // from "/@username" to "username"
        allFollowingUsernames.add(username);
    });

    allFollowingUsernames.forEach(username => {
        if (!followersToKeep.has(username)) {
            usersToUnfollow.push(username);
        }
    });

    if (usersToUnfollow.length === 0) {
        console.log('Congratulations! You are not following anyone who doesn\'t follow you back.');
        return;
    }

    console.log(`Found ${usersToUnfollow.length} user(s) to unfollow. Starting the process now.`);
    console.log('This may take a while. Please do not close this window.');

    // 4. Iterate and unfollow each user
    let unfollowedCount = 0;
    for (const username of usersToUnfollow) {
        const userRow = document.querySelector(`a[href="/@${username}"]`);
        if (!userRow) {
            console.warn(`Could not find row for @${username}. They may have been removed already.`);
            continue;
        }

        const followingButton = userRow.closest('div[data-pressable-container="true"]')?.querySelector('div[role="button"]');
        if (followingButton && followingButton.textContent.includes('Following')) {
            console.log(`Unfollowing @${username}...`);
            followingButton.click();
            await sleep(1500); // Wait for confirmation pop-up

            // Find and click the final "Unfollow" button in the confirmation dialog
            const confirmButtons = document.querySelectorAll('div[role="button"] span');
            let unfollowConfirmButton;
            confirmButtons.forEach(btn => {
                if (btn.textContent.toLowerCase() === 'unfollow') {
                    unfollowConfirmButton = btn;
                }
            });

            if (unfollowConfirmButton) {
                unfollowConfirmButton.click();
                unfollowedCount++;
                console.log(`Successfully unfollowed @${username}. Progress: ${unfollowedCount} / ${usersToUnfollow.length}`);
            } else {
                console.error(`Could not find the final Unfollow button for @${username}. Skipping.`);
            }
        } else {
             console.warn(`Could not find a "Following" button for @${username}. Skipping.`);
        }
        
        await sleep(UNFOLLOW_DELAY_MS); // Wait before proceeding to the next user
    }

    console.log(`--- PROCESS COMPLETE ---`);
    console.log(`Unfollowed a total of ${unfollowedCount} users.`);
}

// Start the process
startUnfollowProcess();
