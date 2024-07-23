// import Url from 'url';
// import videoParser from 'js-video-url-parser';

// const statusIdRegex = /\/status(es)?\/(\d+)/;

// export interface EmbedUrlData {
//     provider: string;
//     id: string;
// }

// /**
//  * Get embed data from url.
//  */
// export const getEmbedUrlData = (url: string): EmbedUrlData | undefined => {
//     const videoData = videoParser.parse(url);

//     if (videoData && videoData.provider) {
//         const provider = videoData.provider;
//         const id = videoData.id;

//         return {
//             provider,
//             id,
//         };
//     }

//     const parsed = Url.parse(url);

//     if (parsed.host === 'twitter.com' || parsed.host === 'x.com') {
//         if (!parsed.path || parsed.path.indexOf('status') === -1) return;

//         const match = statusIdRegex.exec(parsed.path);
//         if (!match) return;

//         return {
//             provider: 'twitter',
//             id: match[2],
//         };
//     }

//     return undefined;
// };

// /**
//  * Get embed provider.
//  */
// export const getEmbedProvider = (url: string) => getEmbedUrlData(url)?.provider;

// /**
//  * Get embed provider.
//  */
// export const getEmbedId = (url: string) => getEmbedUrlData(url)?.id;