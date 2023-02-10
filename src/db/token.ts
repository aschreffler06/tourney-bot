import { Token } from '../models/token';
import { DateTime } from 'luxon';
import { getNewAccessToken } from '../controllers/osuController';

/**
 * Makes sure that the token is up to date. If it's not, it will change the token
 * @returns The most up to date token
 */
async function validateToken(): Promise<void> {
    // There's only one access token at a time so we can just get the first one
    const token = await Token.findById(1).exec();
    if (token) {
        const accessToken = token.token;
        const expirationTime = token.expirationTime;
        if (accessToken && expirationTime) {
            // Check if token is expired
            if (expirationTime < DateTime.utc().toSeconds()) {
                const [accessToken, expirationTime] = await getNewAccessToken();
                await Token.updateOne(
                    { _id: 1 },
                    { token: accessToken, expirationTime: expirationTime }
                );
            }
        } else {
            throw new Error('Bad things in validate');
        }
    } else {
        const [accessToken, expirationTime] = await getNewAccessToken();
        const newToken = new Token({
            _id: 1,
            token: accessToken,
            expirationTime: expirationTime
        });
        await newToken.save();
    }
}

async function getAccessToken(): Promise<string> {
    await validateToken();
    const accessToken = await Token.findById(1).exec();
    // Realistically, this should never happen since there should always be a token in the DB after validateToken is called
    if (!accessToken) {
        throw new Error('No token found');
    } else {
        if (!accessToken.token) {
            throw new Error('No token found');
        }
        return accessToken.token;
    }
}

export { validateToken, getAccessToken };
