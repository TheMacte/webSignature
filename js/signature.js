// Function to generate a signature using crypto.subtle
async function generateSignature(data, privateKey) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
  
    const signature = await crypto.subtle.sign(
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: { name: "SHA-256" },
      },
      privateKey,
      dataBuffer
    );
  
    // Convert the signature ArrayBuffer to base64
    const signatureArray = Array.from(new Uint8Array(signature));
    const base64Signature = btoa(String.fromCharCode(...signatureArray));
  
    return base64Signature;
  }
  
  // Function to verify a signature using crypto.subtle
  async function verifySignature(data, signature, publicKey) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
  
    // Convert the base64-encoded signature to ArrayBuffer
    const signatureArrayBuffer = Uint8Array.from(atob(signature), (c) =>
      c.charCodeAt(0)
    );
  
    const isValid = await crypto.subtle.verify(
      {
        name: "RSASSA-PKCS1-v1_5",
        hash: { name: "SHA-256" },
      },
      publicKey,
      signatureArrayBuffer,
      dataBuffer
    );
  
    return isValid;
  }
  
  // Function to print key values
  function printKeys(publicKey, privateKey) {
    crypto.subtle.exportKey("spki", publicKey).then((exportedPublicKey) => {
      console.log("Public Key:", btoa(String.fromCharCode(...new Uint8Array(exportedPublicKey))));
    });
  
    crypto.subtle.exportKey("pkcs8", privateKey).then((exportedPrivateKey) => {
      console.log("Private Key:", btoa(String.fromCharCode(...new Uint8Array(exportedPrivateKey))));
    });
  }
  
  // Example usage
  (async () => {
    // Generate a key pair using crypto.subtle
    const { publicKey, privateKey } = await crypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
        hash: { name: "SHA-256" },
      },
      true,
      ["sign", "verify"]
    );
  
    const data = "some_data_to_sign";
  
    // Print public key and private key
    printKeys(publicKey, privateKey);
  
    // Generate a signature
    const signature = await generateSignature(data, privateKey);
    console.log("Generated Signature:", signature);
  
    // Verify the signature
    const isSignatureValid = await verifySignature(data, signature, publicKey);
    console.log("Is Signature Valid?", isSignatureValid ? "Yes" : "No");
  })();
  