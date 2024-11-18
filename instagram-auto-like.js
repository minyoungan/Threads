async function likeAllPostComments() {
    // Function to like comments in a post
    async function likeCommentsInPost() {
        const likeButtons = document.querySelectorAll('span._a9zu div[role="button"]');
        let likeCount = 0;
        
        // Process comments in reverse order
        for (let i = likeButtons.length - 1; i >= 0; i--) {
            const button = likeButtons[i];
            try {
                await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
                
                const svg = button.querySelector('svg[aria-label="Like"]');
                if (svg) {
                    button.click();
                    likeCount++;
                    console.log(`Liked comment ${likeCount} in current post`);
                }
            } catch (error) {
                console.error('Error liking comment:', error);
            }
        }
        return likeCount;
    }

    // Get all posts with the specific selector and convert to array
    const posts = Array.from(document.querySelectorAll('div.x1lliihq.x1n2onr6.xh8yej3.x4gyw5p.x1ntc13c.x9i3mqj.x11i5rnm.x2pgyrj > a[role="link"]'));
    console.log(`Found ${posts.length} posts`);
    
    let totalLikes = 0;
    let processedPosts = 0;

    // Process posts in reverse order
    for (let i = posts.length - 1; i >= 0; i--) {
        const post = posts[i];
        try {
            // Scroll post into view
            post.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Click on post to open it
            post.click();
            console.log(`Opening post ${posts.length - i}/${posts.length}`);
            
            // Wait for modal to open
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Like comments
            const likesInPost = await likeCommentsInPost();
            
            // If no comments to like, move to next post
            if (likesInPost === 0) {
                console.log('No comments to like in this post, moving to next');
                const closeButton = document.querySelector('svg[aria-label="Close"]')?.closest('button');
                if (closeButton) {
                    closeButton.click();
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
                continue;
            }
            
            totalLikes += likesInPost;
            processedPosts++;
            
            console.log(`Processed post ${processedPosts}/${posts.length}. Liked ${likesInPost} comments`);
            
            // Close modal
            const closeButton = document.querySelector('svg[aria-label="Close"]')?.closest('button');
            if (closeButton) {
                closeButton.click();
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
            // Update progress indicator
            updateProgress(processedPosts, posts.length, totalLikes);
            
        } catch (error) {
            console.error(`Error processing post ${posts.length - i}:`, error);
        }
    }

    console.log(`Finished processing ${processedPosts} posts`);
    console.log(`Total comments liked: ${totalLikes}`);
}

// Progress indicator functions
function addProgressIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'like-progress';
    indicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        z-index: 9999;
        font-family: Arial;
        font-size: 14px;
    `;
    document.body.appendChild(indicator);
    return indicator;
}

function updateProgress(current, total, likes) {
    const indicator = document.getElementById('like-progress');
    if (indicator) {
        indicator.textContent = `Processing: ${current}/${total} posts | Likes: ${likes}`;
    }
}

// Run the script
(async function() {
    const progress = addProgressIndicator();
    progress.textContent = 'Starting...';
    
    try {
        await likeAllPostComments();
        progress.textContent = 'Completed!';
        setTimeout(() => progress.remove(), 5000);
    } catch (error) {
        progress.textContent = 'Error: ' + error.message;
        console.error('Script error:', error);
    }
})();
