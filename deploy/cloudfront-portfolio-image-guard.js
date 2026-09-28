// CloudFront Function (viewer request) for cdn.thecoralroom.co.
//
// Portfolio images are only served to pages on thecoralroom.co. A copied image
// link opened in another browser, shared in a chat, or embedded on another site
// gets "403 Forbidden". Everything outside the portfolio folders (blog images,
// logos, videos) is untouched.
//
// This stops casual copying only: anyone can fake the Referer header with a
// tool like curl, and people can always screenshot or save what their browser
// shows. The web server applies the same rule to its own image resizer
// (/_next/image) in nginx-thecoralroom.conf; keep the folders in sync with it.
//
// ── Install (AWS console → CloudFront → Functions) ────────────────────────────
//  0. Give the web server (EC2) an Elastic IP and put it in SERVER_IPS below.
//     The site's resizer fetches originals from this CDN without a Referer, so
//     it is let through by IP. A normal public IP changes on stop/start, and
//     every portfolio thumbnail would then break.
//  1. Create function "portfolio-image-guard", runtime cloudfront-js-2.0,
//     paste this file into the editor, Save.
//  2. Test tab: run a viewer-request test with the URL path
//     /web/coral-room/portfolio/anything.webp, once with no headers (expect
//     403) and once with header  referer: https://www.thecoralroom.co/
//     (expect the request to pass through).
//  3. Publish tab → Publish function.
//  4. Distribution for cdn.thecoralroom.co → Behaviors → edit the behavior
//     that serves /web/* (the default "*" one if there is only one) →
//     Function associations → Viewer request → CloudFront Functions →
//     portfolio-image-guard → Save changes. Wait for "Deploying" to finish.
//  5. Check from a terminal (use any real portfolio image):
//       curl -I https://cdn.thecoralroom.co/web/coral-room/portfolio/<file>.webp
//         → 403
//       curl -I -H "Referer: https://www.thecoralroom.co/" <same URL>
//         → 200
//     and open thecoralroom.co/portfolio: every thumbnail must still show.
//
// Undo: remove the function association from the behavior (step 4).
//
// If a CDN is ever put in front of www.thecoralroom.co too, it must not cache
// /_next/image responses for everyone, or it would bypass the site's check.

var PROTECTED_FOLDERS = ['/coral-room/portfolio/', '/images/portfolio/', '/images/featured/'];

// The apex, www and any other subdomain count as our own site; localhost is
// for `next dev` on a laptop.
var SITE_DOMAIN = 'thecoralroom.co';
var DEV_HOSTS = ['localhost', '127.0.0.1'];

// Public IP(s) of the web server (Elastic IP). Add its IPv6 address too if the
// instance has one.
var SERVER_IPS = ['3.133.29.248'];

// Link-preview crawlers, so a shared thecoralroom.co project link still shows
// its picture in WhatsApp, Facebook, LinkedIn, etc. Search engines are not in
// the list, so portfolio images stay out of image search.
var PREVIEW_BOTS = /facebookexternalhit|facebookcatalog|Facebot|WhatsApp|LinkedInBot|Twitterbot|TelegramBot|Slackbot|Discordbot|Pinterest|SkypeUriPreview|redditbot/i;

function isProtected(uri) {
  var path;
  try {
    // Decoded so an encoded spelling ("%70ortfolio") can't slip past; S3
    // decodes the key the same way.
    path = decodeURIComponent(uri);
  } catch (e) {
    return true;
  }
  for (var i = 0; i < PROTECTED_FOLDERS.length; i++) {
    if (path.indexOf(PROTECTED_FOLDERS[i]) !== -1) return true;
  }
  return false;
}

function refererHost(headers) {
  if (!headers.referer) return '';
  var match = /^[a-z][a-z0-9+.-]*:\/\/([^\/?#:]+)/i.exec(headers.referer.value);
  return match ? match[1].toLowerCase() : '';
}

function isOwnSite(host) {
  if (!host) return false;
  if (DEV_HOSTS.indexOf(host) !== -1) return true;
  if (host === SITE_DOMAIN) return true;
  var suffix = '.' + SITE_DOMAIN;
  return host.length > suffix.length && host.slice(-suffix.length) === suffix;
}

function handler(event) {
  var request = event.request;
  if (!isProtected(request.uri)) return request;

  var headers = request.headers;
  if (isOwnSite(refererHost(headers))) return request;
  if (SERVER_IPS.indexOf(event.viewer.ip) !== -1) return request;
  if (headers['user-agent'] && PREVIEW_BOTS.test(headers['user-agent'].value)) return request;

  return {
    statusCode: 403,
    statusDescription: 'Forbidden',
    headers: { 'cache-control': { value: 'no-store' } },
  };
}
