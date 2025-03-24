export function parseJwt(token) {
    if (!token) return null;
  
    try {
      const base64Payload = token.split('.')[1];
      const decodedPayload = atob(base64Payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('JWT çözümleme hatası:', error);
      return null;
    }
  }
  