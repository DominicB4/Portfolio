document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const container = document.getElementById('container');
    const npcs = document.querySelectorAll('.npc');
    const dialogueMenu = document.getElementById('dialogueMenu');
    const aboutMenu = document.getElementById('aboutMenu');
    const nextButton = document.getElementById('nextButton');
    const closeButton = document.getElementById('closeButton');
    const learnMoreButton = document.getElementById('learnMoreButton');
    const backButton = document.getElementById('backButton');
    const dialogueText = document.getElementById('dialogueText');

    const step = 5;
    const jumpHeight = 20;
    const gravity = 1;
    const floorHeight = 0;
    const dashSpeed = 20;
    const dashDuration = 20;

    let posX = 0;
    let posY = floorHeight;
    let keys = {};
    let currentDirection = 'idle';
    let isMoving = false;
    let isJumping = false;
    let jumpVelocity = 0;
    let isGrounded = true;
    let isDashing = false;
    let dashFrameCount = 0;
    let dashDirection = 'right';
    let interactingNpc = null;
    let activeMenu = null;
    let dialogueIndex = 0;
    let dialogueArray = [
        "Well, Hello there...",
        "Never seen you 'round these parts. But don't expect much sightseeing in these plains...",
        "For with our new lord arisen, The Lord of The Mechanas, has brought disaster to our home. We pray one day a saviour; a hero, will come by and free our lands.",
        "Thank you for listening to our tale! have fun jumping and running around, keep your eyes open for any secrets, and check on that green slime when you get a chance!"
    ];

    const directions = {
        'left': 'assets/spriteRun.gif',
        'right': 'assets/spriteRun.gif',
        'jump': 'assets/spriteJump.gif',
        'dash': 'assets/spriteDash.png',
        'parry': 'assets/spriteParry.gif'
    };

    const idleDirections = {
        'idle': 'assets/spriteIdle.gif'
    };

    const npcOriginalSprites = {
        'exitNpc': 'assets/exitSpriteInactive.gif',
        'aboutNpc': 'assets/aboutSpriteInactive.gif'
    };

    const npcCollisionSprites = {
        'exitNpc': 'assets/exitSpriteActive.gif',
        'aboutNpc': 'assets/aboutSpriteActive.gif'
    };

    const controlMenu = document.getElementById('controlMenu');
    let controlMenuVisible = true;

    document.addEventListener('keydown', (event) => {
        keys[event.key] = true;
        if (event.key === 'e' && interactingNpc) {
            openMenu(interactingNpc);
        }
        if (event.key === 'r') {
            toggleControlMenu();
        }
    });

    document.addEventListener('keyup', (event) => {
        keys[event.key] = false;
        checkIdleState();
    });

    nextButton.addEventListener('click', () => {
        advanceDialogue();
    });

    closeButton.addEventListener('click', () => {
        closeMenu();
    });

    learnMoreButton.addEventListener('click', () => {
        window.location.href = 'about.html';
    });

    backButton.addEventListener('click', () => {
        closeMenu();
    });

    function checkIdleState() {
        if (!keys['w'] && !keys['a'] && !keys['s'] && !keys['d'] && !isJumping && !isDashing) {
            if (currentDirection !== 'idle') {
                player.src = idleDirections['idle'];
                currentDirection = 'idle';
            }
        }
    }

    function openMenu(npc) {
        if (npc.id === 'exitNpc') {
            dialogueIndex = 0;
            typeWriterEffect(dialogueArray[dialogueIndex], dialogueText);
            dialogueMenu.style.display = 'block';
            activeMenu = dialogueMenu;
        } else if (npc.id === 'aboutNpc') {
            aboutMenu.style.display = 'block';
            activeMenu = aboutMenu;
        }
    }

    function closeMenu() {
        if (activeMenu) {
            activeMenu.style.animation = 'zoomOut 0.3s ease-out';
            setTimeout(() => {
                activeMenu.style.display = 'none';
                activeMenu.style.animation = ''; // Reset animation property
                activeMenu = null;
            }, 300); // Match this duration to the zoomOut animation duration
        }
    }

    function advanceDialogue() {
        dialogueIndex++;
        if (dialogueIndex < dialogueArray.length) {
            typeWriterEffect(dialogueArray[dialogueIndex], dialogueText);
        } else {
            closeMenu();
        }
    }

    function updatePosition() {
        let newDirection = currentDirection;
        isMoving = false;
    
        if (keys['a'] && !isDashing) {
            posX = Math.max(0, posX - step);
            newDirection = 'left';
            isMoving = true;
            dashDirection = 'left';
        }
        if (keys['s'] && !isDashing) {
            newDirection = 'parry';
            isMoving = true;
        }
        if (keys['d'] && !isDashing) {
            posX = Math.min(container.offsetWidth - player.offsetWidth, posX + step);
            newDirection = 'right';
            isMoving = true;
            dashDirection = 'right';
        }
    
        if (keys['w'] && !isJumping && isGrounded && !isDashing) {
            isJumping = true;
            isGrounded = false;
            jumpVelocity = jumpHeight;
            player.src = directions['jump'];
        }
    
        if (keys['q'] && !isDashing && !isJumping) {
            // Dash logic
            isDashing = true;
            dashFrameCount = 0;
            player.src = directions['dash'];
    
            // Cancel vertical velocity during dash
            if (isJumping) {
                isJumping = false;
                jumpVelocity = 0;
            }
        }
    
        if (isJumping) {
            posY += jumpVelocity;
            jumpVelocity -= gravity;
    
            if (posY <= floorHeight) {
                posY = floorHeight;
                isJumping = false;
                isGrounded = true;
                player.src = idleDirections['idle']; // Set to idle after landing
                checkIdleState();
            }
        }
    
        if (isDashing) {
            dashFrameCount++;
            if (dashDirection === 'left') {
                posX = Math.max(0, posX - dashSpeed);
            } else {
                posX = Math.min(container.offsetWidth - player.offsetWidth, posX + dashSpeed);
            }
            if (dashFrameCount >= dashDuration) {
                isDashing = false;
                player.src = idleDirections['idle']; // Reset to idle after dash
                checkIdleState();
            }
        }
    
        if (!isJumping && !isDashing && isGrounded) {
            if (isMoving) {
                if (currentDirection !== newDirection) {
                    player.src = directions[newDirection];
                    currentDirection = newDirection;
                }
            } else {
                if (currentDirection !== 'idle') {
                    player.src = idleDirections['idle'];
                    currentDirection = 'idle';
                }
            }
        }
    
        // Flip the player when moving left
        if (dashDirection === 'left' || newDirection === 'left') {
            player.classList.add('flipped');
        } else if (dashDirection === 'right' || newDirection === 'right') {
            player.classList.remove('flipped');
        }
    
        player.style.left = `${posX}px`;
        player.style.bottom = `${posY}px`;
    
        checkCollisions();
    
        requestAnimationFrame(updatePosition);
    }
    
    
    
    
    

    function checkCollisions() {
        const playerRect = player.getBoundingClientRect();
        interactingNpc = null;
        npcs.forEach(npc => {
            const npcRect = npc.getBoundingClientRect();
            if (playerRect.left < npcRect.right &&
                playerRect.right > npcRect.left &&
                playerRect.top < npcRect.bottom &&
                playerRect.bottom > npcRect.top) {
                interactingNpc = npc;
                showTextBubble(npc);
                npc.src = npcCollisionSprites[npc.id];
            } else {
                hideTextBubble(npc);
                npc.src = npcOriginalSprites[npc.id];
                if (activeMenu && interactingNpc === npc) {
                    closeMenu();
                }
            }
        });
    }

    function showTextBubble(npc) {
        let textBubble = npc.querySelector('.text-bubble');
        if (!textBubble) {
            textBubble = document.createElement('div');
            textBubble.classList.add('text-bubble');
            textBubble.innerText = 'Press E';
            npc.appendChild(textBubble);
        }
        textBubble.style.display = 'block';
    }

    function hideTextBubble(npc) {
        const textBubble = npc.querySelector('.text-bubble');
        if (textBubble) {
            textBubble.style.display = 'none';
        }
    }

    function typeWriterEffect(text, element) {
        let i = 0;
        element.innerText = '';
        const speed = 35; // Adjust speed as needed

        function typeWriter() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }

        typeWriter();
    }

    function toggleControlMenu() {
        if (controlMenuVisible) {
            controlMenu.classList.add('hidden');
        } else {
            controlMenu.classList.remove('hidden');
        }
        controlMenuVisible = !controlMenuVisible;
    }

    updatePosition();
});
