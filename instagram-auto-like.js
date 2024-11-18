// Function to like comments with delay and error handling
async function likeInstagramComments() {
    // Helper function for random delay
    const randomDelay = (min, max) => {
        return new Promise(resolve => {
            const delay = Math.floor(Math.random() * (max - min + 1)) + min;
            setTimeout(resolve, delay);
        });
    };

    // Find all like buttons that aren't already liked
    const findLikeButtons = () => {
        const buttons = document.querySelectorAll('span._a9zu div[role="button"]');
        return Array.from(buttons).filter(button => {
            const svg = button.querySelector('svg[aria-label="Like"]');
            return svg && !button.classList.contains('liked');
        });
    };

    // Main like process
    async function processLikes() {
        const likeButtons = findLikeButtons();
        let likeCount = 0;
        const maxLikes = 25; // Safety limit
        
        console.log(`Found ${likeButtons.length} comments to like`);

        for (const button of likeButtons) {
            try {
                // Check if we've reached the limit
                if (likeCount >= maxLikes) {
                    console.log('Reached maximum like limit');
                    break;
                }

                // Scroll button into view
                button.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Random delay between 2-5 seconds
                await randomDelay(2000, 5000);

                // Click the like button
                button.click();
                likeCount++;
                
                // Add visual feedback
                button.classList.add('liked');
                console.log(`Liked comment ${likeCount}`);

            } catch (error) {
                console.error('Error liking comment:', error);
                continue;
            }
        }

        return likeCount;
    }

    // Add visual feedback styles
    const addStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .liked svg {
                color: #ed4956 !important;
                fill: #ed4956 !important;
            }
            .like-counter {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                z-index: 9999;
            }
        `;
        document.head.appendChild(style);
    };

    // Add progress counter
    const addCounter = () => {
        const counter = document.createElement('div');
        counter.className = 'like-counter';
        counter.textContent = 'Starting...';
        document.body.appendChild(counter);
        return counter;
    };

    // Main execution
    try {
        addStyles();
        const counter = addCounter();
        
        // Load more comments if available
        const loadMoreButton = document.querySelector('button._abl-');
        if (loadMoreButton) {
            loadMoreButton.click();
            await randomDelay(2000, 3000);
        }

        const totalLiked = await processLikes();
        counter.textContent = `Liked ${totalLiked} comments`;
        
        // Remove counter after 5 seconds
        setTimeout(() => counter.remove(), 5000);

    } catch (error) {
        console.error('Main process error:', error);
    }
}

// Run the script
likeInstagramComments();
