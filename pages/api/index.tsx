import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const config = {
  runtime: 'edge',
};

// Helper function to decode query parameters
function decodeQueryValue(value) {
  return decodeURIComponent(value.replace(/\+/g, ' '));
}

export default async function handler(req: NextRequest) {
  const DEFAULT_TITLE = 'Mrinal Chandra Sarkar';
  const DEFAULT_DESCRIPTION =
    'Statistician, analyst and open source enthusiast from Kolkata, India.';
  const DEFAULT_AVATAR = 'https://og.anuragroy.dev/memoji.png';
  const DEFAULT_AUTHOR = 'mrinal.tk';
  const DEFAULT_THEME = 'rose';

  const [satoshi, clashDisplay, aloeVera] = await Promise.all([
    getSatoshi,
    getClashDisplay,
    getAloeVera,
  ]);

  // Use the original URL to decode query parameters
  const { searchParams } = new URL(req.url);

  // Helper function to get query parameter, handling both &amp; and &
  function getQueryParam(paramName, defaultValue) {
    const value = searchParams.get(paramName);
    return value ? decodeQueryValue(value) : defaultValue;
  }

  // get content from query params
  const title = getQueryParam('title', DEFAULT_TITLE);
  const description = getQueryParam('description', DEFAULT_DESCRIPTION);
  const avatar = getQueryParam('avatar', DEFAULT_AVATAR);
  const author = getQueryParam('author', DEFAULT_AUTHOR);
  const logo = getQueryParam('logo', null);
  const theme = getQueryParam('theme', DEFAULT_THEME);

  return new ImageResponse(
    (
      <div
        tw={`h-full w-full px-20 py-16 bg-${theme}-200 flex flex-col justify-between`}
      >
        <h1 tw="text-8xl leading-none" style={{ fontFamily: 'ClashDisplay' }}>
          {title}
        </h1>
        <p
          tw="mb-16 text-5xl text-gray-900 leading-tight"
          style={{ fontFamily: 'Satoshi' }}
        >
          {description}
        </p>
        <div tw="w-full flex flex-row items-center">
          {avatar?.startsWith('http') ? (
            <img
              src={avatar}
              tw={`mr-4 h-14 w-14 bg-${theme}-300 rounded-full`}
            />
          ) : (
            <span tw="mr-4 text-5xl">{avatar}</span>
          )}
          <span
            tw={`text-5xl text-${theme}-600 mr-auto`}
            style={{ fontFamily: 'AloeVera' }}
          >
            {author}
          </span>
          {logo?.startsWith('http') ? (
            <img src={logo} tw="h-14 w-14" />
          ) : (
            <span tw="text-5xl">{logo}</span>
          )}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Satoshi',
          data: satoshi,
        },
        {
          name: 'ClashDisplay',
          data: clashDisplay,
        },
        {
          name: 'AloeVera',
          data: aloeVera,
        },
      ],
    }
  );
}
