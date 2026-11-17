import Link from "next/link";
import { site } from "@/lib/site";

export default function CookiesEn() {
  const mail = <a href={`mailto:${site.email}`}>{site.email}</a>;
  return (
    <>
      <p className="legal-lead">
        In short: {site.name} uses a single necessary cookie to remember the language you chose. There are no analytics
        or advertising cookies, so the site has no consent banner.
      </p>

      <h2>1. What cookies are</h2>
      <p>
        Cookies are small text files that a website stores in your browser, for example to remember your language, keep
        you signed in or collect visit statistics. Browser local storage (localStorage) and similar technologies work in
        a similar way, so this Policy covers them too.
      </p>

      <h2>2. What we use</h2>
      <div className="legal-table">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Used?</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Necessary</td>
              <td>Yes, one</td>
              <td>
                <code>lang</code> — remembers the site language (Ukrainian or English). It is set only when you switch the
                language yourself in the top right corner. It lasts 1 year and contains only the language code.
              </td>
            </tr>
            <tr>
              <td>Analytics</td>
              <td>No</td>
              <td>We do not use Google Analytics or any other statistics service.</td>
            </tr>
            <tr>
              <td>Advertising and tracking</td>
              <td>No</td>
              <td>There are no ads on the site, and we do not track you on other websites.</td>
            </tr>
            <tr>
              <td>localStorage / sessionStorage</td>
              <td>No</td>
              <td>Search results live only on the page until you close it.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>3. Third parties</h2>
      <p>
        The site has no embedded widgets, pixels or third-party scripts. The «open ↗» links next to posts lead to
        Threads. When you follow them, Meta&apos;s cookie rules apply, not this Policy.
      </p>
      <p>
        The hosting provider (Vercel) may process technical request data to deliver the site and protect it from
        attacks, but does not set cookies to track visitors. See the <Link href="/privacy">Privacy Policy</Link> for
        details.
      </p>

      <h2>4. Do we need your consent?</h2>
      <p>
        No. The <code>lang</code> cookie is necessary: it stores a setting you chose yourself and does not track you.
        Such cookies do not require consent. If we ever add analytics or other cookies that require consent, we will:
      </p>
      <ul>
        <li>update this Policy with the name, purpose, type and duration of each cookie;</li>
        <li>show a banner where you can accept or reject optional cookies;</li>
        <li>not set them until you give consent.</li>
      </ul>

      <h2>5. Managing cookies</h2>
      <p>
        Any browser lets you view, block or delete cookies in its privacy settings. If you block cookies for this site, it
        will work the same way but will not remember your chosen language: it will be determined by your browser language
        and country instead.
      </p>

      <h2>6. Contacts</h2>
      <p>
        Send questions about this Policy to {mail}. How we process data in general is described in the{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
    </>
  );
}
