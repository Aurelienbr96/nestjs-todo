import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library';

const mockTokenPayload: TokenPayload = {
  iss: '',
  sub: 'test',
  aud: '',
  iat: 0,
  exp: 0,
  email: 'test@gmail.com',
};

const mockVerifyIdToken = ({ idToken }: { idToken: string }): Promise<LoginTicket> => {
  return new Promise((resolve, reject) => {
    console.log(idToken);
    if (idToken === 'invalid') {
      reject(new Error());
    }
    resolve({
      getPayload: (): TokenPayload => mockTokenPayload,
    } as LoginTicket);
  });
};

OAuth2Client.prototype.verifyIdToken = mockVerifyIdToken;

export { OAuth2Client };
