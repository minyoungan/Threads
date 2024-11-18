async function likeAllPostComments() {
    // Function to like comments in a post
    async function likeCommentsInPost() {
        const likeButtons = document.querySelectorAll('span._a9zu div[role="button"]');
        let likeCount = 0;
        
        for (const button of likeButtons) {
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

    // Get all posts
    const posts = document.querySelectorAll('a[role="link"]');
    console.log(`Found ${posts.length} posts`);
    
    let totalLikes = 0;
    let processedPosts = 0;

    for (const post of posts) {
        try {
            // Click on post to open it
            post.click();
            console.log(`Opening post ${processedPosts + 1}/${posts.length}`);
            
            // Wait for modal to open
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Like comments
            const likesInPost = await likeCommentsInPost();
            totalLikes += likesInPost;
            processedPosts++;
            
            console.log(`Processed post ${processedPosts}/${posts.length}. Liked ${likesInPost} comments`);
            
            // Close modal (find and click close button)
            const closeButton = document.querySelector('svg[aria-label="Close"]').closest('button');
            if (closeButton) closeButton.click();
            
            // Wait before next post
            await new Promise(resolve => setTimeout(resolve, 2000));
            
        } catch (error) {
            console.error(`Error processing post ${processedPosts + 1}:`, error);
        }
    }

    console.log(`Finished processing ${processedPosts} posts`);
    console.log(`Total comments liked: ${totalLikes}`);
}

// Add progress indicator
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
    `;
    document.body.appendChild(indicator);
    return indicator;
}

// Run the script
(async function() {
    const progress = addProgressIndicator();
    progress.textContent = 'Starting...';
    
    try {
        await likeAllPostComments();
        progress.textContent = 'Completed!';
        setTimeout(() => progress.remove(), 3000);
    } catch (error) {
        progress.textContent = 'Error: ' + error.message;
        console.error('Script error:', error);
    }
})();
