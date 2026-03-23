export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <section className="page-shell-x py-16 text-center sm:py-20">
        <div className="mx-auto max-w-3xl">
          <span className="text-3xl" aria-hidden>
            📋
          </span>
          <h1 className="font-display mt-4 text-balance text-4xl font-bold text-foreground sm:text-5xl">
            Privacy (yawn, but we tried)
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            How Japan 2026 handles info when you use this little trip planner.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </section>

      <section className="page-shell-x pb-20 sm:pb-24">
        <div className="mx-auto max-w-3xl space-y-10 text-muted-foreground">
          <div>
            <h2 className="font-display mb-3 text-2xl font-bold text-foreground">
              1. What this site is
            </h2>
            <p className="leading-relaxed">
              Japan 2026 is a small web app for a private group to coordinate
              travel plans. It is not a commercial service for the general
              public.
            </p>
          </div>

          <div>
            <h2 className="font-display mb-3 text-2xl font-bold text-foreground">
              2. Information we collect
            </h2>
            <p className="leading-relaxed">
              When you sign in with Google, our authentication provider
              (Supabase) receives the identifiers needed to create and maintain
              your session—typically your Google account email and profile
              metadata they supply for login. We also store the trip content you
              add: trip names, itinerary items, and reaction choices tied to your
              user id.
            </p>
          </div>

          <div>
            <h2 className="font-display mb-3 text-2xl font-bold text-foreground">
              3. How we use it
            </h2>
            <ul className="ml-4 list-inside list-disc space-y-2">
              <li>To show you trips you are allowed to access</li>
              <li>To save itinerary ideas and your reactions for the group</li>
              <li>To keep the app secure and fix technical issues</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display mb-3 text-2xl font-bold text-foreground">
              4. Where data is processed
            </h2>
            <p className="leading-relaxed">
              Data is stored in Supabase (database and authentication) according
              to your project settings. Review Supabase and Google privacy
              policies for their roles as processors.
            </p>
          </div>

          <div>
            <h2 className="font-display mb-3 text-2xl font-bold text-foreground">
              5. Sharing
            </h2>
            <p className="leading-relaxed">
              We do not sell personal information. Trip details are visible to
              other users who have access to the same trips in the app (as
              configured in the database). We may disclose information if
              required by law.
            </p>
          </div>

          <div>
            <h2 className="font-display mb-3 text-2xl font-bold text-foreground">
              6. Cookies and storage
            </h2>
            <p className="leading-relaxed">
              Supabase authentication uses cookies (or similar) to keep you
              signed in. You can clear them from your browser to sign out.
            </p>
          </div>

          <div>
            <h2 className="font-display mb-3 text-2xl font-bold text-foreground">
              7. Children
            </h2>
            <p className="leading-relaxed">
              The app is intended for adults planning travel. It is not directed
              at children under 13.
            </p>
          </div>

          <div>
            <h2 className="font-display mb-3 text-2xl font-bold text-foreground">
              8. Changes
            </h2>
            <p className="leading-relaxed">
              We may update this page occasionally. The &quot;Last updated&quot;
              date will change when we do.
            </p>
          </div>

          <div>
            <h2 className="font-display mb-3 text-2xl font-bold text-foreground">
              9. Questions
            </h2>
            <p className="leading-relaxed">
              For privacy questions about this deployment, contact whoever
              operates this instance for your group (the trip organizer or admin
              of the Supabase project).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
