const { LensClient, development } = require('@lens-protocol/client');
const { ethers } = require('ethers');

// Initialize LensClient
const lensClient = new LensClient({
  environment: development,
});

// Replace with your wallet's private key
const privateKey = 'your_private_key_here'  //Your Ethereum private key
const provider = new ethers.JsonRpcProvider('https://polygon-mumbai.infura.io/v3/your_infura_project_id_here');
const wallet = new ethers.Wallet(privateKey, provider);

// Authenticate with Lens
async function authenticate() {
  const address = await wallet.getAddress();

  // Generate challenge
  const challenge = await lensClient.authentication.generateChallenge({
    signedBy: address, // Pass the address as part of the ChallengeRequest object
  });

  const signature = await wallet.signMessage(challenge.text); // Sign the challenge text

  // Authenticate with the signed challenge
  const result = await lensClient.authentication.authenticate({
    address: address,
    signature: signature,
  });

  if (result.isSuccess()) {
    console.log('Authenticated successfully!');
  } else {
    console.error('Failed to authenticate:', result.error);
  }
}

// Create a post
async function createPost() {
  const result = await lensClient.publication.postOnchain({
    content: 'Hello, Lens! This is my first post.',
  });

  if (result.isSuccess()) {
    console.log('Post created successfully:', result.value);
    return result.value;
  } else {
    console.error('Failed to create post:', result.error);
  }
}

// Create a comment
async function createComment(postId) {
  const result = await lensClient.publication.commentOnchain({
    publicationId: postId,
    content: 'This is a comment on the post!',
  });

  if (result.isSuccess()) {
    console.log('Comment created successfully:', result.value);
  } else {
    console.error('Failed to create comment:', result.error);
  }
}

// Main function
async function main() {
  await authenticate();

  const post = await createPost();
  if (post) {
    await createComment(post.id);
  }
}

main().catch(console.error);