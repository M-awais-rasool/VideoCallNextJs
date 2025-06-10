import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identity, roomName } = body;
    
    if (!identity || !roomName) {
      return NextResponse.json(
        { error: 'Identity and room name are required' },
        { status: 400 }
      );
    }

    // Get environment variables with explicit validation
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;

    // Validate environment variables
    if (!accountSid || !apiKey || !apiSecret) {
      console.error('Missing Twilio credentials in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: Missing credentials' },
        { status: 500 }
      );
    }

    console.log(`Generating token for identity: ${identity}, room: ${roomName}`);
    
    const AccessToken = twilio.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;

    // Create an access token with explicit parameters
    const token = new AccessToken(
      accountSid,
      apiKey,
      apiSecret,
      { identity: identity.toString() }  // Ensure identity is a string
    );

    // Create a video grant and add it to the token
    const videoGrant = new VideoGrant({ room: roomName });
    token.addGrant(videoGrant);

    const tokenString = token.toJwt();
    console.log('Token generated successfully');
    
    // Serialize the token and return it
    return NextResponse.json({ token: tokenString });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json(
      { error: 'Failed to generate token: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
