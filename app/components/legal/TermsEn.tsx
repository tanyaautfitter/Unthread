import Link from "next/link";
import { site } from "@/lib/site";

export default function TermsEn() {
  const mail = <a href={`mailto:${site.email}`}>{site.email}</a>;
  return (
    <>
      <p>
        These Terms govern your use of the {site.name} website ({site.url}). By using the site, you agree to them. If
        you do not agree, please do not use the service.
      </p>

      <h2>1. Who provides the service</h2>
      <p>
        This site was created with the help of AI. It is not used for business purposes and is for informational
        purposes only. You can contact us at {mail}.
      </p>

      <h2>2. What the service does</h2>
      <p>
        {site.name} searches public Threads posts that mention the brand you enter, using Meta&apos;s official Threads
        API, and automatically determines their sentiment towards the brand: positive, negative or neutral. Artificial
        intelligence is used for the analysis.
      </p>
      <p>
        Results are based on a sample of the most recent or most popular mentions returned by the Threads API, not on all
        posts ever published. The service is free and requires no sign-up.
      </p>

      <h2>3. Who may use the service</h2>
      <p>
        The service may be used by people aged 16 or older. If you use the service on behalf of a company, you confirm
        that you are authorised to do so.
      </p>

      <h2>4. Acceptable use</h2>
      <p>You agree not to use the service to:</p>
      <ul>
        <li>send automated bulk requests (scripts, bots, scrapers) or bypass search limits;</li>
        <li>overload, hack or disrupt the site;</li>
        <li>monitor specific people, build profiles of them, or stalk, harass or threaten post authors;</li>
        <li>distribute the data obtained in violation of authors&apos; rights or Meta&apos;s terms;</li>
        <li>do anything that breaks the law of Ukraine or of the country where you are.</li>
      </ul>
      <p>We may restrict access to the service if we see such use.</p>

      <h2>5. Third-party content and trademarks</h2>
      <p>
        Posts shown by the service belong to their authors, who published them publicly on Threads. We show them with a
        link to the original and do not change their content. If you are the author of a post and do not want it to
        appear in the results, see the «Data deletion» section of the{" "}
        <Link href="/privacy#deletion">Privacy Policy</Link>.
      </p>
      <p>
        Brand names searched on the site are trademarks of their owners. Their use on the site does not imply any
        partnership with or endorsement by these companies. Threads is a trademark of Meta Platforms, Inc.;{" "}
        {site.name} is not affiliated with or endorsed by Meta.
      </p>

      <h2>6. Results</h2>
      <p>
        Sentiment is determined by artificial intelligence, so some posts may be misclassified — especially posts with
        irony, sarcasm or mixed opinions. Results are for reference only and are not professional, marketing, financial
        or legal advice. Any decisions based on them are your own.
      </p>

      <h2>7. Availability</h2>
      <p>
        The service is provided «as is». It depends on third-party services (Meta, Anthropic, the hosting provider), so
        we do not guarantee uninterrupted operation, complete results or that they will meet your expectations. We may
        change, suspend or discontinue the service or any of its features.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the extent permitted by the law of Ukraine, we are not liable for indirect losses, lost profits or the
        consequences of decisions made based on the service&apos;s results. Nothing in these Terms limits the rights you
        have as a consumer under the law.
      </p>

      <h2>9. Intellectual property</h2>
      <p>
        The site&apos;s design, texts and code belong to us. You are free to share search results and links to the site,
        but you may not copy the site itself or present it as your own.
      </p>

      <h2>10. Personal data</h2>
      <p>
        How we process data is described in the <Link href="/privacy">Privacy Policy</Link> and the{" "}
        <Link href="/cookies">Cookie Policy</Link>.
      </p>

      <h2>11. Changes to these Terms</h2>
      <p>
        We may update these Terms. The new version is published on this page with a new date. If you continue to use the
        service after changes, you accept the new version.
      </p>

      <h2>12. Governing law</h2>
      <p>These Terms are governed by the law of Ukraine. We try to resolve disputes through negotiation — email us at {mail}.</p>

      <h2>13. Contacts</h2>
      <p>Email: {mail}</p>
    </>
  );
}
