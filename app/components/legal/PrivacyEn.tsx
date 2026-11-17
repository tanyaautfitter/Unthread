import Link from "next/link";
import { site } from "@/lib/site";

export default function PrivacyEn() {
  const mail = <a href={`mailto:${site.email}`}>{site.email}</a>;
  return (
    <>
      <p>
        This Policy explains what data the {site.name} website ({site.url}) processes. {site.name} is a service that
        finds public mentions of a brand on Threads and determines their sentiment (positive, negative or neutral). We
        collect as little data as possible: there is no sign-up, no accounts, no advertising and no tracking.
      </p>

      <h2>1. Contact</h2>
      <p>For any questions about your data, email {mail}.</p>

      <h2>2. What data we process</h2>
      <h3>2.1. Website visitors</h3>
      <ul>
        <li>
          <b>Search query</b> — the brand name you enter. It is not linked to your identity.
        </li>
        <li>
          <b>IP address</b> — used only to limit the number of searches from one address (abuse protection) and kept in
          server memory.
        </li>
        <li>
          <b>Country from IP address and browser language</b> — the hosting provider determines the country a request
          comes from, and your browser reports its preferred language. We use this only to show the site in Ukrainian or
          English and do not store it.
        </li>
        <li>
          <b>Technical request data</b> — IP address, browser type, time and page address are recorded in the hosting
          provider&apos;s logs, as on any website.
        </li>
      </ul>

      <h3>2.2. Public Threads posts</h3>
      <p>
        When you search, we retrieve public posts that mention the brand through Meta&apos;s official Threads API: the
        post text, username, link and publication time. These posts have already been published publicly by their
        authors. We show them in the results with a link to the original so the classification can be checked.
      </p>

      <h3>2.3. What we do not do</h3>
      <ul>
        <li>we do not create accounts or ask for your name, phone number or payment details;</li>
        <li>we do not build profiles of individuals or search by username;</li>
        <li>we do not sell data or share it for advertising;</li>
        <li>we do not store Threads posts in a database — only in a temporary cache (see section 6);</li>
        <li>we do not intentionally analyse special categories of data (health, religion, etc.).</li>
      </ul>

      <h2>3. Purposes and legal basis</h2>
      <div className="legal-table">
        <table>
          <thead>
            <tr>
              <th>Purpose</th>
              <th>Data</th>
              <th>Legal basis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Run the search and show the results</td>
              <td>Search query, public Threads posts</td>
              <td>Legitimate interest — providing the service you request</td>
            </tr>
            <tr>
              <td>Determine the sentiment of mentions</td>
              <td>Brand name, text of public posts</td>
              <td>Legitimate interest</td>
            </tr>
            <tr>
              <td>Show the site in the right language</td>
              <td>Country from IP address, browser language, language you selected (cookie)</td>
              <td>Legitimate interest — ease of use</td>
            </tr>
            <tr>
              <td>Protection against abuse and overload</td>
              <td>IP address, technical request data</td>
              <td>Legitimate interest — service security</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The legal bases follow Article 11 of the Law of Ukraine «On Personal Data Protection». For visitors from the EU,
        the equivalent basis is Article 6(1)(f) of Regulation (EU) 2016/679 (GDPR).
      </p>

      <h2>4. Who else processes data (processors)</h2>
      <ul>
        <li>
          <b>Vercel Inc.</b> (USA) — website hosting; receives technical request data.
        </li>
        <li>
          <b>Meta Platforms, Inc.</b> (USA) — Threads API; receives the search query (brand name) and returns public
          posts. Data is processed under Meta&apos;s Platform Terms for developers.
        </li>
        <li>
          <b>Anthropic PBC</b> (USA) — the Claude model used to determine sentiment; receives the brand name and the text
          of public posts. Under Anthropic&apos;s terms, data sent through the API is not used to train models by
          default.
        </li>
      </ul>

      <h2>5. International transfers</h2>
      <p>
        The processors listed in section 4 are located in the USA. Transfers are made in accordance with Article 29 of
        the Law of Ukraine «On Personal Data Protection», relying on the providers&apos; contractual safeguards.
      </p>

      <h2>6. Retention</h2>
      <div className="legal-table">
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Retention</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Search results (query and Threads posts) in cache</td>
              <td>up to 1 hour, then deleted automatically</td>
            </tr>
            <tr>
              <td>IP address for rate limiting</td>
              <td>up to 1 minute</td>
            </tr>
            <tr>
              <td>Selected site language (cookie in your browser)</td>
              <td>1 year or until you delete the cookie</td>
            </tr>
            <tr>
              <td>Hosting logs</td>
              <td>per hosting settings, no longer than 30 days</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="deletion">7. Data deletion and Threads posts</h2>
      <p>We do not store posts permanently, so there is no account to delete. If your post appears in the results:</p>
      <ul>
        <li>delete or hide it on Threads — it will not appear in future searches;</li>
        <li>the copy in our cache disappears automatically within 1 hour;</li>
        <li>
          to remove it immediately or to delete any other data about you, email {mail} with a link to the post — we will
          handle the request within 30 days (usually much sooner).
        </li>
      </ul>

      <h2>8. Your rights and data protection</h2>
      <p>Under Article 8 of the Law of Ukraine «On Personal Data Protection», you have the right to:</p>
      <ul>
        <li>know what data about you is processed, by whom and why;</li>
        <li>access your data;</li>
        <li>request correction or deletion of your data;</li>
        <li>object to processing;</li>
        <li>
          complain to the Ukrainian Parliament Commissioner for Human Rights or to a court (EU residents may also contact
          their data protection authority).
        </li>
      </ul>
      <p>To exercise your rights, email {mail}. We will reply within 30 days.</p>
      <p>
        To protect data, the site works only over HTTPS, API keys are kept in protected server environment variables
        and are never sent to the browser, and the service has no database of personal data. If an incident threatens
        your data, we will report it on this page and, where required, to the relevant authorities.
      </p>

      <h2>9. Children</h2>
      <p>
        The service is not intended for people under 16, and we do not knowingly collect their data. If you are using the
        site and are under 16, you must leave the site immediately.
      </p>

      <h2>10. Cookies</h2>
      <p>
        How we use cookies is described in a separate <Link href="/cookies">Cookie Policy</Link>.
      </p>

      <h2>11. Changes to this Policy</h2>
      <p>
        We may update this Policy. The new version is published on this page with a new date. Please check this page
        from time to time: by continuing to use the site, you agree to the current version.
      </p>

      <h2>12. Contacts</h2>
      <p>Email: {mail}</p>
    </>
  );
}
